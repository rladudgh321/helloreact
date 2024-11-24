import { connectToDatabase } from "../../../lib";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const postId = params.id; // URL 경로에서 id 값 추출
  console.log("Requested post id:", postId); // 요청된 postId 확인

  const connection = await connectToDatabase();

  try {
    // 1. 특정 게시물의 데이터 가져오기
    const query = `
      SELECT 
        p.id AS id, 
        p.title, 
        p.createdAt AS date, 
        GROUP_CONCAT(DISTINCT t.name) AS tags,
        GROUP_CONCAT(DISTINCT i.src) AS images
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN images i ON p.id = i.postId
      WHERE p.id = ?
      GROUP BY p.id
    `;

    const postData = await new Promise<any>((resolve, reject) => {
      connection.query(query, [postId], (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (postData.length === 0) {
      // 해당 post가 없는 경우 404 에러 반환
      return new Response("Post not found", { status: 404 });
    }

    console.log('Fetched post data:', postData);

    return Response.json(postData[0]); // 첫 번째 게시물 데이터 반환
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Server error", { status: 500 });
  } finally {
    connection.end();
  }
}
