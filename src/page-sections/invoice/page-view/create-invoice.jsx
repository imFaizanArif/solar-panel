import { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Box, Card, Grid, styled, Button, TextField, Divider, Typography } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK
import { H6, Paragraph } from "@/components/typography"; // CUSTOM DEFINED COMPONENTS
import { FlexBetween } from "@/components/flexbox";

import 'react-toastify/dist/ReactToastify.css';
import { set } from "nprogress";


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
const options = [
  { value: 'QUOTE', label: 'Quote' },
  { value: 'PARTIALLY_PAID', label: 'Partically Paid' },
  { value: 'PAID', label: 'Paid' }
];
const CreateInvoicePageView = () => {
  const navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL + "/api/";
  const [loading, setloading] = useState(false);
  const [clientResponse, setClientResponse] = useState(false);
  const [invoiceResponse, setInvoiceResponse] = useState(false);
  const [solarPanelId, setsolarPanelId] = useState(null);
  const [solarPanelSpecificRecord, setsolarPanelSpecificRecord] = useState("");
  const [solarPanelData, setsolarPanelData] = useState([]);
  const [solarPanelDiscount, setSolarPanelDiscount] = useState(0);
  const [solarPanelPrice, setSolarPanelPrice] = useState(0);
  const [inverterId, setInverterId] = useState(null);
  const [inverterSpecificRecord, setInverterSpecificRecord] = useState("");
  const [inverterData, setInverterData] = useState([]);
  const [inverterDiscount, setInverterDiscount] = useState(0);
  const [inverterPrice, setInverterPrice] = useState(0);
  const [structureId, setStructureId] = useState(null);
  const [structureSpecificRecord, setStructureSpecificRecord] = useState("");
  const [structureData, setStructureData] = useState([]);
  const [structureDiscount, setStructureDiscount] = useState(0);
  const [structurePrice, setStructurePrice] = useState(0);
  const [cablingId, setCablingId] = useState(null);
  const [cablingSpecificRecord, setCablingSpecificRecord] = useState("");
  const [cablingData, setCablingData] = useState([]);
  const [cablingDiscount, setCablingDiscount] = useState(0);
  const [cablingPrice, setCablingPrice] = useState(0);
  const [netMeteringId, setNetMeteringId] = useState(null);
  const [netMeteringSpecificRecord, setNetMeteringSpecificRecord] = useState("");
  const [netMeteringData, setNetMeteringData] = useState([]);
  const [netMeteringDiscount, setNetMeteringDiscount] = useState(0);
  const [netMeteringPrice, setNetMeteringPrice] = useState(0);
  const [installationId, setInstallationId] = useState(null);
  const [installationSpecificRecord, setInstallationSpecificRecord] = useState("");
  const [installationData, setInstallationData] = useState([]);
  const [installationDiscount, setInstallationDiscount] = useState(0);
  const [installationPrice, setInstallationPrice] = useState(0);
  const [batteriesId, setBatteriesId] = useState(null);
  const [batteriesSpecificRecord, setBatteriesSpecificRecord] = useState("");
  const [batteriesData, setBatteriesData] = useState([]);
  const [batteriesDiscount, setBatteriesDiscount] = useState(0);
  const [batteriesPrice, setBatteriesPrice] = useState(0);
  const [lightningArrestorId, setLightningArrestorId] = useState(null);
  const [lightningArrestorSpecificRecord, setLightningArrestorSpecificRecord] = useState("");
  const [lightningArrestorData, setLightningArrestorData] = useState([]);
  const [lightningArrestorDiscount, setLightningArrestorDiscount] = useState(0);
  const [lightningArrestorPrice, setLightningArrestorPrice] = useState(0);
  const [solarPanelQuantity, setSolarPanelQuantity] = useState(0);
  const [inverterQuantity, setInverterQuantity] = useState(0);
  const [structureQuantity, setStructureQuantity] = useState(0);
  const [cablingQuantity, setCablingQuantity] = useState(0);
  const [netMeteringQuantity, setNetMeteringQuantity] = useState(0);
  const [installationQuantity, setInstallationQuantity] = useState(0);
  const [batteriesQuantity, setBatteriesQuantity] = useState(0);
  const [lightningArrestorQuantity, setLightningArrestorQuantity] = useState(0);
  const [clientData, setClientData] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const clientInitialValues = {
    name: "",
    cnic: "",
    city: "",
    company: "",
    area: "",
    contact_number: "",
    monthly_consumption_units: "",
  }
  const initialValues = {
    name: "",
    solar_panel: "",
    solar_panel_quantity: "",
    solar_panel_price: "",
    inverter: "",
    inverter_quantity: "",
    inverter_price: "",
    structure: "",
    structure_quantity: "",
    structure_price: "",
    cabling: "",
    cabling_quantity: "",
    cabling_price: "",
    net_metering: "",
    net_metering_quantity: "",
    net_metering_price: "",
    battery: "",
    battery_quantity: "",
    battery_price: "",
    lightning_arrestor: "",
    lightning_arrestor_quantity: "",
    lightning_arrestor_price: "",
    installation: "",
    installation_quantity: 0,
    installation_price: "",
    discount: "",
    shipping_charges: "",
    amount_paid: 0,
    status: "",
  };
  const clientValidationSchema = Yup.object().shape({
    // name: Yup.string().required("Name To is Required!"),
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
    // city: Yup.string().required("City is Required!"),
    // area: Yup.string().required("Area is Required!"),
    contact_number: Yup.string().required("Contact Number is Required!"),
  });
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name To is Required!"),
    // solar_panel_quantity: Yup.string().required("Solar Panel Quantity is Required!"),
    // solar_panel_price: Yup.string().required("Solar Panel Price is Required!"),
    // inverter: Yup.string().required("Inverter is Required!"),
    // inverter_quantity: Yup.string().required("Inverter Quantity is Required!"),
    // inverter_price: Yup.string().required("Inverter Price is Required!"),
    // structure: Yup.string().required("Structure is Required!"),
    // structure_quantity: Yup.string().required("Structure Quantity is Required!"),
    // structure_price: Yup.string().required("Structure Price is Required!"),
    // cabling: Yup.string().required("Cabling is Required!"),
    // cabling_quantity: Yup.string().required("Cabling Quantity is Required!"),
    // cabling_price: Yup.string().required("Cabling Price is Required!"),
    // net_metering: Yup.string().required("Net Metering is Required!"),
    // net_metering_quantity: Yup.string().required("Net Metering Quantity is Required!"),
    // net_metering_price: Yup.string().required("Net Metering Price is Required!"),
    // battery_quantity: Yup.string().required("Battery Quantity is Required!"),
    // battery_price: Yup.string().required("Battery Price is Required!"),
    // lightning_arrestor_quantity: Yup.string().required("Lightning Arrestor Quantity is Required!"),
    // lightning_arrestor_price: Yup.string().required("Lightning Arrestor Price is Required!"),
    // installation_quantity: Yup.string().required("Installation Quantity is Required!"),
    // installation_price: Yup.string().required("Installation Price is Required!"),
    // discount: Yup.string().required("Net Metering Price is Required!"),
    amount_paid: Yup.string().when('status', {
      is: value => value && (value === 'PARTIALLY_PAID' || value === 'PAID'),
      then: Yup.string().required('Paid Amount is Required!'),
      otherwise: Yup.string().notRequired()
    }),
    status: Yup.string().required("Status is Required!").oneOf(
      ['QUOTE', 'PARTIALLY_PAID', 'PAID'],
      'Invalid Status Selection'
    ),
  });
  const handleCancel = () => navigate("/dashboard/invoice-list");


  const getClientList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Client/" + "?format=json");
      const formattedData = res?.data?.map((item) => ({
        label:
          <Grid container spacing={3}>
            <Grid item md={4} sm={6} xs={12}>
              <Box marginBottom={0}>
                {item.name}
              </Box>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Box marginBottom={0}>
                {item.area}, {item.city}
              </Box>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Box marginBottom={0}>
                {item.contact_number}
              </Box>
            </Grid>
          </Grid>, value: item.id
      })).reverse();
      setClientData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getSolarPanelList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "SolarPanel/" + "?format=json");
      const Id = parseInt(solarPanelId, 10);
      const solarPanel = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setsolarPanelSpecificRecord(solarPanel);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setsolarPanelData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getInverterList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Inverter/" + "?format=json");
      const Id = parseInt(inverterId, 10);
      const inverter = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setInverterSpecificRecord(inverter);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setInverterData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getStructureList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Structure/" + "?format=json");
      const Id = parseInt(structureId, 10);
      const structure = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setStructureSpecificRecord(structure);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setStructureData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getCablingList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Cabling/" + "?format=json");
      const Id = parseInt(cablingId, 10);
      const cabling = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setCablingSpecificRecord(cabling);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setCablingData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getNetMeteringList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "NetMetering/" + "?format=json");
      const Id = parseInt(netMeteringId, 10);
      const netMetering = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setNetMeteringSpecificRecord(netMetering);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setNetMeteringData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getBatteriesList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Batteries/" + "?format=json");
      const Id = parseInt(batteriesId, 10);
      const batteries = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setBatteriesSpecificRecord(batteries);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setBatteriesData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getLightningArrestorList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "LightningArrestor/" + "?format=json");
      const Id = parseInt(lightningArrestorId, 10);
      const lightningArrestor = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setLightningArrestorSpecificRecord(lightningArrestor);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setLightningArrestorData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getInstallationList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Installation/" + "?format=json");
      const Id = parseInt(installationId, 10);
      const installation = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setInstallationSpecificRecord(installation);
      const formattedData = res?.data?.map((item) => ({ label: item.name, value: item.id }));
      setInstallationData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const [Subtotal, setSubtotal] = useState(0);
  useEffect(() => {
    getClientList();
    getSolarPanelList();
    getInverterList();
    getStructureList();
    getCablingList();
    getNetMeteringList();
    getBatteriesList();
    getLightningArrestorList();
    getInstallationList();
  }, []);

  useEffect(() => {
    if (solarPanelId || inverterId || structureId || cablingId || netMeteringId || batteriesId || lightningArrestorId || installationId) {
      getSolarPanelList();
      getInverterList();
      getStructureList();
      getCablingList();
      getNetMeteringList();
      getBatteriesList();
      getLightningArrestorList();
      getInstallationList();
    }
  }, [solarPanelId, inverterId, structureId, cablingId, netMeteringId, batteriesId || lightningArrestorId || installationId || clientResponse || invoiceResponse]);
  useEffect(() => {
    const solarPanelAmount = parseInt(solarPanelPrice) * parseInt(solarPanelQuantity);
    const inverterAmount = parseInt(inverterPrice) * parseInt(inverterQuantity);
    const structureAmount = parseInt(structurePrice) * parseInt(structureQuantity);
    const cablingAmount = parseInt(cablingPrice) * parseInt(cablingQuantity);
    const netMeteringAmount = parseInt(netMeteringPrice) * parseInt(netMeteringQuantity);
    const batteriesAmount = parseInt(batteriesPrice) * parseInt(batteriesQuantity);
    const lightningArrestorAmount = parseInt(lightningArrestorPrice) * parseInt(lightningArrestorQuantity);
    const installationAmount = parseInt(installationPrice);
    const discountAmount = parseInt(discount);
    // const shippingAmount = parseInt(shipping);
    // const amountPaidd = parseInt(amountPaid);
    const total = solarPanelAmount + inverterAmount + structureAmount + cablingAmount + netMeteringAmount + batteriesAmount + lightningArrestorAmount + installationAmount;
    // const totalAmount = total + shippingAmount - discountAmount - amountPaidd
    setSubtotal(total);
    console.log(total, 't');
    // console.log(totalAmount, 'tt');
    // console.log(shipping, 'sh')
    // console.log(discountAmount, 'dis')
    // console.log(amountPaidd, 'ap')
    // console.log(totalAmount, "ccc");
  }, [solarPanelPrice, solarPanelQuantity, inverterPrice, inverterQuantity, structurePrice, structureQuantity, cablingPrice, cablingQuantity, netMeteringPrice, netMeteringQuantity, batteriesPrice, batteriesQuantity, lightningArrestorPrice, lightningArrestorQuantity, installationPrice, discount, shipping, amountPaid]);

  useEffect(() => {
    // This effect will run whenever the discounts change to ensure latest values are used.
  }, [solarPanelDiscount, inverterDiscount, structureDiscount, cablingDiscount, netMeteringDiscount, batteriesId, lightningArrestorId, installationId || clientResponse || invoiceResponse]);

  // const Subtotal = parseInt(solarPanelPrice) + parseInt(inverterPrice) + parseInt(cablingPrice) + parseInt(structurePrice) + parseInt(netMeteringPrice) + parseInt(batteriesPrice) + parseInt(lightningArrestorPrice) + parseInt(installationPrice);
  // const Subtotal2 = parseInt(solarPanelPrice) + parseInt(inverterPrice) + parseInt(cablingPrice) + parseInt(structurePrice) + parseInt(netMeteringPrice) + parseInt(batteriesPrice) + parseInt(lightningArrestorPrice) + parseInt(installationPrice) + parseInt(shipping) - parseInt(discount);
  // const Subtotal =
  //   parseInt(solarPanelPrice) * parseInt(solarPanelQuantity) +
  //   parseInt(inverterPrice) * parseInt(inverterQuantity) +
  //   parseInt(cablingPrice) * parseInt(cablingQuantity) +
  //   parseInt(structurePrice) * parseInt(structureQuantity) +
  //   parseInt(netMeteringPrice) * parseInt(netMeteringQuantity) +
  //   parseInt(batteriesPrice) * parseInt(batteriesQuantity) +
  //   parseInt(lightningArrestorPrice) * parseInt(lightningArrestorQuantity) +
  //   parseInt(installationPrice);

  // const Subtotal2 =
  //   Subtotal +
  //   parseInt(shipping) -
  //   parseInt(discount);
  const formatNumber = (value) => {

    // if (!value) return '';
    // return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Return '0' if the value is falsy (null, undefined, or an empty string)
    if (value === null || value === undefined || value === '') return '0';

    // Convert the value to a number and use Math.floor to remove decimals
    const num = Math.floor(Number(value));

    // Format the number with commas and return it
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Function to remove commas for calculation
  const removeCommas = (value) => {
    return value.toString().replace(/,/g, '');
  };
  const [isModalVisible, setModalVisible] = useState(false);

  // Handler for scroll event
  const handleScroll = () => {
    const scrollPosition = window.scrollY; // or you can use event.target.scrollTop for a container
    // console.log('Scroll position:', scrollPosition);

    // Set visibility based on scroll position
    if (scrollPosition > 300 && scrollPosition < 2700) { // Adjust these values to your needs
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };

  // Attach scroll event listener on mount and detach it on unmount
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
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
    {isModalVisible && (
      <Box
        sx={{
          position: 'sticky',
          top: '74px',
          marginLeft: 'auto',
          width: '25%',
          backgroundColor: 'white',
          zIndex: 1000,
          padding: '8px',
          paddingLeft: '12px',
          paddingRight: '12px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <FlexBetween my={1}>
          <p style={{ fontSize: '16px', fontWeight: 600 }}>
            Due Amount
          </p>
          <Typography variant="h6" fontSize={12} sx={{ color: 'red' }}>
            {/* Replace with your formatted number */}
            {formatNumber((Subtotal - parseInt(discount) + parseInt(shipping)) - parseInt(amountPaid))}
          </Typography>
        </FlexBetween>
      </Box>
    )}
    <Card sx={{
      padding: 3
    }}>
      <H6 fontSize={22} mb={4}>
        Add Invoice
      </H6>
      {/* Client Info */}
      <Formik initialValues={clientInitialValues}
        validationSchema={clientValidationSchema}
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
              baseApiUrl + `Client/`, formData, header
            );
            if (res.status == 201) {
              toast.success("Client Added Successfully");
              getClientList();
              setloading(false);
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

            <H6 fontSize={18} mb={2}>
              Create Client
            </H6>
            <Divider sx={{
              my: 4
            }} />
            <H6 fontSize={16} mb={2}>
              Client Information
            </H6>
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
            <Divider sx={{
              my: 4
            }} />
          </form>
        }} >
      </Formik>
      {/* Invoice Info */}
      <Formik initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = {
            name: values.name,
            solar_panel: values.solar_panel,
            solar_panel_quantity: values.solar_panel_quantity,
            solar_panel_price: values.solar_panel_price,
            system_capacity: values.system_capacity,
            inverter: values.inverter,
            inverter_quantity: values.inverter_quantity,
            inverter_price: values.inverter_price,
            structure: values.structure,
            structure_quantity: values.structure_quantity,
            structure_price: values.structure_price,
            cabling: values.cabling,
            cabling_quantity: values.cabling_quantity,
            cabling_price: values.cabling_price,
            net_metering: values.net_metering,
            net_metering_quantity: values.net_metering_quantity,
            net_metering_price: values.net_metering_price,
            battery: values.battery,
            battery_quantity: values.battery_quantity,
            battery_price: values.battery_price,
            lightning_arrestor: values.lightning_arrestor,
            lightning_arrestor_quantity: values.lightning_arrestor_quantity,
            lightning_arrestor_price: values.lightning_arrestor_price,
            installation: values.installation,
            installation_quantity: 1,
            installation_price: values.installation_price,
            discount: values.discount,
            shipping_charges: values.shipping_charges,
            amount_paid: parseInt(values.amount_paid) ? parseInt(values.amount_paid) : 0,
            total: Subtotal,
            status: values.status
          }
          const header = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          try {
            setloading(true);
            const res = await axios.post(
              baseApiUrl + "Invoice/", formData, header
            );
            if (res.status == 201) {
              toast.success("Invoice Added Successfully");
              setloading(false);
              setTimeout(() => {
                navigate("/dashboard/invoice-list");
              }, 1000);
            }
          } catch (err) {
            setloading(false);
            toast.error("Invoice Not Added");
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

            <H6 fontSize={18} mb={2}>
              Create Invoice
            </H6>
            <Divider sx={{
              my: 4
            }} />
            <H6 fontSize={16} mb={2}>
              Select Client
            </H6>
            <Grid container spacing={3}>
              <Grid item md={12} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Name"
                    fullWidth name="Name" label="Name"
                    options={clientData}
                    onChange={(value) => {
                      setFieldValue("name", value ? value.value : '');
                    }}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    isClearable={true}
                    helperText={touched.name && errors.name}
                    error={Boolean(touched.name && errors.name)}
                  />
                  {errors.name && touched.name && (
                    <div className="error-message" style={{ marginLeft: "6px", marginTop: "4px", fontSize: "12px", color: "red" }}>{errors.name}</div>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <H6 fontSize={16} mb={2}>
              Solar Panel Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Solar Panel"
                    fullWidth name="Solar Panel" label="Solar Panel"
                    options={solarPanelData}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("solar_panel", value ? value.value : '');
                      setsolarPanelId(value ? value.value : null);
                    }}
                    helperText={touched.solar_panel && errors.solar_panel}
                    error={Boolean(touched.solar_panel && errors.solar_panel)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField type="number" fullWidth name="Solar Panel Quantity" label="Solar Panel Quantity" value={values.solar_panel_quantity}
                    onChange={(e) => {
                      setFieldValue("solar_panel_quantity", e.target.value);
                      setSolarPanelQuantity(e.target.value);
                    }}
                    helperText={touched.solar_panel_quantity && errors.solar_panel_quantity} error={Boolean(touched.solar_panel_quantity && errors.solar_panel_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="text" name="Solar Panel Price" label="Solar Panel Price"
                    //value={values.solar_panel_price}
                    value={formatNumber(values.solar_panel_price)}
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      // console.log(rawValue, " rawValue")
                      if (rawValue === '') {
                        setFieldValue("solar_panel_price", 0);
                        setSolarPanelPrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("solar_panel_price", numberValue);
                        setSolarPanelPrice(numberValue);

                        // Calculate the discount
                        const discount = Math.max(0, (solarPanelSpecificRecord?.price * values.solar_panel_quantity) - numberValue);
                        setSolarPanelDiscount(discount);
                      }
                    }}

                    helperText={touched.solar_panel_price && errors.solar_panel_price} error={Boolean(touched.solar_panel_price && errors.solar_panel_price)} />

                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="text" name="System Capacity" label="System Capacity"
                    // value={values.system_capacity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setFieldValue("system_capacity", 0);
                      } else {
                        setFieldValue("system_capacity", value);
                      }
                    }}
                    helperText={touched.system_capacity && errors.system_capacity} error={Boolean(touched.system_capacity && errors.system_capacity)} />

                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <FlexBetween mt={0} mx={0}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Per Solar Panel Price:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {formatNumber(solarPanelSpecificRecord?.price ? solarPanelSpecificRecord?.price : 0)}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={0}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Total Solar Panel Price: {formatNumber(solarPanelSpecificRecord?.price)} X {formatNumber(values.solar_panel_quantity ? values.solar_panel_quantity : 0)} =
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {formatNumber(isNaN(solarPanelSpecificRecord?.price * values.solar_panel_quantity) ? 0 : solarPanelSpecificRecord?.price * values.solar_panel_quantity)}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={0}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Discount:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {
                          (() => {
                            const total = solarPanelSpecificRecord?.price * values.solar_panel_quantity;
                            const discount = isNaN(total - values.solar_panel_price) ? 0 : Math.max(0, total - values.solar_panel_price);
                            setSolarPanelDiscount(discount);
                            return formatNumber(discount);
                          })()
                        }
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <H6 fontSize={16} mb={2}>
              Inverter Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Inverter"
                    fullWidth name="Inverter" label="Inverter"
                    options={inverterData}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("inverter", value ? value.value : '');
                      setInverterId(value ? value.value : null);
                    }}
                    helperText={touched.inverter && errors.inverter}
                    error={Boolean(touched.inverter && errors.inverter)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Inverter Quantity" label="Inverter Quantity" value={values.inverter_quantity}
                    onChange={(e) => {
                      setFieldValue("inverter_quantity", e.target.value);
                      setInverterQuantity(e.target.value);
                    }}
                    helperText={touched.inverter_quantity && errors.inverter_quantity} error={Boolean(touched.inverter_quantity && errors.inverter_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField
                    fullWidth
                    type="text"
                    name="Inverter Price"
                    label="Inverter Price"
                    value={formatNumber(values.inverter_price)} // Format with commas
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("inverter_price", 0);
                        setInverterPrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("inverter_price", numberValue);
                        setInverterPrice(numberValue);
                        const discount = Math.max(0, (inverterSpecificRecord?.price * values.inverter_quantity) - numberValue);
                        setInverterDiscount(discount);
                      }
                    }}
                    helperText={touched.inverter_price && errors.inverter_price}
                    error={Boolean(touched.inverter_price && errors.inverter_price)}
                  />

                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Per Inverter Price:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(inverterSpecificRecord?.price ? inverterSpecificRecord?.price : 0)}</i>
                    </Paragraph>
                  </FlexBetween>

                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Total Inverter Price: {formatNumber(inverterSpecificRecord?.price)} X {formatNumber(values.inverter_quantity ? values.inverter_quantity : 0)} =</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(isNaN(inverterSpecificRecord?.price * values.inverter_quantity) ? 0 : inverterSpecificRecord?.price * values.inverter_quantity)}</i>
                    </Paragraph>
                  </FlexBetween>

                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Discount:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {(() => {
                          const total = inverterSpecificRecord?.price * values.inverter_quantity;
                          const discount = isNaN(total - values.inverter_price) ? 0 : Math.max(0, total - values.inverter_price);
                          setInverterDiscount(discount);
                          return formatNumber(discount);
                        })()}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>

            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <H6 fontSize={16} mb={2}>
              Structure Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Structure"
                    fullWidth name="Structure" label="Structure"
                    options={structureData}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("structure", value ? value.value : '');
                      setStructureId(value ? value.value : null);
                    }}
                    helperText={touched.structure && errors.structure}
                    error={Boolean(touched.structure && errors.structure)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Structure Quantity" label="Structure Quantity" value={values.structure_quantity}
                    onChange={(e) => {
                      setFieldValue("structure_quantity", e.target.value);
                      setStructureQuantity(e.target.value);
                    }}
                    helperText={touched.structure_quantity && errors.structure_quantity} error={Boolean(touched.structure_quantity && errors.structure_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField
                    fullWidth
                    type="text"
                    name="Structure Price"
                    label="Structure Price"
                    value={formatNumber(values.structure_price)} // Format with commas
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("structure_price", 0);
                        setStructurePrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("structure_price", numberValue);
                        setStructurePrice(numberValue);
                        const discount = Math.max(0, (structureSpecificRecord?.price * values.structure_quantity) - numberValue);
                        setStructureDiscount(discount);
                      }
                    }}
                    helperText={touched.structure_price && errors.structure_price}
                    error={Boolean(touched.structure_price && errors.structure_price)}
                  />

                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Per Structure Price:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(structureSpecificRecord?.price ? structureSpecificRecord?.price : 0)}</i>
                    </Paragraph>
                  </FlexBetween>

                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Total Structure Price: {formatNumber(structureSpecificRecord?.price)} X {formatNumber(values.structure_quantity ? values.structure_quantity : 0)} =</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(isNaN(structureSpecificRecord?.price * values.structure_quantity) ? 0 : structureSpecificRecord?.price * values.structure_quantity)}</i>
                    </Paragraph>
                  </FlexBetween>

                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Discount:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {(() => {
                          const total = structureSpecificRecord?.price * values.structure_quantity;
                          const discount = isNaN(total - values.structure_price) ? 0 : Math.max(0, total - values.structure_price);
                          setStructureDiscount(discount);
                          return formatNumber(discount);
                        })()}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>

            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <H6 fontSize={16} mb={2}>
              Cabling Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Cabling"
                    fullWidth name="Cabling" label="Cabling"
                    options={cablingData}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("cabling", value ? value.value : '');
                      setCablingId(value ? value.value : null);
                    }}
                    helperText={touched.cabling && errors.cabling}
                    error={Boolean(touched.cabling && errors.cabling)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Cabling Quantity" label="Cabling Quantity" value={values.cabling_quantity}
                    onChange={(e) => {
                      setFieldValue("cabling_quantity", e.target.value);
                      setCablingQuantity(e.target.value);
                    }}
                    helperText={touched.cabling_quantity && errors.cabling_quantity} error={Boolean(touched.cabling_quantity && errors.cabling_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField
                    fullWidth
                    type="text"
                    name="Cabling Price"
                    label="Cabling Price"
                    value={formatNumber(values.cabling_price)} // Format with commas
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("cabling_price", 0);
                        setCablingPrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("cabling_price", numberValue);
                        setCablingPrice(numberValue);
                        const discount = Math.max(0, (cablingSpecificRecord?.price * values.cabling_quantity) - numberValue);
                        setCablingDiscount(discount);
                      }
                    }}
                    helperText={touched.cabling_price && errors.cabling_price}
                    error={Boolean(touched.cabling_price && errors.cabling_price)}
                  />

                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Per Cabling Price:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(cablingSpecificRecord?.price ? cablingSpecificRecord?.price : 0)}</i>
                    </Paragraph>
                  </FlexBetween>

                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Total Cabling Price: {formatNumber(cablingSpecificRecord?.price)} X {formatNumber(values.cabling_quantity ? values.cabling_quantity : 0)} =</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(isNaN(cablingSpecificRecord?.price * values.cabling_quantity) ? 0 : cablingSpecificRecord?.price * values.cabling_quantity)}</i>
                    </Paragraph>
                  </FlexBetween>

                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Discount:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {(() => {
                          const total = cablingSpecificRecord?.price * values.cabling_quantity;
                          const discount = isNaN(total - values.cabling_price) ? 0 : Math.max(0, total - values.cabling_price);
                          setCablingDiscount(discount);
                          return formatNumber(discount);
                        })()}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>

            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <H6 fontSize={16} mb={2}>
              Net Metering Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Net Metering"
                    fullWidth name="Net Metering" label="Net Metering"
                    options={netMeteringData}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("net_metering", value ? value.value : '');
                      setNetMeteringId(value ? value.value : null);
                    }}
                    helperText={touched.net_metering && errors.net_metering}
                    error={Boolean(touched.net_metering && errors.net_metering)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Net Metering Quantity" label="Net Metering Quantity" value={values.net_metering_quantity}
                    onChange={(e) => {
                      setFieldValue("net_metering_quantity", e.target.value);
                      setNetMeteringQuantity(e.target.value);
                    }}
                    helperText={touched.net_metering_quantity && errors.net_metering_quantity} error={Boolean(touched.net_metering_quantity && errors.net_metering_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="text" name="Net Metering Price" label="Net Metering Price"
                    value={formatNumber(values.net_metering_price)}
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value

                      if (rawValue === '') {
                        setFieldValue("net_metering_price", 0);
                        setNetMeteringPrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("net_metering_price", numberValue);
                        setNetMeteringPrice(numberValue);
                        // Calculate the discount
                        const discount = Math.max(0, (netMeteringSpecificRecord?.price * values.net_metering_quantity) - numberValue);
                        setNetMeteringDiscount(discount);
                      }
                    }}
                    helperText={touched.net_metering_price && errors.net_metering_price} error={Boolean(touched.net_metering_price && errors.net_metering_price)} />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Per Net Metering Price:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {formatNumber(netMeteringSpecificRecord?.price ? netMeteringSpecificRecord?.price : 0)}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Total Net Metering Price: {formatNumber(netMeteringSpecificRecord?.price)} X {formatNumber(values.net_metering_quantity ? values.net_metering_quantity : 0)} =
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {formatNumber(isNaN(netMeteringSpecificRecord?.price * values.net_metering_quantity) ? 0 : netMeteringSpecificRecord?.price * values.net_metering_quantity)}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Discount:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {
                          (() => {
                            const total = netMeteringSpecificRecord?.price * values.net_metering_quantity;
                            const discount = isNaN(total - values.net_metering_price) ? 0 : Math.max(0, total - values.net_metering_price);
                            setNetMeteringDiscount(discount);
                            return formatNumber(discount);
                          })()
                        }
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>

            </Grid>
            <Divider sx={{
              my: 4
            }} />


            <H6 fontSize={16} mb={2}>
              Battery Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Battery"
                    fullWidth name="Battery" label="Battery"
                    options={batteriesData}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("battery", value ? value.value : '');
                      setBatteriesId(value ? value.value : null);
                    }}
                    helperText={touched.battery && errors.battery}
                    error={Boolean(touched.battery && errors.battery)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Battery Quantity" label="Battery Quantity" value={values.battery_quantity}
                    onChange={(e) => {
                      setFieldValue("battery_quantity", e.target.value);
                      setBatteriesQuantity(e.target.value);
                    }}
                    helperText={touched.battery_quantity && errors.battery_quantity} error={Boolean(touched.battery_quantity && errors.battery_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField
                    fullWidth
                    type="text"
                    name="Battery Price"
                    label="Battery Price"
                    value={formatNumber(values.battery_price)} // Format the value
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("battery_price", 0);
                        setBatteriesPrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("battery_price", numberValue);
                        setBatteriesPrice(numberValue);

                        // Calculate the discount
                        const discount = Math.max(0, (batteriesSpecificRecord?.price * values.battery_quantity) - numberValue);
                        setBatteriesDiscount(discount);
                      }
                    }}
                    helperText={touched.battery_price && errors.battery_price}
                    error={Boolean(touched.battery_price && errors.battery_price)}
                  />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Per Battery Price:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(batteriesSpecificRecord?.price ? batteriesSpecificRecord?.price : 0)}</i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Total Batteries Price: {formatNumber(batteriesSpecificRecord?.price)} X {formatNumber(values.battery_quantity ? values.battery_quantity : 0)} =</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(isNaN(batteriesSpecificRecord?.price * values.battery_quantity) ? 0 : batteriesSpecificRecord?.price * values.battery_quantity)}</i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Discount:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{
                        (() => {
                          const total = batteriesSpecificRecord?.price * values.battery_quantity;
                          const discount = isNaN(total - values.battery_price) ? 0 : Math.max(0, total - values.battery_price);
                          setBatteriesDiscount(discount);
                          return formatNumber(discount);
                        })()
                      }</i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>

            </Grid>
            <Divider sx={{
              my: 4
            }} />


            <H6 fontSize={16} mb={2}>
              Lightning Arrestor Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Lightning Arrestor"
                    fullWidth name="Lightning Arrestor" label="Lightning Arrestor"
                    options={lightningArrestorData}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("lightning_arrestor", value ? value.value : '');
                      setLightningArrestorId(value ? value.value : null);
                    }}
                    helperText={touched.lightning_arrestor && errors.lightning_arrestor}
                    error={Boolean(touched.lightning_arrestor && errors.lightning_arrestor)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Lightning Arrestor Quantity" label="Lightning Arrestor Quantity" value={values.lightning_arrestor_quantity}
                    onChange={(e) => {
                      setFieldValue("lightning_arrestor_quantity", e.target.value);
                      setLightningArrestorQuantity(e.target.value);
                    }}
                    helperText={touched.lightning_arrestor_quantity && errors.lightning_arrestor_quantity} error={Boolean(touched.lightning_arrestor_quantity && errors.lightning_arrestor_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField
                    fullWidth
                    type="text"
                    name="Lightning Arrestor Price"
                    label="Lightning Arrestor Price"
                    value={formatNumber(values.lightning_arrestor_price)} // Format the value
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("lightning_arrestor_price", 0);
                        setLightningArrestorPrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("lightning_arrestor_price", numberValue);
                        setLightningArrestorPrice(numberValue);

                        // Calculate the discount
                        const discount = Math.max(0, (lightningArrestorSpecificRecord?.price * values.lightning_arrestor_quantity) - numberValue);
                        setLightningArrestorDiscount(discount);
                      }
                    }}
                    helperText={touched.lightning_arrestor_price && errors.lightning_arrestor_price}
                    error={Boolean(touched.lightning_arrestor_price && errors.lightning_arrestor_price)}
                  />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Per Lightning Arrestor Price:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(lightningArrestorSpecificRecord?.price ? lightningArrestorSpecificRecord?.price : 0)}</i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Total Lightning Arrestor Price: {formatNumber(lightningArrestorSpecificRecord?.price)} X {formatNumber(values.lightning_arrestor_quantity ? values.lightning_arrestor_quantity : 0)} =</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{formatNumber(isNaN(lightningArrestorSpecificRecord?.price * values.lightning_arrestor_quantity) ? 0 : lightningArrestorSpecificRecord?.price * values.lightning_arrestor_quantity)}</i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>Discount:</i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>{
                        (() => {
                          const total = lightningArrestorSpecificRecord?.price * values.lightning_arrestor_quantity;
                          const discount = isNaN(total - values.lightning_arrestor_price) ? 0 : Math.max(0, total - values.lightning_arrestor_price);
                          setLightningArrestorDiscount(discount);
                          return formatNumber(discount);
                        })()
                      }</i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>

            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <H6 fontSize={16} mb={2}>
              Installation Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Installation"
                    fullWidth name="Installation" label="Installation"
                    options={installationData}
                    isClearable={true}
                    onChange={(value) => {
                      setFieldValue("installation", value ? value.value : '');
                      setInstallationId(value ? value.value : null);
                    }}
                    helperText={touched.installation && errors.installation}
                    error={Boolean(touched.installation && errors.installation)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="text" name="Installation Price" label="Installation Price"
                    value={formatNumber(values.installation_price)}
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("installation_price", 0);
                        setInstallationPrice(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        // Calculate the discount
                        setFieldValue("installation_price", numberValue);
                        setInstallationPrice(numberValue);
                        const discount = Math.max(0, (installationSpecificRecord?.price * values.installation_quantity) - numberValue);
                        setInstallationDiscount(discount);
                      }
                    }}
                    helperText={touched.installation_price && errors.installation_price} error={Boolean(touched.installation_price && errors.installation_price)} />
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Discount:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {
                          (() => {
                            const total = installationSpecificRecord?.price ? installationSpecificRecord?.price : 0;
                            const discount = isNaN(total - values.installation_price) ? 0 : Math.max(0, total - values.installation_price);
                            setInstallationDiscount(discount);
                            return formatNumber(discount);
                          })()
                        }
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>

            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Discount" label="Discount"
                    // value={values.discount}
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("discount", 0);
                        setDiscount(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("discount", numberValue);
                        setDiscount(numberValue);
                      }
                    }}
                    helperText={touched.discount && errors.discount} error={Boolean(touched.discount && errors.discount)} />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        <span style={{ fontWeight: 500, fontSize: 13, color: 'black' }}>Calculated Discount:</span>
                        <br /> Solar Panel:
                        <br /> Inverter:
                        <br /> Structure:
                        <br /> Cabling:
                        <br /> Net Metering:
                        <br /> Battery:
                        <br /> Lightning Arrestor:
                        <br /> Installation:
                        <hr style={{ marginTop: '2px', marginBottom: '2px' }} /> Total

                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12} textAlign="right">
                      <i>
                        <br />
                        {formatNumber(solarPanelDiscount)}
                        <br /> {formatNumber(inverterDiscount)}
                        <br /> {formatNumber(structureDiscount)}
                        <br /> {formatNumber(cablingDiscount)}
                        <br /> {formatNumber(netMeteringDiscount)}
                        <br /> {formatNumber(batteriesDiscount)}
                        <br /> {formatNumber(lightningArrestorDiscount)}
                        <br /> {formatNumber(installationDiscount)}
                        <hr style={{ marginTop: '2px', marginBottom: '2px' }} />
                        {formatNumber(solarPanelDiscount + inverterDiscount + structureDiscount + cablingDiscount + netMeteringDiscount + batteriesDiscount + lightningArrestorDiscount + installationDiscount)}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Shipping Charges" label="Shipping Charges"
                    // value={values.shipping_charges}
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                      if (rawValue === '') {
                        setFieldValue("shipping_charges", 0);
                        setShipping(0);
                      } else {
                        const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                        setFieldValue("shipping_charges", numberValue);
                        setShipping(numberValue);
                      }
                    }}
                    helperText={touched.shipping_charges && errors.shipping_charges} error={Boolean(touched.shipping_charges && errors.shipping_charges)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Amount Paid" label="Amount Paid"
                    onChange={(e) => {
                      const rawValue = removeCommas(e.target.value);
                      if (rawValue === '') {
                        setFieldValue("amount_paid", 0);
                        setAmountPaid(0);
                      } else {
                        setFieldValue("amount_paid", rawValue);
                        setAmountPaid(rawValue);
                      }
                    }}
                    helperText={touched.amount_paid && errors.amount_paid} error={Boolean(touched.amount_paid && errors.amount_paid)} />

                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Status"
                    fullWidth
                    name="status"
                    label="Status"
                    options={options}
                    value={options.find(option => option.value === values.status)}
                    onChange={(option) => {
                      setFieldValue("status", option.value);
                    }}
                    onBlur={handleBlur}
                    className={errors.status && touched.status ? "select-error" : ""}
                  />
                  {errors.status && touched.status && (
                    <div className="error-message" style={{ marginLeft: "6px", marginTop: "4px", fontSize: "12px", color: "red" }}>{errors.status}</div>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{
              my: 4
            }} />

            <H6 fontSize={20}>Payment Information</H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box maxWidth={320}>
                  <H6 fontSize={16} my={3}>Net Amount</H6>
                  <FlexBetween my={1}>
                    <Paragraph fontWeight={500}>Subtotal</Paragraph>
                    <Paragraph fontWeight={500}>{formatNumber(Subtotal)}</Paragraph>
                  </FlexBetween>
                  <FlexBetween my={1}>
                    <Paragraph fontWeight={500}>Discount</Paragraph>
                    <Paragraph fontWeight={500}>-&nbsp;&nbsp;&nbsp; {formatNumber(discount)}</Paragraph>
                  </FlexBetween>
                  <Divider sx={{
                    mt: 7
                  }} />
                  <FlexBetween my={2}>
                    <H6 fontSize={16}>After Discount</H6>
                    <H6 fontSize={16}>{formatNumber(Subtotal - parseInt(discount))}</H6>
                  </FlexBetween>
                </Box>
              </Grid>
              <Divider orientation="vertical"
                flexItem
                sx={{
                  mt: 5,
                  ml: 6,
                  mr: 3,
                  height: '225px',  // Adjust the height as needed
                }} />
              <Grid item md={4} sm={6} xs={12}>
                <Box maxWidth={320}>
                  <H6 fontSize={16} my={3}>Payable Amount</H6>
                  <FlexBetween my={1}>
                    <Paragraph fontWeight={500}>After Discount</Paragraph>
                    <Paragraph fontWeight={500}>{formatNumber(Subtotal - parseInt(discount))}</Paragraph>
                  </FlexBetween>

                  <FlexBetween my={1}>
                    <Paragraph fontWeight={500}>Shipping Amount</Paragraph>
                    <Paragraph fontWeight={500}>+&nbsp;&nbsp;&nbsp; {formatNumber(parseInt(shipping))}</Paragraph>
                  </FlexBetween>

                  <FlexBetween my={1}>
                    <Paragraph fontWeight={500}>Paid Amount</Paragraph>
                    <Paragraph fontWeight={500}>
                      -&nbsp;&nbsp;&nbsp;
                      <span style={{ color: "green", fontWeight: 600 }}> {formatNumber(parseInt(amountPaid))}</span>
                    </Paragraph>
                  </FlexBetween>

                  <Divider sx={{
                    my: 2
                  }} />

                  <FlexBetween my={1}>
                    <H6 fontSize={16}>Due Amount</H6>
                    <H6 fontSize={16} style={{ color: "red" }}>{formatNumber((Subtotal - parseInt(discount) + parseInt(shipping)) - parseInt(amountPaid))}</H6>
                  </FlexBetween>
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
        }} >
      </Formik>
    </Card>
  </Box>;
};

export default CreateInvoicePageView;