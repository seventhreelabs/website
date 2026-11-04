/**
 * Markdown from the HTML the cmssy rich-text editor stores (TipTap: headings,
 * paragraphs, lists, links, emphasis, code, quotes, rules, tables, images).
 * Unknown tags fall through to their text.
 */
type Node = { tag: string; attrs: Record<string, string>; children: Node[]; text?: string };

const VOID = new Set(["br", "hr", "img"]);
const BLOCK = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "pre", "hr", "table", "tr", "div", "figure"]);

function decode(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function parse(html: string): Node[] {
  const root: Node = { tag: "", attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:\s+[^\s=>]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("<!--")) continue;
    if (m[1]) {
      const tag = m[1].toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
      continue;
    }
    if (m[2]) {
      const tag = m[2].toLowerCase();
      const attrs: Record<string, string> = {};
      for (const a of m[3].matchAll(/([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
        attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? "");
      }
      const node: Node = { tag, attrs, children: [] };
      stack[stack.length - 1].children.push(node);
      if (!VOID.has(tag) && !m[0].endsWith("/>")) stack.push(node);
      continue;
    }
    if (m[4]) stack[stack.length - 1].children.push({ tag: "#text", attrs: {}, children: [], text: decode(m[4]) });
  }
  return root.children;
}

function inline(nodes: Node[]): string {
  return nodes.map((n) => {
    if (n.tag === "#text") return (n.text ?? "").replace(/\s+/g, " ");
    const inner = inline(n.children);
    switch (n.tag) {
      case "strong": case "b": return inner.trim() ? `**${inner.trim()}**` : "";
      case "em": case "i": return inner.trim() ? `*${inner.trim()}*` : "";
      case "s": case "del": return inner.trim() ? `~~${inner.trim()}~~` : "";
      case "code": return `\`${inner}\``;
      case "a": return n.attrs.href ? `[${inner.trim() || n.attrs.href}](${n.attrs.href})` : inner;
      case "br": return "  \n";
      case "img": return `![${n.attrs.alt ?? ""}](${n.attrs.src ?? ""})`;
      default: return BLOCK.has(n.tag) ? blocks([n]) : inner;
    }
  }).join("");
}

function listItems(node: Node, ordered: boolean, depth: number): string {
  return node.children
    .filter((c) => c.tag === "li")
    .map((li, i) => {
      const marker = ordered ? `${i + 1}. ` : "- ";
      const own = li.children.filter((c) => c.tag !== "ul" && c.tag !== "ol");
      const nested = li.children.filter((c) => c.tag === "ul" || c.tag === "ol");
      const text = inline(own).replace(/\n{2,}/g, "\n").trim();
      const sub = nested.map((n) => listItems(n, n.tag === "ol", depth + 1)).join("");
      return `${"  ".repeat(depth)}${marker}${text}\n${sub}`;
    })
    .join("");
}

function table(node: Node): string {
  const rows = node.children.flatMap((c) => (c.tag === "tr" ? [c] : c.children.filter((r) => r.tag === "tr")));
  const cells = rows.map((r) => r.children.filter((c) => c.tag === "td" || c.tag === "th").map((c) => inline(c.children).trim().replace(/\|/g, "\\|")));
  if (!cells.length) return "";
  const width = Math.max(...cells.map((r) => r.length));
  const line = (r: string[]) => `| ${Array.from({ length: width }, (_, i) => r[i] ?? "").join(" | ")} |`;
  return [line(cells[0]), `| ${Array(width).fill("---").join(" | ")} |`, ...cells.slice(1).map(line)].join("\n") + "\n\n";
}

function blocks(nodes: Node[]): string {
  let out = "";
  for (const n of nodes) {
    switch (n.tag) {
      case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
        out += `${"#".repeat(Number(n.tag[1]))} ${inline(n.children).trim()}\n\n`; break;
      case "p": { const t = inline(n.children).trim(); if (t) out += `${t}\n\n`; break; }
      case "ul": out += listItems(n, false, 0) + "\n"; break;
      case "ol": out += listItems(n, true, 0) + "\n"; break;
      case "blockquote": out += blocks(n.children).trim().split("\n").map((l) => `> ${l}`).join("\n") + "\n\n"; break;
      case "pre": { const code = n.children.map((c) => c.tag === "#text" ? c.text ?? "" : c.children.map((x) => x.text ?? "").join("")).join(""); out += `\`\`\`\n${code.replace(/\n$/, "")}\n\`\`\`\n\n`; break; }
      case "hr": out += "---\n\n"; break;
      case "table": out += table(n); break;
      case "#text": { const t = (n.text ?? "").trim(); if (t) out += `${t}\n\n`; break; }
      default: out += n.children.some((c) => BLOCK.has(c.tag)) ? blocks(n.children) : (() => { const t = inline([n]).trim(); return t ? `${t}\n\n` : ""; })();
    }
  }
  return out;
}

export function htmlToMarkdown(html: string | null | undefined): string {
  if (!html) return "";
  return blocks(parse(html)).replace(/\n{3,}/g, "\n\n").trim();
}
