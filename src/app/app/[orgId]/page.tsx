"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/nexcom/auth/stores/auth-store";

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <span>Hello, {user?.email}</span>

        <div className="mt-4  ">
          <Button variant="destructive" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
