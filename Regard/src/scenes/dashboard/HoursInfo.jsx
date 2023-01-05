import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../theme";

export const HoursInfo = ({ title, value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      bgcolor={colors.primary[400]}
      borderRadius={"5px"}
      px={18}
      py={2}
      boxShadow="2px 2px black"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={"10px"}
    >
      <Typography noWrap align="center" variant="h4" flex={"1"}>
        {`${title}`}
      </Typography>
      <Typography
        noWrap
        align="center"
        variant="h4"
        fontWeight={"bold"}
        color={colors.greenAccent[400]}
        display="flex"
      >
        {`${value} Hours`}
      </Typography>
    </Box>
  );
};
