import mysql from 'mysql2';

export const connectToDatabase = async () => {
  return new Promise<any>((resolve, reject) => {
    const connection = mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_NAME,
    });

    connection.connect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};