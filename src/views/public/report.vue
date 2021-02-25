<template>
  <cs-container-frame src="report.html"/>
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
    if (this.is_load) {
      setTimeout(() => {
        let iframe = this.$el.getElementsByClassName('cs-container-frame')[0]
        let content = iframe.contentWindow

        content.chartData.forEach(value => {
          let script = document.createElement('script')
          script.setAttribute('type', 'text/javascript')
          script.setAttribute('src', value.label)
          iframe.appendChild(script)
        })
      }, 500)
    }
  }
}
</script>
