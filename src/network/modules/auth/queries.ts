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
  UpdateProfileInformationRequest,
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
  false,
  { staleTime: 60_000 }
);

export const useUpdateProfileInformation = createApiMutation<
  UpdateProfileInformationRequest,
  AuthUserProfile
>({
  endpoint: AuthRoutes.UpdateProfileInformation,
  operationName: 'Update Profile Information',
  method: 'put',
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
