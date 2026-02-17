import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import userservice from "../services/userservice";
import { useDispatch } from "react-redux";
import { setUsers } from "../reducers/usersReducer";
import { AppDispatch, RootState } from "../store";

export const User = () => {
  const id = Number(useParams().id);
  const users = useSelector((state: RootState) => state.users);
  const user = users.find((user) => user.id === id);
  const navigate = useNavigate();
  const loggedUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleDisableClick = async () => {
    const returnedUser = await userservice.update(id, loggedUser.token);
    dispatch(
      setUsers(users.map((user) => (user.id !== id ? user : returnedUser))),
    );
  };

  if (!user) return null;

  return (
    <div className="center">
      <h1>{user.username.toUpperCase()}</h1>
      <strong>Added recommendations:</strong>
      {!user.recommendations || user.recommendations.length === 0 ? (
        <p>No recommendations</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Recommendation</th>
              <th scope="col">Likes</th>
            </tr>
          </thead>
          {user.recommendations.map((recommendation, index) => (
            <tbody key={index}>
              <tr>
                <td scope="row">
                  <Link
                    style={{ padding: 5 }}
                    to={`/recommendations/${recommendation.id}`}
                  >
                    {recommendation.title}
                  </Link>
                </td>
                <td>{recommendation.likes}</td>
              </tr>
            </tbody>
          ))}
        </table>
      )}
      <br />
      {loggedUser.admin && (
        <>
          {user.disabled ? (
            <button id="activate-button" onClick={handleDisableClick}>
              Activate user
            </button>
          ) : (
            <button id="disable-button" onClick={handleDisableClick}>
              Disable user
            </button>
          )}
        </>
      )}
      <br />
      <br />
      <button onClick={() => navigate(-1)}>Go back</button>
    </div>
  );
};
