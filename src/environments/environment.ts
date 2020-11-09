import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  dbLogging: JSON.parse(process.env.DB_LOGGING),
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT, 10),
  dbUser: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  dbPassword: process.env.DB_PASSWORD,
  dbType: 'mysql',
};
