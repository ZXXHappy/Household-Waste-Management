<template>
  <div class="main-content">
    <div class="site-detail-header">
      <div class="breadcrumb">
        <el-link :underline="false" @click="router.go(-1)" class="back-link">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回</span>
        </el-link>
        <div class="breadcrumb-path">
          <div class="breadcrumb-item">
            <el-icon><House /></el-icon>
            <span>{{ data.recoverySite.communityName }}</span>
          </div>
          <div class="separator-arrow"><el-icon><ArrowRight /></el-icon></div>
          <div class="breadcrumb-item current">
            <el-icon><Place /></el-icon>
            <span>{{ data.recoverySite.name }}</span>
          </div>
        </div>
      </div>

      <div class="site-banner">
        <img :src="data.recoverySite.img" alt="" class="site-image">
        <div class="site-banner-overlay"></div>
      </div>
    </div>

    <div class="site-content-container">
      <div class="site-sidebar">
        <div class="sidebar-header">
          <h3>可回收物品</h3>
          <div class="recycling-icon"><el-icon><Goods /></el-icon></div>
        </div>
        <div class="recyclable-items">
          <div v-for="item in data.recycleGarbageList" :key="item.id" class="card recyclable-card">
            <div class="recyclable-img"><img :src="item.img" alt=""></div>
            <div class="recyclable-info">
              <h4 class="recyclable-name">{{ item.name }}</h4>
              <div class="recyclable-desc">{{ item.descr }}</div>
              <div class="recyclable-points">
                <el-icon><GoldMedal /></el-icon>
                <span>{{ item.points }}积分/{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="site-main-content">
        <div class="card site-info-card">
          <div class="card-header">
            <h3 class="site-title">{{ data.recoverySite.name }}</h3>
            <div class="action-buttons">
              <el-button type="primary" @click="data.formVisible = true" class="action-btn disposal-btn">投放垃圾</el-button>
              <el-button type="success" @click="data.formVisible1 = true" class="action-btn recycling-btn">回收申请</el-button>
            </div>
          </div>
          <div class="site-details">
            <div class="detail-item"><el-icon class="detail-icon"><House /></el-icon><span>所属社区：{{ data.recoverySite.communityName }}</span></div>
            <div class="detail-item"><el-icon class="detail-icon"><Clock /></el-icon><span>开放时间：{{ data.recoverySite.timeRange }}</span></div>
            <div class="detail-item"><el-icon class="detail-icon"><Avatar /></el-icon><span>负责人：{{ data.recoverySite.managerName }}</span></div>
            <div class="detail-item"><el-icon class="detail-icon"><Phone /></el-icon><span>联系电话：{{ data.recoverySite.managerPhone }}</span></div>
          </div>
        </div>

        <div class="card site-content-card">
          <div class="content-header"><h3>回收点详情</h3></div>
          <div class="site-content" v-html="data.recoverySite.content"></div>
        </div>
      </div>
    </div>

    <el-dialog title="提示" v-model="data.formVisible" width="30%">
      <span>模拟投放界面：请上传照片</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import router from "@/router/index.js";
import { ArrowLeft, ArrowRight, House, Place, Goods, GoldMedal, Clock, Avatar, Phone } from '@element-plus/icons-vue';

const data = reactive({
  recoverySite: {
    name: 'A区智能回收站',
    communityName: '幸福花园社区',
    timeRange: '08:00-20:00',
    managerName: '张主任',
    managerPhone: '13900001111',
    img: 'https://picsum.photos/1200/400',
    content: '<p>本回收站配备智能分类垃圾桶，支持自动感应，环境整洁，请居民分类投放。</p>'
  },
  recycleGarbageList: [
    { id: 1, name: '塑料瓶', descr: 'PET材质，请洗净压扁。', points: 2, unit: '个', img: 'https://picsum.photos/200/150?1' },
    { id: 2, name: '旧报纸', descr: '纸类回收，保持干燥。', points: 5, unit: 'kg', img: 'https://picsum.photos/200/150?2' }
  ],
  formVisible: false,
  formVisible1: false
})
</script>
<style scoped>
.main-content {
max-width: 1200px;
margin: 0 auto;
padding-bottom: 50px;
}

.site-detail-header {
margin-bottom: 30px;
}

.breadcrumb {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 20px;
padding: 15px 20px;
background: white;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-link {
display: flex;
align-items: center;
gap: 8px;
color: #2196F3;
font-weight: 500;
font-size: 15px;
transition: all 0.3s ease;
padding: 8px 15px;
border-radius: 20px;
background-color: rgba(33, 150, 243, 0.1);
}

.back-link:hover {
background-color: rgba(33, 150, 243, 0.2);
transform: translateX(-5px);
}

.breadcrumb-path {
display: flex;
align-items: center;
flex-wrap: wrap;
}

.breadcrumb-item {
display: flex;
align-items: center;
gap: 8px;
color: #666;
font-size: 15px;
padding: 5px 12px;
border-radius: 20px;
transition: all 0.3s ease;
}

.breadcrumb-item.current {
background: linear-gradient(to right, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1));
color: #333;
font-weight: 600;
}

.separator-arrow {
margin: 0 5px;
color: #ccc;
}

.separator-arrow .el-icon {
font-size: 14px;
}

.site-banner {
position: relative;
height: 300px;
overflow: hidden;
border-radius: 15px;
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.site-image {
width: 100%;
height: 100%;
object-fit: cover;
}

.site-banner-overlay {
position: absolute;
bottom: 0;
left: 0;
right: 0;
height: 100px;
background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.site-content-container {
display: flex;
gap: 30px;
}

.site-sidebar {
width: 300px;
flex-shrink: 0;
}

.sidebar-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 20px;
}

.sidebar-header h3 {
font-size: 20px;
font-weight: 600;
margin: 0;
color: #333;
background: linear-gradient(135deg, #4CAF50, #2196F3);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
}

.recycling-icon {
width: 40px;
height: 40px;
border-radius: 50%;
background: linear-gradient(135deg, #4CAF50, #2196F3);
display: flex;
align-items: center;
justify-content: center;
}

.recycling-icon .el-icon {
font-size: 20px;
color: white;
}

.recyclable-items {
display: flex;
flex-direction: column;
gap: 15px;
}

.recyclable-card {
border-radius: 12px;
overflow: hidden;
box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
transition: all 0.3s ease;
border: none;
}

.recyclable-card:hover {
transform: translateY(-5px);
box-shadow: 0 8px 20px rgba(76, 175, 80, 0.15);
}

.recyclable-img {
height: 150px;
overflow: hidden;
}

.recyclable-img img {
width: 100%;
height: 100%;
object-fit: cover;
transition: all 0.5s ease;
}

.recyclable-card:hover .recyclable-img img {
transform: scale(1.1);
}

.recyclable-info {
padding: 15px;
}

.recyclable-name {
font-size: 16px;
font-weight: 600;
margin: 0 0 10px 0;
color: #333;
}

.recyclable-desc {
color: #666;
font-size: 13px;
margin-bottom: 12px;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
}

.recyclable-points {
display: flex;
align-items: center;
gap: 5px;
color: #FFE082;
font-weight: 600;
font-size: 14px;
}

.site-main-content {
flex: 1;
display: flex;
flex-direction: column;
gap: 20px;
}

.site-info-card, .site-content-card {
border-radius: 12px;
overflow: hidden;
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
transition: all 0.3s ease;
border: none;
}

.card-header {
display: flex;
align-items: center;
justify-content: space-between;
padding: 20px;
border-bottom: 1px solid #f0f0f0;
}

.site-title {
font-size: 20px;
font-weight: 600;
margin: 0;
color: #333;
}

.action-buttons {
display: flex;
gap: 10px;
}

.action-btn {
border-radius: 20px;
display: flex;
align-items: center;
gap: 5px;
border: none;
transition: all 0.3s ease;
}

.disposal-btn {
background: linear-gradient(135deg, #4CAF50, #2196F3);
}

.disposal-btn:hover {
background: linear-gradient(135deg, #388E3C, #1976D2);
transform: translateY(-3px);
box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.recycling-btn {
background: linear-gradient(135deg, #FFE082, #FFD54F);
color: #333;
}

.recycling-btn:hover {
background: linear-gradient(135deg, #FFECB3, #FFD54F);
transform: translateY(-3px);
box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.site-details {
padding: 20px;
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 15px;
}

.detail-item {
display: flex;
align-items: center;
}

.detail-icon {
color: #2196F3;
margin-right: 8px;
font-size: 18px;
}

.detail-label {
color: #666;
margin-right: 5px;
}

.detail-value {
color: #333;
font-weight: 500;
}

.content-header {
padding: 20px;
border-bottom: 1px solid #f0f0f0;
}

.content-header h3 {
font-size: 18px;
font-weight: 600;
margin: 0;
color: #333;
}

.site-content {
padding: 20px;
color: #666;
line-height: 1.6;
}

.custom-dialog :deep(.el-dialog__header) {
padding: 15px 20px;
border-bottom: 1px solid #f0f0f0;
}

.disposal-dialog :deep(.el-dialog__header) {
background: linear-gradient(to right, rgba(76, 175, 80, 0.05), rgba(33, 150, 243, 0.05));
}

.recycling-dialog :deep(.el-dialog__header) {
background: linear-gradient(to right, rgba(255, 236, 179, 0.05), rgba(255, 213, 79, 0.05));
}

.custom-dialog :deep(.el-dialog__title) {
font-weight: 600;
font-size: 18px;
}

.custom-dialog :deep(.el-dialog) {
border-radius: 15px;
overflow: hidden;
}

.dialog-form {
padding: 20px;
}

.custom-upload :deep(.el-upload-list) {
margin-top: 15px;
}

.upload-btn {
display: flex;
align-items: center;
gap: 8px;
padding: 10px 20px;
border-radius: 20px;
background: linear-gradient(135deg, #4CAF50, #2196F3);
color: white;
transition: all 0.3s ease;
cursor: pointer;
}

.upload-btn:hover {
transform: translateY(-2px);
box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
}

.custom-select {
width: 100%;
}

.custom-select :deep(.el-input__wrapper),
.custom-textarea :deep(.el-textarea__wrapper) {
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
border-radius: 10px !important;
transition: all 0.3s ease;
}

.custom-select :deep(.el-input__wrapper):hover,
.custom-textarea :deep(.el-textarea__wrapper):hover {
box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1) !important;
transform: translateY(-2px);
}

.num-input-wrapper {
display: flex;
align-items: center;
gap: 10px;
}

.custom-number :deep(.el-input-number__decrease),
.custom-number :deep(.el-input-number__increase) {
background-color: #f5f5f5;
color: #666;
}

.unit-tag {
padding: 5px 10px;
background-color: #f0f0f0;
border-radius: 5px;
color: #666;
font-size: 13px;
}

.score-display {
display: flex;
align-items: center;
gap: 8px;
}

.score-value {
font-size: 24px;
font-weight: 700;
color: #FFE082;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.score-icon {
color: #FFD54F;
font-size: 20px;
}

.dialog-footer {
display: flex;
justify-content: center;
gap: 15px;
padding: 10px 0;
}

.cancel-btn {
border-radius: 20px;
padding: 9px 20px;
}

.confirm-btn {
border-radius: 20px;
background: linear-gradient(135deg, #4CAF50, #2196F3);
border: none;
padding: 9px 20px;
display: flex;
align-items: center;
gap: 5px;
transition: all 0.3s ease;
}

.confirm-btn:hover {
transform: translateY(-2px);
box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
background: linear-gradient(135deg, #388E3C, #1976D2);
}

@media (max-width: 991px) {
.site-content-container {
flex-direction: column;
}

.site-sidebar {
width: 100%;
}

.site-details {
grid-template-columns: 1fr;
}
}
</style>