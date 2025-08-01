import axios from 'axios';

export const fetchJobs = async () =>{
  try {
    const response = await axios.get('/api/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};
