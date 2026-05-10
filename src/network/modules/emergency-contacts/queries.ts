import { createApiMutation, createApiQuery } from '@/network/config/api-client';
import { EmergencyContactsKeys } from './keys';
import { EmergencyContactsRoutes } from './routes';
import { mapApiEmergencyContactToUi, type UiEmergencyContact } from './utils';
import {
  AcceptInboundPeerRequest,
  ContactRelationshipResponse,
  CreateEmergencyContactRequest,
  EmergencyContact,
  PendingInboundPeerResponse,
  UpdateEmergencyContactVariables,
} from './types';
import {
  DefaultServerRequest,
  DefaultServerResponse,
} from '@/network/config/types';

export const useGetEmergencyContacts = createApiQuery<
  DefaultServerRequest,
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
  DefaultServerRequest,
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

export const useDeleteEmergencyContact = createApiMutation<
  { contactId: string },
  DefaultServerResponse
>({
  endpoint: (vars) => EmergencyContactsRoutes.Delete(String(vars.contactId)),
  operationName: 'Delete Emergency Contact',
  method: 'delete',
  successMessage: 'Contact removed',
  invalidateQueries: [[EmergencyContactsKeys.List]],
});

export const useInviteUser = createApiMutation<
  { contactId: string },
  DefaultServerResponse
>({
  endpoint: (vars) =>
    EmergencyContactsRoutes.InviteUser(String(vars.contactId)),
  operationName: 'Invite User',
  method: 'post',
  successMessage: 'User invited',
  invalidateQueries: [[EmergencyContactsKeys.List]],
});

export const useAcceptInboundPeer = createApiMutation<
  AcceptInboundPeerRequest,
  DefaultServerResponse
>({
  endpoint: EmergencyContactsRoutes.AcceptInboundPeer,
  operationName: 'Accept Inbound Peer',
  method: 'post',
  successMessage: 'Contacts added',
  invalidateQueries: [
    [EmergencyContactsKeys.List],
    [EmergencyContactsKeys.ViewInboundPeers],
  ],
});


export const useViewInboundPeers = createApiQuery<
  DefaultServerRequest,
  PendingInboundPeerResponse
>({
  endpoint: EmergencyContactsRoutes.ViewInboundPeers,
  operationName: 'View Inbound Peers',
  queryKey: [EmergencyContactsKeys.ViewInboundPeers],
  terminateIfNotAuthenticated: true,
});
