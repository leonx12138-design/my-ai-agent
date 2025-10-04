/**
 * API 客户端调用示例
 */

// ============= 示例1: 基本对话 =============
async function example1_basicChat() {
  console.log('=== 示例1: 基本对话 ===\n');

  const apiKey = 'your-api-key-here';  // 替换为你的API密钥

  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      message: '你好，请介绍一下你自己'
    })
  });

  const data = await response.json();
  console.log('AI回复:', data.response);
  console.log('用量信息:', data.usage);
  console.log('\n');
}

// ============= 示例2: 带上下文的对话 =============
async function example2_contextualChat() {
  console.log('=== 示例2: 带上下文的对话 ===\n');

  const apiKey = 'your-api-key-here';

  let conversationHistory = [];

  // 第一轮对话
  let response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      message: '我的名字是小明',
      history: conversationHistory
    })
  });

  let data = await response.json();
  console.log('用户: 我的名字是小明');
  console.log('AI:', data.response);

  // 更新对话历史
  conversationHistory = data.conversationHistory;

  // 第二轮对话（测试记忆）
  response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      message: '你记得我的名字吗？',
      history: conversationHistory
    })
  });

  data = await response.json();
  console.log('用户: 你记得我的名字吗？');
  console.log('AI:', data.response);
  console.log('\n');
}

// ============= 示例3: 查询用量 =============
async function example3_checkUsage() {
  console.log('=== 示例3: 查询用量 ===\n');

  const apiKey = 'your-api-key-here';

  const response = await fetch('http://localhost:3000/api/usage', {
    method: 'GET',
    headers: {
      'X-API-Key': apiKey
    }
  });

  const data = await response.json();
  console.log('用量统计:');
  console.log(`- 总请求数: ${data.requestCount}`);
  console.log(`- 总费用: ¥${data.totalCost.toFixed(4)}`);
  console.log(`- 配额: ${data.quota}`);
  console.log(`- 剩余: ${data.remaining}`);
  console.log('\n');
}

// ============= 示例4: 错误处理 =============
async function example4_errorHandling() {
  console.log('=== 示例4: 错误处理 ===\n');

  // 测试无效的API密钥
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'invalid-key'
      },
      body: JSON.stringify({
        message: '测试消息'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.log('错误:', data.error);
    }
  } catch (error) {
    console.log('请求失败:', error.message);
  }

  console.log('\n');
}

// ============= 示例5: 批量对话（并发） =============
async function example5_batchChat() {
  console.log('=== 示例5: 批量对话 ===\n');

  const apiKey = 'your-api-key-here';
  const messages = [
    '什么是人工智能？',
    '什么是机器学习？',
    '什么是深度学习？'
  ];

  const promises = messages.map(message =>
    fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({ message })
    }).then(res => res.json())
  );

  const results = await Promise.all(promises);

  results.forEach((data, index) => {
    console.log(`Q${index + 1}: ${messages[index]}`);
    console.log(`A${index + 1}: ${data.response}\n`);
  });
}

// ============= Python 示例代码 =============
const pythonExample = `
# Python 客户端示例

import requests

# 配置
API_KEY = "your-api-key-here"
BASE_URL = "http://localhost:3000"

def chat(message, history=None):
    """发送消息到AI"""
    response = requests.post(
        f"{BASE_URL}/api/chat",
        headers={
            "Content-Type": "application/json",
            "X-API-Key": API_KEY
        },
        json={
            "message": message,
            "history": history or []
        }
    )
    return response.json()

def check_usage():
    """查询用量"""
    response = requests.get(
        f"{BASE_URL}/api/usage",
        headers={"X-API-Key": API_KEY}
    )
    return response.json()

# 使用示例
if __name__ == "__main__":
    # 对话
    result = chat("你好！")
    print("AI:", result["response"])

    # 查询用量
    usage = check_usage()
    print(f"已使用: {usage['requestCount']}/{usage['quota']}")
`;

// ============= cURL 示例代码 =============
const curlExample = `
# cURL 示例

# 1. 发送对话请求
curl -X POST http://localhost:3000/api/chat \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key-here" \\
  -d '{"message": "你好，世界！"}'

# 2. 查询用量
curl -X GET http://localhost:3000/api/usage \\
  -H "X-API-Key: your-api-key-here"

# 3. 创建API密钥（需要管理员权限）
curl -X POST http://localhost:3000/api/keys/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "adminSecret": "your-admin-secret",
    "userId": "user123",
    "quota": 1000
  }'
`;

// 运行示例
async function runExamples() {
  console.log('\n🚀 AI Agent API 客户端示例\n');
  console.log('=' * 50 + '\n');

  console.log('⚠️  请先确保：');
  console.log('1. API服务器正在运行（npm run server）');
  console.log('2. 已创建API密钥');
  console.log('3. 将代码中的 "your-api-key-here" 替换为实际的API密钥\n');

  console.log('Python 示例代码:');
  console.log(pythonExample);
  console.log('\n');

  console.log('cURL 示例:');
  console.log(curlExample);
  console.log('\n');

  // 取消注释以运行JavaScript示例
  // await example1_basicChat();
  // await example2_contextualChat();
  // await example3_checkUsage();
  // await example4_errorHandling();
  // await example5_batchChat();
}

// 导出示例函数
export {
  example1_basicChat,
  example2_contextualChat,
  example3_checkUsage,
  example4_errorHandling,
  example5_batchChat
};

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}
`;

console.log('客户端示例已创建！运行 node example-client.js 查看使用说明');
