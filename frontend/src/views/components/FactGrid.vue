<template>
  <div class="fact-grid">
    <div class="fact-card">
      <div class="fact-label">皇室姓氏</div>
      <div class="fact-value">{{ detail.surname }}</div>
    </div>
    <div class="fact-card">
      <div class="fact-label">开国皇帝</div>
      <div class="fact-value">{{ detail.founder }}</div>
    </div>
    <div class="fact-card">
      <div class="fact-label">末代君主</div>
      <div class="fact-value">{{ detail.lastRuler }}</div>
    </div>
    <div class="fact-card">
      <div class="fact-label">存续</div>
      <div class="fact-value">{{ detail.duration }}</div>
    </div>
    <div class="fact-card">
      <div class="fact-label">君主数</div>
      <div class="fact-value">{{ detail.rulers?.length || 0 }} 位</div>
    </div>
    <div class="fact-card">
      <div class="fact-label">都城</div>
      <div class="fact-value">{{ detail.capital }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DynastyDetail } from '../../types'
defineProps<{ detail: DynastyDetail }>()
</script>
