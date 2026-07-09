const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  useAuth: boolean = true
) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  if (useAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw {
      status: res.status,
      message: text,
    };
  }

  return res;
}

/* ===========================
   JSON (padrão do sistema)
   =========================== */

export async function apiGet(path: string) {
  const res = await fetchWithAuth(path);
  return res.json();
}

export async function apiPostPublic(path: string, body: any) {
  const res = await fetchWithAuth(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }, false); 

  return res.json();
}

export async function apiPost(path: string, body: any) {
  const res = await fetchWithAuth(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPatch(path: string, body: any) {
  const res = await fetchWithAuth(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(path: string) {
  const res = await fetchWithAuth(path, {
    method: "DELETE",
  });
  return res.text();
}

/* ===========================
   BLOB (arquivos)
   =========================== */

export async function apiPostBlob(path: string, body: any) {
  const res = await fetchWithAuth(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.blob();
}