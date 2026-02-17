import User from "./user";
import Recommendation from "./recommendation";
import Token from "./token";
import Favourite from "./favourite";
import Comment from "./comment";

User.hasMany(Recommendation, { foreignKey: "userId", as: "recommendations" });
Recommendation.belongsTo(User, { foreignKey: "userId", as: "user" });

User.belongsToMany(Recommendation, { through: Favourite, as: 'favouriteRecommendations' })
Recommendation.belongsToMany(User, { through: Favourite, as: 'usersWhoFavourited' })


export { User, Recommendation, Token, Favourite, Comment };
