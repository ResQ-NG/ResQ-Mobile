import { createApiMutation, createApiQuery } from '@/network/config/api-client';
import { EmergencyContactsKeys } from './keys';
import { EmergencyContactsRoutes } from './routes';
import { mapApiEmergencyContactToUi, type UiEmergencyContact } from './utils';
import {
  ContactRelationshipResponse,
  CreateEmergencyContactRequest,
  EmergencyContact,
  UpdateEmergencyContactVariables,
} from './types';

export const useGetEmergencyContacts = createApiQuery<
  void,
  UiEmergencyContact[]
>({
  endpoint: EmergencyContactsRoutes.List,
  operationName: 'Get Emergency Contacts',
  queryKey: [EmergencyContactsKeys.List],
  terminateIfNotAuthenticated: true,
  transformResponse: (response) => {
    return (
      (response as EmergencyContact[])?.map(mapApiEmergencyContactToUi) ?? []
    );
  },
});

export const useGetAvailableRelationships = createApiQuery<
  void,
  ContactRelationshipResponse[]
>({
  endpoint: EmergencyContactsRoutes.AvailableRelationships,
  operationName: 'Get Available Relationships',
  queryKey: [EmergencyContactsKeys.AvailableRelationships],
  terminateIfNotAuthenticated: true,
});

export const useCreateEmergencyContact = createApiMutation<
  CreateEmergencyContactRequest,
  EmergencyContact
>({
  endpoint: EmergencyContactsRoutes.Create,
  operationName: 'Create Emergency Contact',
  method: 'post',
  successMessage: 'Contact added',
  invalidateQueries: [[EmergencyContactsKeys.List]],
});

export const useUpdateEmergencyContact = createApiMutation<
  UpdateEmergencyContactVariables,
  EmergencyContact
>({
  endpoint: (vars) => EmergencyContactsRoutes.Update(String(vars.contactId)),
  operationName: 'Update Emergency Contact',
  method: 'patch',
  transformRequest: (vars): Record<string, unknown> => ({
    ...vars.body,
  }),
  successMessage: 'Contact updated',
  invalidateQueries: [[EmergencyContactsKeys.List]],
});

export const useDeleteEmergencyContact = createApiMutation<number, unknown>({
  endpoint: (contactId) => EmergencyContactsRoutes.Delete(String(contactId)),
  operationName: 'Delete Emergency Contact',
  method: 'delete',
  successMessage: 'Contact removed',
  invalidateQueries: [[EmergencyContactsKeys.List]],
});

export const useInviteUser = createApiMutation<string, unknown>({
  endpoint: (contactId) =>
    EmergencyContactsRoutes.InviteUser(String(contactId)),
  operationName: 'Invite User',
  method: 'post',
  successMessage: 'User invited',
  invalidateQueries: [[EmergencyContactsKeys.List]],
});
