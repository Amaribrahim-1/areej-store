export type CreateContactMessageInput = {
  name: string;
  phone: string;
  message: string;
};

export type CreateContactMessageResult = {
  id: string;
};

export type ContactFormPrefill = {
  name: string;
  phone: string;
};

/** Admin inbox row. Free-text is sanitized in `getAdminContactMessages`. */
export type AdminContactMessage = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};
