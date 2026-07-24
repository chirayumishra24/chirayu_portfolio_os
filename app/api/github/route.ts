import { NextResponse } from "next/server";
import { profile, projects } from "../../../data/portfolio";

export const dynamic = "force-dynamic";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface GitHubCommit {
  message: string;
}

interface GitHubEvent {
  type: string;
  repo: {
    name: string;
  };
  payload: {
    commits?: GitHubCommit[];
  };
  created_at: string;
}

interface PortfolioGithubData {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    total_stars: number;
    total_forks: number;
  };
  pinnedRepos: { name: string; description: string; language: string; stars: number; forks: number }[];
  languages: { name: string; value: number }[];
  latestCommits: { repo: string; message: string; date: string }[];
}

const fallbackStats: PortfolioGithubData = {
  user: {
    login: "chirayumishra24",
    name: profile.name,
    avatar_url: "https://github.com/chirayumishra24.png",
    bio: profile.headline,
    public_repos: 0,
    followers: 0,
    following: 0,
    total_stars: 0,
    total_forks: 0,
  },
  pinnedRepos: projects.map((project) => ({
    name: project.name,
    description: project.description,
    language: "TypeScript",
    stars: 0,
    forks: 0,
  })),
  languages: [
    { name: "TypeScript", value: 40 },
    { name: "React", value: 25 },
    { name: "Node.js", value: 20 },
    { name: "Product", value: 15 },
  ],
  latestCommits: [
    {
      repo: "chirayu_portfolio_os",
      message: "Live GitHub activity requires a configured GITHUB_TOKEN.",
      date: "Offline",
    },
  ],
};

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ChirayuOS-Portfolio",
  };
}

function relativeDate(input: string) {
  const date = new Date(input);
  const diffMs = Date.now() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

  if (Number.isNaN(diffHrs)) return "Recent";
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(fallbackStats);
    }

    const headers = githubHeaders(token);

    const userRes = await fetch("https://api.github.com/user", {
      headers,
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      throw new Error(`GitHub User API returned status ${userRes.status}`);
    }

    const userData = await userRes.json() as GitHubUser;
    const username = userData.login;

    const reposRes = await fetch("https://api.github.com/user/repos?per_page=100&type=owner&sort=updated", {
      headers,
      next: { revalidate: 3600 },
    });

    const reposData = reposRes.ok ? await reposRes.json() as GitHubRepo[] : [];

    const eventsRes = await fetch(`https://api.github.com/users/${username}/events`, {
      headers,
      next: { revalidate: 3600 },
    });

    const eventsData = eventsRes.ok ? await eventsRes.json() as GitHubEvent[] : [];

    const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    const totalForks = reposData.reduce((acc, repo) => acc + repo.forks_count, 0);

    const sortedRepos = [...reposData].sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    const pinnedRepos = sortedRepos.slice(0, 4).map((repo) => ({
      name: repo.name,
      description: repo.description || "No description provided.",
      language: repo.language || "Unknown",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));

    const langMap: Record<string, number> = {};
    reposData.forEach((repo) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });

    const totalLangCount = Object.values(langMap).reduce((acc, count) => acc + count, 0);
    const languages = Object.entries(langMap)
      .map(([name, count]) => ({
        name,
        value: totalLangCount > 0 ? Math.round((count / totalLangCount) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const latestCommits = eventsData
      .filter((event) => event.type === "PushEvent")
      .flatMap((event) => {
        const repoName = event.repo.name.split("/").pop() || event.repo.name;
        return (event.payload.commits || []).map((commit) => ({
          repo: repoName,
          message: commit.message,
          date: relativeDate(event.created_at),
        }));
      })
      .slice(0, 4);

    return NextResponse.json({
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        bio: userData.bio || profile.headline,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        total_stars: totalStars,
        total_forks: totalForks,
      },
      pinnedRepos: pinnedRepos.length > 0 ? pinnedRepos : fallbackStats.pinnedRepos,
      languages: languages.length > 0 ? languages : fallbackStats.languages,
      latestCommits: latestCommits.length > 0 ? latestCommits : fallbackStats.latestCommits,
    } satisfies PortfolioGithubData);
  } catch (error: unknown) {
    console.error("GitHub API error:", error);
    return NextResponse.json(fallbackStats);
  }
}
