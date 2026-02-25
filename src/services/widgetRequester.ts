const API_BASE = import.meta.env.VITE_WIDGET_API;

export async function widgetRequester<
  TResponse,
  TPayload = unknown
>({
  method = "GET",
  endpoint,
  payload,
  params,
  headers,
}: WidgetRequesterArgs<TPayload>): Promise<TResponse> {

  const url = new URL(`${API_BASE}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Widget API error: ${endpoint}`);
  }

  return response.json() as Promise<TResponse>;
}