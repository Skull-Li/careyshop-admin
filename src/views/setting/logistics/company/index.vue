<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :company-type="companyType"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :company-type="companyType"
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
import { getDeliveryCompanyList } from '@/api/logistics/company'

export default {
  name: 'setting-logistics-company',
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
      companyType: {
        0: '热门',
        1: '国内',
        2: '国外',
        3: '转运'
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
        this.page.page_size = res.get('size').value() || 25
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
    // 确定查询
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getDeliveryCompanyList({
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
