import { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Box, Card, Grid, styled, Button, TextField, Divider } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK
import { H6, Paragraph } from "@/components/typography"; // CUSTOM DEFINED COMPONENTS
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
const options = [
  { value: 'QUOTE', label: 'Quote' },
  { value: 'PARTIALLY_PAID', label: 'Partically Paid' },
  { value: 'PAID', label: 'Paid' }
];
const CreateInvoicePageView = () => {
  const navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL + "/api/";
  const [loading, setloading] = useState(false);
  const [solarPanelId, setsolarPanelId] = useState(null);
  const [solarPanelSpecificRecord, setsolarPanelSpecificRecord] = useState("");
  const [solarPanelData, setsolarPanelData] = useState([]);
  const [solarPanelDiscount, setSolarPanelDiscount] = useState(0);
  const [inverterId, setInverterId] = useState(null);
  const [inverterSpecificRecord, setInverterSpecificRecord] = useState("");
  const [inverterData, setInverterData] = useState([]);
  const [inverterDiscount, setInverterDiscount] = useState(0);
  const [structureId, setStructureId] = useState(null);
  const [structureSpecificRecord, setStructureSpecificRecord] = useState("");
  const [structureData, setStructureData] = useState([]);
  const [structureDiscount, setStructureDiscount] = useState(0);
  const [cablingId, setCablingId] = useState(null);
  const [cablingSpecificRecord, setCablingSpecificRecord] = useState("");
  const [cablingData, setCablingData] = useState([]);
  const [cablingDiscount, setCablingDiscount] = useState(0);
  const [netMeteringId, setNetMeteringId] = useState(null);
  const [netMeteringSpecificRecord, setNetMeteringSpecificRecord] = useState("");
  const [netMeteringData, setNetMeteringData] = useState([]);
  const [netMeteringDiscount, setNetMeteringDiscount] = useState(0);
  const [clientData, setClientData] = useState(0);
  const initialValues = {
    name: "",
    cnic: "",
    city: "",
    company: "",
    area: "",
    contact_number: "",
    monthly_consumption_units: "",
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
    discount: "",
    shipping_charges: "",
    amount_paid: "",
    status: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name To is Required!"),
    cnic: Yup.string()
      .required("CNIC is Required!")
      .matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in the format XXXXX-XXXXXXX-X')
      .test('unique', 'CNIC already exists', async function (value) {
        if (!value) return true; // Skip validation if value is not provided

        try {
          const res = await axios.get(`${baseApiUrl}Client/?format=json`);
          const existingCNICs = res?.data?.results.map(client => client.cnic);

          // Check if the CNIC already exists in the database
          return !existingCNICs.includes(value);
        } catch (err) {
          console.error(err);
          return false; // Return false if there's an error
        }
      }),
    city: Yup.string().required("City is Required!"),
    area: Yup.string().required("Area is Required!"),
    contact_number: Yup.string().required("Contact Number is Required!"),
    // solar_panel: Yup.string().required("Solar Panel is Required!"),
    solar_panel_quantity: Yup.string().required("Solar Panel Quantity is Required!"),
    solar_panel_price: Yup.string().required("Solar Panel Price is Required!"),
    // inverter: Yup.string().required("Inverter is Required!"),
    inverter_quantity: Yup.string().required("Inverter Quantity is Required!"),
    inverter_price: Yup.string().required("Inverter Price is Required!"),
    // structure: Yup.string().required("Structure is Required!"),
    structure_quantity: Yup.string().required("Structure Quantity is Required!"),
    structure_price: Yup.string().required("Structure Price is Required!"),
    // cabling: Yup.string().required("Cabling is Required!"),
    cabling_quantity: Yup.string().required("Cabling Quantity is Required!"),
    cabling_price: Yup.string().required("Cabling Price is Required!"),
    // net_metering: Yup.string().required("Net Metering is Required!"),
    net_metering_quantity: Yup.string().required("Net Metering Quantity is Required!"),
    net_metering_price: Yup.string().required("Net Metering Price is Required!"),
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
      const sortedData = res?.data?.results.sort((a, b) => a.id - b.id); // Sort by ID ascending
      const lastEnteredId = sortedData.length > 0 ? sortedData[sortedData.length - 1].id : null;

      setClientData(lastEnteredId);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getSolarPanelList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "SolarPanel/" + "?format=json");
      const Id = parseInt(solarPanelId, 10);
      const solarPanel = res?.data?.results.find((panel) => {
        return panel.id === Id;
      });
      setsolarPanelSpecificRecord(solarPanel);
      const formattedData = res?.data?.results.map((item) => ({ label: item.name, value: item.id }));
      setsolarPanelData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getInverterList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Inverter/" + "?format=json");
      const Id = parseInt(inverterId, 10);
      const inverter = res?.data?.results.find((panel) => {
        return panel.id === Id;
      });
      setInverterSpecificRecord(inverter);
      const formattedData = res?.data?.results.map((item) => ({ label: item.name, value: item.id }));
      setInverterData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getStructureList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Structure/" + "?format=json");
      const Id = parseInt(structureId, 10);
      const structure = res?.data?.results.find((panel) => {
        return panel.id === Id;
      });
      setStructureSpecificRecord(structure);
      const formattedData = res?.data?.results.map((item) => ({ label: item.name, value: item.id }));
      setStructureData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getCablingList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "Cabling/" + "?format=json");
      const Id = parseInt(cablingId, 10);
      const cabling = res?.data?.results.find((panel) => {
        return panel.id === Id;
      });
      setCablingSpecificRecord(cabling);
      const formattedData = res?.data?.results.map((item) => ({ label: item.name, value: item.id }));
      setCablingData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getNetMeteringList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "NetMetering/" + "?format=json");
      const Id = parseInt(netMeteringId, 10);
      const netMetering = res?.data?.results.find((panel) => {
        return panel.id === Id;
      });
      setNetMeteringSpecificRecord(netMetering);
      const formattedData = res?.data?.results.map((item) => ({ label: item.name, value: item.id }));
      setNetMeteringData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const postClientData = async (formData) => {
    const header = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    try {
      setloading(true);
      const res = await axios.post(baseApiUrl + "Client/", formData, header);
      if (res.status === 201) {
        setTimeout(() => {
          toast.success("Client Added Successfully");
        }, 1000);
        return res?.data?.results; // Return the response data
      }
    } catch (err) {
      toast.error("Client Not Added");
      throw err; // Throw error to stop the execution of the second request
    } finally {
      setloading(false);
    }
  };

  const postInvoiceData = async (otherData) => {
    try {
      setloading(true);
      const res = await axios.post(baseApiUrl + "Invoice/", otherData);
      if (res.status === 201) {
        setTimeout(() => {
          toast.success("Invoice Added Successfully");
        }, 1000);
        setloading(false);
        return res?.data?.results;
      }
    } catch (err) {
      toast.error("Invoice Not Added");
      setloading(false);
    }
  };

  useEffect(() => {
    getSolarPanelList();
    getInverterList();
    getStructureList();
    getCablingList();
    getNetMeteringList();
  }, []);
  useEffect(() => {
    if (solarPanelId || inverterId || structureId || cablingId || netMeteringId) {
      getSolarPanelList();
      getInverterList();
      getStructureList();
      getCablingList();
      getNetMeteringList();
    }
  }, [solarPanelId, inverterId, structureId, cablingId, netMeteringId]);
  useEffect(() => {
    // This effect will run whenever the discounts change to ensure latest values are used.
  }, [solarPanelDiscount, inverterDiscount, structureDiscount, cablingDiscount, netMeteringDiscount]);
  useEffect(() => {
    getClientList();
  }, [clientData])

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
      <H6 fontSize={20} mb={4}>
        Add Invoice
      </H6>

      <Formik initialValues={initialValues} validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const formData = {
              name: values.name,
              cnic: values.cnic,
              city: values.city,
              company: values.company,
              area: values.area,
              contact_number: values.contact_number,
              monthly_consumption_units: values.monthly_consumption_units,

            }
            console.log(formData, "formmmmmmmmmmmmmmmmmmm")
            const otherData = {
              name: clientData,
              solar_panel: values.solar_panel,
              solar_panel_quantity: values.solar_panel_quantity,
              solar_panel_price: values.solar_panel_price,
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
              discount: values.discount,
              shipping_charges: values.shipping_charges,
              amount_paid: values.amount_paid,
              status: values.status
              // total:
            }
            console.log(otherData, "otherData")
            const header = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };
            // Use Promise.all to await both requests concurrently
            const [clientResponse, invoiceResponse] = await Promise.all([
              postClientData(formData),
              postInvoiceData(otherData),
            ]);
            // Check if both requests were successful
            console.log(clientResponse, "clientResponse")
            console.log(invoiceResponse, "invoiceResponse")
            if (clientResponse && invoiceResponse) {
              setTimeout(() => {
                toast.success("Client and Invoice added successfully");
              }, 1000);
              navigate("/dashboard/invoice-list");
            } else {
              toast.error("Failed to add one or more records");
            }
          } catch (error) {
            console.error("Error submitting forms:", error);
            toast.error("Error occurred while submitting forms");
          } finally {
            setSubmitting(false);
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
                    onChange={(value) => {
                      setFieldValue("solar_panel", value.value);
                      setsolarPanelId(value.value);
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
                    }}
                    helperText={touched.solar_panel_quantity && errors.solar_panel_quantity} error={Boolean(touched.solar_panel_quantity && errors.solar_panel_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth type="number" name="Solar Panel Price" label="Solar Panel Price" value={values.solar_panel_price}
                    onChange={(e) => {
                      setFieldValue("solar_panel_price", e.target.value);
                      // Calculate discount
                      // const discount = Math.max(0, (solarPanelSpecificRecord?.price * values.solar_panel_quantity) - values.solar_panel_price);
                      // setSolarPanelDiscount(discount);
                    }}
                    helperText={touched.solar_panel_price && errors.solar_panel_price} error={Boolean(touched.solar_panel_price && errors.solar_panel_price)} />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Per Solar Panel Price:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {solarPanelSpecificRecord?.price ? solarPanelSpecificRecord?.price : 0}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Total Solar Panel Price: {solarPanelSpecificRecord?.price} X {values.solar_panel_quantity ? values.solar_panel_quantity : 0} =
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {isNaN(solarPanelSpecificRecord?.price * values.solar_panel_quantity) ? 0 : solarPanelSpecificRecord?.price * values.solar_panel_quantity}
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
                            const total = solarPanelSpecificRecord?.price * values.solar_panel_quantity;
                            const discount = isNaN(total - values.solar_panel_price) ? 0 : Math.max(0, total - values.solar_panel_price);
                            setSolarPanelDiscount(discount);
                            return discount;
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
                    onChange={(value) => {
                      setFieldValue("inverter", value.value);
                      setInverterId(value.value);
                    }}
                    helperText={touched.inverter && errors.inverter}
                    error={Boolean(touched.inverter && errors.inverter)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Inverter Quantity" label="Inverter Quantity" value={values.inverter_quantity}
                    onChange={(e) => {
                      setFieldValue("inverter_quantity", e.target.value);
                    }}
                    helperText={touched.inverter_quantity && errors.inverter_quantity} error={Boolean(touched.inverter_quantity && errors.inverter_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Inverter Price" label="Inverter Price" value={values.inverter_price}
                    onChange={(e) => {
                      setFieldValue("inverter_price", e.target.value);
                      const discount = Math.max(0, (inverterSpecificRecord?.price * values.inverter_quantity) - values.inverter_price);
                      setInverterDiscount(discount);
                    }}
                    helperText={touched.inverter_price && errors.inverter_price} error={Boolean(touched.inverter_price && errors.inverter_price)} />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Per Inverter Price:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {inverterSpecificRecord?.price ? inverterSpecificRecord?.price : 0}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Total Inverter Price: {inverterSpecificRecord?.price} X {values.inverter_quantity ? values.inverter_quantity : 0} =
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {isNaN(inverterSpecificRecord?.price * values.inverter_quantity) ? 0 : inverterSpecificRecord?.price * values.inverter_quantity}
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
                            const total = inverterSpecificRecord?.price * values.inverter_quantity;
                            const discount = isNaN(total - values.inverter_price) ? 0 : Math.max(0, total - values.inverter_price);
                            setInverterDiscount(discount);
                            return discount;
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
              Structure Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Structure"
                    fullWidth name="Structure" label="Structure"
                    options={structureData}
                    onChange={(value) => {
                      setFieldValue("structure", value.value);
                      setStructureId(value.value);
                    }}
                    helperText={touched.structure && errors.structure}
                    error={Boolean(touched.structure && errors.structure)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Structure Quantity" label="Structure Quantity" value={values.structure_quantity}
                    onChange={(e) => {
                      setFieldValue("structure_quantity", e.target.value);
                    }}
                    helperText={touched.structure_quantity && errors.structure_quantity} error={Boolean(touched.structure_quantity && errors.structure_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Structure Price" label="Structure Price" value={values.structure_price}
                    onChange={(e) => {
                      setFieldValue("structure_price", e.target.value);
                      const discount = Math.max(0, (structureSpecificRecord?.price * values.structure_quantity) - values.structure_price);
                      setStructureDiscount(discount);
                    }}
                    helperText={touched.structure_price && errors.structure_price} error={Boolean(touched.structure_price && errors.structure_price)} />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Per Structure Price:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {structureSpecificRecord?.price ? structureSpecificRecord?.price : 0}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Total structure Price: {structureSpecificRecord?.price} X {values.structure_quantity ? values.structure_quantity : 0} =
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {isNaN(structureSpecificRecord?.price * values.structure_quantity) ? 0 : structureSpecificRecord?.price * values.structure_quantity}
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
                            const total = structureSpecificRecord?.price * values.structure_quantity;
                            const discount = isNaN(total - values.structure_price) ? 0 : Math.max(0, total - values.structure_price);
                            setStructureDiscount(discount);
                            return discount;
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
              Cabling Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Cabling"
                    fullWidth name="Cabling" label="Cabling"
                    options={cablingData}
                    onChange={(value) => {
                      setFieldValue("cabling", value.value);
                      setCablingId(value.value);
                    }}
                    helperText={touched.cabling && errors.cabling}
                    error={Boolean(touched.cabling && errors.cabling)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Cabling Quantity" label="Cabling Quantity" value={values.cabling_quantity}
                    onChange={(e) => {
                      setFieldValue("cabling_quantity", e.target.value);
                    }}
                    helperText={touched.cabling_quantity && errors.cabling_quantity} error={Boolean(touched.cabling_quantity && errors.cabling_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Cabling Price" label="Cabling Price" value={values.cabling_price}
                    onChange={(e) => {
                      setFieldValue("cabling_price", e.target.value);
                      const discount = Math.max(0, (cablingSpecificRecord?.price * values.cabling_quantity) - values.cabling_price);
                      setCablingDiscount(discount);
                    }}
                    helperText={touched.cabling_price && errors.cabling_price} error={Boolean(touched.cabling_price && errors.cabling_price)} />
                  <FlexBetween mt={1} mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Per Cabling Price:
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {cablingSpecificRecord?.price ? cablingSpecificRecord?.price : 0}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Total Cabling Price: {cablingSpecificRecord?.price} X {values.cabling_quantity ? values.cabling_quantity : 0} =
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {isNaN(cablingSpecificRecord?.price * values.cabling_quantity) ? 0 : cablingSpecificRecord?.price * values.cabling_quantity}
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
                            const total = cablingSpecificRecord?.price * values.cabling_quantity;
                            const discount = isNaN(total - values.cabling_price) ? 0 : Math.max(0, total - values.cabling_price);
                            setCablingDiscount(discount);
                            return discount;
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
              Net Metering Information
            </H6>
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <Select
                    placeholder="Net Metering"
                    fullWidth name="Net Metering" label="Net Metering"
                    options={netMeteringData}
                    onChange={(value) => {
                      setFieldValue("net_metering", value.value);
                      setNetMeteringId(value.value);
                    }}
                    helperText={touched.net_metering && errors.net_metering}
                    error={Boolean(touched.net_metering && errors.net_metering)}
                  />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Net Metering Quantity" label="Net Metering Quantity" value={values.net_metering_quantity}
                    onChange={(e) => {
                      setFieldValue("net_metering_quantity", e.target.value);
                    }}
                    helperText={touched.net_metering_quantity && errors.net_metering_quantity} error={Boolean(touched.net_metering_quantity && errors.net_metering_quantity)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Net Metering Price" label="Net Metering Price" value={values.net_metering_price}
                    onChange={(e) => {
                      setFieldValue("net_metering_price", e.target.value);
                      const discount = Math.max(0, (netMeteringSpecificRecord?.price * values.net_metering_quantity) - values.net_metering_price);
                      setNetMeteringDiscount(discount);
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
                        {netMeteringSpecificRecord?.price ? netMeteringSpecificRecord?.price : 0}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                  <FlexBetween mx={1}>
                    <Paragraph fontWeight={500} fontSize={12} color="grey">
                      <i>
                        Total Net Metering Price: {netMeteringSpecificRecord?.price} X {values.net_metering_quantity ? values.net_metering_quantity : 0} =
                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        {isNaN(netMeteringSpecificRecord?.price * values.net_metering_quantity) ? 0 : netMeteringSpecificRecord?.price * values.net_metering_quantity}
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
                            return discount;
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
                  <TextField fullWidth name="Discount" label="Discount" value={values.discount}
                    onChange={(e) => {
                      setFieldValue("discount", e.target.value);
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
                        <hr style={{ marginTop: '2px', marginBottom: '2px' }} /> Total

                      </i>
                    </Paragraph>
                    <Paragraph fontWeight={500} fontSize={12}>
                      <i>
                        <br />
                        {solarPanelDiscount}
                        <br /> {inverterDiscount}
                        <br /> {structureDiscount}
                        <br /> {cablingDiscount}
                        <br /> {netMeteringDiscount}
                        <hr style={{ marginTop: '2px', marginBottom: '2px' }} />
                        {solarPanelDiscount + inverterDiscount + structureDiscount + cablingDiscount + netMeteringDiscount}
                      </i>
                    </Paragraph>
                  </FlexBetween>
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Shipping Charges" label="Shipping Charges" value={values.shipping_charges}
                    onChange={(e) => {
                      setFieldValue("shipping_charges", e.target.value);
                    }}
                    helperText={touched.shipping_charges && errors.shipping_charges} error={Boolean(touched.shipping_charges && errors.shipping_charges)} />
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  <TextField fullWidth name="Amount Paid" label="Amount Paid" value={values.amount_paid}
                    onChange={(e) => {
                      setFieldValue("amount_paid", e.target.value);
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
                    // Error handling
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
            <Box maxWidth={320}>
              <H6 fontSize={16}>Amount</H6>

              <FlexBetween my={1}>
                <Paragraph fontWeight={500}>Subtotal</Paragraph>
                <Paragraph fontWeight={500}>$428.00</Paragraph>
              </FlexBetween>

              <FlexBetween my={1}>
                <Paragraph fontWeight={500}>Discount (BLACKFRIDAY)</Paragraph>
                <Paragraph fontWeight={500}>-$8.00</Paragraph>
              </FlexBetween>

              <FlexBetween my={1}>
                <Paragraph fontWeight={500}>VAT</Paragraph>
                <Paragraph fontWeight={500}>$20.00</Paragraph>
              </FlexBetween>

              <Divider sx={{
                my: 2
              }} />

              <FlexBetween my={1}>
                <H6 fontSize={16}>Total</H6>
                <H6 fontSize={16}>$20.00</H6>
              </FlexBetween>
            </Box>

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

export default CreateInvoicePageView;