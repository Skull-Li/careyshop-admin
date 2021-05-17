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
      :navi-data="navi"
      :storage-id="storageId"
      @refresh="handleRefresh"
      @clear-name="handleClearName"/>

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
import { getStorageNavi, getStorageList } from '@/api/upload/storage'

export default {
  name: 'system-storage-storage',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/careyshop/cs-footer')
  },
  data() {
    return {
      loading: false,
      pageTotal: 0,
      storageId: 0,
      table: [],
      navi: [],
      page: {
        page_no: 1,
        page_size: 0
      }
    }
  },
  mounted() {
    this.$store.dispatch('careyshop/db/databasePage', { user: true })
      .then(res => {
        this.page.page_size = res.get('size').value() || 50
      })
      .finally(() => {
        this.handleSubmit()
      })
  },
  watch: {
    storageId: {
      handler(val) {
        getStorageNavi(val)
          .then(res => {
            this.navi = res.data || []
          })
      }
    }
  },
  methods: {
    // 刷新列表页面
    handleRefresh(storageId = null, isRestore = false, total = 0) {
      if (total >= this.page.page_size) {
        this.page.page_no = Math.ceil((this.pageTotal - total) / this.page.page_size)
      } else if (total) {
        !(this.page.page_no - 1) || this.page.page_no--
      }

      this.$nextTick(() => {
        this.$refs.header.form.storage_id = storageId || 0
        this.$refs.header.handleFormSubmit(isRestore)
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
    // 清除搜索名称
    handleClearName() {
      this.$refs.header.form.name = null
    },
    // 查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getStorageList({
        ...form,
        ...this.page
      })
        .then(res => {
          this.table = res.data.items || []
          this.pageTotal = res.data.total_result
        })
        .finally(() => {
          this.loading = false
          this.storageId = form ? form.storage_id : 0
        })
    }
  }
}
</script>
