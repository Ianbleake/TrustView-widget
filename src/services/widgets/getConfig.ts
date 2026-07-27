import { widgetRequester } from "../widgetRequester";

export async function getConfig(payload: GetConfigPayload): Promise<GetConfigResponse> {
  return widgetRequester({
    method: "GET",
    endpoint: "/widget/config",
    params: payload,
  });
}
