import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";
import authRoutes from "./routes/AuthRoutes.js";
import userInfoRoutes from "./routes/UserInfoRoutes.js";
import loveLanguagesRoutes from "./routes/LoveLanguagesRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import symptomRoutes from "./routes/SymptomRoutes.js";
import periodLogRoutes from "./routes/PeriodLogRoutes.js";
import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { UserInfo } from "./models/UserInfo.js";
import { Symptom } from "./models/Symptom.js";
import { PeriodLog } from "./models/PeriodLog.js";
import { LoveLanguagesResult } from "./models/LoveLanguagesResult.js";
import { SymptomLog } from "./models/SymptomLog.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(
    join(__dirname, "asone-app-firebase-adminsdk-ueegw-d42ccfd758.json"),
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AppDataSource = new DataSource({
  type: "postgres",
  host: "asone-postgres-db.cvgkuegmoles.us-east-1.rds.amazonaws.com",
  ssl: {
    rejectUnauthorized: false,
  },
  port: parseInt(process.env.DB_PORT || "5432"),
  username: "asone_user",
  password: "Chelovek38!",
  database: "asone_db",
  synchronize: true,
  logging: true,
  entities: [User, UserInfo, LoveLanguagesResult, Symptom, PeriodLog, SymptomLog],
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connected to database successfully");

    app.use("/auth", authRoutes);
    app.use("/userInfo", userInfoRoutes);
    app.use("/user", userRoutes);
    app.use("/love_languages_results", loveLanguagesRoutes);
    app.use("/symptoms", symptomRoutes);
    app.use("/period_logs", periodLogRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`
🚀 Server is up and running!
🌐 http://localhost:${PORT}
⏰ ${new Date().toLocaleString()}
🛣  Available Routes:
    - /auth
    - /userInfo
    - /user
    - /love_languages_results
    - /symptoms
    - /period_logs

👨‍💻 Happy coding!
      `);
    });
  })
  .catch((error) => {
    console.error("❌ TypeORM connection error: ", error);
    process.exit(1);
  });

export { AppDataSource };
