"use client";

import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_STARS = 5;

type StarRatingSize = "sm" | "md" | "lg";

type StarRatingProps = {
  value: number;
  size?: StarRatingSize;
  className?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
  disabled?: boolean;
  id?: string;
};

const sizeClasses: Record<StarRatingSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

function clampRating(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(MAX_STARS, Math.max(0, value));
}

function ratingLabel(value: number): string {
  const rounded = Math.round(clampRating(value) * 10) / 10;
  return `${rounded} من ${MAX_STARS} نجوم`;
}

function InteractiveStar({
  starValue,
  selected,
  filled,
  iconSize,
  disabled,
  onSelect,
}: {
  starValue: number;
  selected: boolean;
  filled: boolean;
  iconSize: string;
  disabled: boolean;
  onSelect: (value: number) => void;
}) {
  function handleClick() {
    onSelect(starValue);
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${starValue} من ${MAX_STARS} نجوم`}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "rounded-md p-0.5 transition-colors outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        filled ? "text-brand" : "text-brand-200 hover:text-brand-400",
      )}
    >
      <StarIcon
        className={cn(iconSize, filled && "fill-current")}
        aria-hidden
      />
    </button>
  );
}

function DisplayStar({
  fillRatio,
  iconSize,
}: {
  fillRatio: number;
  iconSize: string;
}) {
  const isFull = fillRatio >= 1;
  const isEmpty = fillRatio <= 0;

  return (
    <span className="relative inline-flex" aria-hidden>
      <StarIcon className={cn(iconSize, "text-brand-200")} />
      {!isEmpty ? (
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: isFull ? "100%" : `${fillRatio * 100}%` }}
        >
          <StarIcon className={cn(iconSize, "fill-brand text-brand")} />
        </span>
      ) : null}
    </span>
  );
}

export default function StarRating({
  value,
  size = "md",
  className,
  interactive = false,
  onChange,
  disabled = false,
  id,
}: StarRatingProps) {
  const rating = clampRating(value);
  const iconSize = sizeClasses[size];

  if (interactive && onChange) {
    const selected = Math.round(rating);

    return (
      <div
        id={id}
        role="radiogroup"
        aria-label="تقييم بالنجوم"
        className={cn("inline-flex items-center gap-0.5", className)}
        dir="ltr"
      >
        {Array.from({ length: MAX_STARS }, (_, index) => {
          const starValue = index + 1;
          return (
            <InteractiveStar
              key={starValue}
              starValue={starValue}
              selected={starValue === selected}
              filled={starValue <= selected}
              iconSize={iconSize}
              disabled={disabled}
              onSelect={onChange}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      id={id}
      role="img"
      aria-label={ratingLabel(rating)}
      className={cn("inline-flex items-center gap-0.5", className)}
      dir="ltr"
    >
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <DisplayStar
          key={index + 1}
          fillRatio={Math.min(1, Math.max(0, rating - index))}
          iconSize={iconSize}
        />
      ))}
    </div>
  );
}
