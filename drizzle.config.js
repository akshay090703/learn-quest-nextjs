export default {
  dialect: "postgresql",
  schema: "./config/schema.js",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
};
