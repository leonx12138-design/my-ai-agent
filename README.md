# My AI Agent

基于 Claude Code 逆向分析架构的简化 AI 助手

## 🎯 特性

- ✅ 异步消息队列（基于 h2A 设计）
- ✅ Agent 主循环（基于 nO 设计）
- ✅ 支持智谱 GLM-4 免费 API
- ✅ 完整的对话历史管理

## 🚀 快速开始

### 1. 获取免费 API Key

访问 https://open.bigmodel.cn/ 注册并获取免费 API Key（新用户送 1000万 tokens）

### 2. 配置 API Key

方式一：环境变量
```bash
export LLM_API_KEY="your-api-key-here"
```

方式二：修改 `agent.js` 文件
```javascript
const agent = new AIAgent({
  apiKey: '你的API密钥'
});
```

### 3. 运行

```bash
node agent.js
```

## 📚 架构说明

本项目基于对 Claude Code v1.0.33 的逆向分析，实现了核心的：

1. **h2A 双重缓冲消息队列** - 零延迟消息传递
2. **nO Agent 主循环** - 异步迭代器模式
3. **对话历史管理** - 上下文维护

## 🔧 核心组件

- `message-queue.js` - 异步消息队列实现
- `agent.js` - AI Agent 核心逻辑

## 📖 学习资源

- Claude Code 完整分析：`../claude_code_v_1.0.33/stage1_analysis_workspace/`
- 架构文档：查看上级目录的技术文档

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
