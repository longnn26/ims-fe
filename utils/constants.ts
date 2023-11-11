export const dateFormat = "YYYY-MM-DD";
export const timeFormat = "HH:mm";
// export const dateTimeFormat = 'YYYY-MM-DD HH:mm';
export const dateTimeFormat = "MMM DD HH:mm";
export const dateAdvFormat = "YYYY-MM-DD HH:mm:ss";
export const formatPublicView = "MMM Do YYYY";

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
    value: "UnPublished",
    label: "UnPublished",
  },
  {
    value: "Published",
    label: "Published",
  },
  {
    value: "Archived",
    label: "Archived",
  },
  {
    value: "Trashed",
    label: "Trashed",
  },
];
