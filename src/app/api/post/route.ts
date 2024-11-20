// api/post/router.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib';

export async function GET(req: Request) {
  // URL에서 id 추출
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id'));
  const connection = await connectToDatabase();
  // id가 없다면 400 에러 리턴
  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const query = `
    SELECT 
      p.id AS id, 
      p.title, 
      p.createdAt AS date, 
      GROUP_CONCAT(DISTINCT t.name) AS tags,
      GROUP_CONCAT(DISTINCT i.src) AS images
    FROM \`posts\` p
    LEFT JOIN \`post_tags\` pt ON p.id = pt.post_id
    LEFT JOIN \`tags\` t ON pt.tag_id = t.id
    LEFT JOIN \`images\` i ON p.id = i.postId
    WHERE p.id = ${id}
    GROUP BY p.id;
  `;
    const rows = await new Promise<any>((resolve, reject) => {
      connection.query(query, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    return Response.json(rows)
  } catch (error) {
    console.error('500 err', error);
    return new Response('Database connection error', { status: 500 });
  } finally {
    connection.end(); // 연결 종료
  }
}
