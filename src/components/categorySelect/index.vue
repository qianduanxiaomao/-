<template>
  <div>
    <el-form
      :inline="true"
      :model="cForm"
      class="demo-form-inline"
      :disabled="addIsShow"
    >
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1"
          placeholder="请选择"
          @change="getCategory2"
        >
          <el-option
            v-for="category1Item in category1List"
            :key="category1Item.id"
            :label="category1Item.name"
            :value="category1Item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2"
          placeholder="请选择"
          @change="getCategory3"
        >
          <el-option
            v-for="category2Item in category2List"
            :key="category2Item.id"
            :label="category2Item.name"
            :value="category2Item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3"
          placeholder="请选择"
          @change="getCategortAfter"
        >
          <el-option
            v-for="item in category3List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['addIsShow'],
  data() {
    return {
      cForm: {
        category1: '',
        category2: '',
        category3: ''
      },
      category1List: [],
      category2List: [],
      category3List: []
    }
  },
  mounted() {
    this.getCategory1()
  },
  methods: {
    async getCategory1() {
      try {
        const response = await this.$API.categorySelect.getCategory1()
        if (response.code == 200) this.category1List = response.data
      } catch (error) {
        throw error
      }
    },
    async getCategory2(category1) {
      this.cForm.category2 = ''
      this.cForm.category3 = ''
      this.$emit('getAttrList', { category: category1, level: 1 })
      try {
        const response = await this.$API.categorySelect.getCategory2(category1)
        if (response.code == 200) this.category2List = response.data
      } catch (error) {
        throw error
      }
    },
    async getCategory3(category2) {
      this.cForm.category3 = ''
      this.$emit('getAttrList', { category: category2, level: 2 })
      try {
        const response = await this.$API.categorySelect.getCategory3(category2)
        if (response.code == 200) this.category3List = response.data
      } catch (error) {
        throw error
      }
    },
    getCategortAfter(category3) {
      this.$emit('getAttrList', { category: category3, level: 3 })
    }
  }
}
</script>

<style>
</style>