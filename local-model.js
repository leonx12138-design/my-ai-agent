/**
 * 本地模型集成
 * 支持 Ollama、LLaMA.cpp 等本地模型
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';

export class LocalModel {
  constructor(config = {}) {
    this.modelType = config.modelType || 'ollama';  // 'ollama', 'llamacpp', 'transformers'
    this.modelName = config.modelName || 'llama2';
    this.baseUrl = config.baseUrl || 'http://localhost:11434';  // Ollama默认端口
    this.conversationHistory = [];
  }

  /**
   * 使用 Ollama 进行推理
   */
  async generateWithOllama(prompt) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.modelName,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  }

  /**
   * 使用 Ollama 进行对话
   */
  async chatWithOllama(messages) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: messages,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama Chat API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.message.content;
  }

  /**
   * 主推理接口
   */
  async generate(messages) {
    switch (this.modelType) {
      case 'ollama':
        return await this.chatWithOllama(messages);
      default:
        throw new Error(`不支持的模型类型: ${this.modelType}`);
    }
  }

  /**
   * 微调模型（使用 Modelfile）
   */
  async fineTune(modelName, baseModel, trainingData, systemPrompt) {
    if (this.modelType !== 'ollama') {
      throw new Error('目前只支持 Ollama 模型微调');
    }

    // 创建 Modelfile
    const modelfile = `
FROM ${baseModel}

# 设置系统提示词
SYSTEM """
${systemPrompt}
"""

# 设置温度参数
PARAMETER temperature 0.7

# 设置其他参数
PARAMETER top_p 0.9
PARAMETER top_k 40
`;

    // 保存 Modelfile
    await fs.writeFile('./Modelfile', modelfile);

    // 使用 Ollama CLI 创建模型
    return new Promise((resolve, reject) => {
      const process = spawn('ollama', ['create', modelName, '-f', './Modelfile']);

      let output = '';
      process.stdout.on('data', (data) => {
        output += data.toString();
        console.log(data.toString());
      });

      process.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          reject(new Error(`模型创建失败，退出码: ${code}`));
        }
      });
    });
  }

  /**
   * 加载自定义模型
   */
  async loadCustomModel(modelName) {
    this.modelName = modelName;

    // 检查模型是否存在
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();

      const modelExists = data.models.some(m => m.name === modelName);
      if (!modelExists) {
        throw new Error(`模型 ${modelName} 不存在`);
      }

      console.log(`✅ 已加载模型: ${modelName}`);
      return true;
    } catch (error) {
      throw new Error(`加载模型失败: ${error.message}`);
    }
  }

  /**
   * 列出所有可用模型
   */
  async listModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return data.models;
    } catch (error) {
      throw new Error(`获取模型列表失败: ${error.message}`);
    }
  }

  /**
   * 删除模型
   */
  async deleteModel(modelName) {
    return new Promise((resolve, reject) => {
      const process = spawn('ollama', ['rm', modelName]);

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true });
        } else {
          reject(new Error(`删除模型失败，退出码: ${code}`));
        }
      });
    });
  }
}

/**
 * 模型训练数据管理
 */
export class TrainingDataManager {
  constructor(dataPath = './training-data') {
    this.dataPath = dataPath;
  }

  /**
   * 保存训练数据
   */
  async saveTrainingData(category, data) {
    const filePath = `${this.dataPath}/${category}.jsonl`;

    // 确保目录存在
    await fs.mkdir(this.dataPath, { recursive: true });

    // 追加数据（JSONL格式）
    const jsonlLine = JSON.stringify(data) + '\n';
    await fs.appendFile(filePath, jsonlLine);
  }

  /**
   * 加载训练数据
   */
  async loadTrainingData(category) {
    const filePath = `${this.dataPath}/${category}.jsonl`;

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.trim().split('\n');
      return lines.map(line => JSON.parse(line));
    } catch (error) {
      return [];
    }
  }

  /**
   * 从对话历史创建训练数据
   */
  createFromConversation(conversation, label) {
    const messages = conversation.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    return {
      messages,
      label,
      timestamp: new Date().toISOString()
    };
  }
}
