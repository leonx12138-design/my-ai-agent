# AI Agent 部署和使用指南

## 📋 目录

1. [快速开始](#快速开始)
2. [本地模型部署](#本地模型部署)
3. [API服务器部署](#api服务器部署)
4. [商业化运营](#商业化运营)
5. [模型训练和微调](#模型训练和微调)

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd my-ai-agent
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

### 3. 启动API服务器

```bash
npm run server
```

服务器将运行在 `http://localhost:3000`

---

## 🖥️ 本地模型部署

### 方案一：使用 Ollama（推荐）

Ollama 是一个开源的本地LLM运行工具，支持多种模型。

#### 1. 安装 Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 下载安装器：https://ollama.com/download
```

#### 2. 下载模型

```bash
# 下载 Llama 2 (7B)
ollama pull llama2

# 下载 Mistral (7B)
ollama pull mistral

# 下载中文优化模型
ollama pull qwen:7b
```

#### 3. 启动 Ollama 服务

```bash
ollama serve
```

#### 4. 配置项目使用本地模型

修改 `.env` 文件：

```env
USE_LOCAL_MODEL=true
LOCAL_MODEL_TYPE=ollama
LOCAL_MODEL_NAME=llama2
OLLAMA_BASE_URL=http://localhost:11434
```

#### 5. 测试本地模型

```javascript
import { LocalModel } from './local-model.js';

const model = new LocalModel({
  modelType: 'ollama',
  modelName: 'llama2'
});

const response = await model.generate([
  { role: 'user', content: '你好！' }
]);

console.log(response);
```

---

## 🌐 API服务器部署

### 本地部署

```bash
# 开发模式（自动重载）
npm run server:dev

# 生产模式
npm run server
```

### 云服务器部署

#### 1. 准备服务器

推荐配置：
- CPU: 2核以上
- 内存: 4GB以上
- 存储: 20GB以上
- 操作系统: Ubuntu 20.04+

#### 2. 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. 上传项目文件

```bash
# 使用 git
git clone https://github.com/your-username/my-ai-agent.git
cd my-ai-agent
npm install

# 或使用 scp
scp -r my-ai-agent user@server:/path/to/deploy
```

#### 4. 配置环境变量

```bash
cp .env.example .env
nano .env  # 编辑配置
```

#### 5. 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start api-server.js --name ai-agent

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs ai-agent

# 重启服务
pm2 restart ai-agent
```

#### 6. 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 7. 配置 HTTPS（使用 Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 💰 商业化运营

### 1. 创建管理员账户

首次部署后，设置管理员密钥：

```bash
# 在 .env 文件中
ADMIN_SECRET=your-super-secret-admin-key
```

### 2. 创建用户API密钥

```bash
curl -X POST http://localhost:3000/api/keys/create \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecret": "your-super-secret-admin-key",
    "userId": "user001",
    "quota": 1000
  }'
```

返回：

```json
{
  "apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "userId": "user001",
  "quota": 1000,
  "message": "API密钥创建成功"
}
```

### 3. 定价策略

在 `.env` 中设置定价：

```env
# 每1000个token的价格（CNY）
PRICING_INPUT_PER_1K=0.001   # 输入: ¥0.001/1K tokens
PRICING_OUTPUT_PER_1K=0.002  # 输出: ¥0.002/1K tokens
```

### 4. 收费方案示例

| 套餐 | 配额 | 价格 | 适用场景 |
|------|------|------|----------|
| 免费版 | 100次 | ¥0 | 体验用户 |
| 基础版 | 1000次 | ¥9.9 | 个人用户 |
| 专业版 | 10000次 | ¥79 | 小型企业 |
| 企业版 | 无限制 | ¥999/月 | 大型企业 |

### 5. 集成支付系统

可以集成以下支付方式：
- 微信支付
- 支付宝
- Stripe（国际支付）

---

## 🎓 模型训练和微调

### 使用 Ollama 微调模型

#### 1. 准备训练数据

```javascript
import { TrainingDataManager } from './local-model.js';

const dataManager = new TrainingDataManager();

// 收集对话数据
const conversation = [
  { role: 'user', content: '你是谁？' },
  { role: 'assistant', content: '我是一个专业的客服助手。' }
];

await dataManager.saveTrainingData('customer-service', {
  messages: conversation,
  label: 'customer-service'
});
```

#### 2. 创建定制模型

```javascript
import { LocalModel } from './local-model.js';

const model = new LocalModel({ modelType: 'ollama' });

await model.fineTune(
  'my-custom-agent',  // 新模型名称
  'llama2',           // 基础模型
  trainingData,       // 训练数据
  `你是一个专业的客服助手，专注于解决用户问题。
   你的回答应该：
   1. 友好且专业
   2. 简洁明了
   3. 聚焦问题解决`
);
```

#### 3. 使用定制模型

```javascript
await model.loadCustomModel('my-custom-agent');

const response = await model.generate([
  { role: 'user', content: '如何退款？' }
]);
```

### 模型评估

```javascript
// 测试模型性能
const testCases = [
  { input: '你好', expectedType: 'greeting' },
  { input: '如何退款', expectedType: 'refund' },
  { input: '产品价格', expectedType: 'pricing' }
];

for (const test of testCases) {
  const response = await model.generate([
    { role: 'user', content: test.input }
  ]);
  console.log(`输入: ${test.input}`);
  console.log(`输出: ${response}\n`);
}
```

---

## 🔧 高级配置

### 速率限制

```javascript
// 在 api-server.js 中添加
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 最多100个请求
});

app.use('/api/', limiter);
```

### 日志记录

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 监控和告警

使用 PM2 Plus 进行监控：

```bash
pm2 plus
# 访问 https://app.pm2.io/ 配置监控
```

---

## 📊 性能优化

### 1. 数据库优化

```sql
-- 为常用查询创建索引
CREATE INDEX idx_user_id ON usage_records(user_id);
CREATE INDEX idx_api_key ON api_keys(api_key);
CREATE INDEX idx_timestamp ON usage_records(timestamp);
```

### 2. 缓存策略

```javascript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });

// 缓存API密钥验证结果
async function validateKeyWithCache(apiKey) {
  const cached = cache.get(apiKey);
  if (cached) return cached;

  const result = await apiKeyManager.validateKey(apiKey);
  cache.set(apiKey, result);
  return result;
}
```

### 3. 负载均衡

使用 Nginx 配置多个服务器实例：

```nginx
upstream ai_backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    location / {
        proxy_pass http://ai_backend;
    }
}
```

---

## 🔒 安全建议

1. **API密钥管理**
   - 定期轮换管理员密钥
   - 使用强密码生成器
   - 限制API密钥的访问权限

2. **数据加密**
   - 使用HTTPS传输
   - 敏感数据加密存储
   - 定期备份数据库

3. **访问控制**
   - 实施IP白名单
   - 添加速率限制
   - 监控异常访问

---

## 🐛 故障排查

### 问题1: API服务器无法启动

```bash
# 检查端口占用
lsof -i :3000

# 检查环境变量
cat .env

# 查看详细日志
npm run server 2>&1 | tee server.log
```

### 问题2: 本地模型连接失败

```bash
# 检查 Ollama 服务状态
curl http://localhost:11434/api/tags

# 重启 Ollama
pkill ollama
ollama serve
```

### 问题3: 数据库错误

```bash
# 重建数据库
rm data.db
npm run server  # 会自动重建
```

---

## 📞 支持和反馈

- GitHub Issues: [项目地址]
- 邮箱: your-email@example.com
- 文档: [文档地址]

---

## 📄 许可证

MIT License - 可自由商用
