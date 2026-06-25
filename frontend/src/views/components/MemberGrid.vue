<template>
  <div class="member-grid">
    <div v-for="m in members" :key="m.id" class="member-card">
      <div class="member-role-badge" :style="{ background: getRoleColor(m.role) }">{{ m.role }}</div>
      <div class="member-name">{{ m.name }}</div>
      <div class="member-title">{{ m.title }} · {{ m.lifespan }}</div>
      <div class="member-desc">{{ m.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoyalMember } from '../../types'
defineProps<{ members: RoyalMember[] }>()

const roleColors: Record<string, string> = {
  '皇帝': '#8b1a1a', '皇后': '#c0392b', '名后': '#c0392b',
  '皇子': '#2d2d2d', '公主': '#8b6914',
  '名臣': '#2c3e50', '宰相': '#2c3e50',
  '诗人': '#6a4a2a', '词人': '#6a4a2a', '文学家': '#6a4a2a',
  '史学家': '#4a6741', '科学家': '#4a6741',
  '画家': '#5a4a7a', '书法家': '#5a4a7a',
  '大将': '#1a3a2a', '将领': '#1a3a2a',
  '发明家': '#8b6914', '天文学家': '#4a6741',
  '改革家': '#8b1a1a', '政治家': '#2c3e50',
  '宦官': '#5a4a3a', '哲学家': '#5a4a7a',
  '高僧': '#1a3a2a', '医学家': '#3a6a4a',
  '谋士': '#2d2d2d',
}

function getRoleColor(role: string): string {
  return roleColors[role] || '#888'
}
</script>

<style scoped>
.member-grid {
  display: flex; flex-wrap: wrap; gap: 20px; margin: 1.5rem 0;
}
.member-card {
  background: var(--color-card); border-radius: var(--radius);
  box-shadow: var(--shadow); border: 1px solid var(--color-border);
  padding: 22px 24px; flex: 1; min-width: 240px; max-width: 100%;
  position: relative; transition: all 0.25s ease; overflow: hidden;
}
.member-card:hover {
  box-shadow: var(--shadow-hover); transform: translateY(-2px);
}
.member-role-badge {
  display: inline-block; padding: 2px 10px; border-radius: 3px;
  font-size: 0.72rem; color: #fff; font-weight: 600;
  letter-spacing: 0.5px; margin-bottom: 8px;
}
.member-name {
  font-size: 1.15rem; font-weight: 700; color: var(--color-text);
  margin-bottom: 2px;
}
.member-title {
  font-size: 0.82rem; color: var(--color-muted); margin-bottom: 10px;
}
.member-desc {
  font-size: 0.9rem; line-height: 1.6; color: #555;
}
</style>
