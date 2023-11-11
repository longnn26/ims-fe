import { formatPublicView } from "@utils/constants";
import moment from "moment";

export default function Date({ dateString }) {
  return (
    <time dateTime={dateString}>
      {moment(dateString).format(formatPublicView)}
    </time>
  );
}
