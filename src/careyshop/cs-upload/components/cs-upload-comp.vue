<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :data="params"
      :file-list="fileList"
      :list-type="listType"
      :multiple="multiple"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :limit="limit"
      :auto-upload="autoUpload"
      :disabled="disabled"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed">
        <i v-if="listType === 'picture-card'" class="el-icon-plus"/>
        <el-button v-else size="small" icon="el-icon-upload2" :disabled="disabled">点击上传</el-button>
        <div v-if="!disabled" slot="tip" class="el-upload__tip">{{uploadTip}}大小不能超过 {{this.token['file_size']}}</div>
    </el-upload>

    <el-cascader
      v-if="storageId == null && !disabled"
      v-model="parentId"
      :options="parentData"
      :props="parentProps"
      :style="`width: ${fileWidth}; padding-top: 10px;`"
      filterable>
    </el-cascader>
  </div>
</template>

<script>
import upload from './mixins/upload'

export default {
  name: 'cs-upload-comp',
  mixins: [upload],
  props: {
    // 自定义信息
    uploadTip: {
      type: String,
      required: false,
      default: '请选择资源进行上传，'
    },
    // 文件列表的类型
    listType: {
      type: String,
      required: false,
      default: 'picture-card'
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否显示已上传列表
    showFileList: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否开启拖拽上传
    drag: {
      type: Boolean,
      required: false,
      default: false
    },
    // 接受上传的文件类型
    accept: {
      type: String,
      required: false,
      default: 'image/*'
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      required: false,
      default: 0
    },
    // 是否选取后立即上传
    autoUpload: {
      type: Boolean,
      required: false,
      default: true
    },
    // 已上传文件列表
    fileList: {
      type: Array,
      required: false,
      default: () => []
    },
    // 是否指定资源目录
    storageId: {
      type: Number,
      required: false,
      default: null
    },
    // 是否返回绝对路径
    isActual: {
      type: Boolean,
      required: false,
      default: false
    },
    // 目录宽度
    fileWidth: {
      type: String,
      required: false,
      default: '100%'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted() {
    if (!this.disabled) {
      this.getDirectory()
      this.getToken()
    }
  }
}
</script>
