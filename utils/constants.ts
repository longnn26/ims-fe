export const dateFormat = "YYYY-MM-DD";
export const timeFormat = "HH:mm";
// export const dateTimeFormat = 'YYYY-MM-DD HH:mm';
export const dateTimeFormat = "MMM DD HH:mm";
export const dateAdvFormat = "YYYY-MM-DD HH:mm:ss";
export const formatPublicView = "MMM Do YYYY";
export const NEW_NOTIFY = "newNotify";
export const NEW_NOTIFY_COUNT = "newNotifyCount";

export const ROLE_ADMIN = "Admin";
export const ROLE_CUSTOMER = "Customer";

export const LIST_PAGE_SIZE = [5, 10, 20, 30, 40, 50];

export const buttonListEditor = [
  ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  ["paragraphStyle", "blockquote"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["fontColor", "hiliteColor", "textStyle"],
  ["removeFormat"],
  "/",
  ["outdent", "indent"],
  ["align", "horizontalRule", "list", "lineHeight"],
  ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
  /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
  ["fullScreen", "showBlocks", "codeView"],
  ["preview", "print"],
  ["save"],
  /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
];

export const optionAccess = [
  {
    value: "Public",
    label: "Public",
  },
  {
    value: "Guest",
    label: "Guest",
  },
  {
    value: "Registered",
    label: "Registered",
  },
  {
    value: "Special",
    label: "Special",
  },
  {
    value: "SuperUser",
    label: "SuperUser",
  },
];

export const optionStatus = [
  {
    value: "Incomplete",
    label: "Incomplete",
  },
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Accepted",
    label: "Accepted",
  },
  {
    value: "Denied",
    label: "Denied",
  },
  {
    value: "Stopped",
    label: "Stopped",
  },
  {
    value: "Ended",
    label: "Ended",
  },
];

export const serverAllocationStatus = [
  {
    value: "Waiting",
    label: "Waiting",
    color: "#a19f9e",
  },
  {
    value: "Working",
    label: "Working",
    color: "#19bcf1",
  },
  {
    value: "Pausing",
    label: "Pausing",
    color: "#dba50f",
  },
  {
    value: "Removed",
    label: "Removed",
    color: "#ed1c24",
  },
];

export const requestUpgradeStatus = [
  {
    value: "Waiting",
    label: "Waiting",
    color: "#19bcf1",
  },
  {
    value: "Accepted",
    label: "Accepted",
    color: "#14a2b8",
  },
  {
    value: "Denied",
    label: "Denied",
    color: "#ed1c24",
  },
  {
    value: "Success",
    label: "Success",
    color: "#28a745",
  },
  {
    value: "Failed",
    label: "Failed",
    color: "#343a3f",
  },
];

export const requestHostStatus = [
  {
    value: "Waiting",
    label: "Waiting",
    color: "#19bcf1",
  },
  {
    value: "Accepted",
    label: "Accepted",
    color: "#14a2b8",
  },
  {
    value: "Denied",
    label: "Denied",
    color: "#ed1c24",
  },
  {
    value: "Success",
    label: "Success",
    color: "#28a745",
  },
  {
    value: "Failed",
    label: "Failed",
    color: "#343a3f",
  },
  {
    value: "Processed",
    label: "Processed",
    color: "#1E90FF",
  },
];

export const customerStatus = [
  {
    value: false,
    label: "Active",
    color: "#19bcf1",
  },
  {
    value: true,
    label: "Removed",
    color: "#ed1c24",
  },
];
