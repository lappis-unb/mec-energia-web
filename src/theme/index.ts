import { createTheme } from "@mui/material";
import "@mui/x-data-grid/themeAugmentation";
import { ptBR as corePtBR } from "@mui/material/locale";
import { ptBR } from "@mui/x-date-pickers";

declare module "@mui/material/styles" {
  interface Palette {
    highlighted: Palette["primary"];
  }

  interface PaletteOptions {
    highlighted: PaletteOptions["primary"];
  }
}

const primaryMain = "#0A5C67";

const theme = createTheme(
  {
    palette: {
      primary: {
        main: primaryMain,
        contrastText: "#fff",
      },
      secondary: {
        main: "#FB736C",
      },
      background: {
        default: "#EEF4F4",
        paper: "#fff",
        columnGroup: "#DAE8E9",
      },
      error: {
        main: "#B31B0A",
      },
      warning: {
        main: "#FB736C",
        contrastText: "#000",
      },
      highlighted: {
        main: "rgba(10, 92, 103, 0.12)",
      },
    },
    typography: {
      fontFamily: ["Lexend", "sans-serif"].join(","),
    },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardError: {
            backgroundColor: "#B31B0A",
            color: "#FFFFFF",
          },
          standardSuccess: {
            backgroundColor: "#418026",
            color: "#FFFFFF",
          },
          standardWarning: {
            backgroundColor: "RGB(217, 138, 11)",
            color: "#000",
          },
          outlinedInfo: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "rgb(41, 109, 204)",
            color: "rgb(41, 109, 204)",
          },
          standardInfo: {
            backgroundColor: "#E8EFF9",
            color: "#0F294D",
          },
          icon: {
            color: "#FFFFFF",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: primaryMain,

            "& .MuiTableCell-root": {
              color: "white",
            },
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            "& .MuiTableRow-root": {
              "&:nth-of-type(odd)": {
                backgroundColor: "white",
              },
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiDataGrid-columnHeader--filledGroup": {
              backgroundColor: "rgba(10, 92, 103, 0.08)",
              color: "rgba(0, 0, 0, 0.87)",
            },
            "& .MuiDataGrid-columnHeader--emptyGroup": {
              backgroundColor: "unset",
            },

            border: "unset",
          },
          row: {
            ":nth-of-type(odd)": {
              backgroundColor: "white",
            },
          },
          columnHeader: {
            color: "white",
            backgroundColor: primaryMain,
            ":focus": {
              outline: "none",
            },
            button: {
              color: "white",
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: { paper: { backgroundColor: "#EEF4F4" } },
      },
    },
  },
  ptBR,
  corePtBR
);

export default theme;
