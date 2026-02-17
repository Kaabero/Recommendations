import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import commentservice from "../services/commentservice";
import { RootState, AppDispatch } from "../store";
import { createComment } from "../reducers/commentReducer";
import { Comment } from "../../../types";


export const AddCommentForm = () => {
    const [comment, setComment] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const recommendations = useSelector(
    (state: RootState) => state.recommendations,
  );
  const users = useSelector((state: RootState) => state.users);
  const id = Number(useParams().id);
  const loggedUser = users.find(u => u.id === user.id);
  
  const recommendation = recommendations.find(
    (recommendation) => recommendation.id === id,
  );
  if (!loggedUser) return;

  if (!recommendation) {
    return null;
  }


    const addComment = async (event: React.FormEvent<HTMLFormElement>) => {
        if (comment == "") return;
        event.preventDefault();
        try {
          const returnedComment = await commentservice.addComment(
            recommendation.id,
            comment,
            user.token,
          );
          dispatch(createComment({id: returnedComment.id, comment: comment, userId: user.id, recommendationId: id}))
          setComment("");
        } catch (error) {
          if (error instanceof AxiosError) {
            dispatch(
              setNotification({
                text: `${error.response?.data.error || "Failed to add comment"}`,
                type: "error",
              }),
            );
          } else {
            dispatch(
              setNotification({
                text: "Failed to add comment",
                type: "error",
              }),
            );
          }
        }
      };

    return (
        <form onSubmit={addComment}>
        <label>
          Add comment :{" "}
          <input
            id="comment-input"
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button className="whitebutton" id="addcomment-button" type="submit">
            Add comment
          </button>
        </label>
      </form>
    )
}