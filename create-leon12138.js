/**
 * 创建 leon12138 AI智能体
 * 完全基于你的数据训练的自定义模型
 */

import { CustomModelTrainer } from './train-custom-model.js';

async function createLeon12138() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        创建 leon12138 AI智能体               ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  // 创建训练器
  const trainer = new CustomModelTrainer({
    modelName: 'leon12138',          // 模型名称
    baseModel: 'qwen:7b',             // 基础模型（中文优化）
    knowledgeDir: './knowledge'       // 知识库目录
  });

  // 定义 leon12138 的配置
  const config = {
    // 系统提示词 - 定义 leon12138 的角色和行为
    systemPrompt: `你是 leon12138，一个专业的AI智能体助手。

你的核心能力：
1. 深入理解用户需求，提供精准的解决方案
2. 基于你学习的知识库回答问题
3. 保持专业、高效、友好的交流风格
4. 在不确定时诚实说明，不编造信息

你的特点：
- 思维清晰，逻辑严密
- 回答简洁有力，直击要点
- 善于举例说明，让复杂问题简单化
- 始终以用户价值为中心

回答规则：
- 简洁明了，避免冗长废话
- 优先提供可执行的方案
- 必要时给出代码或具体步骤
- 使用项目符号组织信息
- 不确定时明确说明并提供查询方式

知识来源：
你的所有知识都来自 knowledge/ 目录下的训练数据，这是你独有的专业知识库。`,

    // 示例对话 - 教 leon12138 如何回答
    examples: [
      {
        user: '你好，你是谁？',
        assistant: '你好！我是 leon12138，一个基于定制化训练的AI智能体。我的知识来自专门的训练数据，可以为你提供专业的帮助。请问有什么我可以帮你的？'
      },
      {
        user: '你和其他AI有什么不同？',
        assistant: '主要区别：\n1. 我基于特定知识库训练，专业性更强\n2. 我的回答更符合特定领域需求\n3. 我可以本地部署，数据更安全\n4. 我完全可定制，可以持续学习新知识'
      },
      {
        user: '你能做什么？',
        assistant: '我可以：\n• 回答专业领域问题\n• 提供技术支持和咨询\n• 帮助分析和解决问题\n• 基于知识库提供准确信息\n\n具体能力取决于我的训练数据。你想了解哪方面？'
      },
      {
        user: '如何使用你的服务？',
        assistant: '使用方式：\n1. 直接对话（ollama run leon12138）\n2. API接口调用\n3. 集成到应用中\n\n需要我详细说明哪种方式？'
      },
      {
        user: '我不太理解',
        assistant: '没关系，让我换个方式解释。[然后用更简单的语言重新说明]。这样理解了吗？如果还有疑问，请告诉我哪部分不清楚。'
      },
      {
        user: '谢谢你',
        assistant: '不客气！很高兴能帮到你。有其他问题随时问我。'
      }
    ],

    // 测试问题
    testQuestions: [
      '你好，请介绍一下自己',
      '你的优势是什么？',
      '如何使用你的服务？'
    ]
  };

  try {
    // 开始训练
    await trainer.train(config);

    console.log('\n🎉 leon12138 创建成功！\n');
    console.log('━'.repeat(60));
    console.log('\n📝 使用方法：\n');
    console.log('1. 命令行对话：');
    console.log('   ollama run leon12138\n');
    console.log('2. 在代码中使用：');
    console.log('   ```javascript');
    console.log('   import { LocalModel } from \'./local-model.js\';');
    console.log('');
    console.log('   const leon = new LocalModel({');
    console.log('     modelType: \'ollama\',');
    console.log('     modelName: \'leon12138\'');
    console.log('   });');
    console.log('');
    console.log('   const response = await leon.generate([');
    console.log('     { role: \'user\', content: \'你好！\' }');
    console.log('   ]);');
    console.log('   ```\n');
    console.log('3. 集成到API服务器：');
    console.log('   修改 .env 文件：');
    console.log('   USE_LOCAL_MODEL=true');
    console.log('   LOCAL_MODEL_NAME=leon12138\n');
    console.log('━'.repeat(60));
    console.log('\n💡 提示：\n');
    console.log('• 在 knowledge/ 目录添加你的专业知识文件');
    console.log('• 重新运行此脚本更新模型');
    console.log('• 使用 ollama rm leon12138 删除旧版本\n');

  } catch (error) {
    console.error('\n❌ 创建失败:', error.message);
    console.error('\n请检查：');
    console.error('1. Ollama 是否已安装');
    console.error('   安装命令: curl -fsSL https://ollama.com/install.sh | sh\n');
    console.error('2. Ollama 服务是否运行');
    console.error('   启动命令: ollama serve\n');
    console.error('3. 基础模型是否已下载');
    console.error('   下载命令: ollama pull qwen:7b\n');
    process.exit(1);
  }
}

// 运行
createLeon12138();
