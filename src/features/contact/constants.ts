export const CONTACT_NAME_MAX_LENGTH = 80;
export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 1000;

/** Admin inbox — Alaa checks it periodically; 1 min avoids refetch-on-focus spam. */
export const ADMIN_CONTACT_MESSAGES_STALE_TIME_MS = 60 * 1000;
