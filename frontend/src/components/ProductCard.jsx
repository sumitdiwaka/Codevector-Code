export default function ProductCard({ product }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>
        {product.name}
      </h3>
      <span
        style={{
          fontSize: 12,
          background: "#eef2ff",
          color: "#4338ca",
          padding: "2px 8px",
          borderRadius: 12,
          alignSelf: "flex-start",
        }}
      >
        {product.category}
      </span>
      <p style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>
        ${product.price.toFixed(2)}
      </p>
      <p style={{ fontSize: 11, color: "#aaa", marginTop: "auto" }}>
        Added {new Date(product.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}