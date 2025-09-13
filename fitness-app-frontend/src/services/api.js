import axios from 'axios';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

// const api = axios.create({
//   baseURL: API_BASE,
// });

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Retrieve the stored user info JSON and extract 'sub' as user ID
  const userStr = sessionStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.sub) {
        config.headers['X-User-ID'] = user.sub; // Note: match backend header casing exactly
      }
    } catch (err) {
      console.warn('Failed to parse user from sessionStorage:', err);
    }
  }

  return config;
});




export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);
// Delete activity by ID (ActivityService)
export const deleteActivity = (activityId) => api.delete(`/activities/${activityId}`);

// Delete recommendation by activity ID (RecommendationService)
export const deleteRecommendationByActivityId = (activityId) =>
  api.delete(`/recommendations/activity?activityId=${activityId}`);
