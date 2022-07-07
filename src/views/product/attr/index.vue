<template>
  <div>
    <!-- card三级选项 -->
    <el-card>
      <CategorySelect @getAttrList="getAttrList" :addIsShow="addIsShow" />
    </el-card>
    <!-- card属性列表 -->
    <el-card style="margin-top: 20px">
      <div v-show="!addIsShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="changeAddIsShow"
          :disabled="!category3"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 90%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="120">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValueItem in row.attrValueList"
                :key="attrValueItem.id"
                >{{ attrValueItem.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="{ row }">
              <HintButton
                title="修改"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="changeAttr(row)"
              />
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                confirm-button-text="删除"
                cancel-button-text="取消"
                @confirm="removeAttr(row)"
              >
                <HintButton
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="addIsShow">
        <el-form ref="form" :model="attrForm" label-width="60px" inline>
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              autocomplete="off"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttr"
          >添加属性值</el-button
        >
        <el-button @click="addIsShow = false">取消</el-button>
        <el-table style="width: 100%" :data="attrForm.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值"
                @blur="toLook(row)"
                @keydown.enter.native="toLook(row)"
                :ref="$index"
                size="mini"
              ></el-input>
              <span v-else @click="toIsEdit(row, $index)" class="attrName">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="attrForm.attrValueList.length == 0"
          >保存</el-button
        >
        <el-button @click="addIsShow = false">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      attrList: [],
      category1: '',
      category2: '',
      category3: '',
      addIsShow: false,
      attrForm: {
        attrName: '',
        attrValueList: [
          /*  {
            "attrId": 0,
            "id": 0,
            "valueName": "string"
            } */
        ],
        categoryId: 0,
        categoryLevel: 3
      }
      /* 
      {
        "attrName": "string",
        "attrValueList": [
          {
            "attrId": 0,
            "id": 0,
            "valueName": "string"
          }
        ],
        "categoryId": 0,
        "categoryLevel": 0,
        "id": 0
    } */
    }
  },
  methods: {
    getAttrList({ category, level }) {
      if (level == 1) {
        this.category2 = ''
        this.category3 = ''
        this.attrList = []
        this.category1 = category
      } else if (level == 2) {
        this.category3 = ''
        this.attrList = []
        this.category2 = category
      } else if (level == 3) {
        this.category3 = category
        this.getAttrInfo()
      }
    },
    async getAttrInfo() {
      const { category1, category2, category3 } = this
      try {
        const response = await this.$API.attr.getAttrList(
          category1,
          category2,
          category3
        )
        this.attrList = response.data
      } catch (error) {
        throw error
      }
    },
    changeAddIsShow() {
      // 每次点击添加的时候都需要清空属性列表里的东西
      this.addIsShow = true
      this.attrForm = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3,
        categoryLevel: 3
      }
    },
    addAttr() {
      // 先添加到里面占位,然后table数据根据属性值列表更新,在输入的时候再收集进来
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //这个id说的是当前这个属性值所属属性的ID,如果是添加属性,这个id是没有的,如果是修改属性,这个id是有的
        valueName: '',
        isEdit: true
      })
      // input自动获取焦点focus
      this.$nextTick(() =>
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      )
    },
    //修改按钮的回调
    changeAttr(row) {
      this.addIsShow = true
      //this.attrForm = {...row} 浅拷贝为了不让修改的数据点取消影响到源数据,但是里面有对象不是基本数据类型需要用到深拷贝
      const rowString = JSON.stringify(row) //深拷贝
      this.attrForm = JSON.parse(rowString)
      this.attrForm.attrValueList.forEach((item) =>
        this.$set(item, 'isEdit', false)
      ) //添加模式用于是否编辑,响应式
    },
    toLook(row) {
      if (!row.valueName.trim()) {
        //如果输入的是空格
        this.$message.info('请不要输入空字符')
        row.valueName = ''
        return
      }
      const { valueName } = row
      const isequal = this.attrForm.attrValueList.some((item) => {
        if (item != row) return item.valueName == valueName
      })
      if (isequal) {
        this.$message.info('请不要输入相同的字符')
        row.valueName = ''
        return
      }
      row.isEdit = false
    },
    toIsEdit(row, index) {
      row.isEdit = true
      // 改变的时候自动获取焦点
      // updated:每次更新都要调用
      // $nextTick:只调用一次
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    async save() {
      const attr = this.attrForm
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== '') {
          delete item.isEdit //如果属性值对象的属性名称不为空串，就去除它的isEdit属性
          return item
        }
      })
      if (attr.attrValueList.length == 0) {
        this.$message.info('请输入属性值')
        return
      }
      try {
        await this.$API.attr.addOrupdeta(attr)
        this.addIsShow = false
        this.$message.success('保存成功')
        this.getAttrInfo()
      } catch (error) {
        this.$message.error(error)
      }
    },
    async removeAttr(row) {
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除成功')
        this.getAttrInfo()
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style>
.attrName {
  display: block;
  width: 100%;
  height: 100%;
}
</style>