// Client-side mirror of the backend upload rules, checked before anything is sent so a
// 300MB upload doesn't run for minutes only to be rejected at the end.

const MB = 1024 * 1024;

export const VIDEO_MAX_BYTES = 300 * MB;
export const COVER_MAX_BYTES = 5 * MB;

const VIDEO_EXTENSIONS = ["mp4", "mov", "webm"];
const VIDEO_MIME_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const COVER_EXTENSIONS = ["jpeg", "jpg", "png", "webp"];
const COVER_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Value for the file input's `accept` attribute. */
export const VIDEO_ACCEPT = [...VIDEO_EXTENSIONS.map((ext) => `.${ext}`), ...VIDEO_MIME_TYPES].join(",");
export const COVER_ACCEPT = [...COVER_EXTENSIONS.map((ext) => `.${ext}`), ...COVER_MIME_TYPES].join(",");

const extensionOf = (file: File) => file.name.split(".").pop()?.toLowerCase() ?? "";

// Some browsers report an empty MIME type (common for .mov on Windows), so the
// extension is the fallback rather than a second requirement.
const matchesType = (file: File, mimeTypes: string[], extensions: string[]) =>
  file.type ? mimeTypes.includes(file.type.toLowerCase()) : extensions.includes(extensionOf(file));

export const isAllowedVideoType = (file: File) =>
  matchesType(file, VIDEO_MIME_TYPES, VIDEO_EXTENSIONS);
export const isAllowedVideoSize = (file: File) => file.size <= VIDEO_MAX_BYTES;

export const isAllowedCoverType = (file: File) =>
  matchesType(file, COVER_MIME_TYPES, COVER_EXTENSIONS);
export const isAllowedCoverSize = (file: File) => file.size <= COVER_MAX_BYTES;
