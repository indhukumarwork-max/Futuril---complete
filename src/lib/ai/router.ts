// src/lib/ai/router.ts
/**
 * AI router middleware – determines which model to use for a given feature,
 * applies caching, cost‑cap enforcement and usage logging.
 *
 * This is a lightweight mock implementation; in production you would replace
 * `mockAIRequest` with a real call to an LLM provider (OpenAI, Anthropic, etc.).
 */
import { supabaseAdmin } from '@/src/lib/supabase/server';
import { getCachedResponse, setCachedResponse } from './cache';
import { checkDailyCap } from './cost-cap';
import { buildContext } from './context-builder';
import crypto from 'crypto';

// Simple tier mapping – can be extended per‑feature.
const FEATURE_TIER_MAP: Record<string, 'cheap' | 'capable'> = {
  default: 'cheap', // fallback
  // Add specific feature mappings here, e.g.:
  // careerDna: 'capable',
};

// Model selection per tier.
const TIER_MODEL_MAP: Record<string, string> = {
  cheap: 'gpt-3.5-turbo',
  capable: 'gpt-4',
};

// Mock token/cost calculations – in a real system you would use model tokenizers.
const MODEL_COST: Record<string, number> = {
  'gpt-3.5-turbo': 0.002, // $ per 1k tokens (example)
  'gpt-4': 0.03,
};

/**
 * Mock AI request – simply echoes the prompt with model information.
 * Replace this with actual LLM client logic.
 */
async function mockAIRequest(model: string, prompt: string, context: string): Promise<string> {
  // Simulate token usage: 1 token per word.
  const tokens = prompt.split(/\s+/).length + context.split(/\s+/).length;
  // Simple deterministic response for testing.
  return `Model:${model}|Tokens:${tokens}|Response:${prompt}`;
}

/**
 * Main entry point used by API routes.
 */
export async function callAI(feature: string, prompt: string, userId: string): Promise<string> {
  // 1️⃣ Enforce daily request cap.
  await checkDailyCap(userId);

  // 2️⃣ Determine model tier.
  const tier = FEATURE_TIER_MAP[feature] ?? FEATURE_TIER_MAP['default'];
  const model = TIER_MODEL_MAP[tier] ?? TIER_MODEL_MAP['cheap'];

  // 3️⃣ Build cache key (hash of feature+prompt+userId).
  const hash = crypto.createHash('sha256').update(`${feature}|${prompt}|${userId}`).digest('hex');
  const cached = getCachedResponse(hash);
  if (cached) {
    return cached;
  }

  // 4️⃣ Assemble context (currently a placeholder).
  const context = await buildContext(userId);

  // 5️⃣ Call the (mock) AI provider.
  const response = await mockAIRequest(model, prompt, context);

  // 6️⃣ Cache the response for future identical calls.
  setCachedResponse(hash, response);

  // 7️⃣ Log usage to the database.
  const tokenCount = prompt.split(/\s+/).length + context.split(/\s+/).length;
  const cost = (MODEL_COST[model] ?? 0) * (tokenCount / 1000);
  await supabaseAdmin.from('ai_usage_log').insert({
    user_id: userId,
    feature,
    model,
    tokens: tokenCount,
    cost,
  });

  return response;
}
