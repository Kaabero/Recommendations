import express, { Response } from "express";
import middleware from "../util/middleware";
import { sequelize } from "../util/db";
import { Recommendation, Token } from "../models";
import { CustomRequest } from "../../types";

const servicesRouter = express.Router();

servicesRouter.get(
  "/",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const loggedUser = req.user;

    const token = await Token.findOne({
      where: {
        username: loggedUser?.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    const services = await Recommendation.findAll({
      group: "service",
      attributes: [
        "service",
        [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
        [sequelize.fn("COUNT", sequelize.col("id")), "recommendations"],
      ],
      order: [["likes", "DESC"]],
    });
    res.json(services);
  },
);

export default servicesRouter;
