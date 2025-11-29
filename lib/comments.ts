import { promises as fs } from 'fs';
import path from 'path';
import { Comment, CreateCommentInput } from '@/types/comment';

const DATA_FILE = path.join(process.cwd(), 'data', 'comments.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

export async function getComments(): Promise<Comment[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const comments = await getComments();
  return comments.filter(comment => comment.postId === postId);
}

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const comments = await getComments();
  const newComment: Comment = {
    id: Date.now().toString(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  await fs.writeFile(DATA_FILE, JSON.stringify(comments, null, 2));
  return newComment;
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await getComments();
  const filteredComments = comments.filter(comment => comment.id !== id);

  if (filteredComments.length === comments.length) return false;

  await fs.writeFile(DATA_FILE, JSON.stringify(filteredComments, null, 2));
  return true;
}
