"use client";


import { useOrgId } from "@/hooks/organizations/useOrgId";
import NextLink from "next/link";

export const Link = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {

  const orgId = useOrgId()

  return (
    <NextLink
      href={`/app/${orgId}${href}`}
      className={className}
    >
      {children}
    </NextLink>
  );
};
