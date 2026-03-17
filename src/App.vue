<template>
  <div class="app-container">
    <h1>测试数据生成器</h1>
    <el-row :gutter="16">
      <el-col :span="12">
        <IdCardGenerator />
      </el-col>
      <el-col :span="12">
        <CreditCodeGenerator />
      </el-col>
      <el-col :span="12">
        <PhoneGenerator />
      </el-col>
      <el-col :span="12">
        <BankCardGenerator />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import IdCardGenerator from './components/IdCardGenerator.vue'
import CreditCodeGenerator from './components/CreditCodeGenerator.vue'
import PhoneGenerator from './components/PhoneGenerator.vue'
import BankCardGenerator from './components/BankCardGenerator.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
  min-width: 1024px;
}

h1 {
  text-align: center;
  margin-bottom: 32px;
  font-size: 28px;
  color: #333;
}

.el-row {
  row-gap: 16px;
}

.el-col {
  margin-bottom: 16px;
}
</style>
