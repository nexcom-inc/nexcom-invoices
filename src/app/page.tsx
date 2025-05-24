"use client"

import { useAuth } from "@/lib/nexcom/auth/auth-context";

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="flex justify-center items-center h-screen">
          hello, {user?.email}
          <a href="http://localhost:3000/api/auth/logout">Logout</a>
    </div>
  );
}
