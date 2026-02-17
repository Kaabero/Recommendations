import streamingservice from "../services/streamingservice";
import { useEffect } from "react";
import { setServices } from "../reducers/serviceReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";

export const Services = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    streamingservice
      .getAll(user.token)
      .then((services) => dispatch(setServices(services)));
  });

  const services = useSelector((state: RootState) => state.services);

  return (
    <div className="center">
      <h1>Streaming services</h1>
      {services.length === 0 ? (
        <p>No services</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">Recommendations</th>
              <th scope="col">Likes</th>
            </tr>
          </thead>

          {services.map((service, index) => (
            <tbody key={index}>
              <tr>
                <td scope="row">{service.service}</td>
                <td>{service.recommendations}</td>
                <td>{service.likes}</td>
              </tr>
            </tbody>
          ))}
        </table>
      )}
    </div>
  );
};
