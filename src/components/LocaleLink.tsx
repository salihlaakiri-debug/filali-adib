"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  const localizedHref = `/${locale}${href === "/" ? "" : href}`;
  return <Link href={localizedHref} {...props} />;
}
