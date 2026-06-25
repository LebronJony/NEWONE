// 各朝代著名历史人物数据（非帝王）
// 补全 API 中未包含的人物

import type { RoyalMember } from '../types'

export const HISTORICAL_FIGURES: Record<number, Omit<RoyalMember, 'id'>[]> = {
  1: [
    { dynastyId:1, name:'商鞅', title:'秦孝公时期变法者', lifespan:'约前395-前338', role:'改革家', description:'卫国贵族后裔，在秦孝公支持下推行商鞅变法，使秦国强大。内容包括废井田、开阡陌、奖励军功、推行县制。后因得罪贵族被车裂而死' },
    { dynastyId:1, name:'吕不韦', title:'秦国丞相', lifespan:'约前292-前235', role:'政治家', description:'卫国商人出身，奇货可居辅佐异人成为秦庄襄王。组织门客编纂《吕氏春秋》，对秦统一有重要贡献' },
    { dynastyId:1, name:'王翦', title:'秦国大将', lifespan:'生卒不详', role:'大将', description:'频阳东乡人，与白起并称秦朝两大名将。率军灭赵、燕、楚三国，为秦统一立下赫赫战功' },
    { dynastyId:1, name:'蒙恬', title:'秦朝大将', lifespan:'约前250-前210', role:'大将', description:'出身名将世家，率三十万大军北击匈奴，修筑长城。扶苏被赐死后，蒙恬也被逼自杀' },
  ],
  2: [
    { dynastyId:2, name:'萧何', title:'汉初丞相', lifespan:'前257-前193', role:'宰相', description:'沛县人，刘邦同乡。楚汉战争中留守关中保障后勤。汉朝建立后制定律令制度，推行与民休息政策' },
    { dynastyId:2, name:'张良', title:'汉初谋士', lifespan:'约前250-前186', role:'谋士', description:'韩国贵族后裔，辅佐刘邦统一天下。运筹帷幄之中、决胜千里之外。功成身退' },
    { dynastyId:2, name:'韩信', title:'汉初名将', lifespan:'约前231-前196', role:'大将', description:'淮阴人，明修栈道暗度陈仓、背水一战等经典战例创造者。封楚王，后被吕后诛杀' },
    { dynastyId:2, name:'卫青', title:'汉武帝时期大将', lifespan:'？-前106', role:'大将', description:'卫皇后异父弟，七次出击匈奴，收复河套地区，官至大司马大将军。为人谦逊仁爱' },
    { dynastyId:2, name:'霍去病', title:'汉武帝时期名将', lifespan:'前140-前117', role:'大将', description:'卫青外甥，十八岁随军出征匈奴。封狼居胥山，成就中国武将最高荣誉。二十四岁英年早逝' },
    { dynastyId:2, name:'司马迁', title:'西汉史学家', lifespan:'约前145-前86', role:'史学家', description:'继承父志编纂《史记》。因李陵之祸受宫刑，忍辱负重完成中国第一部纪传体通史' },
    { dynastyId:2, name:'董仲舒', title:'西汉哲学家', lifespan:'前179-前104', role:'哲学家', description:'专治《春秋公羊传》。提出"天人感应""大一统"理论，建议汉武帝"罢黜百家，独尊儒术"', },
    { dynastyId:2, name:'张骞', title:'西汉外交家', lifespan:'约前164-前114', role:'外交家', description:'奉汉武帝之命两次出使西域。被匈奴扣留十余年，开辟了丝绸之路' },
    { dynastyId:2, name:'蔡伦', title:'东汉发明家', lifespan:'约63-121', role:'发明家', description:'总结前人经验改进造纸术，造出"蔡侯纸"。其造纸术后来传入世界各地' },
    { dynastyId:2, name:'华佗', title:'东汉医学家', lifespan:'约145-208', role:'医学家', description:'精通内外妇儿各科。发明麻沸散进行外科手术，创编五禽戏。后为曹操所杀' },
    { dynastyId:2, name:'张衡', title:'东汉科学家', lifespan:'78-139', role:'科学家', description:'精通天文历算。发明了世界上第一台地动仪，还制造了浑天仪' },
    { dynastyId:2, name:'诸葛亮', title:'三国蜀汉政治家', lifespan:'181-234', role:'政治家', description:'隐居隆中，刘备三顾茅庐请其出山。辅佐刘备建立蜀汉，五次北伐，鞠躬尽瘁' },
    { dynastyId:2, name:'关羽', title:'三国蜀汉名将', lifespan:'？-220', role:'大将', description:'与刘备张飞桃园结义。温酒斩华雄、过五关斩六将、水淹七军威震华夏' },
  ],
  3: [
    { dynastyId:3, name:'王导', title:'东晋名臣', lifespan:'276-339', role:'政治家', description:'辅佐司马睿建立东晋。提出"戮力王室、克复神州"口号。王氏家族在东晋权势极重' },
    { dynastyId:3, name:'谢安', title:'东晋名相', lifespan:'320-385', role:'宰相', description:'淝水之战中指挥若定，以少胜多大败前秦军队，保住东晋江山' },
    { dynastyId:3, name:'王羲之', title:'东晋书法家', lifespan:'303-361', role:'书法家', description:'书法精绝，被誉为"书圣"。代表作《兰亭序》被称为"天下第一行书"' },
    { dynastyId:3, name:'陶渊明', title:'东晋诗人', lifespan:'约365-427', role:'诗人', description:'曾任彭泽县令八十余日即辞官归隐。开创田园诗派，代表作《桃花源记》' },
  ],
  4: [
    { dynastyId:4, name:'谢灵运', title:'南朝诗人', lifespan:'385-433', role:'诗人', description:'谢玄之孙。开创山水诗派，与陶渊明并称"陶谢"。恃才傲物，终因谋反被诛' },
    { dynastyId:4, name:'祖冲之', title:'南朝数学家', lifespan:'429-500', role:'科学家', description:'精于天文历算。将圆周率精确到小数点后七位，领先世界近千年。编制《大明历》' },
  ],
  5: [
    { dynastyId:5, name:'宇文恺', title:'隋朝建筑家', lifespan:'555-612', role:'科学家', description:'鲜卑人，隋朝著名建筑家。主持修建大兴城（长安）、洛阳城，设计大运河工程' },
  ],
  6: [
    { dynastyId:6, name:'魏征', title:'唐初名相', lifespan:'580-643', role:'宰相', description:'以直言敢谏闻名，先后向唐太宗进谏二百余事，被太宗视为"人镜"' },
    { dynastyId:6, name:'房玄龄', title:'唐初名相', lifespan:'579-648', role:'宰相', description:'参与玄武门之变。任宰相二十年，与杜如晦并称"房谋杜断"' },
    { dynastyId:6, name:'杜如晦', title:'唐初名相', lifespan:'585-630', role:'宰相', description:'李世民的重要谋臣。善于决断，与房玄龄配合默契。凌烟阁二十四功臣之一' },
    { dynastyId:6, name:'长孙无忌', title:'唐初政治家', lifespan:'594-659', role:'政治家', description:'长孙皇后之兄，凌烟阁功臣第一位。高宗时期因反对立武则天为后被贬自杀' },
    { dynastyId:6, name:'李白', title:'唐代诗人', lifespan:'701-762', role:'诗人', description:'诗风豪放飘逸，被誉为"诗仙"。存世诗文千余篇，代表作《望庐山瀑布》《将进酒》' },
    { dynastyId:6, name:'杜甫', title:'唐代诗人', lifespan:'712-770', role:'诗人', description:'诗风沉郁顿挫，被誉为"诗圣"。历经安史之乱，作品反映民间疾苦' },
    { dynastyId:6, name:'白居易', title:'唐代诗人', lifespan:'772-846', role:'诗人', description:'倡导新乐府运动。诗风通俗平易，代表作《长恨歌》《琵琶行》' },
    { dynastyId:6, name:'吴道子', title:'唐代画家', lifespan:'约680-759', role:'画家', description:'被誉为"画圣"。所绘人物衣带飘举，被誉为"吴带当风"' },
    { dynastyId:6, name:'颜真卿', title:'唐代书法家', lifespan:'709-784', role:'书法家', description:'安史之乱中率军平叛。书法创"颜体"，与柳公权并称"颜筋柳骨"' },
    { dynastyId:6, name:'狄仁杰', title:'唐代名相', lifespan:'630-700', role:'宰相', description:'以断案如神著称。武则天时期任宰相，多次劝谏恢复李唐正统' },
    { dynastyId:6, name:'上官婉儿', title:'唐代女官', lifespan:'664-710', role:'政治家', description:'武则天时期掌管诏命，有"巾帼宰相"之称。唐隆政变中被李隆基所杀' },
    { dynastyId:6, name:'孙思邈', title:'唐代医学家', lifespan:'约541-682', role:'医学家', description:'博通百家学说。著《千金要方》《千金翼方》，被尊为"药王"。享年百余岁' },
  ],
  7: [
    { dynastyId:7, name:'王安石', title:'北宋改革家', lifespan:'1021-1086', role:'改革家', description:'神宗时期推行变法。推行青苗法、免役法等，力图富国强兵。晚年退居江宁' },
    { dynastyId:7, name:'苏轼', title:'北宋文学家', lifespan:'1037-1101', role:'文学家', description:'诗词文赋书画俱佳。代表作《赤壁赋》《水调歌头》。号东坡居士' },
    { dynastyId:7, name:'岳飞', title:'南宋名将', lifespan:'1103-1142', role:'大将', description:'精忠报国。率领岳家军北伐金国，收复大片失地。被秦桧以"莫须有"罪名害死' },
    { dynastyId:7, name:'李清照', title:'南宋词人', lifespan:'1084-约1155', role:'词人', description:'号易安居士。婉约词派代表，代表作《声声慢》。前期多写悠闲生活，后期多悲叹身世' },
    { dynastyId:7, name:'沈括', title:'北宋科学家', lifespan:'1031-1095', role:'科学家', description:'博学多才。著《梦溪笔谈》，涉及天文、数学、物理、地质等' },
    { dynastyId:7, name:'毕昇', title:'北宋发明家', lifespan:'约970-1051', role:'发明家', description:'活字印刷术的发明者。用胶泥制作活字排印，比德国古登堡早四百年' },
    { dynastyId:7, name:'辛弃疾', title:'南宋词人', lifespan:'1140-1207', role:'词人', description:'豪放派词人代表。曾任抗金将领，力主北伐。词风雄浑豪放，与苏轼并称"苏辛"' },
    { dynastyId:7, name:'欧阳修', title:'北宋文学家', lifespan:'1007-1072', role:'文学家', description:'号醉翁。北宋古文运动领袖，位列"唐宋八大家"。主持修《新唐书》《新五代史》' },
  ],
  8: [
    { dynastyId:8, name:'关汉卿', title:'元代戏剧家', lifespan:'约1234-约1300', role:'戏剧家', description:'元曲四大家之首。创作杂剧六十余种，代表作《窦娥冤》。被誉为"东方莎士比亚"' },
    { dynastyId:8, name:'郭守敬', title:'元代天文学家', lifespan:'1231-1316', role:'天文学家', description:'精通天文水利。编制《授时历》，精确度领先世界。主持修建通惠河' },
    { dynastyId:8, name:'黄道婆', title:'元代女纺织家', lifespan:'约1245-？', role:'发明家', description:'幼年流落崖州学习黎族纺织技术。回乡后改进纺织工具，推动江南纺织业发展' },
    { dynastyId:8, name:'马致远', title:'元代戏曲家', lifespan:'约1251-1321', role:'戏剧家', description:'号东篱，元曲四大家之一。代表作《天净沙·秋思》被誉为"秋思之祖"' },
  ],
  9: [
    { dynastyId:9, name:'郑和', title:'明代航海家', lifespan:'1371-1433', role:'航海家', description:'七次率舰队远航西洋，最远到达东非。船队规模远超当时欧洲航海家' },
    { dynastyId:9, name:'李时珍', title:'明代医学家', lifespan:'1518-1593', role:'医学家', description:'历经二十七年编纂《本草纲目》，收录药物一千八百余种，被誉为"东方医药巨典"' },
    { dynastyId:9, name:'戚继光', title:'明代抗倭名将', lifespan:'1528-1588', role:'大将', description:'组建戚家军抗击倭寇。发明鸳鸯阵等战术，东南沿海倭患基本平定' },
    { dynastyId:9, name:'张居正', title:'明代改革家', lifespan:'1525-1582', role:'改革家', description:'万历时期任首辅十年。推行"一条鞭法"改革赋税制度，使明朝出现中兴气象' },
    { dynastyId:9, name:'徐霞客', title:'明代旅行家', lifespan:'1587-1641', role:'旅行家', description:'足迹遍及今二十一个省市区，著《徐霞客游记》六十万字，被誉为"千古奇人"' },
    { dynastyId:9, name:'王守仁', title:'明代哲学家', lifespan:'1472-1529', role:'哲学家', description:'号阳明子。创立心学体系，提出"致良知""知行合一"。平定宁王朱宸濠叛乱' },
    { dynastyId:9, name:'海瑞', title:'明代名臣', lifespan:'1514-1587', role:'政治家', description:'以清廉刚正著称。上《治安疏》批评嘉靖帝。死后家无余财' },
  ],
  10: [
    { dynastyId:10, name:'曹雪芹', title:'清代文学家', lifespan:'约1715-约1763', role:'文学家', description:'出身江宁织造世家。创作《红楼梦》前八十回，是中国古典小说巅峰之作' },
    { dynastyId:10, name:'林则徐', title:'清代政治家', lifespan:'1785-1850', role:'政治家', description:'领导虎门销烟。鸦片战争中被革职流放新疆，在新疆兴修水利、屯田戍边' },
    { dynastyId:10, name:'曾国藩', title:'清代名臣', lifespan:'1811-1872', role:'大臣', description:'组建湘军平定太平天国。倡导洋务运动，创办江南制造局。被称为"中兴第一名臣"' },
    { dynastyId:10, name:'李鸿章', title:'清代重臣', lifespan:'1823-1901', role:'大臣', description:'淮军和北洋水师创建者。洋务运动领袖之一，创办多个近代企业' },
    { dynastyId:10, name:'左宗棠', title:'清代名将', lifespan:'1812-1885', role:'大将', description:'平定回民起义、收复新疆。创办福州船政局、兰州制造局' },
    { dynastyId:10, name:'康有为', title:'清末改革家', lifespan:'1858-1927', role:'改革家', description:'公车上书推动维新变法。戊戌变法核心人物，变法失败后流亡海外' },
    { dynastyId:10, name:'梁启超', title:'清末思想家', lifespan:'1873-1929', role:'政治家', description:'师从康有为。戊戌变法领袖之一。变法失败后流亡日本，代表作《少年中国说》' },
  ],
}

export function getHistoricalFigures(dynastyId: number): Omit<RoyalMember, 'id'>[] {
  return HISTORICAL_FIGURES[dynastyId] || []
}
