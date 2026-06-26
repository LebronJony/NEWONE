<template>
  <div class="family-tree">
    <template v-for="ruler in rulers" :key="ruler.id">
      <div class="tree-unit">
        <div class="emperor-node" :style="getEmperorStyle(ruler)">
          <div class="emperor-icon">{{ dynastyChar(ruler.dynastyId) }}</div>
          <div class="emperor-title">{{ ruler.title }}</div>
          <div class="emperor-name">{{ ruler.name }}</div>
          <div class="emperor-years">{{ ruler.reignStart }} – {{ ruler.reignEnd }}</div>
        </div>
        <div v-if="hasSpouse(ruler.id)" class="spouse-section">
          <div class="tree-line"></div>
          <div v-for="sp in getSpouse(ruler.id)" :key="sp.name" class="spouse-card">
            <div class="spouse-icon">♡</div>
            <div class="spouse-info">
              <div class="spouse-name">{{ sp.name }}</div>
              <div class="spouse-title">{{ sp.title }}</div>
              <div class="spouse-father">父: <strong>{{ sp.father }}</strong> · {{ sp.fatherTitle }}</div>
              <div class="spouse-bg">{{ sp.background }}</div>
            </div>
          </div>
        </div>
        <div v-if="hasChildren(ruler.id)" class="children-section">
          <div class="tree-line"></div>
          <div class="children-row">
            <div v-for="(child, childIdx) in getChildren(ruler.id)" :key="childIdx" class="child-unit">
              <div class="child-card">
                <div class="child-name" :title="child.name">{{ child.name }}</div>
                <div class="child-title" :title="child.title">{{ child.title }}</div>
                <div class="child-mother">{{ child.mother }}</div>
                <div v-if="getSpouseForChild(ruler.id, childIdx)" class="child-spouse">
                  <span class="sp-tag">配</span>
                  {{ getSpouseForChild(ruler.id, childIdx).name }}{{ getSpouseForChild(ruler.id, childIdx).family ? '·' + getSpouseForChild(ruler.id, childIdx).family : '' }}
                </div>
                <div v-if="getSpouseForChild(ruler.id, childIdx)?.note" class="sp-note">{{ getSpouseForChild(ruler.id, childIdx).note }}</div>
                <div v-if="getTreeData(ruler.id, child.name)" class="lineage-tree">
                  <div v-for="(item, idx) in flattenTree(getTreeData(ruler.id, child.name))" :key="idx" class="lineage-node" :style="{ marginLeft: (item.depth * 16) + 'px' }">
                    <div class="ln-content">
                      <span class="ln-branch" v-if="item.depth > 0">&#x2514;</span>
                      <span class="ln-name">{{ item.node.name }}</span>
                      <span class="ln-title">{{ item.node.title }}</span>
                      <span v-if="item.node.note" class="ln-note">{{ item.node.note }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="getLineage(ruler.id, child.name)" class="child-lineage">
                  <span class="lg-tag">后</span>
                  <span class="lg-text">{{ getLineage(ruler.id, child.name) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-child-section">
          <div class="tree-line"></div>
          <div class="no-child-text">无子嗣记载</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Ruler } from '../../types'
import { CHILDREN_DATA } from '../../data/children_data'
import { SPOUSE_DATA, hasSpouse, getSpouse } from '../../data/spouse_data'
import { CHILD_SPOUSE } from '../../data/child_spouse_data'
import { getLineage } from '../../data/lineage_data'
import { LINEAGE_TREE } from '../../data/lineage_tree_data'
import type { LineageTreeNode } from '../../data/lineage_tree_data'

const props = defineProps<{ rulers: Ruler[] }>()

const dynastyChars: Record<number, string> = {1:'秦',2:'汉',3:'晋',4:'南北朝',5:'隋',6:'唐',7:'宋',8:'元',9:'明',10:'清',11:'三国'}
const dc: Record<number, string> = {1:'linear-gradient(135deg,#2d2d2d,#5a4a3a)',2:'linear-gradient(135deg,#8b1a1a,#c0392b)',3:'linear-gradient(135deg,#4a6741,#6b8e5a)',4:'linear-gradient(135deg,#5a4a7a,#7a6a9a)',5:'linear-gradient(135deg,#8b6914,#b8942e)',6:'linear-gradient(135deg,#c0392b,#e67e22)',7:'linear-gradient(135deg,#2c3e50,#4a6a8a)',8:'linear-gradient(135deg,#6a4a2a,#9a7a4a)',9:'linear-gradient(135deg,#8b1a1a,#d4a017)',10:'linear-gradient(135deg,#1a3a2a,#2d6a4f)',11:'linear-gradient(135deg,#b8860b,#d4a017)'}

function getEmperorStyle(ruler: Ruler) { return { background: dc[ruler.dynastyId] || dc[1] } }
function dynastyChar(did: number) { return dynastyChars[did] || '皇' }
function getChildren(rulerId: number) { return CHILDREN_DATA[rulerId] || [] }
function hasChildren(rulerId: number) {
  const c = CHILDREN_DATA[rulerId]
  return c && c.length > 0 && c[0].name !== '[无子嗣]' && c[0].name !== '[子嗣不详]' && !c[0].name.startsWith('[')
}
function getSpouseForChild(rulerId: number, childIdx: number) {
  return CHILD_SPOUSE[`${rulerId}_${childIdx + 1}`] || null
}

function getTreeData(rulerId: number, childName: string): LineageTreeNode[] | null {
  return LINEAGE_TREE[`${rulerId}_${childName}`] || null
}

function flattenTree(nodes: LineageTreeNode[], depth: number = 0): Array<{node: LineageTreeNode, depth: number}> {
  const result: Array<{node: LineageTreeNode, depth: number}> = []
  for (const node of nodes) {
    result.push({ node, depth })
    if (node.children && node.children.length > 0) {
      result.push(...flattenTree(node.children, depth + 1))
    }
  }
  return result
}
</script>

<style scoped>
.family-tree { display: flex; flex-direction: column; gap: 40px; padding: 16px 0; }
.tree-unit { display: flex; flex-direction: column; align-items: center; }
.tree-line { width: 2px; height: 20px; background: var(--color-accent); opacity: 0.25; }

.emperor-node {
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 28px; border-radius: 10px; color: #fff;
  min-width: 120px; box-shadow: 0 3px 12px rgba(0,0,0,0.1);
}
.emperor-icon { font-size: 1.4rem; font-weight: 800; opacity: 0.45; margin-bottom: 1px; letter-spacing: 3px; }
.emperor-title { font-size: 1rem; font-weight: 700; margin-bottom: 1px; }
.emperor-name { font-size: 0.8rem; opacity: 0.85; }
.emperor-years { font-size: 0.72rem; opacity: 0.55; margin-top: 1px; }

.spouse-section { width: 100%; display: flex; flex-direction: column; align-items: center; }
.spouse-card {
  display: flex; gap: 12px; background: linear-gradient(135deg,#fdf0ed,#fef6f3);
  border: 1px solid #f0cdc5; border-radius: 8px; padding: 12px 16px;
  max-width: 440px; width: 100%; margin-bottom: 3px;
}
.spouse-icon { font-size: 1.2rem; color: var(--color-accent); opacity: 0.4; flex-shrink: 0; padding-top: 1px; }
.spouse-name { font-weight: 700; font-size: 0.9rem; color: var(--color-accent); margin-bottom: 1px; }
.spouse-title { font-size: 0.75rem; color: var(--color-muted); margin-bottom: 4px; }
.spouse-father { font-size: 0.75rem; color: var(--color-text); margin-bottom: 4px; }
.spouse-bg { font-size: 0.75rem; line-height: 1.4; color: #666; border-left: 2px solid #f0cdc5; padding-left: 8px; margin-top: 3px; }

.children-section { width: 100%; }
.children-row {
  display: flex; flex-wrap: nowrap; overflow-x: auto;
  gap: 10px; padding: 6px 0 10px; max-width: 100%;
}
.child-unit { flex: 0 0 auto; width: 210px; }
.child-card {
  background: var(--color-card); border: 1px solid var(--color-border);
  border-radius: 8px; padding: 10px 12px; text-align: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.child-card:hover { transform: translateY(-2px); box-shadow: 0 3px 10px rgba(0,0,0,0.07); }
.child-name { font-weight: 700; font-size: 1.1rem; }
.child-title { font-size: 0.85rem; color: var(--color-muted); margin-bottom: 1px; }
.child-mother { font-size: 0.8rem; color: var(--color-accent); opacity: 0.6; margin-bottom: 2px; }
.child-spouse { font-size: 0.75rem; padding: 1px 0; border-top: 1px dotted var(--color-border); margin-top: 1px; }
.sp-tag { display: inline; background: #e8a0a0; color: #fff; padding: 1px 5px; border-radius: 3px; font-size: 0.65rem; font-weight: 700; }

/* Spouse note - uses lighter weight, color, and opacity to appear subtle */
.sp-note { font-size: 0.8rem; color: #bbb; font-style: italic; opacity: 0.65; line-height: 1.25; margin-top: 1px; }

.child-lineage { font-size: 0.7rem; }
.lg-tag { display: inline; background: #4a6741; color: #fff; padding: 1px 5px; border-radius: 3px; font-size: 0.6rem; font-weight: 700; }
.lg-text { color: var(--color-muted); font-size: 0.65rem; }

.no-child-section { text-align: center; }
.no-child-text { font-size: 0.75rem; color: var(--color-muted); padding: 6px 16px; background: var(--color-card); border: 1px dashed var(--color-border); border-radius: 5px; }

.lineage-tree {
  margin-top: 4px; display: flex; flex-direction: column; align-items: stretch; width: 100%;
}
.lineage-node {
  display: flex; align-items: flex-start; padding: 2px 0;
  font-size: 0.75rem; width: 100%;
}
.ln-content { display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap; }
.ln-branch { color: var(--color-accent); opacity: 0.35; flex-shrink: 0; margin-right: 4px; font-size: 0.65rem; }
.ln-name { font-weight: 700; color: var(--color-text); font-size: 0.85rem; }
.ln-title { font-size: 0.7rem; color: var(--color-muted); }
.ln-note { font-size: 0.65rem; color: #888; font-style: italic; }

@media (max-width: 768px) {
    .child-unit { width: 160px; }
    .child-card { padding: 8px 10px; }
    .child-name { font-size: 1rem; }
    .child-title { font-size: 0.8rem; }
    .child-mother { font-size: 0.75rem; }
    .child-spouse { font-size: 0.7rem; }
    .sp-tag { font-size: 0.6rem; }
    .sp-note { font-size: 0.75rem; }
    .child-lineage { font-size: 0.65rem; }
  .lg-tag, .lg-text { font-size: 0.55rem; }
  .spouse-card { padding: 10px 12px; }
}
</style>
