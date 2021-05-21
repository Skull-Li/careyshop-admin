<template>
  <cs-container>
    <div class="cs-p">
      <el-form :inline="true" size="small">
        <el-form-item v-if="auth.add">
          <el-button
            icon="el-icon-plus"
            :disabled="loading"
            @click="handleCreate">新增模板</el-button>
        </el-form-item>

        <el-form-item>
          <el-button-group>
            <el-button
              v-if="auth.enable"
              icon="el-icon-check"
              :disabled="loading"
              @click="handleStatus(null, 1, true)">启用</el-button>

            <el-button
              v-if="auth.disable"
              icon="el-icon-close"
              :disabled="loading"
              @click="handleStatus(null, 0, true)">禁用</el-button>
          </el-button-group>
        </el-form-item>

        <el-form-item v-if="auth.del">
          <el-button
            icon="el-icon-delete"
            :disabled="loading"
            @click="handleDelete(null)">删除</el-button>
        </el-form-item>

        <cs-help
          :router="$route.path"
          style="padding-bottom: 19px;">
        </cs-help>
      </el-form>

      <el-tabs
        v-model="tabsType"
        class="tab-box"
        @tab-click="handleSubmit">
        <el-tab-pane
          v-for="(item, index) in tabsMap"
          :key="index"
          :label="item"
          :name="index">
          <el-table
            v-if="index === tabsType"
            :data="tableData"
            :highlight-current-row="true"
            @selection-change="val => {selection = val}">
            <el-table-column align="center" type="selection" width="55"/>

            <el-table-column
              label="事件/名称"
              prop="name"
              min-width="500">
            </el-table-column>

            <el-table-column
              label="状态"
              prop="status"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="statusMap[scope.row.status].type"
                  :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
                  :effect="auth.enable || auth.disable ? 'light' : 'plain'"
                  @click.native="handleStatus(scope.$index)">
                  {{statusMap[scope.row.status].text}}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              min-width="100">
              <template slot-scope="scope">
                <el-button
                  v-if="auth.set"
                  @click="handleUpdate(scope.$index)"
                  size="small"
                  type="text">编辑</el-button>

                <el-button
                  v-if="auth.del"
                  @click="handleDelete(scope.$index)"
                  size="small"
                  type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        @close="variableList = []"
        width="760px">
        <el-form
          :model="dialogForm"
          :rules="dialogRules"
          label-width="90px"
          ref="form">
          <el-form-item
            label="事件选择"
            prop="notice_event_id">
            <el-cascader
              v-model="dialogForm.notice_event_id"
              placeholder="请选择触发事件"
              style="width: 100%;"
              ref="cascader"
              :disabled="dialogStatus === 'update'"
              :options="eventList"
              :props="eventProps"
              :clearable="true"
              @change="changeVariable">
            </el-cascader>
          </el-form-item>

          <template v-if="tabsType === 'sms'">
            <el-form-item
              label="模板编号"
              prop="code">
              <el-input
                v-model="dialogForm.code"
                placeholder="阿里云短信模板编号"
                :clearable="true"/>
            </el-form-item>

            <el-form-item
              label="短信签名"
              prop="sign">
              <el-input
                v-model="dialogForm.sign"
                placeholder="阿里云短信签名"
                :clearable="true"/>
            </el-form-item>
          </template>

          <el-form-item
            v-if="tabsType === 'email'"
            label="邮件标题"
            prop="title">
            <el-input
              v-model="dialogForm.title"
              placeholder="请输入邮件标题"
              :clearable="true"/>
          </el-form-item>

          <el-form-item
            label="模板内容"
            prop="template">
            <div class="cs-mb-10">
              <el-tag
                v-for="(item, index) in variableList"
                :key="index"
                :disable-transitions="true"
                class="cs-cp cs-mr-10"
                effect="plain"
                @click="insertVariables(item.item_name)">
                {{item.item_name}}
              </el-tag>
            </div>

            <template v-if="tabsType === 'sms'">
              <el-input
                v-model="dialogForm.template"
                type="textarea"
                placeholder="请输入模板内容"
                :autosize="{minRows: 5}"
                :show-word-limit="true"
                maxlength="500"
                ref="textarea"/>

              <el-button
                type="text"
                @click="copyAliyunSms">复制阿里云短信模板</el-button>
            </template>

            <cs-tinymce
              v-else-if="dialogVisible"
              v-model="dialogForm.template"
              :height="180"
              ref="tinymce"/>
          </el-form-item>

          <el-form-item
            label="状态"
            prop="status">
            <el-switch
              v-model="dialogForm.status"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button
            @click="dialogVisible = false"
            size="small">取消</el-button>

          <el-button
            v-if="dialogStatus === 'create'"
            type="primary"
            :loading="dialogLoading"
            @click="create"
            size="small">确定</el-button>

          <el-button
            v-else
            type="primary"
            :loading="dialogLoading"
            @click="update"
            size="small">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </cs-container>
</template>

<script>
import {
  getNoticeEvent,
  getNoticeVariable,
  getNoticeList,
  addNoticeItem,
  setNoticeItem,
  setNoticeStatus,
  delNoticeList
} from '@/api/message/notice'
import util from '@/utils/util'
import * as clipboard from 'clipboard-polyfill'

export default {
  name: 'setting-setting-notice',
  components: {
    csTinymce: () => import('@/careyshop/cs-tinymce')
  },
  data() {
    return {
      loading: true,
      auth: {
        add: false,
        set: false,
        del: false,
        enable: false,
        disable: false
      },
      selection: [],
      tableData: [],
      eventList: [],
      eventProps: {
        value: 'notice_event_id',
        label: 'name',
        children: 'children',
        emitPath: false
      },
      variableList: [],
      tabsType: 'sms',
      tabsMap: {
        sms: '短信模板',
        email: '邮件模板'
      },
      statusMap: {
        0: {
          text: '禁用',
          type: 'danger'
        },
        1: {
          text: '启用',
          type: 'success'
        },
        2: {
          text: '...',
          type: 'info'
        }
      },
      textMap: {
        update: '编辑模板',
        create: '新增模板'
      },
      dialogForm: {},
      dialogStatus: '',
      dialogLoading: false,
      dialogVisible: false,
      dialogRules: {
        notice_event_id: [
          {
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '阿里云短信模板编号不能为空',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '长度不能大于 20 个字符',
            trigger: 'blur'
          }
        ],
        sign: [
          {
            required: true,
            message: '阿里云短信签名不能为空',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 12,
            message: '长度在 2 到 12 个字符',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '邮件标题不能为空',
            trigger: 'blur'
          },
          {
            max: 200,
            message: '长度不能大于 200 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this._validationAuth()
    getNoticeEvent()
      .then(res => {
        this.eventList = util.formatDataToTree(res.data, 'notice_event_id')
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  methods: {
    // 验证权限
    _validationAuth() {
      this.auth.add = this.$permission('/setting/setting/notice/add')
      this.auth.set = this.$permission('/setting/setting/notice/set')
      this.auth.del = this.$permission('/setting/setting/notice/del')
      this.auth.enable = this.$permission('/setting/setting/notice/enable')
      this.auth.disable = this.$permission('/setting/setting/notice/disable')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.selection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.notice_id)
        })
      } else {
        idList.push(this.tableData[val].notice_id)
      }

      return idList
    },
    // 请求获取数据
    handleSubmit() {
      this.loading = true
      getNoticeList({ place_id: 0, type: this.tabsType })
        .then(res => {
          this.tableData = res.data || []
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 批量设置状态
    handleStatus(val, status = 0, confirm = false) {
      let notice_id = this._getIdList(val)
      if (notice_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(notice_id, status, vm) {
        setNoticeStatus(notice_id, status)
          .then(() => {
            vm.tableData.forEach((value, index) => {
              if (notice_id.indexOf(value.notice_id) !== -1) {
                vm.$set(vm.tableData, index, {
                  ...value,
                  status
                })
              }
            })

            vm.$message.success('操作成功')
          })
      }

      if (!confirm) {
        let oldData = this.tableData[val]
        const newStatus = oldData.status ? 0 : 1

        if (oldData.status > 1) {
          return
        }

        // 禁用权限检测
        if (newStatus === 0 && !this.auth.disable) {
          return
        }

        // 启用权限检测
        if (newStatus === 1 && !this.auth.enable) {
          return
        }

        this.$set(this.tableData, val, { ...oldData, status: 2 })
        setStatus(notice_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(notice_id, status, this)
        })
        .catch(() => {
        })
    },
    // 编辑模板
    handleUpdate(index) {
      this.currentIndex = index
      const data = this.tableData[index]

      this.dialogForm = {
        ...data,
        ...data.expand
      }

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.dialogStatus = 'update'
        this.changeVariable(data.notice_event_id)

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

        let form = {
          notice_id: this.dialogForm.notice_id,
          expand: { template: this.dialogForm.template },
          status: this.dialogForm.status
        }

        // 调整模板配置
        switch (this.tabsType) {
          case 'sms':
            form.expand.code = this.dialogForm.code
            form.expand.sign = this.dialogForm.sign
            break

          case 'email':
            form.expand.title = this.dialogForm.title
            break
        }

        this.dialogLoading = true
        setNoticeItem(form)
          .then(res => {
            this.$set(
              this.tableData,
              this.currentIndex,
              {
                ...this.tableData[this.currentIndex],
                ...res.data
              }
            )

            this.dialogVisible = false
            this.$message.success('操作成功')
          })
          .catch(() => {
            this.dialogLoading = false
          })
      })
    },
    // 批量删除模板
    handleDelete(val) {
      let notice_id = this._getIdList(val)
      if (notice_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          delNoticeList(notice_id)
            .then(() => {
              util.deleteDataList(this.tableData, notice_id, 'notice_id')
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 变更可选变量
    changeVariable(val) {
      if (!val && this.dialogStatus === 'create') {
        return
      }

      getNoticeVariable(val)
        .then(res => {
          this.variableList = res.data || []
        })
    },
    // 插入变量到文本框
    insertVariables(val) {
      if (this.tabsType === 'email' && this.$refs.tinymce) {
        this.$refs.tinymce.handleEditor.insertContent(val)
      }

      if (this.tabsType === 'sms' && this.$refs.textarea) {
        this.$refs.textarea.focus()
        const obj = this.$refs.textarea.$el.children[0]

        if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          const startPos = obj.selectionStart
          const endPos = obj.selectionEnd
          const tmpStr = this.dialogForm.template

          this.dialogForm.template = tmpStr.substring(0, startPos) + val + tmpStr.substring(endPos, tmpStr.length)
        } else {
          this.dialogForm.template += val
        }
      }
    },
    // 复制阿里云短信模板
    copyAliyunSms() {
      let template = this.dialogForm.template
      this.variableList.forEach(value => {
        const regexp = new RegExp(value.item_name, 'g')
        template = template.replace(regexp, `\${${value.replace_name}}`)
      })

      clipboard.writeText(template)
        .then(() => {
          this.$message.success('已复制阿里云短信模板到剪贴板')
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 新增模板
    handleCreate() {
      this.dialogForm = {
        template: '',
        status: 0
      }

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.dialogStatus = 'create'
        this.dialogLoading = false
        this.dialogVisible = true
      })
    },
    // 请求新增
    create() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }

        this.dialogLoading = true
        const node = this.$refs.cascader.getCheckedNodes()

        // 组合请求数据
        let form = {
          place_id: 0,
          notice_event_id: this.dialogForm.notice_event_id,
          platform: 'system',
          type: this.tabsType,
          name: node[0].pathLabels.join('/'),
          expand: { template: this.dialogForm.template },
          status: this.dialogForm.status
        }

        // 调整模板配置
        switch (this.tabsType) {
          case 'sms':
            form.expand.code = this.dialogForm.code
            form.expand.sign = this.dialogForm.sign
            break

          case 'email':
            form.expand.title = this.dialogForm.title
            break
        }

        addNoticeItem(form)
          .then(res => {
            this.tableData.unshift({ ...res.data })
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

<style scoped>
.tab-box {
  padding: 5px 10px;
  background-color: #FFF;
}
</style>
