import { IUser } from '../services/userService';

const HomePage = ({ user }: { user: IUser }) => {
  return <div>Welcome, {user?.username}</div>;
};

export default HomePage;
