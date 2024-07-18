import { Box } from "@mui/material";
import { ReactElement } from "react";
import React from "react";
import { DropdownSectionProps } from "./DropdownSection";

interface Props {
  children:
    | ReactElement<DropdownSectionProps>
    | ReactElement<DropdownSectionProps>[];
}

const DropdownSectionManager = ({ children }: Props) => {
  return <Box>{children}</Box>;
};

export default DropdownSectionManager;
