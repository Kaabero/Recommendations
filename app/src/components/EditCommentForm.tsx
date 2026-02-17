import { AxiosError } from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setComments } from "../reducers/commentReducer";
import { setNotification } from "../reducers/notificationReducer";
import commentservice from "../services/commentservice";
import { setIsOpen } from "../reducers/modalReducer";
import { Comment } from "../../../types";



type EditCommentFormProps = {
  comment: Comment | null;
};


export const EditCommentForm = ({ comment }: EditCommentFormProps) => {

    const loggedUser = useSelector((state: RootState) => state.user);
    const comments = useSelector((state: RootState) => state.comments);
    const users = useSelector((state: RootState) => state.users)
    if (!comment) return;
    const commentedUser = users.find(u => u.id == comment.userId)
    const [editedComment, setEditedComment] = useState(comment.comment);


    const dispatch = useDispatch<AppDispatch>();
    
    const editComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
          const returnedComment = await commentservice.update(
            comment.id,
            editedComment,
            loggedUser.token,
          );
          dispatch(setComments(comments.map(c => c.id != comment.id ? c : returnedComment)))
          dispatch(setIsOpen(false));
        } catch (error) {
          if (error instanceof AxiosError) {
            dispatch(
              setNotification({
                text: `${error.response?.data.error || "Failed to edit comment"}`,
                type: "error",
              }),
            );
          } else {
            dispatch(
              setNotification({
                text: "Failed to edit comment",
                type: "error",
              }),
            );
          }
        }
      };

      const deleteComment = () => {
        try {
            commentservice.remove(comment.id, loggedUser.token)
            dispatch(setComments(comments.filter(c => c.id != comment.id)))
            dispatch(setIsOpen(false));
        }catch (error) {
          if (error instanceof AxiosError) {
            dispatch(
              setNotification({
                text: `${error.response?.data.error || "Failed to delete comment"}`,
                type: "error",
              }),
            );
          } else {
            dispatch(
              setNotification({
                text: "Failed to delete comment",
                type: "error",
              }),
            );
          }
        }
      }


    return (
        <div className="form">
        <h3>Comment: {comment.comment}</h3>
        { commentedUser && (
            <p>From user: {commentedUser.username} </p>
        )}
        {commentedUser?.id == loggedUser.id && (
            <div>
            
      <form onSubmit={editComment}>
        <label>
          Edit comment :{" "}
          <input
            id="editcomment-input"
            type="text"
            value={editedComment}
            onChange={(event) => setEditedComment(event.target.value)}
          />
          <button className="whitebutton" id="addcomment-button" type="submit">
            Edit
          </button>
        </label>
      </form>
      <br />
      <br />
      <button onClick={deleteComment}>Delete comment</button>
            <br />
            <br />
    </div>
           
        )}
       
        </div>
    );
    };