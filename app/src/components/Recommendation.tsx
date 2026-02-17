import { useNavigate } from "react-router-dom";
import recommendationservice from "../services/recommendationservice";
import favouriteservice from "../services/favouriteservice";
import { AxiosError } from "axios";
import {
  remove,
  like,
  setRecommendations,
} from "../reducers/recommendationReducer";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { setUsers } from "../reducers/usersReducer";
import userservice from "../services/userservice";
import { RootState, AppDispatch } from "../store";
import { AddFavourite } from "../../../types";
import { RecommendationType } from "../../../types";
import { setIsOpen } from "../reducers/modalReducer";
import { EditCommentForm } from "./EditCommentForm";
import Modal from "./Modal"
import { Comment } from "../../../types";
import { AddCommentForm } from "./AddCommentForm";

export const Recommendation = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [commentToEdit, setCommentToEdit] = useState<Comment | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const allComments = useSelector((state: RootState) => state.comments)
  const recommendations = useSelector(
    (state: RootState) => state.recommendations,
  );
  const isOpen = useSelector((state: RootState) => state.modal)
  const users = useSelector((state: RootState) => state.users);

  const id = Number(useParams().id);
  const comments = allComments.filter(c => c.recommendationId == id)
  const loggedUser = users.find(u => u.id === user.id);
  
  const recommendation = recommendations.find(
    (recommendation) => recommendation.id === id,
  );
  if (!loggedUser) return;

  if (!recommendation) {
    return null;
  }

  const handleLikeClick = async (recommendation: RecommendationType) => {
    const newLikes = recommendation.likes + 1;
    const updatedRecommendation = { ...recommendation, likes: newLikes };

    try {
      const changedRecommendation = await recommendationservice.update(
        recommendation.id,
        updatedRecommendation,
        user.token,
      );
      dispatch(like(recommendation));
      dispatch(
        setRecommendations(
          recommendations.map((r) =>
            r.id != changedRecommendation.id ? r : changedRecommendation,
          ),
        ),
      );
      const recommendationUser = await userservice.getUserById(
        recommendation.user?.id,
      );
      dispatch(
        setUsers(
          users.map((user) =>
            user.id !== recommendationUser.id ? user : recommendationUser,
          ),
        ),
      );
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        dispatch(
          setNotification({
            text: `${error.response?.data.error || "Failed to add like"}`,
            type: "error",
          }),
        );
      } else {
        dispatch(
          setNotification({
            text: "Failed to add like",
            type: "error",
          }),
        );
      }
    }
  };

  

  const handleAddFavouriteClick = async (
      recommendation: RecommendationType,
    ) => {
  
      const newFavourite: AddFavourite = {
        userId: user.id,
        recommendationId: recommendation.id
      };

      try {
        await favouriteservice.create(
          newFavourite,
          user.token,
        );

      
        const updatedUser = {
          ...loggedUser,
          favouriteRecommendations: loggedUser.favouriteRecommendations?.concat(recommendation)
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
            text: `Recommendation "${recommendation.title}" added successfully to your favourites`,
            type: "success",
          }),
        );
        navigate('/favourites')
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          dispatch(
            setNotification({
              text: `${error.response?.data.error || "Failed to add recommendation to your favourites"}`,
              type: "error",
            }),
          );
        }
      }
    };

  const handleDeleteClick = async (recommendation: RecommendationType) => {
    if (
      window.confirm(
        `Do you want to delete recommendation "${recommendation.title}"?`,
      )
    ) {
      try {
        await recommendationservice.remove(recommendation.id, user.token);
        dispatch(remove(recommendation));
        const recommendationUser = await userservice.getUserById(
          recommendation.user?.id,
        );
        dispatch(
          setUsers(
            users.map((user) =>
              user.id !== recommendationUser.id ? user : recommendationUser,
            ),
          ),
        );
        dispatch(
          setNotification({
            text: "Recommendation deleted successfully",
            type: "success",
          }),
        );
        navigate("/recommendations");
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          dispatch(
            setNotification({
              text: `${error.response?.data.error || "Failed to delete recommendation"}`,
              type: "error",
            }),
          );
        } else {
          dispatch(
            setNotification({
              text: "Failed to delete recommendation",
              type: "error",
            }),
          );
        }
      }
    } else {
      return;
    }
  };

  const handleEditCommentClick = (c: Comment): void => {
    dispatch(setIsOpen(true))
    dispatch(setNotification({ text: "", type: null }))
    setCommentToEdit(c)
    
  };

  return (
    <div className="center">
      <h1>{recommendation.title}</h1>
      Streaming service: {recommendation.service} <br />
      {recommendation.url && (
        <>
          IMDb URL:{" "}
          <a href={`https://${recommendation.url}`}>{recommendation.url}</a>
          <br />
        </>
      )}
      Likes: {recommendation.likes}{" "}
      <button
        id={`like-button-${recommendation.title}`}
        onClick={() => handleLikeClick(recommendation)}
      >
        Like
      </button>
      <br />
      Added by: {recommendation.user?.username} <br />
      <br />
      <button onClick={() => handleAddFavouriteClick(recommendation)}>Add to your favourites</button>
      
      {recommendation.user?.id === user.id && (
        <>
          {" "}
          <button
            id={`delete-button-${recommendation.title}`}
            onClick={() => handleDeleteClick(recommendation)}
          >
            Delete
          </button>
        </>
      )}
      <br />
      <h2>Comments:</h2>
      <ul>
        {comments.map(comment => (
          <li
            key={comment.id}>{comment.comment}{" "}
            <button className="smallwhitebutton" onClick={() => handleEditCommentClick(comment)}>...</button>
            <Modal isOpen={isOpen} onClose={() => dispatch(setIsOpen(false))}>
              <EditCommentForm comment={commentToEdit} />
              <br />
              <button onClick={() => dispatch(setIsOpen(false))}>Cancel</button>
          </Modal>
          </li>
          
        ))}
      </ul>
      <br />
      <AddCommentForm/>
      <br />
      <button onClick={() => navigate(-1)}>Go back</button>
    </div>
  );
};
