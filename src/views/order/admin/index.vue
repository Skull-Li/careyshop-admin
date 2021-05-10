<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :to-payment="toPayment"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :to-payment="toPayment"
      :order-total="total"
      @tabs="handleTabs"
      @refresh="handleRefresh"
      @total="handleTotal"/>

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
import { getOrderList, getOrderStatusTotal } from '@/api/order/order'

export default {
  name: 'order-admin-list',
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
      status: 0,
      total: {},
      page: {
        page_no: 1,
        page_size: 0
      }
    }
  },
  mounted() {
    Promise.all([
      getPaymentList({ is_select: 1, exclude_code: [4, 5, 6] }),
      this.$store.dispatch('careyshop/db/databasePage', { user: true })
    ])
      .then(res => {
        if (res[0].data) {
          res[0].data.forEach(value => {
            this.toPayment[value.code] = value
          })
        }

        this.page.page_size = res[1].get('size').value() || 25
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  beforeRouteEnter(to, from, next) {
    // 从订单详情页返回后刷新列表
    if (from.name === 'order-admin-info') {
      next(instance => {
        if (instance.$refs.header) {
          instance.$refs.header.handleFormSubmit()
        }
      })
    } else {
      next()
    }
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
    // 标签页切换
    handleTabs(val) {
      this.status = val
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit(true)
      })
    },
    // 统计标签数量
    handleTotal(form) {
      getOrderStatusTotal(form)
        .then(res => {
          this.total = res.data || {}
        })
    },
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      this.handleTotal(form)

      getOrderList({
        ...form,
        ...this.page,
        status: this.status
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
