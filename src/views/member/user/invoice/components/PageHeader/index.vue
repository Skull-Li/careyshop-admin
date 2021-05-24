<template>
  <el-page-header @back="goBack">
    <template slot="content">
      <span>{{username ? `${username} 开票信息` : ''}}</span>
    </template>
  </el-page-header>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'member-user-client'
      })
    }
  }
}
</script>
