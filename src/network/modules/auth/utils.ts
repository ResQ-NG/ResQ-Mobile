import {
  AuthUser,
  GoogleUser,
} from "@/atoms/persisted-atoms/auth-atoms/authUserAtom";

export const convertGoogleUserToAuthUser = (
  googleUser: GoogleUser
): AuthUser => {
  return {
    id: null as unknown as string | number,
    google_id: googleUser.id,
    email: googleUser.email,
    name: googleUser.name,
    profile_picture_url: googleUser.photo,
    first_name: googleUser.givenName,
    last_name: googleUser.familyName,
    date_of_birth: null,
    home_address: null,
    city: null,
    state: null,
    zip_code: null,
    account_status: "active",
    role: "user",
  };
};

export const formatSocialSecurityNumber = (
  socialSecurityNumber: string
): string => {
  return socialSecurityNumber.length === 9
    ? `${socialSecurityNumber.slice(0, 3)}-${socialSecurityNumber.slice(3, 5)}-${socialSecurityNumber.slice(5)}`
    : socialSecurityNumber;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.startsWith("+") ? phoneNumber : `+1${phoneNumber}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
