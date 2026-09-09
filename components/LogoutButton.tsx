"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // Hard navigation, same reasoning as the login page - guarantees a
    // fresh request that reflects the now-cleared session cookie, rather
    // than a client-side transition that could serve stale cached content.
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-500 hover:text-white text-[10px] font-semibold underline underline-offset-2"
    >
      Log out
    </button>
  );
}
