
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const permissionService = {
  getPermissions: async () => {
    // const response = await axios.get(`${API_BASE_URL}/permissions`);
    // return response.data;
    console.warn("Mocking getPermissions API call");
    return [];
  },
};
