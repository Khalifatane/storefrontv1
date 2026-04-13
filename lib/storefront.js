import { promises as fs } from "fs";
import path from "path";

const pagesDirectory = path.join(process.cwd(), "pages");

function extractMatch(source, pattern) {
  const match = source.match(pattern);
  return match ? match[1].trim() : "";
}

function parseAttributes(tagSource) {
  const attributes = {};

  for (const match of tagSource.matchAll(/([a-zA-Z0-9:-]+)="([^"]*)"/g)) {
    attributes[match[1]] = match[2];
  }

  return attributes;
}

function buildRouteMap(fileNames) {
  return new Map(
    fileNames.map((fileName) => {
      const slug = fileName.replace(/\.html$/, "");
      const route = slug === "index" ? "/" : `/${slug}`;
      return [fileName, route];
    }),
  );
}

function rewriteHtml(html, routeMap) {
  let output = html;

  for (const [fileName, route] of routeMap.entries()) {
    const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const routeValue = route === "/" ? "/" : route;
    output = output.replace(
      new RegExp(`([\\s"'=])(\\.?\\/?${escapedFileName})([#?][^"'\\s>]*)?`, "g"),
      (_, prefix, __, suffix = "") => `${prefix}${routeValue}${suffix}`,
    );
  }

  output = output.replace(
    /((?:href|src|action)=["'])\.\.\/\.\.\/([^"']+)/g,
    '$1https://preline.co/$2',
  );
  output = output.replace(
    /((?:href|src)=["'])\.?\/?assets\//g,
    '$1/assets/',
  );
  output = output.replace(
    /((?:href|src)=["'])\.\.\/assets\//g,
    '$1/assets/',
  );

  return output;
}

export async function getAllStorefrontSlugs() {
  const entries = await fs.readdir(pagesDirectory);

  return entries
    .filter((entry) => entry.endsWith(".html"))
    .map((entry) => entry.replace(/\.html$/, ""))
    .map((entry) => (entry === "index" ? [] : [entry]));
}

export async function getStorefrontPage(slugParts = []) {
  const normalizedSlug = Array.isArray(slugParts) ? slugParts.join("/") : slugParts;
  const fileName = normalizedSlug ? `${normalizedSlug}.html` : "index.html";
  const filePath = path.join(pagesDirectory, fileName);

  try {
    const [source, fileNames] = await Promise.all([
      fs.readFile(filePath, "utf8"),
      fs.readdir(pagesDirectory),
    ]);
    const routeMap = buildRouteMap(fileNames.filter((entry) => entry.endsWith(".html")));
    const htmlTag = extractMatch(source, /<html([^>]*)>/i);
    const bodyTag = extractMatch(source, /<body([^>]*)>/i);
    const bodyHtml = extractMatch(source, /<body[^>]*>([\s\S]*)<\/body>/i);
    const rewrittenHtml = rewriteHtml(bodyHtml, routeMap);
    const htmlAttributes = parseAttributes(htmlTag);
    const bodyAttributes = parseAttributes(bodyTag);

    return {
      title: extractMatch(source, /<title>([\s\S]*?)<\/title>/i) || "Storefront",
      description:
        extractMatch(source, /<meta\s+name="description"\s+content="([^"]*)"/i) ||
        "Storefront migrated to Next.js.",
      htmlClass: htmlAttributes.class || "relative iidaq",
      htmlAttributes,
      bodyClass: bodyAttributes.class || "",
      bodyHtml: rewrittenHtml,
    };
  } catch {
    return null;
  }
}
