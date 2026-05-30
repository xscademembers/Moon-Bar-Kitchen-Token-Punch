export const REWARD_EXPIRY_DAYS = 30;

export function computeRewardExpiryDate(issuedAt = new Date()) {
  const expiry = new Date(issuedAt);
  expiry.setDate(expiry.getDate() + REWARD_EXPIRY_DAYS);
  return expiry;
}

