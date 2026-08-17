export function getSocketUrl(): string {
  return process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
}
