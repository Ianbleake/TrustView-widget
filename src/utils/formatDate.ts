import moment from "moment";
import "moment/dist/locale/es";

moment.updateLocale("es", {});
moment.locale("es");

export default function formatDate(date: string, format?: boolean): string {

  if(format) {
    return moment(date).format("D [de] MMMM [de] YYYY");
  }

  return moment(date).calendar(null, {
    sameDay: "[Hoy]",
    lastDay: "[Ayer]",
    sameElse: "D [de] MMMM [de] YYYY",
  });
  
}