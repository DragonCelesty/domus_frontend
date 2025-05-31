import axiosInstance from "./axiosInterface";

export const getBudgets = () => axiosInstance.get("/budgets");

export const createBudget = async (data: any) => axiosInstance.post("/budgets", data);

export const getBudgetById = (id: string) => axiosInstance.get(`/budgets/${id}`);

export const getBudgetsByFilters = (filters: any) => axiosInstance.get("/budgets", { params: filters });

export const getBudgetsByClient = (clientId: string) => axiosInstance.get(`/budgets/client/${clientId}`);

export const convertBudgetToOrder = (id: string) => axiosInstance.post(`/budgets/convert-to-order/${id}`);