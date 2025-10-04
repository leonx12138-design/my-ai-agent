/**
 * 自定义模型训练工具
 * 使用 Ollama 创建完全属于你的AI智能体
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

class CustomModelTrainer {
  constructor(config = {}) {
    this.modelName = config.modelName || 'my-custom-ai';
    this.baseModel = config.baseModel || 'llama2';  // 基础模型
    this.knowledgeDir = config.knowledgeDir || './knowledge';
    this.trainingDataFile = './training-data.txt';
  }

  /**
   * 步骤1: 准备知识库
   * 将你的文档、对话、知识整理成训练数据
   */
  async prepareKnowledgeBase() {
    console.log('📚 步骤1: 准备知识库...\n');

    // 确保知识目录存在
    await fs.mkdir(this.knowledgeDir, { recursive: true });

    // 读取所有知识文件
    const files = await fs.readdir(this.knowledgeDir);
    const txtFiles = files.filter(f => f.endsWith('.txt') || f.endsWith('.md'));

    if (txtFiles.length === 0) {
      console.log('⚠️  知识库为空，请在 ./knowledge 目录下添加你的知识文件');
      console.log('   支持格式: .txt, .md');
      console.log('\n示例文件结构:');
      console.log('   knowledge/');
      console.log('   ├── product-info.txt');
      console.log('   ├── faq.txt');
      console.log('   └── conversation-examples.txt\n');
      return '';
    }

    let allKnowledge = '';
    for (const file of txtFiles) {
      const content = await fs.readFile(
        path.join(this.knowledgeDir, file),
        'utf-8'
      );
      allKnowledge += `\n=== ${file} ===\n${content}\n`;
      console.log(`✓ 已加载: ${file} (${content.length} 字符)`);
    }

    console.log(`\n✅ 共加载 ${txtFiles.length} 个知识文件\n`);
    return allKnowledge;
  }

  /**
   * 步骤2: 创建 Modelfile
   * 定义模型的行为、性格、知识范围
   */
  async createModelfile(systemPrompt, examples = []) {
    console.log('🔧 步骤2: 创建模型定义文件...\n');

    // 构建示例对话（Few-shot learning）
    let exampleText = '';
    if (examples.length > 0) {
      exampleText = '\n# 示例对话\n';
      examples.forEach((ex, i) => {
        exampleText += `\nMESSAGE user ${ex.user}\n`;
        exampleText += `MESSAGE assistant ${ex.assistant}\n`;
      });
    }

    const modelfile = `FROM ${this.baseModel}

# 系统提示词 - 定义AI的角色和行为
SYSTEM """
${systemPrompt}
"""

# 温度参数 - 控制创造性（0.1 = 保守, 0.9 = 创新）
PARAMETER temperature 0.7

# Top-p 采样
PARAMETER top_p 0.9

# Top-k 采样
PARAMETER top_k 40

# 重复惩罚
PARAMETER repeat_penalty 1.1

# 上下文窗口大小
PARAMETER num_ctx 4096
${exampleText}
`;

    await fs.writeFile('./Modelfile', modelfile);
    console.log('✅ Modelfile 创建完成\n');
    console.log('内容预览:');
    console.log('─'.repeat(50));
    console.log(modelfile);
    console.log('─'.repeat(50));
    console.log('');

    return modelfile;
  }

  /**
   * 步骤3: 使用 Ollama 创建模型
   */
  async createModel() {
    console.log(`🚀 步骤3: 创建模型 ${this.modelName}...\n`);

    return new Promise((resolve, reject) => {
      const process = spawn('ollama', ['create', this.modelName, '-f', './Modelfile']);

      process.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      process.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log(`\n✅ 模型 ${this.modelName} 创建成功！\n`);
          resolve(true);
        } else {
          reject(new Error(`创建模型失败，退出码: ${code}`));
        }
      });
    });
  }

  /**
   * 步骤4: 测试模型
   */
  async testModel(testQuestions = []) {
    console.log('🧪 步骤4: 测试模型...\n');

    const defaultQuestions = [
      '你好，请介绍一下你自己',
      '你能帮我做什么？',
      '你的专业领域是什么？'
    ];

    const questions = testQuestions.length > 0 ? testQuestions : defaultQuestions;

    for (const question of questions) {
      console.log(`\n❓ 问题: ${question}`);
      console.log('─'.repeat(50));

      const response = await this.runInference(question);
      console.log(`🤖 回答: ${response}`);
      console.log('─'.repeat(50));
    }
  }

  /**
   * 运行推理
   */
  async runInference(prompt) {
    return new Promise((resolve, reject) => {
      const process = spawn('ollama', ['run', this.modelName, prompt]);

      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error('推理失败'));
        }
      });
    });
  }

  /**
   * 完整训练流程
   */
  async train(config) {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   自定义 AI 智能体训练系统               ║');
    console.log('╚════════════════════════════════════════════╝\n');

    try {
      // 1. 准备知识库
      const knowledge = await this.prepareKnowledgeBase();

      // 2. 创建 Modelfile
      await this.createModelfile(config.systemPrompt, config.examples);

      // 3. 创建模型
      await this.createModel();

      // 4. 测试模型
      await this.testModel(config.testQuestions);

      console.log('\n╔════════════════════════════════════════════╗');
      console.log('║   ✅ 训练完成！                           ║');
      console.log('╚════════════════════════════════════════════╝\n');

      console.log(`📝 你的模型名称: ${this.modelName}`);
      console.log(`\n使用你的模型：`);
      console.log(`   ollama run ${this.modelName}`);
      console.log(`\n或在代码中使用：`);
      console.log(`   import { LocalModel } from './local-model.js';`);
      console.log(`   const model = new LocalModel({`);
      console.log(`     modelType: 'ollama',`);
      console.log(`     modelName: '${this.modelName}'`);
      console.log(`   });\n`);

      return true;
    } catch (error) {
      console.error('\n❌ 训练失败:', error.message);
      console.error('\n请确保：');
      console.error('1. 已安装 Ollama: curl -fsSL https://ollama.com/install.sh | sh');
      console.error('2. Ollama 服务正在运行: ollama serve');
      console.error(`3. 基础模型已下载: ollama pull ${this.baseModel}\n`);
      throw error;
    }
  }
}

// ============== 使用示例 ==============

async function main() {
  // 配置你的AI智能体
  const trainer = new CustomModelTrainer({
    modelName: 'my-custom-ai',     // 你的模型名称
    baseModel: 'llama2',            // 基础模型
    knowledgeDir: './knowledge'     // 知识库目录
  });

  // 定义AI的角色和行为
  const trainingConfig = {
    systemPrompt: `你是一个专业的AI助手，名叫"小智"。

你的特点：
1. 友好、耐心、专业
2. 擅长解答技术问题
3. 能够提供详细的解释和示例
4. 始终以用户为中心

你的知识范围：
- 编程和软件开发
- 人工智能和机器学习
- 数据分析
- 技术咨询

回答规则：
- 简洁明了，避免冗长
- 提供实际可行的建议
- 必要时给出代码示例
- 不确定时诚实说明`,

    // 示例对话（教模型如何回答）
    examples: [
      {
        user: '你好，你是谁？',
        assistant: '你好！我是小智，一个专业的AI助手。我擅长技术领域的问题，包括编程、AI、数据分析等。有什么我可以帮助你的吗？'
      },
      {
        user: '如何学习Python？',
        assistant: '学习Python的建议步骤：1. 从基础语法开始 2. 做小项目练习 3. 学习常用库（如NumPy、Pandas）4. 参与开源项目。需要具体的学习资源吗？'
      },
      {
        user: '谢谢！',
        assistant: '不客气！很高兴能帮到你。如果还有其他问题，随时问我！'
      }
    ],

    // 测试问题
    testQuestions: [
      '你好，请介绍一下你自己',
      '你擅长什么领域？',
      '如何开始学习机器学习？'
    ]
  };

  // 开始训练
  await trainer.train(trainingConfig);
}

// 运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { CustomModelTrainer };
