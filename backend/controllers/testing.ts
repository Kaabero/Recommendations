import express, { Response, Request } from "express";
import { User, Recommendation } from "../models";

const testingRouter = express.Router();

testingRouter.post("/reset", async (request: Request, response: Response) => {
  await Recommendation.destroy({ where: {} });
  await User.destroy({ where: {} });

  response.status(204).end();
});

export default testingRouter;
