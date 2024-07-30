import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from 'antd';
import { TableMoreMenu } from "@/components/table";
import { H5, H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import { Box, Button, Card, Menu, MenuItem, Modal, Stack, styled, TextField } from "@mui/material";

import useNavigate from "@/hooks/useNavigate"; // CUSTOM DEFINED HOOK

import Add from "@/icons/Add"; // CUSTOM ICON COMPONENTS
import DataTable from "@/icons/sidebar/DataTable";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { IconWrapper } from "@/components/icon-wrapper";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


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
const LightningArrestorListPageView = () => {
  let navigate = useNavigate();
  const baseApiUrl = import.meta.env.VITE_API_URL + "/api/LightningArrestor/";
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
  const [LightningArrestorData, setLightningArrestorData] = useState([]);
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
      setFilteredData(LightningArrestorData);
    } else {
      const filteredData = LightningArrestorData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };
  // Search

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
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: '3',
      width: 150,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 5,
      },
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
                  navigate(`/dashboard/update-lightning-arrestor/${record.id}`);
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
    setOpenMenuEl(record.id);
    setAnchorEl(event.currentTarget); // Set the anchor element to the current target
  };

  const getLightningArrestorList = () => {
    axios.get(baseApiUrl + "?format=json")
      .then((res) => {
        setLightningArrestorData(res?.data?.results);
        setFilteredData(res?.data?.results);
      })
      .catch((err) => console.log(err.response.data));
  };

  const deleteLightningArrestor = (id) => {
    axios.delete(baseApiUrl + `${id}/`)
      .then((res) => {
        if (res.status == 204) {
          getLightningArrestorList();
          toast.success("Lightning Arrestor Deleted Successfully");
        }
      })
      .catch((err) => {
        toast.error("Record Not Deleted");
      });
  }
  useEffect(() => {
    getLightningArrestorList();
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
          <DataTable color="primary" />
        </IconWrapper>

        <H5 fontSize={16}>Lightning Arrestor List</H5>
      </Stack>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/create-lightning-arrestor")}>
        Add Lightning Arrestor
      </Button>
    </FlexBetween>

    <Wrapper gap={2} px={2} pb={3}>
      {/* <DateRangePicker placeholder="Select Date Range" /> */}
      <TextField
        fullWidth
        label="Search lightning arrestor by name..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </Wrapper>

    <Table
      columns={columns}
      dataSource={filteredData.map(item => ({ ...item, key: item.id }))}
      locale={locale}
      pagination={{
        total: LightningArrestorData.length,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
        showSizeChanger: true,
        pageSize: pageSize,
        current: current,
        onChange: handleTableChange,
        onShowSizeChange: (current, size) => {
          setPageSize(size);
        },
      }}
      rowKey={(record) => record.id}
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
          <H6 fontSize={18}>Delete Lightning Arrestor</H6>

          <Paragraph mt={1}>Are you sure want to delete?</Paragraph>
          <FlexBox justifyContent="flex-end" gap={2} marginTop={4}>
            <Button fullWidth variant="outlined" onClick={() => handleClose()}>
              Cancel
            </Button>

            <Button fullWidth type="submit" variant="contained" color="error"
              onClick={() => {
                deleteLightningArrestor(query)
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

export default LightningArrestorListPageView;