import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Formik, setIn } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Card,
  Grid,
  styled,
  Button,
  TextField,
  Divider,
  Typography,
} from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK
import { H6, Paragraph } from "@/components/typography"; // CUSTOM DEFINED COMPONENTS
import { FlexBetween } from "@/components/flexbox";

import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import DynamicFields from "@/components/dynamic-input/edit";

const StyledFlexBox = styled(FlexBetween)(({ theme }) => ({
  marginBottom: 30,
  [theme.breakpoints.down(750)]: {
    "& .MuiFormGroup-root": {
      marginBottom: 10,
    },
  },
}));
const options = [
  { value: "QUOTE", label: "Quote" },
  { value: "PARTIALLY_PAID", label: "Partically Paid" },
  { value: "PAID", label: "Paid" },
];
const UpdateInvoicePageView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseApiUrl = import.meta.env.VITE_API_URL;
  const [loading, setloading] = useState(false);
  const [clientResponse, setClientResponse] = useState(false);
  const [invoiceResponse, setInvoiceResponse] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [invoicedClientId, setInvoicedClientId] = useState(0);
  const [total, setTotal] = useState(0);
  const [installmentData, setInstallmentData] = useState([]);
  const [solarPanelId, setsolarPanelId] = useState(0);
  const [solarPanelSpecificRecord, setsolarPanelSpecificRecord] = useState("");
  const [solarPanelData, setsolarPanelData] = useState([]);
  const [solarPanelDiscount, setSolarPanelDiscount] = useState(0);
  const [solarPanelPrice, setSolarPanelPrice] = useState(0);
  const [solarPanelPrices, setSolarPanelPrices] = useState([]);
  const [solarPanelQuantities, setSolarPanelQuantities] = useState([]);
  const [inverterPrices, setInverterPrices] = useState([]);
  const [inverterQuantities, setInverterQuantities] = useState([]);
  const [cablingPrices, setCablingPrices] = useState([]);
  const [cablingQuantities, setCablingQuantities] = useState([]);
  const [structurePrices, setStructurePrices] = useState([]);
  const [structureQuantities, setStructureQuantities] = useState([]);
  const [netMeteringPrices, setNetMeteringPrices] = useState([]);
  const [netMeteringQuantities, setNetMeteringQuantities] = useState([]);
  const [batteriesPrices, setBatteriesPrices] = useState([]);
  const [batteriesQuantities, setBatteriesQuantities] = useState([]);
  const [lightningArrestorPrices, setLightningArrestorPrices] = useState([]);
  const [lightningArrestorQuantities, setLightningArrestorQuantities] =
    useState([]);
  const [installationPrices, setInstallationPrices] = useState([]);
  const [installationQuantities, setInstallationQuantities] = useState([]);
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
  const [netMeteringSpecificRecord, setNetMeteringSpecificRecord] =
    useState("");
  const [netMeteringData, setNetMeteringData] = useState([]);
  const [netMeteringDiscount, setNetMeteringDiscount] = useState(0);
  const [netMeteringPrice, setNetMeteringPrice] = useState(0);
  const [installationId, setInstallationId] = useState(null);
  const [installationSpecificRecord, setInstallationSpecificRecord] =
    useState("");
  const [installationData, setInstallationData] = useState([]);
  const [installationDiscount, setInstallationDiscount] = useState(0);
  const [installationPrice, setInstallationPrice] = useState(0);
  const [batteriesId, setBatteriesId] = useState(null);
  const [batteriesSpecificRecord, setBatteriesSpecificRecord] = useState("");
  const [batteriesData, setBatteriesData] = useState([]);
  const [batteriesDiscount, setBatteriesDiscount] = useState(0);
  const [batteriesPrice, setBatteriesPrice] = useState(0);
  const [lightningArrestorId, setLightningArrestorId] = useState(null);
  const [lightningArrestorSpecificRecord, setLightningArrestorSpecificRecord] =
    useState("");
  const [lightningArrestorData, setLightningArrestorData] = useState([]);
  const [lightningArrestorDiscount, setLightningArrestorDiscount] = useState(0);
  const [lightningArrestorPrice, setLightningArrestorPrice] = useState(0);
  const [clientData, setClientData] = useState([]);
  const [expendituresData, setExpendituresData] = useState([]);
  const [solarPanelQuantity, setSolarPanelQuantity] = useState(0);
  const [solarPanelT, setSolarPanelT] = useState(0);
  const [inverterQuantity, setInverterQuantity] = useState(0);
  const [structureQuantity, setStructureQuantity] = useState(0);
  const [cablingQuantity, setCablingQuantity] = useState(0);
  const [netMeteringQuantity, setNetMeteringQuantity] = useState(0);
  const [batteriesQuantity, setBatteriesQuantity] = useState(0);
  const [lightningArrestorQuantity, setLightningArrestorQuantity] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [partiallyPaid, setPartiallyPaid] = useState(0);
  const [Subtotal, setSubtotal] = useState(0);
  const [clientInitialValues, setClientInitialValues] = useState({
    name: "",
    cnic: "",
    city: "",
    company: "",
    area: "",
    contact_number: "",
    monthly_consumption_units: "",
  });
  const [initialValues, setInitialValues] = useState({
    name: "",
    solar_panel: "",
    solar_panel1: "",
    solar_panel2: "",
    solar_panel3: "",
    solar_panel4: "",
    solar_panel_quantity: "",
    solar_panel_quantity1: "",
    solar_panel_quantity2: "",
    solar_panel_quantity3: "",
    solar_panel_quantity4: "",
    solar_panel_price: "",
    solar_panel_price1: "",
    solar_panel_price2: "",
    solar_panel_price3: "",
    solar_panel_price4: "",
    inverter: "",
    inverter1: "",
    inverter2: "",
    inverter3: "",
    inverter4: "",
    inverter_quantity: "",
    inverter_quantity1: "",
    inverter_quantity2: "",
    inverter_quantity3: "",
    inverter_quantity4: "",
    inverter_price: "",
    inverter_price1: "",
    inverter_price2: "",
    inverter_price3: "",
    inverter_price4: "",
    structure: "",
    structure1: "",
    structure2: "",
    structure3: "",
    structure4: "",
    structure_quantity: "",
    structure_quantity1: "",
    structure_quantity2: "",
    structure_quantity3: "",
    structure_quantity4: "",
    structure_price: "",
    structure_price1: "",
    structure_price2: "",
    structure_price3: "",
    structure_price4: "",
    cabling: "",
    cabling1: "",
    cabling2: "",
    cabling3: "",
    cabling4: "",
    cabling_quantity: "",
    cabling_quantity1: "",
    cabling_quantity2: "",
    cabling_quantity3: "",
    cabling_quantity4: "",
    cabling_price: "",
    cabling_price1: "",
    cabling_price2: "",
    cabling_price3: "",
    cabling_price4: "",
    net_metering: "",
    net_metering1: "",
    net_metering2: "",
    net_metering3: "",
    net_metering4: "",
    net_metering_quantity: "",
    net_metering_quantity1: "",
    net_metering_quantity2: "",
    net_metering_quantity3: "",
    net_metering_quantity4: "",
    net_metering_price: "",
    net_metering_price1: "",
    net_metering_price2: "",
    net_metering_price3: "",
    net_metering_price4: "",
    battery: "",
    battery1: "",
    battery2: "",
    battery3: "",
    battery4: "",
    battery_quantity: "",
    battery_quantity1: "",
    battery_quantity2: "",
    battery_quantity3: "",
    battery_quantity4: "",
    battery_price: "",
    battery_price1: "",
    battery_price2: "",
    battery_price3: "",
    battery_price4: "",
    lightning_arrestor: "",
    lightning_arrestor1: "",
    lightning_arrestor2: "",
    lightning_arrestor3: "",
    lightning_arrestor4: "",
    lightning_arrestor_quantity: "",
    lightning_arrestor_quantity1: "",
    lightning_arrestor_quantity2: "",
    lightning_arrestor_quantity3: "",
    lightning_arrestor_quantity4: "",
    lightning_arrestor_price: "",
    lightning_arrestor_price1: "",
    lightning_arrestor_price2: "",
    lightning_arrestor_price3: "",
    lightning_arrestor_price4: "",
    installation: "",
    installation_quantity: 0,
    installation_price: "",
    discount: "",
    shipping_charges: "",
    amount_paid: 0,
    status: "",
  });
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
    amount_paid: Yup.string().when("status", {
      is: (value) => value && (value === "PARTIALLY_PAID" || value === "PAID"),
      then: Yup.string().required("Paid Amount is Required!"),
      otherwise: Yup.string().notRequired(),
    }),
    status: Yup.string()
      .required("Status is Required!")
      .oneOf(
        ["QUOTE", "PARTIALLY_PAID", "PAID"],
        "Status Selection must be Partially Paid or Paid"
      ),
  });
  const handleCancel = () => navigate("/dashboard/invoice-list");

  const getClientList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "/api/Client/" + "?format=json");
      const resInvoice = await axios.get(
        baseApiUrl + "/api/Invoice/" + "?format=json"
      );
      const InvoiceData = resInvoice?.data;
      const ClientData = res?.data;
      const InvoiceId = parseInt(id, 10);
      // const ClientId = parseInt(id, 10);

      const Invoice = InvoiceData.find((panel) => {
        return panel.id === InvoiceId;
      });
      const Client = ClientData.find((panel) => {
        return panel.id === Invoice.name;
      });
      if (Client) {
        setClientInitialValues({
          name: Client.name,
          cnic: Client.cnic,
          city: Client.city,
          company: Client.company,
          area: Client.area,
          contact_number: Client.contact_number,
          monthly_consumption_units: Client.monthly_consumption_units,
        });
      }
      const formattedData = res?.data
        ?.map((item) => ({
          label: (
            <Grid container spacing={3}>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>{item.name}</Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>
                  {item.area}, {item.city}
                </Box>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Box marginBottom={0}>{item.contact_number}</Box>
              </Grid>
            </Grid>
          ),
          value: item.id,
        }))
        .reverse();
      setClientData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getInvoiceList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/Invoice/" + "?format=json"
      );
      const InvoiceData = res?.data;
      const InvoiceId = parseInt(id, 10);
      const invoicedClientId = InvoiceData.find((panel) => {
        return panel.id === InvoiceId;
      });
      setInvoicedClientId(invoicedClientId?.name);
      const Invoice = InvoiceData.find((panel) => {
        return panel.id === InvoiceId;
      });
      if (Invoice) {
        setInitialValues({
          name: Invoice.name,

          solar_panel: Invoice.solar_panel,
          solar_panel1: Invoice.solar_panel1,
          solar_panel2: Invoice.solar_panel2,
          solar_panel3: Invoice.solar_panel3,
          solar_panel4: Invoice.solar_panel4,

          solar_panel_quantity: Invoice.solar_panel_quantity,
          solar_panel_quantity1: Invoice.solar_panel_quantity1,
          solar_panel_quantity2: Invoice.solar_panel_quantity2,
          solar_panel_quantity3: Invoice.solar_panel_quantity3,
          solar_panel_quantity4: Invoice.solar_panel_quantity4,

          solar_panel_price: Invoice.solar_panel_price,
          solar_panel_price1: Invoice.solar_panel_price1,
          solar_panel_price2: Invoice.solar_panel_price2,
          solar_panel_price3: Invoice.solar_panel_price3,
          solar_panel_price4: Invoice.solar_panel_price4,

          inverter: Invoice.inverter,
          inverter1: Invoice.inverter1,
          inverter2: Invoice.inverter2,
          inverter3: Invoice.inverter3,
          inverter4: Invoice.inverter4,

          inverter_quantity: Invoice.inverter_quantity,
          inverter_quantity1: Invoice.inverter_quantity1,
          inverter_quantity2: Invoice.inverter_quantity2,
          inverter_quantity3: Invoice.inverter_quantity3,
          inverter_quantity4: Invoice.inverter_quantity4,

          inverter_price: Invoice.inverter_price,
          inverter_price1: Invoice.inverter_price1,
          inverter_price2: Invoice.inverter_price2,
          inverter_price3: Invoice.inverter_price3,
          inverter_price4: Invoice.inverter_price4,

          structure: Invoice.structure,
          structure1: Invoice.structure1,
          structure2: Invoice.structure2,
          structure3: Invoice.structure3,
          structure4: Invoice.structure4,

          structure_quantity: Invoice.structure_quantity,
          structure_quantity1: Invoice.structure_quantity1,
          structure_quantity2: Invoice.structure_quantity2,
          structure_quantity3: Invoice.structure_quantity3,
          structure_quantity4: Invoice.structure_quantity4,

          structure_price: Invoice.structure_price,
          structure_price1: Invoice.structure_price1,
          structure_price2: Invoice.structure_price2,
          structure_price3: Invoice.structure_price3,
          structure_price4: Invoice.structure_price4,

          cabling: Invoice.cabling,
          cabling1: Invoice.cabling1,
          cabling2: Invoice.cabling2,
          cabling3: Invoice.cabling3,
          cabling4: Invoice.cabling4,

          cabling_quantity: Invoice.cabling_quantity,
          cabling_quantity1: Invoice.cabling_quantity1,
          cabling_quantity2: Invoice.cabling_quantity2,
          cabling_quantity3: Invoice.cabling_quantity3,
          cabling_quantity4: Invoice.cabling_quantity4,

          cabling_price: Invoice.cabling_price,
          cabling_price1: Invoice.cabling_price1,
          cabling_price2: Invoice.cabling_price2,
          cabling_price3: Invoice.cabling_price3,
          cabling_price4: Invoice.cabling_price4,

          net_metering: Invoice.net_metering,
          net_metering1: Invoice.net_metering1,
          net_metering2: Invoice.net_metering2,
          net_metering3: Invoice.net_metering3,
          net_metering4: Invoice.net_metering4,

          net_metering_quantity: Invoice.net_metering_quantity,
          net_metering_quantity1: Invoice.net_metering_quantity1,
          net_metering_quantity2: Invoice.net_metering_quantity2,
          net_metering_quantity3: Invoice.net_metering_quantity3,
          net_metering_quantity4: Invoice.net_metering_quantity4,

          net_metering_price: Invoice.net_metering_price,
          net_metering_price1: Invoice.net_metering_price1,
          net_metering_price2: Invoice.net_metering_price2,
          net_metering_price3: Invoice.net_metering_price3,
          net_metering_price4: Invoice.net_metering_price4,

          battery: Invoice.battery,
          battery1: Invoice.battery1,
          battery2: Invoice.battery2,
          battery3: Invoice.battery3,
          battery4: Invoice.battery4,

          battery_quantity: Invoice.battery_quantity,
          battery_quantity1: Invoice.battery_quantity1,
          battery_quantity2: Invoice.battery_quantity2,
          battery_quantity3: Invoice.battery_quantity3,
          battery_quantity4: Invoice.battery_quantity4,

          battery_price: Invoice.battery_price,
          battery_price1: Invoice.battery_price1,
          battery_price2: Invoice.battery_price2,
          battery_price3: Invoice.battery_price3,
          battery_price4: Invoice.battery_price4,

          lightning_arrestor: Invoice.lightning_arrestor,
          lightning_arrestor1: Invoice.lightning_arrestor1,
          lightning_arrestor2: Invoice.lightning_arrestor2,
          lightning_arrestor3: Invoice.lightning_arrestor3,
          lightning_arrestor4: Invoice.lightning_arrestor4,

          lightning_arrestor_quantity: Invoice.lightning_arrestor_quantity,
          lightning_arrestor_quantity1: Invoice.lightning_arrestor_quantity1,
          lightning_arrestor_quantity2: Invoice.lightning_arrestor_quantity2,
          lightning_arrestor_quantity3: Invoice.lightning_arrestor_quantity3,
          lightning_arrestor_quantity4: Invoice.lightning_arrestor_quantity4,

          lightning_arrestor_price: Invoice.lightning_arrestor_price,
          lightning_arrestor_price1: Invoice.lightning_arrestor_price1,
          lightning_arrestor_price2: Invoice.lightning_arrestor_price2,
          lightning_arrestor_price3: Invoice.lightning_arrestor_price3,
          lightning_arrestor_price4: Invoice.lightning_arrestor_price4,

          installation: Invoice.installation,
          installation_quantity: Invoice.installation_quantity,
          installation_price: Invoice.installation_price,
          discount: Invoice.discount,
          shipping_charges: Invoice.shipping_charges,
          system_capacity: Invoice.system_capacity,
          // amount_paid: Invoice.amount_paid,
          status: Invoice.status,
        });
        // console.log(Invoice, "zxcvbnmmnbv")
        setInvoiceData(Invoice);
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getPartiallyPaidList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "/invoice/" + "?format=json");
      const invoiceData = res?.data;
      const invoiceId = parseInt(id, 10);
      const invoicedClientId = invoiceData.find((panel) => {
        return panel.id === invoiceId;
      });

      if (
        invoicedClientId &&
        Array.isArray(invoicedClientId.partial_payments)
      ) {
        let amounts = []; // Array to store individual amounts
        let sum = invoicedClientId.partial_payments.reduce((acc, paid) => {
          const amount = parseFloat(paid.amount); // Ensure amount is a number
          amounts.push(amount); // Store each amount
          return acc + (isNaN(amount) ? 0 : amount); // Handle potential NaN values
        }, 0);

        // console.log(amounts, "Individual amounts"); // Display individual amounts
        // console.log(sum, "Sum of partial payments"); // Display the sum
        setPartiallyPaid(sum);
      } else {
        console.log("partial_payments is not an array or is undefined.");
      }

      // console.log(sum, "bbbbbbbbbbbb")
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getInstallmentList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "/invoice/" + "?format=json");
      const InstallmentData = res?.data;
      const InstallmentId = parseInt(id, 10);
      const Installment = InstallmentData.find((panel) => {
        return panel.id === InstallmentId;
      });
      // console.log(Installment.partial_payments, "zxcvbnmmnbv")
      setInstallmentData(Installment.partial_payments);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getExpendituresList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/Expenditures/" + "?format=json"
      );
      const ExpendituresData = res?.data;
      const ExpendituresId = parseInt(id, 10);
      const Expenditures = ExpendituresData.filter((panel) => {
        return panel.inv_id === ExpendituresId;
      });
      // console.log(Expenditures, "Expenditures")
      setExpendituresData(Expenditures);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getSolarPanelList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/SolarPanel/" + "?format=json"
      );
      const Id = parseInt(solarPanelId, 10);
      const solarPanel = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      // console.log(Id, "solarPanel")
      setsolarPanelSpecificRecord(solarPanel);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setsolarPanelData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getInverterList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/Inverter/" + "?format=json"
      );
      const Id = parseInt(inverterId, 10);
      const inverter = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setInverterSpecificRecord(inverter);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setInverterData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getStructureList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/Structure/" + "?format=json"
      );
      const Id = parseInt(structureId, 10);
      const structure = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setStructureSpecificRecord(structure);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setStructureData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getCablingList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/Cabling/" + "?format=json"
      );
      const Id = parseInt(cablingId, 10);
      const cabling = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setCablingSpecificRecord(cabling);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setCablingData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getNetMeteringList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/NetMetering/" + "?format=json"
      );
      const Id = parseInt(netMeteringId, 10);
      const netMetering = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setNetMeteringSpecificRecord(netMetering);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setNetMeteringData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getBatteriesList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/Batteries/" + "?format=json"
      );
      const Id = parseInt(batteriesId, 10);
      const batteries = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setBatteriesSpecificRecord(batteries);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setBatteriesData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getLightningArrestorList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/LightningArrestor/" + "?format=json"
      );
      const Id = parseInt(lightningArrestorId, 10);
      const lightningArrestor = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setLightningArrestorSpecificRecord(lightningArrestor);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setLightningArrestorData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const getInstallationList = async () => {
    try {
      const res = await axios.get(
        baseApiUrl + "/api/Installation/" + "?format=json"
      );
      const Id = parseInt(installationId, 10);
      const installation = res?.data?.find((panel) => {
        return panel.id === Id;
      });
      setInstallationSpecificRecord(installation);
      const formattedData = res?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setInstallationData(formattedData);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const totalSum = installmentData.reduce(
    (sum, installment) => sum + installment.amount,
    0
  );
  const totalSumExpenditure = expendituresData.reduce(
    (sum, expenditure) => sum + expenditure.value,
    0
  );

  useEffect(() => {
    // setInvoiceData([12, 45]);
    const getList = async () => {
      try {
        const res = await axios.get(
          baseApiUrl + "/api/Invoice/" + "?format=json"
        );
        const InvoiceData = res?.data;
        // console.log(InvoiceData, "invoice---Data")
        const InvoiceId = parseInt(id, 10);
        const Invoice = InvoiceData.find((panel) => {
          return panel.id === InvoiceId;
        });
        if (Invoice) {
          // console.log(Invoice, "invoiceData")

          const solarPanelQuantity = Invoice.solar_panel_quantity;
          const solarPanelPrice = parseFloat(Invoice.solar_panel_price);
          const inverterQuantity = Invoice.inverter_quantity;
          const inverterPrice = parseFloat(Invoice.inverter_price);
          const structureQuantity = Invoice.structure_quantity;
          const structurePrice = parseFloat(Invoice.structure_price);
          const cablingQuantity = Invoice.cabling_quantity;
          const cablingPrice = parseFloat(Invoice.cabling_price);
          const netMeteringQuantity = Invoice.net_metering_quantity;
          const netMeteringPrice = parseFloat(Invoice.net_metering_price);
          const batteriesQuantity = Invoice.battery_quantity;
          const batteriesPrice = parseFloat(Invoice.battery_price);
          const lightningArrestorQuantity = Invoice.lightning_arrestor_quantity;
          const lightningArrestorPrice = parseFloat(
            Invoice.lightning_arrestor_price
          );
          const installationPrice = parseFloat(Invoice.installation_price);

          // Calculate the total sum directly
          const totalSum =
            (solarPanelQuantity * solarPanelPrice || 0) +
            (inverterQuantity * inverterPrice || 0) +
            (cablingQuantity * cablingPrice || 0) +
            (structureQuantity * structurePrice || 0) +
            (netMeteringQuantity * netMeteringPrice || 0) +
            (batteriesQuantity * batteriesPrice || 0) +
            (lightningArrestorQuantity * lightningArrestorPrice || 0) +
            (installationPrice || 0);

          // console.log("Total S-um:", totalSum);
          setTotal(totalSum);

          // Set state if necessary
          setInvoiceData(Invoice);
          setSolarPanelQuantity(solarPanelQuantity);
          setSolarPanelPrice(solarPanelPrice);
          setInverterQuantity(inverterQuantity);
          setInverterPrice(inverterPrice);
          setStructureQuantity(structureQuantity);
          setStructurePrice(structurePrice);
          setCablingQuantity(cablingQuantity);
          setCablingPrice(cablingPrice);
          setNetMeteringQuantity(netMeteringQuantity);
          setNetMeteringPrice(netMeteringPrice);
          setBatteriesQuantity(batteriesQuantity);
          setBatteriesPrice(batteriesPrice);
          setLightningArrestorQuantity(lightningArrestorQuantity);
          setLightningArrestorPrice(lightningArrestorPrice);
          setInstallationPrice(installationPrice);
          setsolarPanelId(Invoice.solar_panel);
          setInverterId(Invoice.inverter);
          setStructureId(Invoice.structure);
          setCablingId(Invoice.cabling);
          setNetMeteringId(Invoice.net_metering);
          setBatteriesId(Invoice.battery);
          setLightningArrestorId(Invoice.lightning_arrestor);
          setInstallationId(Invoice.installation);
          setDiscount(Invoice.discount);
          setShipping(Invoice.shipping_charges);
          setInvoiceData(Invoice);
        }
      } catch (err) {
        console.log(err.response.data);
      }
    };
    getList();
    getPartiallyPaidList();
    getClientList();
    getInvoiceList();
    getInstallmentList();
    getExpendituresList();
    getSolarPanelList();
    getInverterList();
    getStructureList();
    getCablingList();
    getNetMeteringList();
    getBatteriesList();
    getLightningArrestorList();
    getInstallationList();
    // console.log(getInvoiceList(), " mjjjjjjjjjjjjjj");
  }, []);

  useEffect(() => {
    if (
      solarPanelId ||
      inverterId ||
      structureId ||
      cablingId ||
      netMeteringId ||
      batteriesId ||
      lightningArrestorId ||
      installationId
    ) {
      getSolarPanelList();
      getInverterList();
      getStructureList();
      getCablingList();
      getNetMeteringList();
      getBatteriesList();
      getLightningArrestorList();
      getInstallationList();
    }
  }, [
    solarPanelId,
    inverterId,
    structureId,
    cablingId,
    netMeteringId,
    batteriesId ||
      lightningArrestorId ||
      installationId ||
      clientResponse ||
      invoiceResponse,
  ]);

  // console.log(invoiceData, "qweruiopoi")
  useEffect(() => {
    // This effect will run whenever the discounts change to ensure latest values are used.
  }, [
    solarPanelDiscount,
    inverterDiscount,
    structureDiscount,
    cablingDiscount,
    netMeteringDiscount,
    batteriesId,
    lightningArrestorId,
    installationId || clientResponse || invoiceResponse,
  ]);

  // Function to format number with commas
  const formatNumber = (value) => {
    // if (!value) return '';
    // return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Return '0' if the value is falsy (null, undefined, or an empty string)
    if (value === null || value === undefined || value === "") return "0";

    // Convert the value to a number and use Math.floor to remove decimals
    const num = Math.floor(Number(value));

    // Format the number with commas and return it
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to remove commas for calculation
  const removeCommas = (value) => {
    return value.toString().replace(/,/g, "");
  };

  const [isModalVisible, setModalVisible] = useState(false);

  // Handler for scroll event
  const handleScroll = () => {
    const scrollPosition = window.scrollY; // or you can use event.target.scrollTop for a container
    // console.log('Scroll position:', scrollPosition);

    // Set visibility based on scroll position
    if (scrollPosition > 300 && scrollPosition < 2700) {
      // Adjust these values to your needs
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };
  useEffect(() => {
    const allPrices = {
      solarPanel: solarPanelPrices,
      inverter: inverterPrices,
      cabling: cablingPrices,
      structure: structurePrices,
      netMetering: netMeteringPrices,
      batteries: batteriesPrices,
      lightningArrestor: lightningArrestorPrices,
    };

    const allQuantities = {
      solarPanel: solarPanelQuantities,
      inverter: inverterQuantities,
      cabling: cablingQuantities,
      structure: structureQuantities,
      netMetering: netMeteringQuantities,
      batteries: batteriesQuantities,
      lightningArrestor: lightningArrestorQuantities,
    };

    let total = 0;

    Object.keys(allPrices).forEach((category) => {
      const priceObj = allPrices[category] || {};
      const quantityObj = allQuantities[category] || {};

      Object.keys(priceObj).forEach((key) => {
        const price = parseFloat(priceObj[key]) || 0;
        const quantity = parseFloat(quantityObj[key]) || 0;
        total += price * quantity;
      });
    });

    const installation = parseFloat(installationPrice) || 0;
    const finalTotal = total + installation;

    setSubtotal(finalTotal);
  }, [
    solarPanelPrices,
    solarPanelQuantities,
    inverterPrices,
    inverterQuantities,
    cablingPrices,
    cablingQuantities,
    structurePrices,
    structureQuantities,
    netMeteringPrices,
    netMeteringQuantities,
    batteriesPrices,
    batteriesQuantities,
    lightningArrestorPrices,
    lightningArrestorQuantities,
    installationPrice,
  ]);

  // Attach scroll event listener on mount and detach it on unmount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Box pt={2} pb={4}>
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
            position: "sticky",
            top: "74px",
            marginLeft: "auto",
            width: "25%",
            backgroundColor: "white",
            zIndex: 1000,
            padding: "8px",
            paddingLeft: "12px",
            paddingRight: "12px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <FlexBetween my={1}>
            <p style={{ fontSize: "16px", fontWeight: 600 }}>Due Amount</p>
            <Typography variant="h6" fontSize={12} sx={{ color: "red" }}>
              {/* Replace with your formatted number */}
              {formatNumber(
                Subtotal -
                  parseInt(discount) +
                  parseInt(shipping) -
                  parseInt(amountPaid) -
                  parseInt(partiallyPaid)
              )}
            </Typography>
          </FlexBetween>
        </Box>
      )}
      <Card
        sx={{
          padding: 3,
          position: "relative",
        }}
      >
        <H6 fontSize={22} mb={4}>
          Update Invoice
        </H6>
        {/* Modal Section */}
        {/* Client Info */}
        <Formik
          initialValues={clientInitialValues}
          validationSchema={clientValidationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            const formData = {
              name: values.name,
              cnic: values.cnic,
              city: values.city,
              company: values.company,
              area: values.area,
              contact_number: values.contact_number,
              monthly_consumption_units: values.monthly_consumption_units,
            };
            const header = {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };
            try {
              setloading(true);
              const res = await axios.put(
                baseApiUrl + `/api/Client/${invoicedClientId}/`,
                formData,
                header
              );
              if (res.status == 200) {
                toast.success("Client Updated Successfully");
                getClientList();
                setloading(false);
              }
            } catch (err) {
              setloading(false);
              toast.error("Client Not Updated");
            }
          }}
          children={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <H6 fontSize={18} mb={2}>
                  Update Client
                </H6>
                <Divider
                  sx={{
                    my: 4,
                  }}
                />
                <H6 fontSize={16} mb={2}>
                  Client Information
                </H6>
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        name="Name"
                        label="Name"
                        value={values.name}
                        onChange={(e) => {
                          setFieldValue("name", e.target.value);
                        }}
                        helperText={touched.name && errors.name}
                        error={Boolean(touched.name && errors.name)}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="text"
                        name="CNIC"
                        label="CNIC"
                        value={values.cnic}
                        onChange={(e) => {
                          const { value } = e.target;

                          // Format CNIC to include hyphens after the 5th and 13th characters
                          const formattedCNIC = value
                            .replace(/[^\d-]/g, "") // Remove non-digit characters except hyphen
                            .slice(0, 15) // Limit length to 15 characters
                            .replace(/(\d{5})(\d{7})(\d)/, "$1-$2-$3"); // Insert hyphens

                          setFieldValue("cnic", formattedCNIC);
                        }}
                        helperText={touched.cnic && errors.cnic}
                        error={Boolean(touched.cnic && errors.cnic)}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="number"
                        name="Contact Number"
                        label="Contact Number"
                        value={values.contact_number}
                        onChange={(e) => {
                          setFieldValue("contact_number", e.target.value);
                        }}
                        helperText={
                          touched.contact_number && errors.contact_number
                        }
                        error={Boolean(
                          touched.contact_number && errors.contact_number
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        name="City"
                        label="City"
                        value={values.city}
                        onChange={(e) => {
                          setFieldValue("city", e.target.value);
                        }}
                        helperText={touched.city && errors.city}
                        error={Boolean(touched.city && errors.city)}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        name="Area"
                        label="Area"
                        value={values.area}
                        onChange={(e) => {
                          setFieldValue("area", e.target.value);
                        }}
                        helperText={touched.area && errors.area}
                        error={Boolean(touched.area && errors.area)}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        name="Company"
                        label="Company"
                        value={values.company}
                        onChange={(e) => {
                          setFieldValue("company", e.target.value);
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="number"
                        name="Monthly Consumption Units"
                        label="Monthly Consumption Units"
                        value={values.monthly_consumption_units}
                        onChange={(e) => {
                          setFieldValue(
                            "monthly_consumption_units",
                            e.target.value
                          );
                        }}
                        helperText={
                          touched.monthly_consumption_units &&
                          errors.monthly_consumption_units
                        }
                        error={Boolean(
                          touched.monthly_consumption_units &&
                            errors.monthly_consumption_units
                        )}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <StyledFlexBox flexWrap="wrap" justifyContent="end">
                  <Box marginTop={3} className="buttonWrapper">
                    <Button
                      color="secondary"
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        mr: 1,
                      }}
                    >
                      Cancel
                    </Button>

                    {loading ? (
                      <Button type="submit" variant="contained" disabled={true}>
                        <div
                          className="spinner-border text-warning"
                          role="status"
                        >
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
                <Divider
                  sx={{
                    my: 4,
                  }}
                />
              </form>
            );
          }}
        ></Formik>
        {/* Invoice Info */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            const formData = {
              name: values.name,
              solar_panel: values.solar_panel,
              solar_panel1: values.solar_panel1,
              solar_panel2: values.solar_panel2,
              solar_panel3: values.solar_panel3,
              solar_panel4: values.solar_panel4,

              solar_panel_quantity: values.solar_panel_quantity,
              solar_panel_quantity1: values.solar_panel_quantity1,
              solar_panel_quantity2: values.solar_panel_quantity2,
              solar_panel_quantity3: values.solar_panel_quantity3,
              solar_panel_quantity4: values.solar_panel_quantity4,

              solar_panel_price: values.solar_panel_price,
              solar_panel_price1: values.solar_panel_price1,
              solar_panel_price2: values.solar_panel_price2,
              solar_panel_price3: values.solar_panel_price3,
              solar_panel_price4: values.solar_panel_price4,

              system_capacity: values.system_capacity,
              inverter: values.inverter,
              inverter1: values.inverter1,
              inverter2: values.inverter2,
              inverter3: values.inverter3,
              inverter4: values.inverter4,

              inverter_quantity: values.inverter_quantity,
              inverter_quantity1: values.inverter_quantity1,
              inverter_quantity2: values.inverter_quantity2,
              inverter_quantity3: values.inverter_quantity3,
              inverter_quantity4: values.inverter_quantity4,

              inverter_price: values.inverter_price,
              inverter_price1: values.inverter_price1,
              inverter_price2: values.inverter_price2,
              inverter_price3: values.inverter_price3,
              inverter_price4: values.inverter_price4,

              structure: values.structure,
              structure1: values.structure1,
              structure2: values.structure2,
              structure3: values.structure3,
              structure4: values.structure4,

              structure_quantity: values.structure_quantity,
              structure_quantity1: values.structure_quantity1,
              structure_quantity2: values.structure_quantity2,
              structure_quantity3: values.structure_quantity3,
              structure_quantity4: values.structure_quantity4,

              structure_price: values.structure_price,
              structure_price1: values.structure_price1,
              structure_price2: values.structure_price2,
              structure_price3: values.structure_price3,
              structure_price4: values.structure_price4,

              cabling: values.cabling,
              cabling1: values.cabling1,
              cabling2: values.cabling2,
              cabling3: values.cabling3,
              cabling4: values.cabling4,

              cabling_quantity: values.cabling_quantity,
              cabling_quantity1: values.cabling_quantity1,
              cabling_quantity2: values.cabling_quantity2,
              cabling_quantity3: values.cabling_quantity3,
              cabling_quantity4: values.cabling_quantity4,

              cabling_price: values.cabling_price,
              cabling_price1: values.cabling_price1,
              cabling_price2: values.cabling_price2,
              cabling_price3: values.cabling_price3,
              cabling_price4: values.cabling_price4,

              net_metering: values.net_metering,
              net_metering1: values.net_metering1,
              net_metering2: values.net_metering2,
              net_metering3: values.net_metering3,
              net_metering4: values.net_metering4,

              net_metering_quantity: values.net_metering_quantity,
              net_metering_quantity1: values.net_metering_quantity1,
              net_metering_quantity2: values.net_metering_quantity2,
              net_metering_quantity3: values.net_metering_quantity3,
              net_metering_quantity4: values.net_metering_quantity4,

              net_metering_price: values.net_metering_price,
              net_metering_price1: values.net_metering_price1,
              net_metering_price2: values.net_metering_price2,
              net_metering_price3: values.net_metering_price3,
              net_metering_price4: values.net_metering_price4,

              battery: values.battery,
              battery1: values.battery1,
              battery2: values.battery2,
              battery3: values.battery3,
              battery4: values.battery4,

              battery_quantity: values.battery_quantity,
              battery_quantity1: values.battery_quantity1,
              battery_quantity2: values.battery_quantity2,
              battery_quantity3: values.battery_quantity3,
              battery_quantity4: values.battery_quantity4,

              battery_price: values.battery_price,
              battery_price1: values.battery_price1,
              battery_price2: values.battery_price2,
              battery_price3: values.battery_price3,
              battery_price4: values.battery_price4,

              lightning_arrestor: values.lightning_arrestor,
              lightning_arrestor1: values.lightning_arrestor1,
              lightning_arrestor2: values.lightning_arrestor2,
              lightning_arrestor3: values.lightning_arrestor3,
              lightning_arrestor4: values.lightning_arrestor4,

              lightning_arrestor_quantity: values.lightning_arrestor_quantity,
              lightning_arrestor_quantity1: values.lightning_arrestor_quantity1,
              lightning_arrestor_quantity2: values.lightning_arrestor_quantity2,
              lightning_arrestor_quantity3: values.lightning_arrestor_quantity3,
              lightning_arrestor_quantity4: values.lightning_arrestor_quantity4,

              lightning_arrestor_price: values.lightning_arrestor_price,
              lightning_arrestor_price1: values.lightning_arrestor_price1,
              lightning_arrestor_price2: values.lightning_arrestor_price2,
              lightning_arrestor_price3: values.lightning_arrestor_price3,
              lightning_arrestor_price4: values.lightning_arrestor_price4,

              installation: values.installation,
              installation_quantity: 1,
              installation_price: values.installation_price,
              discount: values.discount,
              shipping_charges: values.shipping_charges,
              amount_paid: parseInt(values.amount_paid)
                ? parseInt(values.amount_paid)
                : 0,
              total: Subtotal,
              status: values.status,
            };
            const header = {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };
            try {
              setloading(true);
              const res = await axios.patch(
                baseApiUrl + `/api/Invoice/${id}/`,
                formData,
                header
              );
              if (res.status == 200) {
                toast.success("Invoice Updated Successfully");
                setloading(false);
                setTimeout(() => {
                  navigate("/dashboard/invoice-list");
                }, 1000);
              }
            } catch (err) {
              setloading(false);
              toast.error("Invoice Not Updated");
            }
          }}
          children={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <H6 fontSize={18} mb={2}>
                  Update Invoice
                </H6>
                <Divider
                  sx={{
                    my: 4,
                  }}
                />
                <H6 fontSize={16} mb={2}>
                  Select Client
                </H6>
                <Grid container spacing={3}>
                  <Grid item md={12} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <Select
                        placeholder="Name"
                        fullWidth
                        name="Name"
                        label="Name"
                        value={clientData.find(
                          (client) => client.value === values.name
                        )}
                        options={clientData}
                        onChange={(value) => {
                          setFieldValue("name", value ? value.value : "");
                        }}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        isClearable={true}
                        helperText={touched.name && errors.name}
                        error={Boolean(touched.name && errors.name)}
                      />
                      {errors.name && touched.name && (
                        <div
                          className="error-message"
                          style={{
                            marginLeft: "6px",
                            marginTop: "4px",
                            fontSize: "12px",
                            color: "red",
                          }}
                        >
                          {errors.name}
                        </div>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Solar Panel Information
                </H6>

                <DynamicFields
                  options={solarPanelData}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setPrices={setSolarPanelPrices}
                  setQuantities={setSolarPanelQuantities}
                  values={values}
                  namePrefix="solar_panel"
                  pricePrefix="solar_panel_price"
                  quantityPrefix="solar_panel_quantity"
                />
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="text"
                        name="System Capacity"
                        label="System Capacity"
                        value={values.system_capacity}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            setFieldValue("system_capacity", 0);
                          } else {
                            setFieldValue("system_capacity", value);
                          }
                        }}
                        helperText={
                          touched.system_capacity && errors.system_capacity
                        }
                        error={Boolean(
                          touched.system_capacity && errors.system_capacity
                        )}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Inverter Information
                </H6>
                <DynamicFields
                  options={inverterData}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setPrices={setInverterPrices}
                  setQuantities={setInverterQuantities}
                  values={values}
                  namePrefix="inverter"
                  pricePrefix="inverter_price"
                  quantityPrefix="inverter_quantity"
                />
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Structure Information
                </H6>
                <DynamicFields
                  options={structureData}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setPrices={setStructurePrices}
                  setQuantities={setStructureQuantities}
                  values={values}
                  namePrefix="structure"
                  pricePrefix="structure_price"
                  quantityPrefix="structure_quantity"
                />

                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Cabling Information
                </H6>
                <DynamicFields
                  options={cablingData}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setPrices={setCablingPrices}
                  setQuantities={setCablingQuantities}
                  values={values}
                  namePrefix="cabling"
                  pricePrefix="cabling_price"
                  quantityPrefix="cabling_quantity"
                />
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Net Metering Information
                </H6>
                <DynamicFields
                  options={netMeteringData}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setPrices={setNetMeteringPrices}
                  setQuantities={setNetMeteringQuantities}
                  values={values}
                  namePrefix="net_metering"
                  pricePrefix="net_metering_price"
                  quantityPrefix="net_metering_quantity"
                />
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Battery Information
                </H6>
                <DynamicFields
                  options={batteriesData}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setPrices={setBatteriesPrices}
                  setQuantities={setBatteriesQuantities}
                  values={values}
                  namePrefix="battery"
                  pricePrefix="battery_price"
                  quantityPrefix="battery_quantity"
                />
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Lightning Arrestor Information
                </H6>
                <DynamicFields
                  options={lightningArrestorData}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setPrices={setLightningArrestorPrices}
                  setQuantities={setLightningArrestorQuantities}
                  values={values}
                  namePrefix="lightning_arrestor"
                  pricePrefix="lightning_arrestor_price"
                  quantityPrefix="lightning_arrestor_quantity"
                />
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={16} mb={2}>
                  Installation Information
                </H6>
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <Select
                        placeholder="Installation"
                        fullWidth
                        name="Installation"
                        label="Installation"
                        value={installationData.find(
                          (installation) =>
                            installation.value === values.installation
                        )}
                        options={installationData}
                        isClearable={true}
                        onChange={(value) => {
                          setFieldValue(
                            "installation",
                            value ? value.value : ""
                          );
                          setInstallationId(value ? value.value : null);
                        }}
                        helperText={touched.installation && errors.installation}
                        error={Boolean(
                          touched.installation && errors.installation
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="text"
                        name="Installation Price"
                        label="Installation Price"
                        value={formatNumber(values.installation_price)}
                        onChange={(e) => {
                          const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                          if (rawValue === "") {
                            setFieldValue("installation_price", 0);
                            setInstallationPrice(0);
                          } else {
                            const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                            // Calculate the discount
                            setFieldValue("installation_price", numberValue);
                            setInstallationPrice(numberValue);
                            const discount = Math.max(
                              0,
                              installationSpecificRecord?.price *
                                values.installation_quantity -
                                numberValue
                            );
                            setInstallationDiscount(discount);
                          }
                        }}
                        helperText={
                          touched.installation_price &&
                          errors.installation_price
                        }
                        error={Boolean(
                          touched.installation_price &&
                            errors.installation_price
                        )}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="text"
                        name="Discount"
                        label="Discount"
                        value={formatNumber(values.discount)}
                        onChange={(e) => {
                          const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                          if (rawValue === "") {
                            setFieldValue("discount", 0);
                            setDiscount(0);
                          } else {
                            const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                            setFieldValue("discount", numberValue);
                            setDiscount(numberValue);
                          }
                        }}
                        helperText={touched.discount && errors.discount}
                        error={Boolean(touched.discount && errors.discount)}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="text"
                        name="Shipping Charges"
                        label="Shipping Charges"
                        value={formatNumber(values.shipping_charges)}
                        onChange={(e) => {
                          const rawValue = removeCommas(e.target.value); // Remove commas before setting field value
                          if (rawValue === "") {
                            setFieldValue("shipping_charges", 0);
                            setShipping(0);
                          } else {
                            const numberValue = parseFloat(rawValue); // Convert raw value to number for calculations
                            setFieldValue("shipping_charges", numberValue);
                            setShipping(numberValue);
                          }
                        }}
                        helperText={
                          touched.shipping_charges && errors.shipping_charges
                        }
                        error={Boolean(
                          touched.shipping_charges && errors.shipping_charges
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField
                        fullWidth
                        type="text"
                        name="Amount Paid"
                        label="Amount Paid"
                        value={formatNumber(values.amount_paid)}
                        onChange={(e) => {
                          const rawValue = removeCommas(e.target.value);
                          setFieldValue("amount_paid", rawValue);
                          setAmountPaid(rawValue);
                          // if (value === '') {
                          // setFieldValue("amount_paid", 0);
                          // setAmountPaid(0);
                          // } else {
                          // }
                        }}
                        helperText={touched.amount_paid && errors.amount_paid}
                        error={Boolean(
                          touched.amount_paid && errors.amount_paid
                        )}
                      />
                      <FlexBetween mt={1} mx={1}>
                        <Paragraph
                          fontWeight={500}
                          fontSize={12}
                          color="#494949"
                        >
                          <i>
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: "black",
                              }}
                            >
                              Installment History:
                            </span>
                            <br />
                            <span
                              style={{
                                fontWeight: 500,
                                fontSize: 13,
                                color: "black",
                              }}
                            >
                              Date
                            </span>
                            {installmentData.map((installment, index) => {
                              return (
                                <div key={index}>
                                  {format(
                                    new Date(installment.time),
                                    "dd-MM-yyyy HH:mm:SS"
                                  )}
                                </div>
                              );
                            })}
                            <hr
                              style={{ marginTop: "2px", marginBottom: "2px" }}
                            />
                            <span
                              style={{
                                fontWeight: 500,
                                fontSize: 13,
                                color: "black",
                              }}
                            >
                              Recived Amount
                            </span>
                          </i>
                        </Paragraph>
                        <Paragraph
                          fontWeight={500}
                          fontSize={12}
                          color="#494949"
                          textAlign="right"
                        >
                          <i>
                            <br />
                            <span
                              style={{
                                fontWeight: 500,
                                fontSize: 13,
                                color: "black",
                              }}
                            >
                              Installment:
                            </span>
                            {installmentData.map((installment, index) => {
                              return (
                                <div key={index}>
                                  {formatNumber(installment.amount)}
                                </div>
                              );
                            })}
                            <hr
                              style={{ marginTop: "2px", marginBottom: "2px" }}
                            />
                            <span
                              style={{
                                fontWeight: 500,
                                fontSize: 13,
                                color: "black",
                              }}
                            >
                              {formatNumber(totalSum)}
                            </span>
                          </i>
                        </Paragraph>
                      </FlexBetween>
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
                        value={options.find(
                          (option) => option.value === values.status
                        )}
                        onChange={(option) => {
                          setFieldValue("status", option.value);
                        }}
                        onBlur={handleBlur}
                        className={
                          errors.status && touched.status ? "select-error" : ""
                        }
                      />
                      {errors.status && touched.status && (
                        <div
                          className="error-message"
                          style={{
                            marginLeft: "6px",
                            marginTop: "4px",
                            fontSize: "12px",
                            color: "red",
                          }}
                        >
                          {errors.status}
                        </div>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={20}>Payment Information</H6>
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box maxWidth={320}>
                      <H6 fontSize={16} my={3}>
                        Net Amount
                      </H6>
                      <FlexBetween my={1}>
                        <Paragraph fontWeight={500}>Subtotal</Paragraph>
                        <Paragraph fontWeight={500}>
                          {formatNumber(Subtotal)}
                        </Paragraph>
                      </FlexBetween>
                      <FlexBetween my={1}>
                        <Paragraph fontWeight={500}>Discount</Paragraph>
                        <Paragraph fontWeight={500}>
                          -&nbsp;&nbsp;&nbsp; {formatNumber(discount)}
                        </Paragraph>
                      </FlexBetween>
                      <Divider
                        sx={{
                          mt: 7,
                        }}
                      />
                      <FlexBetween my={2}>
                        <H6 fontSize={16}>After Discount</H6>
                        <H6 fontSize={16}>
                          {formatNumber(Subtotal - parseInt(discount))}
                        </H6>
                      </FlexBetween>
                    </Box>
                  </Grid>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      mt: 5,
                      ml: 6,
                      mr: 3,
                      height: "225px", // Adjust the height as needed
                    }}
                  />
                  <Grid item md={4} sm={6} xs={12}>
                    <Box maxWidth={320}>
                      <H6 fontSize={16} my={3}>
                        Payable Amount
                      </H6>
                      <FlexBetween my={1}>
                        <Paragraph fontWeight={500}>After Discount</Paragraph>
                        <Paragraph fontWeight={500}>
                          {formatNumber(Subtotal - parseInt(discount))}
                        </Paragraph>
                      </FlexBetween>

                      <FlexBetween my={1}>
                        <Paragraph fontWeight={500}>Shipping Amount</Paragraph>
                        <Paragraph fontWeight={500}>
                          +&nbsp;&nbsp;&nbsp; {formatNumber(parseInt(shipping))}
                        </Paragraph>
                      </FlexBetween>

                      <FlexBetween my={1}>
                        <Paragraph fontWeight={500}>
                          Already Paid Amount
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          -&nbsp;&nbsp;&nbsp;
                          <span style={{ color: "green", fontWeight: 600 }}>
                            {" "}
                            {formatNumber(partiallyPaid)}
                          </span>
                        </Paragraph>
                      </FlexBetween>

                      <FlexBetween my={1}>
                        <Paragraph fontWeight={500}>
                          Current Pay Amount
                        </Paragraph>
                        <Paragraph fontWeight={500}>
                          -&nbsp;&nbsp;&nbsp;
                          <span style={{ color: "green", fontWeight: 600 }}>
                            {" "}
                            {formatNumber(
                              amountPaid ? parseInt(amountPaid) : 0
                            )}
                          </span>
                        </Paragraph>
                      </FlexBetween>

                      <Divider
                        sx={{
                          my: 2,
                        }}
                      />

                      <FlexBetween my={1}>
                        <H6 fontSize={16}>Due Amount</H6>
                        <H6 fontSize={16} style={{ color: "red" }}>
                          {formatNumber(
                            Subtotal -
                              parseInt(discount) +
                              parseInt(shipping) -
                              parseInt(amountPaid) -
                              parseInt(partiallyPaid)
                          )}
                        </H6>
                      </FlexBetween>
                    </Box>
                  </Grid>
                </Grid>

                <StyledFlexBox flexWrap="wrap" justifyContent="end">
                  <Box marginTop={3} className="buttonWrapper">
                    <Button
                      color="secondary"
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        mr: 1,
                      }}
                    >
                      Cancel
                    </Button>

                    {loading ? (
                      <Button type="submit" variant="contained" disabled={true}>
                        <div
                          className="spinner-border text-warning"
                          role="status"
                        >
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
                <Divider
                  sx={{
                    my: 4,
                  }}
                />

                <H6 fontSize={20}>Expenditures Information</H6>
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <Box maxWidth={320}>
                      {/* <H6 fontSize={16} my={3}>Net Amount</H6> */}
                      <FlexBetween mt={1}>
                        <Paragraph fontWeight={500}>Name</Paragraph>
                        <Paragraph fontWeight={500}>Price</Paragraph>
                      </FlexBetween>
                      <FlexBetween>
                        <Paragraph fontWeight={500} color="#494949">
                          {expendituresData.map((expenditure, index) => {
                            return (
                              <div
                                style={{
                                  marginBottom: "2px",
                                  marginTop: "2px",
                                }}
                                key={index}
                              >
                                {expenditure.name}
                              </div>
                            );
                          })}
                        </Paragraph>
                        <Paragraph fontWeight={500} color="#494949">
                          {expendituresData.map((expenditure, index) => {
                            return (
                              <div
                                style={{
                                  marginBottom: "2px",
                                  marginTop: "2px",
                                }}
                                key={index}
                              >
                                {formatNumber(expenditure.value)}
                              </div>
                            );
                          })}
                        </Paragraph>
                      </FlexBetween>
                      <Divider
                        sx={{
                          mt: 7,
                        }}
                      />
                      <FlexBetween my={2}>
                        <H6 fontSize={16}>Total</H6>
                        <H6 fontSize={16}>
                          {formatNumber(totalSumExpenditure)}
                        </H6>
                      </FlexBetween>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        ></Formik>
      </Card>
    </Box>
  );
};

export default UpdateInvoicePageView;
