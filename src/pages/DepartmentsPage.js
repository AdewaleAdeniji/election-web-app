import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Link, useLocation } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import config from '../config';

// mock

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function DepartmentsPage() {
  const url = useLocation();
  const s = url.pathname.split('/');
  if (s.length !== 4) {
    window.location.href = '/dashboard/faculties';
  }
  const facultyID = s[3];

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [depts, setDepts] = useState({
    loading: false,
    depts: [],
  });
  const [focusedId, setFocusedId] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleOpenMenu = (event, facultyId) => {
    setFocusedId(facultyId);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    if (depts.loading) {
      toast.loading('Loading.....');
    } else {
      toast.dismiss();
    }
  }, [depts.loading]);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const fetchDepts = async () => {
    setDepts({
      ...depts,
      loading: true,
    });
    const dept = await config.requests.getFaculty(facultyID);
    // console.log(dept);
    setDepts({
      ...dept.data,
      loading: false,
    });
  };
  // console.log(depts)
  const handleDeleteDept = () => {
    Swal.fire({
      text: 'are you sure you want to delete this Department?',
      confirmButtonText: 'Yes delete',
      showCancelButton: true,
      cancelButtonText: 'No, Cancel',
    }).then(async (confirm) => {
      if (confirm.isConfirmed) {
        // delete faculty
        toast.loading('Deleting Department....');
        const cf = await config.requests.deleteDept(focusedId);
        toast.dismiss();
        if (cf.status) {
          toast.success('Department deleted successfully');
          fetchDepts();
        } else {
          toast.error('Failed to delete Department');
        }
      }
    });
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchDepts();
  }, []);
  const createDept = async () => {
    // only the name is needed
    const { value: name } = await Swal.fire({
      title: 'Create Department',
      input: 'text',
      inputLabel: 'Department Name',
      inputPlaceholder: 'Enter Department name',
      confirmButtonText: 'Create Department',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
    });

    if (name) {
      // create Department
      toast.loading('Creating Department....');
      const payload = {
        name,
        facultyId: facultyID,
      };
      try {
        const cf = await config.requests.createDept(payload);
        toast.dismiss();
        if (cf.status) {
          toast.success('Department created successfully');
          fetchDepts();
        } else {
          toast.error('Department to create faculty');
        }
      } catch {
        toast.error('Department to create faculty');
      }
    }
  };
  return (
    <>
      <Helmet>
        <title> Faculty Departments </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {depts?.name} - Departments
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={createDept}>
            Create new department
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableCell padding="checkbox" />
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">DeptID</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left" />
                <TableCell align="left" />

                <TableBody>
                  {depts.depts.map((dept) => (
                    <TableRow hover key={dept.facultyId} tabIndex={-1} role="checkbox">
                      <TableCell padding="checkbox" />
                      <TableCell align="left">{dept?.name}</TableCell>
                      <TableCell align="left">{dept?.deptId}</TableCell>
                      <TableCell align="left">{dept.active ? 'Active' : 'Inactive'}</TableCell>

                      <TableCell align="left">
                        <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, dept.deptId)}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                        <Link to={`/dashboard/faculties/${dept.facultyId}`}>
                          <Button variant="contained">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                {depts.depts.length < 1 && !depts.loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Departments created yet
                          </Typography>

                          <Typography variant="body2">
                            <br />
                            <Button
                              variant="contained"
                              startIcon={<Iconify icon="eva:plus-fill" />}
                              onClick={createDept}
                            >
                              Create new department
                            </Button>
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[25]}
            component="div"
            count={depts.depts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteDept}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
