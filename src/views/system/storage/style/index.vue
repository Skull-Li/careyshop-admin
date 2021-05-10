<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :platform-table="platformTable"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :platform-table="platformTable"
      @sort="handleSort"
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
import { getSettingList } from '@/api/config/setting'
import { getStorageStyleList } from '@/api/upload/style'

export default {
  name: 'system-storage-style',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/careyshop/cs-footer')
  },
  data() {
    return {
      loading: false,
      table: [],
      pageTotal: 0,
      platformTable: [],
      page: {
        page_no: 1,
        page_size: 0
      },
      order: {
        order_type: undefined,
        order_field: undefined
      }
    }
  },
  mounted() {
    Promise.all([
      getSettingList('system_info', ['platform']),
      this.$store.dispatch('careyshop/db/databasePage', { user: true })
    ])
      .then(res => {
        this.platformTable = res[0].data ? res[0].data.platform.value : []
        this.page.page_size = res[1].get('size').value() || 25
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  methods: {
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
    // 排序刷新
    handleSort(val) {
      this.order = val
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getStorageStyleList({
        ...form,
        ...this.page,
        ...this.order
      })
        .then(res => {
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
