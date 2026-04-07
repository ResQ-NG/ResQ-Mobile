import { createApiMutation } from '@/network/config/api-client';
import { AuthRoutes } from './routes';
import type {
  CheckIdentifierRequest,
  CheckIdentifierResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  LoginWithIdentifierRequest,
  LoginWithIdentifierResponse,
  VerifyIdentifierOtpRequest,
  VerifyIdentifierOtpResponse,
} from './types';

export const useCheckIdentifier = createApiMutation<
  CheckIdentifierRequest,
  CheckIdentifierResponse
>({
  endpoint: AuthRoutes.CheckIdentifier,
  operationName: 'CheckIdentifier',
  method: 'post',
  suppressSuccessMessage: true,
});

export const useLoginWithIdentifier = createApiMutation<
  LoginWithIdentifierRequest,
  LoginWithIdentifierResponse
>({
  endpoint: AuthRoutes.Login,
  operationName: 'LoginWithIdentifier',
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
