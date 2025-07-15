import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  }
): Promise<Response> {
  // Get auth headers from localStorage
  const getAuthHeaders = (): Record<string, string> => {
    const credentials = localStorage.getItem('adminCredentials');
    if (credentials) {
      const { username, password } = JSON.parse(credentials);
      return { username: username || '', password: password || '' };
    }
    return {};
  };

  const defaultHeaders: Record<string, string> = {
    ...(options?.body ? { "Content-Type": "application/json" } : {}),
    ...getAuthHeaders(),
    ...(options?.headers || {})
  };

  const res = await fetch(url, {
    method: options?.method || "GET",
    headers: defaultHeaders,
    body: options?.body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get auth headers from localStorage
    const getAuthHeaders = (): Record<string, string> => {
      const credentials = localStorage.getItem('adminCredentials');
      if (credentials) {
        const { username, password } = JSON.parse(credentials);
        return { username: username || '', password: password || '' };
      }
      return {};
    };

    const res = await fetch(queryKey[0] as string, {
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
