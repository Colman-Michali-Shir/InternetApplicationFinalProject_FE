import PostsList from '../components/Post/PostsList';

const HomePage = () => {
  return (
    <>
      <PostsList shouldGetAll={true} />
    </>
  );
};

export default HomePage;
