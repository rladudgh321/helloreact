

// export async function GET() {
//     return NextResponse.json({message: 'hello world'}, {
//         status: 200,
//     });
// }

// export async function GET(request: Request) {
//   return new Response('Hello, Next.js!', {
//     status: 200,
//   })
// }

import { connectToDatabase } from '../lib';

export const GET = async () => {
  const connection = await connectToDatabase();
  try {
    const query = `SELECT 
    p.id AS id, 
    p.title, 
    p.createdAt AS date, 
    GROUP_CONCAT(DISTINCT t.name) AS tags,
    GROUP_CONCAT(DISTINCT i.src) AS images
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
LEFT JOIN images i ON p.id = i.postId
GROUP BY p.id;
`
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
};

