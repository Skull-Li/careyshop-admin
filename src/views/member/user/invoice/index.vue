<template>
  <cs-container>
    <page-header
      slot="header"
      :username="username"/>

    <page-main
      :loading="loading"
      :table-data="table"/>
  </cs-container>
</template>

<script>
import { getUserInfo } from '@/api/user/client'
import { getUserInvoiceList } from '@/api/user/invoice'

export default {
  name: 'member-user-invoice',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain')
  },
  props: {
    client_id: {
      type: [Number, String],
      required: true
    }
  },
  watch: {
    client_id: {
      handler(val) {
        this.getUserInvoiceData(val)
      },
      immediate: true
    }
  },
  data() {
    return {
      table: [],
      loading: false,
      username: undefined
    }
  },
  methods: {
    getUserInvoiceData(client_id) {
      this.$nextTick(() => {
        this.table = []
        this.loading = true
        this.username = ''
      })

      Promise.all([
        getUserInfo(client_id),
        getUserInvoiceList(client_id)
      ])
        .then(res => {
          this.username = res[0].data ? res[0].data.username : ''
          this.table = res[1].data || []
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
