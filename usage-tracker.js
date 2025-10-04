/**
 * 用量追踪和计费系统
 */

export class UsageTracker {
  constructor(database) {
    this.db = database;
    // 定价：每1000个token的价格（CNY）
    this.pricing = {
      inputPerK: 0.001,   // 输入token价格
      outputPerK: 0.002   // 输出token价格
    };
  }

  /**
   * 计算费用
   */
  calculateCost(inputTokens, outputTokens) {
    const inputCost = (inputTokens / 1000) * this.pricing.inputPerK;
    const outputCost = (outputTokens / 1000) * this.pricing.outputPerK;
    return inputCost + outputCost;
  }

  /**
   * 记录单次使用
   */
  async recordUsage(userId, inputTokens, outputTokens) {
    const cost = this.calculateCost(inputTokens, outputTokens);
    const db = this.db.getConnection();

    await db.run(
      'INSERT INTO usage_records (user_id, input_tokens, output_tokens, cost) VALUES (?, ?, ?, ?)',
      [userId, inputTokens, outputTokens, cost]
    );

    return cost;
  }

  /**
   * 获取用户总用量
   */
  async getUsage(userId) {
    const db = this.db.getConnection();

    const result = await db.get(
      `SELECT
        COUNT(*) as requestCount,
        SUM(input_tokens) as totalInputTokens,
        SUM(output_tokens) as totalOutputTokens,
        SUM(cost) as totalCost
      FROM usage_records
      WHERE user_id = ?`,
      [userId]
    );

    return {
      requestCount: result.requestCount || 0,
      totalInputTokens: result.totalInputTokens || 0,
      totalOutputTokens: result.totalOutputTokens || 0,
      totalCost: result.totalCost || 0
    };
  }

  /**
   * 获取用户使用记录（带分页）
   */
  async getUserRecords(userId, limit = 100, offset = 0) {
    const db = this.db.getConnection();

    return await db.all(
      `SELECT * FROM usage_records
       WHERE user_id = ?
       ORDER BY timestamp DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
  }

  /**
   * 获取时间范围内的用量
   */
  async getUsageByDateRange(userId, startDate, endDate) {
    const db = this.db.getConnection();

    const result = await db.get(
      `SELECT
        COUNT(*) as requestCount,
        SUM(cost) as totalCost
      FROM usage_records
      WHERE user_id = ?
        AND timestamp BETWEEN ? AND ?`,
      [userId, startDate, endDate]
    );

    return result;
  }

  /**
   * 设置定价策略
   */
  setPricing(inputPerK, outputPerK) {
    this.pricing.inputPerK = inputPerK;
    this.pricing.outputPerK = outputPerK;
  }
}
