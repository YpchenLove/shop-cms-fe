<template>
  <div class="container">
    <div class="title">
      <span>添加子轮播图</span>
      <span class="back" @click="back">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="类型" prop="type">
              <el-input size="medium" v-model="form.type" placeholder="请填写轮播图类型"></el-input>
            </el-form-item>

            <el-form-item label="名称" prop="title">
              <el-input size="medium" v-model="form.title" placeholder="请填写轮播图名称"></el-input>
            </el-form-item>

            <el-form-item label="图片" prop="imageUrl">
              <upload-imgs ref="uploadEle" :maxNum="maxNum" />
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
  </div>
</template>

<script>
import bannerItem from '@/models/banner-item'
import UploadImgs from '@/components/base/upload-imgs'

export default {
  components: {
    UploadImgs,
  },
  props: {
    bannerID: {
      type: Number,
    },
  },
  data() {
    return {
      initData: [],
      maxNum: 1,
      form: {
        title: '',
        description: '',
        type: '',
        image: '',
      },
    }
  },
  methods: {
    async submitForm(formName) {
      try {
        const imgUrl = await this.$refs.uploadEle.getValue()
        const params = Object.assign(this.form, {
          bannerId: this.bannerID,
          image: imgUrl[0].display,
        })
        const res = await bannerItem.addBannerItem(params)
        if (res.error_code === 0) {
          this.$message.success(`${res.msg}`)
          this.resetForm(formName)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.uploadEle.clear()
    },
    // 关闭新增页面
    back() {
      this.$emit('addClose')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
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
