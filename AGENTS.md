---
description: AI 助手在本项目中的行为规范，涵盖项目结构、代码约定、开发流程和协作规则。
globs: *
alwaysApply: true
---

# AGENTS.md — Spring Boot + Vue 前后端分离项目

## 编码前思考
- 请默认用中文回答。
- 如果涉及代码或命令，请先用大白话解释目的，再给具体操作。
- 如果要修改文件、运行命令、访问外部账号，请先告诉我风险。
- 如果我的需求信息不完整，请先问我缺什么，不要直接编。
- 明确假设，不确定时询问而非猜测。
- 存在歧义时，列出多种解释，不默默选定单一方案。
- 如果任务有明显更简单的做法，直接指出优化思路。
- 发现代码矛盾、逻辑不一致时及时暂停，请求信息澄清。

## 简洁优先
- 用最少的代码解决问题，拒绝冗余实现。
- 不为一次性需求创建抽象层、复杂架构。
- 不盲目增加扩展性、可配置性，应对“未来可能用到”的场景。
- 若代码可大幅精简，主动重写优化。
- 校验标准：以资深工程师视角判断，代码若过于复杂，立即简化。

## 精准修改
- 仅修改与当前任务直接相关的代码内容。
- 不顺手优化相邻代码、注释、排版格式。
- 不重构原本可以正常运行的代码模块。
- 严格匹配项目现有代码风格，保留原有编码习惯。
- 因本次修改产生的无效导入、废弃变量，可直接删除。
- 发现项目中原有的死代码、冗余内容，仅做文字提醒，不擅自删除。

## 目标驱动执行
- 执行任务前，定义清晰、可落地的成功标准。
- 将“修复Bug”转化为：编写用例复现问题，再调试至用例正常通过。
- 将“新增校验功能”转化为：针对异常输入编写测试用例，保证全部通过。
- 将“代码重构”转化为：完成重构后，确保原有所有测试用例正常运行。
- 多步骤复杂任务，先输出简短执行计划，同时标注每一步的验证方式。

## 其他
- 向我汇报结果时，用简单直白的语言说清楚你做了什么、结果怎样。最终回复里不要出现术语、技术实现细节和代码腔。写的时候就当你在跟一个聪明人解释，但对方没在看代码。你实际干活的过程（怎么思考、怎么规划、怎么写代码、怎么调试、怎么解决问题）该多技术就多技术，该多严谨就多严谨。这条要求只针对你跟我沟通的方式。
- 在向我汇报之前，尽一切可能先验证自己的工作。不要写完代码就当大功告成。用你手头的工具实际跑一遍。能运行就运行，检查输出，确认它确实做到了我要求的事情。如果你在做 Web 应用这类可视化的东西，打开页面看看，点一遍流程，确认渲染和交互都没问题。如果你在写脚本，拿真实的或有代表性的输入跑一遍，检查结果。如果有能模拟的边界情况，试一试。
- 开始之前，先给自己定义好完成标准：这个任务做到什么程度才算'完成'？把它当作交付前的检查清单。如果有什么跑不通或者看着不对，修好，重新测。不要只是标记一下问题就甩回给我。目标是不让我参与迭代过程。我要收到的是完成的、能用的成果，不是需要我再去逐项检查的初稿。只有在你确认一切正常，或者确实遇到了需要我介入的障碍时，才回来找我。


## 1. 项目概述

这是一个基于 **Spring Boot**（后端）和 **Vue**（前端）的 Web 全栈项目，采用前后端分离架构。
后端提供 RESTful API，前端通过 Axios / fetch 调用后端接口进行数据交互。

## 2. 技术栈

| 层 | 技术 | 说明 |
|--|--|--|
| **后端** | Spring Boot 2.x / 3.x | 主框架 |
| | Spring MVC | REST API |
| | Spring Security / JWT | 认证与授权（如适用） |
| | MyBatis / MyBatis-Plus 或 JPA / Hibernate | 数据访问层 |
| | MySQL / PostgreSQL | 关系数据库 |
| | Redis | 缓存（如适用） |
| | Maven 或 Gradle | 构建工具 |
| **前端** | Vue 3 | 主框架 |
| | Vue Router | 前端路由 |
| | Pinia | 状态管理 |
| | Vite | 构建工具 |
| | TypeScript | 推荐使用 |
| | Element Plus / Ant Design Vue / Naive UI | UI 组件库（按项目实际） |
| | Axios | HTTP 请求库 |
| | ESLint + Prettier | 代码规范 |
| **协作** | Git | 版本控制 |
| | Swagger / Knife4j | API 文档（后端） |

## 3. 目录结构约定

```
project-root/
├── backend/                     # Spring Boot 后端
│   ├── src/main/java/com/xxx/
│   │   ├── controller/          # Controller 层（接收请求）
│   │   ├── service/             # Service 接口
│   │   ├── service/impl/        # Service 实现
│   │   ├── mapper/              # MyBatis Mapper 接口
│   │   ├── entity/              # 数据库实体 / POJO
│   │   ├── dto/                 # 数据传输对象
│   │   ├── vo/                  # 视图对象
│   │   ├── config/              # 配置类
│   │   ├── common/              # 公共工具、统一返回、异常处理
│   │   └── utils/               # 工具类
│   ├── src/main/resources/
│   │   ├── application.yml      # 主配置
│   │   ├── application-dev.yml  # 开发环境配置
│   │   └── mapper/              # MyBatis XML 映射文件
│   └── pom.xml                  # Maven 依赖（或 build.gradle）
│
├── frontend/                    # Vue 前端
│   ├── src/
│   │   ├── api/                 # API 请求封装
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 通用组件
│   │   ├── composables/         # 组合式函数
│   │   ├── layouts/             # 布局组件
│   │   ├── router/              # 路由配置
│   │   ├── stores/              # Pinia 状态
│   │   ├── types/               # TypeScript 类型定义
│   │   ├── utils/               # 工具函数
│   │   └── views/               # 页面组件
│   ├── index.html
│   └── package.json
│
├── sql/                         # SQL 初始化脚本（可选）
├── docs/                        # 项目文档（可选）
├── docker/                      # Docker 配置（可选）
├── .gitignore
└── README.md
```

> **注意**：如果后端不在 `backend/` 子目录下，而是直接在项目根目录（即标准的 Spring Boot 脚手架结构），请**以实际目录为准**，上述结构仅为推荐约定。

## 4. 代码风格与命名约定

### 后端（Java / Spring Boot）

- **类名**：`UpperCamelCase`，如 `UserServiceImpl`
- **方法名**：`lowerCamelCase`，如 `findUserById`
- **变量 / 参数**：`lowerCamelCase`
- **常量**：`UPPER_SNAKE_CASE`
- **包名**：小写，如 `com.example.project.controller`
- **REST 接口风格**：统一使用 RESTful 语义（GET / POST / PUT / DELETE），路径使用复数名词，如 `/api/users`
- **分层调用原则**：Controller → Service → Mapper，禁止 Controller 直接调用 Mapper
- **统一返回格式**：使用统一的 `Result<T>` 或 `ApiResponse<T>` 封装，包含 `code`、`message`、`data`
- **异常处理**：使用全局 `@RestControllerAdvice` 捕获异常，不在 Controller 内写 try-catch
- **依赖注入**：使用 `@RequiredArgsConstructor` + `final` 构造器注入，避免字段注入
- **日志**：使用 Lombok `@Slf4j`，避免 `System.out.println`
- **数据库**：表名使用小写 + 下划线（如 `sys_user`），主键统一命名为 `id`，字段使用 `created_at`/`updated_at` 风格

### 前端（Vue 3 + TypeScript）

- **组件名**：多词 `PascalCase`，如 `UserProfile.vue`
- **文件/目录名**：`kebab-case`，如 `user-profile.vue`、`api/user.ts`
- **变量/函数**：`lowerCamelCase`
- **组件**：使用 `<script setup lang="ts">` + Composition API
- **样式**：使用 `<style scoped lang="scss">`（使用 SCSS 时），推荐 Tailwind CSS 或 CSS Modules（根据项目实际情况）
- **状态管理**：使用 Pinia，按模块拆分 store
- **API 请求**：统一在 `src/api/` 下按模块封装，每个模块一个文件
- **类型定义**：后端响应的数据结构在 `src/types/` 下定义 TypeScript 接口
- **路由**：懒加载组件，`src/router/index.ts` 集中管理

## 5. 开发工作流

### 后端启动

```bash
cd backend
# Maven
./mvnw spring-boot:run
# Gradle
./gradlew bootRun
```

### 前端启动

```bash
cd frontend
pnpm install    # 或 npm install / yarn
pnpm dev        # 启动开发服务器
```

### 构建

```bash
# 后端构建
cd backend && mvn clean package -DskipTests

# 前端构建
cd frontend && pnpm build
```

### 代码检查

```bash
# 前端
cd frontend && pnpm lint

# 后端（通常 IDE 实时检查，也可用）
cd backend && mvn checkstyle:check  # 如配置了 checkstyle
```

### 前端样式检查

- 每一次开发完成后都检查一下前段能否正常展示，前端样式是否正常。

## 6. AI 助手行为规范

### 6.1 通用原则

- **语言**：默认使用**中文**回复。涉及代码、命令、术语时保留英文。
- **先解释，再操作**：涉及修改文件、运行命令、访问外部系统时，先用大白话说明目的和风险，再给出具体操作。
- **不编造**：如果信息不完整、不确定，**必须先提问**，不凭空编造配置、接口、路径或逻辑。

### 6.2 代码生成

- 遵循项目已有的代码风格和目录约定，不引入项目中未使用的依赖或框架。
- 修改文件时优先做精确编辑，不整文件覆写。
- 添加新功能时先理解现有代码结构，选择与项目匹配的方式实现。
- 生成代码时包含必要注释，但不过度注解（不要给 getter/setter 写注释）。

### 6.3 命令执行

- 运行命令前说明意图（如"启动后端开发服务器"）。
- 如果命令可能带来破坏性后果（如删表、覆盖配置、git push --force），必须提前告知。

### 6.4 提问策略

- 需求不完整时**主动指出缺少什么信息**，给出几个常见选项。
- 涉及第三方服务（OSS、短信、支付等），确认是否已有配置或密钥，不要自建凭据。
- 如果问题有明显的推荐偏好，指出推荐项及其理由。

### 6.5 安全与风险

- 不要将密码、密钥、令牌直接写入代码或配置文件，推荐使用环境变量或配置中心。
- 不要输出真实数据库数据到日志或回复中。
- 涉及跨域、权限、事务、并发等敏感逻辑时，给出合理性说明。

## 7. Git 规范

- **分支命名**：功能分支如 `feat/xxx`，修复分支如 `fix/xxx`
- **提交信息**：统一使用中文或英文（按团队约定），格式如 `feat: 增加用户注册功能` 或 `fix: 修复登录 token 过期问题`
- **提交粒度**：逻辑完整、可独立编译通过的单位

## 8. 沟通风格

- 语气自然、直接、务实，不刻意雕琢修辞。
- 给出方案时，优先推荐最简洁可靠的做法，并说明理由。
- 如果目标可以用多个方式实现，简要对比后推荐一种，同时备注可替代方案。

---

*本文件由 AI 根据 Spring Boot + Vue 项目最佳实践生成，可根据项目实际情况调整。*

## 9. 前端验证规范

每次开发完成后，**必须**执行以下前端验证步骤：

### 9.1 编译验证
验证 Vite 能正常编译所有新修改或新增的组件：
```bash
curl -s "http://localhost:5174/src/views/修改的文件.vue" | grep -i error
```
- 确认无编译报错
- 确认 import 路径正确

### 9.2 页面展示验证
验证前端页面能正常加载：
```bash
curl -s "http://localhost:5174/" | grep -c "中国历代皇室家族"
```
- 首页应返回 200 并包含核心文字

### 9.3 样式检查
- 确保新增组件包含完整的 `<style scoped>` 样式
- 检查响应式布局：≤768px 移动端、769-1024px 平板、≥1025px 桌面
- 检查文字溢出、重叠、留白是否合理
- 检查颜色是否符合项目色板（深灰 #1a1a2e、暖白 #f5f0eb、暗红 #8b1a1a）

### 9.4 功能验证
- 点击交互是否正常（悬停效果、展开/收起、跳转链接）
- API 数据是否正常渲染
- 中文字符编码是否正确（无乱码）

### 9.5 修复流程
若验证发现问题，按优先级修复：
1. 编译错误（最高优先级）
2. 页面空白 / 崩溃（高优先级）
3. 样式错乱 / 布局异常（中优先级）
4. 文字溢出 / 编码问题（中优先级）
5. 交互效果不完善（低优先级）
