<template>
  <!--   <el-tooltip :content="title" placement="top-start">
    <el-button v-bind="$attrs" v-on="$listeners" />
  </el-tooltip> 有BUG -->
  <a href="javascript:;" :title="title">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'HintButton',
  props: {
    title: String
  }
}
</script>
<style >
a {
  margin: 0 5px;
}
</style>