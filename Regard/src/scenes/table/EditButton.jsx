import * as React from "react";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { deleteWatcher } from "../../data/watchers";
import { useState } from "react";
import ModificationModal from "./ModificationModal";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { fontSize } from "@mui/system";

export default function EditButton({ data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const queryClient = useQueryClient();
  const queryOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries("Watchers");
    },
  };

  const { mutate } = useMutation(deleteWatcher, queryOptions);

  return (
    <>
      {isOpenModal && (
        <ModificationModal
          handleClose={() => {
            setIsOpenModal(false);
          }}
          data={data}
        />
      )}

      <Button
        sx={{
          bgcolor: colors.greenAccent[400],
          fontWeight: "bold",
          fontSize: "10px",
          boxShadow: "1px 1px black",
        }}
        onClick={() => setIsOpenModal(true)}
      >
        Details
      </Button>
    </>
  );
}
