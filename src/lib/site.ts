/**
 * Shared site-wide constants for metadata, robots, and the sitemap.
 * `NEXT_PUBLIC_SITE_URL` should be set to the production domain once deployed
 * (15.9); falls back to localhost so dev/preview builds still work.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = "أريج";

export const SITE_TAGLINE = "أريج | عطور، مسك، مخمرية وزيوت شعر";

export const SITE_DESCRIPTION =
  "متجر أريج للعطور، المسك، المخمرية، وزيوت الشعر — تسوّقي بجودة تليق بكِ مع الدفع عند الاستلام.";
