import { AxiosError } from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";
import { Credentials } from "../../../types";
import { setNotification } from "../reducers/notificationReducer";
import { setUser } from "../reducers/userReducer";
import userservice from "../services/userservice";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userToLogIn: Credentials = {
      username: username,
      password: password,
    };
    try {
      const loggedInUser = await userservice.login(userToLogIn);
      window.localStorage.setItem("loggedUser", JSON.stringify(loggedInUser));
      dispatch(setUser(loggedInUser));
      dispatch(
        setNotification({
          text: "You have successfully logged in",
          type: "success",
        }),
      );
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        dispatch(
          setNotification({
            text: `${error.response?.data.error || "Failed to log in"}`,
            type: "error",
          }),
        );
      }
    }
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={login}>
        Username:{" "}
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />{" "}
        <br />
        Password:{" "}
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />{" "}
        <br />
        <button id="login-button" type="submit">
          Sign in
        </button>
      </form>
      <button
        className="whitebutton"
        onClick={() => navigate("/registeration")}
      >
        New user? Sing up!{" "}
      </button>
    </>
  );
};
