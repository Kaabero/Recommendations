import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { clearUser } from "../reducers/userReducer";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";
import userservice from "../services/userservice";
import { RootState } from "../store";

export const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const logout = () => {
    try {
      window.localStorage.removeItem("loggedUser");
      dispatch(clearUser(null));
      dispatch(
        setNotification({ text: "You have been logged out.", type: "success" }),
      );
      userservice.logout(user.token);
      navigate("/login");
    } catch (error) {
      console.error(error);
      dispatch(setNotification({ text: "Failed to log out.", type: "error" }));
    }
  };

  return (
    <>
      <button id="logout-button" className="whitebutton" onClick={logout}>
        Log out
      </button>
    </>
  );
};
