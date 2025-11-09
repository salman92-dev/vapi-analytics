// lib/getData.js
export async function getVapiData() {
  const res = await fetch(`http://localhost:3000/api/vapi-calls`, {
    next: { revalidate: 3600 } // cache for 1 hour
  });

  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
}
