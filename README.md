# AI Agent - 可商业化的智能体平台

基于 Claude Code 架构 + 本地模型训练 + 付费API调用

## 🎯 核心特性

### ✅ 已实现功能

- 🤖 **AI对话核心** - 异步消息队列 + Agent主循环
- 🌐 **付费API服务** - 完整的API服务器 + 密钥管理
- 💰 **计费系统** - 用量追踪 + 自动计费
- 🗄️ **数据管理** - SQLite数据库 + 用户管理
- 🖥️ **本地模型** - 支持Ollama本地模型部署
- 🎓 **模型训练** - 支持本地模型微调和定制
- 📊 **用量统计** - 详细的API调用统计
- 🔐 **安全认证** - API密钥验证 + 配额控制

## 🚀 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置环境变量

\`\`\`bash
cp .env.example .env
# 编辑 .env 文件，填入配置
\`\`\`

必需配置：
\`\`\`env
LLM_API_KEY=your-zhipu-api-key        # 智谱AI密钥
ADMIN_SECRET=your-admin-secret         # 管理员密钥
PORT=3000                              # 服务器端口
\`\`\`

### 3. 启动API服务器

\`\`\`bash
npm run server
\`\`\`

服务器将运行在 \`http://localhost:3000\`

### 4. 创建API密钥

\`\`\`bash
curl -X POST http://localhost:3000/api/keys/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "adminSecret": "your-admin-secret",
    "userId": "user001",
    "quota": 1000
  }'
\`\`\`

### 5. 测试API

\`\`\`bash
curl -X POST http://localhost:3000/api/chat \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk-xxxxxxxx" \\
  -d '{"message": "你好！"}'
\`\`\`

## 📁 项目结构

\`\`\`
my-ai-agent/
├── agent.js                # 原始Agent演示
├── agent-exported.js       # 可导出的Agent类
├── api-server.js          # API服务器主程序
├── api-key-manager.js     # API密钥管理
├── database.js            # 数据库管理
├── usage-tracker.js       # 用量追踪和计费
├── local-model.js         # 本地模型集成
├── message-queue.js       # 异步消息队列
├── example-client.js      # 客户端调用示例
├── package.json           # 项目配置
├── .env.example           # 环境变量模板
├── README.md              # 本文档
└── DEPLOYMENT.md          # 详细部署指南
\`\`\`

## 🌐 API接口文档

### POST /api/chat - AI对话

**请求：**
\`\`\`bash
curl -X POST http://localhost:3000/api/chat \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"message": "你好！", "history": []}'
\`\`\`

**响应：**
\`\`\`json
{
  "response": "你好！很高兴见到你。",
  "usage": {
    "inputTokens": 15,
    "outputTokens": 20,
    "cost": "0.0001",
    "currency": "CNY"
  },
  "conversationHistory": [...]
}
\`\`\`

### GET /api/usage - 查询用量

\`\`\`bash
curl -X GET http://localhost:3000/api/usage \\
  -H "X-API-Key: your-api-key"
\`\`\`

### POST /api/keys/create - 创建API密钥（管理员）

\`\`\`bash
curl -X POST http://localhost:3000/api/keys/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "adminSecret": "your-admin-secret",
    "userId": "user123",
    "quota": 1000
  }'
\`\`\`

## 🖥️ 本地模型部署

### 使用 Ollama（推荐）

#### 1. 安装 Ollama

\`\`\`bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows: https://ollama.com/download
\`\`\`

#### 2. 下载模型

\`\`\`bash
# 英文模型
ollama pull llama2

# 中文模型  
ollama pull qwen:7b
\`\`\`

#### 3. 启动服务

\`\`\`bash
ollama serve
\`\`\`

#### 4. 配置使用本地模型

修改 \`.env\`：
\`\`\`env
USE_LOCAL_MODEL=true
LOCAL_MODEL_TYPE=ollama
LOCAL_MODEL_NAME=llama2
\`\`\`

## 🎓 模型训练和微调

\`\`\`javascript
import { LocalModel, TrainingDataManager } from './local-model.js';

// 创建定制模型
const model = new LocalModel({ modelType: 'ollama' });
await model.fineTune(
  'my-custom-bot',
  'llama2',
  trainingData,
  '你是一个专业的客服助手...'
);

// 使用定制模型
await model.loadCustomModel('my-custom-bot');
\`\`\`

## 💰 商业化方案

### 定价策略示例

| 套餐 | 配额 | 价格 | 适用场景 |
|------|------|------|----------|
| 免费版 | 100次 | ¥0 | 体验用户 |
| 基础版 | 1000次 | ¥9.9 | 个人用户 |
| 专业版 | 10000次 | ¥79 | 小型企业 |
| 企业版 | 无限制 | ¥999/月 | 大型企业 |

## 📊 客户端示例

### JavaScript/Node.js

\`\`\`javascript
const response = await fetch('http://your-domain.com/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'sk-xxxxxxxx'
  },
  body: JSON.stringify({ message: '你好！' })
});

const data = await response.json();
console.log(data.response);
\`\`\`

### Python

\`\`\`python
import requests

response = requests.post(
    'http://your-domain.com/api/chat',
    headers={'X-API-Key': 'sk-xxxxxxxx'},
    json={'message': '你好！'}
)

print(response.json()['response'])
\`\`\`

更多示例请查看 \`example-client.js\`

## 🚀 部署指南

详细部署文档请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署到云服务器

\`\`\`bash
# 1. 克隆项目
git clone https://github.com/your-username/my-ai-agent.git
cd my-ai-agent

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
nano .env

# 4. 使用PM2启动
npm install -g pm2
pm2 start api-server.js --name ai-agent
pm2 save
pm2 startup
\`\`\`

## 🛠️ 开发脚本

\`\`\`bash
npm start         # 运行原始Agent演示
npm run dev       # 开发模式（自动重载）
npm run server    # 启动API服务器
npm run server:dev # 服务器开发模式
npm run client    # 运行客户端示例
\`\`\`

## 📚 技术栈

- **后端框架**: Express.js
- **数据库**: SQLite
- **AI模型**: 智谱GLM-4 / Ollama本地模型
- **架构**: 基于Claude Code逆向分析

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 可自由商用
