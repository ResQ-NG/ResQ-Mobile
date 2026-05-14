const VersionAlias = 'v1';
const AuthAlias = 'users';
export const AuthRoutes = {
  RefreshToken: `${VersionAlias}/auth/refresh`,
  CheckIdentifier: `${VersionAlias}/auth/check-identifier`,
  Login: `${VersionAlias}/auth/login`,
  CreateAccount: `${VersionAlias}/${AuthAlias}/create`,
  VerifyIdentifierOtp: `${VersionAlias}/auth/verify-otp`,
  VerifyEmail: `${VersionAlias}/auth/verify-email`,
  ResendVerificationToken: `${VersionAlias}/auth/resend-verification-token`,
  ProfileInformation: `${VersionAlias}/${AuthAlias}/profile`,
  UpdateProfileInformation: `${VersionAlias}/${AuthAlias}/profile`,
  ViewAvatarPresets: `${VersionAlias}/${AuthAlias}/avatars/presets`,
};
