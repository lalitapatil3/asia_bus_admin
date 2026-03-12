// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const roleService = {
  getRoles: async () => {
    // const response = await axios.get(`${API_BASE_URL}/roles`);
    // return response.data;
    console.warn("Mocking getRoles API call");
    return [];
  },

  createRole: async (roleData: any) => {
    // const response = await axios.post(`${API_BASE_URL}/roles`, roleData);
    // return response.data;
    console.warn("Mocking createRole API call");
    return roleData;
  },

  updateRole: async (_id: string | number, roleData: any) => {
    // const response = await axios.put(`${API_BASE_URL}/roles/${id}`, roleData);
    // return response.data;
    console.warn("Mocking updateRole API call");
    return roleData;
  },

  assignPermissionsToRole: async (_roleId: string | number, _permissionIds: (string | number)[]) => {
    // const response = await axios.post(`${API_BASE_URL}/roles/${roleId}/permissions`, { permissions: permissionIds });
    // return response.data;
    console.warn("Mocking assignPermissionsToRole API call");
    return true;
  }
};
