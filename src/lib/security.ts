/**
 * Security helper to prevent Open Redirect vulnerabilities.
 * Ensures the destination is strictly an internal relative path.
 */
export const sanitizeRedirect = (url: string | null | undefined): string => {
  if (!url) return "/profile";

  const trimmed = url.trim();

  // Validate that the URL is a relative path starting with '/'
  // Reject protocol-relative URLs (//), backslash variations (/\\), and protocol schemes (javascript:, http:, etc.)
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.includes(":")
  ) {
    return trimmed;
  }

  return "/profile";
};
