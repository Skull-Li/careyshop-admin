<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :table-data="table"
      @refresh="handleRefresh"/>

    <page-footer
      slot="footer"
      :loading="loading"
      :page-no="page.page_no"
      :page-size="page.page_size"
      :total="pageTotal"
      @change="handlePaginationChange"/>
  </cs-container>
</template>

<script>
import { mapActions } from 'vuex'
import { getGoodsCommentList } from '@/api/goods/comment'

export default {
  name: 'goods-opinion-comment',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/careyshop/cs-footer')
  },
  data() {
    return {
      table: [],
      pageTotal: 0,
      loading: false,
      page: {
        page_no: 1,
        page_size: 0
      }
    }
  },
  mounted() {
    this.$store.dispatch('careyshop/db/databasePage', { user: true })
      .then(res => {
        this.page.page_size = res.get('size').value() || 25
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  methods: {
    ...mapActions('careyshop/update', [
      'updateData'
    ]),
    // 刷新列表页面
    handleRefresh(isTurning = false) {
      if (isTurning) {
        !(this.page.page_no - 1) || this.page.page_no--
      }

      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 分页变化改动
    handlePaginationChange(val) {
      this.page = val
      if ((val.page_no - 1) * val.page_size > this.pageTotal) {
        return
      }

      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getGoodsCommentList({
        ...form,
        ...this.page
      })
        .then(res => {
          this.updateData({ type: 'clear', name: 'goods-opinion-comment' })
          this.table = res.data.items || []
          this.pageTotal = res.data.total_result
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
