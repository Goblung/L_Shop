import express from "express";
import cors from "cors";
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

app.use("/api", router);

app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});
