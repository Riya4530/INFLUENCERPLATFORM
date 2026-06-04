export default function CampaignsPage() {
  return (
    <div>
      <h1>My Campaigns</h1>

      <div style={{ marginTop: "20px" }}>
        <div style={{ border: "1px solid #ddd", padding: "15px" }}>
          <h3>Summer Fashion Promo</h3>
          <p>Status: Active</p>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px", marginTop: "10px" }}>
          <h3>Tech Product Launch</h3>
          <p>Status: Draft</p>
        </div>
      </div>
    </div>
  );
}