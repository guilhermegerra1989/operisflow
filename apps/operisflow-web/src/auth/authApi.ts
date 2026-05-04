import { apiGet } from "../modules/ev-volantes/api/apiClient";

export async function validateSession() {
  // ✅ Só valida, não decide logout
  return apiGet("/auth/me");
}
