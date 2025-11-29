import { promises as fs } from 'fs';
import path from 'path';
import { Post, CreatePostInput, UpdatePostInput } from '@/types/post';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

export async function getPosts(): Promise<Post[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

export interface PaginatedPosts {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
}

export async function getPostsPaginated(page: number = 1, postsPerPage: number = 20): Promise<PaginatedPosts> {
  const allPosts = await getPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    currentPage,
    totalPages,
    totalPosts,
    postsPerPage,
  };
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find(post => post.id === id) || null;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const posts = await getPosts();
  const newPost: Post = {
    id: Date.now().toString(),
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
  return newPost;
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post | null> {
  const posts = await getPosts();
  const index = posts.findIndex(post => post.id === id);

  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
  return posts[index];
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getPosts();
  const filteredPosts = posts.filter(post => post.id !== id);

  if (filteredPosts.length === posts.length) return false;

  await fs.writeFile(DATA_FILE, JSON.stringify(filteredPosts, null, 2));
  return true;
}
