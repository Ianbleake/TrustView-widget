type GetProductReviewsPayload = {
  storeId: string;
  productId: string;
}

type GetProductReviewsResponse = {
  success: boolean,
  data: Review[],
  meta: undefined,
}

type GetProductRatingPayload = {
  storeId: string,
  productId: string,
}

type GetProductRatingResponse = {
  success: boolean,
  data: {
    rating: number
  },
  meta: undefined,
}

type GetLastReviewsPayload = {
  storeId: string;
}

type GetLastReviewsResponse = {
  success: boolean,
  data: Review[],
  meta: undefined,
}

type GetConfigPayload = {
  store_id: string; 
}

type GetConfigResponse = {
  success: boolean,
  data: {
    widgetConfig: WidgetStyles;
  },
  meta: undefined
}