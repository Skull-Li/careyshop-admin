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
import { getGoodsConsultItem } from '@/api/goods/consult'

export default {
  name: 'goods-opinion-consult-detail',
  components: {
    PageMain: () => import('./components/PageMain')
  },
  props: {
    goods_consult_id: {
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
    goods_consult_id: {
      handler() {
        this.getGoodsConsultData()
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
        status: null,
        get_goods: { name: null }
      }
    },
    getGoodsConsultData() {
      this.table = { ...this.getInitData() }
      getGoodsConsultItem(this.goods_consult_id)
        .then(res => {
          // 需要在头部插入问题正文
          if (res.data) {
            res.data.get_answer.unshift({
              goods_consult_id: res.data.goods_consult_id,
              content: res.data.content,
              create_time: res.data.create_time,
              is_client: true // 额外参数,表示是否属于提问
            })
          }

          // 更新实际正文
          this.table = { ...res.data }
        })
    },
    addReply(id, data) {
      this.table.status = 1
      this.table.get_answer.push({ ...data })

      this.updateData({
        type: 'set',
        name: 'goods-opinion-consult',
        srcId: id,
        data: {
          status: 1
        }
      })
    }
  }
}
</script>
