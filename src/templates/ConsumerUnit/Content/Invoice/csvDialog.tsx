import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { useDropzone } from "react-dropzone";
import { getSession } from "next-auth/react";
import { Alert, AlertTitle } from "@mui/material/";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ReportRounded } from "@mui/icons-material";

interface CsvDialogProps {
  isCsvDialogOpen: boolean;
  handleCloseCsvDialog: () => void;
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  isError: boolean;
  removeError: () => void;
}

const CsvDialog: React.FC<CsvDialogProps> = ({
  isCsvDialogOpen,
  handleCloseCsvDialog,
  onFileSelect,
  isError,
  removeError,
  isLoading,
}) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [helpTextClicked, setHelpTextClicked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv/xslx": [".csv", ".xls", ".xlsx", ".xlsm", ".xlsb", ".odf", ".ods", ".odt"]
    },
    multiple: false,
    noClick: true,
  });

  const handleFileRemove = () => {
    setSelectedFile(null);
    removeError();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDownloadClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.preventDefault();
    try {
      const session = await getSession();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/energy-bills/download-csv-model/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${session?.user?.token}`,
            "Content-Type": "application/pdf",
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "modelo.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleHelpTextClick = () => {
    setHelpTextClicked(!helpTextClicked);
  };

  const handleClearCsvDialogAndClose = () => {
    handleFileRemove();
    setHelpTextClicked(false);
    handleCloseCsvDialog();
  };

  return (
    <Dialog
      open={isCsvDialogOpen}
      onClose={handleClearCsvDialogAndClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          height: isDragActive ? "38vh" : "auto",
        },
      }}
    >
      <Box
        display={isDragActive ? "none" : "flex"}
        justifyContent="space-between"
        alignItems="center"
        paddingRight={3}
      >
        <DialogTitle>Importar planilha</DialogTitle>
        <Link
          component="button"
          onClick={handleDownloadClick}
          style={{
            cursor: "pointer",
            color: theme.palette.primary.main,
            textDecoration: "underline",
            marginLeft: "auto",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body2">modelo.csv</Typography>
            <AttachFileRoundedIcon style={{ marginLeft: 2, fontSize: 19 }} />
          </Box>
        </Link>
      </Box>
      <DialogContent
        sx={{
          paddingTop: "8px",
          position: "relative",
          height: isDragActive ? "100%" : "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box pb={2} display={isDragActive ? "none" : "block"}>
          <Typography variant="body2" color="textSecondary">
            Importe uma planilha para lançar várias faturas de uma só vez.{" "}
            <span
              style={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                textDecoration: "underline",
              }}
              onClick={handleHelpTextClick}
            >
              Saiba como fazer
            </span>
          </Typography >
        </Box >

        {helpTextClicked && !isDragActive ? (
          <Box pb={2}>
            <Typography variant="body2" color="black">
              1. Baixe o arquivo modelo em formato Sheet acima. <br />
              2. Abra o modelo. <br />
              3. Insira os dados das faturas sem alterar os cabeçalhos ou a
              ordem das colunas. <br />
              4. Grave o arquivo em formato Sheet. <br />
              5. Arraste o arquivo até aqui, ou use o botão “Selecionar” abaixo.{" "}
              <br />
              6. Por fim, clique em “Importar”.
            </Typography>
          </Box>
        ) : null}

        <Box
          {...getRootProps()}
          border={selectedFile ? "none" : "1px dashed"}
          borderRadius="8px"
          p={4}
          textAlign="center"
          bgcolor={selectedFile ? "inherit" : "#e3f2fd"}
          borderColor={selectedFile ? "none" : theme.palette.primary.main}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{
            height: "100%",
            width: "100%",
            position: isDragActive ? "absolute" : "relative",
            top: 0,
            left: 0,
          }}
        >
          <input {...getInputProps()} />
          {!selectedFile ? (
            <Typography variant="body2" color="textSecondary">
              Solte o arquivo aqui
            </Typography>
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderRadius="24px"
                padding="4px 12px"
                marginRight="8px"
                bgcolor={isError ? "#f7e8e6" : "#e3f2fd"}
                borderColor={isError ? theme.palette.error.main : theme.palette.primary.main}
              >
                {isLoading && (
                  <CircularProgress
                    size={16}
                    style={{ marginLeft: 8, color: theme.palette.primary.main }}
                  />
                )}
                {isError && (
                  <ReportRounded
                    size={10}
                    style={{ marginLeft: 6, marginRight: 6, color: theme.palette.error.main }}
                  />
                )}
                <Typography variant="body2" color={isError ? theme.palette.error.main : theme.palette.primary.main}>
                  {selectedFile.name}
                </Typography>
              </Box>
              {!isLoading && (
                <DeleteIcon
                  onClick={handleFileRemove}
                  style={{
                    cursor: "pointer",
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {!selectedFile && !isDragActive && (
          <>
            <Typography variant="body2" color="textSecondary" align="center">
              ou
            </Typography>
            <Box display="flex" justifyContent="center" mt={1}>
              <input
                type="file"
                id="SheetFileInput"
                style={{ display: "none" }}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                accept=".csv, .xls, .xlsx, .xlsm, .xlsb, .odf, .ods, .odt"
              />
              <label htmlFor="SheetFileInput">
                <Box
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid"
                  borderRadius="8px"
                  padding="8px 16px"
                  color={theme.palette.primary.main}
                  style={{
                    cursor: "pointer",
                    borderColor: theme.palette.primary.main,
                  }}
                >
                  <FolderIcon
                    style={{
                      marginRight: 8,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    Selecionar planilha
                  </Typography>
                </Box>
              </label>
            </Box>
          </>
        )}
        {
          isError ?
            <Alert
              severity="error"
              variant="filled"
              title="Arquivo não segue o modelo"
              icon={<ErrorOutlineIcon style={{ color: "#FFF" }} />}
              sx={{ cursor: 'pointer', whiteSpace: 'pre-line', mt: -2.5 }}
            >
              <AlertTitle>Arquivo nao segue o modelo</AlertTitle>
              Caracteres como vírgula e ponto-e-vírgula podem afetar o formato.
              Corrija a formatação e tente novamente.
            </Alert>
            : null
        }
      </DialogContent >
      <DialogActions style={{ display: isDragActive ? "none" : "flex" }}>
        <Button onClick={handleClearCsvDialogAndClose}>Cancelar</Button>
        <Button
          onClick={handleUploadClick}
          disabled={!selectedFile || isLoading || isError}
        >
          Importar
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default CsvDialog;
