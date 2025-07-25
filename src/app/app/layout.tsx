import { RequireOrganization } from "@/components/organizations/require-organization";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireOrganization>{children}</RequireOrganization>
}
