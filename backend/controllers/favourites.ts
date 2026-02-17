import express, { Response, Request } from "express";
import { Favourite, Token } from "../models";
import middleware from "../util/middleware";
import { CustomRequest } from "../../types";

const favouritesRouter = express.Router();

favouritesRouter.post("/", middleware.userExtractor, async (req: CustomRequest, res: Response) => {
  const body = req.body;
  const user = body.userId
  const recommendation = body.recommendationId

  
  const loggedUser = req.user;

  if (!loggedUser) {
      return res.status(404).json({ error: "Cannot find user" });
  }

  const token = await Token.findOne({
      where: {
        username: loggedUser?.username,
      },
  });

  if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
  }

  if (loggedUser.id != user) {
    return res
      .status(401)
      .json({ error: "User is not authorized to mark this recommendation as favourite" });
  }

  const favourites = await Favourite.findAll({})


  const existingFavourite = favourites.find(favourite => favourite.userId == user && favourite.recommendationId == recommendation)



  if (existingFavourite) {
    return res.status(400).json({ error: "You have already marked this recommendation as your favourite." });
  }

  const favourite = await Favourite.create({
      recommendationId: recommendation,
      userId: user,
    });
    res.status(201).json(favourite);

});

favouritesRouter.delete("/:id", middleware.userExtractor, async (req: CustomRequest, res:Response) => {
    const id = req.params.id;
    

    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(404).json({ error: "Cannot find user" });
    }

    const token = await Token.findOne({
      where: {
        username: loggedUser?.username,
      },
    });

    if (!token || token.active == false) {
      return res.status(403).json({ error: "Authentication failed" });
    }

    await Favourite.destroy({
        where: {
          userId: loggedUser.id,
          recommendationId: id
        }
    })

    res.status(204).end();
})

export default favouritesRouter;
