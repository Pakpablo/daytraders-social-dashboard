import { cookies } from "next/headers";
import { verifySessionToken, getLoginLog, SESSION_COOKIE_NAME } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, ShieldX } from "lucide-react";

// Restrict this page to specific usernames, even though everyone else is
// already logged in past the general gate. Edit this list to whoever should
// be able to see the access log (IP addresses are sensitive - keep this short).
const ADMIN_USERNAMES = ["pablo"];

export default async function AccessLogsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) redirect("/login");
  if (!ADMIN_USERNAMES.includes(session.username)) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-6">
        <p className="text-gray-400 text-sm">You don't have access to this page.</p>
      </div>
    );
  }

  const logs = await getLoginLog(200);

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Access Log</h1>
        <p className="text-gray-400 text-sm mt-1">
          Last {logs.length} login attempts &mdash; name, IP, and time, most recent first.
        </p>
      </div>

      <div className="bg-[#151517] border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10 text-left text-gray-400 text-xs uppercase">
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3">Username</th>
              <th className="py-2.5 px-3">IP Address</th>
              <th className="py-2.5 px-3">When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 px-4">
                  {log.success ? (
                    <ShieldCheck size={14} className="text-green-400" />
                  ) : (
                    <ShieldX size={14} className="text-[#D42B3F]" />
                  )}
                </td>
                <td className="py-2.5 px-3 font-semibold">{log.name}</td>
                <td className="py-2.5 px-3 text-gray-400">{log.username}</td>
                <td className="py-2.5 px-3 font-mono text-xs text-gray-400">{log.ip}</td>
                <td className="py-2.5 px-3 text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
