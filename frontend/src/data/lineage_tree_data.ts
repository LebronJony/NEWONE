// 子嗣家族树 — 名人的后代分层展示
// key: "rulerId_childName"

export interface LineageTreeNode {
  name: string;
  title: string;
  note?: string;
  children?: LineageTreeNode[];
}

export const LINEAGE_TREE: Record<string, LineageTreeNode[]> = {
  '111_李承乾': [
    { name:'李象', title:'嗣濮王', children: [
      { name:'李适之', title:'左相', note:'饮中八仙之一' }
    ]}
  ],
  '111_李泰': [
    { name:'李欣', title:'濮王', children: [
      { name:'李峄', title:'袭濮王爵' },
      { name:'李邕', title:'书法家', note:'唐代著名书法家' }
    ]},
    { name:'李泰一支', title:'延续至唐末', note:'宗室地位渐衰' }
  ],
  '111_李恪': [
    { name:'李仁', title:'吴王', children: [
      { name:'李祎', title:'信安郡王', note:'玄宗朝名将' }
    ]},
    { name:'李玮', title:'吴王' }
  ],
  '111_李治': [
    { name:'李显', title:'唐中宗', note:'神龙政变复位' },
    { name:'李旦', title:'唐睿宗', note:'禅位于玄宗' },
    { name:'李隆基', title:'唐玄宗', note:'开元盛世', children: [
      { name:'唐诸帝', title:'延续至唐末' }
    ]}
  ],
  '135_朱标': [
    { name:'朱允炆', title:'建文帝', note:'靖难之役失位' },
    { name:'朱文圭', title:'废太子', note:'被囚五十年' }
  ],
  '135_朱棣': [
    { name:'朱高炽', title:'明仁宗', note:'仁宣之治' },
    { name:'朱瞻基', title:'明宣宗' },
    { name:'明朝诸帝', title:'延续至崇祯' }
  ],
  '135_朱权': [ { name:'朱宸濠', title:'宁王', note:'正德间起兵被王阳明平定' } ],
  '135_朱檀': [
    { name:'朱肇煇', title:'鲁王', children: [
      { name:'鲁藩诸王', title:'传十世至南明', note:'朱以海监国抗清' }
    ]}
  ],
  '149_胤礽': [ { name:'弘皙', title:'理亲王', note:'雍正年间被削爵' } ],
  '149_胤禛': [
    { name:'弘历', title:'乾隆帝' },
    { name:'清朝诸帝', title:'传至宣统' }
  ],
  '149_胤祥': [
    { name:'弘晓', title:'怡亲王', note:'铁帽子王', children: [
      { name:'载垣', title:'怡亲王', note:'咸丰朝顾命八大臣' }
    ]}
  ],
  '151_永琪': [ { name:'绵亿', title:'荣亲王' } ],
  '151_永瑆': [ { name:'绵勤', title:'成亲王', note:'以书法闻名' } ],
  '82_刘肥': [
    { name:'刘襄', title:'齐哀王', note:'起兵诛吕氏' },
    { name:'刘章', title:'城阳景王', note:'诛吕有功', children: [
      { name:'刘馥', title:'曹魏扬州刺史', note:'三国名臣' }
    ]}
  ],
  '86_刘据': [
    { name:'刘进', title:'史皇孙', children: [
      { name:'刘询', title:'汉宣帝', note:'孝宣中兴' }
    ]}
  ],
  '108_杨昭': [ { name:'杨侑', title:'隋恭帝', note:'被李渊立为傀儡' } ],
  '112_李贤': [
    { name:'李光顺', title:'安乐王' },
    { name:'李守礼', title:'邠王', note:'玄宗朝以长寿闻名' }
  ],
  '119_赵德昭': [
    { name:'赵惟吉', title:'冀王', children: [
      { name:'赵昀', title:'宋理宗', note:'德昭九世孙' }
    ]}
  ],
  '119_赵德芳': [
    { name:'赵惟正', title:'同安郡王', children: [
      { name:'赵昚', title:'宋孝宗', note:'德芳六世孙' }
    ]}
  ],
  '146_褚英': [ { name:'尼堪', title:'敬谨亲王', note:'清初战将' } ],
  '146_代善': [
    { name:'岳托', title:'克勤郡王', note:'铁帽子王' },
    { name:'萨哈璘', title:'颖亲王' }
  ],
  '153_奕䜣': [
    { name:'载澄', title:'恭亲王' },
    { name:'溥伟', title:'恭亲王', note:'清末民初活跃' }
  ],
  '153_奕譞': [
    { name:'载湉', title:'光绪帝' },
    { name:'载沣', title:'摄政王', note:'宣统帝生父' }
  ],
 '129_真金': [
   { name:'铁穆耳', title:'元成宗' },
   { name:'答剌麻八剌', title:'裕宗(追尊)', children: [
     { name:'海山', title:'元武宗' },
     { name:'爱育黎拔力八达', title:'元仁宗' }
   ]}
 ],

  // ===== 唐朝补充皇帝子嗣树 =====
  '164_李成器（李宪）': [
    { name:'李象', title:'嗣濮王', children: [
      { name:'李适之', title:'左相', note:'饮中八仙之一' }
    ]}
  ],
  '164_李范': [
    { name:'李瑾', title:'岐王', children: [
      { name:'李弁', title:'唐州刺史' }
    ]}
  ],
  '164_李业': [
    { name:'李琄', title:'薛王' }
  ],
  '165_李适': [
    { name:'李诵', title:'唐顺宗', note:'永贞革新', children: [
      { name:'李纯', title:'唐宪宗', note:'元和中兴', children: [
        { name:'唐中后期诸帝', title:'延续至唐末' }
      ]}
    ]}
  ],
  '166_李诵': [
    { name:'李纯', title:'唐宪宗', note:'元和中兴', children: [
      { name:'唐中后期诸帝', title:'延续至唐末' }
    ]}
  ],
  '168_李昂': [
    { name:'李永', title:'庄恪太子', note:'抑郁而终，文宗无后' }
  ],
  '172_李儇': [
    { name:'（无子）', title:'', note:'僖宗无子，由其弟昭宗继位' }
  ],
  '172_李晔': [
    { name:'李裕', title:'德王', note:'被朱温溺杀' },
    { name:'李柷', title:'唐哀帝', note:'禅让后被鸩杀' }
  ],
  '174_李裕': [
    { name:'（无子）', title:'', note:'被朱温溺杀，无后' }
  ],
  '174_李柷': [
    { name:'（无子）', title:'', note:'唐末帝无嗣，唐朝绝统' }
  ],

  // ===== 汉朝补充皇帝子嗣树 =====
  '175_刘康': [
    { name:'刘欣', title:'汉哀帝', note:'无子' }
  ],
  '179_刘庆': [
    { name:'刘祜', title:'汉安帝', note:'孝和帝之孙，庆之孙' }
  ],
  '182_刘协': [
    { name:'汉献帝子', title:'山阳公', note:'曹魏时期以公侯延续数代' }
  ],

  // ===== 明朝补充皇帝子嗣树 =====
  '184_朱翊钧': [
    { name:'朱常洛', title:'明光宗', note:'在位仅一月', children: [
      { name:'朱由校', title:'明熹宗', note:'木工皇帝' },
      { name:'朱由检', title:'明思宗', note:'崇祯帝，自缢煤山' }
    ]}
  ],
  '184_朱翊镠': [
    { name:'朱常淓', title:'潞王', note:'南明监国降清' }
  ],
  '185_朱由校': [
    { name:'（三子皆早夭）', title:'', note:'无存活子嗣，由其弟继位' }
  ],
  '185_朱由检': [
    { name:'朱慈烺', title:'太子', note:'南明时被清军杀害' }
  ],

  // ===== 宋朝补充皇帝子嗣树 =====
  '187_赵顼': [
    { name:'赵煦', title:'宋哲宗', note:'恢复新法', children: [
      { name:'赵佶', title:'宋徽宗', note:'靖康之耻' }
    ]}
  ],
  '187_赵颢': [
    { name:'岐王子孙', title:'北宋宗室', note:'靖康后南迁' }
  ],
  '187_赵頵': [
    { name:'嘉王子孙', title:'北宋宗室', note:'靖康后南迁' }
  ],
};
