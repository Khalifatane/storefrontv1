import { StorefrontPage } from "../components/storefront-page";
import { getStorefrontPage } from "../lib/storefront";

export async function generateMetadata() {
  const page = await getStorefrontPage([]);

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function HomePage() {
  const page = await getStorefrontPage([]);

  return <StorefrontPage page={page} />;
}
