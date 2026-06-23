export default function Pagination({ currentPage, hasNextPage, onNext, onPrev }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        marginTop: 40,
        paddingBottom: 40,
      }}
    >
      <button
        onClick={onPrev}
        disabled={currentPage === 0}
        style={{
          padding: "10px 24px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: currentPage === 0 ? "#f5f5f5" : "#fff",
          cursor: currentPage === 0 ? "not-allowed" : "pointer",
          color: currentPage === 0 ? "#aaa" : "#333",
          fontWeight: 600,
        }}
      >
        ← Previous
      </button>

      <span style={{ color: "#666", fontSize: 14 }}>Page {currentPage + 1}</span>

      <button
        onClick={onNext}
        disabled={!hasNextPage}
        style={{
          padding: "10px 24px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: !hasNextPage ? "#f5f5f5" : "#fff",
          cursor: !hasNextPage ? "not-allowed" : "pointer",
          color: !hasNextPage ? "#aaa" : "#333",
          fontWeight: 600,
        }}
      >
        Next →
      </button>
    </div>
  );
}