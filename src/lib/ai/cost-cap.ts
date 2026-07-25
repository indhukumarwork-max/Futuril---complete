// src/lib/ai/cost-cap.ts
const dailyCountMap = new Map<string, { count: number; date: string }>();
const MAX_DAILY_REQUESTS = 50;

export async function checkDailyCap(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const userCap = dailyCountMap.get(userId);

  if (!userCap || userCap.date !== today) {
    dailyCountMap.set(userId, { count: 1, date: today });
    return;
  }

  if (userCap.count >= MAX_DAILY_REQUESTS) {
    throw new Error('Daily AI request cap reached');
  }

  userCap.count += 1;
}
