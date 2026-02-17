import express, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models";
import { Token } from "../models";

const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  if (user.disabled) {
    return res.status(401).json({
      error: "Account disabled, please contact admin",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const secret = process.env.SECRET;
  if (!secret) {
    res.status(500).json({ error: "SECRET is not defined in environment" });
    return;
  }

  const token = jwt.sign(userForToken, secret, {
    expiresIn: 60 * 60 * 60,
  });

  const newActiveToken = {
    token: token,
    active: true,
    username: user.username,
  };
  await Token.create(newActiveToken);

  res
    .status(200)
    .send({
      token,
      username: user.username,
      id: user.id,
      admin: user.admin,
      disabled: user.disabled,
    });
});

export default loginRouter;
