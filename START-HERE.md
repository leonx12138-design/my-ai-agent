# 🚀 快速开始 - 创建你的 leon12138 AI智能体

## 三步创建完全属于你的AI

### 第一步：安装 Ollama

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 访问 https://ollama.com/download/windows 下载安装
```

### 第二步：准备环境

```bash
# 1. 启动 Ollama 服务（新开一个终端窗口）
ollama serve

# 2. 下载基础模型（另开一个终端）
ollama pull qwen:7b

# 3. 安装项目依赖
npm install
```

### 第三步：添加你的知识并创建模型

```bash
# 1. 在 knowledge/ 目录添加你的知识文件
# 例如：knowledge/my-data.txt

# 2. 运行创建脚本
node create-leon12138.js

# 3. 测试你的模型
ollama run leon12138
```

---

## 📝 准备知识库

在 `knowledge/` 目录下创建 `.txt` 或 `.md` 文件：

**示例文件：knowledge/leon-knowledge.txt**

```text
=== 关于 leon12138 ===
我是一个专业的AI助手，专注于[你的领域]。

=== 我的服务 ===
1. [服务1的详细描述]
2. [服务2的详细描述]
3. [服务3的详细描述]

=== 常见问题 ===

Q: [用户常问的问题1]
A: [你希望AI这样回答]

Q: [用户常问的问题2]
A: [你希望AI这样回答]

=== 对话示例 ===

用户：你好
leon12138：你好！我是leon12138，很高兴为你服务。

用户：你能做什么？
leon12138：我可以帮你[具体能力列表]。

=== 专业知识 ===
[在这里放入你的专业知识、产品介绍、技术文档等]
```

**知识库建议：**
- 至少准备 3-5 个知识文件
- 包含常见问题和标准答案
- 提供 10-20 个对话示例
- 添加你的专业领域知识

---

## 🎯 使用你的模型

### 1. 命令行对话

```bash
ollama run leon12138
```

### 2. 在代码中使用

```javascript
import { LocalModel } from './local-model.js';

const leon = new LocalModel({
  modelType: 'ollama',
  modelName: 'leon12138'
});

const response = await leon.generate([
  { role: 'user', content: '你好！' }
]);

console.log(response);
```

### 3. 启动API服务器

```bash
# 1. 配置环境变量
cp .env.example .env

# 2. 编辑 .env
# USE_LOCAL_MODEL=true
# LOCAL_MODEL_NAME=leon12138
# ADMIN_SECRET=your-secret

# 3. 启动服务器
npm run server

# 4. 创建API密钥
curl -X POST http://localhost:3000/api/keys/create \
  -H "Content-Type: application/json" \
  -d '{
    "adminSecret": "your-secret",
    "userId": "user001",
    "quota": 1000
  }'

# 5. 测试API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk-xxxxx" \
  -d '{"message": "你好！"}'
```

---

## 🔄 更新模型

当你添加新知识或想改进模型时：

```bash
# 1. 删除旧模型
ollama rm leon12138

# 2. 添加/修改 knowledge/ 中的文件

# 3. 重新创建模型
node create-leon12138.js

# 4. 测试新版本
ollama run leon12138
```

---

## 📊 文件结构

```
my-ai-agent/
├── knowledge/              # 👈 在这里添加你的知识文件
│   ├── example-knowledge.txt
│   └── [你的文件].txt
├── create-leon12138.js    # 创建模型脚本
├── train-custom-model.js  # 训练工具（被create脚本调用）
├── local-model.js         # 本地模型接口
├── api-server.js          # API服务器
└── .env                   # 配置文件
```

---

## ❓ 常见问题

### Q: 需要 GPU 吗？
A: 不需要！7B模型在CPU上也能跑，8GB内存即可。有GPU会更快。

### Q: 训练需要多久？
A: 使用 Modelfile 方式几秒钟就能创建，不是传统的参数训练。

### Q: 如何让模型更准确？
A: 在 knowledge/ 添加更多高质量的知识文件和对话示例。

### Q: 能否支持中文？
A: 完全支持！我们使用 qwen:7b 作为基础模型，专为中文优化。

### Q: 模型存在哪里？
A: 存储在 Ollama 的模型库中（~/.ollama/models）

### Q: 如何删除模型？
A: `ollama rm leon12138`

---

## 🎁 下一步

1. **测试和优化**
   - 与 leon12138 对话，测试回答质量
   - 根据回答调整知识库
   - 重新训练优化

2. **部署上线**
   - 使用API服务器提供服务
   - 部署到云服务器
   - 添加收费功能

3. **持续学习**
   - 收集用户对话
   - 提取有价值的QA
   - 定期更新知识库

---

## 📚 详细文档

- **训练指南**: TRAINING-GUIDE.md
- **部署文档**: DEPLOYMENT.md
- **API文档**: README.md

---

## 💬 需要帮助？

1. 查看详细文档
2. 检查 Ollama 是否正常运行
3. 确保基础模型已下载
4. 查看错误日志

---

祝你成功创建自己的 AI 智能体！🎉
