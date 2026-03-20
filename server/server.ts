import express from "express";
import cors from "cors";
import path from "path";
import router from "./src/router/router";

const app = express();
const PORT = 4000;
const HOST = "0.0.0.0";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

// Статика для картинок товаров.
// URL вида `/img/<filename>` будут раздаваться из `server/database/img`.
app.use("/img", express.static(path.join(__dirname, "database", "img")));

app.use("/api", router);

app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});
