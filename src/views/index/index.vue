<template>
  <cs-container :is-back="false">
    <page-header slot="header"/>
    <page-main/>

    <el-dialog
      title="使用协议"
      :visible.sync="visible"
      width="70%"
      :center="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">

      <span style="white-space: pre-wrap;">{{license}}</span>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="handleAgreement"
          type="primary"
          size="small">同意</el-button>

        <el-button
          @click="handleRejection"
          size="small">拒绝</el-button>
      </div>
    </el-dialog>
  </cs-container>
</template>

<script>
import util from '@/utils/util'
import { mapActions } from 'vuex'

export default {
  name: 'index',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain')
  },
  data() {
    return {
      visible: false,
      license: undefined
    }
  },
  mounted() {
    if (util.cookies.get('license') !== 'yes') {
      if (process.env.VUE_APP_ISDEMO === 'true') {
        return
      }

      if (!this.license) {
        this.license = require('./components/libs/license.json').license
      }

      this.visible = true
    }
  },
  methods: {
    ...mapActions('careyshop/account', [
      'logout'
    ]),
    // 同意协议
    handleAgreement() {
      this.visible = false
      util.cookies.set('license', 'yes', { expires: 365 })
    },
    // 拒绝协议
    handleRejection() {
      this.logout({ vm: this })
    }
  }
}
</script>
