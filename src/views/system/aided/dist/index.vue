<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :trace-state="state"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :trace-state="state"
      @sort="handleSort"/>

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
import { getDeliveryDistList } from '@/api/logistics/dist'

export default {
  name: 'system-aided-dist',
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
      state: {
        0: '无轨迹',
        1: '已揽收',
        2: '在途中',
        3: '签收',
        4: '问题件',
        201: '到达派件城市'
      },
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
    this.$store.dispatch('careyshop/db/databasePage', { user: true })
      .then(res => {
        this.page.page_size = res.get('size').value() || 50
      })
      .then(() => {
        this.handleSubmit({ is_trace: 1 })
      })
  },
  methods: {
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
    // 确定查询
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getDeliveryDistList({
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
