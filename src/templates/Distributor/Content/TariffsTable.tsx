import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { getFormattedDate } from "@/utils/date";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  selectActiveDistributorId,
  selectActiveSubgroup,
  setIsTariffCreateFormOpen,
  setIsTariffEdiFormOpen,
} from "@/store/appSlice";
import { useGetDistributorSubgroupsQuery, useGetTariffQuery } from "@/api";
import WarningRounded from "@mui/icons-material/WarningRounded";

const getTariffQueryParams = (
  activeDistributorId: number | null,
  activeSubgroup: string | null
) => {
  if (!activeDistributorId || !activeSubgroup) {
    return skipToken;
  }

  return {
    distributor: activeDistributorId,
    subgroup: activeSubgroup,
  };
};

const DistributorContentTariffsTable = () => {
  const activeDistributorId = useSelector(selectActiveDistributorId);
  const activeSubgroup = useSelector(selectActiveSubgroup);
  const distributorId = useSelector(selectActiveDistributorId);

  const { data: tariffsSubgroups } = useGetDistributorSubgroupsQuery(
    distributorId ?? skipToken
  );

  const dispatch = useDispatch();

  const title = useMemo(() => {
    if (!activeSubgroup || !tariffsSubgroups || tariffsSubgroups.length > 1) {
      return "Tarifas";
    } else if (tariffsSubgroups.length === 1) {
      return `Tarifas do subgrupo ${activeSubgroup}`;
    }
  }, [activeSubgroup, tariffsSubgroups]);

  const tariffQueryPayload = useMemo(
    () => getTariffQueryParams(activeDistributorId, activeSubgroup),
    [activeDistributorId, activeSubgroup]
  );

  const { data: tariffData } = useGetTariffQuery(tariffQueryPayload);

  const { startDate, endDate, overdue, blue, green } = useMemo(() => {
    if (!tariffData) {
      return {
        startDate: null,
        endDate: null,
        overdue: false,
        blue: null,
        green: null,
      };
    }

    return {
      startDate: getFormattedDate(tariffData.startDate),
      endDate: getFormattedDate(tariffData.endDate),
      overdue: tariffData.overdue,
      blue: tariffData.blue,
      green: tariffData.green,
    };
  }, [tariffData]);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    if (!overdue) {
      setIsTooltipOpen(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsTooltipOpen(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [overdue]);

  const handleOnEditTariffButtonClick = useCallback(() => {
    dispatch(setIsTariffEdiFormOpen(true));
  }, [dispatch]);

  const handleOnCreateTariffButtonClick = useCallback(() => {
    dispatch(setIsTariffCreateFormOpen(true));
  }, [dispatch]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{title}</Typography>

        {blue && green && (
          <Fragment>
            <Box display="flex" py={2}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Início da vigência
                </Typography>

                <Typography variant="body2">{startDate}</Typography>
              </Box>

              <Box ml={2}>
                <Typography variant="body2">Fim da vigência</Typography>

                <Box display="flex" alignItems="center">
                  <Tooltip
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "warning.main",
                          color: "warning.contrastText",
                          "& .MuiTooltip-arrow": {
                            color: "warning.main",
                          },
                        },
                      },
                      popper: {
                        sx: {
                          zIndex: 0,
                        },
                      },
                    }}
                    arrow
                    placement="right"
                    title="Vencida"
                    open={isTooltipOpen}
                  >
                    <Typography
                      variant="body2"
                      {...(overdue && { color: "warning.main" })}
                    >
                      {endDate}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: "primary.main",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>Modalidade</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      Posto tatrifário
                    </TableCell>

                    <Tooltip
                      arrow
                      placement="top"
                      title="Tarifa de uso do sistema de distribuição"
                    >
                      <TableCell align="right" sx={{ color: "white" }}>TUSD R$/kW</TableCell>
                    </Tooltip>

                    <Tooltip
                      arrow
                      placement="top"
                      title="Tarifa de uso do sistema de distribuição"
                    >
                      <TableCell align="right" sx={{ color: "white" }}>TUSD R$/MWh</TableCell>
                    </Tooltip>
                    <Tooltip arrow placement="top" title="Tarifa de energia">
                      <TableCell align="right" sx={{ color: "white" }}>TE R$/MWh</TableCell>
                    </Tooltip>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell
                      rowSpan={2}
                      sx={{
                        backgroundColor: "RGBA(10, 92, 103, 0.12)",
                      }}
                    >
                      Azul
                    </TableCell>
                    <TableCell>Ponta</TableCell>

                    <TableCell align="right">{blue.peakTusdInReaisPerKw}</TableCell>
                    <TableCell align="right">{blue.peakTusdInReaisPerMwh}</TableCell>
                    <TableCell align="right">{blue.peakTeInReaisPerMwh}</TableCell>
                  </TableRow>

                  <TableRow
                    sx={{
                      backgroundColor: "RGBA(10, 92, 103, 0.12)",
                    }}
                  >
                    <TableCell>Fora ponta</TableCell>

                    <TableCell align="right">{blue.offPeakTusdInReaisPerKw}</TableCell>
                    <TableCell align="right">{blue.offPeakTusdInReaisPerMwh}</TableCell>
                    <TableCell align="right">{blue.offPeakTeInReaisPerMwh}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      rowSpan={3}
                      sx={{
                        backgroundColor: "RGBA(10, 92, 103, 0.12)",
                      }}
                    >
                      Verde
                    </TableCell>
                    <TableCell>NA</TableCell>

                    <TableCell align="right">{green.naTusdInReaisPerKw}</TableCell>
                    <TableCell align="right">-</TableCell>
                    <TableCell align="right">-</TableCell>
                  </TableRow>

                  <TableRow
                    sx={{
                      backgroundColor: "RGBA(10, 92, 103, 0.12)",
                    }}
                  >
                    <TableCell>Ponta</TableCell>

                    <TableCell align="right">-</TableCell>
                    <TableCell align="right">{green.peakTusdInReaisPerMwh}</TableCell>
                    <TableCell align="right">{green.peakTeInReaisPerMwh}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Fora ponta</TableCell>

                    
                    <TableCell align="right">-</TableCell>
                    <TableCell align="right">{green.offPeakTusdInReaisPerMwh}</TableCell>
                    <TableCell align="right">{green.offPeakTeInReaisPerMwh}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Fragment>
        )}
      </CardContent>

      <Divider />

      <CardActions>
        {blue && green ? (
          <Button onClick={handleOnEditTariffButtonClick}>Editar</Button>
        ) : (
          <Button
            variant="contained"
            color="warning"
            disableElevation
            startIcon={<WarningRounded />}
            onClick={handleOnCreateTariffButtonClick}
          >
            Lançar tarifas
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default DistributorContentTariffsTable;
