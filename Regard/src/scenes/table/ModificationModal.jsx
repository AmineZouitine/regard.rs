import * as React from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { date } from "yup/lib/locale";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { patchWatcher } from "../../data/watchers";
import { useMutation, useQueryClient } from "react-query";

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
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const initialValues = {
    name: data.name,
    path: data.path,
    is_active: data.is_active,
  };
  const handleFormSubmit = (values) => {
    mutate({
      watcherName: data.name,
      body: {
        name: data.name !== values.name ? values.name : undefined,
        path: data.path !== values.path ? values.path : undefined,
        is_active: values.is_active,
      },
    });
  };
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
          backgroundColor={colors.blueAccent[700]}
          py={5}
          px={5}
          borderRadius="2%"
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box mb={4}>
            <Header title="Edit Watcher" subtitle="" />
          </Box>

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Watcher Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Path"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.path}
                    name="path"
                    error={!!touched.path && !!errors.path}
                    helperText={touched.path && errors.path}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <Box sx={{ gridColumn: "span 4" }}>
                    <InputLabel id="status-label" sx={{ width: "100%", mb: 1 }}>
                      Status
                    </InputLabel>
                    <Select
                      labelId="status-label"
                      value={values.is_active}
                      label="Status"
                      onChange={handleChange}
                      name="is_active"
                      sx={{ width: "100%" }}
                    >
                      <MenuItem value={true}>Actif</MenuItem>
                      <MenuItem value={false}>Inactif</MenuItem>
                    </Select>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Validate
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  path: yup.string().required("required"),
});
