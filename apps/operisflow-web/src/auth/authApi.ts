import { apiGet } from "../modules/ev-volantes/api/apiClient";

export async function validateSession() {
  return apiGet("/auth/me");
}
