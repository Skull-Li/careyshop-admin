<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :type-id="goods_type_id"
      :type-data="typeList"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :type-data="typeList"
      :select-id="selectTypeId"
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
import { getGoodsTypeSelect } from '@/api/goods/type'
import { getGoodsAttributePage } from '@/api/goods/attribute'

export default {
  name: 'goods-setting-attribute',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/careyshop/cs-footer')
  },
  props: {
    goods_type_id: {
      type: [String, Number],
      required: false
    }
  },
  data() {
    return {
      table: [],
      pageTotal: 0,
      loading: false,
      typeList: {},
      selectTypeId: null,
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
      getGoodsTypeSelect({ order_field: 'goods_type_id', order_type: 'asc' }),
      this.$store.dispatch('careyshop/db/databasePage', { user: true })
    ])
      .then(res => {
        if (res[0].data) {
          res[0].data.forEach(item => {
            this.typeList[item.goods_type_id] = item.type_name
          })
        }

        this.page.page_size = res[1].get('size').value() || 25
      })
      .then(() => {
        this.handleSubmit({ goods_type_id: this.goods_type_id }, true)
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
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      this.selectTypeId = form.goods_type_id || null

      getGoodsAttributePage({
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
