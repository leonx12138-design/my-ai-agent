/**
 * SQLite 数据库管理
 */

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export class Database {
  constructor(filename = './data.db') {
    this.filename = filename;
    this.db = null;
  }

  /**
   * 初始化数据库连接和表结构
   */
  async init() {
    this.db = await open({
      filename: this.filename,
      driver: sqlite3.Database
    });

    // 创建API密钥表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_key TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL,
        quota INTEGER DEFAULT 1000,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )
    `);

    // 创建用量记录表
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS usage_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        input_tokens INTEGER,
        output_tokens INTEGER,
        cost REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建用户表（可选）
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_quota INTEGER DEFAULT 1000
      )
    `);

    console.log('✅ 数据库表初始化完成');
  }

  /**
   * 获取数据库连接
   */
  getConnection() {
    return this.db;
  }

  /**
   * 关闭数据库连接
   */
  async close() {
    if (this.db) {
      await this.db.close();
    }
  }
}
