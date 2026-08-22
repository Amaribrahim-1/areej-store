import type { ReactNode } from "react";

type AdminProductFieldProps = {
  label: string;
  children: ReactNode;
};

export default function AdminProductField({
  label,
  children,
}: AdminProductFieldProps) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium text-foreground">{children}</dd>
    </div>
  );
}
