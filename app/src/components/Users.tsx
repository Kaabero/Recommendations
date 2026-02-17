import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store";

export const Users = () => {
  const users = useSelector((state: RootState) => state.users);
  const recommendations = useSelector(
    (state: RootState) => state.recommendations,
  );

  const sortedUsers = [...users].sort(
    (a, b) =>
      (b.recommendations?.length ?? 0) - (a.recommendations?.length ?? 0),
  );

  if (!users) return null;

  return (
    <div className="center">
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Recommendations created</th>
          </tr>
        </thead>

        {sortedUsers.map((user) => (
          <tbody key={user.id}>
            <tr>
              <td scope="row">
                <Link style={{ padding: 5 }} to={`/users/${user.id}`}>
                  {user.username}
                </Link>
              </td>
              <td>{user.recommendations?.length ?? 0}</td>
            </tr>
          </tbody>
        ))}

        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{recommendations.length ? recommendations.length : 0}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
