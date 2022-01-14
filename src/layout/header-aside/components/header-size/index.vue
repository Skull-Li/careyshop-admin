<template>
  <el-dropdown placement="bottom" @command="handleChange" :show-timeout="50">
    <el-button class="btn-text can-hover" type="text" icon="el-icon-view"/>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in options"
        :key="item.value"
        :command="item.value"
        :icon="iconName(item.value)">
        {{item.label}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'cs-header-size',
  computed: {
    ...mapState('careyshop/size', [
      'value'
    ])
  },
  data() {
    return {
      options: [
        { label: '默认', value: 'default' },
        { label: '中等', value: 'medium' },
        { label: '小型', value: 'small' },
        { label: '超小', value: 'mini' }
      ]
    }
  },
  methods: {
    ...mapActions({
      sizeSet: 'careyshop/size/set'
    }),
    handleChange(value) {
      this.sizeSet(value)
      this.$message.success('操作成功')
    },
    iconName(name) {
      return name === this.value ? 'el-icon-check' : 'el-icon-minus'
    }
  }
}
</script>
