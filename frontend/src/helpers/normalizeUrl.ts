export const normalizeUrl = (url: string) => {
  try {
    // Remove duplicate slashes in the path
    const normalizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
    const parsedUrl = new URL(normalizedUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
    return parsedUrl.toString();
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
};
