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

const getColors = (colors) => {
  let color_index = 0;

  return function () {
    let color = colors[color_index];
    if (color_index + 1 === colors.length) {
      color_index = 0;
    } else {
      color_index += 1;
    }
    return color;
  };
};

const convertData = (data, colors, filter) => {
  let convertedData = [];
  let pickColor = getColors(colors);
  for (const watcher in data) {
    if (filter !== "All" && filter !== watcher) {
      continue;
    }
    let color = pickColor();
    for (const watcherTime of data[watcher]) {
      if (watcherTime.start_date !== watcherTime.end_date) {
        convertedData.push({
          title: watcher,
          start: watcherTime.start_date,
          end: watcherTime.end_date,
          color,
        });
      }
    }
  }
  return convertedData;
};

const getHours = (data, filter) => {
  // Get the current date
  const currentDate = new Date();

  // Initialize the total time variables
  let totalTimeToday = 0;
  let totalTimeThisWeek = 0;
  let totalTimeThisMonth = 0;
  let totalTimeThisYear = 0;

  // Loop through the JSON object

  for (const watcher in data) {
    if (filter !== "All" && filter !== watcher) {
      continue;
    }
    for (const watcherTime of data[watcher]) {
      // Parse the start date
      const startDate = new Date(watcherTime.start_date);

      // Check if the start date is today
      if (
        startDate.getDate() === currentDate.getDate() &&
        startDate.getMonth() === currentDate.getMonth() &&
        startDate.getFullYear() === currentDate.getFullYear()
      ) {
        totalTimeToday += watcherTime.total_time;
      }

      // Check if the start date is in the current week
      if (
        startDate.getTime() >
          currentDate.getTime() - currentDate.getDay() * 24 * 60 * 60 * 1000 &&
        startDate.getTime() <
          currentDate.getTime() +
            (7 - currentDate.getDay()) * 24 * 60 * 60 * 1000
      ) {
        totalTimeThisWeek += watcherTime.total_time;
      }

      // Check if the start date is in the current month
      if (
        startDate.getMonth() === currentDate.getMonth() &&
        startDate.getFullYear() === currentDate.getFullYear()
      ) {
        totalTimeThisMonth += watcherTime.total_time;
      }

      // Check if the start date is in the current year
      if (startDate.getFullYear() === currentDate.getFullYear()) {
        totalTimeThisYear += watcherTime.total_time;
      }
    }
  }

  // Return the total times
  return {
    day: totalTimeToday === 0 ? 0 : (totalTimeToday / 60).toFixed(2),
    week: totalTimeThisWeek === 0 ? 0 : (totalTimeThisWeek / 60).toFixed(2),
    month: totalTimeThisMonth === 0 ? 0 : (totalTimeThisMonth / 60).toFixed(2),
    year: totalTimeThisYear === 0 ? 0 : (totalTimeThisYear / 60).toFixed(2),
  };
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
              {Object.keys(data).map((key) => (
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
            >
              Export (csv)
            </Button>
          </Box>
        </Box>
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin]}
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
