import { Box } from "@mui/material";
import { ReactElement, useState, useEffect } from "react";
import React from "react";
import { DropdownSectionProps } from "./DropdownSection";

interface Props {
  children:
    | ReactElement<DropdownSectionProps>
    | ReactElement<DropdownSectionProps>[];
  openAll?: boolean;
}

const DropdownSectionManager = ({ children, openAll }: Props) => {
  const [isAllOpen, setIsAllOpen] = useState(openAll || false);

  useEffect(() => {
    setIsAllOpen(openAll || false);
  }, [openAll]);

  const modifiedChildren = Array.isArray(children)
    ? children.map((child) =>
        React.cloneElement(child, { open: isAllOpen })
      )
    : React.cloneElement(children, { open: isAllOpen });

  return <Box>{modifiedChildren}</Box>;
};

export default DropdownSectionManager;
