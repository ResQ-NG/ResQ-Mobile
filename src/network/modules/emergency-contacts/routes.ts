const VersionAlias = 'v1';
const EmergencyContactsAlias = 'contacts';



export const EmergencyContactsRoutes = {
  List: `${VersionAlias}/${EmergencyContactsAlias}`,
  Create: `${VersionAlias}/${EmergencyContactsAlias}`,
  AvailableRelationships: `${VersionAlias}/${EmergencyContactsAlias}/relationships`,
  Update: (contactId: string) => `${VersionAlias}/${EmergencyContactsAlias}/${contactId}`,
  Delete: (contactId: string) => `${VersionAlias}/${EmergencyContactsAlias}/${contactId}`,
  InviteUser: (contactId: string) => `${VersionAlias}/${EmergencyContactsAlias}/${contactId}/invite`,
} as const;
