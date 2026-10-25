export type PaginationItem = number | "ellipsis";

export function getPaginationItems(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    ...Array.from(
      { length: 3 },
      (_, index) => currentPage + index - 1
    ).filter((page) => page > 1 && page < totalPages),
  ]);
  const sortedPages = [...pages].sort((a, b) => a - b);

  return sortedPages.reduce<PaginationItem[]>((items, page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage !== undefined) {
      const gap = page - previousPage;
      if (gap === 2) {
        items.push(previousPage + 1);
      } else if (gap > 2) {
        items.push("ellipsis");
      }
    }
    items.push(page);
    return items;
  }, []);
}
