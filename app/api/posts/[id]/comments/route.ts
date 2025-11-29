import { NextResponse } from 'next/server';
import { getCommentsByPostId, createComment } from '@/lib/comments';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await getCommentsByPostId(id);
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: '덧글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, author } = body;

    if (!content || !author) {
      return NextResponse.json(
        { error: '내용과 작성자는 필수입니다.' },
        { status: 400 }
      );
    }

    const comment = await createComment({ postId: id, content, author });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '덧글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
