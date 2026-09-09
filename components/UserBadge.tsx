import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function UserBadge() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-6 h-6 rounded-full bg-[#D42B3F]/20 flex items-center justify-center text-[#D42B3F] font-bold text-[10px]">
        {user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
      </div>
      <span className="text-gray-300 font-semibold">{user.name}</span>
      <LogoutButton />
    </div>
  );
}
