<template>
  <div class="ruler-table-wrap">
    <table class="ruler-table">
      <thead>
        <tr>
          <th>称号</th><th>姓名</th><th>在位时间</th><th>与前代关系</th><th>主要事迹</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rulers" :key="r.id">
          <td><strong>{{ r.title }}</strong></td>
          <td>{{ r.name }}</td>
          <td>{{ formatReign(r) }}</td>
          <td>{{ r.relation }}</td>
          <td>{{ r.achievements }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Ruler } from '../../types'
const props = defineProps<{ rulers: Ruler[] }>()

function formatReign(r: Ruler): string {
  if (r.reignStart === r.reignEnd) return r.reignStart
  return `${r.reignStart} – ${r.reignEnd}`
}
</script>
