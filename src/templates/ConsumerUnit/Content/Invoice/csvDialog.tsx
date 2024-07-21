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
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { FileRejection, useDropzone } from "react-dropzone";
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
  changeError: (arg: boolean) => void;
}

const CsvDialog: React.FC<CsvDialogProps> = ({
  isCsvDialogOpen,
  handleCloseCsvDialog,
  onFileSelect,
  isError,
  changeError,
  isLoading,
}) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [helpTextClicked, setHelpTextClicked] = useState(false);
  const [isInvalidFile, setIsInvalidFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    changeError(false);
    setIsInvalidFile(false);
    if (rejectedFiles.length > 0) {
      setIsInvalidFile(true);
    }
    else {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !!selectedFile,
    accept: {
      "text/csv/xslx": [".csv", ".xls", ".xlsx", ".xlsm", ".xlsb", ".odf", ".ods", ".odt"]
    },
    multiple: false,
    noClick: true,
  });

  const handleFileRemove = () => {
    setSelectedFile(null);
    changeError(false);
    setIsInvalidFile(false);
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
    event: React.MouseEvent<HTMLButtonElement>,
    file: string
  ) => {
    event?.preventDefault();
    try {
      const session = await getSession()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/energy-bills/download-${file}-model/`,
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
      link.setAttribute("download", `modelo.${file}`);
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
      maxWidth="sm"
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
        <Typography variant="body2" sx={{ marginLeft: 20 }}>Modelos: </Typography>
        <Link
          component="button"
          onClick={(event) => handleDownloadClick(event, "xlsx")}
          style={{
            // cursor: "pointer",
            color: theme.palette.primary.main,
            textDecoration: "none",
            marginLeft: "auto",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" xs={{}}>
            <DescriptionRoundedIcon style={{ marginLeft: 2, marginRight: 4, fontSize: 19 }} />
            <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>Excel</Typography>
          </Box>
        </Link>
        <Link
          component="button"
          onClick={(event) => handleDownloadClick(event, "csv")}
          style={{
            cursor: "pointer",
            color: theme.palette.primary.main,
            textDecoration: "none",
            marginLeft: "16px",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <DescriptionRoundedIcon style={{ marginLeft: 2, marginRight: 4, fontSize: 19 }} />
            <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>CSV</Typography>
          </Box>
        </Link>
      </Box >
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
        <Box pb={helpTextClicked ? 0 : 2} display={isDragActive ? "none" : "block"}>
          <Typography variant="body1" color="textSecondary">
            Importe uma planilha para lançar várias faturas de uma só vez.{" "}
            {!helpTextClicked && <span
              style={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                textDecoration: "underline",
              }}
              onClick={handleHelpTextClick}
            >
              Saiba como fazer
            </span>
            }
          </Typography >
        </Box>

        {helpTextClicked && !isDragActive ? (
          <Box pb={2}>
            <Typography variant="body1" color="black" marginLeft="24px" marginRight="24px" sx={{ opacity: "87%", fontSize: "16px", mt: "-8px", lineHeight: "28px" }}>
              <ol>
                <li>Baixe a planilha modelo em um dos formatos acima.</li>
                <li> Abra a planilha modelo.</li>
                <li>Insira os dados das faturas sem alterar os cabeçalhos ou a
                  ordem das colunas. </li>
                <li>Grave o arquivo mantendo o mesmo formato. </li>

                <li>Arraste o arquivo até aqui, ou use o botão “Selecionar” abaixo.{" "}</li>
                <li>Por fim, clique em “Importar”. </li>
              </ol>
            </Typography>
          </Box>
        ) : null}

        <Box
          {...getRootProps()}
          border={selectedFile && !isDragActive ? "none" : "2px dashed"}
          borderRadius={isDragActive ? "8px" : "24px"}
          p={4}
          textAlign="center"
          bgcolor={selectedFile && !isDragActive ? "inherit" : "#cedee1"}
          borderColor={selectedFile && !isDragActive ? "none" : theme.palette.primary.main}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{
            maxHeight: isDragActive ? "none" : "72px",
            maxWidth: isDragActive ? "none" : "552px",
            height: "100%",
            width: "100%",
            position: isDragActive ? "absolute" : "relative",
            top: 0,
            left: 0,
          }}
        >
          <input {...getInputProps()} />
          {!selectedFile || isDragActive ? (
            <Typography variant="h6" sx={{ fontWeight: 500 }} color={"#0A5C67"}>
              {isDragActive ? "Solte o arquivo aqui" : "Arraste o arquivo até aqui"}
            </Typography>
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderRadius="24px"
                padding="12px 13px"
                marginRight="8px"
                bgcolor={isError ? "#f7e8e6" : "#e3f2fd"}
                borderColor={isError ? theme.palette.error.main : theme.palette.primary.main}
              >
                {isLoading && (
                  <CircularProgress
                    size={16}
                    style={{ marginLeft: 8, marginRight: 8, color: theme.palette.primary.main }}
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

        {isInvalidFile && !isDragActive &&
          <Alert
            severity="error"
            variant="filled"
            icon={<ErrorOutlineIcon style={{ color: "#FFF" }} />}
            sx={{ cursos: 'pointer', whiteSpace: 'pre-line', mt: 1 }}
          >
            Somente arquivos Excel e Csv são aceitos
          </Alert>
        }
        {!selectedFile && !isDragActive && (
          <>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              ou
            </Typography>
            <Box display="flex" justifyContent="center" mt={1}>
              <input
                type="file"
                id="SheetFileInput"
                style={{ display: "none" }}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  const extension = file?.name.substring((file.name).lastIndexOf('.'))
                  const acceptedFilesCsv = ".csv, .xls, .xlsx, .xlsm, .xlsb, .odf, .ods, .odt";
                  if (!acceptedFilesCsv.includes(extension)) {
                    setIsInvalidFile(true);
                  }
                  else if (file) {
                    setSelectedFile(file);
                    setIsInvalidFile(false);
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
                    Selecionar arquivo
                  </Typography>
                </Box>
              </label>
            </Box>

          </>
        )
        }
        {
          isError ?
            <Alert
              severity="error"
              variant="filled"
              title="Arquivo não segue o modelo"
              icon={<ErrorOutlineIcon style={{ color: "#FFF" }} />}
              sx={{ cursor: 'pointer', whiteSpace: 'pre-line', mt: 1 }}
            >
              <AlertTitle>Arquivo não segue o modelo</AlertTitle>
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
