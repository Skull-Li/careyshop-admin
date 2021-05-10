<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :coupon-data="couponData"
      :coupon-type="couponType"
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
import { getCouponItem } from '@/api/marketing/coupon'
import { getCouponGiveList } from '@/api/marketing/coupon_give'

export default {
  name: 'marketing-coupon-give',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/careyshop/cs-footer')
  },
  props: {
    coupon_id: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  data() {
    return {
      table: [],
      pageTotal: 0,
      loading: false,
      couponData: null,
      couponType: '',
      page: {
        page_no: 1,
        page_size: 0
      }
    }
  },
  mounted() {
    let request = [
      this.$store.dispatch('careyshop/db/databasePage', { user: true })
    ]

    if (this.coupon_id !== 0) {
      request.push(getCouponItem(this.coupon_id))
    }

    Promise.all(request)
      .then(res => {
        this.page.page_size = res[0].get('size').value() || 25
        this.couponData = res[1] ? res[1].data : null
      })
      .then(() => {
        this.handleSubmit({ coupon_id: this.coupon_id }, true)
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
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      this.couponType = form.type

      getCouponGiveList({
        ...form,
        ...this.page,
        coupon_id: this.coupon_id
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
