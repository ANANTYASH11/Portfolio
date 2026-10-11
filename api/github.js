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

  const token = process.env.GITHUB_TOKEN;
  const username = "ANANTYASH11";

  // Helper to read fallback snapshot
  const readFallback = (reason) => {
    if (reason) {
      console.warn("[api/github] Fallback triggered due to:", reason);
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
            fetchedAt: parsed.lastUpdated || "11 Oct 2026",
            ...parsed.github,
          };
        }
      }
    } catch (e) {
      console.error("[api/github] Error reading snapshot fallback:", e);
    }
    return null;
  };

  // If token is present, query full GraphQL API
  if (token) {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
          }
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                primaryLanguage {
                  name
                  color
                }
              }
            }
          }
          repositories(first: 25, orderBy: {field: PUSHED_AT, direction: DESC}, isFork: false) {
            nodes {
              name
              description
              url
              stargazerCount
              primaryLanguage {
                name
                color
              }
              languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const ghRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "Portfolio-ProofOfWork/1.0",
        },
        body: JSON.stringify({ query, variables: { login: username } }),
      });

      if (ghRes.ok) {
        const data = await ghRes.json();
        if (data.data?.user) {
          const calendar = data.data.user.contributionsCollection.contributionCalendar;

          const langTotals = {};
          let totalSize = 0;
          data.data.user.repositories?.nodes?.forEach((repo) => {
            repo.languages?.edges?.forEach((edge) => {
              const name = edge.node.name;
              const size = edge.size;
              const color = edge.node.color || "#8b5cf6";
              if (!langTotals[name]) langTotals[name] = { size: 0, color };
              langTotals[name].size += size;
              totalSize += size;
            });
          });

          const topLanguages = Object.entries(langTotals)
            .sort((a, b) => b[1].size - a[1].size)
            .slice(0, 3)
            .map(([name, info]) => ({
              name,
              percentage: totalSize > 0 ? Math.round((info.size / totalSize) * 100) : 0,
              color: info.color,
            }));

          let pinnedRepos = (data.data.user.pinnedItems?.nodes || []).map((repo) => ({
            name: repo.name,
            description: repo.description,
            url: repo.url,
            stars: repo.stargazerCount || 0,
            language: repo.primaryLanguage
              ? { name: repo.primaryLanguage.name, color: repo.primaryLanguage.color }
              : null,
          }));

          if (pinnedRepos.length === 0) {
            pinnedRepos = (data.data.user.repositories?.nodes || []).slice(0, 4).map((repo) => ({
              name: repo.name,
              description: repo.description,
              url: repo.url,
              stars: repo.stargazerCount || 0,
              language: repo.primaryLanguage
                ? { name: repo.primaryLanguage.name, color: repo.primaryLanguage.color }
                : null,
            }));
          }

          let currentStreak = 0;
          let longestStreak = 0;
          let runningStreak = 0;
          const allDays = calendar.weeks.flatMap((w) => w.contributionDays);
          allDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          allDays.forEach((day) => {
            if (day.contributionCount > 0) {
              runningStreak++;
              if (runningStreak > longestStreak) longestStreak = runningStreak;
            } else {
              runningStreak = 0;
            }
          });

          for (let i = allDays.length - 1; i >= 0; i--) {
            if (allDays[i].contributionCount > 0) {
              currentStreak++;
            } else if (i === allDays.length - 1) {
              continue;
            } else {
              break;
            }
          }

          return res.status(200).json({
            source: "live",
            fetchedAt: new Date().toISOString(),
            totalContributions: calendar.totalContributions,
            weeks: calendar.weeks,
            currentStreak,
            longestStreak,
            topLanguages,
            pinnedRepositories: pinnedRepos,
          });
        }
      }
    } catch (e) {
      console.warn("[api/github] GraphQL query failed, attempting public scraping:", e.message);
    }
  }

  // Tokenless public contributions scraping (works for public GitHub profiles)
  try {
    const pubRes = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (pubRes.ok) {
      const html = await pubRes.text();
      const totalMatch = html.match(/([\d,]+)\s+contributions\s+in/i);
      const totalContributions = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 3664;

      const tipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
      const tooltipsByFor = {};
      for (const m of html.matchAll(tipRegex)) {
        tooltipsByFor[m[1]] = m[2];
      }

      const tdRegex = /<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d+)"/g;
      const days = [];
      for (const m of html.matchAll(tdRegex)) {
        const date = m[1];
        const id = m[2];
        const level = parseInt(m[3], 10);
        const tip = tooltipsByFor[id] || "";
        let count = 0;
        const countMatch = tip.match(/^(\d+)\s+contribution/);
        if (countMatch) {
          count = parseInt(countMatch[1], 10);
        } else if (tip.startsWith("No ")) {
          count = 0;
        } else if (level > 0) {
          count = level;
        }

        const [y, mo, d] = date.split("-").map(Number);
        const dObj = new Date(y, mo - 1, d);
        days.push({
          date,
          weekday: dObj.getDay(),
          contributionCount: count,
        });
      }

      if (days.length > 0) {
        days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let currentStreak = 0;
        let longestStreak = 0;
        let runningStreak = 0;

        for (const day of days) {
          if (day.contributionCount > 0) {
            runningStreak++;
            if (runningStreak > longestStreak) longestStreak = runningStreak;
          } else {
            runningStreak = 0;
          }
        }

        for (let i = days.length - 1; i >= 0; i--) {
          if (days[i].contributionCount > 0) {
            currentStreak++;
          } else if (i === days.length - 1 && days[i].contributionCount === 0) {
            continue;
          } else {
            break;
          }
        }

        const weeks = [];
        let currentWeek = { contributionDays: [] };
        for (let i = 0; i < days.length; i++) {
          currentWeek.contributionDays.push(days[i]);
          if (days[i].weekday === 6 || i === days.length - 1) {
            weeks.push(currentWeek);
            currentWeek = { contributionDays: [] };
          }
        }

        const fallbackData = readFallback();

        return res.status(200).json({
          source: "live",
          fetchedAt: new Date().toISOString(),
          totalContributions,
          weeks,
          currentStreak,
          longestStreak,
          topLanguages: fallbackData?.topLanguages || [
            { name: "TypeScript", percentage: 54, color: "#3178c6" },
            { name: "JavaScript", percentage: 26, color: "#f1e05a" },
            { name: "Dockerfile", percentage: 20, color: "#384d54" },
          ],
          pinnedRepositories: fallbackData?.pinnedRepositories || [],
        });
      }
    }
  } catch (err) {
    console.warn("[api/github] Public contributions scrape failed:", err.message);
  }

  // Graceful fallback to snapshot
  const fallback = readFallback("Unable to fetch live GitHub data");
  if (fallback) return res.status(200).json(fallback);
  return res.status(200).json({ source: "snapshot", error: "Data unavailable" });
}
