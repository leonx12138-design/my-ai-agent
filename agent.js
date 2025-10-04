/**
 * AI Agent 核心实现
 * 基于 Claude Code 的 nO 主循环设计
 */

import { MessageQueue } from './message-queue.js';

class AIAgent {
  constructor(config = {}) {
    this.messageQueue = new MessageQueue();
    this.llmApiKey = config.apiKey || process.env.LLM_API_KEY;
    this.llmBaseUrl = config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.modelName = config.model || 'glm-4-flash';  // 智谱免费模型
    this.conversationHistory = [];
  }

  /**
   * Agent 主循环 - 参考 nO 函数设计
   */
  async* run() {
    console.log('🤖 AI Agent 启动...\n');

    for await (const message of this.messageQueue) {
      console.log(`👤 用户: ${message}`);

      // 添加到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // 调用 LLM
      try {
        const response = await this.callLLM();
        console.log(`🤖 助手: ${response}\n`);

        // 添加到历史
        this.conversationHistory.push({
          role: 'assistant',
          content: response
        });

        yield response;
      } catch (error) {
        console.error('❌ LLM 调用失败:', error.message);
        yield '抱歉，我遇到了一些问题。';
      }
    }

    console.log('✅ 对话结束');
  }

  /**
   * 调用 LLM API
   */
  async callLLM() {
    if (!this.llmApiKey) {
      return '提示：请设置 LLM_API_KEY 环境变量或在配置中提供 apiKey。\n你可以在 https://open.bigmodel.cn/ 注册获取免费 API Key。';
    }

    const response = await fetch(this.llmBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.llmApiKey}`
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: this.conversationHistory,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * 发送用户消息
   */
  sendMessage(message) {
    this.messageQueue.enqueue(message);
  }

  /**
   * 结束对话
   */
  end() {
    this.messageQueue.done();
  }
}

// ============ 演示程序 ============

async function demo() {
  // 创建 AI Agent
  const agent = new AIAgent({
    // apiKey: '你的API密钥',  // 取消注释并填入你的 API Key
  });

  // 启动 Agent
  const agentTask = (async () => {
    for await (const response of agent.run()) {
      // Agent 响应已经在 run() 中打印了
    }
  })();

  // 模拟用户交互
  await sleep(1000);
  agent.sendMessage('你好，请介绍一下你自己');

  await sleep(3000);
  agent.sendMessage('你能帮我做什么？');

  await sleep(3000);
  agent.sendMessage('谢谢！');

  await sleep(2000);
  agent.end();

  // 等待 Agent 完成
  await agentTask;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行演示
demo().catch(console.error);
