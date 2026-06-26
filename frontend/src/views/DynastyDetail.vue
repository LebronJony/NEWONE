<template>
  <div v-if="loading" class="loading">加载中...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <template v-else-if="detail">
    <nav class="page-nav">
      <div class="nav-inner">
        <router-link to="/" class="nav-home">← 首页</router-link>
        <span style="flex:1"></span>
        <div class="nav-adjacent">
          <button class="btn" @click="scrollTo('profile')">基本档案</button>
          <button class="btn" @click="scrollTo('origins')">家族渊源</button>
          <button class="btn" @click="scrollTo('founding')">开国之路</button>
          <button class="btn" @click="scrollTo('zenith')">鼎盛时期</button>
          <button class="btn" @click="scrollTo('members')">著名成员</button>
          <button class="btn" @click="scrollTo('rulers')">君主表</button>
          <button class="btn" @click="scrollTo('children')">子嗣表</button>
          <button class="btn" @click="scrollTo('events')">著名事件</button>
        </div>
      </div>
    </nav>

    <div class="page-wrapper">
      <aside class="page-sidebar">
        <ul>
          <li><a href="#profile" :class="{ active: activeSection === 'profile' }">基本档案</a></li>
          <li><a href="#origins" :class="{ active: activeSection === 'origins' }">家族渊源</a></li>
          <li><a href="#founding" :class="{ active: activeSection === 'founding' }">开国之路</a></li>
          <li><a href="#zenith" :class="{ active: activeSection === 'zenith' }">鼎盛时期</a></li>
          <li><a href="#members" :class="{ active: activeSection === 'members' }">著名历史人物</a></li>
          <li><a href="#tree" :class="{ active: activeSection === 'tree' }">家族关系谱</a></li>
          <li><a href="#decline" :class="{ active: activeSection === 'decline' }">衰落与终结</a></li>
          <li><a href="#rulers" :class="{ active: activeSection === 'rulers' }">历任君主表</a></li>
          <li><a href="#children" :class="{ active: activeSection === 'children' }">皇帝子嗣</a></li>
          <li><a href="#events" :class="{ active: activeSection === 'events' }">著名事件</a></li>
        </ul>
      </aside>

      <main class="page-content">
        <section class="content-section" id="profile">
          <h1>{{ detail.name }} · {{ detail.surname }}</h1>
          <p class="dynasty-sub">{{ detail.period }} · 都城：{{ detail.capital }}</p>
          <FactGrid :detail="detail" />
        </section>

        <section class="content-section" id="origins">
          <h2>
            家族渊源
            <button class="edit-btn" @click="startEdit('origins', sections.origins)">&#9998; 编辑</button>
          </h2>
          <div v-if="editingKey === 'origins'" class="edit-editor">
            <textarea v-model="editContent" class="edit-textarea" :disabled="saving"></textarea>
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit('origins')" :disabled="saving">{{ saving ? '保存中...' : '保 存' }}</button>
              <button class="cancel-btn" @click="cancelEdit">取 消</button>
            </div>
          </div>
          <template v-else>
            <div class="text-section">
              <p v-for="(p, i) in splitParagraphs(sections.origins)" :key="i">{{ p }}</p>
            </div>
          </template>
        </section>

        <section class="content-section" id="founding">
          <h2>
            开国之路
            <button class="edit-btn" @click="startEdit('founding', sections.founding)">&#9998; 编辑</button>
          </h2>
          <div v-if="editingKey === 'founding'" class="edit-editor">
            <textarea v-model="editContent" class="edit-textarea" :disabled="saving"></textarea>
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit('founding')" :disabled="saving">{{ saving ? '保存中...' : '保 存' }}</button>
              <button class="cancel-btn" @click="cancelEdit">取 消</button>
            </div>
          </div>
          <template v-else>
            <div class="text-section">
              <p v-for="(p, i) in splitParagraphs(sections.founding)" :key="i">{{ p }}</p>
            </div>
          </template>
        </section>

        <section class="content-section" id="zenith">
          <h2>
            鼎盛时期
            <button class="edit-btn" @click="startEdit('zenith', sections.zenith)">&#9998; 编辑</button>
          </h2>
          <div v-if="editingKey === 'zenith'" class="edit-editor">
            <textarea v-model="editContent" class="edit-textarea" :disabled="saving"></textarea>
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit('zenith')" :disabled="saving">{{ saving ? '保存中...' : '保 存' }}</button>
              <button class="cancel-btn" @click="cancelEdit">取 消</button>
            </div>
          </div>
          <template v-else>
            <div class="text-section">
              <p v-for="(p, i) in splitParagraphs(sections.zenith)" :key="i">{{ p }}</p>
            </div>
          </template>
        </section>

        <section class="content-section" id="members">
          <h2>
            著名历史人物
            <button class="edit-btn" @click="startMemberEdit" v-if="!memberEditing">&#9998; 管理人物</button>
          </h2>
          <div v-if="memberEditing" class="edit-event-panel">
            <div class="edit-event-toolbar">
              <button class="add-event-btn" @click="addMember">+ 添加人物</button>
              <button class="save-btn" @click="saveMembers" :disabled="memberSaving">{{ memberSaving ? '保存中...' : '保存全部' }}</button>
              <button class="cancel-btn" @click="cancelMemberEdit">取消</button>
            </div>
            <div v-if="memberFormOpen" class="event-form">
              <div class="ef-row"><label>姓名</label><input v-model="memberForm.name" class="ef-input"></div>
              <div class="ef-row"><label>称号</label><input v-model="memberForm.title" class="ef-input"></div>
              <div class="ef-row"><label>生卒年</label><input v-model="memberForm.lifespan" class="ef-input"></div>
              <div class="ef-row"><label>角色</label><select v-model="memberForm.role" class="ef-input">
                  <option>皇帝</option><option>皇后</option><option>太后</option><option>名后</option>
                  <option>皇子</option><option>公主</option><option>宰相</option><option>名臣</option>
                  <option>诗人</option><option>文学家</option><option>史学家</option><option>科学家</option>
                  <option>大将</option><option>将领</option><option>改革家</option><option>谋士</option>
                  <option>宦官</option><option>外交家</option><option>僧侣</option><option>艺术家</option><option>名士</option>
                </select></div>
              <div class="ef-row"><label>人物介绍</label><textarea v-model="memberForm.description" class="ef-textarea" rows="3"></textarea></div>
              <div class="edit-actions">
                <button class="save-btn" @click="saveMemberItem">{{ memberFormIdx === null ? '添加' : '更新' }}</button>
                <button class="cancel-btn" @click="memberFormOpen = false">关闭</button>
              </div>
            </div>
            <div class="edit-event-list">
              <div v-for="(m, idx) in localMembers" :key="idx" class="event-list-item">
                <div class="eli-info">
                  <strong>{{ m.name }}</strong>
                  <span class="mli-title">{{ m.title }}</span>
                  <span class="eli-year">{{ m.lifespan }}</span>
                  <span class="eli-type" :style="{ background: getRoleColor(m.role) }">{{ m.role }}</span>
                </div>
                <div class="eli-actions">
                  <button class="eli-btn edit" @click="startMemberForm(idx, m)">编辑</button>
                  <button class="eli-btn del" @click="deleteMember(idx)">删除</button>
                </div>
              </div>
            </div>
          </div>
          <template v-else>
            <MemberGrid :members="detail.members" @select="openFigureDetail" />
          </template>
        </section>

        <section class="content-section" id="tree">
          <h2>家族关系谱</h2>
          <FamilyTree :rulers="detail.rulers" />
        </section>

        <section class="content-section" id="decline">
          <h2>
            衰落与终结
            <button class="edit-btn" @click="startEdit('decline', sections.decline)">&#9998; 编辑</button>
          </h2>
          <div v-if="editingKey === 'decline'" class="edit-editor">
            <textarea v-model="editContent" class="edit-textarea" :disabled="saving"></textarea>
            <div class="edit-actions">
              <button class="save-btn" @click="saveEdit('decline')" :disabled="saving">{{ saving ? '保存中...' : '保 存' }}</button>
              <button class="cancel-btn" @click="cancelEdit">取 消</button>
            </div>
          </div>
          <template v-else>
            <div class="text-section">
              <p v-for="(p, i) in splitParagraphs(sections.decline)" :key="i">{{ p }}</p>
            </div>
          </template>
        </section>

        <section class="content-section" id="rulers">
          <h2>历任君主表</h2>
          <RulerTable :rulers="detail.rulers" />
        </section>

        <section class="content-section" id="children">
          <h2>皇帝子嗣</h2>
          <RulerChildren :rulers="detail.rulers" />
        </section>

        <section class="content-section" id="events">
          <h2>
            著名历史事件
            <button class="edit-btn" @click="startEdit('events', '')" v-if="editingKey !== 'events'">&#9998; 管理事件</button>
          </h2>
          <div v-if="editingKey === 'events'" class="edit-event-panel">
            <div class="edit-event-toolbar">
              <button class="add-event-btn" @click="addEvent">+ 添加事件</button>
              <button class="save-btn" @click="saveEvents" :disabled="saving">{{ saving ? '保存中...' : '保存全部' }}</button>
              <button class="cancel-btn" @click="cancelEdit">取消</button>
            </div>
            <div v-if="eventEdit.open" class="event-form">
              <div class="ef-row"><label>事件名称</label><input v-model="eventEdit.item.name" class="ef-input"></div>
              <div class="ef-row"><label>年份</label><input v-model="eventEdit.item.year" class="ef-input"></div>
              <div class="ef-row"><label>时期人物</label><input v-model="eventEdit.item.era" class="ef-input"></div>
              <div class="ef-row"><label>类型</label>
                <select v-model="eventEdit.item.type" class="ef-input">
                  <option>军事</option><option>政治</option><option>外交</option><option>文化</option>
                  <option>经济</option><option>改革</option><option>工程</option><option>科技</option>
                </select>
              </div>
              <div class="ef-row"><label>简要概述</label><textarea v-model="eventEdit.item.description" class="ef-textarea" rows="2"></textarea></div>
              <div class="ef-row"><label>详细过程</label><textarea v-model="eventEdit.item.detail" class="ef-textarea" rows="5" placeholder="前因后果、详细过程（弹窗中展示）"></textarea></div>
              <div class="ef-row"><label>历史影响</label><textarea v-model="eventEdit.item.significance" class="ef-textarea" rows="2"></textarea></div>
              <div class="edit-actions">
                <button class="save-btn" @click="saveEventItem">{{ eventEdit.idx === null ? '添加' : '更新' }}</button>
                <button class="cancel-btn" @click="eventEdit = { open: false, idx: null, item: {} }">关闭</button>
              </div>
            </div>
            <div class="edit-event-list">
              <div v-for="(ev, idx) in (localEvents || [])" :key="idx" class="event-list-item">
                <div class="eli-info">
                  <strong>{{ ev.name }}</strong>
                  <span class="eli-year">{{ ev.year }}</span>
                  <span class="eli-type" :style="{ background: typeColor(ev.type) }">{{ ev.type }}</span>
                </div>
                <div class="eli-actions">
                  <button class="eli-btn edit" @click="startEventEdit(idx, ev)">编辑</button>
                  <button class="eli-btn del" @click="deleteEvent(idx)">删除</button>
                </div>
              </div>
            </div>
          </div>
          <template v-else>
          <p style="margin-bottom:16px;color:var(--color-text-muted);">从政治、军事、外交、文化到经济、改革的重大历史事件</p>
          <div class="dynasty-events">
          <div v-for="(ev, idx) in dynastyEvents" :key="idx" class="de-card" @click="openEventDetail(ev)">
            <div class="de-hd">
              <span class="de-name">{{ ev.name }}</span>
              <span class="de-year">{{ ev.year }}</span>
              <span v-if="ev.era" class="de-era">{{ ev.era }}</span>
              <span v-if="ev.type" class="de-type" :style="{background:typeColor(ev.type)}">{{ ev.type }}</span>
            </div>
            <p class="de-desc">{{ ev.description.slice(0, 80) }}{{ ev.description.length > 80 ? '...' : '' }}</p>
          </div>
        </div>
        <h3 style="margin:24px 0 8px;font-size:1rem;color:var(--color-muted);">历代帝王大事记</h3>
        <RulerEvents :rulers="detail.rulers" />
        </template>
        </section>
      </main>
        <!-- Figure Detail Modal -->
        <div v-if="figureDetail" class="modal-overlay" @click.self="figureDetail = null">
          <div class="modal-content">
            <button class="modal-close" @click="figureDetail = null">&times;</button>
            <div class="modal-header">
              <h3>{{ figureDetail.name }}</h3>
              <div class="modal-meta">
                <span class="modal-year">{{ figureDetail.title }}</span>
                <span class="modal-era">{{ figureDetail.lifespan }}</span>
                <span class="modal-type" :style="{ background: '#8b1a1a' }">{{ figureDetail.role }}</span>
              </div>
            </div>
            <div class="modal-body">
              <div v-for="(sec, idx) in parseDetail(figureDetail.detail || figureDetail.description)" :key="idx" class="modal-section">
                <h4>{{ sec.heading || '人物生平' }}</h4>
                <div class="modal-text">{{ sec.content }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="eventDetail" class="modal-overlay" @click.self="eventDetail = null">
          <div class="modal-content">
            <button class="modal-close" @click="eventDetail = null">&times;</button>
            <div class="modal-header">
              <h3>{{ eventDetail.name }}</h3>
              <div class="modal-meta">
                <span class="modal-year">{{ eventDetail.year }}</span>
                <span v-if="eventDetail.era" class="modal-era">{{ eventDetail.era }}</span>
                <span v-if="eventDetail.type" class="modal-type" :style="{ background: typeColor(eventDetail.type) }">{{ eventDetail.type }}</span>
              </div>
            </div>
            <div class="modal-body">
              <div v-for="(sec, idx) in parseDetail(eventDetail.detail || eventDetail.description)" :key="idx" class="modal-section">
                <h4>{{ sec.heading || '背景与经过' }}</h4>
                <div class="modal-text" :class="{ 'modal-impact': sec.heading === '后果与影响' }">{{ sec.content }}</div>
              </div>
              <div v-if="eventDetail.significance && (!eventDetail.detail || !eventDetail.detail.includes('后果'))" class="modal-section">
                <h4>历史影响</h4>
                <div class="modal-text modal-impact">{{ eventDetail.significance }}</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDynastyDetail, updateDynastySections } from '../api/dynasty'
import type { DynastyDetail, DynastySections } from '../types'
import FactGrid from './components/FactGrid.vue'
import MemberGrid from './components/MemberGrid.vue'
import RulerTable from './components/RulerTable.vue'
import FamilyTree from './components/FamilyTree.vue'
import RulerChildren from './components/RulerChildren.vue'
import RulerEvents from './components/RulerEvents.vue'
import { getHistoricalFigures } from '../data/historical_data'

const route = useRoute()

const DYNASTY_EVENTS: Record<number, DynastyEvent[]> = {
  1: [  // 秦
    { name:'商鞅变法', year:'前356-前338', description:'商鞅在秦孝公支持下推行变法，包括废井田、开阡陌、奖励军功、推行县制、统一度量衡等。使秦国从一个西陲弱国迅速崛起为战国第一强国。', significance:'商鞅变法是中国历史上最彻底的改革之一，为秦国统一六国奠定了制度基础。其法治思想对后世产生了深远影响。', era:'秦孝公·商鞅', type:'改革' , detail:'【背景】商鞅变法推行于前356-前338，由秦孝公·商鞅主导实施。\n\n【经过】商鞅在秦孝公支持下推行变法，包括废井田、开阡陌、奖励军功、推行县制、统一度量衡等。使秦国从一个西陲弱国迅速崛起为战国第一强国。\n\n【后果与影响】商鞅变法是中国历史上最彻底的改革之一，为秦国统一六国奠定了制度基础。其法治思想对后世产生了深远影响。' },
    { name:'秦灭六国', year:'前230-前221', description:'秦王嬴政先后灭韩、赵、魏、楚、燕、齐六国，结束了长达五百余年的诸侯割据局面，建立了中国历史上第一个大一统中央集权王朝。', significance:'结束了春秋战国长期分裂的局面，开创了中国两千多年的帝制时代。"皇帝"称号自此成为最高统治者的称谓。', era:'秦始皇', type:'军事', detail:'【背景】秦灭六国发生在前230-前221，是秦始皇主导的重大军事行动。\n\n【经过】秦王嬴政先后灭韩、赵、魏、楚、燕、齐六国，结束了长达五百余年的诸侯割据局面，建立了中国历史上第一个大一统中央集权王朝。\n\n【后果与影响】结束了春秋战国长期分裂的局面，开创了中国两千多年的帝制时代。"皇帝"称号自此成为最高统治者的称谓。' },
    { name:'焚书坑儒', year:'前213-前212', description:'秦始皇采纳李斯建议，焚烧除秦记、医药、卜筮、种树以外的书籍。次年将四百六十余名方士儒生坑杀于咸阳。', significance:'严重摧毁了先秦诸子百家的文化遗产，是中国历史上第一次大规模的文化专制事件。', era:'秦始皇·李斯', type:'政治', detail:'【背景】焚书坑儒发生在前213-前212，是秦始皇·李斯时期的重要政治事件。\n\n【经过】秦始皇采纳李斯建议，焚烧除秦记、医药、卜筮、种树以外的书籍。次年将四百六十余名方士儒生坑杀于咸阳。\n\n【后果与影响】严重摧毁了先秦诸子百家的文化遗产，是中国历史上第一次大规模的文化专制事件。' },
    { name:'修筑长城', year:'前214', description:'秦始皇下令将战国秦赵燕三国北部长城连接修缮，西起临洮东至辽东，绵延万余里。动用数百万民夫。', significance:'长城成为中华民族的象征，但在当时因工程浩大导致无数百姓家破人亡，成为秦朝暴政的典型代表。', era:'秦始皇·蒙恬', type:'军事', detail:'【背景】修筑长城发生在前214，是秦始皇·蒙恬主导的重大军事行动。\n\n【经过】秦始皇下令将战国秦赵燕三国北部长城连接修缮，西起临洮东至辽东，绵延万余里。动用数百万民夫。\n\n【后果与影响】长城成为中华民族的象征，但在当时因工程浩大导致无数百姓家破人亡，成为秦朝暴政的典型代表。' },
    { name:'大泽乡起义', year:'前209', description:'陈胜吴广在安徽大泽乡率九百戍卒起义，提出"王侯将相宁有种乎"，揭开了秦末农民大起义的序幕，各地纷纷响应。', significance:'中国历史上第一次大规模平民起义，沉重打击了秦朝统治，最终导致秦朝灭亡。也为后世农民起义提供了精神号召。', era:'陈胜·吴广', type:'军事', detail:'【背景】大泽乡起义发生在前209，是陈胜·吴广主导的重大军事行动。\n\n【经过】陈胜吴广在安徽大泽乡率九百戍卒起义，提出"王侯将相宁有种乎"，揭开了秦末农民大起义的序幕，各地纷纷响应。\n\n【后果与影响】中国历史上第一次大规模平民起义，沉重打击了秦朝统治，最终导致秦朝灭亡。也为后世农民起义提供了精神号召。' },
    { name:'巨鹿之战', year:'前207', description:'项羽率楚军与秦军主力在巨鹿决战。项羽破釜沉舟，以少胜多大败秦军。此战后秦军主力尽失，名存实亡。', significance:'巨鹿之战决定了秦朝灭亡的命运。项羽一战成名，成为反秦联军领袖。同时秦将章邯投降，王离被俘。', era:'项羽·章邯', type:'军事', detail:'【背景】巨鹿之战发生在前207，是项羽·章邯主导的重大军事行动。\n\n【经过】项羽率楚军与秦军主力在巨鹿决战。项羽破釜沉舟，以少胜多大败秦军。此战后秦军主力尽失，名存实亡。\n\n【后果与影响】巨鹿之战决定了秦朝灭亡的命运。项羽一战成名，成为反秦联军领袖。同时秦将章邯投降，王离被俘。' },
    { name:'秦统一度量衡与文字', year:'前221', description:'秦始皇统一六国后推行书同文车同轨政策，以小篆为全国标准文字，统一度量衡单位。', significance:'奠定了中国两千年大一统的文化基础。书同文使各地文化交流更加便利。', era:'秦始皇·李斯', type:'改革', detail:'【背景】秦统一度量衡与文字推行于前221，由秦始皇·李斯主导实施。\n\n【经过】秦始皇统一六国后推行书同文车同轨政策，以小篆为全国标准文字，统一度量衡单位。\n\n【后果与影响】奠定了中国两千年大一统的文化基础。书同文使各地文化交流更加便利。' },
    { name:'灵渠修建', year:'前214', description:'秦始皇为征服岭南开凿灵渠连接湘江和漓江，沟通长江与珠江水系，全长约36公里。', significance:'世界上最古老的运河之一。使中原王朝有效控制岭南地区，促进了南北经济文化交流。', era:'秦始皇·史禄', type:'工程', detail:'【背景】灵渠修建发生在前214，是秦始皇·史禄时期的重要工程建设。\n\n【经过】秦始皇为征服岭南开凿灵渠连接湘江和漓江，沟通长江与珠江水系，全长约36公里。\n\n【后果与影响】世界上最古老的运河之一。使中原王朝有效控制岭南地区，促进了南北经济文化交流。' },
  ],
  2: [  // 汉
    { name:'楚汉争霸', year:'前206-前202', description:'秦朝灭亡后项羽分封天下，封刘邦为汉王。刘邦趁机出兵关中，与项羽进行了长达四年的楚汉战争。最终在垓下之战中击败项羽。', significance:'以刘邦的胜利告终，奠定了西汉王朝的统治基础。刘邦从平民成为开国皇帝，是中国历史上"布衣天子"的典范。', era:'刘邦·项羽', type:'军事', detail:'【背景】楚汉争霸发生在前206-前202，是刘邦·项羽主导的重大军事行动。\n\n【经过】秦朝灭亡后项羽分封天下，封刘邦为汉王。刘邦趁机出兵关中，与项羽进行了长达四年的楚汉战争。最终在垓下之战中击败项羽。\n\n【后果与影响】以刘邦的胜利告终，奠定了西汉王朝的统治基础。刘邦从平民成为开国皇帝，是中国历史上"布衣天子"的典范。' },
    { name:'白登之围', year:'前200', description:'刘邦亲率大军北击匈奴，被匈奴冒顿单于四十万骑兵围困于白登山七昼夜。后采纳陈平之计贿赂匈奴阏氏才得脱险。', significance:'使汉朝认识到匈奴的强大，从此采取和亲政策换取和平，为汉朝恢复国力赢得了宝贵时间。', era:'刘邦·冒顿单于', type:'外交', detail:'【背景】白登之围发生在前200，是刘邦·冒顿单于时期的重要外交活动。\n\n【经过】刘邦亲率大军北击匈奴，被匈奴冒顿单于四十万骑兵围困于白登山七昼夜。后采纳陈平之计贿赂匈奴阏氏才得脱险。\n\n【后果与影响】使汉朝认识到匈奴的强大，从此采取和亲政策换取和平，为汉朝恢复国力赢得了宝贵时间。' },
    { name:'文景之治', year:'前180-前141', description:'汉文帝和汉景帝实行轻徭薄赋、与民休息的政策。文帝废除肉刑、减省租赋，景帝平定七国之乱、削弱诸侯。', significance:'中国历史上第一个有明确记载的太平盛世，为汉武帝时期的大规模军事行动奠定了物质基础。', era:'汉文帝·汉景帝', type:'政治', detail:'【背景】文景之治发生在前180-前141，是汉文帝·汉景帝时期的重要政治事件。\n\n【经过】汉文帝和汉景帝实行轻徭薄赋、与民休息的政策。文帝废除肉刑、减省租赋，景帝平定七国之乱、削弱诸侯。\n\n【后果与影响】中国历史上第一个有明确记载的太平盛世，为汉武帝时期的大规模军事行动奠定了物质基础。' },
    { name:'七国之乱', year:'前154', description:'汉景帝采纳晁错削藩建议，引发吴王刘濞联合七国叛乱。景帝派周亚夫率军平叛，三个月内平定。', significance:'标志着西汉中央集权的全面胜利。此后诸侯王不再拥有军事行政大权，从根本上解决了诸侯坐大的问题。', era:'周亚夫·晁错', type:'军事', detail:'【背景】七国之乱发生在前154，是周亚夫·晁错主导的重大军事行动。\n\n【经过】汉景帝采纳晁错削藩建议，引发吴王刘濞联合七国叛乱。景帝派周亚夫率军平叛，三个月内平定。\n\n【后果与影响】标志着西汉中央集权的全面胜利。此后诸侯王不再拥有军事行政大权，从根本上解决了诸侯坐大的问题。' },
    { name:'汉武帝北击匈奴', year:'前133-前87', description:'汉武帝派卫青、霍去病多次出击匈奴。漠北之战霍去病封狼居胥山，匈奴从此无力南下。张骞出使西域开辟丝绸之路。', significance:'扭转了汉匈攻守态势，"匈奴远遁，漠南无王庭"。丝绸之路促进中西交流。', era:'汉武帝·卫青·霍去病', type:'军事', detail:'【背景】汉武帝北击匈奴发生在前133-前87，是汉武帝·卫青·霍去病主导的重大军事行动。\n\n【经过】汉武帝派卫青、霍去病多次出击匈奴。漠北之战霍去病封狼居胥山，匈奴从此无力南下。张骞出使西域开辟丝绸之路。\n\n【后果与影响】扭转了汉匈攻守态势，"匈奴远遁，漠南无王庭"。丝绸之路促进中西交流。' },
    { name:'推恩令', year:'前127', description:'主父偃建议汉武帝实行推恩令。规定诸侯王封地必须分给所有儿子，使诸侯国不断分裂变小，无力对抗中央。', significance:'以和平方式彻底解决了汉初诸侯王威胁中央的难题，是加强中央集权最成功的政策之一。', era:'汉武帝·主父偃', type:'政治', detail:'【背景】推恩令发生在前127，是汉武帝·主父偃时期的重要政治事件。\n\n【经过】主父偃建议汉武帝实行推恩令。规定诸侯王封地必须分给所有儿子，使诸侯国不断分裂变小，无力对抗中央。\n\n【后果与影响】以和平方式彻底解决了汉初诸侯王威胁中央的难题，是加强中央集权最成功的政策之一。' },
    { name:'巫蛊之祸', year:'前91', description:'江充诬告太子刘据以巫蛊诅咒武帝。刘据被迫起兵诛江充后自杀。武帝事后查明真相悔恨不已。数万人被牵连致死。', significance:'导致太子刘据、皇后卫子夫等数万人死亡。汉武帝晚年的昏聩使汉朝由盛转衰。', era:'汉武帝·江充', type:'政治', detail:'【背景】巫蛊之祸发生在前91，是汉武帝·江充时期的重要政治事件。\n\n【经过】江充诬告太子刘据以巫蛊诅咒武帝。刘据被迫起兵诛江充后自杀。武帝事后查明真相悔恨不已。数万人被牵连致死。\n\n【后果与影响】导致太子刘据、皇后卫子夫等数万人死亡。汉武帝晚年的昏聩使汉朝由盛转衰。' },
    { name:'昭君出塞', year:'前33', description:'汉元帝将宫女王昭君嫁给匈奴呼韩邪单于。昭君出塞后汉匈和平五十余年。', significance:'和亲政策的典范。昭君出塞成为民族团结的象征，在文学艺术中被广为传颂。', era:'王昭君·呼韩邪单于', type:'外交', detail:'【背景】昭君出塞发生在前33，是王昭君·呼韩邪单于时期的重要外交活动。\n\n【经过】汉元帝将宫女王昭君嫁给匈奴呼韩邪单于。昭君出塞后汉匈和平五十余年。\n\n【后果与影响】和亲政策的典范。昭君出塞成为民族团结的象征，在文学艺术中被广为传颂。' },
    { name:'王莽篡汉', year:'9-23', description:'外戚王莽废孺子婴，建立新朝。王莽推行复古改制，引发天下大乱。绿林军、赤眉军起义。', significance:'西汉灭亡。王莽改制是中国历史上一次重要但失败的改革实验。', era:'王莽', type:'政治', detail:'【背景】王莽篡汉发生在9-23，是王莽时期的重要政治事件。\n\n【经过】外戚王莽废孺子婴，建立新朝。王莽推行复古改制，引发天下大乱。绿林军、赤眉军起义。\n\n【后果与影响】西汉灭亡。王莽改制是中国历史上一次重要但失败的改革实验。' },
    { name:'昆阳之战', year:'23', description:'刘秀率一万七千人在昆阳迎战王莽四十万大军。以少胜多，内外夹击大破莽军。此战后刘秀声威大震。', significance:'奠定了刘秀推翻王莽复兴汉室的基础。为建立东汉开辟了道路。', era:'刘秀·王莽', type:'军事', detail:'【背景】昆阳之战发生在23，是刘秀·王莽主导的重大军事行动。\n\n【经过】刘秀率一万七千人在昆阳迎战王莽四十万大军。以少胜多，内外夹击大破莽军。此战后刘秀声威大震。\n\n【后果与影响】奠定了刘秀推翻王莽复兴汉室的基础。为建立东汉开辟了道路。' },
    { name:'光武中兴', year:'25-57', description:'刘秀建立东汉，释放奴婢、减省刑法、裁并郡县、精简官吏。退功臣而进文吏，使政治清明。', significance:'使汉朝国祚延续近两百年。刘秀柔道治国的理念开创了不同于西汉的统治风格。', era:'汉光武帝', type:'政治', detail:'【背景】光武中兴发生在25-57，是汉光武帝时期的重要政治事件。\n\n【经过】刘秀建立东汉，释放奴婢、减省刑法、裁并郡县、精简官吏。退功臣而进文吏，使政治清明。\n\n【后果与影响】使汉朝国祚延续近两百年。刘秀柔道治国的理念开创了不同于西汉的统治风格。' },
    { name:'黄巾起义', year:'184', description:'张角创立太平道，发动黄巾军起义。起义军数十万人，席卷八州。东汉调集各州郡镇压，虽平定了起义但地方势力坐大。', significance:'黄巾起义标志着东汉末年的开始。此后群雄割据，最终导致三国鼎立。' , era:'张角·曹操', type:'军事' },
    { name:'赤壁之战', year:'208', description:'孙权刘备联军在赤壁以火攻大败曹操大军。曹操退回北方，形成三国鼎立的格局。', significance:'赤壁之战奠定了三国鼎立的基础。此后曹操退守北方，刘备得荆州益州，孙权巩固江东。', era:'曹操·周瑜·诸葛亮', type:'军事', detail:'【背景】赤壁之战发生在208，是曹操·周瑜·诸葛亮主导的重大军事行动。\n\n【经过】孙权刘备联军在赤壁以火攻大败曹操大军。曹操退回北方，形成三国鼎立的格局。\n\n【后果与影响】赤壁之战奠定了三国鼎立的基础。此后曹操退守北方，刘备得荆州益州，孙权巩固江东。' },
    { name:'丝绸之路', year:'前138-127', description:'张骞奉汉武帝之命两次出使西域，开辟了连接中国与中亚、西亚乃至欧洲的商路。丝绸之路成为东西方文明交流的大动脉。', significance:'丝绸之路促进了中国与世界的经济文化交流。张骞被誉为"第一个睁开眼睛看世界的中国人"。', era:'张骞·汉武帝', type:'文化', detail:'【背景】丝绸之路发生在前138-127，是张骞·汉武帝时期的重要文化事业。\n\n【经过】张骞奉汉武帝之命两次出使西域，开辟了连接中国与中亚、西亚乃至欧洲的商路。丝绸之路成为东西方文明交流的大动脉。\n\n【后果与影响】丝绸之路促进了中国与世界的经济文化交流。张骞被誉为"第一个睁开眼睛看世界的中国人"。' },
    { name:'司马迁著《史记》', year:'前91', description:'太史令司马迁历时十四年完成中国第一部纪传体通史《史记》，记载从黄帝到汉武帝三千余年历史。', significance:'中国史学的巅峰之作，「史家之绝唱无韵之离骚」。开创了纪传体史书体例。', era:'司马迁', type:'文化', detail:'【背景】司马迁著《史记》发生在前91，是司马迁时期的重要文化事业。\n\n【经过】太史令司马迁历时十四年完成中国第一部纪传体通史《史记》，记载从黄帝到汉武帝三千余年历史。\n\n【后果与影响】中国史学的巅峰之作，「史家之绝唱无韵之离骚」。开创了纪传体史书体例。' },
    { name:'蔡伦改进造纸术', year:'105', description:'东汉宦官蔡伦总结前人经验改进造纸术，用树皮麻头破布渔网等原料制造出便宜的纸张。', significance:'中国四大发明之一。造纸术传遍世界，对人类文明发展产生了不可估量的影响。', era:'蔡伦·汉和帝', type:'科技', detail:'【背景】蔡伦改进造纸术发生在105，是蔡伦·汉和帝时期的重要科技成果。\n\n【经过】东汉宦官蔡伦总结前人经验改进造纸术，用树皮麻头破布渔网等原料制造出便宜的纸张。\n\n【后果与影响】中国四大发明之一。造纸术传遍世界，对人类文明发展产生了不可估量的影响。' },
    { name:'罢黜百家独尊儒术', year:'前136', description:'董仲舒向汉武帝建议"罢黜百家表彰六经"，汉武帝采纳此建议，在太学设立五经博士，儒家学说成为官方正统思想。"独尊儒术"成为此后两千年中国社会的指导思想。', significance:'儒家思想成为中国古代社会的正统意识形态。确立了以儒学为核心的文化传统，对中国历史发展产生了深远影响，但也导致了思想禁锢和学术单一化。', era:'汉武帝·董仲舒', type:'文化', detail:'【背景】罢黜百家独尊儒术发生在前136，是汉武帝·董仲舒时期的重要文化事业。\n\n【经过】董仲舒向汉武帝建议"罢黜百家表彰六经"，汉武帝采纳此建议，在太学设立五经博士，儒家学说成为官方正统思想。"独尊儒术"成为此后两千年中国社会的指导思想。\n\n【后果与影响】儒家思想成为中国古代社会的正统意识形态。确立了以儒学为核心的文化传统，对中国历史发展产生了深远影响，但也导致了思想禁锢和学术单一化。' },
  ],
  3: [  // 晋
    { name:'八王之乱', year:'291-306', description:'晋惠帝庸愚，皇后贾南风专权。赵王司马伦起兵诛贾后，随后齐王、成都王、河间王等诸王卷入混战，历时十六年。', significance:'西晋由盛转衰的根本转折点。耗尽国力、边境空虚，导致五胡乱华、西晋灭亡。', era:'贾南风·司马伦·司马冏', type:'军事', detail:'【背景】八王之乱发生在291-306，是贾南风·司马伦·司马冏主导的重大军事行动。\n\n【经过】晋惠帝庸愚，皇后贾南风专权。赵王司马伦起兵诛贾后，随后齐王、成都王、河间王等诸王卷入混战，历时十六年。\n\n【后果与影响】西晋由盛转衰的根本转折点。耗尽国力、边境空虚，导致五胡乱华、西晋灭亡。' },
    { name:'永嘉之乱', year:'311', description:'匈奴刘聪攻破洛阳，俘虏晋怀帝，屠杀王公士民三万余人。中原士族大量南迁，史称"衣冠南渡"。', significance:'西晋实际上已经灭亡。永嘉之乱是五胡乱华时期最惨烈的战役之一。衣冠南渡促进了江南经济文化发展。', era:'刘聪·晋怀帝', type:'军事', detail:'【背景】永嘉之乱发生在311，是刘聪·晋怀帝主导的重大军事行动。\n\n【经过】匈奴刘聪攻破洛阳，俘虏晋怀帝，屠杀王公士民三万余人。中原士族大量南迁，史称"衣冠南渡"。\n\n【后果与影响】西晋实际上已经灭亡。永嘉之乱是五胡乱华时期最惨烈的战役之一。衣冠南渡促进了江南经济文化发展。' },
    { name:'淝水之战', year:'383', description:'前秦苻坚率百万大军南征东晋。谢安谢玄率北府兵八万在淝水大败前秦军。苻坚败逃，前秦分裂。', significance:'以少胜多的经典战例。此战保住东晋政权，前秦崩溃，北方重新陷入分裂。谢安一战成名。', era:'谢安·谢玄·苻坚', type:'军事', detail:'【背景】淝水之战发生在383，是谢安·谢玄·苻坚主导的重大军事行动。\n\n【经过】前秦苻坚率百万大军南征东晋。谢安谢玄率北府兵八万在淝水大败前秦军。苻坚败逃，前秦分裂。\n\n【后果与影响】以少胜多的经典战例。此战保住东晋政权，前秦崩溃，北方重新陷入分裂。谢安一战成名。' },
    { name:'王与马共天下', year:'318-322', description:'司马睿在建康建立东晋，琅琊王氏掌权。王导居中掌朝政，王敦在外掌兵权，形成门阀政治格局。', significance:'反映了东晋门阀政治的特征。皇帝与士族共治天下的格局贯穿东晋一百余年。', era:'王导·王敦·司马睿', type:'政治', detail:'【背景】王与马共天下发生在318-322，是王导·王敦·司马睿时期的重要政治事件。\n\n【经过】司马睿在建康建立东晋，琅琊王氏掌权。王导居中掌朝政，王敦在外掌兵权，形成门阀政治格局。\n\n【后果与影响】反映了东晋门阀政治的特征。皇帝与士族共治天下的格局贯穿东晋一百余年。' },
    { name:'西晋统一全国', year:'280', description:'晋武帝司马炎发兵灭吴，吴主孙皓投降，三国归晋。近百年的分裂局面结束。', significance:'结束了三国鼎立的分裂局面。但西晋的统一仅维持三十余年就陷入八王之乱。', era:'晋武帝·孙皓', type:'军事', detail:'【背景】西晋统一全国发生在280，是晋武帝·孙皓主导的重大军事行动。\n\n【经过】晋武帝司马炎发兵灭吴，吴主孙皓投降，三国归晋。近百年的分裂局面结束。\n\n【后果与影响】结束了三国鼎立的分裂局面。但西晋的统一仅维持三十余年就陷入八王之乱。' },
    { name:'书圣王羲之', year:'303-361', description:'东晋书法家王羲之被誉为书圣，其《兰亭集序》被誉为天下第一行书，影响中国书法史一千余年。', significance:'中国最伟大的书法家，其书法艺术成为后世文人学习典范。', era:'王羲之', type:'文化', detail:'【背景】书圣王羲之发生在303-361，是王羲之时期的重要文化事业。\n\n【经过】东晋书法家王羲之被誉为书圣，其《兰亭集序》被誉为天下第一行书，影响中国书法史一千余年。\n\n【后果与影响】中国最伟大的书法家，其书法艺术成为后世文人学习典范。' },
    { name:'五胡乱华', year:'304-439', description:'西晋末年，匈奴、鲜卑、羯、氐、羌等北方少数民族纷纷入主中原建立政权。刘渊建立汉赵，石勒建立后赵，慕容氏建立前燕等。北方陷入长达百余年的混战。', significance:'五胡乱华是中国历史上第一次大规模少数民族入主中原。深刻改变了中国的人口结构和民族格局，促进了民族大融合。中原士族大量南迁（衣冠南渡），推动江南经济发展。', era:'刘渊·石勒·拓跋珪', type:'军事', detail:'【背景】五胡乱华发生在304-439，是刘渊·石勒·拓跋珪主导的重大军事行动。\n\n【经过】西晋末年，匈奴、鲜卑、羯、氐、羌等北方少数民族纷纷入主中原建立政权。刘渊建立汉赵，石勒建立后赵，慕容氏建立前燕等。北方陷入长达百余年的混战。\n\n【后果与影响】五胡乱华是中国历史上第一次大规模少数民族入主中原。深刻改变了中国的人口结构和民族格局，促进了民族大融合。中原士族大量南迁（衣冠南渡），推动江南经济发展。' },
  ],
  4: [  // 南北朝
    { name:'北魏统一北方', year:'439', description:'北魏太武帝拓跋焘灭北凉，统一北方。结束了五胡十六国的长期混战局面，南北朝格局正式形成。', significance:'北魏的统一使北方结束了百余年的战乱，为后来的隋朝统一全国奠定了基础。', era:'拓跋焘', type:'军事', detail:'【背景】北魏统一北方发生在439，是拓跋焘主导的重大军事行动。\n\n【经过】北魏太武帝拓跋焘灭北凉，统一北方。结束了五胡十六国的长期混战局面，南北朝格局正式形成。\n\n【后果与影响】北魏的统一使北方结束了百余年的战乱，为后来的隋朝统一全国奠定了基础。' },
    { name:'孝文帝改革', year:'471-499', description:'北魏孝文帝推行全面汉化改革：迁都洛阳、改鲜卑姓为汉姓、穿汉服、说汉语、与汉族通婚。', significance:'中国历史上最成功的少数民族汉化改革之一。推动了北方民族大融合。', era:'孝文帝元宏', type:'改革', detail:'【背景】孝文帝改革推行于471-499，由孝文帝元宏主导实施。\n\n【经过】北魏孝文帝推行全面汉化改革：迁都洛阳、改鲜卑姓为汉姓、穿汉服、说汉语、与汉族通婚。\n\n【后果与影响】中国历史上最成功的少数民族汉化改革之一。推动了北方民族大融合。' },
    { name:'侯景之乱', year:'548-552', description:'东魏降将侯景在梁发动叛乱，攻破建康。梁武帝饿死台城，江南社会经济遭到严重破坏。', significance:'南朝从盛转衰的转折点。侯景之乱摧毁了南朝的繁荣，门阀士族遭受毁灭性打击。', era:'侯景·梁武帝', type:'军事', detail:'【背景】侯景之乱发生在548-552，是侯景·梁武帝主导的重大军事行动。\n\n【经过】东魏降将侯景在梁发动叛乱，攻破建康。梁武帝饿死台城，江南社会经济遭到严重破坏。\n\n【后果与影响】南朝从盛转衰的转折点。侯景之乱摧毁了南朝的繁荣，门阀士族遭受毁灭性打击。' },
    { name:'周武帝灭佛', year:'574', description:'北周武帝宇文邕推行灭佛运动，下令废除境内佛寺，僧尼还俗。没收寺院财产充入国库，大量僧尼编入民籍。', significance:'灭佛运动增加了国家劳动力和财政收入，为北周灭北齐统一北方奠定基础。但也造成佛教文化的大量损失。此后隋唐两代对宗教采取更为宽容的政策。', era:'周武帝宇文邕', type:'改革', detail:'【背景】周武帝灭佛推行于574，由周武帝宇文邕主导实施。\n\n【经过】北周武帝宇文邕推行灭佛运动，下令废除境内佛寺，僧尼还俗。没收寺院财产充入国库，大量僧尼编入民籍。\n\n【后果与影响】灭佛运动增加了国家劳动力和财政收入，为北周灭北齐统一北方奠定基础。但也造成佛教文化的大量损失。此后隋唐两代对宗教采取更为宽容的政策。' },
    { name:'北魏分裂', year:'534-535', description:'北魏孝武帝与权臣高欢决裂，西奔关中投靠宇文泰。高欢另立元善见为帝（东魏），宇文泰杀孝武帝立元宝炬为帝（西魏）。北魏正式分裂为东魏西魏。', significance:'北魏分裂标志着北方统一政权的终结。东西魏对峙为北齐北周并立奠定基础，最终北周灭北齐统一北方。', era:'高欢·宇文泰·孝武帝', type:'政治', detail:'【背景】北魏分裂发生在534-535，是高欢·宇文泰·孝武帝时期的重要政治事件。\n\n【经过】北魏孝武帝与权臣高欢决裂，西奔关中投靠宇文泰。高欢另立元善见为帝（东魏），宇文泰杀孝武帝立元宝炬为帝（西魏）。北魏正式分裂为东魏西魏。\n\n【后果与影响】北魏分裂标志着北方统一政权的终结。东西魏对峙为北齐北周并立奠定基础，最终北周灭北齐统一北方。' },
    { name:'府兵制创立', year:'约550', description:'西魏宇文泰创立府兵制，将兵民分离，设八柱国、十二大将军。士兵自备甲仗，平时务农战时从军。', significance:'府兵制为北周统一北方、隋唐统一全国提供了军事制度保障。后被隋唐继承完善。', era:'宇文泰', type:'改革', detail:'【背景】府兵制创立推行于约550，由宇文泰主导实施。\n\n【经过】西魏宇文泰创立府兵制，将兵民分离，设八柱国、十二大将军。士兵自备甲仗，平时务农战时从军。\n\n【后果与影响】府兵制为北周统一北方、隋唐统一全国提供了军事制度保障。后被隋唐继承完善。' },
    { name:'《木兰辞》等北朝民歌', year:'386-581', description:'北朝时期产生大量反映游牧民族生活和战争题材的民歌。代表作《木兰辞》讲述花木兰代父从军的故事。', significance:'北朝民歌风格刚健质朴，与南朝文学形成鲜明对比。《木兰辞》成为中国家喻户晓的文学经典。', era:'佚名', type:'文化', detail:'【背景】《木兰辞》等北朝民歌发生在386-581，是佚名时期的重要文化事业。\n\n【经过】北朝时期产生大量反映游牧民族生活和战争题材的民歌。代表作《木兰辞》讲述花木兰代父从军的故事。\n\n【后果与影响】北朝民歌风格刚健质朴，与南朝文学形成鲜明对比。《木兰辞》成为中国家喻户晓的文学经典。' },
    { name:'郦道元著《水经注》', year:'约520', description:'北魏地理学家郦道元为《水经》作注，撰写《水经注》约三十万字，记述大小河流一千余条。', significance:'中国古代最全面系统的地理学著作，对后世地理学研究具有极高价值。', era:'郦道元', type:'科技', detail:'【背景】郦道元著《水经注》发生在约520，是郦道元时期的重要科技成果。\n\n【经过】北魏地理学家郦道元为《水经》作注，撰写《水经注》约三十万字，记述大小河流一千余条。\n\n【后果与影响】中国古代最全面系统的地理学著作，对后世地理学研究具有极高价值。' },
  ],
  5: [  // 隋
    { name:'开皇之治', year:'581-604', description:'隋文帝杨坚统一后推行系列改革：废九品中正制、创立科举制；三省六部制；均田制和租庸调制；修《开皇律》。社会安定繁荣。', significance:'为隋唐盛世的到来奠定了制度基础。科举制度打破了门阀世族对官场的垄断。', era:'隋文帝·高颎', type:'政治', detail:'【背景】开皇之治发生在581-604，是隋文帝·高颎时期的重要政治事件。\n\n【经过】隋文帝杨坚统一后推行系列改革：废九品中正制、创立科举制；三省六部制；均田制和租庸调制；修《开皇律》。社会安定繁荣。\n\n【后果与影响】为隋唐盛世的到来奠定了制度基础。科举制度打破了门阀世族对官场的垄断。' },
    { name:'隋末农民起义', year:'611-618', description:'隋炀帝滥用民力，百姓不堪重负。王薄在长白山首先起义，随后翟让李密领导瓦岗军、窦建德领导河北义军、杜伏威领导江淮义军等数十支起义军遍布全国。', significance:'隋末农民大起义直接导致隋朝覆灭。李渊利用天下大乱之机从太原起兵最终建立唐朝。瓦岗军李密等势力最大但未能统一天下。', era:'李密·窦建德·杜伏威', type:'军事', detail:'【背景】隋末农民起义发生在611-618，是李密·窦建德·杜伏威主导的重大军事行动。\n\n【经过】隋炀帝滥用民力，百姓不堪重负。王薄在长白山首先起义，随后翟让李密领导瓦岗军、窦建德领导河北义军、杜伏威领导江淮义军等数十支起义军遍布全国。\n\n【后果与影响】隋末农民大起义直接导致隋朝覆灭。李渊利用天下大乱之机从太原起兵最终建立唐朝。瓦岗军李密等势力最大但未能统一天下。' },
    { name:'开凿大运河', year:'605-610', description:'隋炀帝征发数百万民夫开凿大运河，连接海河黄河淮河长江钱塘江五大水系，南起余杭北达涿郡全长两千余公里。', significance:'中国古代最宏伟的水利工程之一。加强了南北联系促进了经济文化交流。但劳役过重是隋末民变的重要原因。', era:'隋炀帝·宇文恺', type:'工程', detail:'【背景】开凿大运河发生在605-610，是隋炀帝·宇文恺时期的重要工程建设。\n\n【经过】隋炀帝征发数百万民夫开凿大运河，连接海河黄河淮河长江钱塘江五大水系，南起余杭北达涿郡全长两千余公里。\n\n【后果与影响】中国古代最宏伟的水利工程之一。加强了南北联系促进了经济文化交流。但劳役过重是隋末民变的重要原因。' },
    { name:'三征高句丽', year:'612-614', description:'隋炀帝三次大规模远征高句丽，动用兵力百余万人。但因统率失误、补给困难，均以惨败告终。', significance:'隋朝元气大伤，民众苦不堪言，直接引发了隋末农民大起义，是隋朝迅速灭亡的重要原因。', era:'隋炀帝', type:'军事', detail:'【背景】三征高句丽发生在612-614，是隋炀帝主导的重大军事行动。\n\n【经过】隋炀帝三次大规模远征高句丽，动用兵力百余万人。但因统率失误、补给困难，均以惨败告终。\n\n【后果与影响】隋朝元气大伤，民众苦不堪言，直接引发了隋末农民大起义，是隋朝迅速灭亡的重要原因。' },
    { name:'科举制创立', year:'587', description:'隋文帝废除九品中正制，开始用分科考试的方式选拔官员。隋炀帝设立进士科，科举制度正式确立。', significance:'科举制度是中国古代最重要的制度创新之一。打破了门阀世族对官场的垄断，促进了社会流动。', era:'隋文帝·隋炀帝', type:'改革', detail:'【背景】科举制创立推行于587，由隋文帝·隋炀帝主导实施。\n\n【经过】隋文帝废除九品中正制，开始用分科考试的方式选拔官员。隋炀帝设立进士科，科举制度正式确立。\n\n【后果与影响】科举制度是中国古代最重要的制度创新之一。打破了门阀世族对官场的垄断，促进了社会流动。' },
    { name:'修建大兴城', year:'582-583', description:'隋文帝命宇文恺在长安故城东南修建新都大兴城，面积达84平方公里，布局严整。', significance:'当时世界上规模最大规划最严整的城市。唐代改称长安并继续沿用。', era:'隋文帝·宇文恺', type:'工程', detail:'【背景】修建大兴城发生在582-583，是隋文帝·宇文恺时期的重要工程建设。\n\n【经过】隋文帝命宇文恺在长安故城东南修建新都大兴城，面积达84平方公里，布局严整。\n\n【后果与影响】当时世界上规模最大规划最严整的城市。唐代改称长安并继续沿用。' },
    { name:'裴矩通西域', year:'605-610', description:'隋炀帝派裴矩前往张掖主持与西域各国的贸易交往，撰《西域图记》记载西域四十四国风土。', significance:'隋朝恢复了丝绸之路的繁荣，促进了中原与西域各国的经济文化交流。', era:'隋炀帝·裴矩', type:'外交', detail:'【背景】裴矩通西域发生在605-610，是隋炀帝·裴矩时期的重要外交活动。\n\n【经过】隋炀帝派裴矩前往张掖主持与西域各国的贸易交往，撰《西域图记》记载西域四十四国风土。\n\n【后果与影响】隋朝恢复了丝绸之路的繁荣，促进了中原与西域各国的经济文化交流。' },
  ],
  6: [  // 唐
    { name:'玄武门之变', year:'626', description:'李世民在长安玄武门设伏射杀太子李建成和齐王李元吉，迫使父亲李渊退位登基。', significance:'最著名的宫廷政变之一。虽然手段残酷但李世民即位后开创了贞观之治。', era:'唐太宗·李建成', type:'政治', detail:'【背景】玄武门之变发生在626，是唐太宗·李建成时期的重要政治事件。\n\n【经过】李世民在长安玄武门设伏射杀太子李建成和齐王李元吉，迫使父亲李渊退位登基。\n\n【后果与影响】最著名的宫廷政变之一。虽然手段残酷但李世民即位后开创了贞观之治。' },
    { name:'贞观之治', year:'627-649', description:'唐太宗虚心纳谏任用贤能，以魏征房玄龄杜如晦等为相。对外征服东突厥吐谷浑等，被尊为"天可汗"。', significance:'中国历史上最著名的盛世之一。政治清明经济繁荣文化发达，为后来的开元盛世奠定了基础。', era:'唐太宗·魏征', type:'政治', detail:'【背景】贞观之治发生在627-649，是唐太宗·魏征时期的重要政治事件。\n\n【经过】唐太宗虚心纳谏任用贤能，以魏征房玄龄杜如晦等为相。对外征服东突厥吐谷浑等，被尊为"天可汗"。\n\n【后果与影响】中国历史上最著名的盛世之一。政治清明经济繁荣文化发达，为后来的开元盛世奠定了基础。' },
    { name:'灭高句丽', year:'668', description:'唐高宗派李勣率军攻破平壤，灭亡立国近七百年的高句丽政权。在其故地设安东都护府。', significance:'结束了中国东北地区长期独立于中原政权的局面。唐朝疆域达到极盛。', era:'唐高宗·李勣', type:'军事', detail:'【背景】灭高句丽发生在668，是唐高宗·李勣主导的重大军事行动。\n\n【经过】唐高宗派李勣率军攻破平壤，灭亡立国近七百年的高句丽政权。在其故地设安东都护府。\n\n【后果与影响】结束了中国东北地区长期独立于中原政权的局面。唐朝疆域达到极盛。' },
    { name:'神龙政变', year:'705', description:'张柬之等联合右羽林大将军发动政变，诛杀武则天宠臣，逼迫武则天退位，拥立唐中宗李显复位。', significance:'结束了武则天长达十五年的统治，恢复了李唐王朝。', era:'张柬之·武则天', type:'政治', detail:'【背景】神龙政变发生在705，是张柬之·武则天时期的重要政治事件。\n\n【经过】张柬之等联合右羽林大将军发动政变，诛杀武则天宠臣，逼迫武则天退位，拥立唐中宗李显复位。\n\n【后果与影响】结束了武则天长达十五年的统治，恢复了李唐王朝。' },
    { name:'开元盛世', year:'713-741', description:'唐玄宗在位前期励精图治，任用姚崇宋璟等贤相。唐朝达到鼎盛，长安成为世界性大都市。', significance:'唐朝乃至整个中国封建社会的鼎盛时期。杜甫诗云"忆昔开元全盛日，小邑犹藏万家室"。', era:'唐玄宗·姚崇', type:'政治', detail:'【背景】开元盛世发生在713-741，是唐玄宗·姚崇时期的重要政治事件。\n\n【经过】唐玄宗在位前期励精图治，任用姚崇宋璟等贤相。唐朝达到鼎盛，长安成为世界性大都市。\n\n【后果与影响】唐朝乃至整个中国封建社会的鼎盛时期。杜甫诗云"忆昔开元全盛日，小邑犹藏万家室"。' },
    { name:'安史之乱', year:'755-763', description:'三镇节度使安禄山在范阳起兵，迅速攻占洛阳长安。唐玄宗出逃四川，马嵬坡兵变杨贵妃被缢死。', significance:'唐朝由盛转衰的转折点。此后藩镇割据宦官专权朋党之争三大问题日益严重。', era:'安禄山·唐玄宗', type:'军事', detail:'【背景】安史之乱发生在755-763，是安禄山·唐玄宗主导的重大军事行动。\n\n【经过】三镇节度使安禄山在范阳起兵，迅速攻占洛阳长安。唐玄宗出逃四川，马嵬坡兵变杨贵妃被缢死。\n\n【后果与影响】唐朝由盛转衰的转折点。此后藩镇割据宦官专权朋党之争三大问题日益严重。' },
    { name:'元和中兴', year:'805-820', description:'唐宪宗励精图治，任用杜黄裳裴度等贤相，削弱藩镇势力。先后平定西川镇海淮西等节度使叛乱。', significance:'安史之乱后最有成效的中央集权努力，为唐朝延续了近百年的国祚。', era:'唐宪宗·裴度', type:'政治', detail:'【背景】元和中兴发生在805-820，是唐宪宗·裴度时期的重要政治事件。\n\n【经过】唐宪宗励精图治，任用杜黄裳裴度等贤相，削弱藩镇势力。先后平定西川镇海淮西等节度使叛乱。\n\n【后果与影响】安史之乱后最有成效的中央集权努力，为唐朝延续了近百年的国祚。' },
    { name:'牛李党争', year:'808-846', description:'以牛僧孺李宗闵为首的牛党和以李德裕为首的李党之间长达四十年的派系斗争。两党互相倾轧，朝政日益败坏。', significance:'唐朝晚期政治腐败的集中体现。朋党之争严重消耗了唐朝的国力。', era:'牛僧孺·李德裕', type:'政治', detail:'【背景】牛李党争发生在808-846，是牛僧孺·李德裕时期的重要政治事件。\n\n【经过】以牛僧孺李宗闵为首的牛党和以李德裕为首的李党之间长达四十年的派系斗争。两党互相倾轧，朝政日益败坏。\n\n【后果与影响】唐朝晚期政治腐败的集中体现。朋党之争严重消耗了唐朝的国力。' },
    { name:'黄巢起义', year:'875-884', description:'私盐贩出身的黄巢率众起义，转战大半个中国，攻占长安建立大齐政权。后被李克用等镇压。', significance:'沉重打击了唐朝的统治基础。此后唐朝名存实亡，藩镇割据加剧。朱温后来篡唐。', era:'黄巢·朱温', type:'军事', detail:'【背景】黄巢起义发生在875-884，是黄巢·朱温主导的重大军事行动。\n\n【经过】私盐贩出身的黄巢率众起义，转战大半个中国，攻占长安建立大齐政权。后被李克用等镇压。\n\n【后果与影响】沉重打击了唐朝的统治基础。此后唐朝名存实亡，藩镇割据加剧。朱温后来篡唐。' },
    { name:'武则天称帝', year:'690', description:'武则天废睿宗李旦改国号为周，正式登基成为中国历史上唯一得到普遍承认的女皇帝。创立殿试和武举。', significance:'中国女性政治权力的巅峰。科举改革影响深远，其统治上承贞观之治下启开元盛世。', era:'武则天', type:'政治', detail:'【背景】武则天称帝发生在690，是武则天时期的重要政治事件。\n\n【经过】武则天废睿宗李旦改国号为周，正式登基成为中国历史上唯一得到普遍承认的女皇帝。创立殿试和武举。\n\n【后果与影响】中国女性政治权力的巅峰。科举改革影响深远，其统治上承贞观之治下启开元盛世。' },
    { name:'遣唐使来华', year:'630-894', description:'日本先后派遣十九次遣唐使团来中国学习唐朝制度文化。阿倍仲麻吕（晁衡）在唐朝为官数十年。', significance:'中日文化交流的高峰。遣唐使将唐朝律令制度佛教建筑文字等带回日本。', era:'晁衡·吉备真备', type:'外交', detail:'【背景】遣唐使来华发生在630-894，是晁衡·吉备真备时期的重要外交活动。\n\n【经过】日本先后派遣十九次遣唐使团来中国学习唐朝制度文化。阿倍仲麻吕（晁衡）在唐朝为官数十年。\n\n【后果与影响】中日文化交流的高峰。遣唐使将唐朝律令制度佛教建筑文字等带回日本。' },
    { name:'雕版印刷《金刚经》', year:'868', description:'现存最早有明确纪年的雕版印刷品《金刚般若波罗蜜经》在王玠出资下刊刻完成，卷首扉画精美。', significance:'证明唐代雕版印刷技术已高度成熟。印刷术极大地促进了知识和文化的传播。', era:'王玠', type:'科技', detail:'【背景】雕版印刷《金刚经》发生在868，是王玠时期的重要科技成果。\n\n【经过】现存最早有明确纪年的雕版印刷品《金刚般若波罗蜜经》在王玠出资下刊刻完成，卷首扉画精美。\n\n【后果与影响】证明唐代雕版印刷技术已高度成熟。印刷术极大地促进了知识和文化的传播。' },
  ],
  7: [  // 宋
    { name:'陈桥兵变', year:'960', description:'后周大将赵匡胤在陈桥驿被部下黄袍加身拥立为帝，回师开封逼迫后周恭帝禅位建立宋朝。', significance:'以较为和平的方式完成政权更迭。赵匡胤兵不血刃夺取天下较为罕见。', era:'宋太祖', type:'政治', detail:'【背景】陈桥兵变发生在960，是宋太祖时期的重要政治事件。\n\n【经过】后周大将赵匡胤在陈桥驿被部下黄袍加身拥立为帝，回师开封逼迫后周恭帝禅位建立宋朝。\n\n【后果与影响】以较为和平的方式完成政权更迭。赵匡胤兵不血刃夺取天下较为罕见。' },
    { name:'杯酒释兵权', year:'961', description:'赵匡胤在宴会上以高官厚禄劝说石守信等开国将领交出兵权，众将次日纷纷称病辞职。', significance:'以和平方式解决开国功臣拥兵自重问题。但也导致宋朝重文轻武军事实力长期薄弱。', era:'宋太祖·石守信', type:'政治', detail:'【背景】杯酒释兵权发生在961，是宋太祖·石守信时期的重要政治事件。\n\n【经过】赵匡胤在宴会上以高官厚禄劝说石守信等开国将领交出兵权，众将次日纷纷称病辞职。\n\n【后果与影响】以和平方式解决开国功臣拥兵自重问题。但也导致宋朝重文轻武军事实力长期薄弱。' },
    { name:'澶渊之盟', year:'1005', description:'辽国大举南侵，宋真宗在寇准力劝下御驾亲征。宋军射杀辽军主帅，最终宋辽签订和议：宋每年纳岁币。', significance:'维持宋辽百年和平，为宋朝经济文化繁荣创造稳定环境。岁币制度体现宋朝外交弱势。', era:'宋真宗·寇准', type:'外交', detail:'【背景】澶渊之盟发生在1005，是宋真宗·寇准时期的重要外交活动。\n\n【经过】辽国大举南侵，宋真宗在寇准力劝下御驾亲征。宋军射杀辽军主帅，最终宋辽签订和议：宋每年纳岁币。\n\n【后果与影响】维持宋辽百年和平，为宋朝经济文化繁荣创造稳定环境。岁币制度体现宋朝外交弱势。' },
    { name:'王安石变法', year:'1069-1085', description:'宋神宗支持王安石推行变法：青苗法免役法市易法保甲法等，旨在富国强兵扭转积贫积弱局面。', significance:'北宋规模最大影响最深远的改革运动。虽因保守势力阻挠而失败，但其许多理念超越时代。', era:'王安石·宋神宗', type:'改革', detail:'【背景】王安石变法推行于1069-1085，由王安石·宋神宗主导实施。\n\n【经过】宋神宗支持王安石推行变法：青苗法免役法市易法保甲法等，旨在富国强兵扭转积贫积弱局面。\n\n【后果与影响】北宋规模最大影响最深远的改革运动。虽因保守势力阻挠而失败，但其许多理念超越时代。' },
    { name:'靖康之变', year:'1127', description:'金军南下攻破北宋都城开封，俘虏宋徽宗宋钦宗父子及大量赵氏皇族三千余人押送北上，北宋灭亡。', significance:'北宋终结的重大国耻。徽钦二帝被俘受尽屈辱，成为南宋军民挥之不去的伤痛。', era:'宋徽宗·金太宗', type:'军事', detail:'【背景】靖康之变发生在1127，是宋徽宗·金太宗主导的重大军事行动。\n\n【经过】金军南下攻破北宋都城开封，俘虏宋徽宗宋钦宗父子及大量赵氏皇族三千余人押送北上，北宋灭亡。\n\n【后果与影响】北宋终结的重大国耻。徽钦二帝被俘受尽屈辱，成为南宋军民挥之不去的伤痛。' },
    { name:'岳飞北伐', year:'1134-1141', description:'岳飞率岳家军北伐金国，在郾城颍昌大败金军，收复大片失地。即将直捣黄龙时被宋高宗十二道金牌召回。', significance:'岳飞是中国历史上最著名的民族英雄之一。其悲剧命运反映了南宋朝廷的苟安和内部矛盾。', era:'岳飞·秦桧', type:'军事', detail:'【背景】岳飞北伐发生在1134-1141，是岳飞·秦桧主导的重大军事行动。\n\n【经过】岳飞率岳家军北伐金国，在郾城颍昌大败金军，收复大片失地。即将直捣黄龙时被宋高宗十二道金牌召回。\n\n【后果与影响】岳飞是中国历史上最著名的民族英雄之一。其悲剧命运反映了南宋朝廷的苟安和内部矛盾。' },
    { name:'绍兴和议', year:'1141', description:'南宋与金签订和议：南宋向金称臣，每年纳贡银二十五万两绢二十五万匹。岳飞被以"莫须有"罪名处死。', significance:'维持宋金之间二十年的和平。称臣纳贡的屈辱条款和对岳飞的迫害使其成为历史上的争议事件。', era:'秦桧·岳飞', type:'外交', detail:'【背景】绍兴和议发生在1141，是秦桧·岳飞时期的重要外交活动。\n\n【经过】南宋与金签订和议：南宋向金称臣，每年纳贡银二十五万两绢二十五万匹。岳飞被以"莫须有"罪名处死。\n\n【后果与影响】维持宋金之间二十年的和平。称臣纳贡的屈辱条款和对岳飞的迫害使其成为历史上的争议事件。' },
    { name:'崖山海战', year:'1279', description:'元军与南宋在崖山决战。宋军大败，陆秀夫背负幼帝赵昺投海殉国，十数万军民跳海殉国。南宋灭亡。', significance:'南宋的终结。崖山海战是中国历史上最悲壮的战役之一。"崖山之后无中国"一说广为流传。', era:'陆秀夫·张世杰', type:'军事', detail:'【背景】崖山海战发生在1279，是陆秀夫·张世杰主导的重大军事行动。\n\n【经过】元军与南宋在崖山决战。宋军大败，陆秀夫背负幼帝赵昺投海殉国，十数万军民跳海殉国。南宋灭亡。\n\n【后果与影响】南宋的终结。崖山海战是中国历史上最悲壮的战役之一。"崖山之后无中国"一说广为流传。' },
    { name:'毕昇发明活字印刷术', year:'1041-1048', description:'北宋平民毕昇发明胶泥活字印刷术。用胶泥刻字火烧令坚排版印刷，为世界上最早的活字印刷技术。', significance:'印刷史上的一次革命。比德国古登堡发明铅活字早四百余年。', era:'毕昇', type:'科技', detail:'【背景】毕昇发明活字印刷术发生在1041-1048，是毕昇时期的重要科技成果。\n\n【经过】北宋平民毕昇发明胶泥活字印刷术。用胶泥刻字火烧令坚排版印刷，为世界上最早的活字印刷技术。\n\n【后果与影响】印刷史上的一次革命。比德国古登堡发明铅活字早四百余年。' },
    { name:'宋词文学鼎盛', year:'960-1279', description:'两宋时期词文学发展至鼎盛。苏轼开豪放派先河，辛弃疾继承发展，李清照为婉约派代表。', significance:'宋词与唐诗元曲并称中国文学史上的三座高峰，深刻影响了后世审美。', era:'苏轼·辛弃疾·李清照', type:'文化', detail:'【背景】宋词文学鼎盛发生在960-1279，是苏轼·辛弃疾·李清照时期的重要文化事业。\n\n【经过】两宋时期词文学发展至鼎盛。苏轼开豪放派先河，辛弃疾继承发展，李清照为婉约派代表。\n\n【后果与影响】宋词与唐诗元曲并称中国文学史上的三座高峰，深刻影响了后世审美。' },
  ],
  8: [  // 元
    { name:'蒙古西征', year:'1219-1260', description:'成吉思汗及后继者三次大规模西征。蒙古铁骑征服中亚西亚东欧大片领土，建立横跨欧亚的蒙古帝国。', significance:'世界历史上疆域最大的帝国。促进了东西方文明交流，但也造成了巨大破坏。', era:'成吉思汗·拔都·旭烈兀', type:'军事', detail:'【背景】蒙古西征发生在1219-1260，是成吉思汗·拔都·旭烈兀主导的重大军事行动。\n\n【经过】成吉思汗及后继者三次大规模西征。蒙古铁骑征服中亚西亚东欧大片领土，建立横跨欧亚的蒙古帝国。\n\n【后果与影响】世界历史上疆域最大的帝国。促进了东西方文明交流，但也造成了巨大破坏。' },
    { name:'四等人制', year:'1260-1368', description:'元朝将全国臣民按种族和征服先后分为四等：蒙古人、色目人（西域各族）、汉人（北方汉族）、南人（南宋遗民）。四等在仕途、法律、赋役等方面待遇悬殊。', significance:'四等人制加剧了民族矛盾，是元朝统治不稳定的重要原因。虽然促进了某些文化交流但也造成了深刻的社会分裂。', era:'元世祖忽必烈', type:'政治', detail:'【背景】四等人制发生在1260-1368，是元世祖忽必烈时期的重要政治事件。\n\n【经过】元朝将全国臣民按种族和征服先后分为四等：蒙古人、色目人（西域各族）、汉人（北方汉族）、南人（南宋遗民）。四等在仕途、法律、赋役等方面待遇悬殊。\n\n【后果与影响】四等人制加剧了民族矛盾，是元朝统治不稳定的重要原因。虽然促进了某些文化交流但也造成了深刻的社会分裂。' },
    { name:'元曲杂剧兴盛', year:'1271-1368', description:'元朝时期杂剧和散曲达到鼎盛。关汉卿创作《窦娥冤》等六十余部杂剧，王实甫《西厢记》被誉为天下夺魁。马致远白朴郑光祖等并称元曲四大家。', significance:'元曲与唐诗宋词并称中国文学史上的三座高峰。元杂剧开创了中国戏剧的新纪元。', era:'关汉卿·王实甫·马致远', type:'文化', detail:'【背景】元曲杂剧兴盛发生在1271-1368，是关汉卿·王实甫·马致远时期的重要文化事业。\n\n【经过】元朝时期杂剧和散曲达到鼎盛。关汉卿创作《窦娥冤》等六十余部杂剧，王实甫《西厢记》被誉为天下夺魁。马致远白朴郑光祖等并称元曲四大家。\n\n【后果与影响】元曲与唐诗宋词并称中国文学史上的三座高峰。元杂剧开创了中国戏剧的新纪元。' },
    { name:'灭亡南宋统一全国', year:'1276-1279', description:'忽必烈派伯颜南征，攻破临安。崖山海战宋军大败，南宋灭亡。中国历史上第一次由少数民族完成全国统一。', significance:'结束了自唐末以来数百年的分裂割据局面。行省制度对后世行政区划影响深远。', era:'忽必烈·伯颜', type:'军事', detail:'【背景】灭亡南宋统一全国发生在1276-1279，是忽必烈·伯颜主导的重大军事行动。\n\n【经过】忽必烈派伯颜南征，攻破临安。崖山海战宋军大败，南宋灭亡。中国历史上第一次由少数民族完成全国统一。\n\n【后果与影响】结束了自唐末以来数百年的分裂割据局面。行省制度对后世行政区划影响深远。' },
    { name:'行省制度', year:'1260-1294', description:'忽必烈在全国设立行中书省（行省），如岭北辽阳河南江浙江西湖广等。中央设中书省总理政务。', significance:'行省制度是中国行政区划史上的重大创新。奠定了后世省级行政区划的基础。', era:'忽必烈', type:'改革', detail:'【背景】行省制度推行于1260-1294，由忽必烈主导实施。\n\n【经过】忽必烈在全国设立行中书省（行省），如岭北辽阳河南江浙江西湖广等。中央设中书省总理政务。\n\n【后果与影响】行省制度是中国行政区划史上的重大创新。奠定了后世省级行政区划的基础。' },
    { name:'南坡之变', year:'1323', description:'元英宗推行新政触犯保守派利益。权臣铁木迭儿余党在南坡刺杀英宗。英宗改革以失败告终。', significance:'元朝由盛转衰的标志性事件。此后元朝政治日益腐败，皇位更迭频繁。', era:'元英宗·铁木迭儿', type:'政治', detail:'【背景】南坡之变发生在1323，是元英宗·铁木迭儿时期的重要政治事件。\n\n【经过】元英宗推行新政触犯保守派利益。权臣铁木迭儿余党在南坡刺杀英宗。英宗改革以失败告终。\n\n【后果与影响】元朝由盛转衰的标志性事件。此后元朝政治日益腐败，皇位更迭频繁。' },
    { name:'红巾军起义', year:'1351', description:'韩山童刘福通领导红巾军起义，提出"天道魔军杀不平"口号。朱元璋后来加入红巾军并逐步崛起。', significance:'元末农民大起义最终导致元朝灭亡。朱元璋从红巾军中崛起并建立了明朝。', era:'朱元璋·刘福通', type:'军事', detail:'【背景】红巾军起义发生在1351，是朱元璋·刘福通主导的重大军事行动。\n\n【经过】韩山童刘福通领导红巾军起义，提出"天道魔军杀不平"口号。朱元璋后来加入红巾军并逐步崛起。\n\n【后果与影响】元末农民大起义最终导致元朝灭亡。朱元璋从红巾军中崛起并建立了明朝。' },
    { name:'马可·波罗来华', year:'1271-1295', description:'威尼斯商人马可·波罗来到中国在元朝为官十七年。归国后口述《马可·波罗游记》。', significance:'向西方展示了中国的高度文明，激发了欧洲人对东方的向往，对大航海时代产生了直接影响。', era:'马可·波罗', type:'外交', detail:'【背景】马可·波罗来华发生在1271-1295，是马可·波罗时期的重要外交活动。\n\n【经过】威尼斯商人马可·波罗来到中国在元朝为官十七年。归国后口述《马可·波罗游记》。\n\n【后果与影响】向西方展示了中国的高度文明，激发了欧洲人对东方的向往，对大航海时代产生了直接影响。' },
    { name:'郭守敬编《授时历》', year:'1281', description:'天文学家郭守敬主持编制《授时历》，以365.2425天为一年，与现行公历相同但早了三百年。', significance:'中国古代最精确的历法。反映了元代科学技术的卓越成就。', era:'郭守敬·忽必烈', type:'科技', detail:'【背景】郭守敬编《授时历》发生在1281，是郭守敬·忽必烈时期的重要科技成果。\n\n【经过】天文学家郭守敬主持编制《授时历》，以365.2425天为一年，与现行公历相同但早了三百年。\n\n【后果与影响】中国古代最精确的历法。反映了元代科学技术的卓越成就。' },
  ],
  9: [  // 明
    { name:'洪武之治', year:'1368-1398', description:'朱元璋推行休养生息政策：奖励垦荒、推行屯田、兴修水利。严惩贪官诛杀数万人。废除丞相制度。', significance:'使饱经战乱的天下迅速恢复。废除丞相制度加强中央集权但也为宦官专权埋下隐患。', era:'明太祖', type:'政治', detail:'【背景】洪武之治发生在1368-1398，是明太祖时期的重要政治事件。\n\n【经过】朱元璋推行休养生息政策：奖励垦荒、推行屯田、兴修水利。严惩贪官诛杀数万人。废除丞相制度。\n\n【后果与影响】使饱经战乱的天下迅速恢复。废除丞相制度加强中央集权但也为宦官专权埋下隐患。' },
    { name:'靖难之役', year:'1399-1402', description:'建文帝削藩，燕王朱棣以"清君侧"为名起兵。历时四年攻入南京，建文帝失踪。朱棣即位为明成祖。', significance:'明朝最大规模的宗室内战。朱棣迁都北京设立内阁派遣郑和下西洋开创永乐盛世。', era:'朱棣·建文帝', type:'军事', detail:'【背景】靖难之役发生在1399-1402，是朱棣·建文帝主导的重大军事行动。\n\n【经过】建文帝削藩，燕王朱棣以"清君侧"为名起兵。历时四年攻入南京，建文帝失踪。朱棣即位为明成祖。\n\n【后果与影响】明朝最大规模的宗室内战。朱棣迁都北京设立内阁派遣郑和下西洋开创永乐盛世。' },
    { name:'郑和下西洋', year:'1405-1433', description:'太监郑和七次率庞大船队远航西洋，每次出动船只二百余艘人员二万七千余人。最远到达东非。', significance:'世界航海史上的壮举，比西方大航海时代早了近百年。后因财政负担过大而终止。', era:'郑和·明成祖', type:'外交', detail:'【背景】郑和下西洋发生在1405-1433，是郑和·明成祖时期的重要外交活动。\n\n【经过】太监郑和七次率庞大船队远航西洋，每次出动船只二百余艘人员二万七千余人。最远到达东非。\n\n【后果与影响】世界航海史上的壮举，比西方大航海时代早了近百年。后因财政负担过大而终止。' },
    { name:'迁都北京', year:'1421', description:'明成祖决定将都城从南京迁往北京，大规模营建紫禁城。1421年正式迁都。', significance:'加强北方边防形成"天子守国门"格局。北京自此成为中国政治中心长达六百年。', era:'明成祖', type:'政治', detail:'【背景】迁都北京发生在1421，是明成祖时期的重要政治事件。\n\n【经过】明成祖决定将都城从南京迁往北京，大规模营建紫禁城。1421年正式迁都。\n\n【后果与影响】加强北方边防形成"天子守国门"格局。北京自此成为中国政治中心长达六百年。' },
    { name:'土木堡之变', year:'1449', description:'明英宗在宦官王振怂恿下亲征瓦剌，在土木堡被包围。明军大溃英宗被俘。消息传来朝野震动。', significance:'明朝由盛转衰的重要转折点。皇帝被俘严重打击了明朝威信。', era:'明英宗·王振', type:'军事', detail:'【背景】土木堡之变发生在1449，是明英宗·王振主导的重大军事行动。\n\n【经过】明英宗在宦官王振怂恿下亲征瓦剌，在土木堡被包围。明军大溃英宗被俘。消息传来朝野震动。\n\n【后果与影响】明朝由盛转衰的重要转折点。皇帝被俘严重打击了明朝威信。' },
    { name:'《永乐大典》编纂', year:'1403-1408', description:'明成祖命解缙姚广孝等编纂大型类书《永乐大典》。全书二万二千八百七十七卷，约三亿七千万字，汇集古今图书七八千种。', significance:'世界历史上最大的百科全书，比大英百科全书早三百余年。正本失传副本在明清战乱中散佚殆尽，现存仅八百余卷，是中国文化史上最大的损失之一。', era:'解缙·姚广孝', type:'文化', detail:'【背景】《永乐大典》编纂发生在1403-1408，是解缙·姚广孝时期的重要文化事业。\n\n【经过】明成祖命解缙姚广孝等编纂大型类书《永乐大典》。全书二万二千八百七十七卷，约三亿七千万字，汇集古今图书七八千种。\n\n【后果与影响】世界历史上最大的百科全书，比大英百科全书早三百余年。正本失传副本在明清战乱中散佚殆尽，现存仅八百余卷，是中国文化史上最大的损失之一。' },
    { name:'夺门之变', year:'1457', description:'英宗被瓦剌放归后被景泰帝软禁。景泰帝病重时石亨徐有贞等发动政变迎立英宗复位。于谦冤死。', significance:'导致一代名臣于谦含冤而死。英宗复位后改变了景泰朝的政策。', era:'明英宗·徐有贞·于谦', type:'政治', detail:'【背景】夺门之变发生在1457，是明英宗·徐有贞·于谦时期的重要政治事件。\n\n【经过】英宗被瓦剌放归后被景泰帝软禁。景泰帝病重时石亨徐有贞等发动政变迎立英宗复位。于谦冤死。\n\n【后果与影响】导致一代名臣于谦含冤而死。英宗复位后改变了景泰朝的政策。' },
    { name:'倭寇之乱与戚继光抗倭', year:'1550-1565', description:'明朝东南沿海倭寇猖獗。戚继光组建戚家军发明鸳鸯阵等战术，基本平定倭患。', significance:'戚继光是民族英雄。抗倭斗争维护了东南沿海的和平稳定。', era:'戚继光', type:'军事', detail:'【背景】倭寇之乱与戚继光抗倭发生在1550-1565，是戚继光主导的重大军事行动。\n\n【经过】明朝东南沿海倭寇猖獗。戚继光组建戚家军发明鸳鸯阵等战术，基本平定倭患。\n\n【后果与影响】戚继光是民族英雄。抗倭斗争维护了东南沿海的和平稳定。' },
    { name:'张居正改革', year:'1573-1582', description:'张居正任首辅十年推行一条鞭法改革赋税制度。整顿吏治军事使明朝出现中兴气象。', significance:'一条鞭法是中国赋税制度史上的重要改革。为后世所沿用。', era:'张居正·万历帝', type:'改革', detail:'【背景】张居正改革推行于1573-1582，由张居正·万历帝主导实施。\n\n【经过】张居正任首辅十年推行一条鞭法改革赋税制度。整顿吏治军事使明朝出现中兴气象。\n\n【后果与影响】一条鞭法是中国赋税制度史上的重要改革。为后世所沿用。' },
    { name:'万历怠政', year:'1582-1620', description:'万历帝在位四十八年，自万历十四年起以病为由长期不上朝，中央官员大量缺额不补。', significance:'明朝政治腐败的标志性事件。史家评论"明之亡实亡于万历"。', era:'明神宗', type:'政治', detail:'【背景】万历怠政发生在1582-1620，是明神宗时期的重要政治事件。\n\n【经过】万历帝在位四十八年，自万历十四年起以病为由长期不上朝，中央官员大量缺额不补。\n\n【后果与影响】明朝政治腐败的标志性事件。史家评论"明之亡实亡于万历"。' },
    { name:'东林党争', year:'1604-1627', description:'东林书院顾宪成等议政形成东林党，与阉党魏忠贤等展开激烈党争。魏忠贤大肆迫害东林党人。', significance:'明朝晚期最激烈的党争。严重消耗了明朝的统治力量。为明朝灭亡埋下祸根。', era:'魏忠贤·东林党', type:'政治', detail:'【背景】东林党争发生在1604-1627，是魏忠贤·东林党时期的重要政治事件。\n\n【经过】东林书院顾宪成等议政形成东林党，与阉党魏忠贤等展开激烈党争。魏忠贤大肆迫害东林党人。\n\n【后果与影响】明朝晚期最激烈的党争。严重消耗了明朝的统治力量。为明朝灭亡埋下祸根。' },
    { name:'甲申之变', year:'1644', description:'李自成大顺军攻入北京，崇祯帝在煤山自缢身亡。随后吴三桂引清军入关，清朝定鼎中原。', significance:'明朝灭亡。天灾民变党争女真崛起等多重因素交织导致明朝覆亡。', era:'崇祯帝·李自成·吴三桂', type:'军事', detail:'【背景】甲申之变发生在1644，是崇祯帝·李自成·吴三桂主导的重大军事行动。\n\n【经过】李自成大顺军攻入北京，崇祯帝在煤山自缢身亡。随后吴三桂引清军入关，清朝定鼎中原。\n\n【后果与影响】明朝灭亡。天灾民变党争女真崛起等多重因素交织导致明朝覆亡。' },
    { name:'李时珍著《本草纲目》', year:'1552-1578', description:'医药学家李时珍历时二十七年编著《本草纲目》。收录药物一千八百九十二种，附方一万一千余首。', significance:'中国古代最伟大的医药学著作，被誉为东方医药巨典。', era:'李时珍', type:'科技', detail:'【背景】李时珍著《本草纲目》发生在1552-1578，是李时珍时期的重要科技成果。\n\n【经过】医药学家李时珍历时二十七年编著《本草纲目》。收录药物一千八百九十二种，附方一万一千余首。\n\n【后果与影响】中国古代最伟大的医药学著作，被誉为东方医药巨典。' },
    { name:'徐光启译《几何原本》', year:'1607', description:'明代科学家徐光启与意大利传教士利玛窦合作翻译《几何原本》前六卷，首次将西方几何学引入中国。', significance:'中西科学交流史上的里程碑。徐光启被誉为中国近代科学的先驱。', era:'徐光启·利玛窦', type:'科技', detail:'【背景】徐光启译《几何原本》发生在1607，是徐光启·利玛窦时期的重要科技成果。\n\n【经过】明代科学家徐光启与意大利传教士利玛窦合作翻译《几何原本》前六卷，首次将西方几何学引入中国。\n\n【后果与影响】中西科学交流史上的里程碑。徐光启被誉为中国近代科学的先驱。' },
  ],
  10: [  // 清
    { name:'清军入关', year:'1644', description:'清军在摄政王多尔衮率领下在吴三桂引导下通过山海关进入中原。击败李自成占领北京，顺治帝迁都北京。', significance:'标志着清朝正式成为统治全中国的中央王朝。此后用四十年逐步统一全国。', era:'多尔衮·吴三桂', type:'军事', detail:'【背景】清军入关发生在1644，是多尔衮·吴三桂主导的重大军事行动。\n\n【经过】清军在摄政王多尔衮率领下在吴三桂引导下通过山海关进入中原。击败李自成占领北京，顺治帝迁都北京。\n\n【后果与影响】标志着清朝正式成为统治全中国的中央王朝。此后用四十年逐步统一全国。' },
    { name:'平定三藩', year:'1673-1681', description:'康熙帝下令撤除吴三桂等三藩封地。吴三桂起兵反清三藩之乱爆发。康熙历时八年平定。', significance:'消除了清朝统一后的最大内部威胁。使中央集权极大加强，为康乾盛世奠定基础。', era:'康熙帝·吴三桂', type:'军事', detail:'【背景】平定三藩发生在1673-1681，是康熙帝·吴三桂主导的重大军事行动。\n\n【经过】康熙帝下令撤除吴三桂等三藩封地。吴三桂起兵反清三藩之乱爆发。康熙历时八年平定。\n\n【后果与影响】消除了清朝统一后的最大内部威胁。使中央集权极大加强，为康乾盛世奠定基础。' },
    { name:'雅克萨之战与尼布楚条约', year:'1685-1689', description:'康熙帝两次围攻侵占黑龙江的沙俄势力。清军取胜后双方签订尼布楚条约确定中俄东段边界。', significance:'清朝早期与西方列强的第一次军事冲突。以外交谈判解决边界问题。维持中俄边境百年和平。', era:'康熙帝', type:'外交', detail:'【背景】雅克萨之战与尼布楚条约发生在1685-1689，是康熙帝时期的重要外交活动。\n\n【经过】康熙帝两次围攻侵占黑龙江的沙俄势力。清军取胜后双方签订尼布楚条约确定中俄东段边界。\n\n【后果与影响】清朝早期与西方列强的第一次军事冲突。以外交谈判解决边界问题。维持中俄边境百年和平。' },
    { name:'康乾盛世', year:'1662-1795', description:'康熙雍正乾隆三代皇帝统治时期，清朝达到鼎盛。疆域极盛人口增长经济文化繁荣。', significance:'中国历史上时间最长影响最大的盛世之一。奠定了现代中国版图的基础。', era:'康熙帝·雍正帝·乾隆帝', type:'政治', detail:'【背景】康乾盛世发生在1662-1795，是康熙帝·雍正帝·乾隆帝时期的重要政治事件。\n\n【经过】康熙雍正乾隆三代皇帝统治时期，清朝达到鼎盛。疆域极盛人口增长经济文化繁荣。\n\n【后果与影响】中国历史上时间最长影响最大的盛世之一。奠定了现代中国版图的基础。' },
    { name:'军机处设立', year:'1729', description:'雍正帝设立军机处，最初为处理西北军务的临时机构，后成为清朝核心决策机构。', significance:'清朝君主专制达到顶峰。内阁权力被架空，皇帝通过军机处直接指挥各部院运行近两百年。', era:'雍正帝', type:'政治', detail:'【背景】军机处设立发生在1729，是雍正帝时期的重要政治事件。\n\n【经过】雍正帝设立军机处，最初为处理西北军务的临时机构，后成为清朝核心决策机构。\n\n【后果与影响】清朝君主专制达到顶峰。内阁权力被架空，皇帝通过军机处直接指挥各部院运行近两百年。' },
    { name:'鸦片战争', year:'1840-1842', description:'英国为保护鸦片贸易发动对华侵略。清军节节败退。清政府被迫签订南京条约。', significance:'中国近代史的开端。中国从此由独立自主的封建国家逐步沦为半殖民地半封建社会。', era:'道光帝·林则徐', type:'军事', detail:'【背景】鸦片战争发生在1840-1842，是道光帝·林则徐主导的重大军事行动。\n\n【经过】英国为保护鸦片贸易发动对华侵略。清军节节败退。清政府被迫签订南京条约。\n\n【后果与影响】中国近代史的开端。中国从此由独立自主的封建国家逐步沦为半殖民地半封建社会。' },
    { name:'太平天国运动', year:'1851-1864', description:'洪秀全在广西金田起义建立太平天国。太平军席卷大半个中国。被曾国藩湘军镇压。', significance:'中国历史上规模最大的农民起义之一。严重动摇清朝统治根基，催生地方武装。', era:'洪秀全·曾国藩', type:'军事', detail:'【背景】太平天国运动发生在1851-1864，是洪秀全·曾国藩主导的重大军事行动。\n\n【经过】洪秀全在广西金田起义建立太平天国。太平军席卷大半个中国。被曾国藩湘军镇压。\n\n【后果与影响】中国历史上规模最大的农民起义之一。严重动摇清朝统治根基，催生地方武装。' },
    { name:'洋务运动', year:'1861-1894', description:'奕䜣曾国藩李鸿章左宗棠等推行洋务运动，创办江南制造局福州船政局等近代工业。建立北洋水师。', significance:'中国近代化的开端。但受限于"中学为体西学为用"的指导思想，甲午战争宣告运动失败。', era:'李鸿章·奕䜣', type:'改革', detail:'【背景】洋务运动推行于1861-1894，由李鸿章·奕䜣主导实施。\n\n【经过】奕䜣曾国藩李鸿章左宗棠等推行洋务运动，创办江南制造局福州船政局等近代工业。建立北洋水师。\n\n【后果与影响】中国近代化的开端。但受限于"中学为体西学为用"的指导思想，甲午战争宣告运动失败。' },
    { name:'戊戌变法', year:'1898', description:'光绪帝在康有为梁启超推动下颁布变法诏令。慈禧太后发动政变囚禁光绪帝废除新政。变法仅百余天。', significance:'近代中国第一次资产阶级改良运动。虽失败但推动思想启蒙，促进了民族觉醒。', era:'光绪帝·康有为·慈禧', type:'改革', detail:'【背景】戊戌变法推行于1898，由光绪帝·康有为·慈禧主导实施。\n\n【经过】光绪帝在康有为梁启超推动下颁布变法诏令。慈禧太后发动政变囚禁光绪帝废除新政。变法仅百余天。\n\n【后果与影响】近代中国第一次资产阶级改良运动。虽失败但推动思想启蒙，促进了民族觉醒。' },
    { name:'义和团运动与八国联军', year:'1900-1901', description:'义和团扶清灭洋，慈禧借刀杀人向十一国宣战。八国联军攻入北京签订辛丑条约。赔款四亿五千万两。', significance:'清朝彻底沦为洋人朝廷。庚子赔款使中国背负沉重经济负担。加速了清朝的灭亡。', era:'慈禧太后', type:'军事', detail:'【背景】义和团运动与八国联军发生在1900-1901，是慈禧太后主导的重大军事行动。\n\n【经过】义和团扶清灭洋，慈禧借刀杀人向十一国宣战。八国联军攻入北京签订辛丑条约。赔款四亿五千万两。\n\n【后果与影响】清朝彻底沦为洋人朝廷。庚子赔款使中国背负沉重经济负担。加速了清朝的灭亡。' },
    { name:'辛亥革命', year:'1911', description:'武昌起义爆发，各省纷纷响应宣布独立。清朝统治土崩瓦解。孙中山被推举为临时大总统。', significance:'结束了两千多年的封建帝制。中华民国成立，中国进入新的历史时期。', era:'孙中山·袁世凯', type:'政治', detail:'【背景】辛亥革命发生在1911，是孙中山·袁世凯时期的重要政治事件。\n\n【经过】武昌起义爆发，各省纷纷响应宣布独立。清朝统治土崩瓦解。孙中山被推举为临时大总统。\n\n【后果与影响】结束了两千多年的封建帝制。中华民国成立，中国进入新的历史时期。' },
    { name:'《四库全书》编纂', year:'1773-1782', description:'乾隆帝命纪昀等编纂《四库全书》，收书三千四百余种近八万卷，分经史子集四部。', significance:'中国古代文化集大成之作。保存了大量珍贵典籍，但也销毁了大量有碍清朝统治的书籍。', era:'纪晓岚·乾隆帝', type:'文化', detail:'【背景】《四库全书》编纂发生在1773-1782，是纪晓岚·乾隆帝时期的重要文化事业。\n\n【经过】乾隆帝命纪昀等编纂《四库全书》，收书三千四百余种近八万卷，分经史子集四部。\n\n【后果与影响】中国古代文化集大成之作。保存了大量珍贵典籍，但也销毁了大量有碍清朝统治的书籍。' },
    { name:'同盟会成立与三民主义', year:'1905', description:'孙中山在日本东京成立中国同盟会，提出驱除鞑虏恢复中华建立民国的革命纲领，后发展为三民主义。', significance:'中国近代第一个全国性革命政党。标志着中国民主革命进入新阶段。', era:'孙中山·黄兴·宋教仁', type:'政治', detail:'【背景】同盟会成立与三民主义发生在1905，是孙中山·黄兴·宋教仁时期的重要政治事件。\n\n【经过】孙中山在日本东京成立中国同盟会，提出驱除鞑虏恢复中华建立民国的革命纲领，后发展为三民主义。\n\n【后果与影响】中国近代第一个全国性革命政党。标志着中国民主革命进入新阶段。' },
  ],
  11: [  // 三国
    { name:'官渡之战', year:'200', description:'曹操与袁绍在官渡决战。曹操以少胜多，以两万兵力击败袁绍十万大军。袁绍败逃，两年后病逝。曹操基本统一北方。', significance:'中国历史上著名的以少胜多战役。奠定了曹操统一北方的基础，袁绍势力彻底瓦解。', era:'曹操·袁绍', type:'军事', detail:'【背景】官渡之战发生在200，是曹操·袁绍主导的重大军事行动。\n\n【经过】曹操与袁绍在官渡决战。曹操以少胜多，以两万兵力击败袁绍十万大军。袁绍败逃，两年后病逝。曹操基本统一北方。\n\n【后果与影响】中国历史上著名的以少胜多战役。奠定了曹操统一北方的基础，袁绍势力彻底瓦解。' },
    { name:'赤壁之战', year:'208', description:'曹操率大军南征，孙权刘备联合抗曹。周瑜用火攻大败曹军于赤壁。曹操败退北方，三国鼎立局面初步形成。', significance:'决定了三分天下的格局。孙刘联盟的胜利保住了江南和荆益，赤壁之战是三国鼎立的直接推手。', era:'周瑜·曹操·诸葛亮', type:'军事', detail:'【背景】赤壁之战发生在208，是周瑜·曹操·诸葛亮主导的重大军事行动。\n\n【经过】曹操率大军南征，孙权刘备联合抗曹。周瑜用火攻大败曹军于赤壁。曹操败退北方，三国鼎立局面初步形成。\n\n【后果与影响】决定了三分天下的格局。孙刘联盟的胜利保住了江南和荆益，赤壁之战是三国鼎立的直接推手。' },
    { name:'曹丕篡汉', year:'220', description:'曹操病逝后，其子曹丕逼迫汉献帝刘协禅让，正式建立曹魏政权。东汉灭亡。汉献帝被封为山阳公。', significance:'西汉延续四百余年的刘汉皇朝正式终结。曹魏继承北方正统，三国时代正式开始。', era:'曹丕·汉献帝', type:'政治', detail:'【背景】曹丕篡汉发生在220，是曹丕·汉献帝时期的重要政治事件。\n\n【经过】曹操病逝后，其子曹丕逼迫汉献帝刘协禅让，正式建立曹魏政权。东汉灭亡。汉献帝被封为山阳公。\n\n【后果与影响】西汉延续四百余年的刘汉皇朝正式终结。曹魏继承北方正统，三国时代正式开始。' },
    { name:'刘备称帝', year:'221', description:'曹丕篡汉后，刘备在成都称帝，国号汉（史称蜀汉），继承汉统。以诸葛亮为丞相。', significance:'蜀汉政权的正式建立。刘备以汉室宗亲自居延续汉统，三国鼎立格局最终形成。', era:'刘备·诸葛亮', type:'政治', detail:'【背景】刘备称帝发生在221，是刘备·诸葛亮时期的重要政治事件。\n\n【经过】曹丕篡汉后，刘备在成都称帝，国号汉（史称蜀汉），继承汉统。以诸葛亮为丞相。\n\n【后果与影响】蜀汉政权的正式建立。刘备以汉室宗亲自居延续汉统，三国鼎立格局最终形成。' },
    { name:'夷陵之战', year:'221-222', description:'刘备为关羽报仇，率军伐吴。陆逊在夷陵用火攻大败蜀军。刘备退守白帝城，次年病逝。', significance:'蜀汉由盛转衰的转折点。此战使蜀汉精锐尽失，诸葛亮此后只能以攻为守。陆逊一战成名。', era:'陆逊·刘备', type:'军事', detail:'【背景】夷陵之战发生在221-222，是陆逊·刘备主导的重大军事行动。\n\n【经过】刘备为关羽报仇，率军伐吴。陆逊在夷陵用火攻大败蜀军。刘备退守白帝城，次年病逝。\n\n【后果与影响】蜀汉由盛转衰的转折点。此战使蜀汉精锐尽失，诸葛亮此后只能以攻为守。陆逊一战成名。' },
    { name:'七擒孟获', year:'225', description:'诸葛亮为稳定后方，亲率大军南征。对南中酋长孟获七擒七纵，使其心服口服，永不再反。', significance:'展现了诸葛亮以德服人的政治智慧。南中的平定使蜀汉能够专心北伐。', era:'诸葛亮·孟获', type:'军事', detail:'【背景】七擒孟获发生在225，是诸葛亮·孟获主导的重大军事行动。\n\n【经过】诸葛亮为稳定后方，亲率大军南征。对南中酋长孟获七擒七纵，使其心服口服，永不再反。\n\n【后果与影响】展现了诸葛亮以德服人的政治智慧。南中的平定使蜀汉能够专心北伐。' },
    { name:'诸葛亮北伐（六出祁山）', year:'228-234', description:'诸葛亮五次（演义称六次）从汉中出兵北伐曹魏。最接近成功的一次因马谡失街亭而功亏一篑。最终病逝五丈原。', significance:'以攻为守的经典战略。诸葛亮鞠躬尽瘁死而后已的精神成为后世楷模。北伐虽未成功但牵制了曹魏大量兵力。', era:'诸葛亮·司马懿', type:'军事', detail:'【背景】诸葛亮北伐（六出祁山）发生在228-234，是诸葛亮·司马懿主导的重大军事行动。\n\n【经过】诸葛亮五次（演义称六次）从汉中出兵北伐曹魏。最接近成功的一次因马谡失街亭而功亏一篑。最终病逝五丈原。\n\n【后果与影响】以攻为守的经典战略。诸葛亮鞠躬尽瘁死而后已的精神成为后世楷模。北伐虽未成功但牵制了曹魏大量兵力。' },
    { name:'高平陵之变', year:'249', description:'曹魏权臣司马懿趁大将军曹爽陪同少帝曹芳去高平陵祭扫时发动政变，控制洛阳。曹爽投降后被灭族。', significance:'司马氏从此掌握曹魏大权。标志着曹魏皇权名存实亡，为司马炎代魏建晋铺平道路。', era:'司马懿·曹爽', type:'政治', detail:'【背景】高平陵之变发生在249，是司马懿·曹爽时期的重要政治事件。\n\n【经过】曹魏权臣司马懿趁大将军曹爽陪同少帝曹芳去高平陵祭扫时发动政变，控制洛阳。曹爽投降后被灭族。\n\n【后果与影响】司马氏从此掌握曹魏大权。标志着曹魏皇权名存实亡，为司马炎代魏建晋铺平道路。' },
    { name:'邓艾灭蜀', year:'263', description:'司马昭派钟会、邓艾两路伐蜀。邓艾率军从阴平小道偷渡，直逼成都。刘禅出降，蜀汉灭亡。', significance:'三国鼎立格局被打破。蜀汉历经二帝四十三年而亡。"此间乐不思蜀"成为刘禅的典故。', era:'邓艾·刘禅', type:'军事', detail:'【背景】邓艾灭蜀发生在263，是邓艾·刘禅主导的重大军事行动。\n\n【经过】司马昭派钟会、邓艾两路伐蜀。邓艾率军从阴平小道偷渡，直逼成都。刘禅出降，蜀汉灭亡。\n\n【后果与影响】三国鼎立格局被打破。蜀汉历经二帝四十三年而亡。"此间乐不思蜀"成为刘禅的典故。' },
    { name:'西晋灭吴', year:'280', description:'晋武帝司马炎派六路大军伐吴。吴主孙皓投降，东吴灭亡。三国归晋，全国重新统一。', significance:'结束了自东汉末年以来近百年的分裂局面。三国时代正式结束，西晋统一全国。', era:'司马炎·孙皓', type:'军事', detail:'【背景】西晋灭吴发生在280，是司马炎·孙皓主导的重大军事行动。\n\n【经过】晋武帝司马炎派六路大军伐吴。吴主孙皓投降，东吴灭亡。三国归晋，全国重新统一。\n\n【后果与影响】结束了自东汉末年以来近百年的分裂局面。三国时代正式结束，西晋统一全国。' },
  ],
};

const detail = ref<DynastyDetail | null>(null)
function sortYear(year: string): number {
  const s = year.replace(/^约/, '')
  const m = s.match(/(前?\d+)/)
  if (!m) return 0
  const y = m[1]
  return y.startsWith('前') ? -parseInt(y.slice(1), 10) : parseInt(y, 10)
}



// Editing state
const editingKey = ref<string | null>(null)
const editContent = ref('')
const saving = ref(false)
const eventEdit = ref<{open: boolean; idx: number | null; item: any}>({ open: false, idx: null, item: {} })
const localEvents = ref<any[] | null>(null)
const eventDetail = ref<any>(null)
const figureDetail = ref<any>(null)
const memberEditing = ref(false)
const memberSaving = ref(false)
const memberFormOpen = ref(false)
const memberForm = ref({ name: '', title: '', lifespan: '', role: '名臣', description: '' })
const memberFormIdx = ref<number | null>(null)
let localMembers = ref<any[] | null>(null)
let _figCache: Record<number, any[]> = {}

function getCachedHistoricalFigures(dynastyId: number): any[] {
  if (!_figCache[dynastyId]) { _figCache[dynastyId] = getHistoricalFigures(dynastyId) }
  return _figCache[dynastyId] || []
}

function mergeMembers(list: any[]): any[] {
  const seen = new Set<string>()
  return list.filter((m: any) => { if (seen.has(m.name)) return false; seen.add(m.name); return true })
    .map((m: any, i: number) => ({ ...m, id: -(i + 1) }))
}

function getRoleColor(role: string): string {
  const c: Record<string, string> = {'皇帝':'#8b1a1a','皇后':'#c0392b','太后':'#c0392b','皇子':'#5a4a3a','公主':'#8b6914','宰相':'#2c3e50','名臣':'#2c3e50','诗人':'#8b6914','文学家':'#8b6914','史学家':'#4a6741','科学家':'#4a6741','大将':'#1a3a2a','改革家':'#c0392b','谋士':'#2d2d2d','宦官':'#5a4a3a','外交家':'#2c3e50','僧侣':'#1a3a2a','艺术家':'#5a4a7a','名士':'#8b6914'}
  return c[role] || '#888'
}

function startEdit(key: string, val: string) { editingKey.value = key; editContent.value = val || '' }
function cancelEdit() { editingKey.value = null; editContent.value = ''; eventEdit.value = { open: false, idx: null, item: {} } }

async function saveEdit(key: string) {
  if (!detail.value) return; saving.value = true
  try {
    const ns = { ...sections.value, [key]: editContent.value }
    await updateDynastySections(detail.value.id, ns)
    detail.value.description = JSON.stringify(ns)
    editingKey.value = null; editContent.value = ''
  } catch (e: any) { alert('保存失败') } finally { saving.value = false }
}

function startEventEdit(idx: number | null, item: any) { eventEdit.value = { open: true, idx, item: { ...item } } }
function addEvent() { startEventEdit(null, { name: '', year: '', description: '', detail: '', significance: '', era: '', type: '政治' }) }
function deleteEvent(idx: number) { if (localEvents.value) localEvents.value.splice(idx, 1) }
function saveEventItem() {
  if (!localEvents.value) return; const item = { ...eventEdit.value.item }
  if (eventEdit.value.idx === null) localEvents.value.push(item); else localEvents.value[eventEdit.value.idx] = item
  eventEdit.value = { open: false, idx: null, item: {} }
}

async function saveEvents() {
  if (!detail.value || !localEvents.value) return; saving.value = true
  try {
    const ns = { ...sections.value, events: localEvents.value }
    await updateDynastySections(detail.value.id, ns)
    detail.value.description = JSON.stringify(ns); editingKey.value = null
  } catch (e: any) { alert('保存失败') } finally { saving.value = false }
}

function openEventDetail(ev: any) { eventDetail.value = ev }
function openFigureDetail(m: any) { figureDetail.value = m }

function startMemberEdit() {
  const sec = detail.value?.description ? JSON.parse(detail.value.description) : {}
  const stored = sec.storedMembers || []; const localFigs = getCachedHistoricalFigures(detail.value!.id)
  localMembers.value = mergeMembers([...stored, ...localFigs]); memberEditing.value = true
}
function cancelMemberEdit() { memberEditing.value = false; memberFormOpen.value = false }
function addMember() { memberForm.value = { name: '', title: '', lifespan: '', role: '名臣', description: '' }; memberFormIdx.value = null; memberFormOpen.value = true }
function startMemberForm(idx: number, m: any) { memberForm.value = { ...m }; memberFormIdx.value = idx; memberFormOpen.value = true }
function saveMemberItem() {
  if (!localMembers.value) return
  const item = { ...memberForm.value }
  if (memberFormIdx.value === null) localMembers.value.push(item); else localMembers.value[memberFormIdx.value] = item
  memberFormOpen.value = false
}
function deleteMember(idx: number) { if (localMembers.value) localMembers.value.splice(idx, 1) }

async function saveMembers() {
  if (!detail.value || !localMembers.value) return; memberSaving.value = true
  try {
    const sec = detail.value.description ? JSON.parse(detail.value.description) : {}
    sec.storedMembers = localMembers.value || []
    await updateDynastySections(detail.value.id, sec)
    detail.value.description = JSON.stringify(sec)
    detail.value.members = mergeMembers(localMembers.value || []); memberEditing.value = false
  } catch (e: any) { alert('保存失败') } finally { memberSaving.value = false }
}

const dynastyEvents = computed(() => {
  const events = localEvents.value || (detail.value ? DYNASTY_EVENTS[detail.value.id] || [] : [])
  return [...events].sort((a, b) => sortYear(a.year) - sortYear(b.year))
})
const loading = ref(true)
const error = ref('')
const activeSection = ref('profile')
let scrollCleanup: (() => void) | null = null

const sections = computed<DynastySections>(() => {
  try {
    return detail.value?.description ? JSON.parse(detail.value.description) : {} as DynastySections
  } catch { return {} as DynastySections }
})

// Init edit data
watch(() => detail.value, (val) => {
  if (!val) return
  const sec = val.description ? JSON.parse(val.description) : {}
  if (!localEvents.value) localEvents.value = sec.events || DYNASTY_EVENTS[val.id] || []
})

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    detail.value = await getDynastyDetail(id)
    // 合并本地历史人物数据（非帝王）
    const localFigures = getHistoricalFigures(id)
    if (localFigures.length > 0) {
      detail.value.members = [...(detail.value.members || []), ...localFigures.map((f, i) => ({ ...f, id: -(i + 1) }))]
    }
    loading.value = false
  } catch (e) {
    error.value = '加载失败，请稍后重试'
    loading.value = false
    return
  }
  const handleScroll = () => {
    const ids = ['profile', 'origins', 'founding', 'zenith', 'members', 'tree', 'decline', 'rulers', 'children', 'events']
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= 120) {
        activeSection.value = id
      }
    }
  }
  window.addEventListener('scroll', handleScroll)
  scrollCleanup = () => window.removeEventListener('scroll', handleScroll)
})

onUnmounted(() => { scrollCleanup?.() })

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function parseDetail(text: string): {heading: string; content: string}[] {
  if (!text) return []
  const parts = text.split(/\n\n(?=\u3010)/)
  return parts.map(p => {
    const m = p.match(/^【(.+?)】\s*([\s\S]*)/)
    if (m) return { heading: m[1], content: m[2].trim() }
    return { heading: '', content: p.trim() }
  })
}

function typeColor(type: string): string {
  const map: Record<string, string> = {
    '军事': '#C66B3D',
    '政治': '#606C38',
    '外交': '#8B9D83',
    '文化': '#B08B6E',
    '经济': '#C08E3A',
    '改革': '#4A6741',
    '工程': '#B8860B',
    '科技': '#5C4A3A',
  };
  return map[type] || '#888';
}
function splitParagraphs(text: string): string[] {
  if (!text) return []
  return text.split(/(?<=[。！？])/).filter(p => p.trim().length > 0)
}
</script>

<style scoped>
.nav-inner { display: flex; align-items: center; gap: 8px; width: 100%; max-width: 1400px; margin: 0 auto; }
.nav-home { font-family: var(--font-serif); font-weight: 700; font-size: 1.05rem; white-space: nowrap; }
.nav-adjacent { display: flex; gap: 4px; flex-wrap: wrap; }
.nav-adjacent .btn {
  padding: 5px 12px; font-size: 0.78rem;
  background: var(--color-card); border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); color: var(--color-text); cursor: pointer;
  transition: all 0.3s ease;
}
.nav-adjacent .btn:hover { background: var(--color-oat); color: var(--color-terracotta); border-color: var(--color-terracotta); }
@media (max-width: 768px) { .nav-adjacent { display: none; } }

/* Dynasty events cards */
.dynasty-events {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin: 20px 0;
}
.de-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
}
.de-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
.de-hd {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  padding: 18px 20px 10px;
  border-bottom: 1px solid #f0ebe6;
}
.de-name { font-weight: 700; font-size: 0.92rem; color: var(--color-earth); }
.de-year { font-size: 0.78rem; color: var(--color-terracotta); font-weight: 600; }
.de-era { font-size: 0.72rem; color: var(--color-text-muted); background: var(--color-oat); padding: 2px 10px; border-radius: 4px; margin-left: auto; }
.de-type { font-size: 0.68rem; color: #fff; padding: 2px 10px; border-radius: 12px; font-weight: 600; letter-spacing: 0.3px; }
.de-desc { font-size: 0.82rem; line-height: 1.7; color: var(--color-text-light); padding: 14px 20px 10px; margin: 0; text-align: justify; }
.de-sig {
  font-size: 0.78rem; line-height: 1.55; color: var(--color-text-light);
  padding: 10px 20px 16px; border-left: 3px solid var(--color-terracotta);
  margin: 0 16px 16px; background: rgba(232, 220, 199, 0.25); border-radius: var(--radius-sm);
}
@media (max-width: 640px) { .dynasty-events { grid-template-columns: 1fr; } }

/* Content section */
.content-section { margin-bottom: 48px; }
.content-section h2 {
  position: relative;
  padding-bottom: 12px;
  margin-bottom: 24px;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-earth);
  letter-spacing: 0.5px;
}
.content-section h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 48px;
  height: 4px;
  background: var(--color-terracotta);
  border-radius: 2px;
  transition: width 0.4s ease;
}
.content-section h2:hover::after { width: 76px; }
.text-section {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 24px 28px;
  margin: 16px 0;
  box-shadow: var(--shadow);
}
.text-section p {
  font-size: 0.95rem;
  line-height: 1.9;
  color: var(--color-text-light);
  text-align: justify;
  margin-bottom: 14px;
}
.text-section p:last-child { margin-bottom: 0; }


.edit-btn { display: inline-block; margin-left: 10px; padding: 2px 10px; font-size: 0.72rem; background: var(--color-card); border: 1px solid var(--color-border); border-radius: 4px; color: var(--color-text-muted); cursor: pointer; transition: all 0.2s ease; vertical-align: middle; line-height: 1.6; }
.edit-btn:hover { background: var(--color-oat); color: var(--color-terracotta); border-color: var(--color-terracotta); }
.edit-editor { margin: 12px 0; }
.edit-textarea { width: 100%; min-height: 120px; padding: 12px 14px; font-size: 0.9rem; line-height: 1.7; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-card); color: var(--color-text); resize: vertical; font-family: inherit; transition: border-color 0.2s ease; }
.edit-textarea:focus { outline: none; border-color: var(--color-terracotta); }
.edit-actions { display: flex; gap: 8px; margin-top: 10px; }
.save-btn { padding: 8px 20px; font-size: 0.85rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; background: var(--color-terracotta); color: #fff; transition: all 0.2s ease; }
.save-btn:hover { background: #B05A30; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cancel-btn { padding: 8px 20px; font-size: 0.85rem; border-radius: 6px; border: 1px solid var(--color-border); cursor: pointer; font-weight: 600; background: var(--color-card); color: var(--color-text); transition: all 0.2s ease; }
.cancel-btn:hover { background: var(--color-border); }
.edit-event-panel { background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 20px; margin: 12px 0; }
.edit-event-toolbar { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.add-event-btn { padding: 8px 16px; font-size: 0.85rem; border-radius: 6px; background: var(--color-sage); color: #fff; border: none; cursor: pointer; font-weight: 600; transition: all 0.2s ease; margin-right: auto; }
.add-event-btn:hover { background: var(--color-moss); }
.event-form { background: rgba(232, 220, 199, 0.3); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 16px; border: 1px solid var(--color-border); }
.ef-row { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
.ef-row label { width: 80px; flex-shrink: 0; font-size: 0.82rem; color: var(--color-text-light); padding-top: 8px; font-weight: 600; }
.ef-input, .ef-textarea { flex: 1; padding: 8px 12px; font-size: 0.85rem; border: 1px solid var(--color-border); border-radius: 4px; background: #fff; color: var(--color-text); font-family: inherit; }
.ef-input:focus, .ef-textarea:focus { outline: none; border-color: var(--color-terracotta); }
.ef-textarea { resize: vertical; min-height: 60px; }
.edit-event-list { display: flex; flex-direction: column; gap: 6px; }
.event-list-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--color-card); border: 1px solid var(--color-border); border-radius: 6px; transition: background 0.2s ease; }
.event-list-item:hover { background: var(--color-card-hover); }
.eli-info { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eli-info strong { font-size: 0.9rem; color: var(--color-earth); }
.eli-year { font-size: 0.78rem; color: var(--color-terracotta); font-weight: 600; }
.eli-type { font-size: 0.65rem; color: #fff; padding: 1px 8px; border-radius: 8px; font-weight: 600; }
.eli-actions { display: flex; gap: 4px; }
.eli-btn { padding: 3px 10px; font-size: 0.72rem; border-radius: 4px; border: 1px solid var(--color-border); cursor: pointer; }
.eli-btn.edit { background: var(--color-card); color: var(--color-text); }
.eli-btn.edit:hover { border-color: var(--color-terracotta); color: var(--color-terracotta); }
.eli-btn.del { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
.eli-btn.del:hover { background: #fee2e2; }
.mli-title { font-size: 0.72rem; color: var(--color-text-muted); margin: 0 4px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(4px); }
.modal-content { background: var(--color-card); border-radius: var(--radius); max-width: 640px; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative; }
.modal-close { position: absolute; top: 12px; right: 16px; font-size: 1.8rem; background: none; border: none; cursor: pointer; color: var(--color-text-muted); line-height: 1; }
.modal-close:hover { color: var(--color-terracotta); }
.modal-header { padding: 28px 28px 12px; border-bottom: 1px solid var(--color-border); }
.modal-header h3 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-earth); margin-bottom: 8px; }
.modal-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.modal-year { font-size: 0.82rem; color: var(--color-terracotta); font-weight: 600; }
.modal-era { font-size: 0.75rem; color: var(--color-text-muted); background: var(--color-oat); padding: 2px 10px; border-radius: 4px; }
.modal-type { font-size: 0.68rem; color: #fff; padding: 2px 10px; border-radius: 10px; font-weight: 600; }
.modal-body { padding: 20px 28px 28px; }
.modal-section h4 { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--color-earth); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid var(--color-terracotta); display: inline-block; }
.modal-text { font-size: 0.92rem; line-height: 1.85; color: var(--color-text-light); text-align: justify; }
.modal-impact { border-left: 3px solid var(--color-terracotta); padding: 12px 16px; background: rgba(232, 220, 199, 0.2); border-radius: var(--radius-sm); }

@media (max-width: 768px) { .ef-row { flex-direction: column; } .ef-row label { width: auto; } .event-list-item { flex-direction: column; align-items: flex-start; gap: 6px; } .event-list-item .eli-actions { align-self: flex-end; } }

</style>
