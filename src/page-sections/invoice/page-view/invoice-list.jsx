import { useEffect, useState } from "react";
import axios from "axios";
import { Badge, Table } from 'antd';
import { TableMoreMenu } from "@/components/table";
import { H5, H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import { Box, Button, Card, Chip, Menu, MenuItem, Modal, Stack, styled, TextField } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK

import Add from "@/icons/Add"; // CUSTOM ICON COMPONENTS
import Pages from "@/icons/sidebar/Pages";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { IconWrapper } from "@/components/icon-wrapper";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { format } from "date-fns";
import { DateRangePicker } from "rsuite";


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
};
const InvoiceListPageView = () => {
  let navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL;
  const locale = {
    emptyText: 'No data available',
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const [InvoiceData, setInvoiceData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Added anchor element state

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
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value === '') {
      setFilteredData(InvoiceData);
    } else {
      const filteredData = InvoiceData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };
  // Search
  // const expandedRowRender = () => {
  //   const columns = [
  //     {
  //       title: 'Discount',
  //       dataIndex: 'discount',
  //       width: 150,
  //       key: 'date',
  //     },
  //     {
  //       title: 'Shipping Charges',
  //       dataIndex: 'shipping_charges',
  //       width: 150,
  //       key: 'name',
  //     },
  //     {
  //       title: 'Solar Panel',
  //       children: [
  //         {
  //           title: 'Name',
  //           dataIndex: 'solar_panel',
  //           width: 150,
  //           key: 'date',
  //           render: (text, record) => {
  //             return (
  //               <span>{text.name}</span>
  //             )
  //           },
  //         },
  //         {
  //           title: 'Quantity',
  //           dataIndex: 'solar_panel_quantity',
  //           width: 150,
  //           key: 'name',
  //           render: (text, record) => {
  //             return (
  //               <span>{record.solar_panel_quantity}</span>
  //             )
  //           },
  //         },
  //         {
  //           title: 'Price',
  //           key: 'solar_panel_price',
  //           width: 150,
  //           render: (text, record) => {
  //             return (
  //               <span>{record.solar_panel_price}</span>
  //             )
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Inverter',
  //       children: [
  //         {
  //           title: 'Name',
  //           dataIndex: 'inverter',
  //           width: 150,
  //           key: 'date',
  //           render: (text, record) => {
  //             return (
  //               <span>{text.name}</span>
  //             )
  //           },
  //         },
  //         {
  //           title: 'Quantity',
  //           dataIndex: 'inverter_quantity',
  //           width: 150,
  //           key: 'name',
  //           render: (text, record) => {
  //             return (
  //               <span>{record.inverter_quantity}</span>
  //             )
  //           },
  //         },
  //         {
  //           title: 'Price',
  //           key: 'inverter_price',
  //           width: 150,
  //           render: (text, record) => {
  //             return (
  //               <span>{record.inverter_price}</span>
  //             )
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Cabling',
  //       children: [
  //         {
  //           title: 'Name',
  //           dataIndex: 'cabling',
  //           width: 150,
  //           key: 'date',
  //           render: (text, record) => {
  //             return (
  //               <span>{text.name}</span>
  //             )
  //           },
  //         },
  //         {
  //           title: 'Quantity',
  //           dataIndex: 'cabling_quantity',
  //           width: 150,
  //           key: 'name',
  //           render: (text, record) => {
  //             return (
  //               <span>{record.cabling_quantity}</span>
  //             )
  //           },
  //         },
  //         {
  //           title: 'Price',
  //           key: 'cabling_price',
  //           width: 150,
  //           render: (text, record) => {
  //             return (
  //               <span>{record.cabling_price}</span>
  //             )
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Net Metering',
  //       children: [
  //         {
  //           title: 'Name',
  //           dataIndex: ['net_metering', 'name'],
  //           width: 150,
  //           key: 'net_metering_name',
  //         },
  //         {
  //           title: 'Quantity',
  //           dataIndex: 'net_metering_quantity',
  //           width: 150,
  //           key: 'net_metering_quantity',
  //         },
  //         {
  //           title: 'Price',
  //           dataIndex: 'net_metering_price',
  //           width: 150,
  //           key: 'net_metering_price',
  //         },
  //       ],
  //     },

  //   ];
  //   return <Table
  //     columns={columns}
  //     dataSource={filteredData}
  //     locale={locale}
  //     pagination={false}
  //     bordered
  //     size="middle"
  //     rowKey={(record) => record?.id}
  //     onChange={handleTableChange}
  //     scroll={{ x: 1200 }}
  //   />;
  // };
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
          <span>{parseInt(record.total) - parseInt(record.amount_paid)}</span>
        )
      },
    },
    {
      title: 'Paid Balance',
      dataIndex: 'amount_paid',
      key: '3',
      width: 150,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 5,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '3',
      width: 200,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 5,
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
        multiple: 5,
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
        multiple: 6,
      },
      render: (text) => format(new Date(text), 'dd-MM-yyyy'),
    },
    {
      title: "Option",
      width: 100,
      // fixed: 'right',
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
                  navigate(`/dashboard/update-invoice/${record.id}`);
                }}
              >
                <Edit fontSize="16" />&nbsp; Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseOpenMenu();
                  handleOpen();
                  setQuery(record.id); // Correctly set the query with the record ID
                }}
              >
                <DeleteOutline fontSize="16" />&nbsp; Delete
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
        console.log(res.data)
        setInvoiceData(res?.data);
        setFilteredData(res?.data);
      })
      .catch((err) => console.log(err.response.data));
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


  useEffect(() => {
    getInvoiceList();
  }, []);


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
      <DateRangePicker placeholder="Select Date Range" />
      <TextField
        fullWidth
        label="Search Invoice by name..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </Wrapper>

    <Table
      columns={columns}
      // dataSource={filteredData?.map(item => ({ ...item, key: item?.id }))}
      dataSource={InvoiceData}
      locale={locale}
      // expandable={{
      //   expandedRowRender,
      //   defaultExpandedRowKeys: ['0'],
      // }}
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
  </Card>;
};

export default InvoiceListPageView;