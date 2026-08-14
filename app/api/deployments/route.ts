import { NextResponse } from "next/server";
import { DeployedProject, FALLBACK_DEPLOYMENTS } from "../../../data/deployments";

interface GitHubRepoItem {
  id: number;
  name: string;
  homepage?: string | null;
  html_url: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number;
}

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/users/chirayumishra24/repos?per_page=100&sort=updated", {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "ChirayuOS-Portfolio",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ deployments: FALLBACK_DEPLOYMENTS, source: "fallback", count: FALLBACK_DEPLOYMENTS.length });
    }

    const repos = (await res.json()) as GitHubRepoItem[];
    if (!Array.isArray(repos)) {
      return NextResponse.json({ deployments: FALLBACK_DEPLOYMENTS, source: "fallback", count: FALLBACK_DEPLOYMENTS.length });
    }

    // Filter repos with deployed homepage URLs
    const liveRepos = repos.filter(
      (r): r is GitHubRepoItem & { homepage: string } =>
        typeof r.homepage === "string" && r.homepage.startsWith("http") && !r.homepage.endsWith(".md")
    );

    // Merge with curated data
    const map = new Map<string, DeployedProject>();
    FALLBACK_DEPLOYMENTS.forEach((d) => map.set(d.name.toLowerCase(), d));

    const deployments: DeployedProject[] = liveRepos.map((r) => {
      const existing = map.get(r.name.toLowerCase());
      if (existing) {
        return {
          ...existing,
          stars: r.stargazers_count ?? existing.stars,
          url: r.homepage || existing.url,
          githubUrl: r.html_url || existing.githubUrl,
        };
      }

      const title = r.name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

      return {
        id: r.id ? String(r.id) : r.name.toLowerCase(),
        name: r.name,
        title,
        url: r.homepage,
        githubUrl: r.html_url,
        description: r.description || `Live web deployment for ${title}.`,
        language: r.language || "TypeScript",
        category: "Web Apps",
        tags: [r.language || "Web", "Vercel"],
        stars: r.stargazers_count || 0,
      };
    });

    FALLBACK_DEPLOYMENTS.forEach((item) => {
      if (!deployments.some((d) => d.url.toLowerCase() === item.url.toLowerCase() || d.name.toLowerCase() === item.name.toLowerCase())) {
        deployments.push(item);
      }
    });

    return NextResponse.json({ deployments, source: "live", count: deployments.length });
  } catch {
    return NextResponse.json({ deployments: FALLBACK_DEPLOYMENTS, source: "fallback", count: FALLBACK_DEPLOYMENTS.length });
  }
}
