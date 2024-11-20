import { connectToDatabase } from '../../lib';

export async function GET(req: Request) {
  // URL에서 id 추출
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id'));

  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 });
  }

  const connection = await connectToDatabase();

  try {
    // 안전한 방식으로 쿼리 작성 (Prepared Statements 사용)
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
      WHERE p.id = ?
      GROUP BY p.id;
    `;
    
    // 파라미터를 쿼리에 안전하게 바인딩
    const rows = await new Promise<any>((resolve, reject) => {
      connection.query(query, [id], (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    return Response.json(rows);
  } catch (error) {
    console.error('500 err', error);
    return new Response('Database connection error', { status: 500 });
  } finally {
    connection.end(); // 연결 종료
  }
}
