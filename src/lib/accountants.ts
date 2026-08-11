/**
 * Practice-side access is restricted to these two accounts.
 * OAuth identities are never granted bookkeeper access, even if the email matches
 * a value here it must also be a password sign-in issued by the practice.
 */
export const ACCOUNTANT_EMAILS = [
  "elazazy.ameer@gmail.com",
  "oamroamr114@gmail.com",
] as const;

export const isAccountantEmail = (email?: string | null) =>
  !!email && ACCOUNTANT_EMAILS.includes(email.toLowerCase().trim() as (typeof ACCOUNTANT_EMAILS)[number]);

/** True when the Supabase identity signed in with a federated provider. */
export const isOAuthIdentity = (appMetadata?: { provider?: string } | null) => {
  const provider = appMetadata?.provider;
  return !!provider && provider !== "email";
};

/** Only this account can see inbound quote requests / leads. */
export const LEAD_OWNER_EMAIL = "elazazy.ameer@gmail.com";

export const isLeadOwnerEmail = (email?: string | null) =>
  !!email && email.toLowerCase().trim() === LEAD_OWNER_EMAIL;
