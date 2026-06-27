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
          <li><a href="#decline" :class="{ active: activeSection === 'decline' }">衰落与终结</a></li>
          <li><a href="#rulers" :class="{ active: activeSection === 'rulers' }">历任君主表</a></li>
          <li><a href="#children" :class="{ active: activeSection === 'children' }">皇帝子嗣</a></li>
          <li><a href="#events" :class="{ active: activeSection === 'events' }">著名事件</a></li>
          <li><a href="#tree" :class="{ active: activeSection === 'tree' }">家族关系谱</a></li>
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

<section class="content-section" id="tree">
          <h2>
            家族关系谱
            <button class="collapse-btn" @click="treeCollapsed = !treeCollapsed">{{ treeCollapsed ? '展开' : '折叠' }}</button>
          </h2>
          <div v-if="!treeCollapsed">
            <FamilyTree :rulers="detail.rulers" />
          </div>
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
    { name:'秦灭六国', year:'前230-前221', description:'秦王嬴政先后灭韩、赵、魏、楚、燕、齐六国，结束了长达五百余年的诸侯割据局面，建立了中国历史上第一个大一统中央集权王朝。', significance:'结束了春秋战国长期分裂的局面，开创了中国两千多年的帝制时代。"皇帝"称号自此成为最高统治者的称谓。', era:'秦始皇', type:'军事', detail:'【背景】秦国经过商鞅变法后国力蒸蒸日上。秦王嬴政采纳李斯远交近攻策略，重用王翦、王贲、蒙恬等名将，开始统一大业。\n\n【经过】前230年内史腾灭韩，前229年王翦利用反间计使赵王杀李牧后攻破邯郸灭赵。前225年王贲引黄河水灌大梁灭魏。同年王翦率六十万大军以逸待劳大破楚军灭楚。前222年王贲攻辽东灭燕。前221年王贲南下灭齐。十年间六国全部被灭。\n\n【后果与影响】秦始皇建立了中国历史上第一个大一统中央集权王朝，推行郡县制、统一文字货币度量衡，修筑驰道和长城，奠定了此后两千年中国大一统格局的制度基础。' },
    { name:'焚书坑儒', year:'前213-前212', description:'秦始皇采纳李斯建议，焚烧除秦记、医药、卜筮、种树以外的书籍。次年将四百六十余名方士儒生坑杀于咸阳。', significance:'严重摧毁了先秦诸子百家的文化遗产，是中国历史上第一次大规模的文化专制事件。', era:'秦始皇·李斯', type:'政治', detail:'【背景】前213年博士淳于越建议恢复分封制，李斯强烈反对，认为儒生以古非今惑乱百姓动摇中央集权。\n\n【经过】李斯上书建议除秦记医药卜筮种树等实用书外，民间诗书百家语一律焚毁，有敢谈论者处死，以古非今者灭族。前212年方士侯生卢生批评秦始皇并逃亡，秦始皇大怒，追查咸阳诸生，四百六十余人被坑杀。\n\n【后果与影响】先秦大量珍贵典籍被焚毁，诸子百家思想传承遭受毁灭性打击。法家思想成为唯一官方意识形态，文化专制主义由此确立，成为秦朝速亡的重要原因。' },
    { name:'修筑长城', year:'前214', description:'秦始皇下令将战国秦赵燕三国北部长城连接修缮，西起临洮东至辽东，绵延万余里。动用数百万民夫。', significance:'长城成为中华民族的象征，但在当时因工程浩大导致无数百姓家破人亡，成为秦朝暴政的典型代表。', era:'秦始皇·蒙恬', type:'军事', detail:'【背景】匈奴时常南下侵扰秦朝北部边境。\n\n【经过】前215年蒙恬率三十万大军北击匈奴收复河套。前214年下令将秦赵燕三国的北部长城连接修缮扩建，西起临洮东至辽东，绵延万余里。动用数百万民夫刑徒，工期持续数年，死者无数。\n\n【后果与影响】长城有效遏制了北方游牧民族南侵，成为中华民族重要象征。但修建长城耗费巨大人力物力，数十万民夫死于苦役，民间怨声载道，加剧了秦末社会危机。' },
    { name:'大泽乡起义', year:'前209', description:'陈胜吴广在安徽大泽乡率九百戍卒起义，提出"王侯将相宁有种乎"，揭开了秦末农民大起义的序幕，各地纷纷响应。', significance:'中国历史上第一次大规模平民起义，沉重打击了秦朝统治，最终导致秦朝灭亡。也为后世农民起义提供了精神号召。', era:'陈胜·吴广', type:'军事', detail:'【背景】秦二世即位后继续推行暴政。前209年九百戍卒前往渔阳，行至大泽乡遭遇暴雨无法按时抵达，按秦法误期当斩。\n\n【经过】陈胜吴广杀死押送尉官率九百戍卒起义，喊出王侯将相宁有种乎的口号。起义军迅速发展到数万人，建立张楚政权，陈胜自立为王，各地纷纷响应。\n\n【后果与影响】大泽乡起义揭开了秦末农民大起义序幕，沉重打击了秦朝统治基础，最终导致秦朝灭亡。王侯将相宁有种乎成为后世反抗压迫的精神旗帜。' },
    { name:'巨鹿之战', year:'前207', description:'项羽率楚军与秦军主力在巨鹿决战。项羽破釜沉舟，以少胜多大败秦军。此战后秦军主力尽失，名存实亡。', significance:'巨鹿之战决定了秦朝灭亡的命运。项羽一战成名，成为反秦联军领袖。同时秦将章邯投降，王离被俘。', era:'项羽·章邯', type:'军事', detail:'【背景】项梁战死后项羽与刘邦成为反秦主力。秦将章邯将赵王包围在巨鹿城中。\n\n【经过】前207年项羽斩杀宋义夺取兵权，率军渡漳水破釜沉舟，只带三日粮食以示决死之心。楚军与秦军九战九胜大破秦军。章邯率二十万秦军投降，项羽担心降兵哗变将其全部坑杀。\n\n【后果与影响】巨鹿之战歼灭了秦军主力，秦朝从此名存实亡。项羽成为反秦联军领袖，此战也埋下了项羽与刘邦日后决裂的伏笔。' },
    { name:'秦统一度量衡与文字', year:'前221', description:'秦始皇统一六国后推行书同文车同轨政策，以小篆为全国标准文字，统一度量衡单位。', significance:'奠定了中国两千年大一统的文化基础。书同文使各地文化交流更加便利。', era:'秦始皇·李斯', type:'改革', detail:'【背景】战国时期各国文字货币和度量衡各不相同，给统一后的行政管理带来极大不便。\n\n【经过】秦始皇采纳李斯建议推行书同文车同轨政策：以小篆为标准文字，李斯撰写《仓颉篇》为识字范本。统一度量衡单位，规定车轨统一宽度为六尺。废除六国货币，统一为秦半两圆形方孔铜钱。\n\n【后果与影响】书同文使中国各地文化交流有了统一的文字载体，统一度量衡和货币极大便利了全国商贸活动，奠定了中国作为统一多民族国家的制度基石。' },
    { name:'灵渠修建', year:'前214', description:'秦始皇为征服岭南开凿灵渠连接湘江和漓江，沟通长江与珠江水系，全长约36公里。', significance:'世界上最古老的运河之一。使中原王朝有效控制岭南地区，促进了南北经济文化交流。', era:'秦始皇·史禄', type:'工程', detail:'【背景】秦始皇派屠睢率五十万大军南征岭南百越，因山地崎岖粮草运输极为困难。\n\n【经过】前214年秦始皇命监御史史禄主持开凿灵渠。灵渠位于广西兴安县，开凿约36公里人工运河，通过石堤将水流三七分，经陡门控制水位落差，实现长江和珠江水系的安全通航。\n\n【后果与影响】灵渠是世界上最古老的运河之一，使秦军有效控制岭南，设置三郡将岭南正式纳入中原王朝版图。灵渠持续两千多年发挥航运和灌溉功能。' },
  ],
  2: [  // 汉
    { name:'楚汉争霸', year:'前206-前202', description:'秦朝灭亡后项羽分封天下，封刘邦为汉王。刘邦趁机出兵关中，与项羽进行了长达四年的楚汉战争。最终在垓下之战中击败项羽。', significance:'以刘邦的胜利告终，奠定了西汉王朝的统治基础。刘邦从平民成为开国皇帝，是中国历史上"布衣天子"的典范。', era:'刘邦·项羽', type:'军事', detail:'【背景】秦朝灭亡后项羽自封西楚霸王，分封十八路诸侯。刘邦被封为汉王据巴蜀汉中之地。因分封不公齐国田荣叛乱，项羽率军讨伐，刘邦趁此机会东出争夺天下。萧何力荐韩信为大将军，刘邦登台拜将。\n\n【经过】韩信明修栈道暗度陈仓迅速平定三秦。刘邦率军东进楚汉战争全面爆发。项羽势大但刚愎自用一味崇尚武力；刘邦注重收揽民心善于用人力量逐渐增强。刘邦在正面战场屡败于项羽，但韩信开辟北方战场先后灭魏代赵齐等国，形成对项羽的合围态势。\n\n【后果与影响】前202年韩信指挥三十万大军在垓下设下十面埋伏之阵。项羽率八百骑突围退至乌江后拒绝渡江自刎而死。刘邦统一天下建立汉朝定都长安。' },
    { name:'白登之围', year:'前200', description:'刘邦亲率大军北击匈奴，被匈奴冒顿单于四十万骑兵围困于白登山七昼夜。后采纳陈平之计贿赂匈奴阏氏才得脱险。', significance:'使汉朝认识到匈奴的强大，从此采取和亲政策换取和平，为汉朝恢复国力赢得了宝贵时间。', era:'刘邦·冒顿单于', type:'外交', detail:'【背景】汉朝建立初期匈奴在冒顿单于领导下迅速崛起。前200年韩王信投降匈奴引匈奴兵南侵。\n\n【经过】刘邦率三十二万汉军北上，冒顿单于率四十万骑兵迎战。时值严冬汉军以南方子弟兵为主有二三成士卒被冻掉手指脚趾。在平城白登山汉军被匈奴骑兵分割包围围困七天七夜。刘邦采纳陈平之计派人重金贿赂单于的阏氏才得以脱险。\n\n【后果与影响】此战后刘邦认识到汉朝国力不足以与匈奴抗衡，遂采取和亲政策将皇族女子嫁给单于并每年奉送大量财物。此后直至汉武帝初期汉朝一直维持对匈和亲政策。' },
    { name:'文景之治', year:'前180-前141', description:'汉文帝和汉景帝实行轻徭薄赋、与民休息的政策。文帝废除肉刑、减省租赋，景帝平定七国之乱、削弱诸侯。', significance:'中国历史上第一个有明确记载的太平盛世，为汉武帝时期的大规模军事行动奠定了物质基础。', era:'汉文帝·汉景帝', type:'政治', detail:'【背景】汉初因连年战争社会生产遭到严重破坏，经济凋敝人口锐减。汉高祖推行休养生息政策。汉文帝汉景帝继承这一政策继续无为而治。\n\n【经过】汉文帝将田赋从十五税一降为三十税一，这是古代赋税最低的时期之一。他废除连坐法和部分肉刑减轻刑罚，个人生活极为节俭。汉景帝延续其父政策并通过平定七国之乱削弱了诸侯王势力。\n\n【后果与影响】经过文帝景帝两代近四十年的治理，西汉国库充盈百姓安居乐业。太仓之粟陈陈相因充溢露积于外至腐败不可食。为汉武帝北击匈奴开疆拓土提供了雄厚的物质基础。' },
    { name:'七国之乱', year:'前154', description:'汉景帝采纳晁错削藩建议，引发吴王刘濞联合七国叛乱。景帝派周亚夫率军平叛，三个月内平定。', significance:'标志着西汉中央集权的全面胜利。此后诸侯王不再拥有军事行政大权，从根本上解决了诸侯坐大的问题。', era:'周亚夫·晁错', type:'军事', detail:'【背景】刘邦在铲除异姓诸侯王后分封了九个刘姓子弟为王。诸侯王势力迅速膨胀掌握封国内征收赋税任免官吏大权，严重威胁中央集权。汉景帝采纳晁错的削藩建议下令削减诸侯封地。\n\n【经过】吴王刘濞联合楚王赵王等六国以诛晁错清君侧为名起兵叛乱。景帝先杀晁错但叛军并未退兵。景帝于是派周亚夫为太尉率军平叛。周亚夫采取放弃梁国坚守昌邑断叛军粮道的策略。叛军粮尽军心涣散周亚夫趁机出击仅用三个月便平定了叛乱。\n\n【后果与影响】吴王刘濞兵败被杀。景帝趁机收回诸侯王的军政权力，规定诸侯王不得治民王国官吏由中央任免。诸侯势力大为削弱再也无力与中央对抗。' },
    { name:'汉武帝北击匈奴', year:'前133-前87', description:'汉武帝派卫青、霍去病多次出击匈奴。漠北之战霍去病封狼居胥山，匈奴从此无力南下。张骞出使西域开辟丝绸之路。', significance:'扭转了汉匈攻守态势，"匈奴远遁，漠南无王庭"。丝绸之路促进中西交流。', era:'汉武帝·卫青·霍去病', type:'军事', detail:'【背景】经过文景之治近四十年的休养生息，西汉国力强盛。汉武帝不愿再忍受匈奴的欺压决心与匈奴开战彻底解决边患。\n\n【经过】前133年汉武帝策划马邑之围但计划泄露匈奴退兵。此后汉匈彻底撕破脸全面开战。汉武帝派卫青霍去病率军多次出击。卫青七次出击匈奴收复河套地区。霍去病两次出击河西收复河西走廊设立河西四郡。前119年漠北之战中卫青与霍去病各率五万骑兵深入大漠。霍去病率军奔袭二千余里大败匈奴左贤王部封狼居胥山。\n\n【后果与影响】匈奴远徙漠北漠南无王庭。困扰汉朝近百年的北方边患基本解决。至汉宣帝时期匈奴呼韩邪单于归附汉朝汉匈关系彻底改观。' },
    { name:'推恩令', year:'前127', description:'主父偃建议汉武帝实行推恩令。规定诸侯王封地必须分给所有儿子，使诸侯国不断分裂变小，无力对抗中央。', significance:'以和平方式彻底解决了汉初诸侯王威胁中央的难题，是加强中央集权最成功的政策之一。', era:'汉武帝·主父偃', type:'政治', detail:'【背景】推恩令是汉武帝·主父偃时期一次具有重大历史意义的政治事件，发生在前127前后。\n\n【经过】主父偃建议汉武帝实行推恩令。规定诸侯王封地必须分给所有儿子，使诸侯国不断分裂变小，无力对抗中央。\n\n【后果与影响】以和平方式彻底解决了汉初诸侯王威胁中央的难题，是加强中央集权最成功的政策之一。' },
    { name:'巫蛊之祸', year:'前91', description:'江充诬告太子刘据以巫蛊诅咒武帝。刘据被迫起兵诛江充后自杀。武帝事后查明真相悔恨不已。数万人被牵连致死。', significance:'导致太子刘据、皇后卫子夫等数万人死亡。汉武帝晚年的昏聩使汉朝由盛转衰。', era:'汉武帝·江充', type:'政治', detail:'【背景】巫蛊之祸是汉武帝·江充时期一次具有重大历史意义的政治事件，发生在前91前后。\n\n【经过】江充诬告太子刘据以巫蛊诅咒武帝。刘据被迫起兵诛江充后自杀。武帝事后查明真相悔恨不已。数万人被牵连致死。\n\n【后果与影响】导致太子刘据、皇后卫子夫等数万人死亡。汉武帝晚年的昏聩使汉朝由盛转衰。' },
    { name:'昭君出塞', year:'前33', description:'汉元帝将宫女王昭君嫁给匈奴呼韩邪单于。昭君出塞后汉匈和平五十余年。', significance:'和亲政策的典范。昭君出塞成为民族团结的象征，在文学艺术中被广为传颂。', era:'王昭君·呼韩邪单于', type:'外交', detail:'【背景】汉武帝北击匈奴后匈奴势力衰退。汉元帝时期匈奴呼韩邪单于归附汉朝主动请求和亲。\n\n【经过】王昭君原是汉元帝时期的宫女，听闻朝廷招募自愿出塞和亲者自请出嫁。临行前元帝召见才发现昭君容貌惊艳后悔不已但已不能更改。昭君出塞后嫁给呼韩邪单于被封为宁胡阏氏意为能使胡人安宁的王后。\n\n【后果与影响】昭君出塞为汉匈带来了约半个世纪的和平。边境数世不见烟火之警百姓黎庶无干戈之役。昭君在匈奴生活数十年被誉为和平使者。' },
    { name:'王莽篡汉', year:'9-23', description:'外戚王莽废孺子婴，建立新朝。王莽推行复古改制，引发天下大乱。绿林军、赤眉军起义。', significance:'西汉灭亡。王莽改制是中国历史上一次重要但失败的改革实验。', era:'王莽', type:'政治', detail:'【背景】西汉末年社会矛盾激化，土地兼并严重，外戚宦官干政。王莽以谦恭下士博取名声逐步掌握了朝政大权。\n\n【经过】公元8年王莽废汉孺子婴自立为帝建立新朝。即位后他推行托古改制包括土地收归国有禁止奴婢买卖多次改革币制等。但这些政令混乱朝令夕改反而激化了社会矛盾。加之连年天灾公元17年起绿林赤眉起义相继爆发。\n\n【后果与影响】23年绿林军在昆阳之战中大败王莽四十万大军。同年起义军攻入长安王莽被杀新朝灭亡。王莽改制以彻底失败告终。' },
    { name:'昆阳之战', year:'23', description:'刘秀率一万七千人在昆阳迎战王莽四十万大军。以少胜多，内外夹击大破莽军。此战后刘秀声威大震。', significance:'奠定了刘秀推翻王莽复兴汉室的基础。为建立东汉开辟了道路。', era:'刘秀·王莽', type:'军事', detail:'【背景】新莽末年绿林起义军迅速壮大拥立刘玄为更始帝。王莽派大司空王邑大司徒王寻率四十余万大军前往昆阳围剿起义军。昆阳城内起义军只有八九千人。\n\n【经过】绿林军将领刘秀主张坚守待援，自率十三骑趁夜出城求援。刘秀集合定陵郾城等地数千援军，亲率千人作为先锋冲击莽军侧翼斩首数千。城中守军见状也乘势出击内外夹攻。莽军大败自相践踏溃不成军王寻战死。\n\n【后果与影响】昆阳之战基本摧毁了王莽的主力军队。刘秀由此一战成名。同年起义军攻入长安王莽被杀新朝灭亡。' },
    { name:'光武中兴', year:'25-57', description:'刘秀建立东汉，释放奴婢、减省刑法、裁并郡县、精简官吏。退功臣而进文吏，使政治清明。', significance:'使汉朝国祚延续近两百年。刘秀柔道治国的理念开创了不同于西汉的统治风格。', era:'汉光武帝', type:'政治', detail:'【背景】新莽灭亡后天下陷入军阀混战局面。刘秀身为汉室宗亲在河北势力逐渐壮大。公元25年刘秀在河北鄗南千秋亭登基称帝延续汉的国号定都洛阳史称东汉。\n\n【经过】刘秀用了十二年时间统一天下，先后剿灭赤眉军平定隗嚣公孙述等割据势力。统一后他以柔道治国释放奴隶减轻赋税整顿吏治裁并郡县精简官吏。他变革中央官制加强皇权罢郡国材官骑士强化中央集权。\n\n【后果与影响】社会秩序迅速恢复人口大幅增长，史称光武中兴。东汉政权得以稳固为后来的明章之治奠定了基础。' },
    { name:'黄巾起义', year:'184', description:'张角创立太平道，发动黄巾军起义。起义军数十万人，席卷八州。东汉调集各州郡镇压，虽平定了起义但地方势力坐大。', significance:'黄巾起义标志着东汉末年的开始。此后群雄割据，最终导致三国鼎立。' , era:'张角·曹操', type:'军事' , detail:'【背景】东汉末年土地兼并严重农民大量破产。巨鹿人张角创立太平道以符水治病传教布道，十余年间信徒发展到数十万人。\n\n【经过】184年张角以苍天已死黄天当立岁在甲子天下大吉为口号发动全国性大起义。起义军头裹黄巾称黄巾军声势浩大。朝廷派皇甫嵩朱儁卢植率军镇压，同时放权于各地方政府允许自行募兵剿匪。\n\n【后果与影响】黄巾军因缺乏训练和组织最终被镇压张角病死。但地方豪强在平叛过程中拥兵自重形成割据势力。东汉中央集权名存实亡天下进入群雄割据时代。' },
    { name:'赤壁之战', year:'208', description:'孙权刘备联军在赤壁以火攻大败曹操大军。曹操退回北方，形成三国鼎立的格局。', significance:'赤壁之战奠定了三国鼎立的基础。此后曹操退守北方，刘备得荆州益州，孙权巩固江东。', era:'曹操·周瑜·诸葛亮', type:'军事', detail:'【背景】赤壁之战是曹操·周瑜·诸葛亮时期一次具有重大历史意义的军事行动，发生在208前后。\n\n【经过】孙权刘备联军在赤壁以火攻大败曹操大军。曹操退回北方，形成三国鼎立的格局。\n\n【后果与影响】赤壁之战奠定了三国鼎立的基础。此后曹操退守北方，刘备得荆州益州，孙权巩固江东。' },
    { name:'丝绸之路', year:'前138-127', description:'张骞奉汉武帝之命两次出使西域，开辟了连接中国与中亚、西亚乃至欧洲的商路。丝绸之路成为东西方文明交流的大动脉。', significance:'丝绸之路促进了中国与世界的经济文化交流。张骞被誉为"第一个睁开眼睛看世界的中国人"。', era:'张骞·汉武帝', type:'文化', detail:'【背景】汉武帝为联合大月氏共同夹击匈奴招募出使西域的人才，张骞应募出使。\n\n【经过】前138年张骞率一百余人从长安出发前往西域寻找大月氏。途中被匈奴抓获被扣留十余年但他始终手持汉节不忘使命。后寻机逃脱西行到达大宛康居大月氏大夏等国。前119年张骞第二次出使西域带领三百人的庞大使团到达乌孙国。\n\n【后果与影响】张骞两次出使凿空了通往西域的道路。此后西域各国与汉朝建立联系，一条连接中国与中亚西亚乃至欧洲的丝绸之路开通。前60年西汉正式设立西域都护府将西域纳入中国版图。' },
    { name:'司马迁著《史记》', year:'前91', description:'太史令司马迁历时十四年完成中国第一部纪传体通史《史记》，记载从黄帝到汉武帝三千余年历史。', significance:'中国史学的巅峰之作，「史家之绝唱无韵之离骚」。开创了纪传体史书体例。', era:'司马迁', type:'文化', detail:'【背景】司马迁著《史记》是司马迁时期一次具有重大历史意义的文化成果，发生在前91前后。\n\n【经过】太史令司马迁历时十四年完成中国第一部纪传体通史《史记》，记载从黄帝到汉武帝三千余年历史。\n\n【后果与影响】中国史学的巅峰之作，「史家之绝唱无韵之离骚」。开创了纪传体史书体例。' },
    { name:'蔡伦改进造纸术', year:'105', description:'东汉宦官蔡伦总结前人经验改进造纸术，用树皮麻头破布渔网等原料制造出便宜的纸张。', significance:'中国四大发明之一。造纸术传遍世界，对人类文明发展产生了不可估量的影响。', era:'蔡伦·汉和帝', type:'科技', detail:'【背景】蔡伦改进造纸术是蔡伦·汉和帝时期一次具有重大历史意义的科技成就，发生在105前后。\n\n【经过】东汉宦官蔡伦总结前人经验改进造纸术，用树皮麻头破布渔网等原料制造出便宜的纸张。\n\n【后果与影响】中国四大发明之一。造纸术传遍世界，对人类文明发展产生了不可估量的影响。' },
    { name:'罢黜百家独尊儒术', year:'前136', description:'董仲舒向汉武帝建议"罢黜百家表彰六经"，汉武帝采纳此建议，在太学设立五经博士，儒家学说成为官方正统思想。"独尊儒术"成为此后两千年中国社会的指导思想。', significance:'儒家思想成为中国古代社会的正统意识形态。确立了以儒学为核心的文化传统，对中国历史发展产生了深远影响，但也导致了思想禁锢和学术单一化。', era:'汉武帝·董仲舒', type:'文化', detail:'【背景】罢黜百家独尊儒术是汉武帝·董仲舒时期一次具有重大历史意义的文化成果，发生在前136前后。\n\n【经过】董仲舒向汉武帝建议"罢黜百家表彰六经"，汉武帝采纳此建议，在太学设立五经博士，儒家学说成为官方正统思想。"独尊儒术"成为此后两千年中国社会的指导思想。\n\n【后果与影响】儒家思想成为中国古代社会的正统意识形态。确立了以儒学为核心的文化传统，对中国历史发展产生了深远影响，但也导致了思想禁锢和学术单一化。' },
  ],
 3: [  // 晋
    { name:'司马昭弑君', year:'260', description:'魏帝曹髦不甘做司马昭傀儡，率宫中卫兵数百人讨伐司马昭。被司马昭部将贾充命成济刺死于车下。', significance:'司马昭之心路人皆知的典故即源于此。曹髦是中国历史上第一位为保卫皇权亲临战阵最终战死的皇帝。', era:'司马昭·曹髦', type:'政治', detail:'【背景】司马昭继其兄司马师之后执掌曹魏大权权倾朝野。魏帝曹髦不甘心做傀儡对司马昭的专权极度愤恨。\n\n【经过】260年五月曹髦率宫中宿卫及奴仆数百人拔剑登车亲自讨伐司马昭。司马昭部将贾充率兵迎战曹髦亲自挥剑拼杀。贾充命太子舍人成济挺矛直刺曹髦将其杀死于车下。\n\n【后果与影响】曹髦成为中国历史上第一位为捍卫皇权而死于战阵的皇帝。司马昭诛杀成济三族以谢天下另立曹奂为帝。司马昭之心路人皆知从此成为千古名言。此举加速了司马氏代魏的进程。'},
    { name:'西晋灭吴', year:'279-280', description:'司马炎发兵二十余万分六路大举伐吴。王濬水军顺流而下直逼建业。吴主孙皓投降西晋统一全国。', significance:'结束了自东汉末年以来近百年的分裂局面。西晋实现了全国统一但仅维持二十余年就陷入八王之乱。', era:'司马炎·杜预·王濬', type:'军事', detail:'【背景】265年司马炎代魏称帝建立西晋。此时天下三分蜀汉已于263年被灭唯有东吴据守江南与晋朝对峙。吴主孙皓昏庸残暴民怨沸腾国力日衰。\n\n【经过】279年十一月司马炎发兵二十余万分六路大举伐吴。杜预出襄阳王濬率水军从巴蜀沿江而下连克西陵夏口武昌直逼建业。280年三月王濬兵临建业孙皓备亡国之礼向晋军投降东吴灭亡。\n\n【后果与影响】东吴灭亡三国分裂局面结束中国实现了自东汉末年以来近百年的统一。晋武帝司马炎完成了祖辈未竟的大业成为三国最后的赢家。但统一后的西晋很快就因内部矛盾走向了崩溃。'},
    { name:'太康盛世', year:'280-289', description:'西晋统一后晋武帝推行休养生息政策。颁布户调式推行占田制，社会安定经济发展人口增长。', significance:'西晋唯一一段繁荣时期但昙花一现。司马炎后期怠惰享乐大封宗室诸王为八王之乱埋下隐患。', era:'晋武帝司马炎', type:'政治', detail:'【背景】灭吴统一天下后晋武帝司马炎志得意满但前期仍推行休养生息的政策减轻百姓负担恢复社会经济。\n\n【经过】司马炎颁布户调式推行占田制规定男子占田七十亩女子三十亩按此标准征收田租。裁减州郡兵员罢除徭役与民休息。晋朝社会相对安定农业和商业都得到恢复人口增长府库充实。\n\n【后果与影响】太康盛世是西晋唯一一段繁荣时期但也是昙花一现。司马炎在后期日渐怠惰沉迷享乐大封宗室诸王赋予军政实权为八王之乱埋下了致命的种子。'},
    { name:'八王之乱', year:'291-306', description:'晋惠帝庸愚皇后贾南风专权。赵王司马伦起兵诛贾后，汝南王楚王赵王齐王成都王等八位宗王卷入混战历时十六年。', significance:'西晋由盛转衰的根本转折点。耗尽国力边境空虚导致五胡乱华西晋灭亡。大量内迁少数民族目睹西晋虚弱纷纷异心。', era:'贾南风·司马伦·司马越', type:'军事', detail:'【背景】晋武帝司马炎去世后其子晋惠帝司马衷是个白痴皇帝根本无力治理国家。皇后贾南风趁机揽权她心狠手辣因太子司马遹非自己亲生便设计陷害将其废黜并毒死。此举触怒宗室诸王赵王司马伦借机起兵诛杀贾后从此拉开诸王混战序幕。\n\n【经过】八王之乱历时十六年先后有汝南王司马亮楚王司马玮赵王司马伦齐王司马冏长沙王司马乂成都王司马颖河间王司马颙东海王司马越八位宗王卷入混战。他们互相攻伐朝令夕改皇帝被反复挟持。司马伦甚至废惠帝自立为帝随即被其他诸王联合击败诛杀。最终东海王司马越在混战中胜出毒死晋惠帝立司马炽为帝成为最后赢家。但此时西晋的宗室力量中央军队和社会经济已被彻底消耗殆尽。\n\n【后果与影响】八王之乱是西晋灭亡的直接原因。十六年内战导致数十万人丧生洛阳长安等大城市多次被洗劫关中中原地区残破不堪。大量内迁的少数民族被诸王招募为雇佣军他们目睹西晋统治的虚弱纷纷有了异心。八王之乱结束后仅五年西晋便走向了灭亡。'},
    { name:'永嘉之乱', year:'311', description:'前赵刘聪派石勒刘曜大举南侵。石勒全歼西晋主力十余万人刘曜攻破洛阳屠杀官民三万余人。西晋至此名存实亡。', significance:'永嘉之乱是五胡乱华时期最惨烈的战役之一。陵墓被发掘盗毁洛阳宫室被焚烧殆尽。大量士族南迁史称衣冠南渡。', era:'刘聪·石勒·刘曜', type:'军事', detail:'【背景】八王之乱后西晋元气大伤关中中原人口锐减。内迁的匈奴鲜卑等少数民族势力迅速壮大。304年匈奴贵族刘渊称汉王以复汉为名起兵反晋。308年刘渊正式称帝建立前赵。\n\n【经过】311年前赵皇帝刘聪派大将石勒刘曜率军大举南侵。石勒在苦县全歼西晋主力十余万人西晋最后的军事力量被消灭。刘曜随即攻破洛阳晋怀帝被俘。洛阳城中官民被杀者三万余人宫室官府被焚烧殆尽晋朝历代皇帝陵墓也被发掘盗毁。\n\n【后果与影响】晋怀帝被押往平阳后被刘聪毒杀。316年刘曜攻陷长安晋愍帝出降西晋正式灭亡。从266年司马炎称帝到316年长安陷落西晋只存在了五十一年其中统一局面仅维持了二十余年。'},
    { name:'衣冠南渡与东晋建立', year:'317', description:'西晋灭亡后司马睿在王导等士族支持下在建康称晋王次年称帝建立东晋。中国政治中心正式南移。', significance:'东晋的建立标志着中国政治中心正式南移。南迁士族与江南本地士族融合江南成为中华文明延续的核心区域。', era:'司马睿·王导', type:'政治', detail:'【背景】西晋灭亡后北方陷入五胡十六国的混战之中大量士族和百姓无法在北方生存纷纷举族南迁。司马懿曾孙司马睿此前已被任命为安东将军都督扬州诸军事镇守建康。\n\n【经过】316年长安陷落西晋不复存在。317年司马睿在王导王敦等南北士族的拥戴下在建康称晋王次年正式称帝即晋元帝。南迁的北方士族与江南本地士族在政治经济文化上逐步融合。\n\n【后果与影响】东晋的建立标志着中国政治中心正式南移从此中国进入了南北朝长期分裂的时期。东晋虽然偏安江南但在门阀士族的共同治理下延续了国祚百余年。由于南渡主要发生在晋元帝永嘉年间这次大规模南迁史称衣冠南渡。'},
    { name:'祖逖北伐', year:'317-321', description:'祖逖以闻鸡起舞的精神率部曲百余家渡江北伐。数年之内收复黄河以南大片土地深得民心。', significance:'祖逖北伐是东晋偏安格局下最大的遗憾。朝廷猜忌不支持其北伐最终忧愤而死收复中原的抱负未能实现。', era:'祖逖·石勒', type:'军事', detail:'【背景】祖逖早年便以闻鸡起舞的刻苦精神闻名志在收复中原。西晋灭亡后北方大片领土落入胡人之手祖逖上书晋元帝请求北伐。晋元帝虽无大志但不好公开拒绝便给予少量粮饷由其自行募兵北伐。\n\n【经过】祖逖率部曲百余家渡江北上在江中击楫宣誓祖逖不能清中原而复济者有如大江。他与部下同甘共苦身先士卒在数年之内接连收复黄河以南大片土地击败后赵石勒的军队。石勒畏惧祖逖不敢南侵甚至主动与之修好。\n\n【后果与影响】正当祖逖准备渡河北进彻底收复中原之际东晋朝廷却担心他功高难制派戴渊为都督节制其军。祖逖见朝廷无意北伐反而猜忌自己忧郁成疾321年病逝。他去世后收复的土地很快丢失。'},
    { name:'王敦之乱', year:'322-324', description:'王敦以清君侧为名在武昌起兵沿江东下攻入建康。逼死晋元帝自任丞相控制朝政。后被晋明帝平定。', significance:'王敦之乱是东晋门阀政治危机的典型体现。王与马共天下格局下王氏势力膨胀试图取代皇权。平叛后门阀政治格局未变。', era:'王敦·晋元帝·王导', type:'军事', detail:'【背景】东晋立国后琅琊王氏势力极大王导主持朝政王敦手握重兵形成了王与马共天下的格局。晋元帝不甘心受制于王氏引入刁协刘隗等心腹试图削弱王氏权力。王敦极为不满以清君侧为名起兵叛乱。\n\n【经过】322年王敦从武昌沿江东下连克重镇兵临建康。晋元帝派军迎战皆被击败。王敦进入建康后大肆诛杀反对自己的大臣逼死刁协刘隗出逃晋元帝被软禁不久忧愤而死其子司马绍继位。324年王敦病重其兄王含代其领军再次谋反晋明帝亲率军队平叛王含大败王敦在武昌病逝党羽被剿灭。\n\n【后果与影响】王敦之乱被平定王氏势力暂时被削弱但门阀政治的格局并未根本改变。此后庾氏桓氏谢氏等大族相继轮流执政皇权始终未能摆脱士族的控制。'},
    { name:'苏峻之乱', year:'327-328', description:'历阳内史苏峻以讨伐庾亮为名联合祖约起兵攻破建康纵兵抢掠。温峤陶侃起兵勤王苏峻醉酒落马被杀。', significance:'苏峻之乱进一步暴露了东晋中央权威的脆弱。地方军阀稍有不遂便可起兵朝政只能依赖门阀大族的调和与制衡来维持。', era:'苏峻·庾亮·陶侃', type:'军事', detail:'【背景】晋成帝司马衍即位时年仅五岁由外戚庾亮辅政。庾亮专权与历阳内史苏峻豫州刺史祖约等地方实力派产生矛盾。庾亮担心苏峻尾大不掉决定征召其入朝实为削夺兵权。苏峻拒绝以讨伐庾亮为名联合起兵。\n\n【经过】327年苏峻祖约率军东下攻破建康纵兵抢掠朝中大乱。庾亮逃奔寻阳投靠温峤陶侃。温峤陶侃联合诸路兵马推陶侃为盟主起兵勤王。328年联军与苏峻在石头城激战苏峻在阵中饮酒狂纵因醉酒落马被杀。联军乘胜追击消灭了苏峻的残余势力。\n\n【后果与影响】苏峻之乱被平定陶侃因功入朝执政。此次叛乱进一步暴露了东晋中央权威的脆弱地方军阀稍有不遂便可起兵朝政只能依赖门阀大族的调和与制衡来维持。'},
    { name:'桓温北伐', year:'354-369', description:'桓温先后三次北伐分别针对前秦和前燕。一度收复洛阳但最终未能收复中原。通过北伐积累巨大政治声望。', significance:'桓温三次北伐最终未能收复中原但通过北伐积攒了巨大政治声望成为东晋最具权势的权臣。', era:'桓温·慕容垂', type:'军事', detail:'【背景】桓温是东晋权臣企图通过北伐积累个人声望进而图谋代晋自立。他先后发动了三次北伐分别针对前秦和前燕。\n\n【经过】第一次北伐354年桓温率军西征前秦进抵灞上关中百姓夹道欢迎。但因粮草不继未能攻克长安而退兵。第二次北伐356年桓温率军北进击败羌族姚襄收复洛阳修复晋朝旧都。第三次北伐369年桓温率五万大军北伐前燕初期连战连胜进至枋头但前燕名将慕容垂率军断其粮道桓温大败而还损失数万人。\n\n【后果与影响】桓温三次北伐最终未能收复中原但通过北伐积攒了巨大的政治声望成为东晋最具权势的权臣。他废晋帝司马奕立简文帝自己把持朝政几乎完成了篡位。373年桓温病逝临终前仍对未能加九锡耿耿于怀。'},
    { name:'淝水之战', year:'383', description:'前秦苻坚率百万大军南征东晋。谢安谢玄率北府兵八万在淝水大败前秦军。苻坚败逃前秦迅速崩溃。', significance:'中国历史上经典的以少胜多战役。此战保住东晋政权前秦崩溃北方重新陷入分裂。确立了中国南北对峙的基本格局。', era:'谢安·谢玄·苻坚', type:'军事', detail:'【背景】前秦皇帝苻坚在谋士王猛的辅佐下完成了北方的统一拥有百万大军。他自认为已经具备统一天下的条件不顾群臣反对决定南征东晋。383年七月苻坚下诏大举南侵发兵九十万水陆并进直指江南。东晋朝廷震动以谢安为征讨大都督谢玄为前锋都督率北府兵八万迎战。\n\n【经过】十一月两军在淝水对峙。谢玄派人向苻坚建议秦军稍退让晋军渡河后决一死战。苻坚自恃兵多想趁晋军半渡时发起总攻于是下令全军后退。但秦军是由各族士卒临时拼凑军心不齐一退即无法制止阵脚大乱。后撤时晋军降将朱序在阵后高呼秦军败矣秦军更加惊慌溃不成军。谢玄谢琰率北府兵趁势渡过淝水猛攻秦军。秦军大败自相践踏死伤无数风声鹤唳草木皆兵。苻坚中箭负伤单骑逃回淮北。\n\n【后果与影响】淝水之战是中国历史上经典的以少胜多的战役之一。前秦在此战后迅速崩溃各部族纷纷独立苻坚于385年被姚苌缢杀。东晋得以转危为安国祚再延续了三十余年。谢安谢玄因功声名鹊起陈郡谢氏的声望达到了顶峰。此战确立了中国南北对峙的基本格局统一中国的历史任务被推迟到了隋朝。'},
    { name:'刘裕北伐与东晋灭亡', year:'409-420', description:'刘裕先后灭南燕平卢循平桓玄取巴蜀灭后秦收复长安洛阳。420年逼迫晋恭帝禅让建立刘宋。', significance:'刘裕以寒门武将的身份终结了东晋的门阀政治开启了南朝寒人掌机要的新格局。东晋共延续一百零三年。', era:'刘裕·晋恭帝', type:'军事', detail:'【背景】东晋末年朝政腐败孙恩卢循起义此起彼伏。刘裕出身寒微在镇压起义和军阀混战中崛起掌握了东晋的军权。他先后平定了桓玄之乱消灭了南燕后秦等割据政权。\n\n【经过】刘裕北伐初期势如破竹灭南燕平卢循攻取巴蜀灭后秦一度收复关中使东晋的版图扩展到了长安洛阳。但刘裕北伐的真正目的是建立个人权威为取代东晋做准备。他并未将收复的失地作为长期经营的根基而是留重兵守关中自己返回建康筹划篡位。关中因他返回后守将内讧很快被大夏赫连勃勃攻占刘裕北伐的成果最终付诸东流。\n\n【后果与影响】420年刘裕逼迫晋恭帝司马德文禅让代晋称帝建立刘宋史称南朝宋。东晋灭亡中国历史进入南北朝时期。从317年司马睿建都建康算起东晋共延续了一百零三年。刘裕以寒门武将的身份终结了东晋的门阀政治开启了南朝寒人掌机要的新格局。'},
  ],
 4: [  // 南北朝
    { name:'北魏统一北方', year:'439', description:'太武帝拓跋焘先后攻灭大夏北燕北凉，重新统一北方，结束了十六国的分裂局面。', significance:'北魏的统一结束了十六国时期北方一百多年的分裂局面，与南朝宋形成南北对峙格局。北强南弱的局面从此逐步形成。', era:'拓跋焘', type:'军事', detail:'【背景】386年拓跋珪重建代国改称魏史称北魏。经过道武帝拓跋珪明元帝拓跋嗣两代的经营北魏逐渐壮大。423年太武帝拓跋焘即位后北方仍处于十六国纷争之中。\n\n【经过】拓跋焘先后发动了对大夏北燕北凉的大规模征伐。430年取关中436年灭北燕439年攻灭北凉重新统一了北方。拓跋焘还多次北征柔然保障了北部边境的安全。\n\n【后果与影响】北魏的统一结束了十六国时期北方一百多年的分裂局面与南朝宋形成了南北对峙的格局。北强南弱的局面从此开始逐步形成。'},
    { name:'刘裕北伐与代晋建宋', year:'416-420', description:'刘裕率大军北伐后秦，连克许昌洛阳潼关攻破长安灭后秦。420年代晋称帝建立南朝宋。', significance:'刘裕完成了南朝唯一一次收复长安洛阳的北伐。但因急于回师篡位长安旋失。为南朝赢得了巨大政治威望。', era:'刘裕·檀道济', type:'军事', detail:'【背景】东晋末年权臣刘裕控制了朝政但需要通过建立巨大军功来积累篡位的政治资本。当时占据关中的后秦政权内乱频发刘裕决定发动北伐一举消灭后秦。\n\n【经过】416年刘裕率大军北伐后秦檀道济为前锋连克许昌洛阳潼关。次年刘裕大军攻破长安后秦灭亡。但刘裕北伐的真正目的是为篡位铺路留下幼子刘义真守长安自己返回建康筹划称帝。420年刘裕代晋称帝建立南朝宋。\n\n【后果与影响】刘裕完成了南朝唯一一次收复长安洛阳的北伐。但因他急于回师篡位留守兵力不足长安旋为大夏赫连勃勃夺回。即便如此刘裕北伐仍为南朝赢得了巨大的政治威望。'},
    { name:'元嘉第一次北伐', year:'430', description:'宋文帝刘义隆派到彦之率军北伐收复黄河以南地区。北魏太武帝拓跋焘率军反攻宋军全线溃败。', significance:'暴露了南朝北伐的根本困境：缺乏骑兵优势难以长期守住黄河沿岸的领土。失败后刘宋国力未受大损。', era:'刘义隆·拓跋焘', type:'军事', detail:'【背景】宋文帝刘义隆即位后励精图治国力恢复。他念念不忘收复宋武帝刘裕时期丢失的河南之地当时被北魏占领。元嘉七年刘义隆派到彦之率军北伐。\n\n【经过】宋军初期进展顺利不费吹灰之力就收复了黄河以南的大片地区。但到十月北魏太武帝拓跋焘率大军反攻宋军抵挡不住北魏骑兵的冲击全线溃败黄河以南地区得而复失。\n\n【后果与影响】宋文帝并未就此罢休十几年后再次发动更大规模的北伐。这次失败暴露了南朝北伐的根本困境。'},
    { name:'元嘉第二次北伐', year:'450-451', description:'宋文帝三路大军北伐惨败。拓跋焘率军南征直达长江北岸瓜步山与建康隔江相望。南朝六州赤地无余。', significance:'刘宋由盛转衰的转折点。北强南弱的格局从此基本奠定。宋文帝感叹檀道济若在岂使胡马至此。', era:'刘义隆·拓跋焘·王玄谟', type:'军事', detail:'【背景】经过近二十年的休养生息刘宋国力再度提升。群臣争先向宋文帝献北伐之策其中王玄谟最为积极令宋文帝感叹观玄谟所陈令人有封狼居胥意。450年宋文帝下旨三路大军北伐。\n\n【经过】北伐初期王玄谟率军围攻滑台但久攻不下且军纪败坏丧失民心。北魏太武帝拓跋焘亲率大军救援王玄谟大败而逃宋军全线崩溃。拓跋焘乘胜南征数十万魏军渡过黄河淮河一路高歌猛进所过郡县赤地无余。451年正月初一拓跋焘大会于瓜步山与建康隔江相望。刘宋京师震动宋文帝登上石头城面有忧色。\n\n【后果与影响】魏军最终未能渡江撤军北返。但这次战争给刘宋造成了灾难性后果青冀徐兖豫南兖六州民死太半村井空荒无复鸣鸡吠犬。此战成为刘宋由盛转衰的转折点。'},
    { name:'孝文帝迁都与汉化改革', year:'494-499', description:'北魏孝文帝以迁都洛阳为契机全面推行汉化改革：改汉姓穿汉服说汉语与汉族通婚。', significance:'极大地促进了鲜卑族与汉族的融合是中华民族发展史上的里程碑。但激化了鲜卑旧贵族矛盾为六镇之乱埋下伏笔。', era:'孝文帝元宏·冯太后', type:'改革', detail:'【背景】北魏统一北方后都城平城偏居北境不利于对中原地区的控制和吸收汉族文化。北魏社会也面临鲜卑旧贵族的保守势力与汉化需求的矛盾。\n\n【经过】494年孝文帝以南伐为名率大军南迁实为迁都洛阳。迁都后全面推行汉化改革：改鲜卑复姓为汉姓（拓跋改元独孤改刘等）；禁止鲜卑人穿胡服说鲜卑语；规定鲜卑贵族与汉族高门通婚；推行门阀制度。\n\n【后果与影响】孝文帝改革极大地促进了鲜卑族与汉族的融合使北魏的统治基础更加稳固。但改革也激化了鲜卑旧贵族的矛盾洛阳的汉化集团与北境守旧势力之间的裂痕日益加深为后来的六镇之乱埋下伏笔。'},
    { name:'钟离之战', year:'505-507', description:'梁武帝萧衍北伐与魏军在钟离决战。梁军以火攻大破魏军，北魏损兵折将达二十万人。', significance:'北魏由盛转衰的关键一战。严重削弱了北魏军力阻断了北魏进一步向南扩张的野心。', era:'萧衍·元英', type:'军事', detail:'【背景】北魏宣武帝时期北魏军队在淮南持续扩张。梁武帝萧衍试图通过北伐夺回寿春等地。505年梁军大举北伐双方在寿春周边展开激战。\n\n【经过】北魏统帅元英大获全胜后决定乘胜进攻钟离城。淮河雨季来临河水暴涨梁朝援军二十万及时赶到以火攻大破魏军。据相关记载北魏此次损兵折将达二十万人以上。\n\n【后果与影响】钟离之役是北魏由盛转衰的关键一战严重削弱了北魏军力阻断了北魏进一步向南扩张的野心。此后北魏内部矛盾加剧宣武帝死后政局急剧衰败。'},
    { name:'侯景之乱', year:'548-552', description:'东魏降将侯景在寿阳起兵反梁攻破建康。梁武帝被围困饿死台城。江南经济文化遭受空前破坏。', significance:'南朝从盛转衰的转折点。侯景之乱摧毁了南朝的繁荣门阀士族遭受毁灭性打击。梁朝宗室自相残杀。', era:'侯景·梁武帝·陈霸先', type:'军事', detail:'【背景】侯景原是东魏叛将投降南梁后受到梁武帝萧衍的接纳。但侯景与梁朝宗室萧正德勾结对梁武帝的怠慢心怀不满。548年侯景以清君侧为名在寿阳起兵反梁。\n\n【经过】侯景叛军势如破竹迅速攻破建康将梁武帝围困于台城。梁武帝虽得到各地援军响应但援军各怀鬼胎不进不退。侯景断绝台城粮草供应梁武帝最终被困饿死终年八十六岁。侯景随后控制朝政大肆屠戮士族南朝社会遭受了前所未有的破坏。\n\n【后果与影响】侯景之乱使南朝元气大伤江南士族遭到毁灭性打击。梁朝宗室诸王为争位自相残杀陈霸先王僧辩等将领在平乱过程中崛起。557年陈霸先代梁建陈南朝进入最后一个朝代陈朝但国势已极度衰弱。'},
    { name:'西魏北周制度改革', year:'535-577', description:'西魏宇文泰推行府兵制创立八柱国体系。北周武帝灭佛充实国力整顿府兵制灭北齐统一北方。', significance:'西魏北周的制度改革为最终统一北方奠定了基础。府兵制被隋唐继承完善成为影响数百年军事制度。', era:'宇文泰·宇文邕', type:'改革', detail:'【背景】534年北魏分裂后西魏由宇文泰控制实力弱于东魏。宇文泰锐意改革推行了一系列制度创新。\n\n【经过】宇文泰创立府兵制将兵民分离设八柱国十二大将军。推行六条诏书整顿吏治。北周武帝宇文邕进一步推行灭佛政策充实国力整顿府兵制。575年伐齐577年灭北齐统一北方。\n\n【后果与影响】北周的统一结束了自534年北魏分裂以来四十余年的北方分裂局面。这些制度改革为隋朝最终结束南北朝分裂奠定了基础。被隋唐继承完善的府兵制影响中国军事制度数百年。'},
    { name:'隋灭陈与南北朝结束', year:'589', description:'隋文帝杨坚发动灭陈之战。隋军分八路南征攻陷建康俘虏陈后主。南北朝时代正式结束。', significance:'隋朝实现了自西晋灭亡以来近三百年的全国统一。南北朝时代正式结束中国进入隋唐大一统时期。', era:'隋文帝·陈后主', type:'军事', detail:'【背景】581年北周外戚杨坚代周建隋。经过数年的内部整顿和军事准备588年隋文帝杨坚发动灭陈之战。\n\n【经过】隋军分八路南征从长江上游和下游同时进攻。589年正月隋军攻陷建康俘虏陈后主陈叔宝陈朝灭亡。\n\n【后果与影响】隋朝实现了自西晋灭亡以来近三百年的全国统一。南北朝时代正式结束中国进入隋唐大一统时期。此战也标志着从东汉末年以来近四百年的分裂动荡局面彻底终结。'},
  ],
 5: [  // 隋
    { name:'开皇之治', year:'581-604', description:'隋文帝杨坚统一全国后推行全面改革。废九品中正制创立科举制；确立三省六部制；推行均田制和租庸调制；修开皇律。社会安定经济繁荣。', significance:'开皇之治为隋唐盛世的到来奠定了制度基础。科举制度打破了门阀世族对官场的垄断促进了社会流动。', era:'隋文帝·高颎', type:'政治', detail:'【背景】581年杨坚代周建隋后国家初定百废待兴。南北朝时期门阀士族垄断官场政治腐败民生凋敝。杨坚决心进行全面制度改革以巩固统一加强中央集权。\n\n【经过】杨坚在宰相高颎的辅佐下推行了一系列影响深远的改革。废除九品中正制创立科举制度以分科考试选拔官员打破门阀垄断。确立三省六部制（尚书省门下省内史省）明确分工提高行政效率。推行均田制和租庸调制减轻农民负担增加国家财政收入。修开皇律减轻刑罚废除酷刑。这些改革使隋朝迅速进入繁荣时期史称开皇之治。\n\n【后果与影响】开皇之治为隋唐盛世的到来奠定了制度基础。科举制度打破了门阀世族对官场的垄断促进了社会流动是中国古代最重要的制度创新之一。三省六部制被后世延续沿用至明清。但杨坚晚年猜忌功臣废太子杨勇改立次子杨广埋下了隋朝短命的祸根。'},
    { name:'修建大兴城', year:'582-583', description:'隋文帝命宇文恺在长安故城东南修建新都大兴城。城市面积达84平方公里布局严整呈棋盘式格局。', significance:'当时世界上规模最大规划最严整的城市。唐代改称长安并继续沿用成为世界著名古都。', era:'隋文帝·宇文恺', type:'工程', detail:'【背景】杨坚代周建隋后仍以北周旧都长安为都城。但旧城历时已久水咸难饮宫殿残破不足以显示新王朝的气象。杨坚决定在长安故城东南修建新都。\n\n【经过】582年杨坚命宇文恺为营建总监征发数万民夫在龙首原南侧修建新都。宇文恺精心规划城市呈东西对称棋盘式格局。宫城居中偏北皇城在其南居民区在东西两侧。全城面积达84平方公里分为109坊和东西两市。仅用九个月就完成了主体工程速度惊人。583年隋朝正式迁都新都命名为大兴城。\n\n【后果与影响】大兴城是当时世界上规模最大规划最严整的城市。唐代改称长安继续沿用成为中国古代最著名的都城和世界性大都市。其城市规划和布局对后世都城建设（如洛阳北京）产生了深远影响。'},
    { name:'科举制创立', year:'587-605', description:'隋文帝废除九品中正制开始用分科考试选拔官员。隋炀帝设立进士科科举制度正式确立。', significance:'科举制度是中国古代最重要的制度创新之一。打破了门阀世族对官场的垄断促进了社会流动。', era:'隋文帝·隋炀帝', type:'改革', detail:'【背景】自魏晋以来九品中正制使门阀士族世代垄断高级官职。南朝末期寒门出身的人才难以进入权力核心严重阻碍了社会流动。隋文帝统一后决心打破这一局面。\n\n【经过】587年隋文帝下令废除九品中正制开始以分科考试的方式选拔官员。605年隋炀帝设立进士科以诗赋和策论为主要考试内容科举制度至此正式确立。科举打破了门第限制寒门子弟可以通过努力读书改变命运。\n\n【后果与影响】科举制度是中国古代最重要的制度创新之一。打破了门阀世族对官场的垄断极大地促进了社会流动。此后历代不断完善延续至清末延续近一千三百年。科举制度还影响了东亚和西方国家的文官考试制度。'},
    { name:'开凿大运河', year:'605-610', description:'隋炀帝征发数百万民夫开凿大运河。连接海河黄河淮河长江钱塘江五大水系南起余杭北达涿郡全长两千余公里。', significance:'中国古代最宏伟的水利工程之一。加强了南北联系促进了经济文化交流。但劳役过重是隋末民变的重要原因。', era:'隋炀帝·宇文恺', type:'工程', detail:'【背景】杨广即位后决心加强南北联系促进经济交流并方便对江南和山东地区的控制。同时他也希望乘龙舟巡游江南享受富庶。这是一个宏大而又充满个人享乐色彩的计划。\n\n【经过】605年隋炀帝征发河南淮北数百万民夫开凿通济渠连接黄河与淮河。同时征发淮南民夫十余万人拓宽邗沟连接淮河与长江。608年征发河北百万民夫开凿永济渠北达涿郡。610年开凿江南河南起余杭北至京口连接长江与钱塘江。至此大运河全线贯通。大运河以洛阳为中心南起余杭（杭州）北达涿郡（北京）全长两千余公里。\n\n【后果与影响】大运河是中国古代最宏伟的水利工程之一。它加强了南北联系促进了经济文化交流使南方的粮食和物资能够便捷地运往北方。但工程征发了数百万民夫劳役繁重民不堪命无数人死于苦役。大运河与三征高句丽一同成为隋末民变的重要原因。大运河在唐宋元明清各代继续发挥重要作用沿用至今。'},
    { name:'三征高句丽', year:'612-614', description:'隋炀帝三次大规模远征高句丽动用兵力百余万人。但因统率失误补给困难均以惨败告终。', significance:'隋朝元气大伤民众苦不堪言直接引发了隋末农民大起义是隋朝迅速灭亡的重要原因。', era:'隋炀帝', type:'军事', detail:'【背景】高句丽是位于朝鲜半岛北部和中国东北地区的强大政权。隋文帝时期高句丽曾遣使朝贡但并不臣服。杨广好大喜功认为征服高句丽可以彰显隋朝国威并使自己的功业超越秦皇汉武。\n\n【经过】612年隋炀帝第一次征高句丽出动兵力一百一十三万号称二百万。隋军分水陆多路进攻。但由于杨广遥控指挥将领不敢自专加上高句丽据城坚守隋军久攻不下。陆军在辽东城下受阻水军在平壤城外大败。最终三十万隋军只有两千七百人返回。613年杨广第二次征高句丽正在围攻辽东城时后方杨玄感起兵反隋杨广被迫撤军。614年第三次征高句丽高句丽因连年战争疲惫不堪遣使请降。杨广以此为由班师回朝自认为征服了高句丽。\n\n【后果与影响】三次战争共动用兵力数百万人死伤极为惨重。隋朝元气大伤府库空虚民众苦不堪言。征发的民夫和军士大量逃亡直接引发了隋末农民大起义。三征高句丽是隋朝迅速灭亡的导火索。唐太宗后来评价说隋炀帝征高句丽是不度德量力自取灭亡。'},
    { name:'隋末农民起义', year:'611-618', description:'隋炀帝滥用民力百姓不堪重负。王薄首先起义随后瓦岗军窦建德杜伏威等数十支起义军遍布全国。', significance:'农民大起义直接导致隋朝覆灭。李渊趁天下大乱之机从太原起兵最终建立唐朝。', era:'李密·窦建德·杜伏威', type:'军事', detail:'【背景】隋炀帝连年征发民夫开凿大运河三征高句丽修建东都洛阳等巨型工程。百姓徭役繁重田地荒芜饿殍遍野。山东河北一带首当其冲民众走投无路纷纷举起义旗。\n\n【经过】611年王薄在山东长白山首先起义作无向辽东浪死歌号召百姓不要为隋炀帝送死。随后全国各地起义风起云涌重要的有翟让李密领导的瓦岗军窦建德领导的河北义军杜伏威领导的江淮义军。瓦岗军声势最大一度攻占兴洛仓开仓放粮拥众数十万。614年后隋朝统治土崩瓦解各地军阀纷纷割据。617年李渊在太原起兵趁机攻占长安。618年宇文化及在江都缢杀隋炀帝隋朝灭亡。\n\n【后果与影响】隋末农民大起义直接导致隋朝覆灭。隋朝国祚仅三十八年与秦朝一样是典型的其兴也勃焉其亡也忽焉。李渊利用天下大乱之机从太原起兵最终建立了唐朝。隋末群雄中李密势力最大但因战略失误未能统一天下。唐朝建立后逐步消灭了各割据势力于624年重新统一全国。'},
  ],
 6: [  // 唐
    { name:'玄武门之变', year:'626', description:'李世民在长安玄武门设伏射杀太子李建成和齐王李元吉，迫使李渊退位登基。', significance:'最著名的宫廷政变之一。虽手段残酷但李世民即位后开创贞观之治。', era:'唐太宗·李建成', type:'政治', detail:'【背景】唐朝建立后太子李建成和秦王李世民的矛盾日益激化。李建成联合齐王李元吉排挤李世民。李世民在房玄龄杜如晦长孙无忌等谋士的策划下决定先发制人。\n\n【经过】626年六月初四李世民在长安玄武门设伏。当李建成李元吉骑马入宫经过玄武门时李世民率伏兵冲出射杀李建成。李元吉也被尉迟恭射杀。随后李世民逼迫父亲李渊立自己为太子。两个月后李渊退位李世民登基即唐太宗。\n\n【后果与影响】玄武门之变是唐代最著名的宫廷政变。虽然手段残酷但李世民即位后励精图治虚心纳谏开创了贞观之治成为一代明君。\'玄武门之变体现了权力争夺的残酷也证明了结果正义的悖论。'},
    { name:'贞观之治', year:'627-649', description:'唐太宗虚心纳谏任用魏征房玄龄杜如晦等贤相。对外征服东突厥吐谷浑高昌被尊为天可汗。', significance:'中国历史上最著名的盛世之一。政治清明经济繁荣文化发达为后来的开元盛世奠定了基础。', era:'唐太宗·魏征', type:'政治', detail:'【背景】玄武门之变后李世民登基时唐朝面临内忧外患。突厥连年侵扰北方经济尚未从隋末战乱中恢复。李世民决心开创一个不同于隋炀帝时期的新局面。\n\n【经过】李世民以亡隋为鉴励精图治。他以魏征为谏议大夫虚心纳谏先后任用房玄龄杜如晦长孙无忌等贤相。推行均田制租庸调制完善三省六部制修订唐律。对外军事上630年派李靖灭东突厥俘虏颉利可汗。634年灭吐谷浑640年灭高昌。西域诸国纷纷归附尊称李世民为天可汗。\n\n【后果与影响】贞观之治是中国历史上最著名的盛世之一。政治清明经济繁荣文化发达社会稳定。史书记载当时路不拾遗夜不闭户。贞观之治为后来的开元盛世奠定了坚实基础。其治国理念对后世产生了深远影响。'},
    { name:'灭高句丽', year:'644-668', description:'唐太宗和唐高宗父子两代持续征伐高句丽。668年李勣攻破平壤灭亡立国近七百年的高句丽。', significance:'结束了中国东北地区长期独立于中原政权的局面。唐朝疆域达到极盛。', era:'唐太宗·唐高宗·李勣', type:'军事', detail:'【背景】高句丽是位于朝鲜半岛北部和中国东北的强国自西汉末年立国以来长期与中原王朝对抗。隋炀帝三征高句丽均以惨败告终。唐太宗李世民一直将其视为心腹大患。\n\n【经过】644年唐太宗亲征高句丽率军攻占辽东重镇但在安市城下受阻因天气转寒退兵。此后唐朝持续骚扰消耗高句丽国力。唐高宗时期利用高句丽内乱于666年派李勣率大军东征。668年唐军攻破平壤高句丽国王被俘立国近七百年的高句丽政权灭亡。\n\n【后果与影响】唐朝在高句丽故地设安东都护府结束了中国东北地区长期独立于中原政权的局面。唐朝疆域达到极盛东至朝鲜半岛西至中亚。灭高句丽完成了几代帝王的夙愿。'},
    { name:'武则天称帝', year:'690', description:'武则天废睿宗李旦改国号为周正式登基成为中国历史上唯一得到普遍承认的女皇帝。创立殿试和武举。', significance:'中国女性政治权力的巅峰。其统治上承贞观之治下启开元盛世。科举改革影响深远。', era:'武则天', type:'政治', detail:'【背景】武则天十四岁入宫为唐太宗才人太宗死后入感业寺为尼。唐高宗李治在当太子时就与她有私情。高宗即位后召其回宫立为昭仪。武则天工于心计先后击败王皇后和萧淑妃被立为皇后。\n\n【经过】高宗晚年身体多病武则天开始参与朝政与高宗并称二圣。高宗去世后武则天先后废立中宗睿宗终于690年废睿宗李旦改国号为周正式登基称帝。她在位期间推行了一系列重要改革：创立殿试和武举打破门阀垄断大量提拔寒门人才；推行劝农桑薄赋役政策促进经济发展；加强科举制度完善官员选拔。\n\n【后果与影响】武则天是中国历史上唯一得到普遍承认的女皇帝。她的统治上承贞观之治下启开元盛世为唐朝的持续发展做出了重要贡献。705年神龙政变武则天退位同年病逝。她的传奇人生和政治才能对后世产生了深远影响。'},
    { name:'神龙政变', year:'705', description:'张柬之等联合右羽林大将军发动政变诛杀武则天宠臣逼迫武则天退位拥立唐中宗复位。', significance:'结束了武则天长达十五年的统治恢复了李唐王朝。', era:'张柬之·武则天', type:'政治', detail:'【背景】武则天晚年宠信张易之张昌宗兄弟。二张恃宠而骄干预朝政大臣们敢怒不敢言。武则天的健康状况日益恶化太子李显的地位变得微妙。宰相张柬之决定发动政变恢复李唐。\n\n【经过】705年正月张柬之联合右羽林大将军李多祚等率羽林军突入玄武门斩杀张易之张昌宗。随后包围武则天居住的迎仙宫逼迫武则天退位。武则天被迫下诏传位于太子李显即唐中宗。李显复位后恢复唐的国号。武则天在同年底病逝享年八十二岁。\n\n【后果与影响】神龙政变结束了武则天长达十五年的统治恢复了李唐王朝。武则天以八十二岁高龄善终是中国历史上结局最好的女皇帝之一。但神龙政变后中宗软弱韦皇后和安乐公主干政为后来的唐隆政变埋下伏笔。'},
    { name:'开元盛世', year:'713-741', description:'唐玄宗在位前期励精图治任用姚崇宋璟等贤相。唐朝达到鼎盛长安成为世界性大都市。', significance:'唐朝乃至整个中国封建社会的鼎盛时期。杜甫诗云忆昔开元全盛日小邑犹藏万家室。', era:'唐玄宗·姚崇·宋璟', type:'政治', detail:'【背景】710年唐隆政变李隆基铲除韦后集团拥立父亲李旦为帝即唐睿宗。712年李旦传位于李隆基即唐玄宗。玄宗即位后铲除太平公主势力彻底巩固皇权。\n\n【经过】玄宗在位前期励精图治。他先后任用姚崇宋璟张说张九龄等贤相。姚崇提出十事要说作为施政纲领。推行改革发展经济整顿吏治裁撤冗员。完善科举制度抑制佛教势力。对外击败突厥吐蕃契丹巩固边疆。唐朝进入全盛时期长安人口超过百万成为世界性大都市。\n\n【后果与影响】开元盛世是唐朝乃至整个中国封建社会的鼎盛时期。杜甫诗云忆昔开元全盛日小邑犹藏万家室。开元时期政治清明经济繁荣文化灿烂唐诗李白杜甫王维等都活跃于这个时代。但玄宗后期怠于政事宠幸杨贵妃重用安禄山等胡人节度使为安史之乱埋下隐患。'},
    { name:'安史之乱', year:'755-763', description:'三镇节度使安禄山在范阳起兵迅速攻占洛阳长安。玄宗出逃四川马嵬坡兵变杨贵妃被缢死。', significance:'唐朝由盛转衰的转折点。此后藩镇割据宦官专权朋党之争三大问题日益严重。', era:'安禄山·唐玄宗·郭子仪', type:'军事', detail:'【背景】唐玄宗晚年宠幸杨贵妃重用杨国忠。为防御边疆大量任用胡人担任节度使其中安禄山兼任平卢范阳河东三镇节度使拥兵十五万。宰相杨国忠与安禄山矛盾激化安禄山以讨伐杨国忠为名决定起兵。\n\n【经过】755年十一月安禄山在范阳起兵叛军南下势如破竹迅速攻占洛阳。756年正月安禄山在洛阳称帝国号大燕。同年六月安禄山攻占长安唐玄宗仓皇出逃四川。行至马嵬坡禁军哗变杀死杨国忠并逼迫玄宗缢死杨贵妃。玄宗逃往四川太子李亨在灵武即位即唐肃宗。唐军郭子仪李光弼等将领率军平叛。757年安禄山被其子安庆绪所杀。763年历时七年的安史之乱最终平定。\n\n【后果与影响】安史之乱是唐朝由盛转衰的转折点。动乱导致北方社会经济遭到严重破坏人口锐减。唐朝从此陷入藩镇割据宦官专权朋党之争三大问题国力日衰再也未能恢复开元盛世的繁荣。安史之乱也被视为中国封建社会由盛转衰的标志性事件之一。'},
    { name:'元和中兴', year:'805-820', description:'唐宪宗励精图治任用杜黄裳裴度等贤相削弱藩镇势力。先后平定西川镇海淮西等节度使叛乱。', significance:'安史之乱后最有成效的中央集权努力为唐朝延续了近百年国祚。', era:'唐宪宗·裴度', type:'政治', detail:'【背景】安史之乱后藩镇割据日益严重。河北三镇（卢龙成德魏博）实际上形同独立中央难以控制。各地节度使或父死子继或自行废立朝廷无力过问。唐宪宗李纯即位后决心改变这一局面。\n\n【经过】唐宪宗在位期间任用杜黄裳裴度李绛等贤相整顿朝政。先后平定西川节度使刘辟镇海节度使李锜淮西节度使吴元济等人的叛乱。其中平定淮西吴元济之战最为关键李愬雪夜入蔡州成为著名战例。各藩镇纷纷归附中央的权威得到了一定程度的恢复。\n\n【后果与影响】元和中兴是安史之乱后最有成效的中央集权努力。但唐宪宗晚年迷信丹药荒于朝政。820年被宦官陈弘志杀害。此后唐朝又陷入宦官专权和藩镇割据的循环中但元和中兴毕竟为唐朝延续了近百年国祚。'},
    { name:'牛李党争', year:'808-846', description:'以牛僧孺李宗闵为首的牛党和以李德裕为首的李党之间长达四十年的派系斗争互相倾轧。', significance:'唐朝晚期政治腐败的集中体现。朋党之争严重消耗了唐朝的国力。', era:'牛僧孺·李德裕', type:'政治', detail:'【背景】808年科举考试中牛僧孺李宗闵等人在策论中批评朝政受到宰相李吉甫（李德裕之父）的压制。由此埋下了两党恩怨的种子。此后牛党和李党各拉山头互相攻讦。\n\n【经过】牛党以牛僧孺李宗闵为首主要依靠科举出身。李党以李德裕为首依靠门荫和世家。两党轮流执政一方当权即全力排挤另一方。即使在边疆紧急财政困难时两党仍不忘互相攻击。唐文宗对此无可奈何感叹去河北贼易去朝廷朋党难。\n\n【后果与影响】牛李党争长达四十年严重消耗了唐朝的国力。两党互相倾轧使朝政日益败坏许多有才能的官员在党争中浪费了精力。会昌年间李德裕当政时一度颇有政绩但因党争激烈未能持续推进。846年唐宣宗即位后贬斥李德裕党争逐渐平息但唐朝也走到了末年。'},
    { name:'黄巢起义', year:'875-884', description:'私盐贩出身的黄巢率众起义转战大半个中国攻占长安建立大齐政权后被李克用等镇压。', significance:'沉重打击了唐朝的统治基础。此后唐朝名存实亡藩镇割据加剧朱温篡唐。', era:'黄巢·朱温·李克用', type:'军事', detail:'【背景】唐朝末年土地兼并严重天灾频发百姓流离失所。山东河南一带先后爆发王仙芝黄巢起义。黄巢是曹州人私盐贩出身颇有家财。他响应王仙芝起义王仙芝战死后被推举为起义领袖。\n\n【经过】黄巢起义军采取流动作战策略转战大半个中国。878年攻占广州880年攻占洛阳同年十二月攻入长安唐僖宗逃往四川。黄巢在长安称帝国号大齐年号金统。但黄巢未能建立有效的统治军队纪律败坏失去民心。唐朝调集各镇节度使李克用率沙陀骑兵等围攻长安。883年黄巢退出长安退往山东。884年在狼虎谷被部下所杀起义失败。\n\n【后果与影响】黄巢起义沉重打击了唐朝的统治基础。此后唐朝名存实亡藩镇割据加剧。朱温（原黄巢部将后降唐）在镇压起义过程中坐大最终于907年篡唐建立后梁。唐朝近三百年的统治就此终结。'},
    { name:'遣唐使与鉴真东渡', year:'630-753', description:'日本先后派十九次遣唐使来华学习唐朝制度文化。鉴真六次东渡日本传播佛法与唐文化。', significance:'中日文化交流的高峰。遣唐使将唐朝律令制度佛教建筑文字等带回日本推动了日本社会进步。', era:'晁衡·鉴真', type:'外交', detail:'【背景】唐朝是当时世界上最强大的国家之一文化高度发达。日本从630年开始派遣使团到中国学习唐朝的政治制度文化科技和佛教。遣唐使规模庞大每次数百人包括留学生学问僧等。\n\n【经过】从630年至894年的二百六十余年间日本共派遣十九次遣唐使团。著名的遣唐使有阿倍仲麻吕（汉名晁衡）在唐朝考中进士在朝为官数十年与李白王维等诗人交好。鉴真和尚应日本僧人邀请决心东渡传法。先后五次东渡失败双目失明。753年第六次东渡终于成功抵达日本。他在日本传播佛法将唐朝的建筑雕塑医药等文化传入日本。\n\n【后果与影响】遣唐使将唐朝的律令制度城市规划文字佛教建筑艺术等带回日本对日本社会产生了深远影响。日本的平城京（奈良）和平安京（京都）都模仿长安规划。鉴真东渡促进了中日文化交流被日本尊为律宗初祖。唐代的中日文化交流是此后中日关系史上的黄金时期。'},
    { name:'雕版印刷与唐诗繁荣', year:'618-907', description:'唐代雕版印刷技术高度成熟现存最早有纪年的印刷品是868年刻印的金刚经。唐诗是中国文学最辉煌的成就。', significance:'雕版印刷促进了知识和文化的传播。唐诗是中国文学登峰造极的成就李白杜甫白居易等大家辈出。', era:'李白·杜甫·白居易', type:'科技', detail:'【背景】唐代是中国文化大发展的时期。造纸技术进一步完善为印刷术的发展提供了物质条件。佛教广为流传佛经需求量大也推动了雕版印刷的发展。同时唐朝经济繁荣社会稳定为文学创作的黄金时代提供了土壤。\n\n【经过】唐代雕版印刷技术已经相当成熟。现存最早有明确纪年的雕版印刷品是868年王玠出资刊刻的金刚般若波罗蜜经。卷首扉画精美刀法流畅说明当时的雕版印刷技术已高度发达。唐诗在唐代达到全盛涌现了李白杜甫白居易王维孟浩然王昌龄李商隐杜牧等众多大家。唐诗题材广泛风格多样既有浪漫主义又有现实主义既有边塞诗又有田园诗。\n\n【后果与影响】雕版印刷极大地促进了知识和文化的传播为宋代印刷术的进一步发展和文化繁荣奠定了基础。唐诗是中国文学登峰造极的成就是对世界文学的伟大贡献。唐诗的格律技巧艺术成就至今无人超越成为中华民族的文化瑰宝。'},
  ],
 7: [  // 宋
    { name:'陈桥兵变', year:'960', description:'后周大将赵匡胤在陈桥驿被部下黄袍加身拥立为帝回师开封逼迫后周恭帝禅位建立宋朝。', significance:'以较为和平的方式完成政权更迭。赵匡胤兵不血刃夺取天下在历史上较为罕见。', era:'宋太祖·赵普', type:'政治', detail:'【背景】后周世宗柴荣英年早逝继位的恭帝年仅七岁主少国疑。赵匡胤时任殿前都点检掌握禁军大权。北方传来契丹与北汉联合南侵的消息朝廷派赵匡胤率军北上御敌。\n\n【经过】960年正月初一赵匡胤率军北上。初三行至开封东北的陈桥驿时其弟赵光义和谋士赵普等策划发动兵变。他们将事先准备好的黄龙袍披在赵匡胤身上高呼万岁史称黄袍加身。赵匡胤随即率军回师开封由于京城内应的石守信等将领开门迎接后周恭帝被迫禅位。赵匡胤登基建国号宋定都开封。\n\n【后果与影响】陈桥兵变以较为和平的方式完成政权更迭避免了大规模流血。赵匡胤兵不血刃夺取天下在历史上较为罕见。北宋建立后赵匡胤杯酒释兵权推行重文轻武政策深刻影响了宋朝三百余年的历史走向。'},
    { name:'杯酒释兵权', year:'961', description:'赵匡胤在宴会上以高官厚禄劝说石守信等开国将领交出兵权众将纷纷称病辞职。', significance:'以和平方式解决开国功臣拥兵自重问题。但也导致宋朝重文轻武军事实力长期薄弱。', era:'宋太祖·石守信', type:'政治', detail:'【背景】宋朝建立后赵匡胤吸取唐末五代以来武将拥兵自重频繁改朝换代的教训。石守信高怀德王审琦等开国将领手握禁军兵权赵匡胤担心他们也会被部下黄袍加身。\n\n【经过】961年秋天赵匡胤设宴招待石守信等禁军将领。酒过三巡赵匡胤屏退左右对众将说没有你们的支持我当不上皇帝但当了皇帝后反而整夜睡不安稳。石守信等询问原因赵匡胤说皇位谁不想坐一旦你们的部下也把黄袍披在你们身上你们怎么办。众将惶恐请赵匡胤指条生路。赵匡胤说不如交出兵权到地方上做节度使多置良田美宅为子孙立长久之计君臣之间两无猜疑。次日石守信等纷纷称病辞职。\n\n【后果与影响】杯酒释兵权以和平方式解决了开国功臣拥兵自重问题避免了汉高祖杀功臣的悲剧。但这也导致宋朝政府推行重文轻武政策武将地位低落军事实力长期薄弱成为宋朝积弱的重要原因。'},
    { name:'澶渊之盟', year:'1005', description:'辽国大举南侵宋真宗在寇准力劝下御驾亲征。宋军射杀辽军统帅。宋辽签订和议宋每年纳岁币。', significance:'维持宋辽百年和平为宋朝经济文化繁荣创造稳定环境。岁币制度体现宋朝外交弱势。', era:'宋真宗·寇准', type:'外交', detail:'【背景】宋太宗两次北伐辽国均遭失败宋朝对辽采取守势。1004年辽圣宗和萧太后率大军大举南侵深入宋境攻至澶州逼近开封。宋朝朝野震动大臣王钦若主张迁都金陵陈尧叟建议逃往成都。\n\n【经过】宰相寇准力排众议力劝宋真宗御驾亲征以鼓舞士气。宋真宗勉强同意北上到达澶州北城。宋军见皇帝亲临士气大振。辽军先锋大将萧挞凛在澶州城下被宋军床子弩射杀辽军士气受挫。辽朝见难以取胜又担心后路被断遣使求和。宋真宗本来就不想打仗见辽方求和喜出望外。寇准主张乘胜追击但宋真宗决定议和。1005年宋辽签订澶渊之盟：宋辽约为兄弟之国宋每年向辽纳银十万两绢二十万匹。\n\n【后果与影响】澶渊之盟维持了宋辽之间百余年的和平未再发生大规模战争。为宋朝经济文化繁荣创造了长期稳定的外部环境。但岁币制度反映了宋朝在军事上的弱势开启了以金钱买和平的先例。'},
    { name:'王安石变法', year:'1069-1085', description:'宋神宗支持王安石推行青苗法免役法市易法保甲法等变法旨在富国强兵扭转积贫积弱局面。', significance:'北宋规模最大影响最深远的改革运动。虽因保守势力阻挠而失败但其许多理念超越时代。', era:'王安石·宋神宗·司马光', type:'改革', detail:'【背景】北宋立国百余年后面临积贫积弱的困境。财政入不敷出军队战斗力下降官僚机构臃肿。土地兼并严重社会矛盾激化。年轻有为的宋神宗即位后决心变法图强。他召见王安石问安石今欲变法何者为先。王安石回答变风俗立法度最急。\n\n【经过】1069年宋神宗任命王安石为参知政事主持变法。变法内容涉及财政军事教育等多方面：青苗法由政府春夏贷款给农民秋后偿还抑制高利贷；免役法改差役为雇役按户等出役钱；市易法设立市易务平抑物价；方田均税法丈量土地按等征税；保甲法组织民间武装维护地方治安；置将法在军队中设置固定将领加强训练。变法取得了一定成效国家财政收入增加军队战斗力有所提升。但变法遭到以司马光为首的保守派的强烈反对。王安石两度罢相1076年后宋神宗动摇变法逐渐废弛。\n\n【后果与影响】王安石变法是北宋规模最大影响最深远的改革运动。变法虽因保守势力阻挠而未能持续下去但其许多理念如青苗法免役法都超越了时代。王安石与司马光的政争也开启了北宋党争的序幕。苏轼等文人也在新旧党争中起起落落。变法留下的教训和经验对后世改革者具有重要参考价值。'},
    { name:'靖康之变', year:'1127', description:'金军南下攻破北宋都城开封俘虏宋徽宗宋钦宗及赵氏皇族三千余人押送北上北宋灭亡。', significance:'北宋终结的重大国耻。徽钦二帝被俘受尽屈辱成为南宋军民挥之不去的伤痛。', era:'宋徽宗·宋钦宗·金太宗', type:'军事', detail:'【背景】北宋末年政治腐败武备废弛。女真族建立的金国崛起后在1125年灭辽后随即南下侵宋。宋徽宗惊慌失措传位给太子赵桓即宋钦宗。金军第一次围攻开封李纲率军坚守金军退兵。但宋钦宗君臣不修战备反而贬斥李纲等主战派。1126年秋金军再次分两路大举南侵攻破开封。\n\n【经过】1127年金军攻破开封城烧杀抢掠。宋徽宗宋钦宗及后妃皇子公主宗室三千余人被金军俘虏押送北上。皇家府库积蓄被洗劫一空。北宋朝廷府库积攒了一百六十余年的财富被金军全部掠走。徽钦二帝被押解到金国金太宗封宋徽宗为昏德公宋钦宗为重昏侯。两人被囚禁于五国城受尽屈辱最终客死异乡。\n\n【后果与影响】靖康之变是北宋终结的重大国耻。徽钦二帝被俘受尽屈辱的遭遇成为南宋军民挥之不去的伤痛。岳飞在满江红中写道靖康耻犹未雪臣子恨何时灭。靖康之变后宋朝皇室南迁建立南宋中国历史从此进入宋金南北对峙的新阶段。'},
    { name:'岳飞北伐与绍兴和议', year:'1134-1141', description:'岳飞率岳家军北伐金国在郾城颍昌大败金军。被宋高宗十二道金牌召回后以莫须有罪名处死。', significance:'岳飞是中国历史上最著名的民族英雄之一。其悲剧反映了南宋朝廷苟安和内部矛盾。', era:'岳飞·宋高宗·秦桧', type:'军事', detail:'【背景】南宋建立初期金军继续南侵。岳飞等将领率军抵抗屡败金军。岳飞率领的岳家军纪律严明冻死不拆屋饿死不掳掠深受百姓拥护。金军中有撼山易撼岳家军难的说法。1134年岳飞收复襄阳六州受封武昌郡开国侯。1136年岳飞北伐收复洛阳附近州县。\n\n【经过】1140年金朝毁约南侵岳飞率军大举北伐。在郾城之战中岳云率背嵬军大破金军主力铁浮图和拐子马。岳飞进军朱仙镇距离开封仅四十五里。岳飞对部下说直捣黄龙府与诸君痛饮。然而宋高宗连下十二道金牌命令岳飞班师回朝。岳飞悲愤交加叹道十年之功废于一旦。回朝后岳飞被解除兵权。1141年秦桧指使万俟卨等弹劾岳飞以莫须有的罪名将其下狱。1142年岳飞在风波亭被处死年仅三十九岁。其子岳云部将张宪同时被害。\n\n【后果与影响】岳飞是中国历史上最著名的民族英雄之一。其悲剧命运反映了南宋朝廷的苟安和内部矛盾。绍兴和议后南宋向金称臣每年纳贡维持了二十年的和平。岳飞墓前秦桧夫妇万俟卨张俊的铁像跪像成为千古罪人的象征。后世将岳飞的形象不断升华成为忠诚爱国的典范。'},
    { name:'崖山海战', year:'1279', description:'元军与南宋在崖山决战。陆秀夫背负幼帝赵昺投海殉国十数万军民跳海殉国南宋灭亡。', significance:'南宋的终结。中国历史上最悲壮的战役之一。崖山之后无中国的说法广为流传。', era:'陆秀夫·张世杰·文天祥', type:'军事', detail:'【背景】蒙古灭金后大举南侵。南宋在贾似道主政时期节节败退。1276年元军攻破临安南宋朝廷投降。但文天祥陆秀夫张世杰等将领拥立幼帝赵昰赵昺继续抵抗。1278年赵昰病死赵昺继位流亡朝廷退至崖山。\n\n【经过】1279年元将张弘范率水军进攻崖山。张世杰率宋军连船固守。元军封锁海口切断宋军淡水补给。宋军士兵口渴难忍战斗力急剧下降。元军发动总攻宋军大败。陆秀夫见大势已去先逼妻子跳海随后背负八岁的幼帝赵昺投海殉国。赵昺的龙袍中藏有传国玉玺从此失传。十数万军民宁死不降纷纷跳海殉国海面上浮尸无数。\n\n【后果与影响】崖山海战以极其悲壮的方式宣告了南宋的终结。赵宋三百一十九年的国祚就此结束。崖山海战后中华文明第一次整体被北方游牧民族所征服。崖山之后无中国的说法虽不完全准确但反映了这一事件对汉族士人的巨大心理冲击。文天祥绝笔的过零丁洋成为千古绝唱。'},
    { name:'毕昇发明活字印刷', year:'1041-1048', description:'北宋平民毕昇发明胶泥活字印刷术。用胶泥刻字火烧令坚排版印刷为世界上最早的活字印刷技术。', significance:'印刷史上的一次革命。比德国古登堡发明铅活字早四百余年。推动知识文化传播。', era:'毕昇', type:'科技', detail:'【背景】隋唐时期雕版印刷已广泛应用但雕版印刷每印一页书就要雕刻一块版耗费大量人力物力。对于印刷量不大的书籍雕刻整版成本高昂。毕昇是一名普通的雕版印刷工匠在长期实践中思考如何改进印刷技术。\n\n【经过】毕昇用胶泥刻成一个个单字用火烧硬制成活字。排版时将活字排列在铁框内用松脂蜡等粘合固定即可印刷。印完后加热将活字取下可以重复使用。毕昇还试验过木活字但木活字遇水膨胀字迹模糊不如胶泥活字效果好。沈括在梦溪笔谈中详细记录了毕昇的发明。\n\n【后果与影响】活字印刷术是印刷史上的一次革命。毕昇的活字印刷比德国古登堡发明铅活字早了四百余年。活字印刷极大地提高了印刷效率降低了书籍成本推动了知识和文化的广泛传播。毕昇发明的泥活字虽然在后世被木活字铜活字铅活字等取代但其基本原理一直延续到现代印刷技术。'},
    { name:'宋词文学鼎盛', year:'960-1279', description:'两宋时期词文学发展至鼎盛。苏轼开豪放派先河辛弃疾继承发展李清照为婉约派代表。', significance:'宋词与唐诗元曲并称中国文学史上的三座高峰深刻影响了后世审美。', era:'苏轼·辛弃疾·李清照', type:'文化', detail:'【背景】唐代已出现词这种文学形式但到宋代才发展至鼎盛。词最初是配合燕乐演唱的歌词后来逐渐脱离音乐成为独立的文学体裁。宋代城市经济繁荣市民文化发达为词的发展提供了广阔的社会土壤。\n\n【经过】北宋初期词以婉约风格为主代表有晏殊欧阳修柳永等。柳永的词流传极广有水井处即能歌柳词的说法。苏轼突破词的格律束缚开创豪放派词风代表作念奴娇赤壁怀古气势磅礴。北宋末年的周邦彦精通音律使词更加格律化。南宋时期词迎来了第二个高峰。李清照以婉约词风著称被誉为千古第一才女。辛弃疾继承苏轼的豪放风格将爱国情怀融入词中代表作永遇乐京口北固亭怀古。辛弃疾的词慷慨悲壮充满爱国激情。陆游一生写诗九千余首也创作了大量优秀词作。\n\n【后果与影响】宋词与唐诗元曲并称中国文学史上的三座高峰。宋词的艺术成就深刻影响了后世审美。词从民间文学登上了大雅之堂成为中国古典文学的重要体裁。宋代词人的创作至今仍被广泛传诵成为中华文化的瑰宝。'},
  ],
 8: [  // 元
    { name:'成吉思汗统一蒙古', year:'1189-1206', description:'铁木真先后击败蔑儿乞部泰赤乌部札答阑部克烈部乃蛮部统一蒙古高原。1206年被推举为成吉思汗。', significance:'蒙古帝国的建立标志着蒙古民族的形成。千户制怯薛军和蒙古文字的创立为大规模扩张奠定基础。', era:'成吉思汗', type:'军事', detail:'【背景】12世纪末蒙古高原上分布着数十个部落各部族之间相互仇杀混战不休。铁木真9岁时父亲也速该被仇敌毒死部众离散一家人饱受欺凌。铁木真在苦难中成长决心统一各部。\n\n【经过】铁木真先后击败了蔑儿乞部泰赤乌部札答阑部克烈部和乃蛮部逐步统一了蒙古高原。他善于团结盟友分化敌人军事和政治手段并用。1206年铁木真在斡难河源召开忽里勒台大会被各部落推举为成吉思汗。\n\n【后果与影响】蒙古帝国的建立标志着蒙古民族的形成。成吉思汗创立了千户制怯薛军和蒙古文字建立起一套高效的军政体系为后来的大规模扩张奠定了组织和制度基础。'},
    { name:'蒙古西征', year:'1219-1260', description:'成吉思汗及后继者三次大规模西征征服中亚西亚东欧大片领土建立横跨欧亚的蒙古帝国。', significance:'人类历史上连续版图最大的帝国。促进了东西方文明交流但也造成了巨大破坏。四大汗国格局形成。', era:'成吉思汗·拔都·旭烈兀', type:'军事', detail:'【背景】成吉思汗统一蒙古后将扩张目标转向西方。花剌子模帝国杀害蒙古商队和使者成吉思汗以此为借口发动第一次西征。\n\n【经过】第一次西征1219-1224成吉思汗亲率二十万大军西征攻灭花剌子模占领中亚前锋到达印度河流域。第二次西征1235-1242窝阔台派拔都率长子西征服俄罗斯各公国波兰匈牙利保加利亚等地兵锋直指维也纳。第三次西征1253-1260蒙哥派旭烈兀西征攻灭阿拔斯王朝占领巴格达叙利亚等地前锋到达地中海东岸后因蒙哥去世旭烈兀率主力东返。\n\n【后果与影响】蒙古帝国版图横跨欧亚大陆形成了四大汗国金帐汗国察合台汗国窝阔台汗国伊儿汗国加上蒙古本部构成了人类历史上连续版图最大的帝国。西征极大地促进了东西方之间的文化交流但也给被征服地区带来了巨大破坏。'},
    { name:'蒙古灭金', year:'1211-1234', description:'成吉思汗率军伐金在野狐岭大破金军四十万。窝阔台拖雷联宋灭金蔡州城破金朝灭亡。', significance:'金朝灭亡后蒙古取代金朝成为北方主人。联蒙灭金是南宋外交失误失去缓冲屏障后直接暴露在蒙古兵锋之下。', era:'成吉思汗·窝阔台·拖雷', type:'军事', detail:'【背景】金朝长期压迫蒙古各部成吉思汗的祖先曾是金朝藩属并受屈辱。成吉思汗统一蒙古后决心向金朝复仇。1211年成吉思汗率大军南下伐金。\n\n【经过】1211年蒙古军在野狐岭大破金军四十万金朝从此一蹶不振。1213年蒙古军围攻金中都金宣宗被迫求和随后迁都汴京。1230年窝阔台发动灭金总攻。1232年拖雷在三峰山全歼金军主力十五万。1233年蒙古与南宋联军围攻蔡州。1234年正月蔡州城破金哀宗自杀金朝灭亡。\n\n【后果与影响】金朝灭亡蒙古取代金朝成为北方的主人。联蒙灭金是南宋外交上的重大失误失去了金朝这个缓冲屏障后南宋直接暴露在蒙古兵锋之下。'},
    { name:'元朝建立与定都大都', year:'1271-1272', description:'忽必烈取易经大哉乾元之义改国号为大元。刘秉忠主持设计大都规模宏大布局严整。', significance:'元朝的建立标志着蒙古统治者完成了从草原帝国向中原王朝的转型。大都成为当时世界最大城市之一。', era:'忽必烈·刘秉忠', type:'政治', detail:'【背景】忽必烈在击败阿里不哥后决心建立一个以中原为核心的王朝以加强他对汉地统治的合法性。\n\n【经过】1271年忽必烈采纳刘秉忠的建议取易经大哉乾元之义改国号为大元。1272年忽必烈下令将中都改为大都作为元朝的都城。大都由刘秉忠主持设计规模宏大布局规整分为宫城皇城和外城三部分。\n\n【后果与影响】元朝的建立标志着蒙古统治者完成了从草原帝国向中原王朝的转型。大都成为元朝的政治经济文化中心也是当时世界上最大的城市之一。元朝的建立确立了对中国全境的统治权为灭南宋提供了政治基础。'},
    { name:'行省制度', year:'1260-1294', description:'忽必烈在全国设行中书省作为中央派出机构。全国共设十一行省下设路府州县四级。', significance:'行省制度是中国行政制度史上的一大创举被明清继承沿用至今。省作为一级行政区划名称至今沿用。', era:'忽必烈', type:'改革', detail:'【背景】元朝疆域空前辽阔传统的郡县制难以有效管理。忽必烈在前代基础上创造性地建立了行省制度。\n\n【经过】元朝在中央设中书省总理全国政务。在地方设行中书省简称行省作为中央的派出机构。全国共设十一个行省：岭北辽阳河南陕西四川甘肃云南江浙江西湖广征东。行省之下设路府州县四级。\n\n【后果与影响】行省制度是中国行政制度史上的一大创举极大地加强了中央对地方的控制。被明清两朝继承并沿用至今。省作为一级行政区划的名称为什么至今仍在沿用。'},
    { name:'四等人制', year:'1271-1368', description:'元朝将全国臣民分为蒙古人色目人汉人南人四等。四等在仕途法律赋役等方面待遇悬殊。', significance:'激化了民族矛盾是元朝统治不足百年便迅速崩溃的重要原因。但在实际执行中并非铁板一块。', era:'忽必烈', type:'政治', detail:'【背景】元朝统治者作为少数民族为了维护其统治地位在政治和法律上实行民族等级制度。\n\n【经过】元朝将全国人口分为四个等级：一等蒙古人享有最高政治法律特权；二等色目人；三等汉人原金朝统治下的汉族契丹女真等；四等南人原南宋统治下的汉族。不同等级在法律地位做官机会科举名额等方面均有严格区别。汉人和南人不得担任某些高级官职蒙古人杀死汉人只需罚出征而无需偿命。\n\n【后果与影响】四等人制度激化了民族矛盾导致元朝始终未能获得大多数汉族士人的认同。这是元朝统治不足百年便迅速崩溃的重要原因之一。但四等人制度在实际执行中并非铁板一块科举入仕的汉人南人精英仍能在地方和中央担任要职。'},
    { name:'元曲杂剧兴盛', year:'1271-1368', description:'元朝杂剧和散曲达到鼎盛。关汉卿创作窦娥冤等六十余部杂剧王实甫西厢记被誉为天下夺魁。', significance:'元曲与唐诗宋词并称中国文学史上的三座高峰。元杂剧开创了中国戏剧的新纪元。', era:'关汉卿·王实甫·马致远', type:'文化', detail:'【背景】元朝时期城市经济繁荣市民阶层壮大为戏曲文学的发展提供了广阔的社会土壤。元代科举长期停废汉族文人失去进身之阶转而投身杂剧创作。\n\n【经过】元朝杂剧创作达到鼎盛。关汉卿是元曲四大家之首创作杂剧六十余种代表作窦娥冤。王实甫的西厢记被誉为天下夺魁。马致远的天净沙秋思被誉为秋思之祖。白朴郑光祖等也各有传世佳作。杂剧分为旦本（女主角主唱）和末本（男主角主唱）形式灵活生动。\n\n【后果与影响】元曲与唐诗宋词并称中国文学史上的三座高峰。元杂剧开创了中国戏剧的新纪元对明清传奇戏曲和现代戏剧产生了深远影响。元曲以其通俗生动的语言真实反映了元代社会百态具有极高的文学价值和社会价值。'},
    { name:'南坡之变', year:'1323', description:'元英宗推行新政触犯保守派利益。权臣铁木迭儿余党在南坡刺杀英宗英宗改革以失败告终。', significance:'元朝由盛转衰的标志性事件。此后元朝政治日益腐败皇位更迭频繁。', era:'元英宗·铁失', type:'政治', detail:'【背景】元仁宗死后其子元英宗硕德八剌即位。英宗年轻有为锐意改革重用拜住等大臣裁汰冗官推行新政试图扭转元朝的衰落趋势。但改革触动了蒙古旧贵族的利益引发强烈不满。\n\n【经过】御史大夫铁失是已故权臣铁木迭儿的余党对英宗改革极为不满。铁失与晋王也孙铁木儿等密谋发动政变。1323年八月英宗从上都返回大都途经南坡时铁失率人发动突袭。英宗和拜住同时被刺杀英宗年仅二十岁。\n\n【后果与影响】南坡之变是元朝由盛转衰的标志性事件。此后元朝政治日益腐败皇位更迭频繁。铁失等迎立晋王也孙铁木儿为帝即泰定帝。但泰定帝即位后很快诛杀了铁失等政变参与者南坡之变并未给铁失等人带来好下场。'},
    { name:'红巾军起义与元朝灭亡', year:'1351-1368', description:'韩山童刘福通领导红巾军起义提出明王出世口号。朱元璋从红巾军中崛起北伐元朝攻陷大都。', significance:'元末农民大起义最终导致元朝灭亡。朱元璋从红巾军中崛起并建立了明朝。', era:'朱元璋·刘福通·元顺帝', type:'军事', detail:'【背景】元末黄河频繁决口泛滥成灾。1344年黄河在白茅口决口洪水泛滥千里。元顺帝起用贾鲁治河征发民夫十五万军士二万。治河过程中征发百姓克扣工钱百姓怨声载道。同时元朝廷为筹措治河经费加重赋税民不聊生。\n\n【经过】1351年韩山童刘福通在颍州发动起义因头裹红巾称为红巾军。他们以明王出世为号召迅速得到天下响应。朱元璋陈友谅张士诚等皆出自红巾军系统。朱元璋在消灭陈友谅张士诚等南方割据势力后基本统一了南方。1367年朱元璋命徐达常遇春率二十五万大军北伐提出驱除胡虏恢复中华的口号。1368年正月朱元璋在南京称帝建立明朝。同年七月徐达率军攻克大都元顺帝率后妃百官北逃漠北。\n\n【后果与影响】元朝在全国的统治正式结束。元顺帝北逃后史称北元仍沿用元朝国号在漠北存在了三十余年。朱元璋完成了从南到北统一中国的壮举。明朝取代元朝成为中原王朝。元朝从1271年建立起共九十七年。'},
  ],
 9: [  // 明
    { name:'洪武之治', year:'1368-1398', description:'朱元璋推行休养生息政策：奖励垦荒推行屯田兴修水利严惩贪官废除丞相制度。', significance:'使饱经战乱的天下迅速恢复。废除丞相制度加强中央集权但也为宦官专权埋下隐患。', era:'明太祖', type:'政治', detail:'【背景】元末连年战乱社会经济遭到严重破坏。朱元璋出身贫民深知民间疾苦。他提出高筑墙广积粮缓称王的策略在统一全国过程中就开始着手恢复经济。\n\n【经过】朱元璋称帝后推行一系列休养生息政策：奖励垦荒推行军屯商屯减轻赋税兴修水利。他严惩贪官规定官员贪污六十两以上即处剥皮实草之刑共诛杀贪官数万人。1380年以胡惟庸案为借口废除丞相制度六部直接对皇帝负责大大加强了中央集权。同时设置锦衣卫加强监控。\n\n【后果与影响】洪武之治使饱经战乱的天下迅速恢复人口增长经济复苏。但废除丞相制度加强中央集权虽然防止了权臣专政但也为后来宦官专权埋下了制度隐患。朱元璋杀戮功臣虽巩固了皇权但也导致靖难之役时朝廷无将可用的尴尬局面。'},
    { name:'靖难之役', year:'1399-1402', description:'建文帝削藩燕王朱棣以清君侧为名起兵。历时四年攻入南京建文帝失踪。朱棣即位为明成祖。', significance:'明朝最大规模的宗室内战。朱棣迁都北京设立内阁派遣郑和下西洋开创永乐盛世。', era:'朱棣·建文帝', type:'军事', detail:'【背景】朱元璋去世后其孙朱允炆即位即建文帝。建文帝采纳齐泰黄子澄的建议大力削藩周王代王岷王等先后被废。燕王朱棣实力最强在北平镇守北方边境面对削藩压力决定起兵反抗。\n\n【经过】1399年建文帝削藩至燕王朱棣以清君侧为名在北平起兵称其军为靖难之师。战争初期朱棣处于劣势但建文帝优柔寡断朝廷用将不当。朱棣在灵璧之战中击败朝廷主力60万大军。1402年朱棣率军渡江南下攻入南京。宫中火起建文帝下落不明成为千古之谜。朱棣随即即位为明成祖改元永乐。\n\n【后果与影响】靖难之役是明朝最大规模的宗室内战。朱棣即位后迁都北京设立内阁派遣郑和下西洋编纂永乐大典开创了永乐盛世。建文帝的失踪引发了许多民间传说包括他出家为僧等。靖难之役也导致大量忠于建文帝的官员被屠杀。'},
    { name:'郑和下西洋', year:'1405-1433', description:'太监郑和七次率庞大船队远航西洋每次出动船只二百余艘人员二万七千余人最远到达东非。', significance:'世界航海史上的壮举比西方大航海时代早了近百年。后因财政负担过大而终止。', era:'郑和·明成祖', type:'外交', detail:'【背景】明成祖朱棣即位后为了宣扬明朝国威加强与海外各国的联系同时也有寻找建文帝下落的目的决定派遣大型船队远航西洋。\n\n【经过】1405年至1433年间郑和率领庞大船队七次下西洋。每次出动船只二百余艘其中宝船最大者长四十四丈宽十八丈。随行人员包括士兵水手工匠翻译医生等共二万七千余人。船队最远到达东非的木骨都束卜剌哇等地。郑和船队每到一处宣读明朝皇帝诏书赏赐礼物邀请各国遣使来华。\n\n【后果与影响】郑和下西洋是世界航海史上的壮举其船队规模和航行技术远远领先于同时代的欧洲。比哥伦布发现美洲早八十七年。促进了中国与亚非各国的经济文化交流。但每次下西洋耗资巨大明朝财政难以承受。加上儒家官员认为这是劳民伤财的举动后终止了下西洋活动。郑和的航海档案也被销毁是中国航海史的重大损失。'},
    { name:'迁都北京', year:'1421', description:'明成祖决定将都城从南京迁往北京大规模营建紫禁城。1421年正式迁都。', significance:'加强北方边防形成天子守国门格局。北京自此成为中国政治中心长达六百年。', era:'明成祖', type:'政治', detail:'【背景】朱棣在靖难之役前长期镇守北平北平是他的根据地。迁都北平有利于加强对北方蒙古势力的防御更好地控制东北和西北边疆。\n\n【经过】朱棣即位后立即着手营建北京城。在元大都基础上扩建城市修建宫殿。动用工匠三十余万民夫百万。经过十五年的建设紫禁城竣工。1421年明朝正式迁都北京改北平为京师南京改为留都。\n\n【后果与影响】迁都北京加强了北方边防形成了天子守国门的格局。北京自此成为中国的政治中心在此后六百年中一直是中国的首都。营建紫禁城耗费了巨大的人力物力。紫禁城建筑群成为中国古代宫殿建筑的巅峰之作现为世界文化遗产。'},
    { name:'土木堡之变与北京保卫战', year:'1449-1450', description:'明英宗亲征瓦剌在土木堡兵败被俘。于谦力主坚守北京击退瓦剌大军挽救了明朝。', significance:'明朝由盛转衰的重要转折点。于谦的北京保卫战是明朝存亡的关键一战。', era:'明英宗·于谦·王振', type:'军事', detail:'【背景】明英宗朱祁镇年少即位宦官王振专权。北方瓦剌部在也先的领导下强大起来屡次侵扰明朝边境。王振为建立军功怂恿英宗亲征瓦剌。朝臣纷纷劝阻但英宗不听。\n\n【经过】1449年明英宗率五十万大军仓促出征。大军行至大同时王振因担心大军踩踏自家庄稼多次改变行军路线。行至土木堡时被瓦剌大军包围。明军缺水断粮阵脚大乱瓦剌军发动总攻明军大溃英宗被俘。消息传到北京朝野震动。大臣徐珵主张迁都南京。兵部侍郎于谦力排众议坚守北京。于谦调集各地兵力整顿城防亲自督战。瓦剌大军兵临城下于谦率军出城迎战经五天激战击退瓦剌军。\n\n【后果与影响】土木堡之变是明朝由盛转衰的重要转折点。英宗被俘严重打击了明朝威信。于谦领导的北京保卫战成功挽救了明朝使明朝得以延续近二百年。但于谦后来在夺门之变中被冤杀成为千古遗憾。'},
    { name:'《永乐大典》编纂', year:'1403-1408', description:'明成祖命解缙姚广孝等编纂大型类书永乐大典。全书二万二千八百七十七卷约三亿七千万字。', significance:'世界历史上最大的百科全书比大英百科全书早三百余年。正本失传现存仅八百余卷。', era:'解缙·姚广孝', type:'文化', detail:'【背景】明成祖朱棣希望编纂一部大型类书以彰显文治收集天下古今图书便于查阅。同时也借此笼络天下文人巩固统治合法性。\n\n【经过】1403年明成祖命解缙主持编纂起初名为文献大成。成祖不满意规模命姚广孝等重修。召集天下学者二千余人参与编纂。历时五年永乐大典于1408年完成。全书二万二千八百七十七卷目录六十卷分装一万一千零九十五册约三亿七千万字。汇集了上古至明初的图书七八千种内容涵盖经史子集天文地理医药技艺等各个领域。\n\n【后果与影响】永乐大典是世界历史上最大的百科全书比大英百科全书早三百余年卷帙是其数倍。正本在明末失踪传说随嘉靖皇帝殉葬。副本在明清战乱和八国联军入侵中散佚殆尽。现存仅八百余卷散藏于世界各地仅占原书的百分之四。这是中国文化史上最大的损失之一。'},
    { name:'夺门之变', year:'1457', description:'英宗被瓦剌放归后被景泰帝软禁。景泰帝病重时石亨徐有贞等发动政变迎立英宗复位。于谦含冤而死。', significance:'导致一代名臣于谦含冤而死。英宗复位后改变了景泰朝的政策。', era:'明英宗·徐有贞·于谦', type:'政治', detail:'【背景】土木堡之变后于谦等拥立英宗之弟朱祁钰为帝即景泰帝遥尊被俘的英宗为太上皇。瓦剌见英宗已无利用价值将其放归。英宗回到北京后被景泰帝软禁在南宫长达七年。景泰帝病重时无子嗣皇位继承问题浮出水面。\n\n【经过】1457年正月武将石亨大臣徐有贞宦官曹吉祥等密谋迎立英宗复位。十六日夜他们率家兵千余人突入皇宫从南宫迎出英宗。英宗在奉天殿升座敲响钟鼓宣布复位。景泰帝得知后连说好说不久去世。英宗复位后立即以谋逆罪将于谦逮捕下狱。于谦被斩决抄家时家无余财。\n\n【后果与影响】夺门之变导致一代名臣于谦含冤而死。天下人为之痛心。于谦的石灰吟名句粉骨碎身浑不怕要留清白在人间成为千古绝唱。英宗复位后废除了景泰朝的一些政策。但英宗后来也后悔杀害于谦为其平反。夺门之变反映了明朝皇位继承制度的混乱。'},
    { name:'倭寇之乱与戚继光抗倭', year:'1550-1565', description:'明朝东南沿海倭寇猖獗。戚继光组建戚家军发明鸳鸯阵等战术基本平定倭患。', significance:'戚继光是民族英雄。抗倭斗争维护了东南沿海的和平稳定。', era:'戚继光', type:'军事', detail:'【背景】明朝中期海防废弛日本进入战国时代大量溃兵浪人沦为海盗与中国沿海走私商人勾结形成倭寇。倭寇在江浙福建广东沿海烧杀抢掠无恶不作沿海百姓深受其害。\n\n【经过】戚继光被调到浙江抗倭。他招募义乌矿工和农民组建新军训练严格纪律严明被称为戚家军。戚继光根据南方地形发明了鸳鸯阵以十二人为一队长短兵器配合灵活机动。1561年台州大捷九战九胜基本平定浙江倭患。此后戚继光调入福建与俞大猷配合在横屿平海卫等战役中大败倭寇。1565年基本平定东南沿海倭患。\n\n【后果与影响】戚继光是民族英雄戚家军成为抗倭的中坚力量。他的军事思想对后世有重要影响。抗倭斗争的胜利维护了东南沿海的和平稳定。此后明朝加强了海防建设。戚继光后来被调到北方整顿蓟州边防也卓有成效。'},
    { name:'张居正改革', year:'1573-1582', description:'张居正任首辅十年推行一条鞭法改革赋税制度整顿吏治军事使明朝出现中兴气象。', significance:'一条鞭法是中国赋税制度史上的重要改革为后世所沿用。', era:'张居正·万历帝', type:'改革', detail:'【背景】明中期以来财政危机日益严重土地兼并导致国家赋税收入锐减。官员腐败军队战斗力下降。内阁首辅张居正深刻认识到改革势在必行。\n\n【经过】张居正在万历皇帝和太后李太后的支持下推行全面改革。政治上整顿吏治推行考成法严格考核官员政绩。经济上推行一条鞭法将各种赋税徭役合并统一征收白银简化税制减轻农民负担增加财政收入。军事上重用戚继光李成梁等将领加强边防。还整修水利治理黄河。改革取得了显著成效国家财政好转边防巩固出现了万历初年的中兴气象。\n\n【后果与影响】一条鞭法是中国赋税制度史上的重要改革用白银代替实物赋税简化了征收程序对后世影响深远。张居正改革暂时扭转了明朝的衰落趋势。但改革触动了权贵利益张居正死后遭清算改革成果大打折扣。张居正以个人权威推行改革的模式也反映了明朝制度的局限。'},
    { name:'万历怠政与东林党争', year:'1582-1627', description:'万历帝长期不上朝中央官员大量缺额。东林党与阉党激烈斗争严重消耗明朝国力。', significance:'明朝晚期政治腐败的集中体现。史家评论明之亡实亡于万历。党争为明朝灭亡埋下祸根。', era:'明神宗·魏忠贤', type:'政治', detail:'【背景】张居正去世后万历帝朱翊钧摆脱了束缚开始亲政。但他很快对朝政失去兴趣。史书记载万历帝因立太子问题与群臣发生激烈冲突（国本之争）从此以身体不适为由长期不上朝。\n\n【经过】万历帝自1588年开始以病为由不上朝。奏章堆积不批官员缺额不补。六部堂官缺额三分之二各地知府知县大量空缺百姓投诉无门。与此同时东林书院顾宪成等学者讲学议政批评朝政形成东林党。天启年间宦官魏忠贤掌握大权东林党与阉党展开激烈斗争。魏忠贤大肆迫害东林党人杨涟左光斗等被冤杀。崇祯帝即位后铲除魏忠贤但党争并未停止。\n\n【后果与影响】万历怠政严重影响了明朝的行政效率中央与地方管理几乎瘫痪。史家评论明之亡实亡于万历。东林党争严重消耗了明朝的统治力量。朝廷官员不把精力放在治国上而是互相攻击。这种内耗为明朝灭亡埋下了祸根。天灾人祸党争外患交织最终导致了明朝的覆亡。'},
    { name:'甲申之变', year:'1644', description:'李自成大顺军攻入北京崇祯帝在煤山自缢。吴三桂引清军入关清朝定鼎中原。', significance:'明朝灭亡。天灾民变党争女真崛起等多重因素交织导致明朝覆亡。', era:'崇祯帝·李自成·吴三桂', type:'军事', detail:'【背景】崇祯帝在位十七年殚精竭虑但难以挽回明朝颓势。陕北连年大旱饥民遍野以李自成为首的农民起义愈演愈烈。关外后金（清）在皇太极的领导下不断侵扰辽东。朝廷既要剿匪又要抗清两线作战财政枯竭。崇祯帝刚愎自用猜忌大臣先后诛杀袁崇焕等栋梁自毁长城。\n\n【经过】1644年正月李自成在西安建立大顺政权随即东征北京。大顺军一路势如破竹三月攻至北京城下。崇祯帝鸣钟召集百官竟无一人前来。三月十九日李自成攻入北京崇祯帝在煤山自缢身亡留遗书朕非亡国之君而诸臣皆亡国之臣。李自成占据北京后拷打明朝官员追赃助饷。镇守山海关的吴三桂本来准备投降李自成但因李自成部将霸占其爱妾陈圆圆愤而引清军入关。清军在山海关大败李自成军。李自成退回北京匆忙称帝后撤离。清军在摄政王多尔衮率领下进入北京定鼎中原。\n\n【后果与影响】甲申之变标志着明朝的灭亡。天灾人祸党争外患交织最终导致了这个统治中国二百七十六年的王朝覆亡。清朝入主中原后迅速推行汉化政策巩固了统治。南明政权在南方延续了数十年但终被清朝消灭。明朝的灭亡对中国历史产生了深远影响。'},
    { name:'李时珍著《本草纲目》', year:'1552-1578', description:'医药学家李时珍历时二十七年编著本草纲目。收录药物一千八百九十二种附方一万一千余首。', significance:'中国古代最伟大的医药学著作被誉为东方医药巨典。', era:'李时珍', type:'科技', detail:'【背景】李时珍在行医过程中发现前代本草著作存在许多错误和遗漏。他决心编著一部全面准确的本草著作。为此他辞去太医职务深入民间考察足迹遍及大江南北。\n\n【经过】李时珍从1552年开始编纂历时二十七年三易其稿。他参考了八百余种医药著作亲自到各地采药收集民间药方。他鉴别药物品尝药性纠正了前人的许多错误。1578年本草纲目编纂完成全书五十二卷收录药物一千八百九十二种附方一万一千余首并配有精美插图。\n\n【后果与影响】本草纲目是中国古代最伟大的医药学著作被誉为东方医药巨典。它系统地总结了16世纪以前中国的药物学成就对世界医药学产生了重要影响。被翻译成多种文字在全世界传播。李时珍的严谨治学精神和实践方法至今仍值得学习。'},
    { name:'徐光启与利玛窦', year:'1582-1610', description:'意大利传教士利玛窦来华传播西方科学。徐光启与利玛窦合作翻译几何原本等科学著作。', significance:'中西科学交流史上的重要篇章。徐光启引进西方科学知识成为中国近代科学的先驱。', era:'徐光启·利玛窦', type:'科技', detail:'【背景】16世纪欧洲天主教传教士开始进入中国传播天主教。意大利耶稣会传教士利玛窦是其中最杰出的一位。他学习汉语研读儒家经典以学术传教的策略赢得了中国士大夫的尊重。\n\n【经过】利玛窦1582年抵达澳门1601年进入北京。他向明朝朝廷进献自鸣钟世界地图等西方奇物获准在北京居住。利玛窦与徐光启李之藻等中国学者密切合作。徐光启与利玛窦合作翻译了几何原本前六卷将西方几何学系统地引入中国。利玛窦还绘制了坤舆万国全图向中国人展示了世界地理的新知识。他传播了天文历算地理等西方科学知识。\n\n【后果与影响】利玛窦的学术传教为中西文化交流架起了桥梁。利玛窦规矩适应中国文化的传教方式被后来耶稣会士所继承。徐光启引进西方科学知识翻译的几何原本成为中国近代科学的重要启蒙读物。利玛窦徐光启的合作是中西科学交流史上的重要篇章。此后的西学东渐为明末清初的中国带来了新的科学视野。'},
  ],
 10: [  // 清
    { name:'清军入关', year:'1644', description:'摄政王多尔衮率清军在吴三桂引导下入关击败李自成占领北京顺治帝迁都定鼎中原。', significance:'标志着清朝正式成为统治全中国的中央王朝。此后用四十年逐步统一全国。', era:'多尔衮·吴三桂·顺治帝', type:'军事', detail:'【背景】1644年李自成攻占北京崇祯帝自缢明朝灭亡。明将吴三桂镇守山海关李自成招降吴三桂。但李自成部将霸占吴三桂爱妾陈圆圆吴三桂怒而引清军入关。\n\n【经过】清军摄政王多尔衮率军与吴三桂合兵在山海关大败李自成军。李自成退回北京匆忙称帝后撤离。清军进入北京多尔衮为顺治帝举行登基大典定都北京。随后清军南下逐步消灭南明政权和李自成张献忠等势力。\n\n【后果与影响】清军入关标志着清朝正式成为统治全中国的中央王朝。此后用四十年时间逐步统一全国。剃发令等政策引起江南地区激烈抵抗但最终被镇压。清朝的统治持续了二百六十八年对中国历史产生了深远影响。'},
    { name:'平定三藩与统一台湾', year:'1673-1684', description:'康熙帝平定吴三桂等三藩之乱历时八年。1684年收复台湾实现全国统一。', significance:'消除了清朝统一后的最大内部威胁。使中央集权极大加强为康乾盛世奠定基础。', era:'康熙帝·吴三桂·郑成功', type:'军事', detail:'【背景】清朝初年为笼络明朝降将封吴三桂为平西王镇守云南尚可喜为平南王镇守广东耿精忠为靖南王镇守福建。三藩拥兵自重成为清朝心腹大患。\n\n【经过】1673年康熙帝下令撤藩吴三桂率先起兵反清三藩之乱爆发。吴三桂一度占据南方六省但在关键时机犹豫不决。康熙帝调兵遣将历经八年战争最终平定三藩。之后康熙帝着手解决台湾问题。1661年郑成功驱逐荷兰人收复台湾以台湾为反清基地。1683年康熙派施琅率水军攻台郑克塽投降。1684年清政府在台湾设府县正式将台湾纳入版图。\n\n【后果与影响】平定三藩消除了清朝统一后的最大内部威胁。收复台湾实现了全国统一加强了对东南沿海的管理。此后中央集权极大加强为康乾盛世的到来奠定了坚实基础。'},
    { name:'雅克萨之战与尼布楚条约', year:'1685-1689', description:'康熙帝两次围攻侵占黑龙江的沙俄势力。双方签订尼布楚条约确定中俄东段边界。', significance:'清朝早期与西方列强的第一次军事冲突。以外交谈判解决边界问题维持中俄百年和平。', era:'康熙帝', type:'外交', detail:'【背景】清朝入关后沙俄势力趁机侵入黑龙江流域强占雅克萨尼布楚等地筑城殖民。当地百姓深受其害清政府多次交涉无果决定武力驱逐。\n\n【经过】1685年清军水陆并进攻克雅克萨俄军投降。清军撤走后俄军重返雅克萨。1686年清军再次围攻雅克萨。在清军有力打击下沙俄同意谈判。1689年清俄双方在尼布楚签订条约确定以额尔古纳河格尔必齐河和外兴安岭为界整个黑龙江流域归属中国。\n\n【后果与影响】雅克萨之战是清朝早期与西方列强的第一次军事冲突。尼布楚条约是清政府与西方国家签订的第一个平等边界条约。维持了中俄边境百余年的和平。但条约中清政府让出了贝加尔湖以东部分领土也留下了遗憾。'},
    { name:'康乾盛世', year:'1662-1795', description:'康熙雍正乾隆三代皇帝统治时期清朝达到鼎盛。疆域极盛人口增长经济文化繁荣。', significance:'中国历史上时间最长影响最大的盛世之一。奠定了现代中国版图的基础。', era:'康熙帝·雍正帝·乾隆帝', type:'政治', detail:'【背景】经过清初几十年的恢复和发展清朝国力逐渐强盛。康熙帝即位后平定三藩收复台湾统一全国。在此基础上清朝进入了鼎盛时期。\n\n【经过】康乾盛世历经康熙雍正乾隆三朝共一百三十余年。康熙帝平定准噶尔扩张疆域。雍正帝整顿财政推行摊丁入亩改革设立军机处。乾隆帝继承祖业编纂四库全书六次南巡。这一时期清朝疆域达到顶峰西跨葱岭北抵西伯利亚东临太平洋南至南海诸岛。人口从一亿增长到三亿。经济繁荣文化昌盛。\n\n【后果与影响】康乾盛世是中国历史上时间最长影响最大的盛世之一。奠定了现代中国版图的基础。但盛世中也隐藏着危机：闭关锁国政策使中国与西方差距拉大人口快速增长导致资源紧张。乾隆后期和珅专权朝政腐败清朝由盛转衰。西方此时正经历工业革命迅速超越了中国。'},
    { name:'军机处设立与雍正改革', year:'1723-1735', description:'雍正帝设立军机处推行摊丁入亩改革。严厉打击贪腐加强皇权为乾隆盛世奠定基础。', significance:'清朝君主专制达到顶峰。摊丁入亩是中国赋税制度史上的重要改革减轻了无地农民负担。', era:'雍正帝', type:'改革', detail:'【背景】雍正帝胤禛即位时清朝面临严重的财政危机和吏治腐败问题。康熙晚期官员贪腐成风国库空虚。雍正帝决心进行全面改革。\n\n【经过】雍正帝设立了军机处作为核心决策机构皇帝直接指挥各部院运行内阁权力被架空。推行摊丁入亩将丁银并入田赋无地农民不再纳丁税减轻了贫民负担。严厉打击贪腐整顿吏治推行密折制度加强皇权。设立会考府清理财政。在西南地区推行改土归流加强中央对少数民族地区的管理。\n\n【后果与影响】雍正帝的改革取得了显著成效国库充实吏治澄清。军机处制度被清朝沿用近两百年使清朝君主专制达到了顶峰。摊丁入亩是中国赋税制度史上的重要改革减轻了无地农民的负担促进了人口增长。雍正帝的改革为乾隆盛世的到来奠定了坚实基础。'},
    { name:'鸦片战争', year:'1840-1842', description:'英国为保护鸦片贸易发动对华侵略。清军节节败退被迫签订南京条约割让香港开放五口通商。', significance:'中国近代史的开端。中国从此由独立自主的封建国家逐步沦为半殖民地半封建社会。', era:'道光帝·林则徐', type:'军事', detail:'【背景】英国为扭转对华贸易逆差向中国大量走私鸦片危害中国人民健康造成白银大量外流。道光帝派林则徐到广东禁烟林则徐在虎门销毁鸦片二百三十七万斤。英国以此为借口发动侵华战争。\n\n【经过】1840年英国舰队进攻广州厦门定海封锁长江口。清军武器落后指挥混乱节节败退。1842年英军攻陷镇江切断漕运直逼南京。清政府被迫签订南京条约。主要内容包括：开放广州厦门福州宁波上海五口通商；割让香港岛；赔款两千一百万银元；协定关税等。\n\n【后果与影响】鸦片战争是中国近代史的开端。南京条约是中国近代第一个不平等条约。中国从此由独立自主的封建国家逐步沦为半殖民地半封建社会。天朝上国的迷梦被打破刺激了中国人开始向西方学习寻求自强之路。'},
    { name:'太平天国运动', year:'1851-1864', description:'洪秀全创立拜上帝会在广西金田起义建立太平天国定都天京。被曾国藩湘军镇压。', significance:'中国历史上规模最大的农民起义之一。严重动摇清朝统治根基催生地方武装力量。', era:'洪秀全·曾国藩', type:'军事', detail:'【背景】鸦片战争后清政府加重赋税广东广西地区连年灾荒百姓民不聊生。洪秀全屡试不第受基督教影响创立拜上帝会宣传人人平等的思想。\n\n【经过】1851年洪秀全在广西金田村发动起义建立太平天国。太平军迅速发展席卷大半个中国1853年定都天京（南京）。太平天国颁布天朝田亩制度试图实现耕者有其田的理想。但领导层迅速腐化内讧不断天京事变中杨秀清韦昌辉被杀石达开出走。曾国藩组建湘军李鸿章组建淮军与太平军作战。1864年湘军攻破天京太平天国运动失败。\n\n【后果与影响】太平天国运动是中国历史上规模最大的农民起义之一。运动持续十四年席卷十余省导致数千万人死亡。严重动摇了清朝的统治根基。镇压太平天国的过程中曾国藩李鸿章等汉族官员崛起了改变了清朝满族贵族的权力格局。催生了地方武装力量为后来的军阀割据埋下隐患。'},
    { name:'洋务运动与近代化尝试', year:'1861-1894', description:'奕䜣曾国藩李鸿章左宗棠等推行洋务运动创办近代工业建立北洋水师。甲午战争中彻底失败。', significance:'中国近代化的开端。中学为体西学为用的指导思想导致运动失败。甲午战争宣告洋务运动破产。', era:'李鸿章·左宗棠·张之洞', type:'改革', detail:'【背景】第二次鸦片战争中英法联军攻入北京火烧圆明园。清朝统治集团中的有识之士认识到必须学习西方技术以自强。以恭亲王奕䜣和曾国藩李鸿章左宗棠张之洞为代表开始推行洋务运动。\n\n【经过】从1861年起洋务派创办了一批近代军事和民用工业。江南制造局福州船政局天津机器局等军工企业建立。随后发展民用工业如轮船招商局开平矿务局汉阳铁厂等。创办新式学堂派遣留学生赴欧美学习。建立北洋水师和南洋水师北洋水师一度成为亚洲第一舰队。1894年中日甲午战争爆发北洋水师在黄海海战中损失惨重威海卫之战中全军覆没。\n\n【后果与影响】洋务运动是中国近代化的开端。虽然引进了一些西方技术和设备但受限于中学为体西学为用的指导思想没有从根本上改革政治制度。甲午战争的惨败宣告了洋务运动的彻底失败。此后中国进入维新变法和革命的新阶段。'},
    { name:'戊戌变法', year:'1898', description:'光绪帝在康有为梁启超推动下颁布变法诏令。慈禧太后发动政变囚禁光绪帝废除新政变法仅百余天。', significance:'近代中国第一次资产阶级改良运动。虽失败但推动思想启蒙促进了民族觉醒。', era:'光绪帝·康有为·慈禧太后', type:'改革', detail:'【背景】甲午战争惨败后民族危机空前严重。康有为梁启超等维新派上书光绪帝请求变法。1895年公车上书成为维新变法运动的起点。光绪帝决心变法图强。\n\n【经过】1898年6月光绪帝颁布定国是诏开始变法。在康有为梁启超等维新派的推动下颁布了一系列改革诏令涉及经济军事教育等方面：设立京师大学堂废除八股文奖励工商业精简机构等。但变法触动了以慈禧太后为首的保守派的利益。慈禧太后在荣禄等人的支持下于9月21日发动政变囚禁光绪帝于瀛台。慈禧太后宣布重新训政废除新政恢复旧制。康有为梁启超逃亡海外谭嗣同刘光第林旭杨锐杨深秀康广仁六君子被杀害。变法仅持续了103天。\n\n【后果与影响】戊戌变法是近代中国第一次资产阶级改良运动。虽然以失败告终但推动了中国思想启蒙促进了民族觉醒。谭嗣同以死明志留下有心杀贼无力回天的绝命诗激励了后来的革命者。变法失败后清政府进一步走向保守最终被革命推翻。'},
    { name:'义和团与八国联军', year:'1900-1901', description:'义和团扶清灭洋慈禧太后向十一国宣战。八国联军攻入北京签订辛丑条约赔款四亿五千万两。', significance:'清朝彻底沦为洋人朝廷。庚子赔款使中国背负沉重经济负担加速了清朝灭亡。', era:'慈禧太后', type:'军事', detail:'【背景】甲午战后西方教会势力在中国扩张教案频发。山东直隶一带民间秘密组织义和团迅速发展提出扶清灭洋口号攻击外国教堂和教民。地方官员无力镇压慈禧太后决定利用义和团对抗西方。\n\n【经过】1900年义和团进入北京焚烧教堂攻打使馆区。慈禧太后误信义和团刀枪不入的传言向英法德俄美日意奥等十一国宣战。八国联军攻占大沽炮台进逼天津北京。清军和义和团不敌联军。8月联军攻入北京慈禧太后挟光绪帝仓皇西逃至西安。联军在京烧杀抢掠圆明园再遭劫难。1901年清政府签订辛丑条约赔款白银四亿五千万两分三十九年还清本息合计九亿八千万两。清政府承诺惩办主战官员拆除大沽炮台允许外国军队在北京使馆区和京榆铁路沿线驻军。\n\n【后果与影响】辛丑条约是赔款最多的不平等条约。清朝彻底沦为洋人朝廷。庚子赔款使中国背负了沉重的经济负担。慈禧太后此后被迫推行新政但已无力回天。清政府失信于天下加速了灭亡进程。'},
    { name:'辛亥革命与清朝灭亡', year:'1911-1912', description:'武昌起义爆发各省纷纷响应宣布独立。清帝退位结束了两千多年封建帝制中华民国成立。', significance:'结束了两千多年的封建帝制。中华民国成立中国进入新的历史时期。', era:'孙中山·袁世凯·隆裕太后', type:'政治', detail:'【背景】清末新政未能挽救清朝政权。立宪运动失败皇族内阁使汉族官员失望。革命党人多次起义如黄花岗起义虽失败但影响深远。四川保路运动为革命创造了契机。\n\n【经过】1911年10月10日湖北新军在武昌起义占领武昌城各省纷纷响应宣布独立清朝统治土崩瓦解。孙中山从海外回国被推举为临时大总统1912年1月1日在南京宣誓就职中华民国临时政府成立。清政府起用袁世凯镇压革命。袁世凯一面逼清帝退位一面与革命党谈判获取总统职位。2月12日隆裕太后代表宣统帝颁布退位诏书清朝灭亡。袁世凯随后迫使孙中山辞职成为中华民国临时大总统。\n\n【后果与影响】辛亥革命结束了两千多年的封建帝制建立了亚洲第一个民主共和国——中华民国。但革命果实被袁世凯窃取中国进入了军阀混战时期。清朝的灭亡标志着中国封建时代的终结中国从此走上了艰难而曲折的现代化之路。清帝退位后民国政府给予清室优待条件溥仪暂居紫禁城直到1924年被冯玉祥驱逐。'},
    { name:'《四库全书》编纂', year:'1773-1782', description:'乾隆帝命纪昀等编纂四库全书收书三千四百余种近八万卷分经史子集四部。', significance:'中国古代文化集大成之作。保存了大量珍贵典籍但也销毁了大量有碍清朝统治的书籍。', era:'纪晓岚·乾隆帝', type:'文化', detail:'【背景】乾隆帝为了彰显文治收集天下图书编纂一部空前规模的丛书。同时也为了通过编纂活动审查和销毁不利于清朝统治的书籍。\n\n【经过】1773年乾隆帝下令开设四库全书馆以纪昀（纪晓岚）为总纂官召集天下学者三百余人参与编纂。到1782年第一部四库全书完成。全书收录图书三千四百余种近八万卷分经史子集四部装订成三万六千余册。\n\n【后果与影响】四库全书是中国古代文化集大成之作保存了大量珍贵典籍。但在编纂过程中也以违碍悖逆等罪名销毁了大量有碍清朝统治的书籍。据估计被销毁的图书约三千种六七万部超过了收录的数量。因此四库全书编纂被称为中国文化史上的一次浩劫。七部四库全书在战乱中散失严重现存三部半。'},
    { name:'同盟会与三民主义', year:'1905', description:'孙中山在日本东京成立中国同盟会提出驱除鞑虏恢复中华建立民国的革命纲领后发展为三民主义。', significance:'中国近代第一个全国性革命政党。标志着中国民主革命进入有组织的阶段。', era:'孙中山·黄兴·宋教仁', type:'政治', detail:'【背景】20世纪初革命思想在中国迅速传播。孙中山在海外宣传革命积累了丰富的经验和人脉。兴中会华兴会光复会等革命团体各自活动力量分散需要联合起来。\n\n【经过】1905年8月孙中山在日本东京联合兴中会华兴会光复会等革命团体成立中国同盟会。孙中山被推举为总理提出驱除鞑虏恢复中华建立民国的革命纲领。同盟会创办民报作为机关刊物。孙中山在民报发刊词中首次提出民族民权民生三大主义即三民主义。同盟会领导了多次武装起义包括镇南关起义黄花岗起义等为辛亥革命准备了条件。\n\n【后果与影响】同盟会是中国近代第一个全国性革命政党。它的成立标志着中国民主革命进入了有组织有纲领的新阶段。三民主义成为辛亥革命的指导思想对后来的中国政治产生了深远影响。但同盟会组织松散内部派系林立为后来的分裂埋下伏笔。'},
  ],
 11: [  // 三国
    { name:'黄巾起义', year:'184', description:'巨鹿人张角创立太平道发动黄巾军起义。起义军数十万人头裹黄巾席卷八州。东汉调集各州郡镇压虽平定了起义但地方势力坐大。', significance:'黄巾起义标志着东汉末年的开始。此后群雄割据最终导致三国鼎立格局的形成。', era:'张角·曹操·刘备', type:'军事', detail:'【背景】东汉末年土地兼并严重农民大量破产。巨鹿人张角创立太平道以符水治病传教布道，十余年间信徒发展到数十万人。\n\n【经过】184年张角以苍天已死黄天当立岁在甲子天下大吉为口号发动全国性大起义。起义军头裹黄巾称黄巾军声势浩大。朝廷派皇甫嵩朱儁卢植率军镇压，同时放权于各地方政府允许自行募兵剿匪。\n\n【后果与影响】黄巾军因缺乏训练和组织最终被镇压张角病死。但地方豪强在平叛过程中拥兵自重形成割据势力。东汉中央集权名存实亡天下进入群雄割据时代。' },
    { name:'董卓乱政', year:'189-192', description:'大将军何进召董卓入京诛杀宦官，董卓趁机废少帝立献帝独揽朝政。关东诸侯组成联军讨伐董卓。司徒王允设计使吕布杀死董卓。', significance:'董卓乱政彻底瓦解了东汉中央权威，开启了群雄逐鹿的序幕。', era:'董卓·吕布·王允', type:'政治', detail:'【背景】东汉末年宦官与外戚斗争激烈。大将军何进召西凉军阀董卓入京诛杀十常侍。宦官先杀何进，袁绍率军尽诛宦官两千余人。\n\n【经过】董卓率军入京后废少帝刘辩立献帝刘协独揽朝政。他放纵士兵烧杀抢掠淫乱后宫倒行逆施。关东诸侯在曹操袁绍带领下组成联军讨伐董卓。司徒王允利用吕布与董卓的矛盾策动吕布诛杀董卓。\n\n【后果与影响】董卓死后其部将李傕郭汜在贾诩鼓动下反攻长安杀死王允。东汉权威彻底瓦解朝廷丧失对地方的控制，天下进入群雄逐鹿的乱世。' },
    { name:'曹操迎奉天子', year:'196', description:'汉献帝在董承护卫下逃出长安回到洛阳处境艰难。曹操采纳荀彧建议率军到洛阳迎奉天子迁都许昌，从此挟天子以令诸侯。', significance:'曹操获得了政治上的绝对优势可以汉室名义号令天下。此后征讨皆打出天子旗号名正言顺。', era:'曹操·荀彧', type:'政治', detail:'【背景】李傕郭汜内讧汉献帝在董承护卫下逃出长安辗转流离回到洛阳。洛阳已是一片废墟百官以野菜充饥处境极为艰难。\n\n【经过】曹操采纳谋士荀彧建议率军到洛阳将汉献帝迎接到许昌（许都）并迁都于此。曹操被封为大将军武平侯从此以天子名义号令诸侯。在政治上曹操取得了谁也无法比拟的优势地位。\n\n【后果与影响】这是曹操政治生涯中最关键的决策之一。此后曹操征讨四方皆打出奉天子以讨不臣的旗号。刘备孙权等诸侯在政治上始终处于被动地位。' },
    { name:'孙策平定江东', year:'195-200', description:'孙策以父亲旧部为基础渡江，在周瑜张昭辅佐下先后击败刘繇王朗严白虎等势力，短短数年间平定江东六郡。', significance:'奠定了东吴政权的基础，孙策被称为小霸王。200年遇刺身亡将基业交予弟弟孙权。', era:'孙策·周瑜·张昭', type:'军事', detail:'【背景】孙坚死后其长子孙策投靠袁术以父亲旧部为基础请求渡江收复江东故地。袁术支持其过江以牵制扬州地方势力。\n\n【经过】195年孙策渡江在周瑜张昭等人辅佐下先后击败扬州刺史刘繇、会稽太守王朗、吴郡太守严白虎等地方势力。孙策勇猛善战军纪严明迅速平定江东六郡（吴郡会稽丹阳豫章庐陵庐江）。\n\n【后果与影响】孙策奠定了东吴政权的基础被称为小霸王。200年孙策在狩猎时被许贡门客刺成重伤去世年仅二十六岁。遗言内事不决问张昭外事不决问周瑜将基业交给弟弟孙权。' },
    { name:'官渡之战', year:'200', description:'曹操与袁绍在官渡决战。曹操以少胜多以两万兵力击败袁绍十万大军。袁绍败逃两年后病逝曹操基本统一北方。', significance:'中国历史上著名的以少胜多战役。奠定了曹操统一北方的基础袁绍势力彻底瓦解。', era:'曹操·袁绍·许攸', type:'军事', detail:'【背景】曹操迎奉天子后势力迅速壮大控制了黄河以南地区。袁绍占据冀州幽州青州并州四州拥兵十万是北方最强大的军阀。双方决战不可避免。\n\n【经过】200年袁绍率十万大军南下曹操以两三万兵力在官渡对峙。曹操采纳许攸之计亲率五千精骑奇袭乌巢烧毁袁军全部粮草。袁绍军粮尽大溃曹军乘胜追击歼灭袁军主力。\n\n【后果与影响】官渡之战是中国历史上著名的以少胜多战役之一奠定了曹操统一北方的基础。此后曹操逐步消灭袁氏残余势力成为北方最强者为三国鼎立奠定基础。' },
    { name:'曹操北征乌桓', year:'207', description:'袁尚袁熙逃往北方勾结乌桓单于蹋顿。曹操率军出卢龙塞穿越荒漠直抵白狼山，张辽奋勇冲杀斩蹋顿于阵前，乌桓大败降者二十余万。', significance:'曹操彻底平定北方统一黄河流域。此战是曹操最艰险的远征之一。谋士郭嘉在此次征途中病逝曹操极为悲痛。', era:'曹操·张辽·郭嘉', type:'军事', detail:'【背景】官渡战后袁绍病死其子袁尚袁熙逃往北方投奔乌桓单于蹋顿。乌桓屡次侵扰汉朝边境威胁曹操的北方根据地。\n\n【经过】207年五月曹操率军出卢龙塞穿越二百里无水之荒漠出其不意直抵白狼山。乌桓单于蹋顿率数万骑兵迎战。曹操登高望阵见乌桓军阵不整命张辽为先锋突击。张辽奋勇冲杀斩蹋顿于阵前乌桓军大败降者二十余万。\n\n【后果与影响】袁尚袁熙逃往辽东被辽东太守公孙康斩首送献曹操。曹操彻底平定北方统一了黄河流域。谋士郭嘉在此次征途中病逝年仅三十八岁曹操极为悲痛。' },
    { name:'赤壁之战', year:'208', description:'曹操率大军南下。孙权刘备联军在赤壁以火攻大败曹操大军。周瑜为前线总指挥黄盖献火攻计并亲自诈降纵火。', significance:'赤壁之战奠定了三国鼎立的基础。此后曹操退守北方刘备得益州孙权巩固江东。', era:'周瑜·诸葛亮·曹操', type:'军事', detail:'【背景】曹操统一北方后率号称八十三万大军南下欲一举平定江南。荆州刘表病逝其子刘琮投降曹操不战而得荆州。刘备从樊城南撤退守江陵。孙权面临生死存亡的抉择。\n\n【经过】鲁肃和诸葛亮促成孙刘联盟。孙权任命周瑜为大都督率三万精兵与刘备两万兵力联军迎战。周瑜部将黄盖献火攻计并亲自率数十艘装满火油柴草的快船诈降驶入曹军水寨纵火。东风助火势曹军水寨化为火海孙刘联军趁势猛攻曹军大败。\n\n【后果与影响】赤壁之战奠定了三国鼎立的基础。曹操退回北方无力南下。刘备趁机夺取荆州四郡并西进取益州建立蜀汉。孙权巩固了江东基业。三国鼎立局面就此形成。' },
    { name:'刘备借荆州', year:'209-210', description:'赤壁战后曹操占襄阳樊城以北；孙权占南郡；刘备占江南四郡。刘备地小人少向孙权请求借南郡以安身，鲁肃极力劝谏下孙权同意。', significance:'借荆州增强了刘备实力使其得以西进取益州。但成为孙刘矛盾根源最终导致吕蒙袭荆州关羽被杀。', era:'刘备·孙权·鲁肃', type:'政治', detail:'【背景】赤壁之战后荆州被孙刘曹三方瓜分。曹操占襄阳樊城以北；孙权占南郡江陵一带；刘备占江南四郡武陵长沙桂阳零陵。但刘备地小人少不足以立足。\n\n【经过】刘备亲自到京口见孙权请求借南郡江陵以安身。周瑜反对认为这是养虎遗患建议软禁刘备。但鲁肃从战略全局出发力劝孙权借荆州给刘备以巩固孙刘联盟共同对抗曹操。孙权最终采纳鲁肃的建议将南郡借给刘备。\n\n【后果与影响】刘备将治所迁至江陵实力大增得以西进取益州。但借荆州成为此后孙刘矛盾的根源。孙权多次索还荆州刘备推诿不还最终导致吕蒙白衣渡江袭取荆州关羽被杀。' },
    { name:'曹操平定关中', year:'211', description:'马超韩遂联合关中十部据守潼关。曹操用徐晃贾诩之策偷渡黄河又在阵前离间马超韩遂使二人相互猜疑趁其内乱大破关中联军。', significance:'曹操占据关中马超退守陇西后投奔张鲁最终归刘备。韩遂逃往凉州被部将所杀。', era:'曹操·马超·韩遂', type:'军事', detail:'【背景】曹操赤壁败后将矛头转向关中。关中马超韩遂等十部军阀名义上归顺但割据一方。曹操以征讨张鲁为名率军西进。\n\n【经过】211年马超韩遂联合关中十部兵马共十万人据守潼关。曹操强攻不利用贾诩之计派兵从蒲阪津偷渡黄河在渭南扎营。两军对峙时曹操与韩遂在阵前叙旧让马超心生疑忌。曹操随即施反间计离间二人使其相互猜疑。趁其内乱发动总攻大破关中联军。\n\n【后果与影响】曹操占据关中。马超退守陇西后投奔张鲁最终归顺刘备封为五虎上将之一。韩遂逃往凉州后被部将所杀。曹操将西北版图大为扩展。' },
    { name:'关羽北伐与樊城之战', year:'219', description:'关羽率军北伐围困樊城。于禁七军来援遇汉水暴涨关羽水淹七军擒于禁斩庞德威震华夏。曹操联合孙权夹击。', significance:'关羽威震华夏达到其军事生涯巅峰。但后方空虚被吕蒙偷袭荆州腹背受敌兵败被杀。是蜀汉由盛转衰的转折点。', era:'关羽·于禁·吕蒙', type:'军事', detail:'【背景】219年刘备夺取汉中称汉中王封关羽为前将军假节钺镇守荆州。关羽为配合刘备北进率军北伐攻打曹魏据守的襄阳樊城。\n\n【经过】关羽一路势如破竹围困樊城曹仁。曹操派于禁庞德率七军救援。时逢八月暴雨汉水暴涨关羽因势利导水淹七军擒于禁斩庞德威震华夏。曹操一度考虑迁都避其锋芒在司马懿蒋济建议下联合孙权夹击关羽。\n\n【后果与影响】关羽后方空虚孙权派吕蒙白衣渡江袭取荆州。关羽腹背受敌兵败走麦城与长子关平一同被东吴俘杀。关羽之死是蜀汉由盛转衰的转折点。荆州的丢失使诸葛亮隆中对中两路北伐的战略构想彻底无法实现。' },
    { name:'白衣渡江袭荆州', year:'219', description:'吕蒙以治病为名将精兵藏在商船中白衣沿江而上偷袭江陵公安。守将糜芳傅士仁不战而降。吕蒙对百姓秋毫无犯关羽军心瓦解。', significance:'孙权夺取荆州大部占据长江中游战略要地。孙刘联盟彻底破裂。吕蒙战后病重去世。', era:'吕蒙·孙权·关羽', type:'军事', detail:'【背景】鲁肃去世后吕蒙接替其职主张武力夺回荆州。孙权对刘备长期借荆州不还深感不满又见关羽北伐后方空虚决定背弃孙刘联盟与曹操结盟夺取荆州。\n\n【经过】吕蒙以治病为名将精兵藏在商船中身穿白衣扮作商人沿江而上偷袭关羽的江陵公安等后方重镇。守将糜芳傅士仁因与关羽有隙不战而降。吕蒙入城后对百姓秋毫无犯善待关羽将士家属关羽军心动摇士卒离散。\n\n【后果与影响】孙权夺取了荆州大部占据长江中游战略要地。吕蒙在战后病重去世年仅四十二岁。孙权从此拥有了从荆襄到扬州的完整长江防线。孙刘联盟彻底破裂。' },
    { name:'曹丕称帝', year:'220', description:'曹操病逝于洛阳曹丕继承魏王之位。同年十月曹丕逼迫汉献帝刘协禅让正式称帝建国号魏是为魏文帝。东汉灭亡。', significance:'东汉正式灭亡。三国时代正式开始。曹丕建立魏朝定都洛阳追尊曹操为魏武帝。', era:'曹丕·汉献帝', type:'政治', detail:'【背景】220年正月曹操病逝于洛阳终年六十六岁。其子曹丕继承魏王之位在邺城总揽朝政。曹操至死未称帝认为时机未成熟。\n\n【经过】曹丕即位后加紧了代汉的步伐。华歆等大臣逼迫汉献帝禅让。曹丕三次辞让后于220年十月在受禅台正式登基称帝建国号魏改元黄初定都洛阳。汉献帝被封为山阳公汉朝国祚四百余年至此终结。\n\n【后果与影响】东汉正式灭亡。曹魏继承北方正统三国时代正式开始。刘备次年称帝延续汉统。孙权于229年称帝。魏蜀吴三国鼎立格局正式确立。' },
    { name:'刘备称帝', year:'221', description:'曹丕称帝后传闻汉献帝已遇害。诸葛亮等群臣劝进刘备在成都武担山南即皇帝位建国号汉史称蜀汉。', significance:'刘备以继承汉室正统自居蜀汉正式建国。三国鼎立格局最终完成。', era:'刘备·诸葛亮', type:'政治', detail:'【背景】曹丕称帝后蜀中传言汉献帝已被曹丕杀害。作为汉室宗亲刘备认为自己有责任继承汉统延续刘汉国祚。\n\n【经过】诸葛亮等群臣联名上书劝进刘备。221年刘备在成都武担山南即皇帝位建国号汉年号章武。封诸葛亮为丞相立刘禅为太子。刘备以恢复汉室为己任蜀汉政权正式建立。\n\n【后果与影响】蜀汉正式建国三国鼎立格局最终完成。刘备以继承汉室正统自居在政治上取得了与曹魏对等的地位。但蜀汉领土最小人口最少实力最弱。' },
    { name:'夷陵之战', year:'221-222', description:'刘备为关羽报仇亲率大军伐吴。孙权任命陆逊为大都督。陆逊避其锋芒退守夷陵坚壁不出。刘备连营七百里。陆逊火烧连营大破蜀军。', significance:'陆逊一战成名。刘备元气大伤败退白帝城次年病逝。蜀汉成为三国中最弱的一方。', era:'刘备·陆逊', type:'军事', detail:'【背景】219年孙权袭取荆州擒杀关羽。221年刘备称帝后以替关羽报仇为名亲率数万大军伐吴。赵云等老臣反对伐吴但刘备执意出征。\n\n【经过】222年刘备大军出三峡。孙权任命陆逊为大都督率五万吴军迎战。陆逊采取诱敌深入的战略退守夷陵。刘备连营七百里从巫峡至夷陵。两军对峙数月吴军始终不应战。闰六月陆逊见蜀军懈怠下令反攻。命士兵每人持茅草攻入蜀营放火。火势连营陆逊率军猛攻蜀军大败。\n\n【后果与影响】刘备败退白帝城次年病逝托孤于诸葛亮。蜀汉精锐尽失元气大伤成为三国中最弱的一方。陆逊一战成名成为东吴继周瑜吕蒙后的又一杰出统帅。' },
    { name:'诸葛亮北伐', year:'228-234', description:'诸葛亮平定南中稳定内政后五次北伐中原。第一次收降姜维但马谡街亭大败。第二次围攻陈仓郝昭坚守粮尽退。234年十万大军屯五丈原与司马懿对峙百余日病逝。', significance:'诸葛亮以弱国之势主动出击牵制曹魏大量兵力延缓蜀汉灭亡。他的鞠躬尽瘁精神成为千古名臣典范。', era:'诸葛亮·司马懿', type:'军事', detail:'【背景】223年刘备去世刘禅继位诸葛亮受托孤重任。他在平定南中稳定内政后决心北伐中原实现复兴汉室的理想。228年曹魏新帝曹叡即位政局未稳诸葛亮抓住时机出兵。\n\n【经过】228年春第一次北伐出祁山收降姜维。马谡在街亭大败于张郃诸葛亮撤回汉中挥泪斩马谡。同年冬第二次北伐围攻陈仓郝昭坚守二十余日粮尽而退。229年第三次北伐夺取武都阴平二郡。231年第四次北伐与司马懿在祁山对峙因粮尽退军。234年春第五次北伐率十万大军出斜谷屯兵五丈原与司马懿对峙百余日设计求战不得。八月诸葛亮病逝五丈原军帐中。\n\n【后果与影响】诸葛亮五次北伐均未能实现出祁山取长安的战略目标。但他以弱国之势主动出击牵制了曹魏大量兵力延缓了蜀汉的灭亡。诸葛亮去世后姜维继承其遗志继续北伐。鞠躬尽瘁死而后已成为千古名臣的典范。' },
    { name:'孙权称帝', year:'229', description:'孙权在武昌正式称帝建国号吴。蜀汉派陈震前来祝贺孙权与蜀汉重新缔结盟约约定中分天下。随后孙权迁都建业。', significance:'三国正式进入三帝并立的阶段。形成了长达四十余年的稳定对峙局面。', era:'孙权', type:'政治', detail:'【背景】曹丕和刘备先后称帝后孙权一直以吴王身份统治江东。至229年孙权认为时机成熟决定正式称帝确立东吴的正统地位。\n\n【经过】229年孙权在武昌今鄂州正式称帝建国号吴改元黄龙。蜀汉派陈震前来祝贺。孙权与蜀汉重新缔结盟约约定中分天下以函谷关为界西属蜀东属吴。随后孙权迁都建业今南京。\n\n【后果与影响】三国正式进入三帝并立的阶段。孙权是三国时期在位最久的统治者从200年接掌江东至252年去世统治长达五十二年。蜀吴联盟重新巩固形成了长达四十余年的稳定对峙局面。' },
    { name:'高平陵之变', year:'249', description:'曹爽陪同魏帝曹芳出城祭扫高平陵。司马懿趁机在洛阳发动政变控制京城。曹爽犹豫不决最终投降。司马懿以谋反罪诛杀曹爽及其党羽夷灭三族。', significance:'曹魏大权从此落入司马氏手中。司马懿以诈病赚曹爽赢得了政变成功。为西晋代魏奠定了基础。', era:'司马懿·曹爽', type:'政治', detail:'【背景】魏明帝曹叡临终前任命司马懿和曹爽为辅政大臣。曹爽排挤司马懿独揽大权。司马懿称病不出暗中谋划政变。曹爽派亲信李胜刺探司马懿假装老病昏聩麻痹曹爽。\n\n【经过】249年正月曹爽陪同魏帝曹芳出洛阳城祭扫高平陵。司马懿突然在洛阳发动政变关闭城门占领武库控制京城和太后。曹爽犹豫不决不听桓范劝告挟持皇帝到许昌的建议最终选择投降。司马懿以谋反罪将曹爽及其党羽全部处死夷灭三族。\n\n【后果与影响】曹魏大权从此落入司马氏手中。司马懿以诈病赚曹爽的计谋成为中国历史上最经典的政治权谋之一。此后司马懿司马师司马昭父子相继掌握曹魏大权为西晋代魏全部清除了障碍。' },
    { name:'邓艾偷渡阴平', year:'263', description:'司马昭命钟会邓艾分兵伐蜀。姜维退守剑阁与钟会对峙。邓艾率军从阴平道无人山区凿山开路七百里如天降般出现在江油。诸葛瞻战死绵竹邓艾兵临成都。', significance:'邓艾的军事奇谋决定了蜀汉的命运。刘禅开城投降蜀汉灭亡。三国鼎立从此打破。', era:'邓艾·姜维·刘禅', type:'军事', detail:'【背景】司马昭为建立军功为代魏做准备决定伐蜀。263年命钟会为主将邓艾诸葛绪分兵并进。钟会率主力攻取汉中姜维退守剑阁与钟会对峙。\n\n【经过】邓艾提出奇袭之策率军从阴平道穿行无人山区七百里。凿山开路遇断崖则裹毡滚下全军如天降一般突然出现在江油。蜀将马邈投降邓艾随即进军绵竹。蜀汉派诸葛瞻率军迎战诸葛瞻战死绵竹。邓艾兵临成都刘禅开城投降蜀汉灭亡。\n\n【后果与影响】邓艾的偷渡阴平是中国军事史上最经典的奇袭之一。蜀汉历经二帝四十三年而亡。此间乐不思蜀成为刘禅的典故。司马昭灭蜀后声望大增为其子司马炎代魏建晋铺平了道路。' },
    { name:'钟会之乱与姜维复国', year:'264', description:'灭蜀后钟会野心膨胀欲据蜀中立。姜维假意投靠想借钟会之手复辟蜀汉。魏军将士不愿反叛发动兵变钟会姜维均在混战中被杀。', significance:'姜维复国计划失败蜀汉再无复兴之望。姜维以死报国完成了最后的忠义。', era:'钟会·姜维', type:'军事', detail:'【背景】邓艾偷渡阴平灭蜀后居功自傲。钟会嫉妒邓艾的功劳向司马昭诬告邓艾谋反。司马昭下令逮捕邓艾钟会独揽伐蜀大军。\n\n【经过】钟会自恃功高又有姜维的鼓动决意据蜀中自立建立割据政权。姜维假意投靠钟会秘密写信给刘禅希望等待时机复辟蜀汉。264年正月钟会在成都宣布反叛司马昭扣押了魏军将领。但魏军将士不愿反叛在监军卫瓘指挥下发动兵变。钟会姜维均在混战中被杀。\n\n【后果与影响】姜维的复国计划失败蜀汉再无复兴之望。姜维以死报国虽未成功但完成了最后的忠义。成都陷入短暂混乱但很快被魏军平定。司马昭彻底掌控了局势。' },
    { name:'西晋灭吴', year:'280', description:'晋武帝司马炎派六路大军伐吴。吴主孙皓投降东吴灭亡。三国归晋全国重新统一。', significance:'结束了自东汉末年以来近百年的分裂局面。三国时代正式结束西晋统一全国。', era:'司马炎·孙皓', type:'军事', detail:'【背景】265年司马炎代魏建晋后积极筹备灭吴统一全国。东吴孙皓统治残暴民不聊生吴国国力衰弱。晋朝经过十余年准备造船练兵储备粮草。\n\n【经过】279年十一月司马炎发兵二十万分六路大举伐吴。晋军水陆并进突破长江天险。吴军防线迅速崩溃吴主孙皓投降。280年三月吴国灭亡。\n\n【后果与影响】结束了自东汉末年以来近百年的分裂局面。三国时代正式结束西晋统一全国。但西晋的统一仅维持了三十余年就陷入八王之乱。此后中国进入更为动荡的南北朝时代。' },
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
const treeCollapsed = ref(true)
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
    // Load stored members + local figures with dedup
    const localFigs = getHistoricalFigures(id)
    const parsed = detail.value.description ? JSON.parse(detail.value.description) : {}
    const storedFigs = parsed.storedMembers || []
    const allMembers = mergeMembers([...storedFigs, ...localFigs])
    if (allMembers.length > 0) {
      detail.value.members = mergeMembers([...(detail.value.members || []), ...allMembers])
    }
    loading.value = false
  } catch (e) {
    error.value = '加载失败，请稍后重试'
    loading.value = false
    return
  }
  const handleScroll = () => {
    const ids = ['profile', 'origins', 'founding', 'zenith', 'members', 'decline', 'rulers', 'children', 'events', 'tree']
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




.collapse-btn {
  display: inline-block; margin-left: 10px; padding: 2px 10px;
  font-size: 0.72rem; background: var(--color-card);
  border: 1px solid var(--color-border); border-radius: 4px;
  color: var(--color-text-muted); cursor: pointer;
  transition: all 0.2s ease; vertical-align: middle; line-height: 1.6;
}
.collapse-btn:hover { background: var(--color-oat); color: var(--color-terracotta); border-color: var(--color-terracotta); }
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
