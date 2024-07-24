import { createTheme } from "@mui/material";
import "@mui/x-data-grid/themeAugmentation";
import { ptBR as corePtBR } from "@mui/material/locale";
import { ptBR } from "@mui/x-date-pickers";

declare module "@mui/material/styles" {
  interface Palette {
    highlighted: Palette["primary"];
    secondaryFocus: string;
    graph: {
      baseCostMain: string;
      baseCostSecondary: string;
      measuredConsumptionMain: string;
      measuredConsumptionSecondary: string;
      measuredDemandMain: string;
      measuredDemandSecondary: string;
      measuredDemandPeakLine: string;
      measuredDemandOffPeakLine: string;
    };
  }

  interface PaletteOptions {
    highlighted: PaletteOptions["primary"];
    secondaryFocus?: string;
    graph?: {
      baseCostMain?: string;
      baseCostSecondary?: string;
      measuredConsumptionMain?: string;
      measuredConsumptionSecondary?: string;
      measuredDemandMain?: string;
      measuredDemandSecondary?: string;
      measuredDemandPeakLine?: string;
      measuredDemandOffPeakLine?: string;
    };
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
        main: "#FAAD10",
      },
      background: {
        default: "#F7F7F7",
        paper: "#fff",
      },
      error: {
        main: "#B31B0A",
      },
      warning: {
        main: "#FAAD10",
        contrastText: "#000",
      },
      highlighted: {
        main: "rgba(10, 92, 103, 0.12)",
      },
      secondaryFocus: "#FAAD101F",
      graph: {
        baseCostMain: "#54BF86",
        baseCostSecondary: "#EE9083",
        measuredConsumptionMain: "#0E438C",
        measuredConsumptionSecondary: "#296DCC",
        measuredDemandMain: "#7C07C0",
        measuredDemandSecondary: "#D1A3E8",
        measuredDemandPeakLine: "#008940",
        measuredDemandOffPeakLine: "#55BF87",
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
        defaultProps: {
          variant: "filled",
        },
        styleOverrides: {
          standardError: {
            backgroundColor: "#FDEDED",
            color: "#5F2120",
            "& .MuiAlert-icon": {
              color: "#B31B0A",
            },
          },
          standardSuccess: {
            backgroundColor: "#EDF7ED",
            color: "#1E4620",
            "& .MuiAlert-icon": {
              color: "#008940",
            },
          },
          standardWarning: {
            backgroundColor: "#FFF4E5",
            color: "#663C00",
            "& .MuiAlert-icon": {
              color: "#D98A0B",
            },
          },
          standardInfo: {
            backgroundColor: "#E5F6FD",
            color: "#014361",
            "& .MuiAlert-icon": {
              color: "#003A7A",
            },
          },
          filledError: {
            backgroundColor: "#B31B0A",
            color: "#FFF",
          },
          filledSuccess: {
            backgroundColor: "#008940",
            color: "#FFF",
          },
          filledWarning: {
            backgroundColor: "#D98A0B",
            color: "#000",
          },
          filledInfo: {
            backgroundColor: "#003A7A",
            color: "#FFF",
          },
          outlinedError: {
            backgroundColor: "#F7F7F7",
            borderColor: "#B31B0A",
            color: "#5F2120",
          },
          outlinedSuccess: {
            backgroundColor: "#F7F7F7",
            borderColor: "#008940",
            color: "#1E4620",
          },
          outlinedWarning: {
            backgroundColor: "#F7F7F7",
            borderColor: "#D98A0B",
            color: "#663C00",
          },
          outlinedInfo: {
            backgroundColor: "#F7F7F7",
            borderColor: "#003A7A",
            color: "#014361",
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
            "& .MuiDataGrid-columnSeparator": {
              color: primaryMain,
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

            "&:last-of-type": {
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: { paper: { backgroundColor: "#EEF4F4" } },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: "0px",
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginRight: "8px",
          },
        },
      },
    },
  },
  ptBR,
  corePtBR
);

export default theme;
