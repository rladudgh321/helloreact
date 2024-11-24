// api/post/route.ts
import { connectToDatabase } from '../../lib';

export const GET = async (req: Request) => {
   const connection = await connectToDatabase();

  try {
    // 1. 전체 게시물 수를 구하는 쿼리
    const query = 'SELECT id from posts';
    const queryResult = await new Promise<any>((resolve, reject) => {
      connection.query(query, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    return Response.json({ posts: queryResult });
  } catch (error) {
    console.error('500 err', error);
    return new Response('Database connection error', { status: 500 });
  } finally {
    connection.end(); // 연결 종료
  }
};
