<template>
  <div>
    <!-- title -->
    <div v-if="!showAdd && !showEdit" class="container">
      <div class="title">
        <span>修改轮播图模块</span>
        <span class="back" @click="back">
          <i class="iconfont icon-fanhui"></i> 返回
        </span>
      </div>
      <el-divider></el-divider>
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form
              :model="form"
              status-icon
              ref="form"
              label-width="100px"
              v-loading="loading"
              @submit.native.prevent
            >
              <el-form-item label="模块名称" prop="title">
                <el-input size="medium" v-model="form.title" placeholder="请填写轮播图模块名称"></el-input>
              </el-form-item>

              <el-form-item label="简介" prop="description">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8}"
                  placeholder="请输入简介"
                  v-model="form.description"
                ></el-input>
              </el-form-item>
              <el-form-item class="submit">
                <el-button type="success" @click="submitForm('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <!-- banner-items -->
      <div class="title">
        <span>子轮播图列表</span>
        <el-button type="success" style="margin-left: 50px" @click="handleAdd()" plain>添加子轮播图</el-button>
      </div>
      <!-- items -->
      <div class="wrap">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column fixed prop="id" label="ID" width="50"></el-table-column>
          <el-table-column fixed prop="title" label="名称" width="150"></el-table-column>
          <el-table-column prop="imageUrl" label="图片" width="250">
            <template slot-scope="scope">
              <el-image style="width:230px ;height: 100px" :src="scope.row.image" fit="contain"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="简介"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>

          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="primary" size="small" plain>编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger" size="small" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增子轮播图页面  -->
    <banner-item-add @addClose="close('add')" v-else-if="showAdd" :bannerID="editBannerID"></banner-item-add>
    <!-- 编辑子轮播图页面 -->
    <banner-item-edit
      @addClose="close('edit')"
      v-else-if="showEdit"
      :bannerID="editBannerID"
      :bannerItemId="bannerItemId"
    ></banner-item-edit>
  </div>
</template>

<script>
import banner from '@/models/banner'
import bannerItem from '@/models/banner-item'
import BannerItemAdd from './banner-item/BannerItemAdd'
import BannerItemEdit from './banner-item/BannerItemEdit'

export default {
  components: {
    BannerItemAdd,
    BannerItemEdit,
  },
  props: {
    editBannerID: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      showAdd: false, // 显示新增页面
      showEdit: false, // 显示修改页面
      bannerItemId: null, // 要修改的item的id
      tableData: null,
      // 下面是提交的表单数据
      form: {
        title: '',
        description: '',
      },
    }
  },
  async mounted() {
    this.getBanner()
  },
  methods: {
    async getBanner() {
      this.loading = true
      const res = await banner.getBannerById(this.editBannerID)
      this.tableData = res.items
      this.form = {
        title: res.title,
        description: res.description,
      }
      this.loading = false
    },
    async submitForm() {
      const res = await banner.updateBanner(this.editBannerID, this.form)
      if (res.error_code === 0) {
        this.$message.success(`${res.msg}`)
        this.$emit('editClose')
      }
    },
    // 新增子轮播图
    handleAdd() {
      this.showAdd = true
    },
    // 编辑子轮播图
    handleEdit(row) {
      this.showEdit = true
      this.bannerItemId = row.id
    },
    // 删除子轮播图
    async handleDelete(row) {
      this.$confirm('此操作将永久删除该子轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await bannerItem.delBannerItem(row.id)
        if (res.error_code === 0) {
          this.getBanner()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 接收到新增或者修改页面的关闭
    close(type) {
      if (type === 'add') {
        this.showAdd = false
      } else {
        this.showEdit = false
      }
      this.getBanner()
    },
    back() {
      this.$emit('editClose')
    },
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
