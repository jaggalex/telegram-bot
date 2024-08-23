// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN || '';

export const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;

export const DOMA_STICKER = process.env.DOMA_STICKER || '';