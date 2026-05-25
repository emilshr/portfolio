import type { CollectionEntry } from 'astro:content'

export interface PostsByYear {
  year: number
  posts: CollectionEntry<'posts'>[]
}

export function groupPostsByYear(posts: CollectionEntry<'posts'>[]): PostsByYear[] {
  const byYear = new Map<number, CollectionEntry<'posts'>[]>()

  for (const post of posts) {
    const year = post.data.pubDate.getFullYear()
    const group = byYear.get(year) ?? []
    group.push(post)
    byYear.set(year, group)
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, yearPosts]) => ({
      year,
      posts: yearPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    }))
}
