type GetProductReviewsPayload = {
  store_external_id: string;
  product_external_id: string;
  page?: number;
  limit?: number;
}

type GetProductReviewsResponse = {
  success: boolean,
  data: Review[],
  meta: undefined,
}

type GetProductRatingPayload = {
  store_external_id: string;
  product_external_id: string;
}

type GetProductRatingResponse = {
  success: boolean,
  data: {
    rating: number
  },
  meta: undefined,
}

type GetLastReviewsPayload = {
  store_external_id: string;
  page?: number;
  limit?: number;
}

type GetLastReviewsResponse = {
  success: boolean,
  data: Review[],
  meta: undefined,
}

type GetConfigPayload = {
  store_external_id: string;
}

type GetConfigResponse = {
  success: boolean,
  data: {
    widget_config: object | null;
    widget_styles: WidgetStyles | null;
  },
  meta: undefined
}

type NewReviewPayload = {
  store_external_id: string;
  product_external_id: string;
  product_name?: string | null;
  product_url: string;
  product_img: string;
  author_name: string;
  rating: number;
  content?: string;
};

type NewReviewResponse = {
  success: boolean;
  data: Review;
  meta: null;
};
