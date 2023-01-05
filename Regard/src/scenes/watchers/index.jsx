import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getWatchers } from "../../data/watchers";
import { useQuery } from "react-query";
import { formatDate } from "./utils";
import EditButton from "./EditButton";

const Watchers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isLoading, data } = useQuery("Watchers", getWatchers);
  const watcherColumns = [
    {
      field: "name",
      headerName: "Watcher Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "path",
      flex: 1,
      headerName: "Path",
    },
    {
      field: "start_date",
      headerName: "Starting date",
      flex: 1,
      renderCell: ({ row }) => {
        let date = formatDate(row.start_date);
        return <label>{date}</label>;
      },
    },
    {
      field: "is_active",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => {
        let status = row.is_active === true ? "Active" : "Inactive";
        let color =
          status === "Active" ? colors.greenAccent[400] : colors.redAccent[400];

        return (
          <Box
            px={1}
            borderRadius={"10%"}
            bgcolor={color}
            color="black"
            boxShadow={"box-shadow: 10px 5px 5px black;"}
          >
            <label>{status}</label>
          </Box>
        );
      },
    },
    {
      field: "",
      headerName: "",
      renderCell: ({ row }) => {
        return <EditButton data={row} />;
      },
    },
  ];

  return (
    <>
      {!isLoading && (
        <Box m="20px">
          <Box display={"flex"}>
            <Header title="Watchers" subtitle="Managing all your watchers" />
          </Box>
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[400]} !important`,
              },
            }}
          >
            <DataGrid rows={data} columns={watcherColumns} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Watchers;
