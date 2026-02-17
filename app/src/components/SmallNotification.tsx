import { useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { NewNotification } from "../../../types";
import { RootState } from "../store";

export const SmallNotification = () => {

  const dispatch = useDispatch<AppDispatch>();
  const notification = useSelector<RootState, NewNotification | null>(
    (state) => {
      if (state.notification.type !== null) {
        return state.notification;
      }
      return null;
    },
  );


  const closeNotification = () => {
    dispatch(setNotification({ text: "", type: null }));
  }


  if (!notification) {
    return (
        <p>
            <br/>
            <br/>
        </p>
    )
  }


  if (notification) {
    if (notification.type === "success") {
      return (
        null
      );
    }
    if (notification.type === "error") {
      return (
        <div className="smallerror">
          <div className="smallnotification">
            {notification.text && <p> {notification.text} </p>}
            <button className="smallnotificationbutton" onClick={closeNotification}>X</button>
          </div>
        </div>
      );
    }
  }
};
