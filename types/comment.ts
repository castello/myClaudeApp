export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
}

export type CreateCommentInput = Omit<Comment, 'id' | 'createdAt'>;
