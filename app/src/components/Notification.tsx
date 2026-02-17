import { useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { NewNotification } from "../../../types";
import { RootState } from "../store";

interface NotificationProps {
  isOpen: boolean;
}

export const Notification: React.FC<NotificationProps> =  ({isOpen}) => {
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


  if (isOpen) {
    return null
  }

  if (notification) {
    if (notification.type === "success") {
      return (
        <div className="success">
          <div className="notification">
            
            {notification.text && <p> {notification.text} </p>}
            <button className="notificationbutton" onClick={closeNotification}>X</button>
          </div>
        </div>
      );
    }
    if (notification.type === "error") {
      return (
        <div className="error">
          <div className="notification">
            
            {notification.text && <p> {notification.text} </p>}
             <button className="notificationbutton" onClick={closeNotification}>X</button>
          </div>
        </div>
      );
    }
  }
};
