import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fallback high-fidelity developer stats
const fallbackStats = {
  user: {
    login: "chirayumishra24",
    name: "Chirayu",
    avatar_url: "https://github.com/chirayumishra24.png",
    bio: "Senior Full-Stack Architect | Building Developer Tooling & Immersive OS UX",
    public_repos: 42,
    followers: 128,
    following: 64,
    total_stars: 840,
    total_forks: 180,
  },
  pinnedRepos: [
    { name: "chirayu-os", description: "Interactive desktop operating system built using Next.js, Framer Motion, and Monaco Editor.", language: "TypeScript", stars: 320, forks: 45 },
    { name: "flowstate", description: "Collaborative real-time Git branching visualizer with custom graph rendering.", language: "Go", stars: 210, forks: 30 },
    { name: "devforge", description: "Serverless code sandbox execution engine with Docker compiler instances.", language: "TypeScript", stars: 185, forks: 22 },
    { name: "synthmedia-audio", description: "High-performance ambient audio compiler & frequency visualizer.", language: "Rust", stars: 125, forks: 12 },
  ],
  languages: [
    { name: "TypeScript", value: 45 },
    { name: "Go", value: 25 },
    { name: "Rust", value: 15 },
    { name: "JavaScript", value: 10 },
    { name: "HTML/CSS", value: 5 }
  ],
  latestCommits: [
    { repo: "chirayu-os", message: "feat: add terminal matrix rain effect & custom sound effects", date: "2 hours ago" },
    { repo: "flowstate", message: "fix: resolve node coordinate calculations under dragging", date: "1 day ago" },
    { repo: "devforge", message: "refactor: migrate container sandbox isolation rules to v2", date: "3 days ago" },
    { repo: "synthmedia-audio", message: "perf: optimize web-audio frequencies rendering buffer size", date: "5 days ago" }
  ]
};

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(fallbackStats);
    }

    // Fetch user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ChirayuOS-Portfolio"
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!userRes.ok) {
      throw new Error(`GitHub User API returned status ${userRes.status}`);
    }

    const userData = await userRes.json();
    const username = userData.login;

    // Fetch repositories (up to 100)
    const reposRes = await fetch(`https://api.github.com/user/repos?per_page=100&type=owner&sort=updated`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ChirayuOS-Portfolio"
      },
      next: { revalidate: 3600 }
    });

    let reposData = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // Fetch events (for latest commits)
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ChirayuOS-Portfolio"
      },
      next: { revalidate: 3600 }
    });

    let eventsData = [];
    if (eventsRes.ok) {
      eventsData = await eventsRes.json();
    }

    // 1. Process User Profile Metrics
    const totalStars = reposData.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
    const totalForks = reposData.reduce((acc: number, r: any) => acc + (r.forks_count || 0), 0);

    const user = {
      login: userData.login,
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      bio: userData.bio || "Full-Stack Developer",
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      total_stars: totalStars || 0,
      total_forks: totalForks || 0,
    };

    // 2. Process Pinned / Top Repositories (take top 4 by stars, fallback to updated)
    const sortedRepos = [...reposData].sort((a: any, b: any) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    const pinnedRepos = sortedRepos.slice(0, 4).map((r: any) => ({
      name: r.name,
      description: r.description || "No description provided.",
      language: r.language || "TypeScript",
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
    }));

    // 3. Process Languages Distribution
    const langMap: Record<string, number> = {};
    let totalLangCount = 0;
    reposData.forEach((r: any) => {
      if (r.language) {
        langMap[r.language] = (langMap[r.language] || 0) + 1;
        totalLangCount++;
      }
    });

    const languages = Object.entries(langMap)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalLangCount) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 4. Process Latest Commits from events
    const latestCommits: any[] = [];
    const pushEvents = eventsData.filter((e: any) => e.type === "PushEvent");

    pushEvents.forEach((event: any) => {
      const repoName = event.repo.name.split("/").pop();
      const commits = event.payload.commits || [];
      commits.forEach((c: any) => {
        if (latestCommits.length < 4) {
          const date = new Date(event.created_at);
          let dateStr = "Recent";
          const diffMs = Date.now() - date.getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          if (diffHrs < 1) {
            dateStr = "Just now";
          } else if (diffHrs < 24) {
            dateStr = `${diffHrs} hours ago`;
          } else {
            const diffDays = Math.floor(diffHrs / 24);
            dateStr = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
          }

          latestCommits.push({
            repo: repoName,
            message: c.message,
            date: dateStr,
          });
        }
      });
    });

    // Fallback if no recent push events are found
    if (latestCommits.length === 0) {
      latestCommits.push(...fallbackStats.latestCommits);
    }

    return NextResponse.json({
      user,
      pinnedRepos: pinnedRepos.length > 0 ? pinnedRepos : fallbackStats.pinnedRepos,
      languages: languages.length > 0 ? languages : fallbackStats.languages,
      latestCommits,
    });

  } catch (error: any) {
    console.error("GitHub API error:", error);
    return NextResponse.json(fallbackStats); // Fail gracefully back to high-fidelity fallback stats
  }
}
