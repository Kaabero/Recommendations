import express, { Response, Request } from "express";
import { Recommendation, Token, Comment } from "../models";
import middleware from "../util/middleware";
import { CustomRequest } from "../../types";

const commentsRouter = express.Router();



commentsRouter.post(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = await Token.findOne({
      where: {
        username: user.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    const { comment } = req.body;
    const id = req.params.id;
    const recommendation = await Recommendation.findByPk(id);
    if (recommendation) {
      const newComment = await Comment.create({
        comment: comment,
        userId: user.id,
        recommendationId: id
      })

      res.status(201).json(newComment);
    } else {
      res.status(404).json({ error: "Cannot find recommendation" });
    }
  },
);

commentsRouter.get(
  "/",
  async (req: CustomRequest, res: Response) => {
    const comments = await Comment.findAll();
    res.json(comments);
  }
);

commentsRouter.get(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = await Token.findOne({
      where: {
        username: user.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    const id = req.params.id
    const comment = await Comment.findByPk(id);
    res.json(comment);
  }
);

commentsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = await Token.findOne({
      where: {
        username: user.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }

    const id = req.params.id;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({error: "Cannot find comment"})
    }

    if (comment.userId === user.id) {
  
      await Comment.destroy({
        where: {
          id: id
        }
      })
  
      res.status(204).end();
    
    } else {
    return res
      .status(401)
      .json({ error: "User is not authorized to delete this comment" });
    }
  },
);

commentsRouter.put(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = await Token.findOne({
      where: {
        username: user.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    const id = req.params.id;
    const { comment } = req.body;
    const commentToModify = await Comment.findByPk(id)
    if (!commentToModify) {
        return res.status(404).json({ error: "Cannot find comment"})
    }
    if (commentToModify.userId === user.id) {

        commentToModify.comment = comment;
        commentToModify.save()
        res.json(commentToModify);
    } else {
        return res
        .status(401)
        .json({ error: "User is not authorized to edit this comment" });
    }

    }
);

commentsRouter.get(
  "/:id",
  middleware.userExtractor,
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = await Token.findOne({
      where: {
        username: user.username,
      },
    });
    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }
    const id = req.params.id;
    const { comment } = req.body;
    const commentToModify = await Comment.findByPk(id)
    if (!commentToModify) {
        return res.status(404).json({ error: "Cannot find comment"})
    }

    commentToModify.comment = comment;
    commentToModify.save()
    res.json(commentToModify);
  }
);

export default commentsRouter;
