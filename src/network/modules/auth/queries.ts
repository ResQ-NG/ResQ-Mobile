import { createApiMutation, createApiQuery } from '@/network/config/api-client';
import { AuthRoutes } from './routes';
import type {
  AuthUserProfile,
  AvatarPreset,
  CheckIdentifierRequest,
  CheckIdentifierResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  LoginWithIdentifierRequest,
  LoginWithIdentifierResponse,
  RefreshTokenRequest,
  ResendVerificationTokenRequest,
  UpdateProfileInformationRequest,
  VerifyEmailRequest,
  VerifyIdentifierOtpRequest,
  VerifyIdentifierOtpResponse,
} from './types';
import { AuthKeys } from './keys';
import { normalizeProfileApiResponse } from './utils';

export const useCheckIdentifier = createApiMutation<
  CheckIdentifierRequest,
  CheckIdentifierResponse
>({
  endpoint: AuthRoutes.CheckIdentifier,
  operationName: 'Check Identifier Status',
  method: 'post',
  suppressSuccessMessage: true,
});

export const useRefreshToken = createApiMutation<
  RefreshTokenRequest,
  LoginWithIdentifierResponse
>({
  endpoint: AuthRoutes.RefreshToken,
  operationName: 'Refresh Token',
  method: 'post',
  suppressSuccessMessage: true,
});

export const useLoginWithIdentifier = createApiMutation<
  LoginWithIdentifierRequest,
  LoginWithIdentifierResponse
>({
  endpoint: AuthRoutes.Login,
  operationName: 'Login with Identifier',
  method: 'post',
  suppressSuccessMessage: true,
});

export const useCreateAccount = createApiMutation<
  CreateAccountRequest,
  CreateAccountResponse
>({
  endpoint: AuthRoutes.CreateAccount,
  operationName: 'CreateAccount',
  method: 'post',
  suppressSuccessMessage: true,
  suppressErrorMessage: true,
  invalidateQueries: [[AuthKeys.UserProfile]],
});

export const useVerifyIdentifierOtp = createApiMutation<
  VerifyIdentifierOtpRequest,
  VerifyIdentifierOtpResponse
>({
  endpoint: AuthRoutes.VerifyIdentifierOtp,
  operationName: 'VerifyIdentifierOtp',
  method: 'post',
  suppressSuccessMessage: true,
});

export const useGetProfileInformation = createApiQuery<void, AuthUserProfile>(
  {
    endpoint: AuthRoutes.ProfileInformation,
    operationName: 'Get Profile Information',
    queryKey: [AuthKeys.UserProfile],
    terminateIfNotAuthenticated: true,
    transformResponse: (response) => normalizeProfileApiResponse(response),
  },
  {
    shouldShowError: false,
    staleTime: 60_000,
  }
);

export const useVerifyEmail = createApiMutation<
  VerifyEmailRequest,
  LoginWithIdentifierResponse
>({
  endpoint: AuthRoutes.VerifyEmail,
  operationName: 'Verify Email',
  method: 'post',
  suppressSuccessMessage: true,
});

export const useResendVerificationToken = createApiMutation<
  ResendVerificationTokenRequest,
  void
>({
  endpoint: AuthRoutes.ResendVerificationToken,
  operationName: 'Resend Verification Token',
  method: 'post',
  suppressSuccessMessage: true,
});

export const useUpdateProfileInformation = createApiMutation<
  UpdateProfileInformationRequest,
  AuthUserProfile
>({
  endpoint: AuthRoutes.UpdateProfileInformation,
  operationName: 'Update Profile Information',
  method: 'patch',
  successMessage: 'Profile updated',
  invalidateQueries: [[AuthKeys.UserProfile]],
});

export const useViewAvailableAvatarPresets = createApiQuery<
  void,
  AvatarPreset[]
>({
  endpoint: AuthRoutes.ViewAvatarPresets,
  operationName: 'View Available Avatar Presets',
  queryKey: [AuthKeys.AvailableAvatarPresets],
  terminateIfNotAuthenticated: true,
});
