import { notFound } from "next/navigation";
import { StorefrontPage } from "../../components/storefront-page";
import { getAllStorefrontSlugs, getStorefrontPage } from "../../lib/storefront";

export async function generateStaticParams() {
  const slugs = await getAllStorefrontSlugs();
  return slugs.filter((slug) => slug.length > 0).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const page = await getStorefrontPage(params.slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function StorefrontSlugPage({ params }) {
  const page = await getStorefrontPage(params.slug);

  if (!page) {
    notFound();
  }

  return <StorefrontPage page={page} />;
}
