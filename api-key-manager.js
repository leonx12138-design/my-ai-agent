/**
 * API密钥管理系统
 */

import crypto from 'crypto';

export class ApiKeyManager {
  constructor(database) {
    this.db = database;
  }

  /**
   * 生成新的API密钥
   */
  generateKey() {
    return 'sk-' + crypto.randomBytes(32).toString('hex');
  }

  /**
   * 创建新的API密钥
   */
  async createKey(userId, quota = 1000) {
    const apiKey = this.generateKey();
    const db = this.db.getConnection();

    await db.run(
      'INSERT INTO api_keys (api_key, user_id, quota) VALUES (?, ?, ?)',
      [apiKey, userId, quota]
    );

    return apiKey;
  }

  /**
   * 验证API密钥
   */
  async validateKey(apiKey) {
    const db = this.db.getConnection();

    const result = await db.get(
      'SELECT * FROM api_keys WHERE api_key = ? AND is_active = 1',
      [apiKey]
    );

    if (!result) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: result.user_id,
      quota: result.quota,
      createdAt: result.created_at
    };
  }

  /**
   * 禁用API密钥
   */
  async deactivateKey(apiKey) {
    const db = this.db.getConnection();

    await db.run(
      'UPDATE api_keys SET is_active = 0 WHERE api_key = ?',
      [apiKey]
    );
  }

  /**
   * 更新配额
   */
  async updateQuota(apiKey, newQuota) {
    const db = this.db.getConnection();

    await db.run(
      'UPDATE api_keys SET quota = ? WHERE api_key = ?',
      [newQuota, apiKey]
    );
  }

  /**
   * 获取用户的所有密钥
   */
  async getUserKeys(userId) {
    const db = this.db.getConnection();

    return await db.all(
      'SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }
}
