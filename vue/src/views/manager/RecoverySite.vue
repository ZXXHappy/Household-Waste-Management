<template>
  <div>
    <div class="card" style="margin-bottom: 5px">
      <el-input v-model="data.name" prefix-icon="Search" style="width: 240px; margin-right: 10px" placeholder="请输入回收点名称查询"></el-input>
      <el-button type="info" plain @click="load">查询</el-button>
      <el-button type="warning" plain style="margin: 0 10px" @click="reset">重置</el-button>
    </div>
    <div class="card" style="margin-bottom: 5px">
      <el-button type="primary" plain @click="handleAdd" v-if="data.user.role === 'COMMUNITY'">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="card" style="margin-bottom: 5px">
      <el-table stripe :data="data.tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="communityName" label="社区名称"></el-table-column>
        <el-table-column prop="name" label="投放点名称"></el-table-column>
        <el-table-column prop="img" label="投放点照片">
          <template #default="scope">
            <el-image
              style="width: 80px; height: 50px; border-radius: 5px"
              :src="scope.row.img"
              :preview-src-list="[scope.row.img]"
              preview-teleported
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="timeRange" label="开放时间"></el-table-column>
        <el-table-column prop="managerName" label="管理员名称"></el-table-column>
        <el-table-column prop="managerPhone" label="管理员电话"></el-table-column>
        <el-table-column prop="status" label="回收点状态">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.status === '运行中'">运行中</el-tag>
            <el-tag type="danger" v-if="scope.row.status === '已关闭'">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="详情">
          <template #default="scope">
            <el-button type="primary" @click="view(scope.row.content)">查看内容</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template v-slot="scope">
            <el-button type="primary" circle :icon="Edit" @click="handleEdit(scope.row)" v-if="data.user.role === 'COMMUNITY'"></el-button>
            <el-button type="danger" circle :icon="Delete" @click="del(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card" v-if="data.total">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :page-size="data.pageSize"
        v-model:current-page="data.pageNum"
        :total="data.total"
      />
    </div>

    <el-dialog title="回收点信息" v-model="data.formVisible" width="50%" destroy-on-close>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="100px" style="padding: 20px">
        <el-form-item prop="communityId" label="社区">
          <el-select style="width: 100%" v-model="data.form.communityId" @change="onCommunityChange">
            <el-option v-for="item in data.communityList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="投放点名称">
          <el-input v-model="data.form.name" placeholder="请输入投放点名称"></el-input>
        </el-form-item>
        <el-form-item prop="timeRange" label="开放时间">
          <div style="width: 100%; display: flex; align-items: center; gap: 10px">
            <el-time-select
              v-model="data.open"
              style="flex: 1"
              start="08:00"
              step="00:30"
              end="20:30"
              placeholder="选择开始时间"
            />
            <el-time-select
              v-model="data.close"
              style="flex: 1"
              start="08:30"
              step="00:30"
              end="21:00"
              placeholder="选择结束时间"
            />
          </div>
        </el-form-item>
        <el-form-item prop="status" label="回收点状态">
          <el-radio-group v-model="data.form.status">
            <el-radio-button label="运行中" value="运行中"></el-radio-button>
            <el-radio-button label="已关闭" value="已关闭"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="content" label="详情">
          <el-input type="textarea" :rows="5" v-model="data.form.content" placeholder="请输入回收点详情"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="内容" v-model="data.viewVisible" width="50%" destroy-on-close>
      <div style="padding: 20px; white-space: pre-wrap; line-height: 1.8;">{{ data.content }}</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.viewVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";

const formRef = ref()

// ✅ 静态假数据
const allData = [
  { id: 1, communityId: 1, communityName: '阳光社区', name: '阳光社区1号回收站', img: '', timeRange: '08:00 - 18:00', managerName: '张明', managerPhone: '13800001111', status: '运行中', content: '位于社区东门旁，可回收纸箱、塑料瓶、金属等物品。' },
  { id: 2, communityId: 1, communityName: '阳光社区', name: '阳光社区2号回收站', img: '', timeRange: '09:00 - 17:00', managerName: '张明', managerPhone: '13800001111', status: '运行中', content: '位于社区西区停车场，主要回收废旧电器及金属。' },
  { id: 3, communityId: 2, communityName: '绿城社区', name: '绿城社区回收点',   img: '', timeRange: '08:30 - 19:00', managerName: '李华', managerPhone: '13800002222', status: '运行中', content: '绿城社区中心广场附近，接受各类可回收垃圾。' },
  { id: 4, communityId: 3, communityName: '和谐家园', name: '和谐家园回收站',   img: '', timeRange: '08:00 - 20:00', managerName: '王芳', managerPhone: '13800003333', status: '已关闭', content: '因设备维护暂时关闭，预计下周恢复运营。' },
  { id: 5, communityId: 4, communityName: '碧桂园社区', name: '碧桂园回收点', img: '', timeRange: '09:00 - 18:30', managerName: '刘伟', managerPhone: '13800004444', status: '运行中', content: '碧桂园南门入口处，提供积分兑换服务。' },
]

const data = reactive({
  user: { role: 'COMMUNITY', name: '社区管理员' },
  formVisible: false,
  form: {},
  tableData: [...allData],
  pageNum: 1,
  pageSize: 10,
  total: allData.length,
  name: null,
  ids: [],
  communityList: [
    { id: 1, name: '阳光社区' },
    { id: 2, name: '绿城社区' },
    { id: 3, name: '和谐家园' },
    { id: 4, name: '碧桂园社区' },
    { id: 5, name: '春天花园' },
  ],
  open: null,
  close: null,
  rules: {
    communityId: [{ required: true, message: '请选择社区', trigger: 'change' }],
    name:        [{ required: true, message: '请设置名称', trigger: 'blur' }],
  },
  viewVisible: false,
  content: null
})

// ✅ 查询
const load = () => {
  data.tableData = data.name
    ? allData.filter(item => item.name.includes(data.name))
    : [...allData]
  data.total = data.tableData.length
}

const reset = () => {
  data.name = null
  load()
}

const view = (content) => {
  data.content = content
  data.viewVisible = true
}

const onCommunityChange = (id) => {
  const community = data.communityList.find(c => c.id === id)
  data.form.communityName = community?.name || ''
}

const handleAdd = () => {
  data.form = {}
  data.open = null
  data.close = null
  data.formVisible = true
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.open = row.timeRange?.substring(0, 5) || null
  data.close = row.timeRange?.substring(8, 13) || null
  data.formVisible = true
}

// ✅ 保存（只操作本地数据）
const save = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (!data.open) { ElMessage.warning('请选择开始时间'); return }
    if (!data.close) { ElMessage.warning('请选择结束时间'); return }

    data.form.timeRange = data.open + ' - ' + data.close

    if (data.form.id) {
      const index = data.tableData.findIndex(item => item.id === data.form.id)
      if (index !== -1) data.tableData[index] = { ...data.form }
      ElMessage.success('修改成功')
    } else {
      data.tableData.push({ ...data.form, id: Date.now() })
      data.total = data.tableData.length
      ElMessage.success('新增成功')
    }
    data.formVisible = false
  })
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