// The placeholder __WIDGET_API_BASE_URL__ is replaced at container startup
// by docker-entrypoint.sh using the WIDGET_API_URL env var.
// In dev, VITE_WIDGET_API from .env is used instead.
const API_BASE = import.meta.env.VITE_WIDGET_API || "__WIDGET_API_BASE_URL__";

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