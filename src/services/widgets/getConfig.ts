import { widgetRequester } from "../widgetRequester";

export async function getConfig(payload: GetConfigPayload ): Promise<GetConfigResponse>{

  return widgetRequester({
    method: "POST",
    endpoint: "/widget/config",
    payload,
  })
}