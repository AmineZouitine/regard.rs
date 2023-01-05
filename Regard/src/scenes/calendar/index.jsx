import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useQuery } from "react-query";
import { getWatchersTime } from "../../data/watchers";
import React, { useRef } from "react";
import listPlugin from "@fullcalendar/list";
import { convertToCSV, getHours, convertData } from "./utils";

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
