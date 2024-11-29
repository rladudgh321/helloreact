import { PrismaClient } from '@prisma';

export const GET = async (req: Request) => {
  const prisma = new PrismaClient();
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const postsPerPage = Number(url.searchParams.get('postsPerPage')) || 10;
  const tag = url.searchParams.get('tag') || ''; // tag 파라미터 처리

  const offset = (page - 1) * postsPerPage;

  try {
    // 1. 전체 게시물 수를 구하는 쿼리
    let countQuery = prisma.post.count();
    if (tag) {
      countQuery = prisma.post.count({
        where: {
          tags: {
            some: { name: tag } // 태그 필터링
          }
        }
      });
    }

    const totalCount = await countQuery;

    // 2. 현재 페이지에 해당하는 게시물 데이터를 가져오는 쿼리
    let postsQuery = prisma.post.findMany({
      select: {
        id: true,
        title: true,
        tags: true, // 태그 포함
      },
      skip: offset,
      take: postsPerPage,
    });

    if (tag) {
      postsQuery = prisma.post.findMany({
        where: {
          tags: {
            some: { name: tag } // 특정 태그에 해당하는 게시물만 필터링
          }
        },
        select: {
          id: true,
          title: true,
          tags: true,
        },
        skip: offset,
        take: postsPerPage,
      });
    }

    const posts = await postsQuery;

    return new Response(
      JSON.stringify({
        totalCount,
        posts,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('500 err', error);
    return new Response('Database connection error', { status: 500 });
  } finally {
    await prisma.$disconnect(); // Prisma 연결 해제
  }
};
