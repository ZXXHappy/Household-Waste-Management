<template>
  <div style="width: 60%; margin: 10px auto 50px auto;">
    <div style="margin-bottom: 20px">
      <img :src="data.type.img" alt="" style="width: 100%; height: 400px; object-fit: cover;">
    </div>

    <div style="display: flex; gap: 20px;">
      <div style="width: 200px">
        <div style="font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px;">{{ data.type.name }}</div>
        <div v-for="item in data.popularizeList" :key="item.id" style="margin-bottom: 10px">
          <div class="card" style="cursor: pointer; padding: 5px;" @click="changeItem(item.id)">
            <img :src="item.img" alt="" style="width: 100%; height: 100px; object-fit: cover;">
            <div style="margin-top: 5px; font-size: 14px;" class="line1">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <div style="flex: 1">
        <div class="card" style="padding: 20px; margin-bottom: 10px">
          <div style="display: flex; gap: 20px;">
            <div style="width: 300px">
              <img :src="data.cover" alt="" style="width: 100%; height: 240px; margin-bottom: 10px; object-fit: cover;">
              <div style="display: flex; gap: 10px; width: 100%">
                <img @click="clickImg(data.popularize.thumbnail1)" :src="data.popularize.thumbnail1" alt="" style="flex: 1; height: 60px; cursor: pointer; object-fit: cover;">
                <img @click="clickImg(data.popularize.thumbnail2)" :src="data.popularize.thumbnail2" alt="" style="flex: 1; height: 60px; cursor: pointer; object-fit: cover;">
                <img @click="clickImg(data.popularize.thumbnail3)" :src="data.popularize.thumbnail3" alt="" style="flex: 1; height: 60px; cursor: pointer; object-fit: cover;">
              </div>
            </div>
            <div style="flex: 1">
              <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px">{{ data.popularize.title }}</div>
              <div style="margin: 10px 0; font-size: 16px; color: #666">
                <span>浏览量：{{ data.popularize.viewCount }}</span>
              </div>
              <div style="font-size: 16px; text-align: justify; line-height: 26px; color: #666">{{ data.popularize.descr }}</div>
            </div>
          </div>
        </div>

        <div class="card" style="padding: 20px; min-height: 200px;">
          <div v-html="data.popularize.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const data = reactive({
  type: { name: '环保宣传', img: 'https://picsum.photos/1200/400?1' },
  cover: 'https://picsum.photos/400/300?1',
  popularizeList: [
    { id: 1, title: '垃圾分类新规解读', img: 'https://picsum.photos/200/150?1' },
    { id: 2, title: '厨余垃圾处理指南', img: 'https://picsum.photos/200/150?2' }
  ],
  popularize: {
    title: '垃圾分类从我做起',
    viewCount: 128,
    descr: '详细介绍了垃圾分类对环境的意义，以及如何进行家庭垃圾分类投放。',
    content: '<h3>分类详情</h3><p>可回收物、有害垃圾、厨余垃圾、其他垃圾...</p>',
    thumbnail1: 'https://picsum.photos/400/300?1',
    thumbnail2: 'https://picsum.photos/400/300?2',
    thumbnail3: 'https://picsum.photos/400/300?3'
  }
});

const clickImg = (url) => { data.cover = url; };
const changeItem = (id) => { console.log('切换文章 ID:', id); };
</script>

<style scoped>
.card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.line1 { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>