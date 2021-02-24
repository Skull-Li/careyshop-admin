<template>
  <cs-container>
    <page-main
      :table-data="table"
      @reply="addReply">
    </page-main>
  </cs-container>
</template>

<script>
import { mapActions } from 'vuex'
import { getAskItem } from '@/api/user/ask'

export default {
  name: 'member-ask-detail',
  components: {
    PageMain: () => import('./components/PageMain')
  },
  props: {
    ask_id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      table: this.getInitData()
    }
  },
  watch: {
    ask_id: {
      handler() {
        this.getAskData()
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('careyshop/update', [
      'updateData'
    ]),
    getInitData() {
      return {
        type: null,
        status: null
      }
    },
    getAskData() {
      this.table = { ...this.getInitData() }
      getAskItem(this.ask_id)
        .then(res => {
          this.table = { ...res.data }
        })
    },
    addReply(id, data) {
      this.table.status = 1
      this.table.get_items.push({ ...data })

      this.updateData({
        type: 'set',
        name: 'member-ask-list',
        srcId: id,
        data: {
          status: 1
        }
      })
    }
  }
}
</script>
