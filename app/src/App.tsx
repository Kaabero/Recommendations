import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { Logout } from "./components/Logout";
import { Notification } from "./components/Notification";
import { Recommendation } from "./components/Recommendation";
import { RecommendationList } from "./components/RecommendationList";
import { RegisterationForm } from "./components/RegisterationForm";
import { Favourites } from "./components/Favourites";
import { Services } from "./components/Services";
import { User } from "./components/User";
import { Users } from "./components/Users";
import { Welcome } from "./components/Welcome";
import { setRecommendations } from "./reducers/recommendationReducer";
import { setUser } from "./reducers/userReducer";
import { setUsers } from "./reducers/usersReducer";
import recommendationservice from "./services/recommendationservice";
import userservice from "./services/userservice";
import { RootState } from "./store";
import { setComments } from "./reducers/commentReducer";
import commentservice from "./services/commentservice";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    recommendationservice
      .getAll()
      .then((recommendations) => dispatch(setRecommendations(recommendations)));
  }, [dispatch]);

  useEffect(() => {
    userservice.getAll().then((users) => dispatch(setUsers(users)));
  }, [dispatch]);

  useEffect(() => {
    commentservice.getAll().then((comments) => dispatch(setComments(comments)));
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user);
  const isOpen = useSelector((state: RootState) => state.modal)
  if (loading) {
    return <p>Loading...</p>;
  }
  
  return (
    <>
      <div style={{ position: "fixed", top: "5px", left: "25%", width: "50%", zIndex: 10000 }}>
        <Notification isOpen={isOpen}/>
      </div>
      <div className="fixed-content">
        <Router>
          {user.id !== 0 && (
            <div className="bar">
              <Link style={{ padding: 5 }} to="/">
                Home
              </Link>
              <Link style={{ padding: 5 }} to="/recommendations">
                Recommendations
              </Link>
              <Link style={{ padding: 5 }} to="/services">
                Streaming services
              </Link>
              <Link style={{ padding: 5}} to="/favourites">
                Favourites
              </Link>
              <Link style={{ padding: 5 }} to="/users">
                Users
              </Link>
              <p>{user.username} logged in!</p>
              <Logout />
            </div>
          )}

          <div>
            <Routes>
              <Route
                path="/recommendations/:id"
                element={
                  user.id !== 0 ? (
                    <Recommendation />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="/favourites"
                element={
                  user.id !== 0 ? (
                    <Favourites />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }>
              </Route>
              <Route
                path="/services"
                element={
                  user.id !== 0 ? (
                    <Services />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="/registeration"
                element={
                  user.id === 0 ? (
                    <RegisterationForm />
                  ) : (
                    <Navigate replace to="/" />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  user.id === 0 ? <LoginForm /> : <Navigate replace to="/" />
                }
              />
              <Route
                path="/users"
                element={
                  user.id !== 0 ? <Users /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/recommendations"
                element={
                  user.id !== 0 ? (
                    <RecommendationList />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  user.id !== 0 ? <Welcome /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/users/:id"
                element={
                  user.id !== 0 ? <User /> : <Navigate replace to="/login" />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </div>
    </>
  );
};

export default App;
