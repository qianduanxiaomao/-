<template>
  <div>
    <el-form :model="spuForm" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input
          v-model="spuForm.spuName"
          placeholder="SPU名称"
          autocomplete="off"
          style="width: 203px"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="brandItem.tmName"
            :value="brandItem.id"
            v-for="brandItem in brandList"
            :key="brandItem.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spuForm.description"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/real/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess"
          :file-list="spuImgList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="spuAttrNameAndAttrId"
          :placeholder="
            UnusedSaleAttrList.length > 0
              ? `还有${UnusedSaleAttrList.length}没被选中`
              : '已经选完了'
          "
        >
          <el-option
            :label="saleAttrItem.name"
            :value="`${saleAttrItem.baseSaleAttrId}:${saleAttrItem.name}`"
            v-for="saleAttrItem in UnusedSaleAttrList"
            :key="saleAttrItem.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 20px"
          @click="addSaleAttr"
          :disabled="UnusedSaleAttrList.length == 0"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spuForm.spuSaleAttrList">
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column
            align="center"
            prop="saleAttrName"
            label="属性名"
            width="150"
          >
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                :key="saleAttrItem.id"
                v-for="(saleAttrItem, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ saleAttrItem.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
                placeholder="请输入"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ _, $index }">
              <HintButton
                title="删除SKU"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spuForm.spuSaleAttrList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="callof">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      // 修改传过来的ID直接覆盖整个数据,添加的话就是收集
      spuForm: {
        spuName: '', //SPU名字
        category3Id: '', //3级ID
        description: '', //文本域
        tmId: '',
        spuImageList: [
          {
            /*   "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0 */
          }
        ], //spu图片列表
        spuSaleAttrList: [
          /*        {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: 'string',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: 'string',
                saleAttrName: 'string',
                saleAttrValueName: 'string',
                spuId: 0
              }
            ]
          } */
        ] //spu销售属性列表
      },
      spuImgList: [], //根据spuID获取的图片列表数据
      brandList: [], //获取的所有品牌列表数据
      saleAttrList: [], //获取的所有销售列表数据
      dialogImageUrl: '',
      dialogVisible: false,
      spuAttrNameAndAttrId: '', //选中那里
      category3Id: ''
      /*     {
  "category3Id": 0,
  "description": "string",
  "id": 0,
  "spuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuName": "string",
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "isChecked": "string",
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
  "tmId": 0
} */
    }
  },
  methods: {
    // 上传成功的回调,新上传的文件是没有我们前面map映射的两个属性的,是因为upload展示图片需要那两个属性,我们才加的
    handleUploadSuccess(response, file, fileList) {
      this.spuImgList = fileList
    },
    // 删除回调
    handleRemove(file, fileList) {
      // 删除之后返回新的图片数组
      this.spuImgList = fileList
    },
    // 放大镜的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 修改函数,页面挂载的时候调用
    async initUpdateSpuFormData(row) {
      this.spuForm.category3Id = row.category3Id
      const spuInfoResponse = await this.$API.spu.get(row.id) //根据传过来的id获取spu的详情
      if (spuInfoResponse.code == 200) this.spuForm = spuInfoResponse.data
      const spuImgListResponse = await this.$API.sku.getSpuImageList(row.id) //根据id获取spu的图片列表
      if (spuImgListResponse.code == 200) {
        const newImgList = spuImgListResponse.data.map((item) => {
          item.url = item.imgUrl
          item.name = item.imgName
          return item
        })
        this.spuImgList = newImgList
      }
      const brandListResponse = await this.$API.trademark.getList() //获取所有的品牌列表数据
      if (brandListResponse.code == 200) this.brandList = brandListResponse.data
      const saleAttrListResponse = await this.$API.spu.getSaleAttrList() //获取所有的销售属性数据
      if (saleAttrListResponse.code == 200)
        this.saleAttrList = saleAttrListResponse.data
    },
    // 添加函数
    async initAddSpuFormData(category3Id) {
      this.spuForm.category3Id = category3Id
      const brandListResponse = await this.$API.trademark.getList() //获取所有的品牌列表数据
      if (brandListResponse.code == 200) this.brandList = brandListResponse.data
      const saleAttrListResponse = await this.$API.spu.getSaleAttrList() //获取所有的销售属性数据
      if (saleAttrListResponse.code == 200)
        this.saleAttrList = saleAttrListResponse.data
    },
    // 添加销售属性
    addSaleAttr() {
      // 1.上面选项框里一改变我们就收到 id:name值,2.然后取出变成一个对象添加到table当中,由于表格中数据源
      //发生改变,下面计算属性重新计算减少
      const [baseSaleAttrId, saleAttrName] =
        this.spuAttrNameAndAttrId.split(':')
      const obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)
      this.spuAttrNameAndAttrId = ''
    },
    //添加销售属性属性值
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 失去焦点和回车的回调
    handleInputConfirm(row) {
      const inputValue = row.inputValue
      console.log(row)
      const baseSaleAttrId = row.baseSaleAttrId
      console.log(baseSaleAttrId)
      if (inputValue.trim() == '') {
        row.inputVisible = false
        return
      }
      if (
        row.spuSaleAttrValueList.some(
          (item) => item.saleAttrValueName == inputValue
        )
      ) {
        this.$message.info('不能输入同样的属性值')
        row.inputValue = ''
        return
      }

      const obj = {
        saleAttrValueName: inputValue,
        baseSaleAttrId: baseSaleAttrId
      }
      row.spuSaleAttrValueList.push(obj)
      row.inputVisible = false
      row.inputValue = ''
    },
    async save() {
      const { spuForm, spuImgList } = this
      spuForm.spuImageList = spuImgList.map((item) => ({
        imgName: item.name,
        imgUrl: item.imgUrl || item.response.data
      }))
      spuForm.spuSaleAttrList.forEach((item) => {
        delete item.inputValue
        delete item.inputVisible
      })
      try {
        await this.$API.spu.addUpdate(spuForm)
        this.$emit('update:visible', 1)
        this.$emit('successBack')
        this.resetData()
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.success('保存失败')
      }
    },
    resetData() {
      this.spuForm = {
        spuName: '', //SPU名字
        category3Id: '', //3级ID
        description: '', //文本域
        tmId: '',
        spuImageList: [], //spu图片列表
        spuSaleAttrList: [] //spu销售属性列表
      }
      this.spuImgList = [] //根据spuID获取的图片列表数据
      this.brandList = [] //获取的所有品牌列表数据
      this.saleAttrList = [] //获取的所有销售列表数据
      this.dialogImageUrl = ''
      this.dialogVisible = false
      this.spuAttrNameAndAttrId = '' //选中那里
      this.category3Id = ''
    },
    callof() {
      this.$emit('update:visible', 1)
      this.resetData()
    }
  },
  computed: {
    UnusedSaleAttrList() {
      /*我们需要的是下面table列表中没有使用的项,这里拿总的销售属性去过滤,
      拿每一个对象去跟对象里的数组进行比较,对象里面的数组没有这个值我们就返回这个对象
      外面一个对象一次,里面数组就要走数组长度次
      //filter:当前返回true就返回当前这个Item
      */
      /*    return this.saleAttrList.filter((saleAttr) => {
        return this.spuForm.spuSaleAttrList.every((useSaleAttr) => {
          return saleAttr.name !== useSaleAttr.saleAttrName
        })
      }) */
      return this.saleAttrList.filter((saleAttr) =>
        this.spuForm.spuSaleAttrList.every(
          (useSaleAttr) => saleAttr.name !== useSaleAttr.saleAttrName
        )
      )
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>