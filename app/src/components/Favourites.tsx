import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { RecommendationType } from "../../../types";
import favouriteservice from "../services/favouriteservice";
import { setUsers } from "../reducers/usersReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const Favourites = () => {
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.users)
  const loggedUser = users.find(u => u.id === user.id);


  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  if (!loggedUser) return;
  
  const usersFavourites = loggedUser.favouriteRecommendations



  const handleRemoveClick = async (recommendation: RecommendationType) => {
      if (
        window.confirm(
          `Do you want to delete recommendation "${recommendation.title}" from your favourites?`,
        )
      ) {
        try {
          await favouriteservice.remove(recommendation.id, user.token);
 
          const updatedFavourites = loggedUser.favouriteRecommendations?.filter(r => r.id != recommendation.id) 

          const updatedUser = {
            ...loggedUser,
            favouriteRecommendations: updatedFavourites
          }
            
          dispatch(
            setUsers(
                users.map((u) =>
                    u.id !== loggedUser.id ? u : updatedUser,
                ),
            ),
          );
          dispatch(
            setNotification({
              text: "Recommendation removed successfully from your favourites",
              type: "success",
            }),
          );
          navigate("/favourites");
        } catch (error) {
          console.error(error);
          if (error instanceof AxiosError) {
            dispatch(
              setNotification({
                text: `${error.response?.data.error || "Failed to remove recommendation from your favourites"}`,
                type: "error",
              }),
            );
          } else {
            dispatch(
              setNotification({
                text: "Failed to delete recommendation from your favourites",
                type: "error",
              }),
            );
          }
        }
      } else {
        return;
      }
    };

  return (
    <div className="center">
      <h1>Your favourites</h1>
      {usersFavourites?.length === 0 || !usersFavourites ? (
        <p>No favourites</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Recommendation</th>
              <th scope="col">Likes</th>
              <th scope="col">Remove from Favourites</th>
            </tr>
          </thead>

          {usersFavourites.map(recommendation => (
            <tbody key={recommendation.id}>
              <tr>
                <td scope="row">{recommendation.title}</td>
                <td>{recommendation.likes}</td>
                <td><button className="whitebutton" onClick={() => handleRemoveClick(recommendation)}> Remove </button></td>
              </tr>
            </tbody>
          ))}
        </table>
      )}
    </div>
  );
};