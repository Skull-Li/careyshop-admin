<template>
  <cs-container :is-back="false">
    <page-navi class="cs-m" v-model="root"/>
  </cs-container>
</template>

<script>
export default {
  name: 'place-index',
  components: {
    PageNavi: () => import('@/layout/header-aside/components/header-navi')
  },
  data() {
    return {
      root: '/place'
    }
  }
}
</script>
