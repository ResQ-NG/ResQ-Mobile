export interface CheckIdentifierRequest {
  identifier: 'email' | 'phone';
  value: string;
}

export type CheckIdentifierStatus = 'active' | 'not_found' | 'not_verified';

export interface CheckIdentifierResponse {
  status: CheckIdentifierStatus;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

/** Login body: set `email` when `identifier` is `email`, or `phone_number` when `phone`. */
export interface LoginWithIdentifierRequest {
  identifier: 'email' | 'phone';
  password: string;
  email?: string;
  phone_number?: string;
  nin?: string;
}
export interface AvatarPreset {
  style: string;
  seed: string;
  preview_url: string;
}

export interface UpdateProfileInformationRequest {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export interface AuthUserProfile {
  avatar_url?: string | null;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

export interface LoginWithIdentifierResponse {
  token: string;
  refresh_token?: string;
  user: AuthUserProfile;
}

export interface ResendVerificationTokenRequest {
    email: string;
}

export interface VerifyEmailRequest {
    code: string;
    email: string;
}
/**
 * Create-account body. Either `email` or `phone_number` is required (not both).
 * `nin` is optional.
 */
export interface CreateAccountRequest {
  first_name: string;
  password: string;
  email?: string;
  phone_number?: string;
  last_name?: string;
  nin?: string;
}

export interface CreateAccountResponse {
  avatar_url: string;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

export interface VerifyIdentifierOtpRequest {
  identifier: 'email' | 'phone';
  value: string;
  code: string;
}

/** OTP verify often returns the same shape as login; adjust if your API differs. */
export type VerifyIdentifierOtpResponse = LoginWithIdentifierResponse;

export interface AuthUserProfileResponse {
  user: AuthUserProfile;
}
