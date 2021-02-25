<template>
  <cs-container :is-back="false">
    <iframe class="cs-container-frame" :srcdoc="content" frameborder="0"></iframe>
  </cs-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'report',
  props: {
    is_load: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      content: ''
    }
  },
  created() {
    axios({
      method: 'get',
      url: process.env.BASE_URL + 'report.html'
    })
      .then(res => {
        this.content = res || ''

        // if (this.is_load) {
        //   let pos = this.content.indexOf('window.chartData =')
        //   let chart = this.content.slice(pos + 19)
        //
        //   pos = chart.indexOf(';')
        //   chart = chart.slice(0, pos)
        //
        //   const chartData = JSON.parse(chart)
        //   for (const value of chartData) {
        //     if (value.label.indexOf('app.') === -1) {
        //       let script = document.createElement('script')
        //       script.src = `${process.env.BASE_URL + value.label}`
        //       document.getElementsByTagName('head')[0].appendChild(script)
        //     }
        //   }
        // }
      })
      .catch(() => {
      })
  }
}
</script>

<style scoped>
.cs-container-frame {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
