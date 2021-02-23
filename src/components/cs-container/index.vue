<script>
import csBackToTop from './components/cs-back-to-top'

const containers = {
  full: () => import('./components/cs-container-full'),
  fullbs: () => import('./components/cs-container-full-bs'),
  ghost: () => import('./components/cs-container-ghost'),
  ghostbs: () => import('./components/cs-container-ghost-bs'),
  card: () => import('./components/cs-container-card'),
  cardbs: () => import('./components/cs-container-card-bs')
}

export default {
  name: 'cs-container',
  props: {
    // 容器样式
    type: {
      type: String,
      required: false,
      default: 'full'
    },
    // 滚动优化
    betterScroll: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      // 容器当前坐标
      csScroll: { x: 0, y: 0 }
    }
  },
  created() {
    // 解决Firefox下拖拽结束后会新开搜索窗口
    document.body.ondrop = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  computed: {
    // 始终返回渲染组件
    component() {
      return containers[`${this.type}${this.betterScroll ? 'bs' : ''}`] || 'div'
    }
  },
  render(h) {
    const slots = [
      this.$slots.default,
      this.$slots.header ? <template slot='header'>{ this.$slots.header }</template> : null,
      this.$slots.footer ? <template slot='footer'>{ this.$slots.footer }</template> : null
    ]
    return <div
      ref='container'
      class='container-component'>
      <this.component
        ref='component'
        { ...{ attrs: this.$attrs } }
        onScroll={ e => { this.csScroll = e } }>
        { slots }
      </this.component>
      <csBackToTop
        { ...{ attrs: this.$attrs } }>
      </csBackToTop>
    </div>
  },
  activated() {
    // 恢复滚动位置
    if (!this.betterScroll && this.$refs.component) {
      this.$refs.component.scrollTo(this.csScroll.x, this.csScroll.y)
    }
  }
}
</script>
