/**
 * h2A 简化版异步消息队列
 * 基于 Claude Code 逆向分析的核心设计
 */

export class MessageQueue {
  constructor() {
    this.buffer = [];
    this.readResolve = null;
    this.isDone = false;
  }

  /**
   * 入队消息 - 核心的双路径机制
   */
  enqueue(message) {
    // 策略1: 零延迟路径 - 直接传递给等待的读取者
    if (this.readResolve) {
      const callback = this.readResolve;
      this.readResolve = null;
      callback({ done: false, value: message });
      return;
    }

    // 策略2: 缓冲路径 - 存储到队列
    this.buffer.push(message);
  }

  /**
   * 异步读取消息
   */
  async next() {
    // 策略1: 快速路径 - 从缓冲区直接取
    if (this.buffer.length > 0) {
      return { done: false, value: this.buffer.shift() };
    }

    // 策略2: 队列完成
    if (this.isDone) {
      return { done: true, value: undefined };
    }

    // 策略3: 等待新消息
    return new Promise((resolve) => {
      this.readResolve = resolve;
    });
  }

  /**
   * 标记队列完成
   */
  done() {
    this.isDone = true;
    if (this.readResolve) {
      this.readResolve({ done: true, value: undefined });
      this.readResolve = null;
    }
  }

  /**
   * 实现 AsyncIterator 协议
   */
  [Symbol.asyncIterator]() {
    return this;
  }
}
