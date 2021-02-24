<template>
  <cs-container>
    <page-edit
      state="update"
      :formData="formData">
    </page-edit>
  </cs-container>
</template>

<script>
import { mapActions } from 'vuex'
import { getTopicItem } from '@/api/article/topic'

export default {
  name: 'system-topic-update',
  components: {
    PageEdit: () => import('./components/PageEdit')
  },
  props: {
    topic_id: {
      type: [Number, String],
      required: false
    }
  },
  data() {
    return {
      // 表单数据
      formData: {}
    }
  },
  // 被 keep-alive 缓存的组件激活时调用
  activated() {
    if (!this.topic_id) {
      this.$router.push({ name: 'index' })
      this.handleClose()
    }
  },
  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    if (to.params.topic_id) {
      next(instance => {
        instance.getTopicData()
      })
    } else {
      next()
    }
  },
  methods: {
    ...mapActions('careyshop/page', [
      'close'
    ]),
    getTopicData() {
      // id存在表示已获取原始数据
      if (this.formData.topic_id) {
        return
      }

      getTopicItem(this.topic_id)
        .then(res => {
          this.formData = {
            ...res.data,
            status: res.data.status.toString()
          }
        })
    },
    // 关闭当前窗口
    handleClose() {
      this.close({
        tagName: this.$route.fullPath
      })
    }
  }
}
</script>
