<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">轮播组列表</div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"
        v-loading="loading"
      ></lin-table>
    </div>

    <!-- 编辑页面 -->
    <banner-edit v-else @editClose="editClose" :editBannerID="editBannerID"></banner-edit>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :page-sizes="[5, 10 , 20]"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_nums"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import banner from '@/models/banner'
import LinTable from '@/components/base/table/lin-table'
import BannerEdit from './BannerEdit'

export default {
  components: {
    LinTable,
    BannerEdit,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'title', label: '名称' },
        { prop: 'description', label: '描述' },
      ],
      pageCount: 5,
      currentPage: 1,
      total_nums: 0,
      refreshPagination: true,
      tableData: [],
      operate: [],
      showEdit: false,
      editBannerID: 1,
      loading: false,
    }
  },
  async created() {
    this.loading = true
    this.getBanners()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        auth: '删除图书',
      },
    ]
    this.loading = false
  },
  methods: {
    async getBanners() {
      try {
        const res = await banner.getBanners(this.currentPage, this.pageCount)
        this.tableData = res.collection
        this.total_nums = res.total_nums
      } catch (error) {
        if (error.error_code === 10020) {
          this.tableData = []
        }
      }
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getBanners()
      this.loading = false
    },
    async handleSizeChange(val) {
      this.pageCount = val
      this.loading = true
      await this.getBanners()
      this.loading = false
    },
    handleEdit(val) {
      console.log('val', val)
      this.showEdit = true
      this.refreshPagination = false
      this.editBannerID = val.row.id
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await banner.delBanner(val.row.id)
        if (res.error_code === 0) {
          this.getBanners()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        }
      })
    },
    rowClick() {},
    editClose() {
      this.showEdit = false
      this.getBanners()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
