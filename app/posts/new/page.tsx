import Link from 'next/link';
import PostForm from '@/components/PostForm';

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">새 게시글 작성</h1>
      <PostForm />
    </div>
  );
}
