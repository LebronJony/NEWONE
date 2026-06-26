<template>
  <div class="member-grid">
    <div v-for="m in members" :key="m.id" class="member-card" @click="$emit('select', m)" style="cursor:pointer">
      <div class="mc-top">
        <span class="mc-role" :style="{ background: getRoleColor(m.role) }">{{ m.role }}</span>
        <span class="mc-meta">{{ m.lifespan }}</span>
      </div>
      <div class="mc-name">{{ m.name }}</div>
      <div class="mc-sub">{{ m.title }}</div>
      <div class="mc-desc">{{ m.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoyalMember } from '../../types'
const emit = defineEmits<{ (e: 'select', m: any): void }>()
const props = defineProps<{ members: RoyalMember[] }>()

const roleColors: Record<string, string> = {
  '皇帝': '#8b1a1a', '皇后': '#c0392b', '名后': '#c0392b',
  '皇子': '#5a4a3a', '公主': '#8b6914',
  '宰相': '#2c3e50', '名臣': '#2c3e50', '大臣': '#2c3e50', '政治家': '#2c3e50',
  '诗人': '#8b6914', '词人': '#8b6914', '文学家': '#8b6914',
  '史学家': '#4a6741', '科学家': '#4a6741', '发明家': '#8b6914',
  '天文学家': '#4a6741', '医学家': '#3a6a4a',
  '画家': '#5a4a7a', '书法家': '#5a4a7a', '戏剧家': '#5a4a7a',
  '大将': '#1a3a2a', '将领': '#1a3a2a', '将军': '#1a3a2a',
  '改革家': '#c0392b', '谋士': '#2d2d2d',
  '宦官': '#5a4a3a', '哲学家': '#5a4a7a',
  '高僧': '#1a3a2a', '外交家': '#2c3e50',
  '航海家': '#2c3e50', '旅行家': '#8b6914',
  '奠基者': '#8b1a1a', '太后': '#c0392b',
}
function getRoleColor(role: string): string {
  return roleColors[role] || '#888'
}
</script>

<style scoped>
.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px; margin: 1rem 0;
}
.member-card {
  border: 1px solid var(--color-border); border-radius: 6px;
  padding: 10px 12px; background: var(--color-card);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  display: flex; flex-direction: column; gap: 2px;
}
.member-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.06); transform: translateY(-1px);
}
.mc-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2px;
}
.mc-role {
  display: inline-block; padding: 1px 7px; border-radius: 3px;
  font-size: 0.6rem; color: #fff; font-weight: 600; line-height: 1.5;
}
.mc-meta { font-size: 0.6rem; color: var(--color-muted); }
.mc-name {
  font-weight: 700; font-size: 0.9rem; color: var(--color-text);
  line-height: 1.3;
}
.mc-sub { font-size: 0.65rem; color: var(--color-muted); margin-bottom: 3px; }
.mc-desc {
  font-size: 0.68rem; line-height: 1.4; color: #666;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .member-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 6px; }
  .member-card { padding: 8px 10px; }
}
</style>
