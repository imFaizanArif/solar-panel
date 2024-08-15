import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { Box, Card, Grid, styled, Button, TextField } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK
import { H6 } from "@/components/typography"; // CUSTOM COMPONENTS
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

const UpdateExpenditurePageView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL + "/api/Expenditures/";
  const [loading, setloading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    value: "",
    inv_id: "",
  });
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name To is Required!"),
  });

  const handleCancel = () => navigate("/dashboard/expenditure-list");
  const getExpenditureList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "?format=json");
      const ExpenditureData = res?.data;
      const ExpenditureId = parseInt(id, 10);

      const Expenditure = ExpenditureData.find((panel) => {
        return panel.id === ExpenditureId;
      });
      if (Expenditure) {
        console.log(Expenditure)
        setInitialValues({
          name: Expenditure.name,
          value: Expenditure.value,
          inv_id: Expenditure.inv_id,
        });
      }
    } catch (err) {
      console.log(err.response.data);
      toast.error("Failed to fetch Expenditure data");
    }
  };

  useEffect(() => {
    getExpenditureList();
  }, [id]);


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
        Update Expenditure
      </H6>

      <Formik initialValues={initialValues} validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          const formData = {
            name: values.name,
            value: values.value,
            inv_id: values.inv_id,
          }
          const header = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          try {
            setloading(true);
            const res = await axios.put(
              baseApiUrl + `${id}/`, formData, header
            );
            if (res.status == 200) {
              toast.success("Expenditure Updated Successfully");
              setloading(false);
              setTimeout(() => {
                navigate("/dashboard/expenditure-list");
              }, 1000);
            }
          } catch (err) {
            setloading(false);
            toast.error("Record Not Updated");
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
                  <TextField fullWidth type="number" name="Price" label="Price" value={values.value}
                    onChange={(e) => {
                      setFieldValue("value", e.target.value);
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

export default UpdateExpenditurePageView;