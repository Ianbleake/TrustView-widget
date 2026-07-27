import { widgetRequester } from "../widgetRequester";

export async function getLastReviews(payload: GetLastReviewsPayload): Promise<GetLastReviewsResponse> {
  return widgetRequester({
    method: "GET",
    endpoint: "/widget/lastreviews",
    params: payload,
  });
}
