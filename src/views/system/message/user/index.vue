<template>
  <cs-container>
    <page-main
      ref="main"
      :loading="loading"
      :table-data="table"
      :unread-data="unread"
      :type-data="typeData"
      @tabs="handleTabs"
      @sort="handleSort"
      @minus="minusUnread"
      @submit="handleSubmit"/>

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
import { getMessageType } from '@/api/public'
import { getMessageUserList } from '@/api/message/message'

export default {
  name: 'system-message-user',
  components: {
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/careyshop/cs-footer')
  },
  data() {
    return {
      loading: false,
      table: [],
      pageTotal: 0,
      unread: {},
      type: null,
      typeData: [],
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
  watch: {
    'unread.total': {
      handler(val) {
        this.$store.commit('careyshop/user/setMessage', val)
      }
    }
  },
  mounted() {
    Promise.all([
      getMessageType(),
      this.$store.dispatch('careyshop/db/databasePage', { user: true })
    ])
      .then(res => {
        this.typeData.unshift({
          name: '全部消息',
          value: 'total'
        })

        if (res[0]) {
          for (const index in res[0]) {
            if (!Object.prototype.hasOwnProperty.call(res[0], index)) {
              continue
            }

            this.typeData.push({
              name: res[0][index],
              value: index
            })
          }
        }

        this.page.page_size = res[1].get('size').value() || 25
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
        this.handleSubmit(false)
      })
    },
    // 标签页切换
    handleTabs(val) {
      this.type = val !== 'total' ? val : null
      this.order = {}

      this.$nextTick(() => {
        this.handleSubmit()
      })
    },
    // 排序刷新
    handleSort(val) {
      this.order = val
      this.$nextTick(() => {
        this.handleSubmit()
      })
    },
    // 提交查询请求
    handleSubmit(isRestore = true) {
      if (isRestore) {
        this.page.page_no = 1
      }

      this.loading = true
      getMessageUserList({
        is_unread: 1,
        type: this.type,
        is_read: this.$refs.main ? this.$refs.main.isRead : null,
        ...this.page,
        ...this.order
      })
        .then(res => {
          this.pageTotal = res.data.total_result
          this.table = res.data.items || []
          this.unread = res.data.unread_count || {}
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 减少已读数
    minusUnread(key, total) {
      const newKey = ['total', key]
      newKey.forEach(value => {
        if (Object.prototype.hasOwnProperty.call(this.unread, value)) {
          this.unread[value] = (this.unread[value] - total) <= 0 ? 0 : this.unread[value] - total
        }
      })
    }
  }
}
</script>
