import { apiGet } from "../modules/ev-volantes/api/apiClient";

export async function validateSession() {
  try {
    return await apiGet("/auth/me");
  } catch (error: any) {
    if (error.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw error;
  }
}