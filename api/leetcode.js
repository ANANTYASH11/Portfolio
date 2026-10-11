import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // CORS & Cache headers: 6 hours cache (21600s), stale-while-revalidate 12 hours (43200s)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=43200");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const username = "ANANTYASH11";

  // Helper to read fallback snapshot
  const readFallback = (reason) => {
    if (reason) {
      console.error("[api/leetcode] Fallback triggered due to:", reason);
    }
    try {
      const candidates = [
        path.join(process.cwd(), "src/data/activity-snapshot.json"),
        path.join(process.cwd(), "data/activity-snapshot.json"),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, "utf-8");
          const parsed = JSON.parse(raw);
          return {
            source: "snapshot",
            fetchedAt: parsed.lastUpdated || "10 Oct 2026",
            ...parsed.leetcode,
          };
        }
      }
    } catch (e) {
      console.error("[api/leetcode] Error reading snapshot fallback:", e);
    }
    return null;
  };

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        submissionCalendar
        profile {
          ranking
        }
        tagProblemCounts {
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
        }
      }
      recentAcSubmissionList(username: $username, limit: 5) {
        title
        titleSlug
        timestamp
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
  `;

  try {
    const lcRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!lcRes.ok) {
      const fallbackData = readFallback(`HTTP status ${lcRes.status}`);
      if (fallbackData) return res.status(200).json(fallbackData);
      return res.status(200).json({ source: "snapshot", error: "Upstream service unavailable" });
    }

    const data = await lcRes.json();
    if (data.errors || !data.data?.matchedUser) {
      const fallbackData = readFallback(data.errors?.[0]?.message || "Matched user not found");
      if (fallbackData) return res.status(200).json(fallbackData);
      return res.status(200).json({ source: "snapshot", error: "User profile not available" });
    }

    const user = data.data.matchedUser;
    const ac = user.submitStatsGlobal?.acSubmissionNum || [];
    const all = ac.find((x) => x.difficulty === "All")?.count || 0;
    const easy = ac.find((x) => x.difficulty === "Easy")?.count || 0;
    const medium = ac.find((x) => x.difficulty === "Medium")?.count || 0;
    const hard = ac.find((x) => x.difficulty === "Hard")?.count || 0;

    let calendar = {};
    try {
      calendar = JSON.parse(user.submissionCalendar || "{}");
    } catch {
      calendar = {};
    }

    // Calculate active streak
    const timestamps = Object.keys(calendar).map(Number).sort((a, b) => b - a);
    let streak = 0;
    const now = Math.floor(Date.now() / 1000);
    const ONE_DAY = 86400;
    let expectedDay = Math.floor(now / ONE_DAY);

    const submittedDays = new Set(timestamps.map((t) => Math.floor(t / ONE_DAY)));
    if (submittedDays.has(expectedDay)) {
      while (submittedDays.has(expectedDay)) {
        streak++;
        expectedDay--;
      }
    } else if (submittedDays.has(expectedDay - 1)) {
      expectedDay--;
      while (submittedDays.has(expectedDay)) {
        streak++;
        expectedDay--;
      }
    }

    const ranking = user.profile?.ranking || 0;
    const contest = data.data.userContestRanking;
    const contestRating = contest?.rating ? Math.round(contest.rating) : null;

    // Process top topics
    const rawTags = [
      ...(user.tagProblemCounts?.fundamental || []),
      ...(user.tagProblemCounts?.intermediate || []),
      ...(user.tagProblemCounts?.advanced || []),
    ];
    const topTopics = rawTags
      .filter((t) => t.problemsSolved > 0)
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 8)
      .map((t) => ({ name: t.tagName, count: t.problemsSolved }));

    // Process recent accepted submissions
    const recentSubmissions = (data.data.recentAcSubmissionList || []).map((sub) => ({
      title: sub.title,
      titleSlug: sub.titleSlug,
      timestamp: sub.timestamp,
    }));

    const totalSubmissions = Object.values(calendar).reduce((a, b) => a + b, 0);
    const totalActiveDays = Object.keys(calendar).length;

    return res.status(200).json({
      source: "live",
      fetchedAt: new Date().toISOString(),
      totalSolved: all,
      totalQuestions: 4073,
      totalEasy: 969,
      totalMedium: 2124,
      totalHard: 980,
      totalSubmissions,
      totalActiveDays,
      easy,
      medium,
      hard,
      ranking,
      streak,
      calendar,
      contestRating,
      topTopics,
      recentSubmissions,
    });
  } catch (err) {
    const fallbackData = readFallback(err.message);
    if (fallbackData) return res.status(200).json(fallbackData);
    return res.status(200).json({ source: "snapshot", error: "Internal processing error" });
  }
}
