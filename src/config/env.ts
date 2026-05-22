import dotenv from 'dotenv';
import {compose} from "node:stream";

dotenv.config();

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const env = {
    uiBaseUrl: getRequiredEnv('UI_BASE_URL'),
  //  apiBaseUrl: getRequiredEnv('API_BASE_URL'),
    headless: process.env.HEADLESS !== 'false',
    timeout: Number(process.env.TIMEOUT ?? 30000)
};