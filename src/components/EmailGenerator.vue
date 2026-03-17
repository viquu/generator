<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">电子邮箱</div>
    </template>
    <div class="generator-content">
      <el-input
        v-model="email"
        placeholder="点击生成按钮或手动输入"
        size="large"
      />
      <div class="button-group">
        <el-button type="success" :loading="generating" @click="handleGenerate">
          随机生成
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateEmail } from '../utils/email'
import { copyToClipboard } from '../utils/clipboard'

const email = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    email.value = generateEmail()
    const copied = await copyToClipboard(email.value)
    if (copied) {
      ElMessage.success('已生成并复制到剪贴板')
    } else {
      ElMessage.warning('已生成，但复制失败，请手动复制')
    }
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.card-header {
  font-weight: 600;
  font-size: 16px;
}

.generator-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
}
</style>
