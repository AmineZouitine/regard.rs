import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import Header from "../../components/Header";

const Dashboard = () => {
  return (
    <Box m="20px">
      <Box>
        <Header
          title={"DASHBOARD"}
          subtitle={"General informations about your data."}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
