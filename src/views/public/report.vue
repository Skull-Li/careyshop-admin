<template>
  <cs-container :is-back="false">
    <div v-show="loading" v-loading="loading" class="cs-container-page"></div>

    <iframe v-if="exist" class="cs-container-frame" :srcdoc="content" frameborder="0"/>
    <div v-else class="cs-container-page">
      <img src="~@/assets/image/logo@2x.png" alt="report">
      <p class="page_title">CareyShop构建分析失败</p>
      <el-button class="cs-mt" @click="handleClose">离开</el-button>
    </div>
  </cs-container>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'report',
  data() {
    return {
      content: '',
      exist: false,
      loading: true
    }
  },
  mounted() {
    axios({
      method: 'get',
      url: process.env.BASE_URL + 'report.html'
    })
      .then(res => {
        this.exist = true
        this.content = res || ''
      })
      .catch(() => {
        this.exist = false
        this.content = ''
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    ...mapActions('careyshop/page', [
      'close'
    ]),
    handleClose() {
      this.close({
        tagName: this.$route.fullPath
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cs-container-page {
  height: 100%;
  @extend %flex-center-col;

  .page_title {
    font-size: 20px;
    color: $color-text-main;
  }
}
.cs-container-frame {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
