import {
  CreateConsumerUnitRequestPayload,
  EditConsumerUnitRequestPayload,
  InvoicesPayload,
} from "@/types/consumerUnit";
import {
  GetContractsResponsePayload,
  RenewContractRequestPayload,
  RenewContractResponsePayload,
} from "@/types/contract";
import {
  CreateDistributorRequestPayload,
  CreateDistributorResponsePayload,
  Distributor,
  DistributorPropsTariffs,
  DistributorResponsePayload,
  EditDistributorRequestPayload,
  EditDistributorResponsePayload,
} from "@/types/distributor";

import {
  CurrentEnergyBillResponsePayload,
  EditEnergyBillRequestPayload,
  EditEnergyBillResponsePayload,
  PostEnergyBillRequestPayload,
  PostEnergyBillResponsePayload,
} from "@/types/energyBill";
import { GetSubgroupsResponsePayload } from "@/types/subgroups";
import { Recommendation, RecommendationSettings } from "@/types/recommendation";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { ConsumerUnit, ConsumerUnitsPayload } from "@/types/consumerUnit";
import { DistributorSubgroup } from "@/types/tariffs";
import {
  CreateTariffRequestPayload,
  CreateTariffResponsePayload,
  EditTariffRequestPayload,
  EditTariffResponsePayload,
  GetTariffRequestPayload,
  Tariff,
} from "@/types/tariffs";
import {
  CreateInstitutionRequestPayload,
  CreateInstitutionResponsePayload,
  EditInstitutionRequestPayload,
  EditInstitutionResponsePayload,
  GetInstitutionResponsePayload,
  Institution,
} from "@/types/institution";
import {
  CreatePersonRequestPayload,
  CreatePersonResponsePayload,
  EditPersonRequestPayload,
  EditPersonResponsePayload,
  GetPersonResponsePayload,
  GetPersonUniversityResponsePayload,
  PatchUserRequestPayload,
  User,
} from "@/types/person";

//import { signOut } from "next-auth/react";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export const mecEnergiaApi = createApi({
  reducerPath: "mecEnergiaApi",
    baseQuery: fetchBaseQuery({
      baseUrl,
      prepareHeaders: async (headers) => {
        const session = await getSession();
        
        if (session) {
          headers.set("Authorization", `Token ${session.user.token}`);
        }

        return headers;
      },
    }),
  tagTypes: [
    "Distributors",
    "ConsumerUnit",
    "Subgroups",
    "CurrentContract",
    "Invoices",
    "Recommendation",
    "Tariffs",
    "Institution",
    "Person",
  ],
  endpoints: (builder) => ({
    fetchConsumerUnits: builder.query<ConsumerUnitsPayload, number>({
      query: (universityId) => `consumer-units?university_id=${universityId}`,
      providesTags: ["ConsumerUnit"],
    }),
    getConsumerUnit: builder.query<ConsumerUnit, number>({
      query: (consumerUnitId) => `consumer-units/${consumerUnitId}`,
      providesTags: ["ConsumerUnit"],
    }),
    getDistributorSubgroups: builder.query<DistributorSubgroup[], number>({
      query: (distributorId) =>
        `/distributors/${distributorId}/consumer-units-by-subgroup/`,
      providesTags: ["Subgroups", "Tariffs"],
    }),
    fetchInvoices: builder.query<InvoicesPayload, number>({
      query: (consumerUnitId) =>
        `energy-bills?consumer_unit_id=${consumerUnitId}`,
      providesTags: ["Invoices"],
    }),
    getSubgroups: builder.query<GetSubgroupsResponsePayload, void>({
      query: () => "/contracts/list-subgroups/",
      providesTags: ["Subgroups"],
    }),
    getDistributors: builder.query<Array<DistributorPropsTariffs>, number>({
      query: (universityId) => `distributors/?university_id=${universityId}`,
      providesTags: ["Distributors", "Tariffs"],
    }),
    fetchDistributors: builder.query<Distributor[], number>({
      query: (universityId) => `distributors?university_id=${universityId}`,
      providesTags: ["Distributors", "Tariffs"],
      transformResponse: (distributors: DistributorResponsePayload[]) => {
        // Sorts alphabetically by default
        return distributors.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }

          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }

          return 0;
        });
      },
    }),
    getDistributor: builder.query<DistributorPropsTariffs, number>({
      query: (distributorId) => `distributors/${distributorId}/`,
      providesTags: ["Distributors", "Tariffs"],
    }),
    createDistributor: builder.mutation<
      CreateDistributorResponsePayload,
      CreateDistributorRequestPayload
    >({
      query: (body) => ({
        url: "distributors/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Distributors"],
    }),
    editDistributor: builder.mutation<
      EditDistributorResponsePayload,
      EditDistributorRequestPayload
    >({
      query: (body) => ({
        url: `distributors/${body.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Distributors"],
    }),
    createConsumerUnit: builder.mutation<
      string,
      CreateConsumerUnitRequestPayload
    >({
      query: (body) => ({
        url: "consumer-units/create_consumer_unit_and_contract/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ConsumerUnit", "CurrentContract"],
    }),
    editConsumerUnit: builder.mutation<string, EditConsumerUnitRequestPayload>({
      query: (body) => ({
        url: "consumer-units/edit_consumer_unit_and_contract/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ConsumerUnit", "CurrentContract"],
    }),
    deleteEnergiBill: builder.mutation<void, number>({
      query: (id) => ({
        url: `/energy-bills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoices", "ConsumerUnit"],
    }),
    getContract: builder.query<GetContractsResponsePayload, number>({
      query: (consumerUnitId) =>
        `contracts/get-current-contract-of-consumer-unit/?consumer_unit_id=${consumerUnitId}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              { type: "CurrentContract", arg },
              "CurrentContract",
              "Recommendation",
            ]
          : ["CurrentContract", "Recommendation"],
    }),
    renewContract: builder.mutation<
      RenewContractResponsePayload,
      RenewContractRequestPayload
    >({
      query: (body) => ({
        url: "contracts/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CurrentContract", "Recommendation"],
    }),
    postInvoice: builder.mutation<
      PostEnergyBillResponsePayload,
      PostEnergyBillRequestPayload
    >({
      query: (body) => ({
        url: "/energy-bills/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invoices", "ConsumerUnit", "Recommendation"],
    }),
    editInvoice: builder.mutation<
      EditEnergyBillResponsePayload,
      EditEnergyBillRequestPayload
    >({
      query: (body) => ({
        url: `/energy-bills/${body.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Invoices", "Recommendation"],
    }),
    getCurrentInvoice: builder.query<CurrentEnergyBillResponsePayload, number>({
      query: (energyBillId) => `energy-bills/${energyBillId}/`,
      providesTags: (result, error, arg) =>
        result
          ? [{ type: "Invoices", arg }, "Invoices", "Recommendation"]
          : ["Invoices", "Recommendation"],
    }),
    getTariff: builder.query<Tariff, GetTariffRequestPayload>({
      query: (payload) =>
        `distributors/${payload.distributor}/get-tariffs/?subgroup=${payload.subgroup}`,
      providesTags: (result, error, arg) =>
        result
          ? [{ type: "Invoices", arg }, "Invoices", "Recommendation", "Tariffs"]
          : ["Tariffs"],
    }),
    createTariff: builder.mutation<
      CreateTariffResponsePayload,
      CreateTariffRequestPayload
    >({
      query: (body) => ({
        url: "/tariffs/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tariffs", "Recommendation"],
    }),
    editTariff: builder.mutation<
      EditTariffResponsePayload,
      EditTariffRequestPayload
    >({
      query: (body) => ({
        url: "/tariffs/1/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tariffs", "Recommendation"],
    }),
    getAllInstitution: builder.query<GetInstitutionResponsePayload[], void>({
      query: () => "universities/",
      providesTags: ["Institution"],
    }),
    getInstitution: builder.query<GetInstitutionResponsePayload, number>({
      query: (institutionId) => `universities/${institutionId}/`,
      providesTags: ["Institution"],
    }),
    createInstitution: builder.mutation<
      CreateInstitutionResponsePayload,
      CreateInstitutionRequestPayload
    >({
      query: (body) => ({
        url: "universities/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Institution"],
    }),
    editInstitution: builder.mutation<
      EditInstitutionResponsePayload,
      EditInstitutionRequestPayload
    >({
      query: (body) => ({
        url: `universities/${body.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Institution"],
    }),
    getPerson: builder.query<GetPersonResponsePayload, number>({
      query: (personId) => `users/${personId}/`,
      providesTags: ["Person"],
    }),
    getUniversityPerson: builder.query<
      GetPersonUniversityResponsePayload,
      number
    >({
      query: (personId) => `university-user/${personId}/`,
      providesTags: ["Person"],
    }),
    createPerson: builder.mutation<
      CreatePersonResponsePayload,
      CreatePersonRequestPayload
    >({
      query: (body) => ({
        url: "university-user/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Person"],
    }),
    editPerson: builder.mutation<
      EditPersonResponsePayload,
      EditPersonRequestPayload
    >({
      query: (body) => ({
        url: `university-user/${body.id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Person"],
    }),
    recommendation: builder.query<Recommendation, number>({
      query: (consumerUnitId) => `recommendation/${consumerUnitId}`,
      providesTags: ["Recommendation"],
    }),
    recommendationSettings: builder.query<RecommendationSettings, void>({
      query: () => "recommendation-settings",
      keepUnusedDataFor: 120,
      providesTags: ["Recommendation"],
    }),
    getUsers: builder.query<User[], number | void>({
      query: (universityId) => {
        if (universityId) {
          return `users/?university_id=${universityId}`;
        }

        return "users/";
      },
      providesTags: ["Person"],
    }),
    editUser: builder.mutation<
      User,
      { userId: number; body: PatchUserRequestPayload }
    >({
      query: ({ userId, body }) => ({
        url: `users/${userId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Person"],
    }),
    fetchInstitutions: builder.query<Institution[], void>({
      query: () => `/universities`,
      providesTags: ["Institution"],
    }),
  }),
});

export const {
  useGetSubgroupsQuery,
  useGetDistributorsQuery,
  useGetDistributorQuery,
  useCreateDistributorMutation,
  useFetchDistributorsQuery,
  useEditDistributorMutation,
  useEditConsumerUnitMutation,
  useCreateConsumerUnitMutation,
  useGetContractQuery,
  useRenewContractMutation,
  usePostInvoiceMutation,
  useEditInvoiceMutation,
  useGetCurrentInvoiceQuery,
  useFetchConsumerUnitsQuery,
  useGetConsumerUnitQuery,
  useFetchInvoicesQuery,
  useGetTariffQuery,
  useCreateTariffMutation,
  useEditTariffMutation,
  useGetAllInstitutionQuery,
  useGetInstitutionQuery,
  useCreateInstitutionMutation,
  useEditInstitutionMutation,
  useGetPersonQuery,
  useGetUniversityPersonQuery,
  useCreatePersonMutation,
  useEditPersonMutation,
  useRecommendationQuery,
  useRecommendationSettingsQuery,
  useGetDistributorSubgroupsQuery,
  useGetUsersQuery,
  useEditUserMutation,
  useFetchInstitutionsQuery,
  useDeleteEnergiBillMutation,
} = mecEnergiaApi;
