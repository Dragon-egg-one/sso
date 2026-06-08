export function loadConfig(env = {}) {
  const issuer = requiredUrl(env.ISSUER, "ISSUER").replace(/\/+$/, "");
  const clientId = required(env.OIDC_CLIENT_ID, "OIDC_CLIENT_ID");
  const clientSecret = required(env.OIDC_CLIENT_SECRET, "OIDC_CLIENT_SECRET");
  const redirectUris = required(env.ALLOWED_REDIRECT_URIS, "ALLOWED_REDIRECT_URIS")
    .split(",")
    .map((uri) => uri.trim())
    .filter(Boolean);
  if (redirectUris.length === 0) {
    throw new Error("ALLOWED_REDIRECT_URIS 至少需要一個 redirect_uri");
  }

  const privateJwk = JSON.parse(required(env.PRIVATE_JWK, "PRIVATE_JWK"));
  if (!privateJwk.kid) {
    throw new Error("PRIVATE_JWK 必須包含 kid");
  }

  return {
    issuer,
    clientId,
    clientSecret,
    redirectUris,
    privateJwk,
    adminToken: required(env.ADMIN_TOKEN, "ADMIN_TOKEN"),
    authorizationCodeTtlSeconds: Number(env.AUTHORIZATION_CODE_TTL_SECONDS ?? 300),
    tokenTtlSeconds: Number(env.TOKEN_TTL_SECONDS ?? 3600)
  };
}

function required(value, name) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw new Error(`缺少必要設定：${name}`);
  }
  return normalized;
}

function requiredUrl(value, name) {
  const normalized = required(value, name);
  try {
    return new URL(normalized).toString();
  } catch {
    throw new Error(`${name} 必須是有效 URL`);
  }
}
