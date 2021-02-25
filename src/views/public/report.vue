<template>
  <cs-container-frame :src="`${$publicPath}report.html`"/>
</template>

<script>
export default {
  name: 'report',
  props: {
    is_load: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  mounted() {
    if (this.is_load > 0) {
      setTimeout(() => {
        let iframe = this.$el.getElementsByClassName('cs-container-frame')[0]
        let content = iframe.contentWindow

        if (Array.isArray(content.chartData)) {
          for (const value of content.chartData) {
            let script = document.createElement('script')
            script.setAttribute('type', 'text/javascript')
            script.setAttribute('src', process.env.BASE_URL + value.label)
            iframe.appendChild(script)
          }
        }
      }, 500)
    }
  }
}
</script>
