async function check() {
  const res = await fetch("http://localhost:3000/products/quantum-pro-headphones");
  console.log("ID Route status:", res.status);
  const text = await res.text();
  console.log("ID Route body preview:", text.slice(0, 300));

  const resSlug = await fetch("http://localhost:3000/products/quantum-pro-noise-cancelling-headphones");
  console.log("Slug Route status:", resSlug.status);
}
check();
