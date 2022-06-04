import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export function getFriendlyDuration(fromDate: string): string {
  return dayjs().to(dayjs(fromDate));
}
