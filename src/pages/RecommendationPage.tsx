import { useState } from 'react';
import { toast } from 'react-toastify';
import recommendationService from '../services/recommendationService';
import { HttpStatusCode } from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Link,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';

const RecommendationPage = () => {
  const [restaurant, setRestaurant] = useState<{
    name: string;
    description: string;
    url: string;
  } | null>(null);

  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecommendation = async () => {
    if (!description) {
      toast.error('Please enter a description.');
      return;
    }

    setLoading(true);
    try {
      const { response } = await recommendationService.getRecommendationRestaurant(description);
      if (response.status === HttpStatusCode.Ok) {
        const {
          data: { name, description, url },
        } = response;
        setLoading(false);
        setRestaurant({ name, description, url });
      } else {
        toast.error('Failed to load restaurant.');
      }
    } catch {
      toast.error('Error fetching restaurant.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 3,
      }}
    >
      <TextField
        label="Enter Restaurant Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Button
        sx={{ marginBottom: 3 }}
        variant="contained"
        color="primary"
        onClick={fetchRecommendation}
        disabled={!description}
      >
        Get Restaurant Recommendation
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        restaurant && (
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                {restaurant.description}
              </Typography>
              <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  component={Link}
                  href={restaurant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Button>
              </Box>
            </CardContent>
          </Card>
        )
      )}
    </Box>
  );
};

export default RecommendationPage;
