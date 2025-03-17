import PostsList from '../components/Post/PostsList';

const HomePage = ({
  shouldReFetch,
  setShouldReFetch,
}: {
  shouldReFetch: boolean;
  setShouldReFetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <PostsList
        shouldGetAll={true}
        shouldReFetch={shouldReFetch}
        setShouldReFetch={setShouldReFetch}
      />
    </>
  );
};

export default HomePage;
