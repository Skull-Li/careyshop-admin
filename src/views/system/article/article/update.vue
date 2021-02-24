<template>
  <cs-container>
    <page-edit
      state="update"
      :catList="catList"
      :catData="catData"
      :formData="formData">
    </page-edit>
  </cs-container>
</template>

<script>
import util from '@/utils/util'
import { mapActions } from 'vuex'
import { getArticleCatList } from '@/api/article/cat'
import { getArticleItem } from '@/api/article/article'

export default {
  name: 'system-article-update',
  components: {
    PageEdit: () => import('./components/PageEdit')
  },
  props: {
    article_id: {
      type: [Number, String],
      required: false
    }
  },
  data() {
    return {
      // 分类源数据
      catList: [],
      // 整理后的分类数据
      catData: [],
      // 表单数据
      formData: {}
    }
  },
  activated() {
    if (!this.article_id) {
      this.$router.push({ name: 'index' })
      this.handleClose()
    }
  },
  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    if (to.params.article_id) {
      next(instance => {
        instance.getArticleData()
      })
    } else {
      next()
    }
  },
  methods: {
    ...mapActions('careyshop/page', [
      'close'
    ]),
    setArticleData(data) {
      // 数据类型转为字符型
      data.is_top = data.is_top.toString()
      data.status = data.status.toString()

      return data
    },
    getArticleData() {
      // id存在表示已获取原始数据
      if (this.formData.article_id) {
        return
      }

      Promise.all([
        getArticleCatList(null),
        getArticleItem(this.article_id)
      ])
        .then(res => {
          // 处理分类数据
          this.catList = res[0].data || []
          this.catData = util.formatDataToTree(this.catList, 'article_cat_id')

          // 处理文章数据
          this.formData = this.setArticleData({ ...res[1].data })
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
