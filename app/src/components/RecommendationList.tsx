import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { AddRecommendationForm } from "./AddRecommendationForm";
import { setIsOpen } from "../reducers/modalReducer";
import { setNotification } from "../reducers/notificationReducer";


export const RecommendationList = () => {
  const recommendations = useSelector(
    (state: RootState) => state.recommendations,
  );
  const isOpen = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch<AppDispatch>();

  const handleAddRecommendationClick = () => {
    dispatch(setIsOpen(true))
    dispatch(setNotification({ text: "", type: null }))


  }

  const sortedRecommendations = [...recommendations].sort(
    (a, b) => b.likes - a.likes,
  );

  return (
    <div className="center">
      <h1>Recommendations</h1>
      {sortedRecommendations.length === 0 ? (
        <p>No recommendations</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Recommendation</th>
              <th scope="col">Likes</th>
            </tr>
          </thead>
          {sortedRecommendations.map((recommendation) => (
            <tbody key={recommendation.id}>
              <tr>
                <td>
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
      <button onClick={handleAddRecommendationClick}>Add a new recommendation</button>
       <Modal isOpen={isOpen} onClose={() => dispatch(setIsOpen(false))}>
        <AddRecommendationForm/>
        <br />
        <button onClick={() => dispatch(setIsOpen(false))}>Cancel</button>
      </Modal>
    </div>
  );
};
