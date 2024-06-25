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
} from "@mui/material";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { useDropzone } from "react-dropzone";
import { getSession } from "next-auth/react";

interface CsvDialogProps {
  isCsvDialogOpen: boolean;
  handleCloseCsvDialog: () => void;
  onFileSelect: (file: File) => void;
}

const CsvDialog: React.FC<CsvDialogProps> = ({
  isCsvDialogOpen,
  handleCloseCsvDialog,
  onFileSelect,
}) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [helpTextClicked, setHelpTextClicked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    noClick: true,
  });

  const handleFileRemove = () => {
    setSelectedFile(null);
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
    >
      <Box
        display="flex"
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
      <DialogContent sx={{ paddingTop: "8px" }}>
        <Box pb={2}>
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
          </Typography>
        </Box>

        {helpTextClicked ? (
          <Box pb={2}>
            <Typography variant="body2" color="black">
              1. Baixe o arquivo modelo em formato CSV acima. <br />
              2. Abra o modelo. <br />
              3. Insira os dados das faturas sem alterar os cabeçalhos ou a
              ordem das colunas. <br />
              4. Grave o arquivo em formato CSV. <br />
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
          p={selectedFile ? 0 : 4}
          textAlign="center"
          bgcolor={selectedFile ? "inherit" : "#e3f2fd"}
          borderColor={selectedFile ? "none" : theme.palette.primary.main}
          mb={2}
        >
          <input {...getInputProps()} />
          {!selectedFile ? (
            <Typography variant="body2" color="textSecondary">
              Arraste o arquivo até aqui
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
                bgcolor="#e3f2fd"
                borderColor={theme.palette.primary.main}
              >
                <Typography variant="body2" color={theme.palette.primary.main}>
                  {selectedFile.name}
                </Typography>
              </Box>
              <DeleteIcon
                onClick={handleFileRemove}
                style={{ cursor: "pointer", color: theme.palette.primary.main }}
              />
            </Box>
          )}
        </Box>

        {!selectedFile && (
          <>
            <Typography variant="body2" color="textSecondary" align="center">
              ou
            </Typography>
            <Box display="flex" justifyContent="center" mt={1}>
              <input
                type="file"
                id="csvFileInput"
                style={{ display: "none" }}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                accept=".csv"
              />
              <label htmlFor="csvFileInput">
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
                    Selecionar arquivo CSV
                  </Typography>
                </Box>
              </label>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClearCsvDialogAndClose}>Cancelar</Button>
        <Button onClick={handleUploadClick} disabled={!selectedFile}>
          Importar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CsvDialog;
