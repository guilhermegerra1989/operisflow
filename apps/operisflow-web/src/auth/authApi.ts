

import { apiGet } from "../modules/ev-volantes/api/apiClient";


export async function validateSession(token: string) {
  try {
    return await apiGet("/auth/me", token);
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw error;
  }
}