<template>
  <el-form
    v-if="form"
    :model="form"
    label-width="200px">
    <el-form-item
      :label="form.api_id.description"
      prop="api_id">
      <el-input
        v-model="form.api_id.value"
        :placeholder="form.api_id.description"
        :clearable="true"/>
      <div class="help-block" v-html="form.api_id.help_text"></div>
    </el-form-item>

    <el-form-item
      :label="form.api_key.description"
      prop="api_key">
      <el-input
        v-model="form.api_key.value"
        :placeholder="form.api_key.description"
        :clearable="true"/>
      <div class="help-block" v-html="form.api_key.help_text"></div>
    </el-form-item>

    <el-form-item
      :label="form.is_subscriber.description"
      prop="is_subscriber">
      <el-radio v-model="form.is_subscriber.value" :label="0">免费账号</el-radio>
      <el-radio v-model="form.is_subscriber.value" :label="1">订购账号</el-radio>
      <div class="help-block" v-html="form.is_subscriber.help_text"></div>
    </el-form-item>

    <el-form-item
      :label="form.is_sub.description"
      prop="is_sub">
      <el-switch
        v-model="form.is_sub.value"
        :active-value="1"
        :inactive-value="0">
      </el-switch>
      <div class="help-block" v-html="form.is_sub.help_text"></div>
    </el-form-item>

    <el-form-item size="small">
      <el-button
        type="primary"
        :loading="loading"
        @click="handleFormSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { setDeliveryDistList } from '@/api/config/setting'

export default {
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
      setDeliveryDistList(data)
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
