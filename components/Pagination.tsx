import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Link
        href={`/?page=${currentPage - 1}`}
        className={`px-4 py-2 rounded-lg border ${
          currentPage === 1
            ? 'pointer-events-none opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        이전
      </Link>

      {pageNumbers.map((page, index) =>
        typeof page === 'number' ? (
          <Link
            key={index}
            href={`/?page=${page}`}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      )}

      <Link
        href={`/?page=${currentPage + 1}`}
        className={`px-4 py-2 rounded-lg border ${
          currentPage === totalPages
            ? 'pointer-events-none opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        다음
      </Link>
    </div>
  );
}
