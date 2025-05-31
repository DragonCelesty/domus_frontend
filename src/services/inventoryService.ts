import axiosInstance from './axiosInterface';

export const getInventories = () => axiosInstance.get('/inventory');

export const getInventoryById = (id: string) => 
  axiosInstance.get(`/inventory/${id}`);

export const createInventory = (data: any) => 
  axiosInstance.post('/inventory', data);

// Corregido a PATCH en lugar de PUT
export const updateInventory = (id: string, data: any) => 
  axiosInstance.patch(`/inventory/${id}`, data);

export const deleteInventory = (id: string) => 
  axiosInstance.delete(`/inventory/${id}`);

export const getInventoryMovements = (inventoryId: string) => 
  axiosInstance.get(`/inventory/${inventoryId}/movements`);

export const createInventoryMovement = (inventoryId: string, data: any) =>
    axiosInstance.post(`/inventory/${inventoryId}/movements`, data);