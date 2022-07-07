<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="handleAddTrademark"
      >添加</el-button
    >
    <el-table style="width: 100%" border :data="trademark">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column
        prop="prop"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            alt="品牌Logo"
            style="width: 80px; heigth: 70px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            @click="handleChangeTrademark(row)"
            >修改</el-button
          >
          <el-button type="danger" size="mini" @click="handleRemoveTR(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange"    -->
    <!-- 页面展示多少条,一页多少条数据,当前页,总数据 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getPageDataList"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next,->,jumper,sizes,total"
      :total="total"
      style="text-align: center"
    >
    </el-pagination>
    <!-- 添加表单 -->
    <el-dialog
      :title="tmform.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmform" :rules="rules" ref="tmform">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmform.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="110px" prop="logoUrl">
        </el-form-item>
        <el-upload
          class="avatar-uploader"
          action="/real/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          align="center"
        >
          <img v-if="tmform.logoUrl" :src="tmform.logoUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过2M
          </div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddOrChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Brand',
  data() {
    return {
      page: 1,
      limit: 3,
      trademark: [],
      total: 1,
      dialogFormVisible: false, //控制dialog是否显示
      tmform: {
        tmName: '', //收集表单数据
        logoUrl: '' //图片的网络地址
      },
      rules: {
        // 校验规则
        //上面form表单收集到这里,每个item收集prop
        tmName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        logoUrl: [
          //upload会在统一校验的时候生效
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.getPageDataList()
  },
  methods: {
    // 挂载发送请求的回调
    async getPageDataList(page = 1) {
      this.page = page
      try {
        const response = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        )
        this.trademark = response.data.records
        this.total = response.data.total
      } catch (error) {
        Message({
          message: '请求超时',
          type: 'error'
        })
        throw error
      }
    },
    // 页面长度发生改变时的回调
    handleSizeChange(size) {
      this.limit = size
      this.getPageDataList()
    },
    // 上传图片的流程:1.上传图片到服务器存储,服务器会返回一个真实地址的路径,然后在点添加发送这个对象到后台
    // 上传完成的回调
    handleAvatarSuccess(res, file) {
      this.tmform.logoUrl = res.data //收集真实图片地址进对象
      console.log(res.data)
    },
    // 上传之前的回调
    beforeAvatarUpload(file) {
      const imgType = ['image/jpeg', 'image/png', 'image/gif']
      const isRule = imgType.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isRule) {
        this.$message.error('上传头像图片格式不合法!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isRule && isLt2M
    },
    // 添加按钮的回调
    handleAddTrademark() {
      this.tmform.tmName = ''
      this.tmform.logoUrl = ''
      this.dialogFormVisible = true
    },
    // 修改按钮的回调
    handleChangeTrademark(row) {
      this.dialogFormVisible = true
      this.tmform = { ...row } //浅拷贝:新的数据改变不影响旧的数据
    },
    // 取消的回调,解决点了修改按钮再点取消在点添加页面显示错误的BUG
    handleCancel() {
      this.dialogFormVisible = false
      this.tmform.id = ''
    },
    // 点击确定添加商品或修改商品的回调
    handleAddOrChange() {
      // 调用验证方法,统一验证
      this.$refs.tmform.validate(async (valid) => {
        if (valid) {
          const { tmform } = this
          try {
            await this.$API.trademark.addOrUpdateTrademark(tmform)
            this.$message.success(tmform.id ? '修改成功' : '添加成功')
            this.getPageDataList(tmform.id ? this.page : 1)
            this.dialogFormVisible = false
          } catch (error) {
            this.$message.error(tmform.id ? '修改失败' : '添加失败')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //  删除商品的回调
    handleRemoveTR(row) {
      this.$confirm(`你确定要删除${row.tmName}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await this.$API.trademark.removeTrademark(row.id)
            this.getPageDataList(
              this.trademark.length > 1 ? this.page : this.page - 1
            )
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } catch (error) {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>