type WidgetStyles = {
  sectionTitle: string;
  sectionTitleStyle: TextStyle;

  border: "sm" | "md" | "lg" | "none";
  background: string;

  avatarGradient: boolean;
  avatarBackground: string;
  avatarContrastColor: string;
  avatarTextColor: string;

  titleColor: string;
  titleStyle: TextStyle;

  dateColor: string;

  contentColor: string;
  contentStyle: TextStyle;

  productColor: string;

  starBodyColor: string;
  starFillColor: string;
  emptyStarColor: string;

  showCount: boolean;
  starsSize: "sm" | "md" | "lg";
};

type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  productId: string;
  product: string;
  date: string;
  status: ReviewState;
  productUrl: string;
}

type TextStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};