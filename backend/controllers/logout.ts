import express, { Response, Request } from "express";
import { Token } from "../models";

const logoutRouter = express.Router();

logoutRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  await Token.destroy({
    where: {
      token: body.token,
    },
  });
  res.status(204).end();
});

export default logoutRouter;
