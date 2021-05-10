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
      :card-data="cardData"/>

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
import { getCardItem } from '@/api/marketing/card'
import { getCardUseList } from '@/api/marketing/card_use'

export default {
  name: 'marketing-card-use',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/careyshop/cs-footer')
  },
  props: {
    card_id: {
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
      cardData: null,
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

    if (this.card_id !== 0) {
      request.push(getCardItem(this.card_id))
    }

    Promise.all(request)
      .then(res => {
        this.page.page_size = res[0].get('size').value() || 25
        this.cardData = res[1] ? res[1].data : null
      })
      .then(() => {
        this.handleSubmit({ card_id: this.card_id }, true)
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
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getCardUseList({
        ...form,
        ...this.page,
        card_id: this.card_id
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
