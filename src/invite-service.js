import { normalizeEmail, normalizeInviteCode } from "./store.js";

export class InviteService {
  constructor(store) {
    this.store = store;
  }

  async loginWithInvite({ email, displayName, inviteCode }) {
    const normalizedEmail = normalizeEmail(email);
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
}
