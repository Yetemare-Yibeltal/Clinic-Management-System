// server.js — Entry point: connects to MongoDB, then starts Express server
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

async function startServer() {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(
      `Kidus Yared Healthcare API running on http://localhost:${ENV.PORT}`,
    );
    console.log(`Environment: ${ENV.NODE_ENV}`);
  });
}

startServer();
