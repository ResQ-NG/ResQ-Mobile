const VersionAlias = 'v1';
const AuthAlias = 'users';
export const AuthRoutes = {
  CheckIdentifier: `${VersionAlias}/auth/check-identifier`,
  Login: `${VersionAlias}/auth/login`,
  CreateAccount: `${VersionAlias}/${AuthAlias}/create`,
  VerifyIdentifierOtp: `${VersionAlias}/auth/verify-otp`,
  ProfileInformation: `${VersionAlias}/${AuthAlias}/profile`,
  UpdateProfileInformation: `${VersionAlias}/${AuthAlias}/profile`,
  ViewAvatarPresets: `${VersionAlias}/${AuthAlias}/avatars/presets`,
};
