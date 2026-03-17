<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">统一社会信用代码</div>
    </template>
    <div class="generator-content">
      <el-input
        v-model="creditCode"
        placeholder="点击生成按钮或手动输入"
        size="large"
      />
      <div class="button-group">
        <el-button type="success" :loading="generating" @click="handleGenerate">
          随机生成
        </el-button>
        <el-button type="primary" :disabled="!creditCode" @click="handleValidate">
          校验
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateCreditCode, validateCreditCode } from '../utils/creditCode'
import { copyToClipboard } from '../utils/clipboard'

const creditCode = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    creditCode.value = generateCreditCode()
    const copied = await copyToClipboard(creditCode.value)
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

function handleValidate() {
  const result = validateCreditCode(creditCode.value)
  if (result.isValid) {
    ElMessage.success(result.message)
  } else {
    ElMessage.warning(result.message)
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
