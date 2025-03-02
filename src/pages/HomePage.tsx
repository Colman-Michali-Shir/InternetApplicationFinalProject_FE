import Post from '../components/Post';

//TODO DELETE
import { IPost } from '../services/postsService';
import { Grid2 } from '@mui/material';
const cardData: IPost[] = [
  {
    _id: '1',
    image: 'https://picsum.photos/800/450?random=1',
    title: 'Revolutionizing software development with cutting-edge tools',
    content:
      'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    postedBy: { username: 'Remy Sharp', profileImage: '/static/images/avatar/1.jpg' },
    likesCount: 2,
    commentsCount: 1,
    rating: 4,
  },
  {
    _id: '2',
    image: 'https://picsum.photos/800/450?random=2',
    title: 'Innovative product features that drive success',
    content:
      'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
    postedBy: { username: 'Erica Johns', profileImage: '/static/images/avatar/6.jpg' },
    likesCount: 4,
    commentsCount: 0,
    rating: 5,
  },
  {
    _id: '3',
    image: 'https://picsum.photos/800/450?random=3',
    title: 'Designing for the future: trends and insights',
    content:
      'Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.',
    postedBy: { username: 'Kate Morrison', profileImage: '/static/images/avatar/7.jpg' },
    likesCount: 10,
    commentsCount: 5,
    rating: 1,
  },
];

const HomePage = () => {
  return (
    <>
      <Grid2 container spacing={3}>
        {cardData.map((post) => (
          <Grid2 size={{ md: 6 }}>
            <Post key={post._id} post={post} />
          </Grid2>
        ))}
      </Grid2>
    </>
  );
};

export default HomePage;
