import Link from "next/link";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <aside style={{
        width: "240px",
        padding: "20px",
        borderRight: "1px solid #ddd"
      }}>
        <h2>Brand Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
          <Link href="/brand">Dashboard</Link>
          <Link href="/brand/campaigns">My Campaigns</Link>
          <Link href="/brand/create-campaign">Create Campaign</Link>
          <Link href="/brand/influencers">Find Influencers</Link>
          <Link href="/brand/requests">Requests</Link>
            <Link href="/brand/quotations">
    Quotations
  </Link>

          <Link href="/brand/analytics">Analytics</Link>
          <Link href="/brand/recommendations">
  Recommendations
</Link>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "20px" }}>
        {children}
      </main>
    </div>
  );
}