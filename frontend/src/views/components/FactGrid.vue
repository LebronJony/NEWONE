<template>
  <div class="fact-section">
    <!-- Dynasty Header Card -->
    <div class="fact-hero" :style="{ background: heroGradient }">
      <div class="hero-content">
        <div class="hero-label">基本档案</div>
        <h2 class="hero-name">{{ detail.name }}</h2>
        <div class="hero-sub">
          <span class="hero-period">{{ detail.period }}</span>
          <span class="hero-sep">·</span>
          <span class="hero-capital">都城 {{ detail.capital }}</span>
        </div>
        <p class="hero-summary">{{ detail.summary }}</p>
      </div>
    </div>

    <!-- Fact Cards Grid -->
    <div class="fact-grid">
      <!-- 皇室姓氏 -->
      <div class="fact-card">
        <div class="fact-icon">╋</div>
        <div class="fact-body">
          <div class="fact-label">皇室姓氏</div>
          <div class="fact-value">{{ detail.surname }}</div>
        </div>
      </div>

      <!-- 开国皇帝 -->
      <div class="fact-card">
        <div class="fact-icon">▲</div>
        <div class="fact-body">
          <div class="fact-label">开国皇帝</div>
          <div class="fact-value">{{ detail.founder }}</div>
        </div>
      </div>

      <!-- 末代君主 -->
      <div class="fact-card">
        <div class="fact-icon">▼</div>
        <div class="fact-body">
          <div class="fact-label">末代君主</div>
          <div class="fact-value">{{ detail.lastRuler }}</div>
        </div>
      </div>

      <!-- 都城 -->
      <div class="fact-card">
        <div class="fact-icon">◉</div>
        <div class="fact-body">
          <div class="fact-label">都城所在地</div>
          <div class="fact-value">{{ detail.capital }}</div>
        </div>
      </div>

      <!-- 君主数 -->
      <div class="fact-card">
        <div class="fact-icon">♛</div>
        <div class="fact-body">
          <div class="fact-label">在位君主</div>
          <div class="fact-value">{{ detail.rulers?.length || 0 }} 位</div>
        </div>
      </div>

      <!-- 存续时间 -->
      <div class="fact-card">
        <div class="fact-icon">◈</div>
        <div class="fact-body">
          <div class="fact-label">存续时间</div>
          <div class="fact-value">{{ detail.duration }}</div>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-num">{{ formatYear(detail.yearStart) }}</span>
        <span class="stat-label">起始年份</span>
      </div>
      <div class="stat-arrow">→</div>
      <div class="stat-item">
        <span class="stat-num">{{ formatYear(detail.yearEnd) }}</span>
        <span class="stat-label">终结年份</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <span class="stat-num">{{ calcSpan(detail.yearStart, detail.yearEnd) }}</span>
        <span class="stat-label">历时</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <span class="stat-num">{{ detail.rulers?.length || 0 }}</span>
        <span class="stat-label">位君主</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DynastyDetail } from '../../types'

const props = defineProps<{ detail: DynastyDetail }>()

const gradientMap: Record<string, string> = {
  'cv-qin': 'linear-gradient(135deg, #2d2d2d, #5a4a3a)',
  'cv-han': 'linear-gradient(135deg, #8b1a1a, #c0392b)',
  'cv-jin': 'linear-gradient(135deg, #4a6741, #6b8e5a)',
  'cv-nanbei': 'linear-gradient(135deg, #5a4a7a, #7a6a9a)',
  'cv-sui': 'linear-gradient(135deg, #8b6914, #b8942e)',
  'cv-tang': 'linear-gradient(135deg, #c0392b, #e67e22)',
  'cv-song': 'linear-gradient(135deg, #2c3e50, #4a6a8a)',
  'cv-yuan': 'linear-gradient(135deg, #6a4a2a, #9a7a4a)',
  'cv-ming': 'linear-gradient(135deg, #8b1a1a, #d4a017)',
  'cv-qing': 'linear-gradient(135deg, #1a3a2a, #2d6a4f)',
}

const heroGradient = gradientMap[props.detail.imageGradient] || gradientMap['cv-qin']

function formatYear(year: number): string {
  if (year === undefined || year === null) return '—'
  return year < 0 ? `${Math.abs(year)} BC` : `${year}`
}

function calcSpan(start: number, end: number): string {
  if (start === undefined || end === undefined) return '—'
  return `${Math.abs(end - start)} 年`
}
</script>

<style scoped>
.fact-section {
  margin-top: 10px;
}

/* Hero Header */
.fact-hero {
  border-radius: 10px;
  padding: 32px 36px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.fact-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.4), transparent);
  pointer-events: none;
}
.hero-content { position: relative; z-index: 1; }
.hero-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.6;
  margin-bottom: 8px;
}
.hero-name {
  font-family: var(--font-title);
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 4px;
  line-height: 1.2;
}
.hero-sub {
  font-size: 0.9rem;
  opacity: 0.75;
  margin-bottom: 12px;
}
.hero-sep { margin: 0 8px; opacity: 0.5; }
.hero-summary {
  font-size: 0.88rem;
  line-height: 1.6;
  opacity: 0.65;
  max-width: 600px;
}

/* Fact Grid */
.fact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 18px;
}
.fact-card {
  background: var(--color-card);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.fact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.fact-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-accent);
  flex-shrink: 0;
}
.fact-body { min-width: 0; }
.fact-label {
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.fact-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  word-break: break-all;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 18px;
  padding: 16px 24px;
  background: var(--color-card);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
.stat-item { text-align: center; }
.stat-num {
  display: block;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-accent);
  line-height: 1.2;
}
.stat-label {
  font-size: 0.72rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.stat-arrow {
  font-size: 1.2rem;
  color: var(--color-border);
}
.stat-sep {
  width: 1px;
  height: 30px;
  background: var(--color-border);
}

@media (max-width: 768px) {
  .fact-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .fact-hero { padding: 24px 20px; }
  .hero-name { font-size: 1.8rem; }
  .stats-bar { flex-wrap: wrap; gap: 12px; }
}
</style>
