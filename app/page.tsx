import Link from 'next/link';
import { getPostsPaginated } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts, currentPage, totalPages, totalPosts } = await getPostsPaginated(page);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">커뮤니티</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            전체 <span className="font-semibold text-gray-700 dark:text-gray-300">{totalPosts}</span>개의 게시글
          </p>
        </div>
        <Link
          href="/posts/new"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          글쓰기
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">아직 게시글이 없습니다.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">첫 번째 게시글을 작성해보세요!</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
