import executeQuery from "./db";

export async function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const [email, password, ptp] = authHeader.split("|||");

  const results = await executeQuery({
    query: "SELECT id FROM users WHERE email = ? AND password = ? AND ptp = ?",
    values: [email, password, ptp],
  });

  if (results.length === 1) {
    return { userId: results[0].id };
  }

  return null;
}

export function withAuth(handler) {
  return async (req, res) => {
    const user = await authenticate(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    return handler(req, res);
  };
}
