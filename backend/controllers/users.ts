import express, { Response, Request } from "express";
import bcrypt from "bcrypt";
import middleware from "../util/middleware";
import { User, Recommendation, Token, Comment } from "../models";
import { CustomRequest } from "../../types";

const usersRouter = express.Router();

usersRouter.get("/", async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: [
      {
      model: Recommendation,
      as: "recommendations",
    },
    {
        model: Recommendation,
        as: 'favouriteRecommendations',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
    },
    ],
    order: [
      [{ model: Recommendation, as: "recommendations" }, "likes", "DESC"],
    ],
  });
  res.json(users);
});

usersRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  if (!body.username || !body.password) {
    return res.status(400).json({ error: "Username or password missing" });
  }

  const username = body.username.trim();
  if (body.password.length < 3 || username.length < 3) {
    return res.status(400).json({
      error: "Invalid username or password",
    });
  }
  const users = (await User.findAll({})) as User[];

  const usernames = users.map((user) => user.username.toLowerCase());

  const existingUser = usernames.find((u) => u === username.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ error: "Username already in use" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const newUser = {
    username: username,
    passwordHash: passwordHash,
  };

  const user = await User.create(newUser);
  const userToReturn = await User.findByPk(user.id, {
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Recommendation,
      as: "recommendations",
    },
    order: [
      [{ model: Recommendation, as: "recommendations" }, "likes", "DESC"],
    ],
  });
  res.json(userToReturn);
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["passwordHash"] },
    include: [{
      model: Recommendation,
      as: "recommendations",
    },
    {
        model: Recommendation,
        as: 'favouriteRecommendations',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
    }
    ],
    order: [
      [{ model: Recommendation, as: "recommendations" }, "likes", "DESC"],
    ],
  });
  if (user) {
    res.json(user);
  } else {
    return res.status(404).json({ error: "Cannot find user" });
  }
});

usersRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ error: "Cannot find user" });
  }
  await Comment.destroy({
        where: {
          user_id: id
        }
      })
  await User.destroy({
    where: {
      id: id,
    },
  });
  res.status(204).end();
});

usersRouter.put(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    const user = req.user;
    let token;

    token = await Token.findOne({
      where: {
        username: user?.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    const userToChange = await User.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
      include: {
        model: Recommendation,
        as: "recommendations",
      },
      order: [
        [{ model: Recommendation, as: "recommendations" }, "likes", "DESC"],
      ],
    });
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!user.admin) {
      return res.status(401).json({ error: "Operation not permitted" });
    }

    if (userToChange) {
      userToChange.disabled = !userToChange.disabled;
      await userToChange.save();
      token = await Token.findOne({
        where: {
          username: userToChange.username,
        },
      });
      if (token) {
        token.active = !userToChange.disabled;
        await token.save();
      }

      res.json(userToChange);
    } else {
      return res.status(404).json({ error: "Cannot find user" });
    }
  },
);

export default usersRouter;
