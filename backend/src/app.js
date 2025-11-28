import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import hrRouter from "./routes/hrRoutes.js";
import meetingRouter from "./routes/meetingRoutes.js";
import supportRouter from "./routes/supportRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.json({ ok: true, service: "ai-workspace-backend" });
});

app.use("/hr", hrRouter);
app.use("/support", supportRouter);
app.use("/meeting", meetingRouter);

app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log(`backend server listning on ${PORT}`));
