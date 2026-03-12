// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const userService = {
  getUsers: async () => {
    // const response = await axios.get(`${API_BASE_URL}/users`);
    // return response.data;
    console.warn("Mocking getUsers API call");
    return [];
  },

  createUser: async (userData: any) => {
    // const response = await axios.post(`${API_BASE_URL}/users`, userData);
    // return response.data;
    console.warn("Mocking createUser API call");
    return userData;
  },

  updateUser: async (_id: string | number, userData: any) => {
    // const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
    // return response.data;
    console.warn("Mocking updateUser API call");
    return userData;
  },
};
