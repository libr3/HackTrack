import pg from "pg";
import env from "dotenv";
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS hackathons (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        date DATE,
        project_title VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
        hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        tech_stack VARCHAR(255),
        repo_link VARCHAR(255),
        demo_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS awards (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
        hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
        award_name VARCHAR(100),
        award_details TEXT,
        award_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("All tables created successfully!");
  } catch (err) {
    console.error(err);
  } 
};

db.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Connection error', err.stack));

export { db, createTables };
