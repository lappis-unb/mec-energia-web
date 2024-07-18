import {
  KeyboardArrowDown as ChevronDown,
  KeyboardArrowUp as ChevronUp,
} from "@mui/icons-material";
import { Box, Button, Card, CardContent, SxProps } from "@mui/material";
import { ReactNode, useState, useEffect } from "react";

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
  initialOpen?: boolean;
  open?: boolean;
  sx?: SxProps;
}

const DropdownSection = ({
  sx,
  children,
  title,
  complementTitle,
  initialOpen = false,
  open,
}: DropdownSectionProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen || open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Card
      className="dropdown-section"
      sx={{
        p: 1,
        my: 3,
        color: "primary",
        boxShadow: 3,
        ...sx,
      }}
    >
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
      </CardContent>
    </Card>
  );
};

export default DropdownSection;
