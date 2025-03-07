import { apiClient } from './apiClient';

const accessToken = localStorage.getItem('accessToken');

const getRecommendationRestaurant = async (description: string) => {
  const abortController = new AbortController();
  const response = await apiClient.get(`/recommendation`, {
    params: { description },
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });

  return { response, abort: () => abortController.abort() };
};

export default {
  getRecommendationRestaurant,
};
