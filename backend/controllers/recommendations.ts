import express, { Response, Request } from "express";
import { User, Recommendation, Token, Favourite, Comment } from "../models";
import { Op } from "sequelize";
import middleware from "../util/middleware";
import { CustomRequest } from "../../types";

const recommendationsRouter = express.Router();

recommendationsRouter.get("/", async (req: Request, res: Response) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          service: { [Op.iLike]: "%" + req.query.search + "%" },
        },
        {
          title: { [Op.iLike]: "%" + req.query.search + "%" },
        },
      ],
    };
  }
  const recommendations = await Recommendation.findAll({
    order: [["likes", "DESC"]],
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["passwordHash"] },
    },
    where,
  });

  res.json(recommendations);
});

recommendationsRouter.post(
  "/",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const body = req.body;

    if (!body.title || !body.service) {
      return res
        .status(400)
        .json({ error: "Some required fields (*) are missing" });
    }

    const user = req.user;
    const token = await Token.findOne({
      where: {
        username: user?.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }

    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const recommendation = await Recommendation.create({
      ...body,
      userId: user.id,
    });
    res.status(201).json(recommendation);
  },
);

recommendationsRouter.get(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const recommendation = await Recommendation.findByPk(req.params.id, {
      include: {
        model: User,
        as: "user",
        attributes: { exclude: ["passwordHash"] },
      },
    });
    const user = req.user;
    const token = await Token.findOne({
      where: {
        username: user?.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    if (recommendation) {
      res.json(recommendation);
    } else {
      res.status(404).end();
    }
  },
);

recommendationsRouter.put(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const body = req.body;
    const user = req.user;
    const token = await Token.findOne({
      where: {
        username: user?.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    const recommendation = await Recommendation.findByPk(req.params.id, {
      include: {
        model: User,
        as: "user",
        attributes: { exclude: ["passwordHash"] },
      },
    });
    if (recommendation) {
      recommendation.likes = body.likes;
      await recommendation.save();
      res.json(recommendation);
    } else {
      res.status(404).json({ error: "Cannot find recommendation" });
    }
  },
);

recommendationsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    const recommendation = await Recommendation.findByPk(id);
    if (!recommendation) {
      return res.status(404).json({ error: "Cannot find recommendation" });
    }
    const loggedUser = req.user;

    const token = await Token.findOne({
      where: {
        username: loggedUser?.username,
      },
    });

    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }

    if (!loggedUser) {
      return res.status(404).json({ error: "Cannot find user" });
    }


    if (recommendation.userId === loggedUser.id) {
  
      await Favourite.destroy({
        where: {
          recommendationId: id
        }
      })

      await Comment.destroy({
        where: {
          recommendationId: id
        }
      })
  
      await Recommendation.destroy({
        where: {
          id: id,
        },
      });
      res.status(204).end();
    }
    return res
      .status(401)
      .json({ error: "User is not authorized to delete this recommendation" });
  },
);




export default recommendationsRouter;
