import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useQuery } from "react-query";
import { getWatchersTime } from "../../data/watchers";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import GetAppIcon from "@mui/icons-material/GetApp";
import React, { useRef } from "react";
import listPlugin from "@fullcalendar/list";
import { convertToCSV, getHours, convertData } from "./utils";

const DownloadButton = ({ data, fileName }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClick = () => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
  };

  return (
    <Box>
      <Typography
        color={colors.greenAccent[400]}
        variant="h5"
        sx={{ marginBottom: "20px" }}
      >
        Export data
      </Typography>
      <Button
        variant="contained"
        endIcon={<GetAppIcon />}
        sx={{
          padding: "10px",
          px: "30px",
          fontSize: "15px",
          bgcolor: colors.greenAccent[400],
          fontWeight: "bold",
        }}
        onClick={handleClick}
      >
        Export (csv)
      </Button>
    </Box>
  );
};

const HoursInfo = ({ title, value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      bgcolor={colors.primary[500]}
      my={2}
      borderRadius={"5px"}
      p={2}
      boxShadow="2px 2px black"
    >
      <Typography align="center" variant="h4">
        {title}
      </Typography>
      <Typography
        align="center"
        variant="h4"
        fontWeight={"bold"}
        color={colors.greenAccent[400]}
      >
        {value} Hours
      </Typography>
    </Box>
  );
};

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let hours = {};
  const { isLoading, data } = useQuery("Time", getWatchersTime);
  const possible_colors = [
    colors.blueAccent[400],
    colors.redAccent[600],
    colors.blueAccent[400],
    colors.redAccent[500],
    colors.blueAccent[500],
    colors.redAccent[400],
    colors.blueAccent[600],
  ];
  const [filter, setFilter] = useState("All");
  if (isLoading) {
    return <></>;
  } else {
    hours = getHours(data, filter);
    console.log(hours);
  }

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR */}
        <Box
          flex="20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Box mb={4} mt={2}>
            <Typography
              color={colors.greenAccent[400]}
              variant="h5"
              sx={{ marginBottom: "15px" }}
            >
              Project
            </Typography>

            <Select
              labelId="status-label"
              value={filter}
              label="Project"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              sx={{ width: "100%" }}
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
          <Typography color={colors.greenAccent[400]} variant="h5">
            Hours informations
          </Typography>
          <HoursInfo title={"Year"} value={hours.year.toString()} />
          <HoursInfo title={"Month"} value={hours.month.toString()} />
          <HoursInfo title={"Week"} value={hours.week.toString()} />
          <HoursInfo title={"Day"} value={hours.day.toString()} />

          <DownloadButton data={convertToCSV(data)} fileName={data.csv} />
        </Box>
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={convertData(data, possible_colors, filter)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
