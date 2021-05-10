<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :type-map="typeMap"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :type-map="typeMap"
      :table-data="table"
      @tabs="handleTabs"
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
import { getOrderServiceList } from '@/api/order/service'

export default {
  name: 'order-service-list',
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
      status: null,
      typeMap: {
        0: '仅退款',
        1: '退货退款',
        2: '换货',
        3: '维修'
      },
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
  beforeRouteEnter(to, from, next) {
    // 从订单详情页返回后刷新列表
    if (from.name === 'order-service-info') {
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
      this.status = val <= 0 ? null : val - 1
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit(true)
      })
    },
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getOrderServiceList({
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
