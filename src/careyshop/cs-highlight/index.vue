<template>
  <pre class="cs-highlight hljs" v-html="highlightHTML"/>
</template>

<script>
// https://highlightjs.org/usage/
// http://highlightjs.readthedocs.io/en/latest/api.html#configure-options
import htmlFormat from './libs/htmlFormat'
import './libs/style.github.css'
import highlight from 'highlight.js'

export default {
  name: 'cs-highlight',
  props: {
    code: {
      type: String,
      required: false,
      default: ''
    },
    formatHtml: {
      type: Boolean,
      required: false,
      default: false
    },
    lang: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      highlightHTML: ''
    }
  },
  mounted() {
    this.highlight()
  },
  watch: {
    code() {
      this.highlight()
    }
  },
  methods: {
    highlight() {
      const code = this.formatHtml ? htmlFormat(this.code) : this.code
      this.highlightHTML = highlight.highlightAuto(code, [
        this.lang,
        'html',
        'javascript',
        'json',
        'css',
        'scss',
        'less'
      ]).value
    }
  }
}
</script>

<style scoped>
.cs-highlight {
  margin: 0;
  border-radius: 4px;
  font-size: 12px;
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
}
</style>
