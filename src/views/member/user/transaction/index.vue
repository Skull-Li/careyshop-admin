<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :to-payment="toPayment"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :table-data="table"
      :to-payment="toPayment"
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
import { getPaymentList } from '@/api/payment/payment'
import { getTransactionList } from '@/api/transaction/log'

export default {
  name: 'member-user-transaction',
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
      toPayment: {},
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
      getPaymentList({ is_select: 1 }),
      this.$store.dispatch('careyshop/db/databasePage', { user: true })
    ])
      .then(res => {
        if (res[0].data) {
          res[0].data.forEach(value => {
            this.toPayment[value.code] = value
          })
        }

        this.page.page_size = res[1].get('size').value() || 50
      })
      .then(() => {
        this.handleSubmit()
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
      getTransactionList({
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
