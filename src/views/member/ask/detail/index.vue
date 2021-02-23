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
      // 判断是否路由进入
      isSourceRoute: false,
      // 表格数据
      table: { type: null, status: null }
    }
  },
  mounted() {
    if (!this.isSourceRoute) {
      this.getAskData(this.ask_id)
    }
  },
  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    if (to.params.ask_id) {
      next(instance => {
        instance.getAskData(to.params.ask_id)
        instance.isSourceRoute = true
      })
    } else {
      next(new Error('未指定ID'))
    }
  },
  methods: {
    ...mapActions('careyshop/update', [
      'updateData'
    ]),
    getAskData(id) {
      // id存在表示已获取原始数据
      if (this.table.ask_id) {
        return
      }

      this.$nextTick(() => {
        getAskItem(id)
          .then(res => {
            this.table = { ...res.data }
          })
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
