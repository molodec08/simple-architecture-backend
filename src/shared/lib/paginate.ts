/**
 * Нарезка списка на страницы. Страница за пределами списка прижимается к краю.
 * @param page — номер страницы, начиная с 1
 */
export const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const start = (currentPage - 1) * pageSize;

  return {
    pageItems: items.slice(start, start + pageSize),
    currentPage,
    pageCount,
  };
};
