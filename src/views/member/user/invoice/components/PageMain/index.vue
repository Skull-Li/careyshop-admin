<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-permission="'/member/user/invoice/add'">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增信息</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-table
      :data="currentTableData"
      :highlight-current-row="true">
      <el-table-column
        label="发票抬头"
        prop="head"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="发票类型"
        prop="type"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{typeMap[scope.row.type]}}
        </template>
      </el-table-column>

      <el-table-column
        label="开票内容"
        prop="content"
        align="center">
        <template slot-scope="scope">
          {{contentMap[scope.row.content]}}
        </template>
      </el-table-column>

      <el-table-column
        label="纳税人识别码"
        prop="tax"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="开户银行"
        prop="bank"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="开户账号"
        prop="account"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="场所地址"
        prop="address"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="固定电话"
        prop="phone"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="收票邮箱"
        prop="email"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <el-button
            v-permission="'/member/user/invoice/del'"
            @click="handleDelete(scope.$index)"
            size="small"
            type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="创建信息"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="760px">
      <el-form
        :model="dialogForm"
        :rules="getDialogRules()"
        ref="form"
        label-width="110px">
        <el-form-item
          label="发票抬头"
          prop="head">
          <el-input
            v-model="dialogForm.head"
            placeholder="请输入发票抬头"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="发票类型"
          prop="type">
          <el-radio-group v-model="dialogForm.type">
            <el-radio
              v-for="(item, index) in typeMap"
              :key="index"
              :label="index">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="开票内容"
          prop="content">
          <el-radio-group v-model="dialogForm.content">
            <el-radio
              v-for="(item, index) in contentMap"
              :key="index"
              :label="index">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.type !== '0'"
          label="纳税人识别码"
          prop="tax">
          <el-input
            v-model="dialogForm.tax"
            placeholder="请输入纳税人识别码"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.type !== '0'"
          label="开户银行"
          prop="bank">
          <el-input
            v-model="dialogForm.bank"
            placeholder="请输入开户银行"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.type !== '0'"
          label="开户账号"
          prop="account">
          <el-input
            v-model="dialogForm.account"
            placeholder="请输入开户账号"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.type !== '0'"
          label="场所地址"
          prop="address">
          <el-input
            v-model="dialogForm.address"
            placeholder="请输入场所地址"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          v-if="dialogForm.type !== '0'"
          label="固定电话"
          prop="phone">
          <el-input
            v-model="dialogForm.phone"
            placeholder="请输入固定电话"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="收票邮箱"
          prop="email">
          <el-input
            v-model="dialogForm.email"
            placeholder="请输入收票邮箱"
            :clearable="true"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="create"
          size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUserInvoiceItem,
  delUserInvoiceList,
  checkUserInvoiceMaximum
} from '@/api/user/invoice'

export default {
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
      typeMap: {
        0: '个人/非企业增值税普通发票',
        1: '企业增值税普通发票',
        2: '企业增值税专用发票'
      },
      contentMap: {
        0: '明细',
        1: '类别'
      },
      currentTableData: [],
      dialogForm: {},
      dialogLoading: false,
      dialogVisible: false
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val
      }
    }
  },
  methods: {
    // 获取验证规则
    getDialogRules() {
      let rules = {
        head: [
          {
            required: true,
            message: '发票抬头不能为空',
            trigger: 'blur'
          },
          {
            max: 128,
            message: '发票抬头不能大于 128 个字符',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '发票类型不能为空',
            trigger: 'change'
          }
        ],
        content: [
          {
            required: true,
            message: '开票内容不能为空',
            trigger: 'change'
          }
        ],
        email: [
          {
            required: true,
            message: '收票邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          },
          {
            max: 128,
            message: '收票邮箱不能大于 128 个字符',
            trigger: 'blur'
          }
        ]
      }

      if (this.dialogForm.type !== '0') {
        rules.tax = [
          {
            required: true,
            message: '纳税人识别码不能为空',
            trigger: 'blur'
          },
          {
            max: 128,
            message: '纳税人识别码不能大于 128 个字符',
            trigger: 'blur'
          }
        ]
      }

      if (this.dialogForm.type === '2') {
        rules.bank = [
          {
            required: true,
            message: '开户银行不能为空',
            trigger: 'blur'
          },
          {
            max: 64,
            message: '开户银行不能大于 64 个字符',
            trigger: 'blur'
          }
        ]

        rules.account = [
          {
            required: true,
            message: '开户账号不能为空',
            trigger: 'blur'
          },
          {
            max: 64,
            message: '开户账号不能大于 64 个字符',
            trigger: 'blur'
          }
        ]

        rules.address = [
          {
            required: true,
            message: '场所地址不能为空',
            trigger: 'blur'
          },
          {
            max: 128,
            message: '场所地址不能大于 128 个字符',
            trigger: 'blur'
          }
        ]

        rules.phone = [
          {
            required: true,
            message: '固定电话不能为空',
            trigger: 'blur'
          },
          {
            max: 64,
            message: '固定电话不能大于 64 个字符',
            trigger: 'blur'
          }
        ]
      }

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })

      return rules
    },
    // 请求删除
    handleDelete(index) {
      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          delUserInvoiceList(
            this.$route.params.client_id,
            [this.currentTableData[index].user_invoice_id]
          )
            .then(() => {
              this.currentTableData.splice(index, 1)
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 创建信息
    handleCreate() {
      const client_id = this.$route.params.client_id
      checkUserInvoiceMaximum(client_id)
        .then(() => {
          this.dialogForm = {
            client_id,
            type: '0',
            content: '1'
          }

          this.$nextTick(() => {
            if (this.$refs.form) {
              this.$refs.form.clearValidate()
            }

            this.dialogLoading = false
            this.dialogVisible = true
          })
        })
        .catch(() => {
          this.dialogVisible = false
        })
    },
    // 请求创建
    create() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }

        this.dialogLoading = true
        addUserInvoiceItem(this.dialogForm)
          .then(res => {
            this.currentTableData.push(res.data)
            this.dialogVisible = false
            this.$message.success('操作成功')
          })
          .catch(() => {
            this.dialogLoading = false
          })
      })
    }
  }
}
</script>
