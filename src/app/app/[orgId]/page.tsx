"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { useAuthStore } from "@/lib/nexcom/auth/stores/auth-store";
import { useAppStore } from "@/store/app.store";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const setLoading  = useAppStore(state => state.setLoading)


  const handleLogout = async () => {
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await logout().catch(e=>setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <span>Hello, {user?.email}</span>
          <Link href="/test">test</Link>
        <div className="mt-4  ">
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
