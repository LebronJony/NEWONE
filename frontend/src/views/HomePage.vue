<template>
  <section class="hero">
    <div class="hero-inner">
      <h1>中国历代皇室家族</h1>
      <p class="hero-sub">
        从秦朝到清朝，两千余年的王朝更迭中，<br>
        皇室家族的兴衰与血脉传承，构成了中国历史最深邃的底色。
      </p>
      <div class="hero-meta">
        <span>🏛️ {{ dynasties.length }} 个主要王朝</span>
        <span>📜 跨越 2100+ 年</span>
        <span>👑 数十个皇室家族</span>
      </div>
    </div>
  </section>

  <section class="intro-section">
    <p>
      本网站系统性梳理中国历史上从秦汉到明清的主要王朝皇室家族背景。
      每个朝代独立成篇，涵盖家族渊源、开国历程、鼎盛治理、著名成员、世系脉络与最终衰落。
    </p>
  </section>

  <section class="dynasty-list-section">
    <div class="dynasty-list">
      <router-link v-for="(d, idx) in dynasties" :key="d.id"
        :to="'/dynasty/' + d.id" class="dynasty-row" :class="'dynasty-row--' + (idx % 2 === 0 ? 'left' : 'right')">
        <div class="row-visual" :class="d.imageGradient">
          <span class="row-visual-char">{{ d.name.charAt(0) }}</span>
        </div>
        <div class="row-body">
          <div class="row-header">
            <h2 class="row-name">{{ d.name }}</h2>
            <span class="row-surname">{{ d.surname }}</span>
          </div>
          <div class="row-years">{{ formatYears(d.yearStart, d.yearEnd) }}</div>
          <p class="row-desc">{{ d.summary }}</p>
          <span class="row-link">查看完整内容 →</span>
        </div>
      </router-link>
    </div>
  </section>

  <footer class="footer">
    <p>中国历代皇室家族 · 从秦到清</p>
    <p style="margin-top:8px;font-size:0.8rem;">内容依据正史史料整理，仅供学习参考。</p>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDynasties } from '../api/dynasty'
import type { DynastyListDTO } from '../types'

const dynasties = ref<DynastyListDTO[]>([])

onMounted(async () => {
  try {
    dynasties.value = await getDynasties()
  } catch (e) {
    console.error('Failed to load dynasties', e)
  }
})

function formatYears(start: number, end: number): string {
  const s = start < 0 ? `${Math.abs(start)} BC` : `${start}`
  const e = end < 0 ? `${Math.abs(end)} BC` : `${end}`
  return `${s} – ${e}`
}
</script>
