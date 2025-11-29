import { NextResponse } from 'next/server';
import { deleteComment } from '@/lib/comments';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteComment(id);

    if (!success) {
      return NextResponse.json(
        { error: '덧글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '덧글이 삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json(
      { error: '덧글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
