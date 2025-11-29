'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/types/comment';

interface CommentListProps {
  postId: string;
  refreshTrigger: number;
}

export default function CommentList({ postId, refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId, refreshTrigger]);

  const handleDelete = async (commentId: string) => {
    if (!confirm('덧글을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      loadComments();
    } catch (error) {
      alert('덧글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-400 text-center py-4">덧글을 불러오는 중...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
        댓글 <span className="text-blue-600 dark:text-blue-400">{comments.length}</span>
      </h3>

      {comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                  {getInitial(comment.author)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{comment.author}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs transition-colors"
                  >
                    삭제
                  </button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
