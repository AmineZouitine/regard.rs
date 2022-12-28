import * as React from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, TextField, Typography } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { patchWatcher } from "../../data/watchers";
import { useMutation, useQueryClient } from "react-query";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { fontWeight } from "@mui/system";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import BarChart from "./BarChart";
const InformationsBox = ({ title, data, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      bgcolor={colors.primary[400]}
      display={"flex"}
      flexDirection="column"
      justifyContent={"center"}
      alignItems="center"
      px={10}
      py={3}
      mx={2}
      borderRadius="5px"
      boxShadow={"1px 1px black"}
    >
      <Box display={"flex"} mb="15px">
        {icon}
        <Typography
          sx={{ paddingLeft: "10px" }}
          variant="h3"
          fontWeight={"bold"}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="h4"
        color={colors.greenAccent[400]}
        fontWeight={"bold"}
      >
        {data}
      </Typography>
    </Box>
  );
};

export default function ModificationModal({ handleClose, data }) {
  const queryClient = useQueryClient();
  const queryOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries("Watchers");
      handleClose();
    },
  };
  const { mutate } = useMutation(patchWatcher, queryOptions);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          m="20px"
          position="absolute"
          top="50%"
          left="50%"
          backgroundColor={colors.primary[500]}
          py={5}
          px={5}
          borderRadius="2%"
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box mb={4}>
            <Header
              title="Overview"
              subtitle="Some information/actions about the watcher"
            />
          </Box>
          <Box display="flex" flexDirection={"column"}>
            <Box
              display={"flex"}
              justifyContent="space-around"
              alignItems={"center"}
            >
              <InformationsBox
                title={"Creation"}
                data={"10 days ago"}
                icon={<HourglassBottomIcon fontSize="large" />}
              />
              <InformationsBox
                title={"Total Hours"}
                data={"10 hours"}
                icon={<QueryBuilderIcon fontSize="large" />}
              />
            </Box>

            <Box
              mt="40px"
              borderRadius={"10px"}
              boxShadow="2px 2px black"
              bgcolor={colors.primary[400]}
            >
              <Box height="250px" mt="-20px">
                <BarChart />
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent={"center"}
              alignItems="center"
              mt="30px"
            >
              <Button
                variant="contained"
                sx={{
                  paddingTop: "10px",
                  px: "60px",
                  bgcolor: colors.redAccent[400],
                  fontSize: "15px",
                  fontWeight: "bold",
                  mr: "20px",
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
