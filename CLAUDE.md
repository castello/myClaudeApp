# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OKKY-style community board built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features posts, comments, and pagination with a JSON file-based data store.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Generate 2000 test posts
node scripts/generateTestPosts.js
```

Development server runs at http://localhost:3001 (port 3000 fallback if in use).

## Architecture

### Data Layer (`/lib`)

**File-based persistence** - All data stored in JSON files in `/data` directory:
- `data/posts.json` - Posts array
- `data/comments.json` - Comments array

**Data access pattern**:
1. `ensureDataFile()` creates file/directory if missing
2. Read entire JSON file into memory
3. Modify in-memory array
4. Write entire array back to file

**Key functions**:
- `lib/posts.ts`: `getPostsPaginated(page, postsPerPage)` - Returns 20 posts per page by default
- `lib/comments.ts`: `getCommentsByPostId(postId)` - Filters comments by post

### API Routes (`/app/api`)

RESTful API using Next.js 15 App Router route handlers:

```
GET    /api/posts           - List all posts
POST   /api/posts           - Create post
GET    /api/posts/[id]      - Get single post
PUT    /api/posts/[id]      - Update post
DELETE /api/posts/[id]      - Delete post

GET    /api/posts/[id]/comments  - Get post comments
POST   /api/posts/[id]/comments  - Create comment
DELETE /api/comments/[id]         - Delete comment
```

**Important**: Route params are async in Next.js 15:
```typescript
const { id } = await params;  // NOT: const { id } = params
```

### Pages (`/app`)

Server Components by default, Client Components marked with `'use client'`:

- `/` - Post list (Server Component, uses `getPostsPaginated`)
- `/posts/new` - Create post form (Client Component)
- `/posts/[id]` - Post detail + comments (Client Component)
- `/posts/[id]/edit` - Edit post form (Client Component)

### Component Patterns

**PostCard** - List item component (single line layout):
- Displays: title, author, relative time, view/comment counts
- Used in list with `border-b` separators

**CommentList/CommentForm** - Comment section:
- `CommentList`: Fetches and displays comments, handles delete
- `CommentForm`: Creates new comments, triggers parent refresh via `onCommentAdded` callback
- Refresh pattern: Parent increments `commentRefresh` state to trigger re-fetch

**Pagination** - Smart page number display:
- Shows limited page numbers with "..." for large page counts
- Handles edge cases (first/last page states)

### Styling

Tailwind CSS with dark mode support via `dark:` variants. OKKY-inspired design:
- List layout (not grid) for posts
- Gradient avatars for user initials
- Relative time formatting (e.g., "3분 전", "2시간 전")
- Sticky header with navigation

### Path Aliases

`@/*` resolves to project root (configured in `tsconfig.json`):
```typescript
import { Post } from '@/types/post';
import { getPosts } from '@/lib/posts';
```

## Data Model

**Post**:
```typescript
{
  id: string;           // Timestamp-based
  title: string;
  content: string;
  author: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;
}
```

**Comment**:
```typescript
{
  id: string;
  postId: string;       // Foreign key to Post
  content: string;
  author: string;
  createdAt: string;
}
```

## Important Implementation Details

1. **Pagination**: Default 20 posts per page, configurable in `getPostsPaginated()`
2. **IDs**: Generated using `Date.now().toString()` - simple but not production-grade
3. **No authentication**: Author names are free-form text input
4. **Client-side state**: Post detail/edit pages fetch data on mount, not using Next.js data fetching
5. **Form navigation**: Forms use `router.push('/')` after success, `router.back()` on cancel
