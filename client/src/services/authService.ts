
import axios from "../lib/axios";


export const authService = {

  async login(
    email: string, 
    password: string
    ) {
    const res = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
  },

  async register(
    name: string,
    email: string,
    password: string
    ) {
    await axios.post("/auth/register", { name, email, password });
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
};

