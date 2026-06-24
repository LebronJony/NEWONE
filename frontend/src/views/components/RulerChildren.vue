<template>
  <div class="children-wrap">
    <div v-for="ruler in rulers" :key="ruler.id" class="ruler-child-block">
      <div class="ruler-header" @click="toggleRuler(ruler.id)">
        <span class="ruler-title">{{ ruler.title }}</span>
        <span class="ruler-name">{{ ruler.name }}</span>
        <span class="ruler-reign">{{ ruler.reignStart }} – {{ ruler.reignEnd }}</span>
        <span class="toggle-icon">{{ expanded[ruler.id] ? '▾' : '▸' }}</span>
      </div>
      <div v-if="expanded[ruler.id]" class="children-list">
        <div v-if="!getChildren(ruler.id) || getChildren(ruler.id).length === 0" class="no-children">
          史料对此位君主子嗣记录不详
        </div>
        <div v-else>
          <table class="child-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>封号</th>
                <th>生母</th>
                <th>主要事迹</th>
                <th>结局</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, idx) in getChildren(ruler.id)" :key="idx">
                <td class="child-name">{{ c.name }}</td>
                <td>{{ c.title }}</td>
                <td>{{ c.mother }}</td>
                <td>{{ c.deeds }}</td>
                <td class="child-fate">{{ c.fate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Ruler } from '../../types'
import { CHILDREN_DATA } from '../../data/children_data'

const props = defineProps<{ rulers: Ruler[] }>()
const expanded = reactive<Record<number, boolean>>({})

function toggleRuler(rulerId: number) {
  expanded[rulerId] = !expanded[rulerId]
}

function getChildren(rulerId: number) {
  return CHILDREN_DATA[rulerId] || []
}
</script>

<style scoped>
.children-wrap { margin-top: 20px; }
.ruler-child-block { margin-bottom: 8px; border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden; }
.ruler-header {
  display: flex; align-items: center; gap: 12px; padding: 14px 20px;
  background: var(--color-card); cursor: pointer; transition: background 0.2s; user-select: none;
}
.ruler-header:hover { background: rgba(139,26,26,0.04); }
.ruler-title { font-weight: 700; color: var(--color-accent); font-size: 0.95rem; min-width: 80px; }
.ruler-name { font-weight: 600; font-size: 0.95rem; }
.ruler-reign { font-size: 0.85rem; color: var(--color-muted); flex: 1; }
.toggle-icon { font-size: 0.9rem; color: var(--color-muted); }
.child-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.child-table thead { background: var(--color-text); color: #fff; }
.child-table th { padding: 10px 14px; text-align: left; font-weight: 600; font-size: 0.82rem; white-space: nowrap; }
.child-table td { padding: 10px 14px; border-bottom: 1px solid var(--color-border); vertical-align: top; }
.child-table tbody tr:hover { background: rgba(139,26,26,0.03); }
.child-name { font-weight: 600; white-space: nowrap; }
.child-fate { color: var(--color-accent); }
.no-children { padding: 20px; text-align: center; color: var(--color-muted); font-size: 0.9rem; }
</style>
