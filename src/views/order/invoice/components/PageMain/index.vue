<template>
  <div class="cs-p">
    <el-tabs
      v-model="tabPane"
      class="tab-box"
      @tab-click="tab => {$emit('tabs', tab.name)}">
      <el-tab-pane
        v-for="(item, index) in statusMap"
        :key="index"
        :name="index"
        :label="item.text">
        <el-table
          v-if="index === tabPane"
          :data="currentTableData"
          @sort-change="sortChange">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="发票抬头">
                  <span>{{props.row.get_invoice.head}}</span>
                </el-form-item>

                <el-form-item label="发票类型">
                  <span>{{typeMap[props.row.get_invoice.type]}}</span>
                </el-form-item>

                <el-form-item label="纳税人识别码">
                  <span>{{props.row.get_invoice.tax}}</span>
                </el-form-item>

                <el-form-item label="发票内容">
                  <span>{{contentMap[props.row.get_invoice.content]}}</span>
                </el-form-item>

                <el-form-item label="开户银行">
                  <span>{{props.row.get_invoice.bank}}</span>
                </el-form-item>

                <el-form-item label="开户账号">
                  <span>{{props.row.get_invoice.account}}</span>
                </el-form-item>

                <el-form-item label="场所地址">
                  <span>{{props.row.get_invoice.address}}</span>
                </el-form-item>

                <el-form-item label="固定电话">
                  <span>{{props.row.get_invoice.phone}}</span>
                </el-form-item>

                <el-form-item label="收票邮箱">
                  <span>{{props.row.get_invoice.email}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column label="订单号" width="240">
            <template slot-scope="scope">
              <span
                @click="handleOrder(scope.row.order_no)"
                class="link">{{scope.row.order_no}}</span>
            </template>
          </el-table-column>

          <el-table-column label="订单金额">
            <template slot-scope="scope">
              <span>{{scope.row.order_amount | getNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column label="开票金额">
            <template slot-scope="scope">
              <span>{{scope.row.invoice_amount | getNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column label="开票税率">
            <template slot-scope="scope">
              <span>{{scope.row.premium | getNumber}} %</span>
            </template>
          </el-table-column>

          <el-table-column
            label="状态"
            prop="status"
            align="center"
            min-width="100">
            <template slot-scope="scope">
              <el-tag
                :type="statusMap[scope.row.status + 1].type"
                effect="plain"
                size="mini">
                {{statusMap[scope.row.status + 1].text}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="创建日期"
            prop="create_time"
            align="center"
            width="160"
            sortable="custom">
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                v-if="auth.set && !scope.row.status"
                @click="handleUpdate(scope.$index)"
                size="small"
                type="text">处理</el-button>

              <el-button
                v-else-if="auth.get"
                @click="handleUpdate(scope.$index)"
                size="small"
                type="text">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="(!isUpdate ? '查看' : '处理') + '票据'"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        :model="dialogForm"
        :rules="dialogRules"
        ref="form"
        label-width="80px">
        <el-form-item
          label="发票编号"
          prop="number">
          <el-input
            v-model="dialogForm.number"
            placeholder="请输入发票编号"
            :disabled="!isUpdate"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="发票备注"
          prop="remark">
          <el-input
            v-model="dialogForm.remark"
            placeholder="请输入发票备注"
            type="textarea"
            :autosize="{minRows: 3}"
            :show-word-limit="true"
            :disabled="!isUpdate"
            maxlength="255">
          </el-input>
        </el-form-item>

        <el-form-item
          label="发票状态"
          prop="status">
          <el-radio-group
            v-model="dialogForm.status"
            :disabled="!isUpdate">
            <el-radio :label="0">待开票</el-radio>
            <el-radio :label="1">已开票</el-radio>
            <el-radio :label="2">异常单</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-show="dialogForm.status === 1"
          label="发票附件"
          prop="attachment">
          <cs-upload
            v-if="dialogVisible"
            v-model="dialogForm.attachment"
            :file-list="uploadTemp"
            :disabled="!isUpdate"
            list-type="text"
            type="comp"
            accept="*">
          </cs-upload>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.status === 1 && dialogForm.attachment.length && isUpdate"
          label="通知方式"
          prop="send_email">
          <el-radio-group v-model="dialogForm.send_email">
            <el-radio :label="1">系统邮件</el-radio>
            <el-radio :label="0">其他工具</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small">取消</el-button>

        <el-button
          v-if="auth.set && isUpdate"
          type="primary"
          :loading="dialogLoading"
          @click="update"
          size="small">确定</el-button>

        <el-button
          v-else-if="auth.reset"
          type="danger"
          :loading="dialogLoading"
          @click="handleReset"
          size="small">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
import { resetInvoiceItem, setInvoiceItem } from '@/api/order/invoice'

export default {
  components: {
    csUpload: () => import('@/careyshop/cs-upload')
  },
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    }
  },
  data() {
    return {
      auth: {
        get: false,
        set: false,
        reset: false
      },
      statusMap: {
        0: {
          text: '全部'
        },
        1: {
          text: '待开票',
          type: 'info'
        },
        2: {
          text: '已开票',
          type: 'success'
        },
        3: {
          text: '异常单',
          type: 'danger'
        }
      },
      typeMap: {
        0: '个人/非企业增值税普通发票',
        1: '企业增值税普通发票',
        2: '企业增值税专用发票'
      },
      contentMap: {
        0: '明细',
        1: '类别'
      },
      tabPane: 0,
      isUpdate: false,
      currentTableData: [],
      uploadTemp: [],
      dialogForm: {},
      dialogVisible: false,
      dialogLoading: false,
      dialogRules: {
        number: [
          {
            max: 32,
            message: '长度不能大于 32 个字符',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          }
        ],
        send_email: [
          {
            required: true,
            message: '请至少选择一个通知方式',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val
      },
      immediate: true
    }
  },
  filters: {
    getNumber(val) {
      return util.getNumber(val)
    }
  },
  mounted() {
    this._validationAuth()
  },
  methods: {
    // 验证权限
    _validationAuth() {
      this.auth.get = this.$permission('/order/service/invoice/get')
      this.auth.set = this.$permission('/order/service/invoice/set')
      this.auth.reset = this.$permission('/order/service/invoice/reset')
    },
    // 排序字段
    sortChange({ column, prop, order }) {
      let sort = {
        order_type: undefined,
        order_field: undefined
      }

      if (column && order) {
        sort.order_type = order === 'ascending' ? 'asc' : 'desc'
        sort.order_field = prop
      }

      this.$emit('sort', sort)
    },
    // 查看订单
    handleOrder(order_no) {
      this.$router.push({
        name: 'order-admin-info',
        params: { order_no }
      })
    },
    // 编辑票据
    handleUpdate(index) {
      this.currentIndex = index
      const data = this.currentTableData[index]

      this.isUpdate = data.status === 0
      this.dialogForm = { ...data }
      this.uploadTemp = this.dialogForm.attachment

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.dialogLoading = false
        this.dialogVisible = true
      })
    },
    // 请求编辑
    update() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }

        this.dialogLoading = true
        const index = this.currentIndex

        // 处理开票附件
        let attachment = []
        if (this.dialogForm.status === 1) {
          this.dialogForm.attachment.forEach(value => {
            if (value.status === 'success' && value.response) {
              if (value.response.data.length > 0) {
                attachment.push({
                  name: value.response.data[0].name,
                  url: value.response.data[0].url,
                  type: value.response.data[0].type
                })
              }
            }
          })
        }

        setInvoiceItem({ ...this.dialogForm, attachment })
          .then(res => {
            if (this.tabPane !== '0' && this.dialogForm.status !== 0) {
              this.currentTableData.splice(index, 1)
              if (this.currentTableData.length <= 0) {
                this.$emit('refresh', true)
              }
            } else {
              this.$set(this.currentTableData, index, {
                ...this.currentTableData[index],
                ...res.data
              })
            }

            this.dialogVisible = false
            this.$message.success('操作成功')
          })
          .catch(() => {
            this.dialogLoading = false
          })
      })
    },
    // 重置票据
    handleReset() {
      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(async() => {
          await this.reset(this.currentIndex)
        })
        .catch(() => {
        })
    },
    // 请求重置
    async reset(index) {
      const data = this.currentTableData[index]
      this.dialogLoading = true

      resetInvoiceItem(data.invoice_id)
        .then(res => {
          if (this.tabPane === '0') {
            this.$set(this.currentTableData, index, {
              ...data,
              ...res.data
            })
          } else {
            this.currentTableData.splice(index, 1)
            if (this.currentTableData.length <= 0) {
              this.$emit('refresh', true)
            }
          }

          this.dialogVisible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.dialogLoading = false
        })
    }
  }
}
</script>

<style scoped>
.link:hover {
  cursor: pointer;
  color: #409EFF;
  text-decoration: underline;
}

.tab-box {
  padding: 5px 10px;
  background-color: #FFF;
}

.table-expand {
  font-size: 0;
  padding: 0 10px;
}

.table-expand >>> label {
  float: left;
  width: 120px;
  color: #99A9BF;
}

.table-expand >>> .el-form-item__content {
  display: block;
  padding-left: 120px;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
