import type { AdminContactMessage } from "../../types";

import AdminContactMessageCard from "./AdminContactMessageCard";

type AdminContactMessagesListProps = {
  messages: AdminContactMessage[];
};

export default function AdminContactMessagesList({
  messages,
}: AdminContactMessagesListProps) {
  return (
    <ul className="flex flex-col gap-4" aria-label="قائمة رسائل التواصل">
      {messages.map((message) => (
        <li key={message.id}>
          <AdminContactMessageCard message={message} />
        </li>
      ))}
    </ul>
  );
}
