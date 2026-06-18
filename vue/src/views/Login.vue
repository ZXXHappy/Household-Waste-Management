<template>
  <div class="login-container">
    <div class="login-box">
      <div style="font-weight: bold; font-size: 24px; text-align: center; margin-bottom: 30px; color: #65b57a">欢 迎 登 录</div>
      <el-form :model="data.form">
        <el-form-item>
          <el-input :prefix-icon="User" size="large" v-model="data.form.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input show-password :prefix-icon="Lock" size="large" v-model="data.form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select size="large" v-model="data.form.role" style="width: 100%">
            <el-option value="USER" label="普通用户"></el-option>
            <el-option value="COMMUNITY" label="社区管理员"></el-option>
            <el-option value="ADMIN" label="超级管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="large" type="primary" style="width: 100%" @click="login">登 录</el-button>
        </el-form-item>
        <div style="text-align: right">
          还没有账号？请 <a style="color: #65b57a" href="/register">注册</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import router from "@/router/index.js"; // 2. 重新引入路由组件

const data = reactive({
  form: {
    username: '',
    password: '',
    role: 'USER'
  }
})

// 3. 编写纯前端跳转逻辑（跳过后端接口请求）
const login = () => {
  // 模拟存储一个假的登录用户数据到缓存，防止 Home 页面有权限拦截
  localStorage.setItem('xm-user', JSON.stringify({ username: data.form.username || 'test', role: data.form.role }))

  // 直接根据当前选中的角色进行页面跳转
  if (data.form.role === 'USER') {
    router.push('/front/home')
  } else if (data.form.role === 'ADMIN') {
    router.push('/manager/home')
  } else if (data.form.role === 'COMMUNITY') {
    router.push('/manager/home')
  }
}
// 在登录逻辑或者项目启动时，写入这行数据
localStorage.setItem('xm-user', JSON.stringify({
  id: 1,
  name: '测试用户',
  role: 'USER',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' // 随便一张图片地址
}));
</script>

<style scoped>
.login-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/imgs/bg.jpg");
  background-size: cover;
}
.login-box {
  width: 350px;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.5);
}
</style>