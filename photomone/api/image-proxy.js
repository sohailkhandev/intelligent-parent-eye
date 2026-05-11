/**
 * Vercel serverless function: proxies an image URL to avoid CORS when exporting the poster.
 * GET /api/image-proxy?url=<encoded-image-url>
 * Returns the image bytes with appropriate Content-Type.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = req.query.url;
  if (!url || typeof url !== "string" || !url.startsWith("https://")) {
    return res.status(400).json({ error: "Missing or invalid url (must be HTTPS)" });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "image/*,*/*" },
    });

    if (!response.ok) {
      return res.status(response.status).send(`Upstream ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "private, max-age=60");

    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("[image-proxy]", err);
    return res.status(502).json({ error: "Image proxy fetch failed" });
  }
}
