import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { HoursInfo } from "./HoursInfo";
import BarChart from "./BarChart.jsx";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { getWatchersTime } from "../../data/watchers";
import { useQuery } from "react-query";
import { barData, getWeekDateString, getMonthDateString } from "./Utils";

const Dashboard = () => {
  const [view, setView] = useState("Week");
  const [offset, setOffset] = useState(0);
  const { isLoading, data } = useQuery("Time", getWatchersTime);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setOffset(0);
      setView(newView);
    }
  };

  const theme = useTheme();
  const [filter, setFilter] = useState("All");
  const colors = tokens(theme.palette.mode);

  if (isLoading) {
    return <></>;
  }

  return (
    <Box m="20px" display={"flex"} flexDirection="column">
      <Box display="flex" justifyContent="space-between">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box
          display={"grid"}
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          gap="30px"
          mb="20px"
        >
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{ gridColumn: "span 1" }}
          >
            View
          </Typography>
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{ gridColumn: "span 1" }}
          >
            Project
          </Typography>
          <Box sx={{ gridColumn: "span 1" }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
            >
              <ToggleButton value="Week">Week</ToggleButton>
              <ToggleButton value="Month">Month</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Select
            labelId="status-label"
            value={filter}
            label="Project"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            sx={{ gridColumn: "span 1" }}
          >
            <MenuItem value={"All"}>All</MenuItem>
            {Object.keys(data)
              .sort()
              .map((key) => (
                <MenuItem value={key} key={key}>
                  {key}
                </MenuItem>
              ))}
          </Select>
        </Box>
      </Box>

      <Box
        mt={2}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="10px"
      >
        <Typography variant="h3" fontWeight={"bold"}>
          {view === "Week"
            ? getWeekDateString(offset)[0]
            : getMonthDateString(offset)[0]}
        </Typography>
        <Box>
          <IconButton
            size="medium"
            onClick={() => {
              setOffset(offset - 1);
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            size="medium"
            onClick={() => {
              setOffset(offset + 1);
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        p="15px"
        borderRadius="4px"
        display="flex"
        alignItems="center"
        justifyContent={"center"}
        alignSelf="center"
        gap={"20px"}
      >
        <HoursInfo title={"Year"} value={"3"} />
        <HoursInfo title={"Month"} value={"3"} />
        <HoursInfo title={"Week"} value={"4"} />
        <HoursInfo title={"Today"} value={"1"} />
      </Box>

      <Box display={"flex"} mt="20px">
        <Box
          ml="40px"
          height="450px"
          mt="20px"
          width={"95%"}
          borderRadius="10px"
          boxShadow={"2px 2px black"}
          bgcolor={colors.primary[400]}
        >
          <BarChart
            data={barData(
              data,
              filter,
              view === "Week",
              view === "Week"
                ? getWeekDateString(offset)[1]
                : getMonthDateString(offset)[1]
            )}
            keys={Object.keys(data)}
            index={view === "Week" ? "day" : "week"}
            xLegend={view === "Week" ? "Days" : "Weeks"}
            yLegend="Time"
            isDashboard={false}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
