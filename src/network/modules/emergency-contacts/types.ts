export interface ContactRelationshipResponse {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmergencyContactRequest {
  full_name: string;
  relationship_id: number;
  /** E.164 Nigerian mobile when adding by phone. */
  phone_number?: string;
  /** When adding by email (optional on API; omit when using phone). */
  email?: string;
}

/** Same payload shape as create for PUT/PATCH updates. */
export type UpdateEmergencyContactRequest = CreateEmergencyContactRequest;

export type UpdateEmergencyContactVariables = {
  contactId: number;
  body: UpdateEmergencyContactRequest;
};

export interface EmergencyContact {
  id: number;
  full_name: string;
  phone_number?: string | null;
  email?: string | null;
  avatar_url: string;
  relationship?: ContactRelationshipResponse | null;
  is_app_user: boolean;
  created_at: string;
  updated_at: string;
}
