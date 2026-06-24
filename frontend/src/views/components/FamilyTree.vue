<template>
  <div class="tree">
    <template v-for="(level, li) in tree" :key="li">
      <div class="tree-level">
        <div v-for="(node, ni) in level.nodes" :key="ni" class="tree-node">
          <div class="tree-name">{{ node.name }}</div>
          <div class="tree-title">{{ node.title }}</div>
        </div>
      </div>
      <div v-if="li < tree.length - 1" class="tree-connector">↓</div>
    </template>
  </div>
  <p style="text-align:center;color:var(--color-muted);font-size:0.85rem;margin-top:8px;">主要世系脉络</p>
</template>

<script setup lang="ts">
defineProps<{ tree: any[] }>()
</script>
