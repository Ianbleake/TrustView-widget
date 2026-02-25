import { widgetRequester } from "../widgetRequester";

export async function getLastReviews(payload:GetLastReviewsPayload): Promise<GetLastReviewsResponse> {

  return widgetRequester({
    method: "POST",
    endpoint: "/widget/lastreviews",
    payload,
  });
}
