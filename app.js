import express from "express";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import indexRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);

const port = process.env.PORT || 3000;
const entryPath = process.argv[1];
const isDirectRun =
  entryPath && import.meta.url === pathToFileURL(path.resolve(entryPath)).href;

if (isDirectRun) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Mini Message Board listening on port ${port}`);
  });
}

export default app;
