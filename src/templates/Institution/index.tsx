import { useFetchInstitutionsQuery, useEditInstitutionMutation } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { FlashOn, FlashOff } from "@mui/icons-material";
import InstitutionEditButton from "./EditButton";
import { EditInstitutionRequestPayload } from "@/types/institution";
import Head from "next/head";
import { useMemo } from "react";
import { getHeadTitle } from "@/utils/head";

const InstitutionsTemplate = () => {
  const { data: institutions } = useFetchInstitutionsQuery();
  const [editInstitution] = useEditInstitutionMutation();

  const handleToggleActivation = async (
    institutionId: number,
    institutionActive: boolean,
    institutionName: string,
    institutionCnpj: string
  ) => {
    const institutionToUpdate: EditInstitutionRequestPayload = {
      id: institutionId,
      is_active: !institutionActive,
      name: institutionName,
      cnpj: institutionCnpj,
    };

    await editInstitution(institutionToUpdate);
  };

  const headTitle = useMemo(() => getHeadTitle("Instituições"), []);

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="70px">Ativa</TableCell>
              <TableCell width="122px">Sigla</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell width="166px">CNPJ</TableCell>
              <TableCell width="48px"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {institutions?.map((institution) => (
              <TableRow
                key={institution.id}
                style={{
                  textDecoration: institution.isActive
                    ? "none"
                    : "line-through",
                  color: "inherit",
                }}
              >
                <TableCell>
                  <IconButton
                    style={{ color: "#000000DE" }}
                    onClick={() =>
                      handleToggleActivation(
                        institution.id,
                        institution.isActive,
                        institution.name,
                        institution.cnpj
                      )
                    }
                  >
                    {institution.isActive ? <FlashOn /> : <FlashOff />}
                  </IconButton>
                </TableCell>
                <TableCell>{institution.acronym}</TableCell>
                <TableCell>{institution.name}</TableCell>
                <TableCell>{institution.cnpj}</TableCell>
                <TableCell>
                  <InstitutionEditButton institutionId={institution.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default InstitutionsTemplate;
