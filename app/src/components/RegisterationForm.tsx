import { AxiosError } from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";
import { setNotification } from "../reducers/notificationReducer";
import { createUser } from "../reducers/usersReducer";
import userservice from "../services/userservice";

export const RegisterationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const addNewUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    try {
      const returnedUser = await userservice.create(user);
      setUsername("");
      setPassword("");
      dispatch(
        setNotification({
          text: "Registeration completed. You can now log in.",
          type: "success",
        }),
      );
      dispatch(createUser(returnedUser));
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        dispatch(
          setNotification({
            text: `${error.response?.data.error || "Registeration failed"}`,
            type: "error",
          }),
        );
      }
    }
  };
  return (
    <>
      <h2>Registeration</h2>
      <form onSubmit={addNewUser}>
        Username:{" "}
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />{" "}
        <br />
        Password:{" "}
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <button type="submit">Sing up</button>
      </form>
      <button className="whitebutton" onClick={() => navigate("/login")}>
        Already have account? Sing in!
      </button>
    </>
  );
};
