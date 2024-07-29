import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { Recommendation } from "@/types/recommendation";
import { Box, Grid, Typography } from "@mui/material";
import { tariffFlags } from "@/utils/tariff";

interface Props {
  hasErrors: boolean;
  recommendation: Recommendation | undefined;
  minimumPercentageForContractRenovation: number;
}

export const RecommendationCard = ({
  hasErrors,
  recommendation,
  minimumPercentageForContractRenovation,
}: Props) => {
  if (hasErrors)
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 1 }}>
            Recomendação
          </Typography>

          <Typography sx={{ color: "gray" }}>Indisponível</Typography>
        </CardContent>
      </Card>
    );

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Recomendação
        </Typography>

        <Grid container direction="column" spacing={2}>
          {recommendation?.shouldRenewContract ? (
            <>
              <Grid item>
                <ColoredText text="Ajustar contrato" highlighted />
              </Grid>
              <CardRecommendationItem
                label="Modalidade tarifária"
                current={tariffFlags[recommendation.currentContract.tariffFlag]}
                recommended={
                  tariffFlags[recommendation.recommendedContract.tariffFlag]
                }
              />

              {recommendation.recommendedContract.tariffFlag === "B" ? (
                <>
                  <CardRecommendationItem
                    label="Demanda contratada ponta - carga"
                    current={`${recommendation.currentContract.peakDemandInKw} kW`}
                    recommended={`${recommendation.recommendedContract.peakDemandInKw} kW`}
                  />

                  <CardRecommendationItem
                    label="Demanda contratada fora ponta - carga"
                    current={`${recommendation.currentContract.offPeakDemandInKw} kW`}
                    recommended={`${recommendation.recommendedContract.offPeakDemandInKw} kW`}
                  />
                </>
              ) : (
                <CardRecommendationItem
                  label="Demanda contratada - carga"
                  current={`${recommendation.currentContract.offPeakDemandInKw} kW`}
                  recommended={`${recommendation.recommendedContract.offPeakDemandInKw} kW`}
                />
              )}
            </>
          ) : (
            <>
              <Grid item>
                <Typography
                  variant="subtitle1"
                  sx={{
                    borderRadius: 1,
                    color: "white",
                    bgcolor: "primary.main",
                    p: 1,
                    display: "inline",
                  }}
                >
                  Manter contrato
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  A alteração de contrato só é recomendada se for identificada
                  uma economia nominal igual ou superior a{" "}
                  {minimumPercentageForContractRenovation * 100}
                  %.
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  Essa é uma margem de segurança que leva em consideração
                  possíveis mudanças no padrão de uso de energia da instituição,
                  bem como os custos operacionais relacionados ao processo de
                  alteração do contrato.
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

interface ColoredTextProps {
  text: string | undefined;
  highlighted: boolean;
}

const ColoredText = ({ text, highlighted }: ColoredTextProps) => {
  return (
    <Box>
      <Typography
        sx={{
          boxSizing: "initial",
          bgcolor: highlighted ? "warning.main" : "",
          cursor: "auto",
          borderRadius: 1,
          display: "inline",
          p: 0.5,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

interface CardRecommendationItemProps {
  label: string;
  // FIXME: só coloquei como undefined pq vem da API. Tem como mudar isso?
  current: string | undefined;
  recommended: string | undefined;
}

const CardRecommendationItem = ({
  label,
  current,
  recommended,
}: CardRecommendationItemProps) => {
  const areDifferent = current !== recommended;
  return (
    <>
      <Grid item>
        <Box>
          <Typography>{label} </Typography>
        </Box>
        <Box>
          <Grid container spacing={4}>
            <Grid item sx={{ color: "gray" }}>
              {/* FIXME: se é diferente tem que ser striked through */}
              <Typography variant="body2">Atual</Typography>
              <Typography
                sx={{ textDecoration: areDifferent ? "line-through" : "" }}
                variant="body1"
              >
                {current}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">Proposto</Typography>
              <ColoredText text={recommended} highlighted={areDifferent} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
};
