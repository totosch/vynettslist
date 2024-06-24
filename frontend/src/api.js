import axios from 'axios';

const API_URL = 'http://localhost:9090';

export const getAllActivities = async () => {
    const response = await axios.get(`${API_URL}/getAllActivities`);
    return response.data;
};

export const getActivityById = async (id) => {
    const response = await axios.get(`${API_URL}/getActivityById/${id}`);
    return response.data;
};

export const addActivity = async (activity) => {
    const response = await axios.post(`${API_URL}/addActivity`, activity);
    return response.data;
};

export const updateActivityById = async (id, activity) => {
    const response = await axios.put(`${API_URL}/updateActivityById/${id}`, activity);
    return response.data;
};

export const deleteActivityById = async (id) => {
    const response = await axios.delete(`${API_URL}/deleteActivityById/${id}`);
    return response.data;
};
