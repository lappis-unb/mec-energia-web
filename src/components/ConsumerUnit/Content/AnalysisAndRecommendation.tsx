import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { WarningAmberOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";
import {
  useGetContractQuery,
  useRecommendationQuery,
  useRecommendationSettingsQuery,
} from "@/api";

import { BaseCostComparisonCard } from "@/templates/Analysis/BaseCostComparisonCard";
import { MeasuredDemandPlot } from "@/templates/Analysis/MeasuredDemandPlot";
import { RecommendationCard } from "@/templates/Analysis/RecommendationCard";
import { AverageConsumptionPlot } from "@/templates/Analysis/AverageConsumptionPlot";

import {
  selectActiveConsumerUnitId,
  setActiveSubgroup,
  setConsumerUnitInvoiceActiveFilter,
  setConsumerUnitOpenedTab,
} from "@/store/appSlice";
import { DetailedAnalysisDrawer } from "@/templates/Analysis/DetailedAnalysisDrawer";
import { monthYearForPlot } from "@/utils/date";
import { ErrorCode } from "@/api/Enums";

import "./configChartjs";

export const AnalysisAndRecommendation = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: recommendation, isLoading } = useRecommendationQuery(
    consumerUnitId ?? skipToken
  );
  const { data: recommendationSettings } = useRecommendationSettingsQuery();
  const [isDetailedAnalysisOpen, setIsDetailedAnalysisOpen] = useState(false);

  const { data: contract } = useGetContractQuery(consumerUnitId || skipToken);

  if (isLoading || !recommendation || !recommendationSettings)
    return (
      <Box>
        <Grid container>
          <Grid item>
            <Typography sx={{ color: "gray" }}>Carregando...</Typography>
          </Grid>
        </Grid>
      </Box>
    );

  const dates = recommendation.dates.map((d) => monthYearForPlot(d));
  const hasErrors = !!recommendation && recommendation.errors.length > 0;
  const hasWarnings = !!recommendation && recommendation.warnings.length > 0;

  const {
    MINIMUM_ENERGY_BILLS_FOR_RECOMMENDATION,
    MINIMUM_PERCENTAGE_DIFFERENCE_FOR_CONTRACT_RENOVATION,
  } = recommendationSettings;

  const hasMinimumEnergyBills =
    recommendation.energyBillsCount >= MINIMUM_ENERGY_BILLS_FOR_RECOMMENDATION;

  const hasRecommendation = recommendation.recommendedContract ? true : false;

  return (
    <Box>
      {(hasErrors || hasWarnings) && (
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {recommendation.errors.map(([code, msg], i) => (
            <Grid key={i} item xs={12}>
              <Alert
                key={i}
                severity="warning"
                variant="filled"
                icon={<WarningAmberOutlined style={{ color: "#000" }} />}
                onClick={() => {
                  if (code == ErrorCode.TariffsNotFoundError) {
                    dispatch(setActiveSubgroup(contract?.subgroup || null));
                    router.push(`/distribuidoras/${contract?.distributor}`);
                  } else if (
                    code == ErrorCode.NotEnoughEnergyBills ||
                    code == ErrorCode.NotEnoughEnergyBillsWithAtypical
                  ) {
                    dispatch(setConsumerUnitOpenedTab(0));
                    dispatch(setConsumerUnitInvoiceActiveFilter("pending"));
                  }
                }}
                sx={{ cursor: "pointer", whiteSpace: "pre-line" }}
              >
                {msg}
              </Alert>
            </Grid>
          ))}
          {recommendation.warnings.map(([code, msg], i) => (
            <Grid key={i} item xs={12}>
              <Alert
                onClick={() => {
                  if (code == ErrorCode.PendingBillsWarnning) {
                    dispatch(setConsumerUnitOpenedTab(0));
                    dispatch(setConsumerUnitInvoiceActiveFilter("pending"));
                  } else if (code == ErrorCode.ExpiredTariffWarnning) {
                    dispatch(setActiveSubgroup(contract?.subgroup || null));
                    router.push(`/distribuidoras/${contract?.distributor}`);
                  }
                }}
                sx={{ cursor: "pointer" }}
                severity="info"
                variant="outlined"
              >
                {msg}
              </Alert>
            </Grid>
          ))}
        </Grid>
      )}

      {hasRecommendation && !hasErrors && (
        <Button
          sx={{ my: 1 }}
          variant="contained"
          onClick={() => setIsDetailedAnalysisOpen(true)}
        >
          Ver análise detalhada
        </Button>
      )}

      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="stretch"
        justifyContent="center"
      >
        <Grid item xs={4}>
          <RecommendationCard
            recommendation={recommendation}
            hasErrors={hasErrors}
            minimumPercentageForContractRenovation={
              MINIMUM_PERCENTAGE_DIFFERENCE_FOR_CONTRACT_RENOVATION
            }
          />
        </Grid>

        <Grid item xs={8}>
          <BaseCostComparisonCard
            dates={dates}
            recommendation={recommendation}
            hasErrors={hasErrors}
            hasRecommendation={hasRecommendation}
          />
        </Grid>

        <Grid item xs={6}>
          <Card style={{ minHeight: "100%" }}>
            <CardContent>
              <Typography variant="h5">Consumo medido</Typography>
              <Typography variant="body2" sx={{ color: "gray" }} mb={2}>
                Últimos 12 meses
              </Typography>

              <AverageConsumptionPlot
                dates={dates}
                data={{
                  peakConsumptionInKwh:
                    recommendation.consumptionHistoryPlot.peakConsumptionInKwh,
                  offPeakConsumptionInKwh:
                    recommendation.consumptionHistoryPlot
                      .offPeakConsumptionInKwh,
                }}
                isGreen={recommendation.currentContract.tariffFlag === "G"}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} style={{ height: "100%" }}>
          <Card>
            <CardContent>
              <Typography variant="h5">{"Demanda medida - carga"}</Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Últimos 12 meses
              </Typography>

              <MeasuredDemandPlot
                dates={dates}
                recommendation={recommendation}
                isGreen={recommendation.currentContract.tariffFlag === "G"}
                isDetailedAnalysis={false}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!hasErrors && hasMinimumEnergyBills && (
        <DetailedAnalysisDrawer
          open={isDetailedAnalysisOpen}
          recommendation={recommendation}
          dates={recommendation.dates}
          recommendationSettings={recommendationSettings}
          actualContract={contract}
          onClose={() => setIsDetailedAnalysisOpen(false)}
        />
      )}
    </Box>
  );
};
