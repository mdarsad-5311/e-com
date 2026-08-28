const sanitizeRedirect = (url) => {
  if (!url) return "/profile";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.includes(":")
  ) {
    return trimmed;
  }
  return "/profile";
};

async function runTests() {
  console.log("==========================================");
  console.log("🧪 STARTING ACCEPTANCE TEST SUITE ON PORT 3005");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Security & Open Redirect Unit Verification
  console.log("\n--- 1. SECURITY & OPEN REDIRECT TESTS ---");
  assert(sanitizeRedirect("/profile") === "/profile", "Valid internal relative path /profile allowed");
  assert(sanitizeRedirect("/checkout") === "/checkout", "Valid internal relative path /checkout allowed");
  assert(sanitizeRedirect("/products/quantum-pro-headphones") === "/products/quantum-pro-headphones", "Valid product route allowed");
  assert(sanitizeRedirect("https://example.com") === "/profile", "External URL https://example.com blocked");
  assert(sanitizeRedirect("http://attacker.com/login") === "/profile", "External URL http://attacker.com/login blocked");
  assert(sanitizeRedirect("//example.com") === "/profile", "Protocol-relative URL //example.com blocked");
  assert(sanitizeRedirect("javascript:alert(1)") === "/profile", "javascript: scheme blocked");
  assert(sanitizeRedirect("/\\example.com") === "/profile", "Backslash variation /\\example.com blocked");
  assert(sanitizeRedirect(null) === "/profile", "Null redirect fallback to /profile");
  assert(sanitizeRedirect("") === "/profile", "Empty redirect fallback to /profile");

  // 2. HTTP Server & Route Smoke Testing on Production Build (Port 3005)
  console.log("\n--- 2. PRODUCTION SERVER ROUTE TESTING (http://localhost:3005) ---");

  const routes = [
    { path: "/", title: "Homepage", keywords: ["AL-UMAIMA", "Electronics"] },
    { path: "/login", title: "Login Page", keywords: ["AL-UMAIMA"] },
    { path: "/register", title: "Registration Page", keywords: ["AL-UMAIMA"] },
    { path: "/products", title: "Products Catalog", keywords: ["Products"] },
    { path: "/products/quantum-pro-headphones", title: "Product Detail (ID Route)", keywords: ["Quantum Pro", "Add to Cart", "Buy Now"] },
    { path: "/products/quantum-pro-noise-cancelling-headphones", title: "Product Detail (Slug Route)", keywords: ["Quantum Pro", "Add to Cart", "Buy Now"] },
    { path: "/cart", title: "Shopping Cart", keywords: ["Your Cart"] },
    { path: "/checkout", title: "Checkout Journey", keywords: ["AL-UMAIMA"] },
    { path: "/admin", title: "Admin Panel", keywords: ["AL-UMAIMA"] },
    { path: "/faq", title: "FAQ & Support", keywords: ["AL-UMAIMA", "Track Order"] },
    { path: "/wishlist", title: "Wishlist", keywords: ["Wishlist"] },
  ];

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3005${route.path}`);
      const text = await res.text();
      assert(res.status === 200, `${route.title} (${route.path}) returned HTTP status 200`);
      
      const containsKeywords = route.keywords.every(kw => text.toLowerCase().includes(kw.toLowerCase()));
      assert(containsKeywords, `${route.title} contains expected markup tokens (${route.keywords.join(", ")})`);
    } catch (err) {
      assert(false, `${route.title} (${route.path}) reachable: ${err.message}`);
    }
  }

  console.log("\n==========================================");
  console.log(`📊 SUMMARY: Passed: ${passed} | Failed: ${failed}`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
