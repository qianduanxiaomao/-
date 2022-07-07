<template>
  <div>
    <el-card>
      <CategorySelect @getAttrList="getSkuList" :addIsShow="addIsShow" />
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isForm == 1">
        <el-button type="primary" icon="el-icon-plus" @click="handleShowSpuForm"
          >添加SPU</el-button
        >
        <el-table :data="skuList" style="width: 100%" value="value">
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton
                title="添加SKU"
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click.native="handleShowSkuForm(row)"
              />
              <HintButton
                title="修改SPU"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click.native="handleAddSpuForm(row)"
              />
              <HintButton
                title="查看SKU列表"
                type="info"
                icon="el-icon-info"
                size="mini"
                @click.native="handleShowSkuInfo(row)"
              />
              <el-popconfirm
                :title="`你确定删除${row.spuName}吗`"
                @confirm="removeAttr(row)"
                confirm-button-text="确定"
                cancel-button-text="取消"
              >
                <HintButton
                  title="删除SPU"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="handleGetSkuList"
          :current-page="page"
          :page-sizes="[2, 3, 4]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,total, sizes"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- .sync适用于子向父 -->
      <SpuForm
        v-show="isForm === 2"
        ref="spu"
        :visible.sync="isForm"
        @successBack="successBack"
      />
      <SkuForm v-show="isForm === 3" :visible.sync="isForm" ref="sku" />
    </el-card>

    <el-dialog
      :title="`${spu.spuName}的SKU属性`"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      v-loading="loading"
    >
      <el-table :data="skuAttrList" style="width: 100%">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格(元)"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量(KG)"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column label="默认图片" width="width" align="center">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt="手机图片"
              style="width: 100px; heigth: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './components/SkuForm.vue'
import SpuForm from './components/SpuForm.vue'
export default {
  name: 'Spu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1: '',
      category2: '',
      category3: '',
      addIsShow: false,
      skuList: [],
      limit: 3,
      page: 1,
      total: 1,
      isForm: 1,
      dialogVisible: false,
      spu: {},
      skuAttrList: [],
      loading: null
    }
  },
  watch: {
    // 控制三级联动的可操作性  简写 不需要深度监视的时候可以简写
    isForm(newVle, _) {
      if (newVle !== 1) {
        this.addIsShow = true
        return
      }
      this.addIsShow = false
    }
    /*    isForm:{  完整写法
      deep:true
      handler(newVle,oldVle){
            if (newVle !== 1) {
        this.addIsShow = true
        return
      }
      this.addIsShow = false
      }
    } */
  },
  methods: {
    getSkuList({ category, level }) {
      if (level == 1) {
        this.category2 = ''
        this.category3 = ''
        this.skuList = ''
        this.category1 = category
      } else if (level == 2) {
        this.category3 = ''
        this.skuList = ''
        this.category2 = category
      } else {
        this.category3 = category
        this.handleGetSkuList()
      }
    },
    async handleGetSkuList(pager = 1) {
      this.page = pager
      const { page, limit, category3 } = this
      try {
        const response = await this.$API.spu.getList(page, limit, category3)
        this.skuList = response.data.records
        this.total = response.data.total
      } catch (error) {
        throw error
      }
    },
    handleSizeChange(size) {
      this.limit = size
      this.handleGetSkuList()
    },
    // 点击添加spu按钮
    handleShowSpuForm() {
      //添加只有2个请求函数
      this.flag = false
      this.isForm = 2
      this.$refs.spu.initAddSpuFormData(this.category3)
    },
    //点击修改spu按钮
    handleAddSpuForm(row) {
      //修改有4个请求函数
      this.isForm = 2
      this.flag = true
      this.$refs.spu.initUpdateSpuFormData(row)
    },
    // 点击添加sku按钮,要传过来个row,给哪个spu添加sku
    handleShowSkuForm(row) {
      this.isForm = 3
      this.$refs.sku.initUpdateSkuFormData(row, this.category1, this.category2)
    },
    // 那边保存成功的回调
    successBack() {
      if (this.flag) this.handleGetSkuList(this.page)
      else this.handleGetSkuList()
      this.flag = null
    },
    // 点击删除的回调
    async removeAttr(row) {
      try {
        await this.$API.spu.remove(row.id)
        this.$message.success('删除成功')
        // 为了防止删除的那一页没有数据了,获取不到,就判断当前页面页面的数组长度,小于一就获取上一页的数据,大于1就获取当前页
        this.handleGetSkuList(
          this.skuList.length > 1 ? this.page : this.page - 1
        )
      } catch (error) {
        this.$message.error(error)
      }
    },
    // dialog的回调
    async handleShowSkuInfo(row) {
      this.spu = row
      this.dialogVisible = true
      this.loading = true
      try {
        const result = await this.$API.sku.getListBySpuId(row.id)
        this.loading = false //配置loading
        if (result.code == 200) this.skuAttrList = result.data
      } catch (error) {
        this.$message.error('网络繁忙')
      }
    },
    //dialog关闭前的回调
    handleBeforeClose(done) {
      this.skuAttrList = null
      this.loading = null
      done()
    }
  }
}
</script>

<style>
</style>