import { useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { Box, Card, Grid, styled, Button, TextField } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK
import { H6 } from "@/components/typography"; // CUSTOM DEFINED COMPONENTS
import { FlexBetween } from "@/components/flexbox";

import 'react-toastify/dist/ReactToastify.css';


const StyledFlexBox = styled(FlexBetween)(({
  theme
}) => ({
  marginBottom: 30,
  [theme.breakpoints.down(750)]: {
    "& .MuiFormGroup-root": {
      marginBottom: 10
    }
  }
}));

const CreateCablingPageView = () => {
  const navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL + "/api/Cabling/";
  const [loading, setloading] = useState(false);
  const initialValues = {
    name: "",
    price: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name To is Required!"),
  });
  const handleCancel = () => navigate("/dashboard/cabling-list");


  return <Box pt={2} pb={4}>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <Card sx={{
      padding: 3
    }}>
      <H6 fontSize={16} mb={2}>
        Add Cabling
      </H6>

      <Formik initialValues={initialValues} validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = {
            name: values.name,
            price: values.price,
          }
          const header = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          try {
            setloading(true);
            const res = await axios.post(
              baseApiUrl, formData, header
            );
            if (res.status == 201) {
              toast.success("Cabling Added Successfully");
              setloading(false);
              setTimeout(() => {
                navigate("/dashboard/cabling-list");
              }, 1000);
            }
          } catch (err) {
            setloading(false);
            toast.error("Record Not Added");
          }
        }}
        children={({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => {
          return <form onSubmit={handleSubmit}>

            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Name" label="Name" value={values.name}
                    onChange={(e) => {
                      setFieldValue("name", e.target.value);
                    }}
                    helperText={touched.name && errors.name} error={Boolean(touched.name && errors.name)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Price" label="Price" value={values.price}
                    onChange={(e) => {
                      setFieldValue("price", e.target.value);
                    }}
                  />
                </Box>
              </Grid>
            </Grid>



            <StyledFlexBox flexWrap="wrap">

              <Box marginTop={3} className="buttonWrapper">
                <Button color="secondary" variant="outlined" onClick={handleCancel} sx={{
                  mr: 1
                }}>
                  Cancel
                </Button>


                {loading ? (
                  <Button type="submit" variant="contained" disabled={true}>
                    <div className="spinner-border text-warning" role="status">
                      <span className="sr-only">Saving...</span>
                    </div>
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" color="success">
                    Save
                  </Button>
                )}

              </Box>
            </StyledFlexBox>
          </form>;
        }} />
    </Card>
  </Box>;
};

export default CreateCablingPageView;