type AdminOrderPhoneLinkProps = {
  phone: string;
};

export default function AdminOrderPhoneLink({ phone }: AdminOrderPhoneLinkProps) {
  return (
    <a
      href={`tel:${phone}`}
      className="rounded-sm outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
      dir="ltr"
    >
      {phone}
    </a>
  );
}
