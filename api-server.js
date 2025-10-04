/**
 * AI Agent API 服务器
 * 提供付费API调用服务
 */

import express from 'express';
import { AIAgent } from './agent-exported.js';
import { Database } from './database.js';
import { ApiKeyManager } from './api-key-manager.js';
import { UsageTracker } from './usage-tracker.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 初始化数据库和服务
const db = new Database();
const apiKeyManager = new ApiKeyManager(db);
const usageTracker = new UsageTracker(db);

/**
 * API密钥验证中间件
 */
async function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: '缺少API密钥' });
  }

  try {
    const keyInfo = await apiKeyManager.validateKey(apiKey);

    if (!keyInfo.valid) {
      return res.status(401).json({ error: '无效的API密钥' });
    }

    // 检查配额
    const usage = await usageTracker.getUsage(keyInfo.userId);
    if (usage.requestCount >= keyInfo.quota) {
      return res.status(429).json({
        error: '配额已用完',
        usage: usage.requestCount,
        quota: keyInfo.quota
      });
    }

    // 将用户信息附加到请求
    req.user = keyInfo;
    next();
  } catch (error) {
    res.status(500).json({ error: '认证失败' });
  }
}

/**
 * POST /api/chat - AI对话接口
 */
app.post('/api/chat', authenticateApiKey, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: '缺少消息内容' });
  }

  try {
    // 创建AI Agent实例
    const agent = new AIAgent({
      apiKey: process.env.LLM_API_KEY
    });

    // 恢复对话历史
    agent.conversationHistory = [...history];

    // 发送消息并获取响应
    agent.sendMessage(message);
    agent.end();

    let response = '';
    for await (const chunk of agent.run()) {
      response = chunk;
    }

    // 记录用量
    const cost = await usageTracker.recordUsage(
      req.user.userId,
      message.length,
      response.length
    );

    // 返回响应
    res.json({
      response,
      usage: {
        inputTokens: message.length,
        outputTokens: response.length,
        cost: cost.toFixed(4),
        currency: 'CNY'
      },
      conversationHistory: agent.conversationHistory
    });

  } catch (error) {
    console.error('API调用错误:', error);
    res.status(500).json({ error: '处理请求时出错' });
  }
});

/**
 * POST /api/keys/create - 创建新的API密钥（管理员）
 */
app.post('/api/keys/create', async (req, res) => {
  const { adminSecret, userId, quota = 1000 } = req.body;

  // 简单的管理员验证
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: '无权限' });
  }

  try {
    const apiKey = await apiKeyManager.createKey(userId, quota);
    res.json({
      apiKey,
      userId,
      quota,
      message: 'API密钥创建成功'
    });
  } catch (error) {
    res.status(500).json({ error: '创建密钥失败' });
  }
});

/**
 * GET /api/usage - 查询用量
 */
app.get('/api/usage', authenticateApiKey, async (req, res) => {
  try {
    const usage = await usageTracker.getUsage(req.user.userId);
    res.json({
      userId: req.user.userId,
      requestCount: usage.requestCount,
      totalCost: usage.totalCost,
      quota: req.user.quota,
      remaining: req.user.quota - usage.requestCount
    });
  } catch (error) {
    res.status(500).json({ error: '查询用量失败' });
  }
});

/**
 * GET /health - 健康检查
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * 启动服务器
 */
async function startServer() {
  try {
    // 初始化数据库
    await db.init();
    console.log('✅ 数据库初始化完成');

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 API服务器运行在 http://localhost:${PORT}`);
      console.log(`📝 API文档:`);
      console.log(`   POST /api/chat - AI对话接口`);
      console.log(`   POST /api/keys/create - 创建API密钥（需要管理员权限）`);
      console.log(`   GET  /api/usage - 查询用量`);
      console.log(`   GET  /health - 健康检查`);
    });
  } catch (error) {
    console.error('❌ 启动服务器失败:', error);
    process.exit(1);
  }
}

startServer();
