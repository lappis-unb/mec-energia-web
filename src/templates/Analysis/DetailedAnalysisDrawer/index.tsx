import ReactToPrint from "react-to-print";
import { ReactNode, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  SxProps,
  Typography,
} from "@mui/material";
import { Recommendation, RecommendationSettings } from "@/types/recommendation";
import DropdownSection from "@/components/ConsumerUnit/Content/DropdownSection";
import DropdownSectionManager from "@/components/ConsumerUnit/Content/DropdownSectionManager";
import DetailedAnalysisHeader from "../DetailedAnalysisHeader";
import { CurrentContractTable } from "./CurrentContractTable";
import { TariffsTable } from "./TariffsTable";
import {
  getFormattedDate,
  getFormattedDateAndTime,
  monthYearForPlot,
} from "@/utils/date";
import { RecommendedContractTable } from "./RecommendedContractTable";
import { MeasuredDemandPlot } from "../MeasuredDemandPlot";
import { CurrentBaseCostPlot } from "../CurrentBaseCostPlot";
import { ConsumerUnitInfo } from "./ConsumerUnitInfo";
import { Logos } from "./Logos";
import { DetailedBaseCostsComparisonPlot } from "./DetailedBaseCostsComparisonPlot";
import { RecommendedContractDemandPlot } from "./RecommendedContractDemandPlot";
import { Summary } from "./Summary";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { AverageConsumptionPlot } from "../AverageConsumptionPlot";
import { ComparativeScenarioCurrentNewContractPlot } from "./ComparativeScenarioCurrentNewContractPlot";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { styled } from "@mui/system";
import theme from "@/theme";
import { formatToPtBrCurrency } from "@/utils/number";
import { GetContractsResponsePayload } from "@/types/contract";
import { Subtitle } from "./Subtitle";
import { Chart as ChartJs } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJs.register(ChartDataLabels);

interface Props {
  open: boolean;
  onClose: () => void;
  dates: string[];
  recommendation: Recommendation;
  recommendationSettings: RecommendationSettings;
  actualContract: GetContractsResponsePayload | undefined;
}

const GreenTitle = ({
  text,
  children,
}: {
  text?: string;
  children?: ReactNode;
}) => (
  <Typography
    color="primary"
    variant="body1"
    sx={{ fontWeight: "bold", my: 1 }}
  >
    {text ?? children}
  </Typography>
);

const TypographyBody1 = ({
  children,
  sx,
  mb = 2,
}: {
  children: ReactNode | ReactNode[];
  sx?: SxProps;
  mb?: number;
}) => (
  <Typography variant="body1" sx={{ ...sx, mb }}>
    {children}
  </Typography>
);

// const EquationListItem = ({
//   children,
//   sx,
// }: {
//   children: ReactNode;
//   sx?: SxProps;
// }) => (
//   <ListItem sx={{ ...sx }}>
//     <Typography variant="h5" sx={{ sub: { fontWeight: "normal" } }}>
//       {children}
//     </Typography>
//   </ListItem>
// );

const Bold = ({ children }: { children: ReactNode }) => (
  <Typography sx={{ fontWeight: "bold" }}>{children} </Typography>
);

export const DetailedAnalysisDrawer = ({
  onClose,
  open = false,
  dates: isoDates,
  recommendation,
  recommendationSettings,
  actualContract,
}: Props) => {
  const toPrint = useRef(null);

  const [dropdownSectionState, setDropdownSectionState] = useState({
    goal: false,
    assumptionsOfContractAnalytics: false,
    characteristicsOfConsumerUnity: false,
    actualContract: true,
    proposedContract: true,
    conclusions: true,
    glossary: false,
  });

  const [isAllSessionsOpen, setIsAllSessionsOpen] = useState<boolean | null>(
    null
  );

  const tariffStartDate = getFormattedDate(
    recommendation.tariffDates.startDate
  );
  const tariffEndDate = getFormattedDate(recommendation.tariffDates.endDate);
  const dates = isoDates.map((d) => monthYearForPlot(d));

  const consumerUnit = {
    name: recommendation.currentContract.consumerUnit,
    code: recommendation.currentContract.consumerUnitCode,
    university: recommendation.currentContract.university,
  };

  const generatedOn = getFormattedDateAndTime(
    recommendation.generatedOn,
    "dd/MM/yyyy hh:mm"
  );

  const documentPrintTitle = `Relatório MEC Energia  ${consumerUnit.name
    } ${generatedOn.replaceAll("/", "-")}`;

  const toggleSections = (isOpen: boolean) => {
    setDropdownSectionState({
      goal: isOpen,
      assumptionsOfContractAnalytics: isOpen,
      characteristicsOfConsumerUnity: isOpen,
      actualContract: isOpen,
      proposedContract: isOpen,
      conclusions: isOpen,
      glossary: isOpen,
    });
    setIsAllSessionsOpen(isOpen);
  };

  const resetSectionsState = () => {
    setDropdownSectionState({
      goal: false,
      assumptionsOfContractAnalytics: false,
      characteristicsOfConsumerUnity: false,
      actualContract: true,
      proposedContract: true,
      conclusions: true,
      glossary: false,
    });
    setIsAllSessionsOpen(null);
    onClose();
  };

  const scrollToTop = () => {
    window.location.href = "#startRecommendationPage";
  };

  const GoToTopButton = styled(IconButton)({
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      borderColor: theme.palette.primary.main,
      boxShadow: "none",
    },
  });

  const valueOldContractConsumptionDemandAboutTotal = (value: number[]) => {
    const totalCostSum = value.reduce((sum, cost) => sum + cost, 0);
    const percent =
      (totalCostSum /
        recommendation.contractsComparisonTotals.totalCostInReaisInCurrent) *
      100;

    return percent.toFixed(1).replace(".", ",");
  };

  const valueNewContractConsumptionDemandAboutTotal = (value: number[]) => {
    const totalCostSum = value.reduce((sum, cost) => sum + cost, 0);
    const percent =
      (totalCostSum /
        recommendation.contractsComparisonTotals
          .totalCostInReaisInRecommended) *
      100;

    return percent.toFixed(1).replace(".", ",");
  };

  const periodInterval = () => {
    const len = recommendation.dates.length;
    const start = recommendation.dates[0];
    const end = recommendation.dates[len - 1];

    return [
      getFormattedDate(start)?.substring(3),
      getFormattedDate(end)?.substring(3),
    ];
  };

  return (
    <Drawer open={open} onClose={resetSectionsState} anchor="bottom">
      <Box
        id="startRecommendationPage"
        sx={{
          bgcolor: "background.default",
          boxShadow: 24,
          minWidth: "800px",
        }}
      >
        <DetailedAnalysisHeader>
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <Button
              sx={{ color: "background.paper" }}
              onClick={resetSectionsState}
            >
              <CloseIcon />
            </Button>
            <Typography variant="h6" display="inline">
              Análise detalhada
            </Typography>
          </Grid>
          <Grid item>
            <ReactToPrint
              documentTitle={documentPrintTitle}
              trigger={() => (
                <Button color="secondary" variant="contained">
                  <PrintIcon />
                  Imprimir
                </Button>
              )}
              content={() => toPrint.current}
            />
          </Grid>
        </DetailedAnalysisHeader>

        <Box
          ref={toPrint}
          sx={{
            height: "100%",
            maxWidth: "800px",
            padding: 2,
            margin: "auto",
            "@media print": {
              display: "block",
              width: "100% !important",
              height: "100% !important",
              "& .dropdown-section": {
                boxShadow: "none",
              },
              "table, canvas, p": {
                breakInside: "avoid",
              },
              "& #section-anexos-i": {
                breakInside: "avoid",
              },
              "& h1, h2, h3, h4, h5": {
                breakAfter: "avoid",
              },
              // canvas: {
              //   display: "block",
              // },
            },
            "@page": {
              size: "A4 portrait",
              margin: "0.5cm 0.5cm",
            },
          }}
        >
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Typography
              textAlign="center"
              variant="h3"
              color="primary"
              sx={{ my: 4 }}
            >
              Análise do contrato de fornecimento de energia
            </Typography>

            <ConsumerUnitInfo
              consumerUnitCode={consumerUnit.code}
              consumerUnitName={consumerUnit.name}
              university={consumerUnit.university}
              generatedOn={generatedOn}
            />
            <br />
            <Logos />
            <Divider />
            <Summary />
          </Box>

          {/* botões de abrir/fechar todas seções */}
          <Box
            sx={{
              my: 2,
              display: "flex",
              justifyContent: "flex-end",
              "@media print": {
                display: "none",
              },
            }}
          >
            <Button
              onClick={() => toggleSections(true)}
              variant="outlined"
              sx={{ height: "30px", padding: "5px 8px" }}
              disabled={isAllSessionsOpen !== null ? isAllSessionsOpen : false}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="8px"
              >
                <KeyboardDoubleArrowDown />
                <Typography fontSize="14px" fontWeight={600}>
                  Abrir tudo
                </Typography>
              </Box>
            </Button>
            <Button
              onClick={() => toggleSections(false)}
              variant="outlined"
              sx={{ height: "30px", marginLeft: 2, padding: "5px 8px" }}
              disabled={isAllSessionsOpen !== null ? !isAllSessionsOpen : false}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="8px"
              >
                <KeyboardDoubleArrowUp />
                <Typography fontSize="14px" fontWeight={600}>
                  Fechar tudo
                </Typography>
              </Box>
            </Button>
          </Box>

          <DropdownSectionManager>
            <DropdownSection
              title={<Typography variant="h5">Objetivo</Typography>}
              open={dropdownSectionState.goal}
              dropdownSectionState={dropdownSectionState}
              htmlId="goal"
            >
              <TypographyBody1>
                Este relatório tem por objetivo analisar o contrato de
                fornecimento de energia elétrica da {consumerUnit.university}{" "}
                com a Distribuidora de energia por intermédio da MEPA —
                Monitoramento de Energia em Plataforma Aberta.
              </TypographyBody1>
              <TypographyBody1>
                A plataforma tem por alvo as unidades consumidoras enquadradas
                no grupo A, caracterizadas pelo fornecimento de energia elétrica
                via rede de distribuição em média tensão e faturadas por Tarifa
                Horo-Sazonal (THS) Azul ou Verde.
              </TypographyBody1>
            </DropdownSection>

            <DropdownSection
              title={
                <Typography variant="h5">
                  Premissas para análise do contrato
                </Typography>
              }
              open={dropdownSectionState.assumptionsOfContractAnalytics}
              htmlId="assumptionsOfContractAnalytics"
              dropdownSectionState={dropdownSectionState}
            >
              <Typography variant="body1">
                Para o desenvolvimento da análise de enquadramento tarifário, as
                seguintes premissas foram aplicadas:
              </Typography>

              <List dense disablePadding sx={{ my: "4px" }}>
                <ListItem>
                  ● São analisadas de forma individualizada as unidades
                  consumidoras;
                </ListItem>
                <ListItem>
                  ● São utilizados os valores de tarifas praticadas pela
                  distribuidora e cadastradas na plataforma da área de concessão
                  da unidade consumidora;
                </ListItem>
                <ListItem>
                  ● Não são considerados no cálculo os impostos, encargos
                  setoriais e bandeiras tarifárias. Ou seja, utiliza-se os
                  custos relacionados ao consumo e demanda da UC e não o valor
                  total da fatura.
                </ListItem>
              </List>

              <Typography variant="body1">
                A metodologia empregada a análise dos contratos de fornecimento
                de energia para o enquadramento tarifário das unidades
                consumidoras segue o seguinte fluxo:
              </Typography>

              <List dense sx={{ my: "4px" }}>
                <ListItem>
                  1. Lançamento de informações de demanda (kW) e consumo de
                  energia (kWh) na plataforma;
                </ListItem>
                <ListItem>
                  2. Cadastro das tarifas de energia praticadas pela
                  distribuidora;
                </ListItem>
                <ListItem>
                  3. Cálculo de otimização de contrato, baseado nos dados
                  históricos;
                </ListItem>
                <ListItem>
                  4. Geração de relatórios com recomendação de alteração do
                  contrato.
                </ListItem>
              </List>

              <TypographyBody1>
                As considerações gerais para análise dos contratos de
                fornecimento de energia e a metodologia empregada para o
                enquadramento tarifário das unidades consumidoras são
                apresentadas dentro da MEPA.
              </TypographyBody1>
            </DropdownSection>

            <DropdownSection
              htmlId="characteristicsOfConsumerUnity"
              sx={{
                "@media page": {
                  breakBefore: "always",
                  pageBreakBefore: "always",
                },
              }}
              title={
                <Typography variant="h5">
                  Características de fornecimento da Unidade Consumidora
                </Typography>
              }
              open={dropdownSectionState.characteristicsOfConsumerUnity}
              dropdownSectionState={dropdownSectionState}
            >
              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <TypographyBody1>
                  As informações em relação ao contrato de fornecimento de
                  energia elétrica celebrado pela unidade consumidora e a
                  distribuidora de energia de sua área de concessão podem ser
                  vistos na tabela 1.
                </TypographyBody1>

                <Box display="flex" flexDirection="column" marginBottom={4}>
                  <Subtitle
                    id="Tabela 1"
                    title="Informações características de fornecimento da unidade consumidora"
                  />
                  <CurrentContractTable
                    recommendationCurrentContract={
                      recommendation.currentContract
                    }
                    actualContract={actualContract}
                  />
                </Box>
              </Box>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <br />
                <TypographyBody1>
                  Na tabela 2 é possível verificar os valores das tarifas da
                  distribuidora que estão cadastradas na plataforma e são
                  utilizadas para o cálculo.
                </TypographyBody1>

                <Box marginBottom={4}>
                  <Subtitle id="Tabela 2">
                    <span>
                      Tarifas utilizadas para metodologia de cálculo
                      comparativo, com vigência de{" "}
                      <strong>{tariffStartDate}</strong> a{" "}
                      <strong>{tariffEndDate}</strong>
                    </span>
                  </Subtitle>
                  <TariffsTable rows={recommendation.tariffsTable} />
                </Box>
              </Box>
            </DropdownSection>

            <DropdownSection
              htmlId="actualContract"
              sx={{
                "@media print": {
                  breakBefore: "always",
                  // Por algum motivo só funciona com essa regra que foi deprecada
                  pageBreakBefore: "always",
                },
              }}
              title={<Typography variant="h5">Contrato atual</Typography>}
              open={dropdownSectionState.actualContract}
              dropdownSectionState={dropdownSectionState}
            >
              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <Typography>
                  A Figura 1 apresenta a composição da fatura de energia
                  elétrica durante o período de {periodInterval()[0]} a{" "}
                  {periodInterval()[1]}. São considerados apenas a demanda-carga
                  e o consumo medidos nesse perído multiplicados pelas{" "}
                  <strong>tarifas atuais disponíveis na plataforma.</strong>
                </Typography>

                <Box mt={4} mb={4}>
                  <Subtitle
                    id="Figura 1"
                    title="Representação da composição da fatura de energia elétrica da unidade consumidora"
                  />
                  <CurrentBaseCostPlot
                    dates={dates}
                    currentContractCostsPlot={
                      recommendation.currentContractCostsPlot
                    }
                  />
                </Box>
              </Box>

              <Box
                sx={{ "@media print": { breakInside: "avoid" } }}
                my={4}
                display="flex"
                flexDirection="column"
              >
                <Typography>
                  O valor de consumo contribuiu com{" "}
                  {valueOldContractConsumptionDemandAboutTotal(
                    recommendation.currentContractCostsPlot
                      .consumptionCostInReais
                  )}
                  % do valor total, enquanto a demanda-carga correspondeu a{" "}
                  {valueOldContractConsumptionDemandAboutTotal(
                    recommendation.currentContractCostsPlot.demandCostInReais
                  )}
                  % do mesmo valor.
                </Typography>
                <br />
                <Typography>
                  Na figura 2 é mostrado o perfil de consumo da unidade
                  consumidora{" "}
                  {recommendation.currentContract.tariffFlag === "B"
                    ? "com os valores na ponta e fora de ponta."
                    : "."}
                </Typography>

                <Box mt={2} mb={4}>
                  <Subtitle
                    id="Figura 2"
                    title="Consumo medido nos horários de ponta e fora de ponta"
                  />
                  <AverageConsumptionPlot
                    dates={dates}
                    data={{
                      peakConsumptionInKwh:
                        recommendation.consumptionHistoryPlot
                          .peakConsumptionInKwh,
                      offPeakConsumptionInKwh:
                        recommendation.consumptionHistoryPlot
                          .offPeakConsumptionInKwh,
                    }}
                    isGreen={recommendation.currentContract.tariffFlag === "G"}
                  />
                </Box>
              </Box>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <Typography>
                  O gráfico da Figura 3 apresenta de forma consolidada a
                  comparação entre os valores de demanda contratada - carga da
                  unidade consumidora quando comparada com a demanda medida -
                  carga nos horários de ponta e fora de ponta.
                </Typography>

                <MeasuredDemandPlot
                  dates={dates}
                  recommendation={recommendation}
                  isGreen={recommendation.currentContract.tariffFlag === "G"}
                  isDetailedAnalysis={true}
                />
              </Box>
            </DropdownSection>

            <DropdownSection
              htmlId="proposedContract"
              sx={{ "@media print": { breakInside: "avoid" } }}
              title={<Typography variant="h5">Contrato proposto</Typography>}
              open={dropdownSectionState.proposedContract}
              dropdownSectionState={dropdownSectionState}
            >
              <TypographyBody1>
                A Figura 4 apresenta uma comparação entre os valores de
                demanda-carga do contrato proposto e demanda medida - carga nos
                horários de ponta e fora de ponta para a unidade consumidora.
              </TypographyBody1>

              <Box mt={4} mb={4}>
                <Subtitle
                  id="Figura 4"
                  title="Gráfico comparativo entre a demanda proposta - carga e os valores medidos nos horários de ponta e fora de ponta"
                />
                <RecommendedContractDemandPlot
                  dates={dates}
                  recommendation={recommendation}
                  isGreen={recommendation.currentContract.tariffFlag === "G"}
                />
              </Box>

              <TypographyBody1>
                O gráfico da figura 5 mostra o valor total calculado
                considerando as condições referentes ao novo contrato proposto.
                Neste cenário, o valor de consumo contribui com{" "}
                {valueNewContractConsumptionDemandAboutTotal(
                  recommendation.detailedContractsCostsComparisonPlot
                    .consumptionCostInReaisInRecommended
                )}
                % do valor total, enquanto a demanda-carga corresponde a{" "}
                {valueNewContractConsumptionDemandAboutTotal(
                  recommendation.detailedContractsCostsComparisonPlot
                    .demandCostInReaisInRecommended
                )}
                % do mesmo valor.
              </TypographyBody1>

              <Box mt={4} mb={4}>
                <Subtitle
                  id="Figura 5"
                  title="Gráfico dos valores de consumo e demanda-carga em reais considerando as condições de contrato propostas"
                />
                <DetailedBaseCostsComparisonPlot
                  dates={dates}
                  costs={recommendation.detailedContractsCostsComparisonPlot}
                />
              </Box>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <TypographyBody1>
                  Por fim, o gráfico da figura 6 apresenta o comparativo do
                  cenário atual de contrato e os valores calculados considerando
                  a nova proposição.
                </TypographyBody1>

                <Box mt={4} mb={4}>
                  <Subtitle
                    id="Figura 6"
                    title="Gráfico comparativo considerando o contrato atual e o contrato proposto"
                  />
                  <ComparativeScenarioCurrentNewContractPlot
                    dates={dates}
                    costs={recommendation.detailedContractsCostsComparisonPlot}
                  />
                </Box>
              </Box>

              <Alert
                variant="filled"
                severity="info"
                sx={{ bgcolor: "#242a8e", fontWeight: "normal", mt: 4 }}
              >
                <AlertTitle>
                  Redução estimada:{" "}
                  {recommendation.nominalSavingsPercentage.toFixed(2)}%
                </AlertTitle>
                O contrato proposto estima uma redução de R$
                {formatToPtBrCurrency(
                  recommendation.contractsComparisonTotals.absoluteDifference,
                  2
                )}{" "}
                nos custos, em comparação à demanda-carga e ao consumo medidos
                no período de análise multiplicados pelas{" "}
                <strong>tarifas atuais disponíveis na plataforma.</strong>
              </Alert>
            </DropdownSection>

            <DropdownSection
              htmlId="conclusions"
              sx={{ "@media print": { breakInside: "avoid" } }}
              title={
                <>
                  <Typography variant="h5"> Conclusões </Typography>
                </>
              }
              open={dropdownSectionState.conclusions}
              dropdownSectionState={dropdownSectionState}
            >
              <TypographyBody1>
                A partir de análises do perfil de demanda e consumo de energia
                elétrica da unidade consumidora, propõe-se ajustes no contrato,
                considerando os valores indicados na tabela 3.
              </TypographyBody1>

              <Box marginBottom={4}>
                <Subtitle
                  id="Tabela 3"
                  title="Proposta para ajuste de contrato de fornecimento de energia elétrica da unidade consumidora"
                />
                <RecommendedContractTable
                  recommendedContract={recommendation.recommendedContract}
                  currentContract={recommendation.currentContract}
                />
              </Box>

              {recommendation.energyBillsCount <
                recommendationSettings.IDEAL_ENERGY_BILLS_FOR_RECOMMENDATION && (
                  <>
                    <br />
                    <Alert
                      variant="filled"
                      severity="warning"
                      sx={{ bgcolor: "rgb(217, 138, 11)", color: "#000" }}
                      icon={<WarningAmberOutlined style={{ color: "#000" }} />}
                    >
                      Uma ou mais faturas estão indisponíveis. Isso reduz a
                      precisão da análise.
                    </Alert>
                  </>
                )}
            </DropdownSection>

            <DropdownSection
              title={<Typography variant="h5">Glossário</Typography>}
              open={dropdownSectionState.glossary}
              htmlId="glossary"
              dropdownSectionState={dropdownSectionState}
            >
              <TypographyBody1>
                Esta seção apresenta todos os termos técnicos relevantes,
                baseados na Resolução Normativa ANEEL n° 1000, de 7 de dezembro
                de 2021.
              </TypographyBody1>

              <GreenTitle text="Ciclo de faturamento" />
              <TypographyBody1>
                Período correspondente ao faturamento de determinada unidade
                consumidora.
              </TypographyBody1>

              <GreenTitle text="Concessionária" />
              <TypographyBody1>
                Agente titular de concessão federal para prestar o serviço
                público de distribuição de energia elétrica, doravante
                denominado &ldquo;distribuidora&rdquo;.
              </TypographyBody1>

              <GreenTitle text="Consumidor" />
              <TypographyBody1>
                Pessoa física ou jurídica, de direito público ou privado,
                legalmente representada, que solicite o fornecimento, a
                contratação de energia ou o uso do sistema elétrico à
                distribuidora, assumindo as obrigações decorrentes deste
                atendimento à(s) sua(s) unidade(s) consumidora(s), segundo
                disposto nas normas e nos contratos.
              </TypographyBody1>

              <GreenTitle text="CUSD" />
              <TypographyBody1>
                Contrato de Uso do Sistema de Distribuição.
              </TypographyBody1>

              <GreenTitle text="Demanda" />
              <TypographyBody1>
                Média das potências elétricas ativas ou reativas, solicitadas ao
                sistema elétrico pela parcela da carga instalada em operação na
                unidade consumidora, durante um intervalo de tempo especificado,
                expressa em quilowatts (kW) e quilovolt-ampère-reativo (kvar),
                respectivamente.
              </TypographyBody1>

              <GreenTitle text="Demanda Contratada" />
              <TypographyBody1>
                Demanda de potência ativa a ser obrigatória e continuamente
                disponibilizada pela distribuidora, no ponto de entrega,
                conforme valor e período de vigência fixados em contrato, e que
                deve ser integralmente paga, seja ou não utilizada durante o
                período de faturamento, expressa em quilowatts (kW).
              </TypographyBody1>

              <GreenTitle text="Demanda faturável" />
              <TypographyBody1>
                Valor da demanda de potência ativa, considerada para fins de
                faturamento, com aplicação da respectiva tarifa, expressa em
                quilowatts (kW).
              </TypographyBody1>

              <GreenTitle>
                <span>
                  Demanda<sub>G</sub>
                </span>
              </GreenTitle>
              <TypographyBody1>
                Demanda de injeção de geração a ser atendida ou acrescida, em
                quilowatt (kW).
              </TypographyBody1>

              <GreenTitle text="Demanda medida" />
              <TypographyBody1>
                Maior demanda de potência ativa, verificada por medição,
                integralizada em intervalos de 15 (quinze) minutos durante o
                período de faturamento.
              </TypographyBody1>

              <GreenTitle text="Distribuidora" />
              <TypographyBody1>
                Agente titular de concessão ou permissão federal para prestar o
                serviço público de distribuição de energia elétrica.
              </TypographyBody1>

              <GreenTitle text="Estrutura tarifária" />
              <TypographyBody1>
                Conjunto de tarifas, aplicadas ao faturamento do mercado de
                distribuição de energia elétrica, que refletem a diferenciação
                relativa dos custos regulatórios da distribuidora entre os
                subgrupos, classes e subclasses tarifárias, de acordo com as
                modalidades e postos tarifários.
              </TypographyBody1>

              <GreenTitle text="Fatura" />
              <TypographyBody1>
                Documento comercial que apresenta a quantia monetária total que
                deve ser paga pelo consumidor à distribuidora, em função do
                fornecimento de energia elétrica, da conexão e uso do sistema ou
                da prestação de serviços, devendo especificar claramente os
                serviços fornecidos, a respectiva quantidade, tarifa e período
                de faturamento.
              </TypographyBody1>

              <GreenTitle text="Grupo A" />
              <TypographyBody1 mb={0}>
                Grupamento composto de unidades consumidoras com fornecimento em
                tensão igual ou superior a 2,3 kV, ou atendidas a partir de
                sistema subterrâneo de distribuição em tensão secundária,
                caracterizado pela tarifa binômia e subdividido nos seguintes
                subgrupos:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  <Bold>● subgrupo A1</Bold> - tensão de fornecimento igual ou
                  superior a 230 kV;
                </ListItem>
                <ListItem>
                  <Bold>● subgrupo A2</Bold> - tensão de fornecimento de 88 kV a
                  138 kV;
                </ListItem>
                <ListItem>
                  <Bold>● subgrupo A3</Bold> - tensão de fornecimento de 69 kV;
                </ListItem>
                <ListItem>
                  <Bold>● subgrupo A3a</Bold> - tensão de fornecimento de 30 kV
                  a 44 kV;
                </ListItem>
                <ListItem>
                  <Bold>● subgrupo A4</Bold> - tensão de fornecimento de 2,3 kV
                  a 25 kV;
                </ListItem>
                <ListItem>
                  <span>
                    <strong>● subgrupo AS</strong> - tensão de fornecimento
                    inferior a 2,3 kV, a partir de sistema subterrâneo de
                    distribuição.
                  </span>
                </ListItem>
              </List>

              <GreenTitle text="Grupo B" />
              <TypographyBody1 mb={0}>
                Grupamento composto de unidades consumidoras com fornecimento em
                tensão inferior a 2,3 kV, caracterizado pela tarifa monômia e
                subdividido nos seguintes subgrupos:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  <Bold>● subgrupo B1</Bold> - residencial;
                </ListItem>
                <ListItem>
                  <Bold>● subgrupo B2</Bold> - rural;
                </ListItem>
                <ListItem>
                  <Bold>● subgrupo B3</Bold> - demais classes;
                </ListItem>
                <ListItem>
                  <Bold>● subgrupo B4</Bold> - iluminação pública.
                </ListItem>
              </List>

              <GreenTitle text="Modalidade tarifária" />
              <TypographyBody1>
                Conjunto de tarifas aplicáveis às componentes de consumo de
                energia elétrica e demanda de potência ativas.
              </TypographyBody1>

              <GreenTitle text="Modalidade tarifária horária azul" />
              <TypographyBody1>
                Aplicada às unidades consumidoras do grupo A, caracterizada por
                tarifas diferenciadas de consumo de energia elétrica e de
                demanda de potência, de acordo com as horas de utilização do
                dia.
              </TypographyBody1>

              <GreenTitle text="Modalidade tarifária horária verde" />
              <TypographyBody1>
                Aplicada às unidades consumidoras do grupo A, caracterizada por
                tarifas diferenciadas de consumo de energia elétrica, de acordo
                com as horas de utilização do dia, assim como de uma única
                tarifa de demanda de potência.
              </TypographyBody1>

              <GreenTitle text="Posto tarifário" />
              <TypographyBody1 mb={0}>
                Período em horas para aplicação das tarifas de forma
                diferenciada ao longo do dia, considerando a seguinte divisão:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  <span>
                    ● <strong>Posto tarifário ponta</strong> - período composto
                    por 3 (três) horas diárias consecutivas definidas pela
                    distribuidora considerando a curva de carga de seu sistema
                    elétrico, aprovado pela ANEEL para toda a área de concessão
                    ou permissão;
                  </span>
                </ListItem>
                <ListItem>
                  <span>
                    ● <strong>Posto tarifário fora de ponta</strong> - período
                    composto pelo conjunto das horas diárias consecutivas e
                    complementares àquelas definidas nos postos ponta.
                  </span>
                </ListItem>
              </List>

              <GreenTitle text="Tarifa" />
              <TypographyBody1 mb={0}>
                Valor monetário estabelecido pela ANEEL, fixado em R$ (reais)
                por unidade de energia elétrica ativa ou da demanda de potência
                ativa, sendo:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  <span>
                    ● <strong>Tarifa de energia (TE)</strong> - valor monetário
                    unitário determinado pela ANEEL, em R$/MWh, utilizado para
                    efetuar o faturamento mensal referente ao consumo de
                    energia;
                  </span>
                </ListItem>
                <ListItem>
                  <span>
                    ●{" "}
                    <strong>
                      Tarifa de uso do sistema de distribuição (TUSD)
                    </strong>{" "}
                    - valor monetário unitário determinado pela ANEEL, em R$/MWh
                    ou em R$/kW, utilizado para efetuar o faturamento mensal de
                    usuários do sistema de distribuição de energia elétrica pelo
                    uso do sistema.
                  </span>
                </ListItem>
                <ListItem>
                  <Bold>
                    ● TUSD<sub>G</sub>
                  </Bold>
                  &nbsp;- tarifa de uso do sistema de distribuição aplicável à
                  cenral geradora.
                </ListItem>
              </List>

              <GreenTitle text="Tensão primária de distribuição" />
              <TypographyBody1>
                Tensão disponibilizada no sistema elétrico da distribuidora, com
                valores padronizados iguais ou superiores a 2,3 kV.
              </TypographyBody1>

              <GreenTitle text="Unidade consumidora" />
              <TypographyBody1>
                Conjunto composto por instalações, ramal de entrada,
                equipamentos elétricos, condutores e acessórios, incluída a
                subestação, quando do fornecimento em tensão primária,
                caracterizado pelo recebimento de energia elétrica em apenas um
                ponto de entrega, com medição individualizada, correspondente a
                um único consumidor e localizado em uma mesma propriedade ou em
                propriedades contíguas.
              </TypographyBody1>
            </DropdownSection>
          </DropdownSectionManager>
        </Box>

        <Box
          mx="auto"
          maxWidth="900px"
          display="flex"
          justifyContent="flex-end"
        >
          <Box
            sx={{
              bottom: "40px",
              position: "fixed",
              "@media (max-width: 500px)": {
                width: "110px",
                position: "relative",
                marginTop: "16px",
              },
            }}
          >
            <GoToTopButton
              color="primary"
              size="large"
              sx={{
                "@media print": { display: "none" },
                //bgcolor: "primary.main",
                color: "#fff",
                zIndex: 1,
                cursor: "pointer",
              }}
              onClick={scrollToTop}
            >
              <ArrowUpwardRoundedIcon />
            </GoToTopButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

// const ColoredText = ({
//   children,
//   color,
// }: {
//   children: ReactNode;
//   color: string;
// }) => {
//   return (
//     <Typography
//       variant="h5"
//       sx={{
//         boxSizing: "initial",
//         display: "inline",
//         bgcolor: color,
//         color: color === "primary.main" ? "background.paper" : "#000",
//         borderRadius: 1,
//         p: 0.5,
//       }}
//     >
//       {children}
//     </Typography>
//   );
// };
