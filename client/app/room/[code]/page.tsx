import RoomView from "@/src/presentation/views/RoomView";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <RoomView code={code.toUpperCase()} />;
}
