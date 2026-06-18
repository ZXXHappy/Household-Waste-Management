<template>
  <div>
    <div class="card search-card">
      <el-input v-model="data.title" prefix-icon="Search" class="search-input" placeholder="请输入公告标题查询"></el-input>
      <el-button type="info" plain @click="load">查询</el-button>
      <el-button type="warning" plain style="margin: 0 10px" @click="reset">重置</el-button>
    </div>
    <div class="card action-card">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="card table-card">
      <el-table stripe :data="data.tableData" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="公告标题" />
        <el-table-column prop="content" label="公告内容" show-overflow-tooltip />
        <el-table-column prop="time" label="发布时间" />
        <el-table-column label="操作" width="120" fixed="right">
          <template v-slot="scope">
            <el-button type="primary" size="small" circle :icon="Edit" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" size="small" circle :icon="Delete" @click="del(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card pagination-card" v-if="data.total">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :page-size="data.pageSize"
        v-model:current-page="data.pageNum"
        :total="data.total"
      />
    </div>

    <el-dialog title="公告信息" v-model="data.formVisible" width="40%" destroy-on-close>
      <el-form ref="form" :model="data.form" label-width="70px" style="padding: 20px">
        <el-form-item prop="title" label="公告标题">
          <el-input v-model="data.form.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="公告内容">
          <el-input type="textarea" :rows="4" v-model="data.form.content" placeholder="请输入公告内容"></el-input>
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
import { Delete, Edit } from "@element-plus/icons-vue";

// ✅ 静态假数据
const allData = [
  { id: 1, title: '平台上线公告',       content: '生活垃圾管理平台正式上线，欢迎各社区积极参与垃圾分类工作！',     time: '2026-06-18 10:00' },
  { id: 2, title: '积分兑换活动通知',   content: '即日起开放积分兑换功能，用户可凭回收积分兑换生活物品。',         time: '2026-06-15 09:00' },
  { id: 3, title: '垃圾分类培训通知',   content: '本周六上午9点在社区活动中心开展垃圾分类知识培训，请居民踊跃参加。', time: '2026-06-10 08:30' },
  { id: 4, title: '系统维护公告',       content: '平台将于本周日凌晨2点至4点进行系统维护，届时暂停服务，敬请谅解。', time: '2026-06-05 14:00' },
  { id: 5, title: '回收点新增通知',     content: '岳塘区新增3个垃圾回收点，具体位置请在回收点信息页面查看。',       time: '2026-06-01 10:00' },
]

const data = reactive({
  formVisible: false,
  form: {},
  tableData: [...allData],
  pageNum: 1,
  pageSize: 10,
  total: allData.length,
  title: null,
  ids: []
})

// ✅ 查询（在假数据里过滤）
const load = () => {
  if (data.title) {
    data.tableData = allData.filter(item => item.title.includes(data.title))
  } else {
    data.tableData = [...allData]
  }
  data.total = data.tableData.length
}

const reset = () => {
  data.title = null
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

// ✅ 保存（只操作本地数据）
const save = () => {
  const now = new Date()
  const time = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`

  if (data.form.id) {
    const index = data.tableData.findIndex(item => item.id === data.form.id)
    if (index !== -1) data.tableData[index] = { ...data.form }
    ElMessage.success('修改成功')
  } else {
    data.tableData.unshift({ ...data.form, id: Date.now(), time })
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
.search-card, .action-card {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.search-input {
  width: 240px;
  margin-right: 10px;
}

.table-card {
  margin-bottom: 15px;
  overflow: hidden;
}

.pagination-card {
  display: flex;
  justify-content: center;
}
</style>