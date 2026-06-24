<template>
  <div class="member-grid">
    <div v-for="m in members" :key="m.id" class="member-card">
      <div class="member-name">{{ m.name }}</div>
      <div class="member-title">{{ m.title }} · {{ m.lifespan }}</div>
      <div class="member-desc">{{ m.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoyalMember } from '../../types'
defineProps<{ members: RoyalMember[] }>()
</script>
