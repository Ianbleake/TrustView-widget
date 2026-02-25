import { widgetRequester } from "../widgetRequester";

export async function getLastReviews(payload:GetLastReviewsPayload): Promise<GetLastReviewsResponse> {

  console.log("fetching last Reviews");

  return widgetRequester({
    method: "POST",
    endpoint: "/widget/lastreviews",
    payload,
  });
}
