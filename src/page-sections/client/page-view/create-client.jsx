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

const CreateClientPageView = () => {
  const navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL + "/api/Client/";
  const [loading, setloading] = useState(false);
  const clientInitialValues = {
    name: "",
    cnic: "",
    city: "",
    company: "",
    area: "",
    contact_number: "",
    monthly_consumption_units: "",
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name To is Required!"),
    // cnic: Yup.string()
    //   .required("CNIC is Required!")
    //   .matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in the format XXXXX-XXXXXXX-X')
    //   .test('unique', 'CNIC already exists', async function (value) {
    //     if (!value) return true; // Skip validation if value is not provided

    //     try {
    //       const res = await axios.get(`${baseApiUrl}Client/?format=json`);
    //       const existingCNICs = res?.data?.map(client => client.cnic);

    //       // Check if the CNIC already exists in the database
    //       return !existingCNICs.includes(value);
    //     } catch (err) {
    //       console.error(err);
    //       return false; // Return false if there's an error
    //     }
    //   }),
  });
  const handleCancel = () => navigate("/dashboard/client-list");


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
        Add Client
      </H6>

      <Formik initialValues={clientInitialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = {
            name: values.name,
            cnic: values.cnic,
            city: values.city,
            company: values.company,
            area: values.area,
            contact_number: values.contact_number,
            monthly_consumption_units: values.monthly_consumption_units,
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
              toast.success("Client Added Successfully");
              setloading(false);
              setTimeout(() => {
                navigate("/dashboard/client-list");
              }, 1000);
            }
          } catch (err) {
            setloading(false);
            toast.error("Client Not Added");
          }
        }}

        children={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
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
                  <TextField fullWidth type="text" name="CNIC" label="CNIC" value={values.cnic}
                    onChange={(e) => {
                      const { value } = e.target;

                      // Format CNIC to include hyphens after the 5th and 13th characters
                      const formattedCNIC = value
                        .replace(/[^\d-]/g, "")  // Remove non-digit characters except hyphen
                        .slice(0, 15)  // Limit length to 15 characters
                        .replace(/(\d{5})(\d{7})(\d)/, "$1-$2-$3");  // Insert hyphens

                      setFieldValue("cnic", formattedCNIC);
                    }}
                    helperText={touched.cnic && errors.cnic} error={Boolean(touched.cnic && errors.cnic)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Contact Number" label="Contact Number" value={values.contact_number}
                    onChange={(e) => {
                      setFieldValue("contact_number", e.target.value);
                    }}
                    helperText={touched.contact_number && errors.contact_number} error={Boolean(touched.contact_number && errors.contact_number)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="City" label="City" value={values.city}
                    onChange={(e) => {
                      setFieldValue("city", e.target.value);
                    }}
                    helperText={touched.city && errors.city} error={Boolean(touched.city && errors.city)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Area" label="Area" value={values.area}
                    onChange={(e) => {
                      setFieldValue("area", e.target.value);
                    }}
                    helperText={touched.area && errors.area} error={Boolean(touched.area && errors.area)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Company" label="Company" value={values.company}
                    onChange={(e) => {
                      setFieldValue("company", e.target.value);
                    }}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Monthly Consumption Units" label="Monthly Consumption Units" value={values.monthly_consumption_units}
                    onChange={(e) => {
                      setFieldValue("monthly_consumption_units", e.target.value);
                    }}
                    helperText={touched.monthly_consumption_units && errors.monthly_consumption_units} error={Boolean(touched.monthly_consumption_units && errors.monthly_consumption_units)}
                  />
                </Box>
              </Grid>
            </Grid>


            <StyledFlexBox flexWrap="wrap" justifyContent="end">
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
          </form>
        }} >
      </Formik>
    </Card>
  </Box>;
};

export default CreateClientPageView;