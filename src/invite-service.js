import { normalizeEmail, normalizeInviteCode } from "./store.js";

const ACCOUNT_DOMAIN = "itc.989567.xyz";

export class InviteService {
  constructor(store) {
    this.store = store;
  }

  async login({ account }) {
    const normalizedEmail = normalizeAccountEmail(account);
    const existingUser = await this.store.getUserByEmail(normalizedEmail);
    if (!existingUser) {
      throw new Error("帳號不存在，請先註冊");
    }

    const user = await this.store.updateUserLogin(normalizedEmail);
    return { ...user, created: false };
  }

  async registerWithInvite({ account, displayName, inviteCode }) {
    const normalizedEmail = normalizeAccountEmail(account);
    const existingUser = await this.store.getUserByEmail(normalizedEmail);
    if (existingUser) {
      const user = await this.store.updateUserLogin(normalizedEmail);
      return { ...user, created: false };
    }
    normalizeInviteCode(inviteCode);
    const result = await this.store.createUserWithInvite({
      email: normalizedEmail,
      displayName,
      inviteCode
    });
    return { ...result.user, created: result.created };
  }

  async loginWithInvite({ email, displayName, inviteCode }) {
    return this.registerWithInvite({ account: email, displayName, inviteCode });
  }
}

export function normalizeAccountEmail(account) {
  const normalized = String(account ?? "").trim().toLowerCase();
  if (!normalized) {
    throw new Error("請輸入帳號");
  }
  if (normalized.includes("@")) {
    if (!normalized.endsWith(`@${ACCOUNT_DOMAIN}`)) {
      throw new Error(`只能使用 @${ACCOUNT_DOMAIN} 帳號`);
    }
    return normalizeEmail(normalized);
  }
  if (!/^[a-z0-9._+-]+$/.test(normalized)) {
    throw new Error("帳號只能包含英文字母、數字、點、底線、加號與連字號");
  }
  return normalizeEmail(`${normalized}@${ACCOUNT_DOMAIN}`);
}
