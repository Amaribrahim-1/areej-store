"use client";

import { useState, type ComponentProps } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

export default function PasswordInput({
  className,
  disabled,
  ref,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  function toggleVisibility() {
    setIsVisible((current) => !current);
  }

  return (
    <div className="relative" dir="ltr">
      <Input
        {...props}
        ref={ref}
        type={isVisible ? "text" : "password"}
        dir="ltr"
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className={cn("pe-10 text-start", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        onPointerDown={(event) => {
          // Keep caret in the field so the eye does not fire RHF onBlur validation.
          event.preventDefault();
        }}
        onClick={toggleVisibility}
        aria-label={isVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        className="absolute end-0.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {isVisible ? (
          <EyeOffIcon aria-hidden />
        ) : (
          <EyeIcon aria-hidden />
        )}
      </Button>
    </div>
  );
}
