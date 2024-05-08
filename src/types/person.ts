export enum UserRole {
  SUPER_USER = "super_user",
  UNIVERSITY_USER = "university_user",
  UNIVERSITY_ADMIN = "university_admin",
}

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: UserRole;
  createdOn: Date;
  university: number;
};

export type PatchUserRequestPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  type?: UserRole;
};

export interface CreatePersonForm {
  firstName: string;
  lastName: string;
  email: string;
  university: { label: string; id: number | null } | null;
  type: UserRole;
}

export interface GetPersonResponsePayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: UserRole;
  createOn: Date;
}

export interface GetPersonUniversityResponsePayload extends GetPersonResponsePayload {
  university: number;
}

export type EditPersonForm = CreatePersonForm;

export interface CreatePersonRequestPayload {
  firstName: string;
  lastName: string;
  email: string;
  university: number;
  type: UserRole;
}

export interface EditFavoritesResponsePayload {
  consumerUnitId: number,
  action: string
}

export interface EditFavoritesRequestPayload extends EditFavoritesResponsePayload {
  personId?: number | string;
};

export interface EditPersonRequestPayload extends CreatePersonRequestPayload {
  id: number;
}

export type CreatePersonResponsePayload = GetPersonResponsePayload;

export type EditPersonResponsePayload = GetPersonResponsePayload;
