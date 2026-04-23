import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  users: [],
  isAuthenticated: false,
  isCheckingAuth: true,
  error: null,
  clearError: () => set({ error: null }),
  message: null,
  isLoading: false,

  checkAndRedirect: () => {
    const { isAuthenticated, user } = get();
    if (isAuthenticated && user) {
      const allowedPaths = ["/hero"];
      const currentPath = window.location.pathname;

      if (!allowedPaths.includes(currentPath)) {
        window.history.replaceState(null, null, "/hero");
        return false;
      }
    }
    return true;
  },

  addNewUser: async (names, email, age, gender, city, nationality, course) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/user/detail`, {
        names,
        email,
        age,
        gender,
        city,
        nationality,
        course,
      });
      set({
        user: response.data.user,
        isLoading: false,
        message: "Add successfully",
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error adding user";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw new Error(errorMsg);
    }
  },

  signup: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
      });
      set({
        user: response.data.data, 
        isLoading: false,
        isAuthenticated: true,
        message: "Created successfully",
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error creating user";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw new Error(errorMsg);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      set({
        user: response.data.data, 
        isAuthenticated: true,
        isLoading: false,
        message: "Login successfully",
      });

      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.clear();
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error login user";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw new Error(errorMsg);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`);
      set({
        user: response.data.user, 
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.log("Auth check failed:", error);
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null, 
      });
    }
  },

  getAllUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/user/`);
      set({
        users: response.data,
        isLoading: false,
        message: "Successfully retrieved all users",
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error fetching users";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/user/${id}`);
      set({
        isLoading: false,
        message: "Deleted successfully",
      });
      useAuthStore.getState().getAllUser();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error deleting user";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw new Error(errorMsg);
    }
  },

  editUser: async (id, updateUser) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/user/${id}`, updateUser);
      set({
        isLoading: false,
        message: "Edited successfully",
      });
      useAuthStore.getState().getAllUser();
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error updating user";
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw new Error(errorMsg);
    }
  },

  startSessionMonitoring: () => {
    const { isAuthenticated, user } = get();

    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        get().checkAuth();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  },
}));
