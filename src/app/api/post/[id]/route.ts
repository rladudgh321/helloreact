// api/post/[id]/route.ts
import { PrismaClient } from '@prisma';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const postId = parseInt(params.id); // URL 경로에서 id 값을 추출하고 숫자로 변환

  try {
    // 1. 특정 게시물의 데이터 가져오기 (tags와 images를 포함하여 가져오기)
    const postData = await prisma.post.findUnique({
      where: { id: postId }, // 특정 게시물 조회
      include: {
        tags: true,
        images: true,
      },
    });

    if (!postData) {
      // 해당 게시물이 없는 경우 404 에러 반환
      return new Response('Post not found', { status: 404 });
    }

    // 태그와 이미지 데이터를 처리하여 반환할 데이터 형식 맞추기
    const { id, title, tags, images } = postData;

    const responseData = {
      id,
      title,
      tags,
      images
      // tags: tags ? tags.map((tag) => tag.id) : [], // 태그 배열 처리
      // images: images ? images.map((image) => image.src) : [], // 이미지 배열 처리
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response('Server error', { status: 500 });
  } finally {
    await prisma.$disconnect(); // Prisma 클라이언트 연결 해제
  }
}
