import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const repo = searchParams.get("repo") || "chirayu_portfolio_os";
    const path = searchParams.get("path") || "";
    const file = searchParams.get("file"); // If set, fetch raw file content

    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ChirayuOS-Portfolio",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Fetch single file content
    if (file) {
      const fileRes = await fetch(
        `https://api.github.com/repos/chirayumishra24/${repo}/contents/${file}`,
        { headers, next: { revalidate: 600 } }
      );

      if (!fileRes.ok) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      const fileData = await fileRes.json();

      // Decode base64 content
      let content = "";
      if (fileData.content) {
        content = Buffer.from(fileData.content, "base64").toString("utf-8");
      }

      // Detect language from extension
      const ext = fileData.name.split(".").pop()?.toLowerCase() || "";
      const langMap: Record<string, string> = {
        ts: "TypeScript", tsx: "TypeScript", js: "JavaScript", jsx: "JavaScript",
        css: "CSS", html: "HTML", json: "JSON", md: "Markdown",
        py: "Python", rs: "Rust", go: "Go", yaml: "YAML", yml: "YAML",
        toml: "TOML", sql: "SQL", sh: "Shell", prisma: "Prisma",
        gitignore: "Git", env: "Env", lock: "Lock",
      };

      return NextResponse.json({
        name: fileData.name,
        path: fileData.path,
        size: fileData.size,
        content,
        language: langMap[ext] || "Text",
      });
    }

    // Fetch directory listing
    const contentsRes = await fetch(
      `https://api.github.com/repos/chirayumishra24/${repo}/contents/${path}`,
      { headers, next: { revalidate: 600 } }
    );

    if (!contentsRes.ok) {
      return NextResponse.json({ error: "Path not found" }, { status: 404 });
    }

    const contentsData = await contentsRes.json();

    // Handle single file response (when path points to a file, not directory)
    if (!Array.isArray(contentsData)) {
      let content = "";
      if (contentsData.content) {
        content = Buffer.from(contentsData.content, "base64").toString("utf-8");
      }
      return NextResponse.json({
        name: contentsData.name,
        path: contentsData.path,
        size: contentsData.size,
        content,
        language: "Text",
      });
    }

    // Sort: directories first, then files alphabetically
    const items = contentsData
      .map((item: any) => ({
        name: item.name,
        type: item.type as "file" | "dir",
        size: item.size || 0,
        path: item.path,
      }))
      .sort((a: any, b: any) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json({ items, currentPath: path || "/" });
  } catch (error: any) {
    console.error("GitHub Files API error:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
