// api/post/route.ts
import { PrismaClient } from '@prisma';

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    // Prisma를 사용하여 'posts' 테이블의 모든 게시물 ID를 가져옵니다.
    const posts = await prisma.post.findMany({
      select: { id: true },  // 'id' 컬럼만 선택
    });

    // 결과가 정상적으로 반환되면 데이터 반환
    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('500 err', error);
    return new Response('Database connection error', { status: 500 });
  } finally {
    await prisma.$disconnect();  // Prisma 클라이언트 연결 해제
  }
};
