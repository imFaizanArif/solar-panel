import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from 'antd';
import { TableMoreMenu } from "@/components/table";
import { H5, H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import { Box, Button, Card, Menu, MenuItem, Modal, Stack, styled, TextField } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK

// import Add from "@/icons/Add"; // CUSTOM ICON COMPONENTS
import Sessions from "@/icons/sidebar/Sessions";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { IconWrapper } from "@/components/icon-wrapper";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
// import { set } from "nprogress";


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
const ExpenditureListPageView = () => {
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
  const [ExpenditureData, setExpenditureData] = useState([]);
  const [expenditureList, setExpenditureList] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [rowId, setRowId] = useState(0);
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
      setFilteredData(ExpenditureData);
    } else {
      const filteredData = ExpenditureData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };
  // Search
  const expandedRowRender = () => {
    const columns = [
      {
        title: 'Expenditure ID',
        dataIndex: 'id',
        key: 'id',
        width: 150,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: 'Price',
        dataIndex: 'value',
        key: 'value',
        width: 150,
      },
      {
        title: "Option",
        width: 70,
        render: (text, record) => {
          // console.log(text.id);
          return (
            <>
              <Button
                aria-controls={openMenuEl === record.id ? 'simple-menu' : undefined}
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
                open={openMenuEl === record.id}
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
                    navigate(`/dashboard/update-expenditure/${record.id}`);
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
    return <Table
      columns={columns}
      locale={locale}
      dataSource={expenditureList}
      pagination={{
        total: expenditureList.length,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
        showSizeChanger: true,
        pageSize: pageSize,
        current: current,
        onChange: handleTableChange,
        onShowSizeChange: (current, size) => {
          setPageSize(size);
        },
      }}
      size="middle"
    />;
  };
  const columns = [
    {
      title: 'Invoice ID',
      width: 100,
      dataIndex: 'inv_id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 1,
      },
      render: (text, record) => {
        return (
          <Link to={"/dashboard/invoice-list"} style={{ color: "black", fontWeight: 600 }}>
            {text}
          </Link>
        )
      },
      // fixed: 'left',
    },
    {
      title: 'Client Name',
      width: 150,
      dataIndex: 'inv_id',
      key: 'inv_id',
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 2,
      },
      render: (text, record) => {
        const filterdInvoiceData = invoiceData.filter(expenditure => expenditure.id === text);
        // console.log(filterdInvoiceData, "filterdInvoiceData");
        // console.log(record, "record");
        return (
          <Link to={"/dashboard/expenditure-list"}>
            {filterdInvoiceData[0]?.name?.name}
          </Link>
        )
      },
    },
    {
      title: 'Total Expensditure',
      dataIndex: 'totalValue',
      key: '3',
      width: 150,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 5,
      },
    },
  ];
  const handleOpenMenu = (event, record) => {
    setOpenMenuEl(record.id);
    setAnchorEl(event.currentTarget); // Set the anchor element to the current target
  };

  const getExpenditureList = () => {
    axios.get(baseApiUrl + "/api/Expenditures/?format=json")
      .then((res) => {
        const ExpendituresData = res?.data;
        setExpenditureList(ExpendituresData.filter(expenditure => expenditure.inv_id === rowId));
        // console.log(ExpendituresData.filter(expenditure => expenditure.inv_id === rowId), "ExpendituresDatayyyyyyyyy");
        // Step 1: Group data by `inv_id` and calculate totals
        const groupedData = ExpendituresData?.reduce((acc, item) => {
          if (!acc[item.inv_id]) {
            acc[item.inv_id] = { totalValue: 0, inv_id: item.inv_id };
          }
          acc[item.inv_id].totalValue += item.value;
          return acc;
        }, {});
        // Step 2: Convert the grouped data to an array
        const result = Object.values(groupedData);
        setExpenditureData(result);
        setFilteredData(result);
      })
      .catch((err) => console.log(err.response.data));
  };
  const getInvoiceCustomerNameList = () => {
    axios.get(baseApiUrl + "/invoice/?format=json")
      .then((res) => {
        const InvoiceData = res?.data;
        setInvoiceData(InvoiceData);
      })
      .catch((err) => console.log(err.response.data));
  };

  const deleteExpenditure = (id) => {
    axios.delete(baseApiUrl + "/api/Expenditures/" + `${id}/`)
      .then((res) => {
        if (res.status == 204) {
          getExpenditureList();
          toast.success("Expenditure Deleted Successfully");
        }
      })
      .catch((err) => {
        toast.error("Record Not Deleted");
      });
  }
  useEffect(() => {
    getExpenditureList();
    getInvoiceCustomerNameList();
  }, []);
  useEffect(() => {
    getExpenditureList();
  }, [rowId || expandedRowKeys]);
  // const handleExpand = (expanded, record) => {
  //   if (expanded) {
  //     setRowId(record.inv_id);
  //     console.log('Expanded row ID:', record.inv_id);
  //     // Perform any action with the expanded row's inv_id
  //   } else {
  //     console.log('Collapsed row ID:', record.inv_id);
  //   }
  // };
  const handleExpand = (expanded, record) => {
    if (expanded) {
      setRowId(record.inv_id);
      setExpandedRowKeys([record.inv_id]);
    } else {
      setRowId(0);
      setExpandedRowKeys([]);
    }
  };
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
          <Sessions color="primary" />
        </IconWrapper>

        <H5 fontSize={16}>Expenditure List</H5>
      </Stack>
    </FlexBetween>

    <Wrapper gap={2} px={2} pb={3}>
      <TextField
        fullWidth
        label="Search Expenditure by name..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </Wrapper>

    <Table
      columns={columns}
      dataSource={filteredData.map(item => ({ ...item, key: item.id }))}
      locale={locale}
      pagination={{
        total: ExpenditureData.length,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
        showSizeChanger: true,
        pageSize: pageSize,
        current: current,
        onChange: handleTableChange,
        onShowSizeChange: (current, size) => {
          setPageSize(size);
        },
      }}
      // rowKey={(record) => record.inv_id}
      rowKey="inv_id"
      onChange={handleTableChange}
      scroll={{ x: 600 }}
      size="large"
      expandable={{
        expandedRowRender,
        expandedRowKeys,
        onExpand: handleExpand,
      }}
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
          <H6 fontSize={18}>Delete Expenditure</H6>

          <Paragraph mt={1}>Are you sure want to delete?</Paragraph>
          <FlexBox justifyContent="flex-end" gap={2} marginTop={4}>
            <Button fullWidth variant="outlined" onClick={() => handleClose()}>
              Cancel
            </Button>

            <Button fullWidth type="submit" variant="contained" color="error"
              onClick={() => {
                deleteExpenditure(query)
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

export default ExpenditureListPageView;