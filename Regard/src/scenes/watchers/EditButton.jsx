import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "react-query";
import { deleteWatcher, patchWatcher } from "../../data/watchers";
import { useState } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PlayArrow from "@mui/icons-material/PlayArrow";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function EditButton({ data }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const queryOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries("Watchers");
    },
  };

  const { mutate } = useMutation(deleteWatcher, queryOptions);
  const { mutate: activeMutate } = useMutation(patchWatcher, queryOptions);
  const { mutate: inactiveMutate } = useMutation(patchWatcher, queryOptions);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {data.is_active ? (
          <MenuItem
            onClick={() => {
              handleClose();
              inactiveMutate({
                watcherName: data.name,
                body: {
                  is_active: false,
                },
              });
            }}
            disableRipple
          >
            <PauseIcon />
            <label>Stop</label>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleClose();
              activeMutate({
                watcherName: data.name,
                body: {
                  is_active: true,
                },
              });
            }}
            disableRipple
          >
            <PlayArrowIcon />
            <label>Start</label>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleClose();
            mutate(data.name);
          }}
          disableRipple
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
