export function StorefrontPage({ page }) {
  const syncDocumentScript = `
    (function () {
      document.documentElement.className = ${JSON.stringify(page.htmlClass)};
      document.documentElement.setAttribute("data-theme", ${JSON.stringify(page.htmlAttributes["data-theme"] || "theme-default")});
      document.documentElement.setAttribute("data-brand", ${JSON.stringify(page.htmlAttributes["data-brand"] || "blue")});
      document.documentElement.setAttribute("data-font", ${JSON.stringify(page.htmlAttributes["data-font"] || "sans")});
      document.body.className = ${JSON.stringify(page.bodyClass)};
    })();
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: syncDocumentScript }} />
      <main dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
    </>
  );
}
