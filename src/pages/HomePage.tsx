import PostsList from '../components/Post/PostsList';

const HomePage = () => {
  return (
    <>
      <PostsList getAll={true} />
    </>
  );
};

export default HomePage;
