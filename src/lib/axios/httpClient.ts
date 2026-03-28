// src/lib/httpClient.ts
// import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

type ApiRequestOptions = RequestInit & {
  params?: Record<string, string>;
};

// The core fetch wrapper
async function fetchApi<TData>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TData> {
  const { params, headers, ...restOptions } = options;

  // 1. Construct the URL with query parameters if they exist
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // 2. Prepare Headers
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 3. Handle Cookies for better-auth (Crucial Step!)
  // In Next.js Server Components/Actions, we must manually pass the cookies forward.
  // let cookieHeader = '';
  // try {
  //   const cookieStore = await cookies();
  //   cookieHeader = cookieStore
  //     .getAll()
  //     .map((cookie) => `${cookie.name}=${cookie.value}`)
  //     .join('; ');
  // } catch (error) {
  //   // This catch block safely ignores the error if this client is accidentally
  //   // called from a pure Client Component where `cookies()` isn't available.
  // }

  // if (cookieHeader) {
  //   defaultHeaders['Cookie'] = cookieHeader;
  // }

  // 4. Execute the Fetch
  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: "include",
    ...restOptions,
  });

  // 5. Handle the Response
  // Note: Your backend returns everything inside a `data` object, so we extract it here.
  const jsonResponse = await response.json();

  if (!response.ok) {
    // If the backend throws an AppError, we catch it here.
    console.error(
      `API Error [${response.status}] on ${endpoint}:`,
      jsonResponse.message,
    );

    // You can handle 401 Unauthorized globally here (e.g., redirecting to login)
    // if you want, but often the middleware handles that better.

    throw new Error(
      jsonResponse.message || "An error occurred during the request",
    );
  }

  // Return exactly what the components need (the actual data payload)
  return jsonResponse.data as TData;
}

// Export the clean methods
export const httpClient = {
  get: <TData>(endpoint: string, options?: ApiRequestOptions) =>
    fetchApi<TData>(endpoint, { ...options, method: "GET" }),

  post: <TData>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) =>
    fetchApi<TData>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <TData>(endpoint: string, body?: unknown, options?: ApiRequestOptions) =>
    fetchApi<TData>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <TData>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ) =>
    fetchApi<TData>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <TData>(endpoint: string, options?: ApiRequestOptions) =>
    fetchApi<TData>(endpoint, { ...options, method: "DELETE" }),
};
