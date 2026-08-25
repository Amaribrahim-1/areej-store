import Link from "next/link";

type AuthSwitchLinkProps = {
  prompt: string;
  href: string;
  actionLabel: string;
};

export default function AuthSwitchLink({
  prompt,
  href,
  actionLabel,
}: AuthSwitchLinkProps) {
  return (
    <p className="text-center text-sm text-foreground/55">
      {prompt}{" "}
      <Link
        href={href}
        className="font-semibold text-brand-500 underline decoration-brand-400 decoration-2 underline-offset-4 hover:text-brand-600"
      >
        {actionLabel}
      </Link>
    </p>
  );
}
