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
import { getGoodsCommentItem } from '@/api/goods/comment'

export default {
  name: 'goods-opinion-comment-detail',
  components: {
    PageMain: () => import('./components/PageMain')
  },
  props: {
    goods_comment_id: {
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
    goods_comment_id: {
      handler() {
        this.getGoodsCommentData()
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
        status: null,
        create_time: '',
        get_addition: {},
        get_user: {},
        get_order_goods: {}
      }
    },
    getGoodsCommentData() {
      this.table = { ...this.getInitData() }
      getGoodsCommentItem(this.goods_comment_id)
        .then(res => {
          this.table = { ...res.data }
        })
    },
    addReply(id, data) {
      if (data.type === 1) {
        this.table.get_main_reply.push({ ...data })
      }

      if (data.type === 3) {
        this.table.get_addition_reply.push({ ...data })
      }

      this.table.status = 1
      this.updateData({
        type: 'set',
        name: 'goods-opinion-comment',
        srcId: id,
        data: {
          status: 1
        }
      })
    }
  }
}
</script>
