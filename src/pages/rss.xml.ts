import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedArticles from "@utils/getSortedArticles";
import { SITE } from "@config";

export async function GET() {
  const articles = await getCollection("blog");
  const sortedArticles = getSortedArticles(articles);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedArticles.map(({ data, slug }) => ({
      link: `articles/${slug}`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
