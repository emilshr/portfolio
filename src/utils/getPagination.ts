import { SITE } from "@config";
import getPageNumbers from "./getPageNumbers";

interface GetPaginationProps<T> {
  articles: T;
  page: string | number;
  isIndex?: boolean;
}

const getPagination = <T>({
  articles,
  page,
  isIndex = false,
}: GetPaginationProps<T[]>) => {
  const totalPagesArray = getPageNumbers(articles.length);
  const totalPages = totalPagesArray.length;

  const currentPage = isIndex
    ? 1
    : page && !isNaN(Number(page)) && totalPagesArray.includes(Number(page))
      ? Number(page)
      : 0;

  const lastPost = isIndex
    ? SITE.articlePerPage
    : currentPage * SITE.articlePerPage;
  const startPost = isIndex ? 0 : lastPost - SITE.articlePerPage;
  const paginatedArticles = articles.slice(startPost, lastPost);

  return {
    totalPages,
    currentPage,
    paginatedArticles,
  };
};

export default getPagination;
