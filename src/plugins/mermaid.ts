// I store this code
// shoutout to this guy: https://github.com/JuanM04/portfolio/blob/b312b44e08558bc72b5c8cb15f2ee32c3349d277/src/plugins/mermaid.ts
import type { RemarkPlugin } from "@astrojs/markdown-remark"
import { visit } from "unist-util-visit"

const escapeMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

const escapeHtml = (str: string) => str.replace(/[&<>"']/g, c => escapeMap[c])

export const mermaid: RemarkPlugin<[]> = () => tree => {
  visit(tree, "code", node => {
    if (node.lang !== "mermaid") return

    // @ts-ignore
    node.type = "html"
    node.value = `
      <div class="mermaid">
        <p>Loading graph...</p>
        <p><b>If graph doesn't load in 5 seconds, please refresh page.</b> Loading script a bit funky </p>
        <pre class="mermaid-src">${escapeHtml(node.value)}</pre>
        </div>
    `
  })
}
