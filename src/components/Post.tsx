import {
  Card,
  CardContent,
  styled,
  Typography,
  CardMedia,
  Box,
  AvatarGroup,
  Avatar,
} from '@mui/material';

const cardData = [
  {
    img: 'https://picsum.photos/800/450?random=1',
    tag: 'Engineering',
    title: 'Revolutionizing software development with cutting-edge tools',
    description:
      'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    authors: [
      { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
  {
    img: 'https://picsum.photos/800/450?random=2',
    tag: 'Product',
    title: 'Innovative product features that drive success',
    description:
      'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
    authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=3',
    tag: 'Design',
    title: 'Designing for the future: trends and insights',
    description:
      'Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.',
    authors: [{ name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg' }],
  },
];

const Post = ({ index }) => {
  console.log(index);
  const SyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '&:focus-visible': {
      outline: '3px solid',
      outlineColor: 'hsla(210, 98%, 48%, 0.5)',
      outlineOffset: '2px',
    },
  }));

  const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
      paddingBottom: 16,
    },
  });

  const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  function Author({ authors }: { authors: { name: string; avatar: string }[] }) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
          <AvatarGroup max={3}>
            {authors.map((author, index) => (
              <Avatar
                key={index}
                alt={author.name}
                src={author.avatar}
                sx={{ width: 24, height: 24 }}
              />
            ))}
          </AvatarGroup>
          <Typography variant="caption">
            {authors.map((author) => author.name).join(', ')}
          </Typography>
        </Box>
        <Typography variant="caption">July 14, 2021</Typography>
      </Box>
    );
  }

  return (
    <SyledCard variant="outlined" tabIndex={0}>
      <CardMedia
        component="img"
        alt="green iguana"
        image={cardData[index].img}
        sx={{
          aspectRatio: '16 / 9',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />
      <SyledCardContent>
        <Typography gutterBottom variant="caption" component="div">
          {cardData[index].tag}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {cardData[index].title}
        </Typography>
        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
          {cardData[index].description}
        </StyledTypography>
      </SyledCardContent>
      <Author authors={cardData[index].authors} />
    </SyledCard>
  );
};

export default Post;
