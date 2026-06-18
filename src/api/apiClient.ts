const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
  } catch {
    throw new Error(
      "Could not reach the API server. Make sure the backend is running and VITE_API_BASE_URL is correct."
    );
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
