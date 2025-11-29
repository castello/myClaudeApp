'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/post';
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentRefresh, setCommentRefresh] = useState(0);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');

      router.push('/');
      router.refresh();
    } catch (error) {
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">게시글을 찾을 수 없습니다.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

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

      <article className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {getInitial(post.author)}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{post.author}</div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                {formatDate(post.createdAt)}
                {post.createdAt !== post.updatedAt && (
                  <span className="ml-2">(수정됨)</span>
                )}
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Link
              href={`/posts/${post.id}/edit`}
              className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
            >
              삭제
            </button>
          </div>
        </div>
      </article>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 space-y-6">
        <CommentList postId={id} refreshTrigger={commentRefresh} />
        <CommentForm
          postId={id}
          onCommentAdded={() => setCommentRefresh(prev => prev + 1)}
        />
      </div>
    </div>
  );
}
