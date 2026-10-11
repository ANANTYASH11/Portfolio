import { useState, useEffect, useCallback } from "react";
import snapshotData from "../../data/activity-snapshot.json";

export interface GithubDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

export interface GithubWeek {
  contributionDays: GithubDay[];
}

export interface TopLanguage {
  name: string;
  percentage: number;
  color?: string;
}

export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language?: {
    name: string;
    color?: string;
  } | null;
}

export interface GithubActivity {
  totalContributions: number;
  weeks: GithubWeek[];
  currentStreak: number;
  longestStreak: number;
  topLanguages: TopLanguage[];
  pinnedRepositories?: PinnedRepo[];
  source?: "live" | "snapshot";
  fetchedAt?: string;
}

export interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  difficulty?: string;
}

export interface TopTopic {
  name: string;
  count: number;
}

export interface LeetcodeActivity {
  totalSolved: number;
  totalQuestions?: number;
  totalEasy?: number;
  totalMedium?: number;
  totalHard?: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
  streak: number;
  totalSubmissions?: number;
  totalActiveDays?: number;
  contestRating?: number | null;
  calendar: Record<string, number>;
  recentSubmissions?: RecentSubmission[];
  topTopics?: TopTopic[];
  source?: "live" | "snapshot";
  fetchedAt?: string;
}

export interface ActivityState {
  github: GithubActivity;
  leetcode: LeetcodeActivity;
  isLoading: boolean;
  isRetrying: boolean;
  source: "live" | "snapshot";
  lastUpdated: string;
  error: string | null;
  refetch: () => Promise<void>;
}

export function formatTimeAgo(isoString?: string): string {
  if (!isoString) return "2h ago";
  const then = new Date(isoString).getTime();
  if (isNaN(then)) return isoString;
  const now = Date.now();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export function useActivity(): ActivityState {
  const [data, setData] = useState<{
    github: GithubActivity;
    leetcode: LeetcodeActivity;
    isLoading: boolean;
    isRetrying: boolean;
    source: "live" | "snapshot";
    lastUpdated: string;
    error: string | null;
  }>({
    github: snapshotData.github as unknown as GithubActivity,
    leetcode: snapshotData.leetcode as unknown as LeetcodeActivity,
    isLoading: true,
    isRetrying: false,
    source: "snapshot",
    lastUpdated: snapshotData.lastUpdated || "10 Oct 2026",
    error: null,
  });

  const fetchActivities = useCallback(async (isRetry = false) => {
    if (isRetry) {
      setData((prev) => ({ ...prev, isRetrying: true, error: null }));
    }

    try {
      const [ghRes, lcRes] = await Promise.allSettled([
        fetch("/api/github").then((r) => (r.ok ? r.json() : Promise.reject(r.statusText))),
        fetch("/api/leetcode").then((r) => (r.ok ? r.json() : Promise.reject(r.statusText))),
      ]);

      let ghData: GithubActivity = snapshotData.github as unknown as GithubActivity;
      let lcData: LeetcodeActivity = snapshotData.leetcode as unknown as LeetcodeActivity;

      let ghIsLive = false;
      let lcIsLive = false;
      let latestIso = "";

      if (ghRes.status === "fulfilled" && ghRes.value && !ghRes.value.error && ghRes.value.weeks) {
        ghData = ghRes.value;
        if (ghRes.value.source === "live") {
          ghIsLive = true;
          latestIso = ghRes.value.fetchedAt || "";
        }
      }

      if (lcRes.status === "fulfilled" && lcRes.value && !lcRes.value.error && lcRes.value.totalSolved) {
        lcData = lcRes.value;
        if (lcRes.value.source === "live") {
          lcIsLive = true;
          if (!latestIso) latestIso = lcRes.value.fetchedAt || "";
        }
      }

      // Truly live ONLY if both or at least one is live and the other is healthy
      // Cyan MUST never appear on snapshot/stale data
      const isGenuineLive = ghIsLive && lcIsLive;
      const formattedTimestamp = isGenuineLive
        ? `Updated ${formatTimeAgo(latestIso)}`
        : (snapshotData.lastUpdated || "10 Oct 2026");

      setData({
        github: ghData,
        leetcode: lcData,
        isLoading: false,
        isRetrying: false,
        source: isGenuineLive ? "live" : "snapshot",
        lastUpdated: formattedTimestamp,
        error: null,
      });
    } catch (err: unknown) {
      setData({
        github: snapshotData.github as unknown as GithubActivity,
        leetcode: snapshotData.leetcode as unknown as LeetcodeActivity,
        isLoading: false,
        isRetrying: false,
        source: "snapshot",
        lastUpdated: snapshotData.lastUpdated || "10 Oct 2026",
        error: (err as Error).message || "Failed to load live data",
      });
    }
  }, []);

  useEffect(() => {
    fetchActivities(false);
  }, [fetchActivities]);

  return {
    ...data,
    refetch: () => fetchActivities(true),
  };
}

export default useActivity;
