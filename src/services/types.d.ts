type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type WidgetRequesterArgs<TPayload> = {
  method?: HttpMethod;
  endpoint: string;
  payload?: TPayload;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
};