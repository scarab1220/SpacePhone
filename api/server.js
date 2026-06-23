import server from "../dist/server/server.js";

export default async function handler(req, res) {
  try {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method || "GET")
        ? undefined
        : req.body
          ? JSON.stringify(req.body)
          : undefined,
    });

    const response = await server.fetch(request);
    const body = await response.text();

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.send(body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
