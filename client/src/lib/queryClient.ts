import {
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
} from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  if (data && ["POST", "PUT", "PATCH"].includes(method)) {
    config.body = JSON.stringify(data);
  }
  const res = await fetch(url, config);
  await throwIfResNotOk(res);
  return res;
}

export async function apiJsonRequest<T>(
  method: string,
  url: string,
  data?: unknown,
): Promise<T> {
  const res = await apiRequest(method, url, data);
  return res.json() as Promise<T>;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T | null> => {
  const { on401: unauthorizedBehavior } = options;
  const fn: QueryFunction<T | null> = async (
    context: QueryFunctionContext<readonly unknown[]>
  ) => {
    const [url] = context.queryKey;
    if (typeof url !== "string") {
      throw new Error("Expected the first element of queryKey to be a string URL.");
    }
    const res = await fetch(url, {
      credentials: "include",
      signal: context.signal,
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }
    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
  return fn;
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
