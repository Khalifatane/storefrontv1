import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Storefront",
  description: "Storefront migrated from static HTML into a Next.js app.",
};

const themeBootstrapScript = `
  function generateVariables(theme = "dashboard", brand = "blue") {
    const styleId = "#hs-brand-variables";
    let style = null;

    if (!document.querySelector(styleId)) {
      const head = document.querySelector("head");
      style = document.createElement("style");
      style.id = "hs-brand-variables";
      head.append(style);
    } else {
      style = document.querySelector(styleId);
    }

    style.textContent = \`
      :root[data-theme="theme-\${theme}"],
      [data-theme="theme-\${theme}"] {
        --primary-50: var(--color-\${brand}-50);
        --primary-100: var(--color-\${brand}-100);
        --primary-200: var(--color-\${brand}-200);
        --primary-300: var(--color-\${brand}-300);
        --primary-400: var(--color-\${brand}-400);
        --primary-500: var(--color-\${brand}-500);
        --primary-600: var(--color-\${brand}-600);
        --primary-700: var(--color-\${brand}-700);
        --primary-800: var(--color-\${brand}-800);
        --primary-900: var(--color-\${brand}-900);
        --primary-950: var(--color-\${brand}-950);
      }
    \`;
  }

  (function () {
    const unavailableColorThemes = window.HS_UNAVAILABLE_COLOR_THEMES || {};
    const pathname = window.location.pathname;
    let reducedThemes = [];
    let defaultTheme = "default";
    let defaultBrand = "blue";
    let defaultFont = "sans";

    const themesDefaults = {
      default: "blue",
      harvest: "amber",
      retro: "fuchsia",
      ocean: "cyan",
      autumn: "yellow",
      moon: "gray",
      bubblegum: "pink",
      cashmere: "mauve",
      olive: "avocado",
    };

    for (const [key, value] of Object.entries(unavailableColorThemes)) {
      const { theme, excludes } = value;

      if (!pathname.includes(key)) continue;

      defaultTheme = theme;

      if (Array.isArray(excludes)) {
        reducedThemes = excludes;
      } else {
        if (excludes["*"]) reducedThemes.push(...excludes["*"]);

        for (const [nestedKey, nestedValue] of Object.entries(excludes)) {
          if (nestedKey !== "*" && pathname.includes(nestedKey)) {
            reducedThemes.push(...nestedValue);
          }
        }
      }

      break;
    }

    const colorTheme = localStorage.getItem("hs-clipboard-theme");
    const font = localStorage.getItem("hs-clipboard-font");
    const brand = localStorage.getItem("hs-clipboard-brand");
    const html = document.documentElement;
    const accessibleFilePathPatterns = [
      "/templates/",
      "/pages/",
      "/pro/agency/",
      "/pro/ai-chat/",
      "/pro/analytics/",
      "/pro/calendars/",
      "/pro/chat/",
      "/pro/cms/",
      "/pro/coffee-shop/",
      "/pro/crm/",
      "/pro/dashboard/",
      "/pro/ecommerce/",
      "/pro/files/",
      "/pro/inbox/",
      "/pro/payment/",
      "/pro/personal/",
      "/pro/project/",
      "/pro/shop/",
      "/pro/shop-marketplace/",
      "/pro/smart-home/",
      "/pro/startup/",
      "/pro/video-call/",
      "/pro/workspace/",
      "/",
    ];
    const currentUrl = window.location.href;
    const isIncludedUrl = accessibleFilePathPatterns.some((pattern) =>
      currentUrl.includes(pattern),
    );

    if (isIncludedUrl) {
      const currentTheme =
        colorTheme && !reducedThemes.includes(colorTheme)
          ? colorTheme
          : defaultTheme;
      const currentBrand = brand || themesDefaults[currentTheme];
      const currentFont = font ?? defaultFont;

      html.setAttribute("data-theme", "theme-" + currentTheme);
      html.setAttribute("data-brand", currentBrand);
      html.setAttribute("data-font", currentFont);

      generateVariables(currentTheme, currentBrand);
    }
  })();
`;

const colorModeScript = `
  (function () {
    const html = document.documentElement;
    const mode = localStorage.getItem("hs_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isLightOrAuto = mode === "light" || (mode === "auto" && !prefersDark);
    const isDarkOrAuto = mode === "dark" || (mode === "auto" && prefersDark);

    if (isLightOrAuto && html.classList.contains("dark")) html.classList.remove("dark");
    else if (isDarkOrAuto && html.classList.contains("light")) html.classList.remove("light");
    else if (isDarkOrAuto && !html.classList.contains("dark")) html.classList.add("dark");
    else if (isLightOrAuto && !html.classList.contains("light")) html.classList.add("light");
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="relative iidaq"
      data-theme="theme-default"
      data-brand="blue"
      data-font="sans"
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta
          name="description"
          content="Engaging shopping experiences with advanced product filters, detailed descriptions, easy checkout, and full account management."
        />
        <link rel="shortcut icon" href="https://preline.co/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Domine:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kode+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://preline.co/assets/css/obfuscated.min.css?v=4.1.3"
        />
        <link
          rel="stylesheet"
          href="https://preline.co/assets/vendor/apexcharts/dist/apexcharts.css"
        />
        <style>{`
          .apexcharts-tooltip.apexcharts-theme-light {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }

          .apexcharts-xaxistooltip {
            background: var(--color-primary-600) !important;
            border-color: var(--color-primary-600) !important;
          }

          .apexcharts-xaxistooltip:after,
          .apexcharts-xaxistooltip:before {
            border-bottom-color: var(--color-primary-600) !important;
          }
        `}</style>
      </head>
      <body suppressHydrationWarning>
        <Script
          src="https://preline.co/assets/js/hs-unavailable-color-themes.js"
          strategy="beforeInteractive"
        />
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
        <Script id="color-mode-bootstrap" strategy="beforeInteractive">
          {colorModeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
