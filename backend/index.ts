import express from "express";
import middleware from "./util/middleware";
import config from "./util/config";
import recommendationsRouter from "./controllers/recommendations";
import usersRouter from "./controllers/users";
import loginRouter from "./controllers/login";
import servicesRouter from "./controllers/services";
import testingRouter from "./controllers/testing";
import logoutRouter from "./controllers/logout";
import favouritesRouter from "./controllers/favourites";
import commentsRouter from "./controllers/comments";
import { connectToDatabase } from "./util/db";


const app = express();

const PORT = config.PORT;

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/recommendations", recommendationsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/services", servicesRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/favourites", favouritesRouter )
app.use("/api/comments", commentsRouter )

if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "teste2e" ) {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};


if (process.env.NODE_ENV !== 'test') {
  start();
}


export default app;
