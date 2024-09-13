import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { Recommendation } from "@/types/recommendation";
import { Box, Typography } from "@mui/material";

import { useState } from "react";
import { BaseCostInfoModal } from "@/components/ConsumerUnit/Content/BaseCostInfoModal";
import { BaseCostComparisonPlot } from "./BaseCostComparisonPlot";
import { CurrentBaseCostPlot } from "./CurrentBaseCostPlot";
import { OpenBaseCostInfo } from "./DetailedAnalysisDrawer/OpenBaseCostInfo";
import { formatMoney } from "@/utils/number";

interface Props {
  dates: string[][];
  hasErrors: boolean;
  recommendation: Recommendation;
  hasRecommendation: boolean;
}

export const BaseCostComparisonCard = ({
  dates,
  hasErrors,
  recommendation,
  hasRecommendation,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const KnowMore = () => (
    <>
      {/* FIXME: tá certo colorir assim? */}
      <Typography sx={{ color: "gray" }} variant="body2">
        *O custo-base é sempre menor que do valor da fatura,{" "}
        <OpenBaseCostInfo onClick={() => setIsModalOpen(true)}>
          saiba mais
        </OpenBaseCostInfo>
        .
      </Typography>

      <BaseCostInfoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );

  if (hasErrors)
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 1 }}>
            {hasRecommendation ? "Comparativo custo-base" : "Custo-base atual"}
          </Typography>

          <Typography sx={{ color: "gray" }}>Indisponível</Typography>

          <KnowMore />
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          {" "}
          Comparativo de consumo e demanda-carga*{" "}
        </Typography>

        <Typography sx={{ color: "gray" }} variant="body2" mb={2}>
          Últimos 12 meses
        </Typography>

        {hasRecommendation ? (
          <BaseCostComparisonPlot
            recommendation={recommendation}
            dates={dates}
          />
        ) : (
          <CurrentBaseCostPlot
            displayTitle={false}
            dates={dates}
            currentContractCostsPlot={recommendation.currentContractCostsPlot}
          />
        )}

        <br />
        <Typography>
          Total atual: {formatMoney(recommendation.currentTotalCost)}
        </Typography>

        {hasRecommendation && (
          <Box>
            <Typography sx={{ display: "inline", marginRight: 0.5 }}>
              Total proposto:{" "}
              {formatMoney(
                recommendation.costsComparisonPlot
                  .totalTotalCostInReaisInRecommended
              )}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                p: 0.5,
                borderRadius: 1,
                display: "inline",
                bgcolor: "warning.main",
              }}
            >
              {recommendation.nominalSavingsPercentage.toFixed(1)}% de economia
              nominal
            </Typography>
          </Box>
        )}

        <br />
        <Typography sx={{ color: "gray" }} variant="body2">
          *Consumo e demanda de carga multiplicados pelas tarifas atuais
          cadastradas na plataforma
        </Typography>
      </CardContent>
    </Card>
  );
};
