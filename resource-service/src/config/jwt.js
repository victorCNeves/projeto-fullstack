export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/validate`, {
      headers: { authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const body = await response.json();
      return res.status(401).json(body);
    }

    const { id } = await response.json();
    req.userId = id;
    next();
  } catch {
    return res
      .status(503)
      .json({ error: 'Serviço de autenticação indisponível.' });
  }
};
