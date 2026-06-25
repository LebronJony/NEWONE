<template>
  <div class="events-wrap">
    <template v-for="ruler in rulers" :key="ruler.id">
      <div v-if="hasEvents(ruler.id)" class="ruler-events-block">
        <div class="event-header" @click="toggleRuler(ruler.id)">
          <span class="ev-title">{{ ruler.title }}</span>
          <span class="ev-name">{{ ruler.name }}</span>
          <span class="ev-count">（{{ getEvents(ruler.id).length }} 件大事）</span>
          <span class="ev-toggle">{{ expanded[ruler.id] ? '▾' : '▸' }}</span>
        </div>
        <div v-if="expanded[ruler.id]" class="event-list">
          <div v-for="(ev, idx) in getEvents(ruler.id)" :key="idx" class="event-card">
            <div class="event-card-header">
              <span class="event-name">{{ ev.name }}</span>
              <span class="event-year">{{ ev.year }}</span>
            </div>
            <p class="event-desc">{{ ev.description }}</p>
            <div class="event-sig">
              <span class="sig-label">历史影响：</span>
              <span>{{ ev.significance }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Ruler } from '../../types'
import { EVENTS_DATA } from '../../data/ruler_events_data'

const props = defineProps<{ rulers: Ruler[] }>()
const expanded = reactive<Record<number, boolean>>({})

function toggleRuler(rulerId: number) {
  expanded[rulerId] = !expanded[rulerId]
}

function getEvents(rulerId: number) {
  return EVENTS_DATA[rulerId] || []
}

function hasEvents(rulerId: number) {
  return !!EVENTS_DATA[rulerId] && EVENTS_DATA[rulerId].length > 0
}
</script>

<style scoped>
.events-wrap { margin-top: 20px; }
.ruler-events-block { margin-bottom: 8px; border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden; }
.event-header {
  display: flex; align-items: center; gap: 12px; padding: 14px 20px;
  background: var(--color-card); cursor: pointer; transition: background 0.2s; user-select: none;
}
.event-header:hover { background: rgba(139,26,26,0.04); }
.ev-title { font-weight: 700; color: var(--color-accent); font-size: 0.95rem; min-width: 80px; }
.ev-name { font-weight: 600; font-size: 0.95rem; }
.ev-count { font-size: 0.85rem; color: var(--color-muted); }
.ev-toggle { margin-left: auto; font-size: 0.9rem; color: var(--color-muted); }
.event-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; }
.event-card {
  background: rgba(245,240,235,0.5); border-radius: var(--radius);
  border: 1px solid var(--color-border); padding: 18px 20px;
}
.event-card-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
.event-name { font-weight: 700; font-size: 1.05rem; color: var(--color-text); }
.event-year { font-size: 0.85rem; color: var(--color-accent); font-weight: 600; }
.event-desc { font-size: 0.9rem; line-height: 1.7; color: #555; margin-bottom: 10px; text-align: justify; }
.event-sig { font-size: 0.88rem; line-height: 1.6; padding: 10px 14px; background: var(--color-card); border-radius: 6px; border-left: 3px solid var(--color-accent); }
.sig-label { font-weight: 600; color: var(--color-accent); }
</style>
