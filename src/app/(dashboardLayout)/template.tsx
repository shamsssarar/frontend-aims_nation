export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  // A template acts as an invisible wrapper that forces Next.js 
  // to generate a brand new React key on every route change, 
  // completely bypassing the frozen Router Cache!
  return <>{children}</>;
}