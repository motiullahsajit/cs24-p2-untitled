import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import cors from "cors";

import routes from "./routes/routes.js";

config({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);

app.get("/", (req, res) => {
  res.send("API working with /api/v1/");
});

app.use("/", routes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});
