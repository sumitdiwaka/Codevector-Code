import { useState, useEffect, useCallback } from "react";
import Filters from "./components/Filters";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/Pagination";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [cursorStack, setCursorStack] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Core fetch function
  const fetchProducts = useCallback(async (cursor, category) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (cursor) params.set("cursor", cursor);
      if (category) params.set("category", category);

      const res = await fetch(`${API_BASE}/products?${params}`);
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setProducts(data.products);
      setHasNextPage(data.hasNextPage);

      return data.nextCursor;
    } catch (err) {
      setError("Could not load products. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/products/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // When user changes category filter — reset pagination to page 0
  useEffect(() => {
    setCursorStack([null]);
    setCurrentPage(0);
  }, [selectedCategory]);

  // Fetch products whenever page or category changes
  useEffect(() => {
    const cursor = cursorStack[currentPage];
    fetchProducts(cursor, selectedCategory).then((nextCursor) => {
      // Store the next cursor only if we don't already have it
      if (nextCursor && !cursorStack[currentPage + 1]) {
        setCursorStack((prev) => {
          const updated = [...prev];
          updated[currentPage + 1] = nextCursor;
          return updated;
        });
      }
    });
  }, [currentPage, selectedCategory]);

  function goNext() {
    setCurrentPage((p) => p + 1);
  }

  function goPrev() {
    setCurrentPage((p) => p - 1);
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Product Browser</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        200,000 products — filtered by category, stable pagination
      </p>

      <Filters
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      {error && (
        <p style={{ color: "red", margin: "16px 0" }}>{error}</p>
      )}

      {loading ? (
        <p style={{ marginTop: 40, textAlign: "center", color: "#888" }}>
          Loading...
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        onNext={goNext}
        onPrev={goPrev}
      />
    </div>
  );
}