/**
 * AI Agent 核心实现
 * 基于 Claude Code 的 nO 主循环设计
 * 支持本地模型和API调用
 */

import { MessageQueue } from './message-queue.js';

export class AIAgent {
  constructor(config = {}) {
    this.messageQueue = new MessageQueue();
    this.llmApiKey = config.apiKey || process.env.LLM_API_KEY;
    this.llmBaseUrl = config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    this.modelName = config.model || 'glm-4-flash';
    this.conversationHistory = [];

    // 本地模型配置
    this.useLocalModel = config.useLocalModel || false;
    this.localModelPath = config.localModelPath || './models/local-model';
    this.localModel = null;
  }

  /**
   * 初始化本地模型
   */
  async initLocalModel() {
    if (this.useLocalModel) {
      // 使用 transformers.js 或 llama.cpp 加载本地模型
      console.log('🔧 加载本地模型...');
      // 这里会在后续实现本地模型加载逻辑
    }
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
    if (this.useLocalModel) {
      return await this.callLocalModel();
    }

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
   * 调用本地模型
   */
  async callLocalModel() {
    // 本地模型推理逻辑
    throw new Error('本地模型尚未实现');
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
