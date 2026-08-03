/**
 * Little Stars brand mark — a custom drawn "little star inside a big star"
 * monogram. Deliberately not an emoji/sparkle icon: concave rounded arms,
 * an off-centre small companion star and a hand-set wordmark.
 */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 40 40" role="img" aria-label="Little Stars" className="h-full w-full">
        <defs>
          <linearGradient id="ls-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.72" />
          </linearGradient>
        </defs>
        {/* big star with soft concave arms */}
        <path
          d="M20 2.5c1.7 8.2 4.3 12.6 8.9 15.2 1.9 1.1 4.6 1.9 8.6 2.3-4 .4-6.7 1.2-8.6 2.3-4.6 2.6-7.2 7-8.9 15.2-1.7-8.2-4.3-12.6-8.9-15.2C9.2 21.2 6.5 20.4 2.5 20c4-.4 6.7-1.2 8.6-2.3 4.6-2.6 7.2-7 8.9-15.2Z"
          fill="url(#ls-mark)"
        />
        {/* little companion star */}
        <path
          d="M30.5 6c.6 2.9 1.6 4.4 3.2 5.3.7.4 1.6.7 3.1.8-1.5.1-2.4.4-3.1.8-1.6.9-2.6 2.4-3.2 5.3-.6-2.9-1.6-4.4-3.2-5.3-.7-.4-1.6-.7-3.1-.8 1.5-.1 2.4-.4 3.1-.8 1.6-.9 2.6-2.4 3.2-5.3Z"
          fill="currentColor"
          fillOpacity="0.55"
        />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`leading-none tracking-tight ${className}`}>
      <span className="font-display text-[1.35em] italic">Little</span>
      <span className="ml-1 font-semibold">Stars</span>
    </span>
  );
}
