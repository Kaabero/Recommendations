import { AxiosError } from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { AddRecommendation } from "../../../types";
import { setNotification } from "../reducers/notificationReducer";
import { createRecommendation } from "../reducers/recommendationReducer";
import { setUsers } from "../reducers/usersReducer";
import recommendationservice from "../services/recommendationservice";
import userservice from "../services/userservice";
import { setIsOpen } from "../reducers/modalReducer";



export const AddRecommendationForm = () => {
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.users);

  const addNewRecommendation = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const newRecommendation: AddRecommendation = {
      title: title,
      service: service,
      url: url || null,
    };
    try {
      const returnedRecommendation = await recommendationservice.create(
        newRecommendation,
        user.token,
      );

      const recommendationUser = await userservice.getUserById(
        returnedRecommendation.userId,
      );

      const recommendation = {
        ...returnedRecommendation,
        user: recommendationUser,
      };
      dispatch(createRecommendation(recommendation));
      dispatch(
        setUsers(
          users.map((user) =>
            user.id !== recommendationUser.id ? user : recommendationUser,
          ),
        ),
      );
      dispatch(setIsOpen(false));
      dispatch(
        setNotification({
          text: `Recommendation "${newRecommendation.title}" added successfully`,
          type: "success",
        }),
      );
      setService("");
      setTitle("");
      setUrl("");
      navigate(`/recommendations/${returnedRecommendation.id}`);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        dispatch(
          setNotification({
            text: `${error.response?.data.error || "Failed to add recommendation"}`,
            type: "error",
          }),
        );
      }
    }
  };

  return (
    <div className="form">
      <h2>Add recommendation</h2>
      <form onSubmit={addNewRecommendation}>
        <label>
          Title* :{" "}
          <input
            id="title-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <br />
        <label>
          Streaming service* :{" "}
          <input
            id="service-input"
            type="text"
            value={service}
            onChange={(event) => setService(event.target.value)}
          />{" "}
        </label>
        <br />
        <label>
          IMDb URL:{" "}
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
        <br />
        * required fields <br />
        <button
          className="whitebutton"
          id="addRecommendation-button"
          type="submit"
        >
          Add
        </button>
      </form>
      <br />
    </div>
  );
};
