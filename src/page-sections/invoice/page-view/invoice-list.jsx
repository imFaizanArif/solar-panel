import { useEffect, useState } from "react";
import axios from "axios";
import { Badge, Table } from 'antd';
import { Formik } from "formik";
import * as Yup from "yup";
import { TableMoreMenu } from "@/components/table";
import { H5, H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import { Box, Button, Card, Chip, Divider, Grid, Menu, MenuItem, Modal, Stack, styled, TextField } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK

import Add from "@/icons/Add"; // CUSTOM ICON COMPONENTS
import Pages from "@/icons/sidebar/Pages";
import { DeleteOutline, Download, Edit, Payment } from "@mui/icons-material";
import { IconWrapper } from "@/components/icon-wrapper";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { format } from "date-fns";
import { DateRangePicker } from "rsuite";
import { Link } from "react-router-dom";


const Wrapper = styled(FlexBox)(({ theme }) => ({
  alignItems: "center",
  ".select": {
    flex: "1 1 200px"
  },
  [theme.breakpoints.down(426)]: {
    flexWrap: "wrap"
  }
})); // CUSTOM PAGE SECTION COMPONENTS

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  textAlign: 'center',
  borderRadius: '24px',
  boxShadow: 24,
  p: 4,
  height: 350,
  overflow: "hidden",
  overflowY: "scroll",
  '&::-webkit-scrollbar': {
    width: '0.1em'
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 0px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.00)',
    outline: '0px solid slategrey'
  }
};
const InvoiceListPageView = () => {
  let navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL;
  const locale = {
    emptyText: 'Loading...',
  };
  const handleOpen = () => setOpen(true);
  const isModalOpen = () => setModalOpen(true);
  const handleClose = () => setOpen(false);
  const isModalClose = () => setModalOpen(false);
  const [flag, setFlag] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const [InvoiceData, setInvoiceData] = useState([]);
  const [invoiceDataDetailed, setInvoiceDeatiledData] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [expendituresData, setExpendituresData] = useState([]);
  const [specificExpendituresData, setSpecificExpendituresData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [rowId, setRowId] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null); // Added anchor element state
  const [loading, setloading] = useState(false);
  const initialValues = {
    name: "",
    value: "",
    inv_id: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name To is Required!"),
  });
  const handleCloseOpenMenu = () => {
    setOpenMenuEl(null);
    setAnchorEl(null); // Reset anchor element
  }

  const handleTableChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Search
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  // Search and Date Range Filter

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  // const handleSearc = (event) => {
  //   const value = event.target.value;
  //   setSearchTerm(value);
  //   if (value === '') {
  //     setFilteredData(InvoiceData);
  //   } else {
  //     const filteredData = InvoiceData.filter((item) =>
  //       item.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setFilteredData(filteredData);
  //   }
  // };
  // Search
  const secondRowRender = () => {
    const columns = [
      {
        title: 'Installments',
        children: [
          {
            title: 'Amount',
            dataIndex: 'amount',
            width: 150,
            key: 'date',
            // render: (text, record) => {
            //   return (
            //     <span>{text.name}</span>
            //   )
            // },
          },
          {
            title: 'Date',
            dataIndex: 'time',
            key: 'time',
            width: 150,
            render: (text) => format(new Date(text), 'dd-MM-yyyy'),
          },
        ],
      },
    ];
    return <Table
      columns={columns}
      dataSource={installments}
      locale={locale}
      pagination={false}
      bordered
      size="small"
      rowKey={(record) => record?.id}
    // onChange={handleTableChange}
    // scroll={{ x: 4200 }}
    />;
  };
  console.log(invoiceDataDetailed?.partial_payments, "invoiceDataDetailed?.partial_payments")
  const expandedRowRender = () => {
    const columns = [
      {
        title: 'Discount',
        dataIndex: 'discount',
        width: 150,
        key: 'date',
      },
      {
        title: 'Shipping Charges',
        dataIndex: 'shipping_charges',
        width: 150,
        key: 'name',
      },
      {
        title: 'Solar Panel',
        children: [
          {
            title: 'Name',
            dataIndex: 'solar_panel',
            width: 150,
            key: 'date',
            render: (text, record) => {
              return (
                <span>{text.name}</span>
              )
            },
          },
          {
            title: 'Quantity',
            dataIndex: 'solar_panel_quantity',
            width: 150,
            key: 'name',
            render: (text, record) => {
              return (
                <span>{record.solar_panel_quantity}</span>
              )
            },
          },
          {
            title: 'Price',
            key: 'solar_panel_price',
            width: 150,
            render: (text, record) => {
              return (
                <span>{record.solar_panel_price}</span>
              )
            },
          },
        ],
      },
      {
        title: 'Inverter',
        children: [
          {
            title: 'Name',
            dataIndex: 'inverter',
            width: 150,
            key: 'date',
            render: (text, record) => {
              return (
                <span>{text.name}</span>
              )
            },
          },
          {
            title: 'Quantity',
            dataIndex: 'inverter_quantity',
            width: 150,
            key: 'name',
            render: (text, record) => {
              return (
                <span>{record.inverter_quantity}</span>
              )
            },
          },
          {
            title: 'Price',
            key: 'inverter_price',
            width: 150,
            render: (text, record) => {
              return (
                <span>{record.inverter_price}</span>
              )
            },
          },
        ],
      },
      {
        title: 'Cabling',
        children: [
          {
            title: 'Name',
            dataIndex: 'cabling',
            width: 150,
            key: 'date',
            render: (text, record) => {
              return (
                <span>{text.name}</span>
              )
            },
          },
          {
            title: 'Quantity',
            dataIndex: 'cabling_quantity',
            width: 150,
            key: 'name',
            render: (text, record) => {
              return (
                <span>{record.cabling_quantity}</span>
              )
            },
          },
          {
            title: 'Price',
            key: 'cabling_price',
            width: 150,
            render: (text, record) => {
              return (
                <span>{record.cabling_price}</span>
              )
            },
          },
        ],
      },
      {
        title: 'Structure',
        children: [
          {
            title: 'Name',
            dataIndex: 'structure',
            width: 150,
            key: 'date',
            render: (text, record) => {
              return (
                <span>{text.name}</span>
              )
            },
          },
          {
            title: 'Quantity',
            dataIndex: 'structure_quantity',
            width: 150,
            key: 'name',
            render: (text, record) => {
              return (
                <span>{record.structure_quantity}</span>
              )
            },
          },
          {
            title: 'Price',
            key: 'structure_price',
            width: 150,
            render: (text, record) => {
              return (
                <span>{record.structure_price}</span>
              )
            },
          },
        ],
      },
      {
        title: 'Net Metering',
        children: [
          {
            title: 'Name',
            dataIndex: ['net_metering', 'name'],
            width: 150,
            key: 'net_metering_name',
          },
          {
            title: 'Quantity',
            dataIndex: 'net_metering_quantity',
            width: 150,
            key: 'net_metering_quantity',
          },
          {
            title: 'Price',
            dataIndex: 'net_metering_price',
            width: 150,
            key: 'net_metering_price',
          },
        ],
      },
      {
        title: 'Battery',
        children: [
          {
            title: 'Name',
            dataIndex: ['battery', 'name'],
            width: 150,
            key: 'battery_name',
          },
          {
            title: 'Quantity',
            dataIndex: 'battery_quantity',
            width: 150,
            key: 'battery_quantity',
          },
          {
            title: 'Price',
            dataIndex: 'battery_price',
            width: 150,
            key: 'battery_price',
          },
        ],
      },
      {
        title: 'Installation',
        children: [
          {
            title: 'Name',
            dataIndex: ['installation', 'name'],
            width: 150,
            key: 'installation_name',
          },
          {
            title: 'Quantity',
            dataIndex: 'installation_quantity',
            width: 150,
            key: 'installation_quantity',
          },
          {
            title: 'Price',
            dataIndex: 'installation_price',
            width: 150,
            key: 'installation_price',
          },
        ],
      },
      {
        title: 'Lightning Arrestor',
        children: [
          {
            title: 'Name',
            dataIndex: ['lightning_arrestor', 'name'],
            width: 150,
            key: 'lightning_arrestor_name',
          },
          {
            title: 'Quantity',
            dataIndex: 'lightning_arrestor_quantity',
            width: 150,
            key: 'lightning_arrestor_quantity',
          },
          {
            title: 'Price',
            dataIndex: 'lightning_arrestor_price',
            width: 150,
            key: 'lightning_arrestor_price',
          },
        ],
      },
    ];
    return <Table
      columns={columns}
      dataSource={invoiceDataDetailed}
      locale={locale}
      pagination={false}
      bordered
      size="middle"
      rowKey={(record) => record?.id}
      // expandable={{
      //   secondRowRender,
      //   expandedRowKeys,
      //   onExpand: handleExpand,
      // }}
      expandable={{
        expandedRowRender: secondRowRender,
        rowExpandable: (record) => record.partial_payments && record.partial_payments.length > 0,
      }}
      scroll={{ x: 4200 }}
    />;
  };
  const columns = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 1,
      },
      // fixed: 'left',
    },
    {
      title: 'Name',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 2,
      },
      // fixed: 'left',
      render: (record) => {
        return (
          <span>{record?.name}</span>
        )
      },
    },
    {
      title: 'Total Balance',
      dataIndex: 'total',
      key: '2',
      width: 150,
      render: (text, record) => {
        return (
          <span style={{ fontWeight: 600 }}>{parseInt(record.total)}</span>
        )
      },
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 4,
      },
    },
    {
      title: 'Payable Balance',
      dataIndex: 'id',
      key: '1',
      width: 150,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 3,
      },
      render: (text, record) => {
        return (
          <span style={{ color: "red", fontWeight: 600 }}>{parseInt(record.total) - parseInt(record.amount_paid)}</span>
        )
      },
    },
    {
      title: 'Paid Balance',
      dataIndex: 'amount_paid',
      key: '3',
      width: 150,
      render: (text, record) => {
        return (
          <span style={{ color: "green", fontWeight: 600 }}>{parseInt(record.amount_paid)}</span>
        )
      },
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 5,
      },
    },
    {
      title: 'System Capacity',
      dataIndex: 'system_capacity',
      key: '3',
      width: 150,
      // render: (text, record) => {
      //   return (
      //     <span>{parseInt(record.amount_paid)}</span>
      //   )
      // },
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 6,
      },
    },
    {
      title: 'Expenditure',
      dataIndex: 'id', // This represents the invoice ID
      key: 'expenditure',
      width: 150,
      render: (invoiceId) => {
        // Calculate total expenditures for the current invoice ID
        const totalExpenditure = expendituresData
          .filter(expenditure => expenditure.inv_id === invoiceId)
          .reduce((sum, expenditure) => sum + expenditure.value, 0);

        return <Link to={`/dashboard/expenditure-list`} style={{ color: "black" }}>{totalExpenditure}</Link>;
      },
      sorter: {
        compare: (a, b) => {
          const totalExpenditureA = expendituresData
            .filter(expenditure => expenditure.inv_id === a.id)
            .reduce((sum, expenditure) => sum + expenditure.value, 0);
          const totalExpenditureB = expendituresData
            .filter(expenditure => expenditure.inv_id === b.id)
            .reduce((sum, expenditure) => sum + expenditure.value, 0);
          return totalExpenditureA - totalExpenditureB;
        },
        multiple: 6,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '3',
      width: 200,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 7,
      },
      render: (record) => {
        // console.log(record, "record")
        return (
          <Chip
            label={record}
            size="small"
            color={record === 'QUOTE' ? 'error' : (
              record === 'PARTIALLY_PAID' ? 'warning' : (record === 'PAID' ? 'success' : 'default')
            )}
          />
        )

      },
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: '3',
      width: 150,
      sorter: {
        compare: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        multiple: 8,
      },
      render: (text) => format(new Date(text), 'dd-MM-yyyy'),
    },
    {
      title: 'Updated Date',
      dataIndex: 'updated_at',
      key: '3',
      width: 150,
      sorter: {
        compare: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        multiple: 9,
      },
      render: (text) => format(new Date(text), 'dd-MM-yyyy'),
    },
    {
      title: "Option",
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        // console.log(text.id);
        return (
          <>
            <Button
              aria-controls={openMenuEl === record?.id ? 'simple-menu' : undefined}
              aria-haspopup="true"
              color="inherit"
              variant="text"
              onClick={(event) => handleOpenMenu(event, record)}
            >
              <TableMoreMenu />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={openMenuEl === record?.id}
              onClose={handleCloseOpenMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseOpenMenu();
                  isModalOpen();
                  setQuery(record.id); // Correctly set the query with the record ID
                }}
              >
                <Payment fontSize="16" color="primary" />&nbsp; Add Expenditure
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseOpenMenu();
                  downloadInvoice(record.id);
                }}
              >
                <Download fontSize="16" color="success" />&nbsp; Download
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseOpenMenu();
                  navigate(`/dashboard/update-invoice/${record.id}`);
                }}
              >
                <Edit fontSize="16" color="info" />&nbsp; Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseOpenMenu();
                  handleOpen();
                  setQuery(record.id); // Correctly set the query with the record ID
                }}
              >
                <DeleteOutline fontSize="16" color="error" />&nbsp; Delete
              </MenuItem>
            </Menu>
          </>
        )
      },
    },
  ];

  const handleOpenMenu = (event, record) => {
    setOpenMenuEl(record?.id);
    setAnchorEl(event?.currentTarget); // Set the anchor element to the current target
  };

  const getInvoiceList = () => {
    axios.get(baseApiUrl + "/invoice")
      .then((res) => {
        // console.log(res.data)
        setInvoiceData(res?.data.reverse());
        setFilteredData(res?.data);
        setInvoiceDeatiledData(res?.data?.filter(invoice => invoice.id === rowId));
        const partial_payments = res?.data?.filter(invoice => invoice.id === rowId);
        setInstallments(partial_payments[0]?.partial_payments)
        // console.log(partial_payments[0]?.partial_payments, "partial_payments")
        // console.log(res?.data?.filter(invoice => invoice.id === rowId), "res.data")
      })
      .catch((err) => console.log(err.response.data));
  };
  const getExpendituresList = async () => {
    try {
      const res = await axios.get(baseApiUrl + "/api/Expenditures/" + "?format=json");
      const ExpendituresData = res?.data;
      setExpendituresData(ExpendituresData);
      setSpecificExpendituresData(ExpendituresData.filter(expenditure => expenditure.inv_id === query));
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const deleteInvoice = (id) => {
    axios.delete(baseApiUrl + `/api/Invoice/${id}/`)
      .then((res) => {
        if (res.status == 204) {
          getInvoiceList();
          toast.success("Invoice Deleted Successfully");
        }
      })
      .catch((err) => {
        toast.error("Record Not Deleted");
      });
  }
  const downloadInvoice = async (recordId) => {
    try {
      const response = await axios.get(`${baseApiUrl}/invoice/${recordId}/download`, {
        responseType: 'blob', // Ensure you get the file as binary data
      });

      if (response.status === 200) {
        // Create a URL for the blob data
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;

        // Determine the file extension and name
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'Invoice'; // Default file name

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }

        link.setAttribute('download', fileName);

        // Append the link to the body
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("File Downloaded Successfully");
      } else {
        toast.error("File Downloading Failed");
      }
    } catch (error) {
      console.error("Error downloading the file:", error);
      toast.error("File Downloading Failed");
    }
  };
  const handleDateRangeChange = (value) => {
    setDateRange(value);
    // console.log(value, "kkkkkkkkkkkkkkk");
  };
  const handleExpand = (expanded, record) => {
    if (expanded) {
      // console.log(record.id, "id")
      setRowId(record.id);
      setExpandedRowKeys([record.id]);
    } else {
      setRowId(0);
      setExpandedRowKeys([]);
    }
  };
  const filterData = () => {
    let filtered = InvoiceData;

    if (dateRange[0] && dateRange[1]) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  };


  useEffect(() => {
    getInvoiceList();
    getExpendituresList();
  }, []);
  useEffect(() => {
    getInvoiceList();
    getExpendituresList();
  }, [query || rowId || expandedRowKeys]); // Fetch data whenever `query` changes
  useEffect(() => {
    filterData();
  }, [searchTerm, dateRange, InvoiceData]);

  const totalSumExpenditure = specificExpendituresData.reduce((sum, expenditure) => sum + expenditure.value, 0);

  return <Card>
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
    <FlexBetween flexWrap="wrap" gap={2} p={2} pt={2.5}>
      <Stack direction="row" alignItems="center">
        <IconWrapper>
          <Pages color="primary" />
        </IconWrapper>

        <H5 fontSize={16}>Invoice List</H5>
      </Stack>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/create-invoice")}>
        Add Invoice
      </Button>
    </FlexBetween>

    <Wrapper gap={2} px={2} pb={3}>
      <DateRangePicker placeholder="Select Date Range" onChange={handleDateRangeChange} />
      {/* <TextField
        fullWidth
        label="Search Invoice by name..."
        value={searchTerm}
        onChange={handleSearch}
      /> */}
    </Wrapper>

    <Table
      columns={columns}
      dataSource={filteredData?.map(item => ({ ...item, key: item?.id }))}
      // dataSource={InvoiceData}
      locale={locale}
      expandable={{
        expandedRowRender,
        expandedRowKeys,
        onExpand: handleExpand,
      }}
      pagination={{
        total: InvoiceData?.length,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
        showSizeChanger: true,
        pageSize: pageSize,
        current: current,
        onChange: handleTableChange,
        onShowSizeChange: (current, size) => {
          setPageSize(size);
        },
      }}
      rowKey={(record) => record?.id}
      onChange={handleTableChange}
      scroll={{ x: 600 }}
      size="large"
    />

    {/* Delete Modal */}
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <H6 fontSize={18}>Delete Invoice</H6>

          <Paragraph mt={1}>Are you sure want to delete?</Paragraph>
          <FlexBox justifyContent="flex-end" gap={2} marginTop={4}>
            <Button fullWidth variant="outlined" onClick={() => handleClose()}>
              Cancel
            </Button>

            <Button fullWidth type="submit" variant="contained" color="error"
              onClick={() => {
                deleteInvoice(query)
                handleClose()
              }}
            >
              Delete
            </Button>
          </FlexBox>
        </Box>
      </Modal>
    </div>
    {/* Delete Modal */}
    {/* Add Expenditure Modal */}
    <div>
      <Modal
        open={modalOpen}
        onClose={isModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          onClick: (event) => event.stopPropagation() // Prevent clicking outside from closing the modal
        }}
      >
        <Box sx={style}>
          <H6 fontSize={20}>Add Expenditure</H6>

          <Formik initialValues={initialValues} validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const formData = {
                name: values.name,
                value: values.value,
                inv_id: query,
              }
              const header = {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              };
              try {
                setloading(true);
                const res = await axios.post(
                  baseApiUrl + `/api/Expenditures/`, formData, header
                );
                if (res.status == 201) {
                  await getExpendituresList();
                  setFlag(true);
                  resetForm(); // Clear the form fields
                  toast.success("Expenditure Added Successfully");
                  setloading(false);
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
              setFieldValue,
            }) => {
              return <form onSubmit={handleSubmit}>

                <Grid container spacing={3} my={2}>
                  <Grid item md={12} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField fullWidth name="Name" label="Name" value={values.name}
                        onChange={(e) => {
                          setFieldValue("name", e.target.value);
                        }}
                        helperText={touched.name && errors.name} error={Boolean(touched.name && errors.name)} />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item md={12} sm={6} xs={12}>
                    <Box marginBottom={0}>
                      <TextField fullWidth type="number" name="Price" label="Price" value={values.value}
                        onChange={(e) => {
                          setFieldValue("value", e.target.value);
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>


                <FlexBox justifyContent="flex-end" gap={2} marginTop={4}>
                  <Button fullWidth variant="outlined" onClick={() => {
                    isModalClose();
                    setFlag(false);
                  }}>
                    Cancel
                  </Button>

                  {loading ? (
                    <Button fullWidth type="submit" variant="contained" disabled={true}>
                      <div className="spinner-border text-warning" role="status">
                        <span className="sr-only">Saving...</span>
                      </div>
                    </Button>
                  ) : (
                    <Button fullWidth type="submit" variant="contained" color="success">
                      Save
                    </Button>
                  )}
                </FlexBox>
              </form>;
            }} />
          {flag ?
            (
              <Grid container spacing={3}>
                <Grid item md={12} sm={6} xs={12}>
                  <Box maxWidth={320}>
                    <H6 fontSize={16} mt={4}>Expenditures History</H6>
                    {/* <H6 fontSize={16} my={3}>Net Amount</H6> */}
                    <FlexBetween mt={1}>
                      <Paragraph fontWeight={500}>Name</Paragraph>
                      <Paragraph fontWeight={500}>Price</Paragraph>
                    </FlexBetween>
                    <FlexBetween>
                      <Paragraph fontWeight={500} color="#494949" textAlign={"start"}>
                        {
                          specificExpendituresData?.map((expenditure, index) => {
                            return <div style={{ marginBottom: "2px", marginTop: "2px" }} key={index}>
                              {expenditure?.name}
                            </div>;
                          })
                        }
                      </Paragraph>
                      <Paragraph fontWeight={500} color="#494949" textAlign={"start"}>
                        {
                          specificExpendituresData?.map((expenditure, index) => {
                            return <div style={{ marginBottom: "2px", marginTop: "2px" }} key={index}>
                              {expenditure?.value}
                            </div>;
                          })
                        }
                      </Paragraph>
                    </FlexBetween>
                    <Divider sx={{
                      mt: 7
                    }} />
                    <FlexBetween my={2}>
                      <H6 fontSize={16}>Total</H6>
                      <H6 fontSize={16}>{totalSumExpenditure}</H6>
                    </FlexBetween>
                  </Box>
                </Grid>
              </Grid>
            ) : null}
        </Box>
      </Modal>
    </div>
    {/* Add Expenditure */}
  </Card>;
};

export default InvoiceListPageView;