import Link from "next/link";
import type { ReactNode } from "react";

import { BrandMark, BrandWordmark } from "@/components/site/BrandMark";

/** Shared split-screen shell for sign in / sign up: image on the left, form on the right. */
export function AuthSplit({
  image,
  imageAlt,
  quote,
  children,
}: {
  image: string;
  imageAlt: string;
  quote: string;
  children: ReactNode;
}) {
  return (
    <div className="dash-canvas min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <div className="relative hidden overflow-hidden rounded-[1.75rem] lg:block">
          <img
            src={image}
            alt={imageAlt}
            width={912}
            height={1408}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <div className="relative flex h-full min-h-[34rem] flex-col justify-end p-8">
            <Link href="/" className="flex items-center gap-2.5 text-ink-foreground">
              <BrandMark className="h-9 w-9" />
              <BrandWordmark className="text-base" />
            </Link>
            <p className="mt-6 max-w-sm font-display text-3xl leading-tight text-ink-foreground">
              {quote}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const authField =
  "mt-1.5 w-full rounded-full border border-input bg-card px-4 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
