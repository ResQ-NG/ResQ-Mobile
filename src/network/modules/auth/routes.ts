const VersionAlias = 'v1';
const AuthAlias = 'users/auth';
export const AuthRoutes = {
  CheckIdentifier: `${VersionAlias}/${AuthAlias}/check-identifier`,
  Login: `${VersionAlias}/users/login`,
  CreateAccount: `${VersionAlias}/${AuthAlias}/create-account`,
  VerifyIdentifierOtp: `${VersionAlias}/${AuthAlias}/verify-otp`,
};
