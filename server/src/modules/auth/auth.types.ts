export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export type AuthTokenPayload = {
  userId: string;
  expiresAt: number;
};
