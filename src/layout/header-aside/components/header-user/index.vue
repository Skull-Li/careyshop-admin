<template>
  <el-dropdown class="cs-mr" :show-timeout="50">
    <span class="btn-text">
      <el-badge :hidden="!unreadMessage" :value="unreadMessage" :max="99">
        {{info.name ? '您好' : '未登录'}}
        <span class="username">{{info.name}}</span>
      </el-badge>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="$open('/')" icon="el-icon-link">打开前台</el-dropdown-item>
      <el-dropdown-item @click.native="resetMenu" icon="el-icon-refresh">重载菜单</el-dropdown-item>
      <el-dropdown-item @click.native="clearHistory" icon="el-icon-time">清空历史</el-dropdown-item>
      <el-dropdown-item v-if="auth.cache" @click.native="clearCache" icon="el-icon-delete">清除缓存</el-dropdown-item>
      <el-dropdown-item v-if="auth.optimize" @click.native="systemOptimize" icon="el-icon-finished">优化系统</el-dropdown-item>
      <el-dropdown-item v-if="auth.report && $env === 'production'" @click.native="openReport" icon="el-icon-data-analysis">构建分析</el-dropdown-item>
      <el-dropdown-item v-if="auth.restAPI" @click.native="openRestAPI" icon="el-icon-setting">API 调试</el-dropdown-item>
      <el-dropdown-item divided @click.native="handleCreate" icon="el-icon-key">修改密码</el-dropdown-item>
      <el-dropdown-item v-if="auth.unread" @click.native="handleMessage" icon="el-icon-bell">
        <span>未读消息</span>
        <el-badge :hidden="!unreadMessage" :value="unreadMessage" :max="99"/>
      </el-dropdown-item>
      <el-dropdown-item divided @click.native="logOff" icon="el-icon-switch-button">退出账号</el-dropdown-item>
    </el-dropdown-menu>

    <el-dialog
      title="修改密码"
      width="600px"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false">
      <el-form
        :model="form"
        :rules="rules"
        ref="dataForm"
        label-width="80px">
        <el-form-item
          label="原始密码"
          prop="passwordOld">
          <el-input
            v-model="form.passwordOld"
            @keyup.enter.native="setPassword()"
            type="password"
            placeholder="原始密码"
            :clearable="true"/>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="password">
          <el-input
            v-model="form.password"
            @keyup.enter.native="setPassword()"
            type="password"
            placeholder="新密码"
            :clearable="true"/>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="passwordConfirm">
          <el-input
            v-model="form.passwordConfirm"
            @keyup.enter.native="setPassword()"
            type="password"
            placeholder="确认密码"
            :clearable="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click.native="dialogVisible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="dialogLoading"
          @click.native="setPassword"
          size="small">确定</el-button>
      </div>
    </el-dialog>
  </el-dropdown>
</template>

<script>
import menu from '@/menu'
import util from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { clearCacheAll, setSystemOptimize } from '@/api/index'
import { setAdminPassword } from '@/api/user/admin'
import { getMessageUserUnread } from '@/api/message/message'
import { getMenuAuthList } from '@/api/auth/menu'
import { getSettingList } from '@/api/config/setting'

export default {
  data() {
    return {
      timer: null,
      dialogVisible: false,
      dialogLoading: false,
      form: {
        password: '',
        passwordConfirm: '',
        passwordOld: ''
      },
      auth: {
        cache: false,
        optimize: false,
        unread: false,
        restAPI: false
      },
      rules: {
        password: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '长度不能少于 6 个字符',
            trigger: 'blur'
          }
        ],
        passwordConfirm: [
          {
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '长度不能少于 6 个字符',
            trigger: 'blur'
          }
        ],
        passwordOld: [
          {
            required: true,
            message: '原始密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '长度不能少于 6 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('careyshop/user', [
      'info',
      'unreadMessage'
    ])
  },
  mounted() {
    this._validationAuth()
    this.checkUpdate()
    this.getMessageUnread()
    this.timer = setInterval(this.getMessageUnread, 1000 * 60 * 5)
  },
  methods: {
    ...mapActions('careyshop/account', [
      'logout'
    ]),
    ...mapActions('careyshop/menu', [
      'historyClear'
    ]),
    /**
     * 权限检测
     */
    _validationAuth() {
      this.auth.cache = this.$permission('/index/help/cache')
      this.auth.optimize = this.$permission('/index/help/optimize')
      this.auth.unread = this.$permission('/system/message/unread')
      this.auth.report = this.$permission('/report')
      this.auth.restAPI = this.$permission('/rest_api')
    },
    /**
     * 获取未读消息数
     */
    getMessageUnread() {
      if (!this.auth.unread) {
        return
      }

      getMessageUserUnread(null)
        .then(res => {
          if (res.data.total > this.unreadMessage) {
            const h = this.$createElement
            this.$notify.info({
              title: '消息提示',
              message: h('p', { class: 'cs-cp' }, `您有 ${res.data.total} 条未读消息，请注意查收。`),
              position: 'bottom-right',
              onClick: () => { this.handleMessage() }
            })
          }

          this.$store.commit('careyshop/user/setMessage', res.data.total)
        })
    },
    /**
     * 检测版本更新
     */
    checkUpdate() {
      let host = process.env.NODE_ENV === 'development'
        ? this.$baseConfig.BASE_API + '/v1/app_install.html'
        : 'https://api.careyshop.cn/api/v1/app_install.html'

      this.$axios({
        /**
         * 版本更新检查使用远程官方接口,便于版本号统一
         * 如二次开发有所需求,可修改 host 参数
         */
        url: host,
        method: 'post',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        data: {
          method: 'query.app.install.updated',
          user_agent: 'careyshop-admin',
          ver: process.env.VUE_APP_VERSION
        }
      })
        .then(res => {
          const data = res.data || {}
          if (!data.is_updated) {
            return
          }

          if (util.compareVersion(data.ver, process.env.VUE_APP_VERSION)) {
            const h = this.$createElement
            this.$notify.info({
              title: '版本更新',
              message: h('p', { class: 'cs-cp' }, `发现最新版本号： ${data.ver}，点击查看。`),
              position: 'bottom-right',
              duration: 0,
              onClick: () => { this.$open(data.url) }
            })

            this.$log.capsule('CareyShop Admin', `New version ${data.ver}`)
            console.log(`版本号: ${data.ver} | 详情 ${data.url}`)
          }
        })
        .catch(err => {
          console.log('checkUpdate error', err)
        })
    },
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        vm: this,
        confirm: true
      })
    },
    /**
     * 清除历史
     */
    async clearHistory() {
      await this.historyClear()
      if (this.$route.path === '/index') {
        await this.$router.replace('/refresh')
      }

      this.$message.success('左侧访问历史栏已清空')
    },
    /**
     * 清空缓存
     */
    clearCache() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      clearCacheAll()
        .then(() => {
          this.$message.success('缓存更新成功')
        })
        .finally(() => {
          loading.close()
        })
    },
    /**
     * 最优设置
     */
    systemOptimize() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      setSystemOptimize()
        .then(() => {
          this.$message.success('已调至最优状态')
        })
        .finally(() => {
          loading.close()
        })
    },
    /**
     * 初始化成员变量
     */
    resetTemp() {
      this.dialogLoading = false
      this.form = { password: '', passwordConfirm: '', passwordOld: '' }
    },
    /**
     * 创建修改密码对话框
     */
    handleCreate() {
      this.resetTemp()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    /**
     * 修改密码
     */
    setPassword() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const request = {
            client_id: this.info.admin.admin_id,
            password_old: this.form.passwordOld,
            password: this.form.password,
            password_confirm: this.form.passwordConfirm
          }

          setAdminPassword(request)
            .then(() => {
              this.dialogVisible = false
              this.$message.success('密码修改成功')
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    /**
     * 打开未读消息
     */
    handleMessage() {
      this.$router.push({ name: 'system-message-user' })
    },
    /**
     * 重新载入菜单
     */
    async resetMenu() {
      const res = await getMenuAuthList(null)
      await this.$store.dispatch('careyshop/db/set', {
        dbName: 'database',
        path: '$menu.sourceData',
        value: res.data || [],
        user: true
      })

      // 重新初始化菜单数据
      menu.install(this.$store, res.data || [])

      /**
       * 清空页面缓存设置，将导致页面上的缓存数据丢失，但会实时载入权限
       * 如果将其注释，那么已打开页面需要关闭之后，在下次打开页面时生效。
       * 请根据实际需要而自行选择
       */
      this.$store.commit('careyshop/page/keepAliveClean')

      await this.$router.replace('/refresh')
      this.$message.success('菜单(包括权限)已重新载入')
    },
    /**
     * 打开构建分析
     */
    openReport() {
      this.$router.push({
        name: 'report'
      })
    },
    /**
     * 打开Rest API调试
     */
    openRestAPI() {
      getSettingList('system_info', ['open_api_rest'])
        .then(res => {
          if (res.data.open_api_rest.value) {
            let url = this.$baseConfig.BASE_API
            if (url.slice(0, 1) === '/' && url.slice(1, 1) !== '/') {
              url = '//' + document.domain + url
            }

            this.$open(url)
          } else {
            this.$message.warning('"Rest API调试"已关闭')
          }
        })
    }
  },
  beforeDestroy() {
    // 清理定时任务
    if (this.timer) {
      clearInterval(this.timer)
    }

    // 清理当前账号未读消息数
    this.$store.commit('careyshop/user/setMessage', 0)
  }
}
</script>
