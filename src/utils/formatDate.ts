export function formatDate(dateString: string, locale: string = "es"): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    if (locale === "pt") return "Hoje";
    if (locale === "en") return "Today";
    return "Hoy";
  }

  if (diffDays === 1) {
    if (locale === "pt") return "Ontem";
    if (locale === "en") return "Yesterday";
    return "Ayer";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default formatDate;
