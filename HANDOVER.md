# HANDOVER.md — 中国历代皇室家族

## 当前最终成果

- **项目架构**：Spring Boot 3.2（H2 内存库，data.sql 初始化）+ Vue 3 + Vite + serve_frontend.cjs（端口 5174）；页面通过 `http://localhost:5174/` 访问，后端直连 8088。
- **内容覆盖**：11 个朝代（秦→清+三国），已完成各朝代基本档案、家族渊源、开国之路、鼎盛时期、衰落与终结的纯文本描述。
- **弹窗系统**：114 个历史事件 + 60+ 位历史人物均有弹窗详情，三段式结构（背景/经过/后果）。
- **编辑功能**：所有文本板块、事件、人物均支持页面内编辑/新增/删除，通过 `PUT /api/dynasties/{id}/sections` 持久化。
- **交互**：家族关系谱可折叠（默认折叠），左侧边栏链接已同步排序。
- **构建**：`npx vite build` 通过（109 modules，~800ms）。`start.sh` 支持 `restart` 参数强制重启。

## 遗留风险和未完成 TODO

- **`children_data.ts` 有 esbuild 非致命错误**（line 422 残留逗号），Vite 构建可通过但输出警告。修复方法：删除 `frontend/src/data/children_data.ts:422` 的孤立逗号行。
- **多人物的 `detail` 详情偏简短**（约 400 字），可通过页面「管理人物」/「管理事件」手动补充，或参考已提供的 `.md` 文件批量更新。
- **家族关系谱展示不全**：现有数据只覆盖部分皇帝世系，各朝代补充的皇帝（IDs 163-189）子嗣数据需要进一步完善。
- **Spring Boot 后端需要手动重启**才能使新 `data.sql` 生效（H2 内存库启动时初始化）。执行 `cd backend && ./mvnw spring-boot:run -DskipTests`。

## 下次继续时优先执行的规则

1. **数据插入 > 必须用精确模式**：`content.replace` 定位朝代段时用 `'  {did}: [\n'`（前导缩进+换行），禁止裸 `'{did}: ['` 防子串污染。
2. **字符串替换 > 避免 `re.sub` 的转义坑**：含 `\n` 的替换必须用 `re.sub(r"pat", lambda m: f"...{val}...", src)` 或 `str.replace`。
3. **修改循环内容 > 必须一次性完成**：`re.finditer` 配合 `content.replace` 会导致偏移遗漏；用 `re.sub` 回调或收集替换对再批量执行。
4. **前端类型扩展 > 双向对齐**：新增 `detail` 等字段时，同步更新 `types/index.ts` 中的 TypeScript 接口定义。
5. **后端静态部署 > 两步走**：(a) 构建后用显式路径 `cp -r dist/index.html dist/assets /path/to/static/`；(b) 重启 Spring Boot 清除资源缓存。