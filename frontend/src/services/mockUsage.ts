import type { UsageStats } from '@/types/usage'

const usage: UsageStats = {
  booksUsed: 4,
  booksLimit: 10,
  questionsToday: 18,
  questionsLimit: 50,
}

// Will become: axios.get<UsageStats>('/usage/me').then(res => res.data)
export function getUsageStats(): UsageStats {
  return usage
}