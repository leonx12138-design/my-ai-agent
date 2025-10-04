# 🎓 完全定制AI智能体训练指南

## 📋 目标

创建一个**完全属于你自己**的AI智能体，使用你的知识库进行训练，独立部署运行。

---

## 🚀 快速开始（5分钟）

### 步骤1: 安装 Ollama

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 下载并安装: https://ollama.com/download/windows
```

### 步骤2: 下载基础模型

```bash
# 下载 Llama2 (7B) - 英文模型
ollama pull llama2

# 或下载 Qwen (7B) - 中文优化模型（推荐）
ollama pull qwen:7b

# 或下载更小的模型（4GB内存即可运行）
ollama pull llama2:7b-chat-q4_0
```

### 步骤3: 准备你的知识库

在 `knowledge/` 目录下创建你的知识文件：

```bash
cd my-ai-agent
mkdir -p knowledge
```

创建文件例如 `knowledge/my-knowledge.txt`：

```text
=== 关于我 ===
我是一个专业的[你的领域]专家。

=== 我的服务 ===
1. 提供[服务1]
2. 解答[服务2]
3. 帮助[服务3]

=== 常见问题 ===
Q: [问题1]
A: [回答1]

Q: [问题2]
A: [回答2]

=== 对话示例 ===
用户：你好
我：你好！我是[你的名字]，很高兴为你服务。

用户：你能做什么？
我：我可以帮你[具体服务内容]。
```

### 步骤4: 运行训练脚本

```bash
node train-custom-model.js
```

### 步骤5: 测试你的模型

```bash
ollama run my-custom-ai
```

---

## 📚 详细教程

### 一、理解训练原理

Ollama 使用 **Modelfile** 来定义模型行为，类似 Dockerfile。通过 Modelfile，你可以：

1. **选择基础模型** - 如 llama2, qwen, mistral
2. **定义系统提示词** - 告诉AI它的角色和行为规则
3. **提供示例对话** - 教AI如何回答（Few-shot learning）
4. **调整参数** - 温度、采样策略等

**这不是传统意义上的"训练"**（不需要GPU和大量计算），而是通过**提示工程**和**Few-shot学习**来定制模型行为。

---

### 二、准备高质量知识库

#### 2.1 知识文件格式

支持的格式：
- `.txt` - 纯文本
- `.md` - Markdown

#### 2.2 知识组织建议

```
knowledge/
├── 01-intro.txt          # 基础介绍
├── 02-products.txt       # 产品/服务信息
├── 03-faq.txt           # 常见问题
├── 04-examples.txt      # 对话示例
└── 05-policies.txt      # 规则和政策
```

#### 2.3 知识内容示例

**好的示例：**
```text
=== 产品介绍 ===
我们的AI助手可以：
1. 24/7在线回答问题
2. 提供技术支持
3. 处理客户咨询

价格：
- 基础版：¥9.9/月
- 专业版：¥79/月
```

**不好的示例：**
```text
我们很好，买吧。
```

---

### 三、编写系统提示词

系统提示词（System Prompt）是定义AI性格和行为的关键。

#### 3.1 基本结构

```text
你是[角色名称]，[角色定位]。

你的特点：
1. [特点1]
2. [特点2]
3. [特点3]

你的知识范围：
- [领域1]
- [领域2]

回答规则：
- [规则1]
- [规则2]
```

#### 3.2 示例：客服机器人

```text
你是"小智"，一个专业的客服助手。

你的特点：
1. 友好、耐心、专业
2. 快速响应用户需求
3. 善于解决问题

你的知识范围：
- 产品功能和使用
- 常见问题解答
- 售前售后咨询

回答规则：
- 简洁明了，不超过3段
- 主动提供解决方案
- 不确定时礼貌说明并提供联系方式
- 始终保持礼貌和专业
```

#### 3.3 示例：技术助手

```text
你是一个Python编程专家。

专长：
- Python语法和最佳实践
- 数据科学库（Pandas, NumPy）
- Web开发（Flask, Django）

回答风格：
- 提供可运行的代码示例
- 解释每行代码的作用
- 指出常见陷阱和注意事项
```

---

### 四、提供示例对话

示例对话教会模型如何回答，这是最重要的训练数据！

#### 4.1 格式

```javascript
examples: [
  {
    user: '用户说的话',
    assistant: 'AI的回答'
  },
  // ... 更多示例
]
```

#### 4.2 建议

- **至少提供10-20个示例**
- **覆盖不同场景**（问候、询问、感谢、投诉等）
- **展示理想的回答方式**
- **保持风格一致**

#### 4.3 完整示例

```javascript
examples: [
  {
    user: '你好',
    assistant: '你好！我是小智，很高兴为你服务。请问有什么我可以帮助你的？'
  },
  {
    user: '你们的产品多少钱？',
    assistant: '我们有三个套餐：\n- 基础版：¥9.9/月\n- 专业版：¥79/月\n- 企业版：¥999/月\n您需要哪个版本呢？'
  },
  {
    user: '我的订单什么时候发货？',
    assistant: '请提供您的订单号，我帮您查询发货状态。订单号通常在订单确认邮件中。'
  },
  {
    user: '不好用，我要退款',
    assistant: '非常抱歉给您带来不好的体验。我们支持7天无理由退款。请提供您的订单号和退款原因，我会立即为您处理。'
  },
  {
    user: '谢谢你的帮助',
    assistant: '不客气！很高兴能帮到您。如果还有其他问题，随时欢迎您回来咨询。祝您生活愉快！'
  }
]
```

---

### 五、高级定制

#### 5.1 调整温度参数

```javascript
PARAMETER temperature 0.7
```

- `0.0 - 0.3`: 非常保守，适合客服、法律咨询
- `0.4 - 0.7`: 平衡，适合大多数场景
- `0.8 - 1.0`: 创造性强，适合创意写作

#### 5.2 修改训练脚本

编辑 `train-custom-model.js`：

```javascript
const trainer = new CustomModelTrainer({
  modelName: 'my-business-bot',    // 改为你的模型名
  baseModel: 'qwen:7b',             // 选择基础模型
  knowledgeDir: './knowledge'
});

const trainingConfig = {
  systemPrompt: `你是...`,  // 你的系统提示词

  examples: [
    // 你的示例对话
  ],

  testQuestions: [
    // 测试问题
  ]
};
```

---

### 六、完整训练流程

#### 6.1 准备阶段

```bash
# 1. 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. 启动 Ollama 服务
ollama serve

# 3. 下载基础模型（另开一个终端）
ollama pull qwen:7b
```

#### 6.2 准备知识库

```bash
# 创建知识文件
cd my-ai-agent/knowledge
nano business-knowledge.txt
# 粘贴你的知识内容，Ctrl+O 保存，Ctrl+X 退出
```

#### 6.3 配置训练脚本

```bash
# 编辑训练脚本
nano train-custom-model.js
# 修改 modelName, systemPrompt, examples
```

#### 6.4 执行训练

```bash
node train-custom-model.js
```

输出示例：
```
╔════════════════════════════════════════════╗
║   自定义 AI 智能体训练系统               ║
╚════════════════════════════════════════════╝

📚 步骤1: 准备知识库...
✓ 已加载: business-knowledge.txt (1234 字符)
✅ 共加载 1 个知识文件

🔧 步骤2: 创建模型定义文件...
✅ Modelfile 创建完成

🚀 步骤3: 创建模型 my-business-bot...
✅ 模型 my-business-bot 创建成功！

🧪 步骤4: 测试模型...
❓ 问题: 你好，请介绍一下你自己
🤖 回答: 你好！我是[你的AI名字]...

✅ 训练完成！
```

#### 6.5 测试模型

```bash
# 命令行测试
ollama run my-business-bot

# 在代码中使用
import { LocalModel } from './local-model.js';

const model = new LocalModel({
  modelType: 'ollama',
  modelName: 'my-business-bot'
});

const response = await model.generate([
  { role: 'user', content: '你好！' }
]);

console.log(response);
```

---

### 七、集成到API服务器

#### 7.1 修改 `.env`

```env
USE_LOCAL_MODEL=true
LOCAL_MODEL_TYPE=ollama
LOCAL_MODEL_NAME=my-business-bot
```

#### 7.2 更新 agent-exported.js

确保使用本地模型：

```javascript
if (this.useLocalModel) {
  const localModel = new LocalModel({
    modelType: this.localModelType,
    modelName: this.localModelPath
  });

  return await localModel.generate(this.conversationHistory);
}
```

#### 7.3 启动服务器

```bash
npm run server
```

现在你的API将使用你自己训练的模型！

---

### 八、持续优化

#### 8.1 收集反馈

记录用户对话，找出回答不好的地方。

#### 8.2 更新知识库

在 `knowledge/` 添加新知识文件。

#### 8.3 重新训练

```bash
# 删除旧模型
ollama rm my-business-bot

# 重新训练
node train-custom-model.js
```

#### 8.4 A/B 测试

创建多个版本：
```bash
node train-custom-model.js  # my-business-bot-v1
# 修改配置
node train-custom-model.js  # my-business-bot-v2
```

测试后选择最优版本。

---

### 九、成本和性能

#### 9.1 硬件要求

| 模型大小 | 内存需求 | 推荐配置 |
|---------|---------|---------|
| 7B-Q4 | 4GB | 最低配置 |
| 7B | 8GB | 推荐配置 |
| 13B | 16GB | 高性能 |

#### 9.2 成本对比

**云端API（智谱GLM-4）：**
- 按用量付费
- 每次调用约 ¥0.001-0.01
- 1000次调用约 ¥1-10

**本地模型（Ollama）：**
- 一次性硬件成本
- 无限次调用
- 服务器：¥200-500/月

**建议：**
- 流量小（< 1000次/天）：用云端API
- 流量大（> 1000次/天）：用本地模型

---

### 十、常见问题

#### Q: 训练需要多长时间？
A: 使用 Ollama 的方式不需要真正的"训练"，创建模型只需几秒钟。

#### Q: 需要GPU吗？
A: 不需要！Ollama 可以在CPU上运行（虽然GPU会更快）。

#### Q: 模型会变聪明吗？
A: Modelfile方式不会改变模型参数，但会改变行为。要真正训练参数需要使用LoRA等方法。

#### Q: 如何让模型更准确？
A: 1. 提供更多高质量示例 2. 优化系统提示词 3. 使用更大的基础模型

#### Q: 支持中文吗？
A: 支持！推荐使用 `qwen:7b` 作为基础模型，对中文支持更好。

---

### 十一、下一步

1. **尝试不同基础模型**
   ```bash
   ollama pull mistral
   ollama pull codellama
   ```

2. **学习高级 Modelfile 语法**
   - https://github.com/ollama/ollama/blob/main/docs/modelfile.md

3. **实现真正的微调（LoRA）**
   - 需要GPU
   - 使用 Hugging Face transformers
   - 参考：https://huggingface.co/docs/peft

---

## 🎉 完成！

现在你拥有了一个**完全属于自己**的AI智能体！

**接下来做什么？**
1. 测试和优化你的模型
2. 集成到API服务器
3. 部署到生产环境
4. 开始商业化运营

祝你成功！🚀
