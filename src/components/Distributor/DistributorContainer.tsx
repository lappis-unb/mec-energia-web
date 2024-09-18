import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { DistributorPropsTariffs } from "../../types/distributor";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DistributorInfo } from "./DistributorInfo";
import { SubGroup } from "../../types/tariffs";
import { Badge } from "@mui/material";
import { mockedDistributor } from "../../mocks/mockedDistributor";
import { useDispatch } from "react-redux";
import { setActiveSubgroup } from "@/store/appSlice";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: string) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function DistributorContainer() {
  const [value, setValue] = useState(0);
  const [subgroups, setSubgroups] = useState(Array<SubGroup>);
  const router = useRouter();
  const [currentDist, setCurrentDist] = useState<
    DistributorPropsTariffs | undefined
  >();
  const dispatch = useDispatch();

  const getAllSubgroups = React.useCallback(() => {
    try {
      const sub: Array<SubGroup> = [];
      currentDist?.tariffs?.forEach((tariff) => {
        if (sub.findIndex((sub) => sub.subgroup === tariff.subgroup) === -1) {
          sub.push({
            subgroup: tariff.subgroup,
            pending: tariff.overdue,
          });
        } else {
          const index = sub.findIndex((sub) => sub.subgroup === tariff.subgroup);
          const pending = tariff.overdue;
          if (pending && !sub[index].pending) sub[index].pending = pending;
        }
      });
      setSubgroups(sub);
    } catch (err) {
      console.error("Erro ao obter subgrupos:", err);
    }
  }, [currentDist?.tariffs]);

  useEffect(() => {
    try {
      const { id } = router.query;
      setCurrentDist(mockedDistributor[Number(id) - 1]);
      getAllSubgroups();
    } catch (err) {
      console.error("Erro ao carregar o distribuidor:", err);
    }
  }, [getAllSubgroups, router.query]);

  useEffect(() => {
    try {
      const { id } = router.query;
      setCurrentDist(mockedDistributor[Number(id) - 1]);
    } catch (err) {
      console.error("Erro ao atualizar o distribuidor:", err);
    }
  }, [router.asPath, router.query]);

  useEffect(() => {
    try {
      getAllSubgroups();
    } catch (err) {
      console.error("Erro ao atualizar subgrupos:", err);
    }
  }, [currentDist, getAllSubgroups]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const currentSubgroup = currentDist?.tariffs[newValue].subgroup;
    if (currentSubgroup) {
      dispatch(setActiveSubgroup(currentSubgroup));
    }
  };

  return (
    <Box sx={{ width: "100%" }} mt={8}>
      {subgroups.length > 1 && (
        <Box>
          <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="subgroups"
              sx={{ width: "100%", display: "flex" }}
              centered
            >
              {subgroups.map((sub) => {
                return (
                  <Tab
                    icon={
                      <Box pr={1}>
                        <Badge
                          badgeContent={"!"}
                          color="primary"
                          invisible={!sub.pending}
                        />
                      </Box>
                    }
                    iconPosition="start"
                    key={sub.subgroup}
                    sx={{ flex: "1" }}
                    label={`Subgrupo ${sub.subgroup}`}
                    {...a11yProps(sub.subgroup)}
                  />
                );
              })}
            </Tabs>
          </Box>
          {subgroups.map((sub, index) => {
            return (
              <TabPanel key={index} value={value} index={index}>
                <DistributorInfo />
              </TabPanel>
            );
          })}
        </Box>
      )}
      {subgroups.length === 1 && (
        <Box>
          <DistributorInfo />
        </Box>
      )}
      {subgroups.length === 0 && (
        <Box>
          <DistributorInfo />
        </Box>
      )}
    </Box>
  );
}