import {
  KeyboardArrowDown as ChevronDown,
  KeyboardArrowUp as ChevronUp,
} from "@mui/icons-material";
import { Box, Button, Card, CardContent, SxProps } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

const ChevronButton = ({
  onClick,
  open,
}: {
  onClick: () => void;
  open?: boolean;
}) => {
  return (
    <Button
      sx={{ color: "#00000054", "@media print": { display: "none" } }}
      onClick={onClick}
    >
      {open ? <ChevronUp /> : <ChevronDown />}
    </Button>
  );
};

export interface DropdownSectionProps {
  title: ReactNode;
  complementTitle?: ReactNode;
  children: ReactNode;
  htmlId?: string;
  open?: boolean;
  sx?: SxProps;

  /** 
   * O tipo não é importante. A ideia é utilizar esse campo para atualizar o
   * <DropdownSection /> sempre que algum DropdownSection alterar seu estado.
  */
  dropdownSectionState: object;
}

const DropdownSection = ({
  sx,
  children,
  title,
  complementTitle,
  open,
  htmlId,
  dropdownSectionState,
}: DropdownSectionProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open, dropdownSectionState]);

  return (
    <Card
      id={htmlId}
      className="dropdown-section"
      sx={{
        p: 1,
        my: 3,
        color: "primary",
        boxShadow: 3,
        ...sx,
      }}
    >
      {/* Todos os filhos diretos de CardContent devem ter um espacinho sobrando 
      embaixo. Sem esse estilo fica tudo grudado verticalmente */}
      <CardContent sx={{ "> *": { mb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: isOpen ? 4 : 0,
          }}
        >
          <Box sx={{ h5: { display: "inline" } }}>
            {title} {complementTitle}
          </Box>

          <ChevronButton open={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </Box>

        <Box
          display={isOpen ? "block" : "none"}
          sx={{
            "@media print": {
              p: { display: "block" },
              li: { display: "block", breakInside: "avoid" },
              div: { breakInside: "avoid" },
              table: { breakInside: "avoid" },
              canvas: { breakInside: "avoid" },
            },
          }}
        >
          {children}
        </Box>
        {/* {isOpen && children} */}
      </CardContent>
    </Card>
  );
};

export default DropdownSection;
