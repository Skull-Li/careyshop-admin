<template>
  <el-form
    v-if="form"
    :model="form"
    label-width="200px">
    <div v-permission="'/setting/setting/system/notice/sms'">
      <el-divider>短信配置</el-divider>

      <el-form-item
        :label="form.sms.value.key_id.name"
        prop="sms.key_id">
        <el-input
          v-model="form.sms.value.key_id.value"
          :placeholder="form.sms.value.key_id.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.sms.value.key_id.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.sms.value.key_secret.name"
        prop="sms.key_secret">
        <el-input
          v-model="form.sms.value.key_secret.value"
          :placeholder="form.sms.value.key_secret.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.sms.value.key_secret.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.sms.value.status.name"
        prop="sms.status">
        <el-switch
          v-model="form.sms.value.status.value"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <div class="help-block" v-html="form.sms.value.status.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.sms.value.code.name"
        prop="sms.code">
        <el-input
          v-model="form.sms.value.code.value"
          :placeholder="form.sms.value.code.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.sms.value.code.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.sms.value.template.name"
        prop="sms.template">
        <el-input
          v-model="form.sms.value.template.value"
          :placeholder="form.sms.value.template.name"
          type="textarea"
          :autosize="{minRows: 3}"
          :show-word-limit="true"
          maxlength="500"/>
        <div class="help-block" v-html="form.sms.value.template.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.sms.value.sign.name"
        prop="sms.sign">
        <el-input
          v-model="form.sms.value.sign.value"
          :placeholder="form.sms.value.sign.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.sms.value.sign.help_text"></div>
      </el-form-item>
    </div>

    <div v-permission="'/setting/setting/system/notice/email'">
      <el-divider>邮件配置</el-divider>

      <el-form-item
        :label="form.email.value.host.name"
        prop="email.host">
        <el-input
          v-model="form.email.value.host.value"
          :placeholder="form.email.value.host.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.email.value.host.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.port.name"
        prop="email.port">
        <el-input
          v-model="form.email.value.port.value"
          :placeholder="form.email.value.port.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.email.value.port.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.from.name"
        prop="email.from">
        <el-input
          v-model="form.email.value.from.value"
          :placeholder="form.email.value.from.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.email.value.from.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.nickname.name"
        prop="email.nickname">
        <el-input
          v-model="form.email.value.nickname.value"
          :placeholder="form.email.value.nickname.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.email.value.nickname.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.username.name"
        prop="email.username">
        <el-input
          v-model="form.email.value.username.value"
          :placeholder="form.email.value.username.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.email.value.username.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.password.name"
        prop="email.password">
        <el-input
          v-model="form.email.value.password.value"
          :placeholder="form.email.value.password.name"
          :show-password="true"
          :clearable="true"/>
        <div class="help-block" v-html="form.email.value.password.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.secure.name"
        prop="email.secure">
        <el-radio-group v-model="form.email.value.secure.value">
          <el-radio label="">默认</el-radio>
          <el-radio label="ssl">SSL</el-radio>
          <el-radio label="tls">TLS</el-radio>
        </el-radio-group>
        <div class="help-block" v-html="form.email.value.secure.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.status.name"
        prop="email.status">
        <el-switch
          v-model="form.email.value.status.value"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <div class="help-block" v-html="form.email.value.status.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.subject.name"
        prop="email.subject">
        <el-input
          v-model="form.email.value.subject.value"
          :placeholder="form.email.value.subject.name"
          :clearable="true"/>
        <div class="help-block" v-html="form.email.value.subject.help_text"></div>
      </el-form-item>

      <el-form-item
        :label="form.email.value.template.name"
        prop="email.template">
        <cs-tinymce
          ref="tinymce"
          v-model="form.email.value.template.value"
          code="inside_content"/>
        <div class="help-block" v-html="form.email.value.template.help_text"></div>
      </el-form-item>
    </div>

    <el-form-item size="small">
      <el-button
        type="primary"
        :loading="loading"
        @click="handleFormSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { setNoticeList } from '@/api/config/setting'

export default {
  components: {
    csTinymce: () => import('@/careyshop/cs-tinymce')
  },
  data() {
    return {
      loading: false,
      form: null
    }
  },
  methods: {
    // 设置配置数据
    setFormData(val) {
      this.form = val
    },
    // 确定修改
    handleFormSubmit() {
      let data = {}
      for (const index in this.form) {
        if (Object.prototype.hasOwnProperty.call(this.form, index)) {
          data[index] = this.form[index].value
        }
      }

      this.loading = true
      setNoticeList(data)
        .then(() => {
          this.$message.success('操作成功')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
