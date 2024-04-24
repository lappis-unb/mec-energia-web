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
import { GreenAndBluePercentilesPlot } from "./GreenAndBluePercentilesPlot";
import { TariffsTable } from "./TariffsTable";
import {
  getFormattedDate,
  getFormattedDateAndTime,
  monthYearForPlot,
} from "@/utils/date";
import { RecommendedContractTable } from "./RecommendedContractTable";
import { ConsumptionHistoryTable } from "./ConsumptionHistoryTable";
import { MeasuredDemandPlot } from "../MeasuredDemandPlot";
import { CurrentBaseCostPlot } from "../CurrentBaseCostPlot";
import { BaseCostInfoModal } from "@/components/ConsumerUnit/Content/BaseCostInfoModal";
import { ConsumerUnitInfo } from "./ConsumerUnitInfo";
import { Logos } from "./Logos";
import { OpenBaseCostInfo } from "./OpenBaseCostInfo";
import { ContractsComparisonTable } from "./ContractsComparisonTable";
import { BaseCostComparisonTable } from "./BaseCostComparisonTable";
import { DetailedBaseCostsComparisonPlot } from "./DetailedBaseCostsComparisonPlot";
import { RecommendedContractDemandPlot } from "./RecommendedContractDemandPlot";

interface Props {
  open: boolean;
  onClose: () => void;
  dates: string[];
  recommendation: Recommendation;
  recommendationSettings: RecommendationSettings;
}

const GreenTitle = ({ text }: { text: string }) => (
  <Typography
    color="primary"
    variant="body1"
    sx={{ fontWeight: "bold", my: 1 }}
  >
    {text}
  </Typography>
);

const TypographyBody1 = ({
  children,
  sx,
}: {
  children: ReactNode | ReactNode[];
  sx?: SxProps;
}) => (
  <Typography variant="body1" sx={{ ...sx, mb: 2 }}>
    {children}
  </Typography>
);

const EquationListItem = ({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps;
}) => (
  <ListItem sx={{ ...sx }}>
    <Typography variant="h5" sx={{ sub: { fontWeight: "normal" } }}>
      {children}
    </Typography>
  </ListItem>
);

const Bold = ({ children }: { children: ReactNode }) => (
  <Typography sx={{ fontWeight: "bold" }}>{children} </Typography>
);

export const DetailedAnalysisDrawer = ({
  onClose,
  open = false,
  dates: isoDates,
  recommendation,
  recommendationSettings,
}: Props) => {
  const toPrint = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const generatedOn = getFormattedDateAndTime(recommendation.generatedOn);

  const documentPrintTitle = `Relatório MEC Energia  ${consumerUnit.name
    } ${generatedOn.replaceAll("/", "-")}`;

  const isRecommendationGreen =
    recommendation.recommendedContract.tariffFlag === "G";

  return (
    <Drawer open={open} onClose={onClose} anchor="bottom">
      <Box
        sx={{
          bgcolor: "background.default",
          boxShadow: 24,
        }}
      >
        <DetailedAnalysisHeader>
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <Button sx={{ color: "background.paper" }} onClick={onClose}>
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
            width: "55%",
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
          </Box>

          {/* NOTE: adicionar funcionalidade de abrir/fechar todas seções */}
          {/* <Box
            sx={{
              my: 2,
              display: "flex",
              justifyContent: "flex-end",
              "@media print": {
                display: "none",
              },
            }}
          >
            <Button disabled variant="outlined">
              <KeyboardDoubleArrowDown />
              Abrir tudo
            </Button>
            <Button disabled variant="outlined" sx={{ marginLeft: 2 }}>
              <KeyboardDoubleArrowUp />
              Fechar tudo
            </Button>
          </Box> */}

          <DropdownSectionManager>
            <DropdownSection
              title={<Typography variant="h5">Definições</Typography>}
              open
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

              <GreenTitle text="Consumidor" />
              <TypographyBody1>
                Pessoa física ou jurídica, de direito público ou privado,
                legalmente representada, que solicite o fornecimento, a
                contratação de energia ou o uso do sistema elétrico à
                distribuidora, assumindo as obrigações decorrentes deste
                atendimento à(s) sua(s) unidade(s) consumidora(s), segundo
                disposto nas normas e nos contratos.
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
              <TypographyBody1>
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
                  <Bold>● subgrupo AS</Bold> - tensão de fornecimento inferior a
                  2,3 kV, a partir de sistema subterrâneo de distribuição.
                </ListItem>
              </List>

              <GreenTitle text="Grupo B" />
              <TypographyBody1>
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
              <TypographyBody1>
                Período em horas para aplicação das tarifas de forma
                diferenciada ao longo do dia, considerando a seguinte divisão:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  ● Posto tarifário ponta - período composto por 3 (três) horas
                  diárias consecutivas definidas pela distribuidora considerando
                  a curva de carga de seu sistema elétrico, aprovado pela ANEEL
                  para toda a área de concessão ou permissão;
                </ListItem>
                <ListItem>
                  ● Posto tarifário fora de ponta - período composto pelo
                  conjunto das horas diárias consecutivas e complementares
                  àquelas definidas nos postos ponta.
                </ListItem>
              </List>

              <GreenTitle text="Tarifa" />
              <TypographyBody1>
                Valor monetário estabelecido pela ANEEL, fixado em R$ (reais)
                por unidade de energia elétrica ativa ou da demanda de potência
                ativa, sendo:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  ● Tarifa de energia (TE) - valor monetário unitário
                  determinado pela ANEEL, em R$/MWh, utilizado para efetuar o
                  faturamento mensal referente ao consumo de energia;
                </ListItem>
                <ListItem>
                  ● Tarifa de uso do sistema de distribuição (TUSD) - valor
                  monetário unitário determinado pela ANEEL, em R$/MWh ou em
                  R$/kW, utilizado para efetuar o faturamento mensal de usuários
                  do sistema de distribuição de energia elétrica pelo uso do
                  sistema.
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

            <DropdownSection
              title={<Typography variant="h5">Objetivo</Typography>}
              open
            >
              <TypographyBody1>
                Analisar o contrato de fornecimento de energia elétrica desta
                unidade consumidora com a distribuidora de energia local.
              </TypographyBody1>
              <TypographyBody1>
                Esta unidade consumidora se enquadrada no Grupo A, caracterizado
                pelo fornecimento de energia elétrica via rede de distribuição
                em média tensão e faturado por Tarifa Horo-Sazonal (THS) Azul ou
                Verde.
              </TypographyBody1>
            </DropdownSection>

            <DropdownSection
              title={<Typography variant="h5">Considerações gerais</Typography>}
              open
            >
              <List dense disablePadding>
                <ListItem>
                  ● Foram consideradas as faturas dos últimos 12 meses
                  disponíveis no sistema para esta unidade consumidora.
                </ListItem>
                <ListItem>
                  ● Não foram consideradas as faturas que a equipe responsável
                  pela entrada de dados indicou para exclusão da análise.
                </ListItem>
                <ListItem>
                  ● Foram utilizados os valores de tarifas vigentes disponíveis
                  no sistema na data de geração deste estudo, correspondentes à
                  distribuidora indicada no contrato desta unidade consumidora.
                </ListItem>
                <ListItem>
                  ● Foram considerados apenas os valores relacionados ao consumo
                  e à demanda para a análise entre os cenários.
                </ListItem>
                <ListItem>
                  ● Não foi considerado o valor total das faturas porque costuma
                  incluir tributos, encargos setoriais, bandeiras tarifárias e
                  cobranças adicionais que dificultariam a análise.
                </ListItem>
                <ListItem>
                  ● Foi aplicado o conceito de “custo-base” em substituição ao
                  valor das faturas. O custo-base é calculado multiplicando o
                  consumo medido (ou a demanda medida) pelas tarifas vigentes.
                </ListItem>
                <ListItem>
                  ● Foi utilizada a “economia nominal” como medida de eficácia
                  da recomendação. A economia nominal é calculada comparando o
                  custo-base total dos últimos 12 meses com o total projetado
                  para o novo contrato no mesmo período.
                </ListItem>
                <ListItem>
                  ● A alteração de contrato só é recomendada se a economia
                  nominal for igual ou superior a{" "}
                  {
                    recommendationSettings.MINIMUM_PERCENTAGE_DIFFERENCE_FOR_CONTRACT_RENOVATION
                  }
                  %. Essa é uma margem de segurança que leva em consideração
                  possíveis mudanças no padrão de uso de energia da instituição,
                  bem como os custos operacionais relacionados ao processo de
                  alteração do contrato.
                </ListItem>
              </List>
              <TypographyBody1>
                Considerações gerais para análise, conforme Resolução Normativa
                ANEEL nº 1.000, de 7 de dezembro de 2021:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  1. Consumidores do grupo A, inclusive cada unidade consumidora
                  que integre comunhão de interesses de fato ou de direito de
                  consumidores especiais e outros usuários: a demanda mínima
                  contratada é 30 kW.
                </ListItem>
                <ListItem>
                  2. A unidade consumidora do grupo A deve ser enquadrada nas
                  seguintes modalidades tarifárias:
                </ListItem>
                <ListItem>
                  2.1. No caso de tensão de conexão maior ou igual a 69 kV:
                  horária azul; e
                </ListItem>
                <ListItem>
                  2.2. No caso de tensão de conexão menor que 69 kV: horária
                  azul ou verde, de acordo com a opção do consumidor.
                </ListItem>
              </List>
            </DropdownSection>

            <DropdownSection
              title={
                <Typography variant="h5">Metodologia de Cálculo</Typography>
              }
              open
            >
              <TypographyBody1>
                Para a apresentação de proposta de análise ddo contrato de
                fornecimento de energia é necessária a avaliação de consumo da
                unidade consumidora. O ideal é que seja feita a apreciação de
                faturas de 12 meses, o que representa um ano fiscal e o perfil
                de consumo da unidade.
              </TypographyBody1>

              <TypographyBody1>As grandezas monitoradas são:</TypographyBody1>

              <List dense>
                <ListItem>● Tensão de fornecimento;</ListItem>
                <ListItem>● Consumo ponta;</ListItem>
                <ListItem>● Consumo fora ponta;</ListItem>
                <ListItem>● Demanda medida ponta;</ListItem>
                <ListItem>● Demanda medida fora de ponta.</ListItem>
              </List>

              <GreenTitle text="Tarifa na modalidade horária azul" />
              <TypographyBody1>
                A fatura de energia elétrica dos consumidores enquadrados na
                modalidade tarifária horária azul é composta da soma de parcelas
                referentes ao consumo e à demanda, de acordo com o horário do
                dia. Os cálculos efetuados para obter os custos neste cenário
                são:
              </TypographyBody1>

              <List>
                <EquationListItem>
                  V<sub>consumo</sub> = T<sub>cp</sub> Cp + T<sub>cfp</sub> C
                  <sub>fp</sub>
                </EquationListItem>
                <EquationListItem>
                  V<sub>demanda</sub> = T<sub>dp</sub> D<sub>p</sub> + T
                  <sub>dfp</sub> D<sub>fp</sub> + 3T<sub>dp</sub>U<sub>p</sub>+
                  3T<sub>dfp</sub> U<sub>fp</sub>
                </EquationListItem>
                <EquationListItem>
                  V<sub>ultrapassagem</sub> = 3T<sub>dp</sub>U<sub>p</sub> + 3T
                  <sub>dfp</sub>U<sub>fp</sub>
                </EquationListItem>
              </List>

              <TypographyBody1>Em que:</TypographyBody1>

              <List dense>
                <ListItem>
                  V<sub>consumo</sub> = Valor total de consumo (R$);
                </ListItem>
                <ListItem>
                  V<sub>demanda</sub> = Valor total de demanda (R$);
                </ListItem>
                <ListItem>
                  T<sub>cp</sub> = Tarifa de consumo ponta (R$/MWh);
                </ListItem>
                <ListItem>
                  T<sub>cfp</sub> = Tarifa de consumo fora de ponta (R$/MWh);
                </ListItem>
                <ListItem>
                  C<sub>p</sub> = Consumo medido ponta (MWh);
                </ListItem>
                <ListItem>
                  C<sub>fp</sub> = Consumo medido fora de ponta (MWh);
                </ListItem>
                <ListItem>
                  T<sub>dp</sub> = Tarifa de demanda ponta (R$/MW);
                </ListItem>
                <ListItem>
                  T<sub>dfp</sub> = Tarifa de demanda fora de ponta (R$/MW);
                </ListItem>
                <ListItem>
                  D<sub>p</sub> = Demanda contratada ponta (MW);
                </ListItem>
                <ListItem>
                  D<sub>fp</sub> = Demanda contratada fora de ponta (MW);
                </ListItem>
                <ListItem>
                  U<sub>p</sub> = Ultrapassagem de demanda ponta (MW);
                </ListItem>
                <ListItem>
                  U<sub>fp</sub> = Ultrapassagem de demanda fora de ponta (MW).
                </ListItem>
              </List>

              <GreenTitle text="Tarifa na modalidade horária verde" />
              <TypographyBody1>
                A fatura de energia elétrica dos consumidores enquadrados na
                modalidade tarifária horária verde é composta da soma de
                parcelas referentes ao consumo, de acordo com o horário do dia,
                e à demanda. Os cálculos efetuados para obter os custos neste
                cenário são:
              </TypographyBody1>

              <List>
                <EquationListItem>
                  V<sub>consumo</sub> = T<sub>cp</sub> C<sub>p</sub> + T
                  <sub>cfp</sub> C<sub>fp</sub>
                </EquationListItem>
                <EquationListItem>
                  V<sub>demanda</sub> = T<sub>d</sub>
                  (D<sub>p</sub> + D<sub>fp</sub>)
                </EquationListItem>
                <EquationListItem>
                  V<sub>ultrapassagem</sub> = 3T<sub>d</sub> (U<sub>p</sub> + U
                  <sub>fp</sub>)
                </EquationListItem>
              </List>

              <Typography>Em que:</Typography>

              <List dense>
                <ListItem>
                  V<sub>consumo</sub> = Valor total de consumo (R$);
                </ListItem>
                <ListItem>
                  V<sub>demanda</sub> = Valor total de demanda (R$);
                </ListItem>
                <ListItem>
                  T<sub>cp</sub> = Tarifa de consumo ponta (R$/MWh);
                </ListItem>
                <ListItem>
                  T<sub>cfp</sub> = Tarifa de consumo fora de ponta (R$/MWh);{" "}
                </ListItem>
                <ListItem>
                  C<sub>p</sub> = Consumo medido ponta (MWh);
                </ListItem>
                <ListItem>
                  C<sub>fp</sub> = Consumo medido fora de ponta (MWh);
                </ListItem>
                <ListItem>
                  T<sub>d</sub> = Tarifa de demanda (R$/MW);
                </ListItem>
                <ListItem>
                  D<sub>p</sub> = Demanda medida ponta (MW);
                </ListItem>
                <ListItem>
                  D<sub>fp</sub> = Demanda medida fora de ponta (MW);
                </ListItem>
                <ListItem>
                  U<sub>p</sub> = Ultrapassagem de demanda ponta (MW);
                </ListItem>
                <ListItem>
                  U<sub>fp</sub> = Ultrapassagem de demanda fora de ponta (MW).
                </ListItem>
              </List>

              <TypographyBody1>
                É importante ressaltar, que no caso da demanda medida, nas duas
                modalidades tarifárias em que haja ultrapassagem da demanda
                contratada, a unidade consumidora paga a multa por
                ultrapassagem, o que corresponde a três vezes o valor da tarifa
                de demanda.
              </TypographyBody1>

              <GreenTitle text="Escolha da demanda de contrato" />
              <TypographyBody1>
                Foi aplicada a metodologia estatística de percentil para a
                análise do contrato de fornecimento de energia. Foram utilizados
                10 cenários de percentil 10 a percentil 95, verificando o ponto
                em que se apresenta o melhor cenário econômico, de forma
                aproximar a demanda de seu valor ótimo.
              </TypographyBody1>

              <TypographyBody1>
                O gráfico abaixo exemplifica a metodologia estatística
                mencionada.
              </TypographyBody1>

              <GreenAndBluePercentilesPlot />
            </DropdownSection>

            <DropdownSection
              sx={{
                "@media page": {
                  breakBefore: "always",
                  pageBreakBefore: "always",
                },
              }}
              title={
                <Typography variant="h5">
                  Características de fornecimento
                </Typography>
              }
              open
            >
              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <TypographyBody1>
                  O contrato de fornecimento de energia elétrica celebrado pela
                  unidade consumidora e a distribuidora de energia de sua área
                  de concessão tem as seguintes características:
                </TypographyBody1>

                <CurrentContractTable
                  recommendationCurrentContract={recommendation.currentContract}
                />
              </Box>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <br />
                <TypographyBody1>
                  As tarifas da distribuidora, com vigência de {tariffStartDate}{" "}
                  a {tariffEndDate}, usadas neste estudo são as seguintes:
                </TypographyBody1>

                <TariffsTable rows={recommendation.tariffsTable} />
              </Box>
            </DropdownSection>

            <DropdownSection
              sx={{
                "@media print": {
                  breakBefore: "always",
                  // Por algum motivo só funciona com essa regra que foi deprecada
                  pageBreakBefore: "always",
                },
              }}
              title={
                <Typography variant="h5">Custo de energia atual</Typography>
              }
              open
            >
              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <Typography>
                  Os dados de entrada usados na anślise foram a demanda e o
                  consumo medidos da unidade consumidora nos úlitmos 12 meses,
                  disponíveis no sistema, conforme a tabela abaixo:
                </Typography>

                <ConsumptionHistoryTable
                  consumptionHistory={recommendation.consumptionHistoryTable}
                />
              </Box>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <Typography>
                  O gráfico abaixo compara os valores de demanda contratada à
                  demanda medida nos horários de ponta e fora de ponta ao longo
                  do período.
                </Typography>

                <MeasuredDemandPlot
                  displayTitle
                  dates={dates}
                  recommendation={recommendation}
                  isGreen={isRecommendationGreen}
                />
              </Box>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <Typography>
                  O gráfico abaixo mostra o{" "}
                  <OpenBaseCostInfo onClick={() => setIsModalOpen(true)} />*
                  total considerando as características de fornecimento atuais.
                </Typography>

                <CurrentBaseCostPlot
                  displayTitle
                  dates={dates}
                  currentContractCostsPlot={
                    recommendation.currentContractCostsPlot
                  }
                />
                <Typography>* Ver considerações gerais.</Typography>
              </Box>
            </DropdownSection>

            <DropdownSection
              sx={{ "@media print": { breakInside: "avoid" } }}
              title={
                <Typography variant="h5">
                  Comparativo do custo de energia
                </Typography>
              }
              open
            >
              <TypographyBody1>
                O gráfico abaixo compara a nova a demanda proposta à demanda
                medida nos horários de ponta e fora de ponta ao longo do
                período.
              </TypographyBody1>

              <RecommendedContractDemandPlot
                dates={dates}
                recommendation={recommendation}
                isGreen={isRecommendationGreen}
              />

              <TypographyBody1>
                O gráfico abaixo compara o{" "}
                <OpenBaseCostInfo onClick={() => setIsModalOpen(true)} />* atual
                ao custo-base calculado de acordo com o contrato proposto.
              </TypographyBody1>

              <DetailedBaseCostsComparisonPlot
                dates={dates}
                costs={recommendation.detailedContractsCostsComparisonPlot}
              />

              <Alert
                variant="filled"
                severity="info"
                sx={{ bgcolor: "#242a8e", fontWeight: "normal" }}
              >
                <AlertTitle>
                  Economia nominal: ${recommendation.nominalSavingsPercentage}%
                </AlertTitle>
                A economia é calculada comparando o{" "}
                <OpenBaseCostInfo
                  sx={{ color: "white", fontWeight: "bold" }}
                  onClick={() => setIsModalOpen(true)}
                />
                * total dos últimos 12 meses com o total estimado para um novo
                contrato no mesmo período
              </Alert>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <TypographyBody1>
                  A tabela abaixo apresenta os valores usados na estimativa de
                  economia, demonstrando as diferenças entre o{" "}
                  <OpenBaseCostInfo onClick={() => setIsModalOpen(true)} />*
                  atual e o estimado de acordo com o contrato proposto.
                </TypographyBody1>

                <BaseCostComparisonTable
                  rows={recommendation.contractsComparisonTable}
                  totals={recommendation.contractsComparisonTotals}
                />
              </Box>

              <Box sx={{ "@media print": { breakInside: "avoid" } }}>
                <Typography>
                  A tabela a seguir detalha os valores de consumo e demanda
                  usados no cálculo do{" "}
                  <OpenBaseCostInfo onClick={() => setIsModalOpen(true)} />
                  *.
                </Typography>

                <ContractsComparisonTable
                  rows={recommendation.contractsComparisonTable}
                  totals={recommendation.contractsComparisonTotals}
                />
              </Box>
            </DropdownSection>

            <DropdownSection
              sx={{ "@media print": { breakInside: "avoid" } }}
              title={
                <>
                  <Typography variant="h5"> Recomendação: </Typography>
                  {recommendation.shouldRenewContract ? (
                    <ColoredText color="warning.main">
                      Ajuste o contrato
                    </ColoredText>
                  ) : (
                    <ColoredText color="primary.main">
                      Manutenção de contrato
                    </ColoredText>
                  )}
                </>
              }
              open
            >
              <TypographyBody1>
                A partir de análises do perfil de demanda e de consumo de
                energia elétrica da unidade consumidora, propõe-se os seguintes
                ajustes no contrato:
              </TypographyBody1>

              <RecommendedContractTable
                recommendedContract={recommendation.recommendedContract}
                currentContract={recommendation.currentContract}
              />

              {recommendation.recommendedContract.tariffFlag === "G" && (
                <>
                  <br />
                  <TypographyBody1>
                    No caso da tarifa recomendada ser VERDE, considere
                    {' "'}demanda contratada de ponta{'"'} e {'"'}demanda
                    contratada fora de ponta{'"'} como iguais e equivalentes à
                    {' "'}demanda contratada{'"'}, ou seja, uma única demanda.
                  </TypographyBody1>
                </>
              )}

              {recommendation.energyBillsCount <
                recommendationSettings.IDEAL_ENERGY_BILLS_FOR_RECOMMENDATION && (
                  <>
                    <br />
                    <Alert
                      variant="filled"
                      severity="info"
                      sx={{ bgcolor: "#242a8e" }}
                    >
                      Uma ou mais faturas estão indisponíveis. Isso reduz a
                      precisão da análise.
                    </Alert>
                  </>
                )}
            </DropdownSection>

            <DropdownSection
              sx={{
                "@media print": { breakInside: "avoid", breakBefore: "always" },
              }}
              title={<Typography variant="h5">Anexos I</Typography>}
              open
            >
              <TypographyBody1>
                Considerações gerais sobre ajuste de contrato, conforme
                Resolução Normativa ANEEL nº 1.000, de 7 de dezembro de 2021:
              </TypographyBody1>

              <GreenTitle text="Do Período de Testes e Ajustes" />
              <TypographyBody1>
                A fatura de energia elétrica dos consumidores enquadrados na
                modalidade tarifária horária verde é composta da soma de
                parcelas referentes ao consumo, de acordo com o horário do dia,
                e à demanda. Os cálculos efetuados para obter os custos neste
                cenário são:
              </TypographyBody1>

              <TypographyBody1>
                Art. 311. A distribuidora deve aplicar o período de testes para
                unidade consumidora para permitir a adequação da demanda
                contratada e a escolha da modalidade tarifária, nas seguintes
                situações:
              </TypographyBody1>

              <List dense>
                <ListItem>
                  I - início do fornecimento de energia elétrica;
                </ListItem>
                <ListItem>
                  II - mudança para faturamento aplicável à unidade consumidora
                  do grupo A, cuja opção anterior tenha sido por faturamento do
                  grupo B;
                </ListItem>
                <ListItem>
                  III - enquadramento na modalidade tarifária horária azul; e
                </ListItem>
                <ListItem>
                  IV - Acréscimo de demanda, quando maior que 5% (cinco por
                  cento) da contratada.
                </ListItem>
                <ListItem>
                  Parágrafo único. Quando do enquadramento na modalidade
                  tarifária horária azul, o período de testes abrangerá
                  exclusivamente o montante contratado para o posto tarifário
                  ponta.
                </ListItem>
              </List>

              <TypographyBody1>
                Art. 312. O período de testes deve ter duração de 3 (três)
                ciclos consecutivos e completos de faturamento.
              </TypographyBody1>

              <TypographyBody1 sx={{ pl: 2 }}>
                Parágrafo único. A distribuidora pode prorrogar o período de
                testes, mediante solicitação fundamentada do consumidor.
              </TypographyBody1>

              <TypographyBody1>
                Art. 313. A distribuidora deve faturar a demanda medida durante
                o período de testes, exceto na situação de acréscimo de demanda,
                em que a distribuidora deve considerar o maior valor entre a
                demanda medida e a demanda contratada anteriormente à
                solicitação de acréscimo.
              </TypographyBody1>

              <TypographyBody1 sx={{ pl: 2 }}>
                § 1o A distribuidora deve faturar o valor mínimo disposto no
                caput do art. 148 em ao menos 1 (um) dos postos tarifários.
              </TypographyBody1>
            </DropdownSection>
          </DropdownSectionManager>

          <BaseCostInfoModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

const ColoredText = ({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) => {
  return (
    <Typography
      variant="h5"
      sx={{
        boxSizing: "initial",
        display: "inline",
        bgcolor: color,
        color: color === "primary.main" ? "background.paper" : "#000",
        borderRadius: 1,
        p: 0.5,
      }}
    >
      {children}
    </Typography>
  );
};
