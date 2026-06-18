<template>
  <div>
    <div class="card search-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="data.name" prefix-icon="Search" clearable placeholder="请输入社区名称查询"></el-input>
        </el-col>
        <el-col :span="6" style="display: flex; gap: 10px">
          <el-button type="primary" @click="load">
            <el-icon><Search /></el-icon>查询
          </el-button>
          <el-button @click="reset">
            <el-icon><RefreshLeft /></el-icon>重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div class="card action-card" v-if="data.user.role === 'ADMIN'">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增社区
      </el-button>
      <el-button type="danger" @click="delBatch">
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
    </div>

    <div class="card table-view">
      <el-table
        stripe
        border
        :data="data.tableData"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#f8fafc', color: '#606266', fontWeight: '500' }"
        style="width: 100%"
        v-loading="data.loading"
      >
        <el-table-column type="selection" width="55" v-if="data.user.role === 'ADMIN'" />
        <el-table-column prop="name" label="社区名称"></el-table-column>
        <el-table-column prop="address" label="社区地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="img" label="社区图片">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 60px; border-radius: 4px; object-fit: cover;"
              :src="scope.row.img"
              :preview-src-list="[scope.row.img]"
              preview-teleported
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="managerName" label="社区负责人"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right" v-if="data.user.role === 'ADMIN'">
          <template v-slot="scope">
            <el-button type="primary" size="small" circle :icon="Edit" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" size="small" circle :icon="Delete" @click="del(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="data.total">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="data.pageSize"
          v-model:current-page="data.pageNum"
          :total="data.total"
        />
      </div>
    </div>

    <el-dialog title="社区信息" v-model="data.formVisible" width="40%" destroy-on-close>
      <el-form ref="form" :model="data.form" label-width="90px" style="padding: 20px">
        <el-form-item prop="name" label="社区名称">
          <el-input v-model="data.form.name" placeholder="请输入社区名称"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="社区地址">
          <el-input type="textarea" :rows="3" v-model="data.form.address" placeholder="请输入社区地址"></el-input>
        </el-form-item>
        <el-form-item prop="managerId" label="社区负责人">
          <el-select style="width: 100%" v-model="data.form.managerId">
            <el-option
              v-for="item in data.communityAdminList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit, Search, RefreshLeft, Plus } from "@element-plus/icons-vue";

// ✅ 静态假数据
const allData = [
  { id: 1, name: '阳光社区',   address: '湘潭市岳塘区建设路101号', img: '', managerName: '张明', managerId: 1 },
  { id: 2, name: '绿城社区',   address: '湘潭市雨湖区桃花路205号', img: '', managerName: '李华', managerId: 2 },
  { id: 3, name: '和谐家园',   address: '湘潭市岳塘区湘潭大道88号', img: '', managerName: '王芳', managerId: 3 },
  { id: 4, name: '碧桂园社区', address: '湘潭市雨湖区学院路32号',  img: '', managerName: '刘伟', managerId: 4 },
  { id: 5, name: '春天花园',   address: '湘潭市岳塘区芙蓉路56号',  img: '', managerName: '陈静', managerId: 5 },
]

const data = reactive({
  user: { role: 'ADMIN', name: '管理员' },
  formVisible: false,
  form: {},
  tableData: [...allData],
  pageNum: 1,
  pageSize: 10,
  total: allData.length,
  name: null,
  ids: [],
  communityAdminList: [
    { id: 1, name: '张明' },
    { id: 2, name: '李华' },
    { id: 3, name: '王芳' },
    { id: 4, name: '刘伟' },
    { id: 5, name: '陈静' },
  ],
  loading: false
})

// ✅ 查询（在假数据里过滤）
const load = () => {
  if (data.name) {
    data.tableData = allData.filter(item => item.name.includes(data.name))
  } else {
    data.tableData = [...allData]
  }
  data.total = data.tableData.length
}

const reset = () => {
  data.name = null
  load()
}

const handleAdd = () => {
  data.form = {}
  data.formVisible = true
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

// ✅ 保存（只操作本地数据，不请求后端）
const save = () => {
  if (data.form.id) {
    const index = data.tableData.findIndex(item => item.id === data.form.id)
    if (index !== -1) {
      const managerName = data.communityAdminList.find(a => a.id === data.form.managerId)?.name || ''
      data.tableData[index] = { ...data.form, managerName }
    }
    ElMessage.success('修改成功')
  } else {
    const managerName = data.communityAdminList.find(a => a.id === data.form.managerId)?.name || ''
    data.tableData.push({ ...data.form, id: Date.now(), managerName })
    data.total = data.tableData.length
    ElMessage.success('新增成功')
  }
  data.formVisible = false
}

// ✅ 删除（只操作本地数据）
const del = (id) => {
  ElMessageBox.confirm('删除后数据无法恢复，您确定删除吗？', '删除确认', {
    type: 'warning',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消'
  }).then(() => {
    data.tableData = data.tableData.filter(item => item.id !== id)
    data.total = data.tableData.length
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const delBatch = () => {
  if (!data.ids.length) {
    ElMessage.warning('请选择数据')
    return
  }
  ElMessageBox.confirm('删除后数据无法恢复，您确定删除吗？', '删除确认', {
    type: 'warning',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消'
  }).then(() => {
    data.tableData = data.tableData.filter(item => !data.ids.includes(item.id))
    data.total = data.tableData.length
    data.ids = []
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSelectionChange = (rows) => {
  data.ids = rows.map(v => v.id)
}
</script>

<style scoped>
.search-card {
  margin-bottom: 15px;
}

.action-card {
  margin-bottom: 15px;
}

.table-view {
  margin-bottom: 15px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>