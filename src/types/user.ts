export type Media = {
  url: string;
};

export type MyApiUser = {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  zipCode?: string;
  address?: string;
  avatar?: Media | null;
  city?: string;
  businessId?: number;
  countryId?: number;
  status_user?: string;
  rolId?: number;
};

export type MyApiLoginResponse = {
  accessToken: string;
  user: MyApiUser;
  expiresIn: number;
};

export type MyApiSignUpRequest = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryId?: number;
  phoneNumber?: string;
  address?: string;
  zipCode?: string;
};

export type MyApiSignUpResponse = {
  message: string;
};

export type MyApiForgotPasswordResponse = {
  message: string;
  tokenEmail?: string;
};

export type MyApiResetPasswordResponse = {
  message: string;
};

export type MyApiUpdateUserResponse = {
  message: string;
  user: MyApiUser;
};

export type ProfileFormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryId: number;
  phoneNumber: string;
  address: string;
  zipCode: string;
};
