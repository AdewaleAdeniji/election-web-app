import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Link } from 'react-router-dom';
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
import { UserListToolbar } from '../sections/@dashboard/user';

export default function FacultiesPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [faculties, setFaculties] = useState({
    loading: false,
    faculties: [],
  });
  const [selected] = useState([]);
  const [focusedId, setFocusedId] = useState('');
  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleOpenMenu = (event, facultyId) => {
    console.log(facultyId);
    setFocusedId(facultyId);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  useEffect(() => {
    if (faculties.loading) {
      toast.loading('Loading.....');
    } else {
      toast.dismiss();
    }
  }, [faculties.loading]);
  const fetchStats = async () => {
    setFaculties({
      ...faculties,
      loading: true,
    });
    const profile = await config.requests.getProfile();
    setFaculties({
      faculties: profile.faculties || [],
      loading: false,
    });
  };
  const handleDeleteFaculty = () => {
    Swal.fire({
      text: 'are you sure you want to delete this faculty?',
      confirmButtonText: 'Yes delete',
      showCancelButton: true,
      cancelButtonText: 'No, Cancel',
    }).then(async (confirm) => {
      if (confirm.isConfirmed) {
        // delete faculty
        toast.loading('Deleting Faculty....');
        const cf = await config.requests.deleteFaculty(focusedId);
        toast.dismiss();
        if (cf.status) {
          toast.success('Faculty deleted successfully');
          fetchStats();
        } else {
          toast.error('Failed to delete faculty');
        }
      }
    });
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchStats();
  }, []);
  const createFaculty = async () => {
    // only the name is needed
    const { value: name } = await Swal.fire({
      title: 'Create faculty',
      input: 'text',
      inputLabel: 'Faculty Name',
      inputPlaceholder: 'Enter faculty name',
      confirmButtonText: 'Create Faculty',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
    });

    if (name) {
      // create faculty
      toast.loading('Creating Faculty....');
      const cf = await config.requests.createFaculty(name);
      toast.dismiss();
      if (cf.status) {
        toast.success('Faculty created successfully');
        fetchStats();
      } else {
        toast.error('Failed to create faculty');
      }
    }
  };
  return (
    <>
      <Helmet>
        <title> Faculties </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Faculties
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={createFaculty}>
            Create new faculty
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableCell padding="checkbox" />
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">FacultyID</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left" />
                <TableCell align="left" />

                <TableBody>
                  {faculties.faculties.map((faculty) => (
                    <TableRow hover key={faculty.facultyId} tabIndex={-1} role="checkbox">
                      <TableCell padding="checkbox" />
                      <TableCell align="left">{faculty.name}</TableCell>
                      <TableCell align="left">{faculty.facultyId}</TableCell>
                      <TableCell align="left">{faculty.active ? 'Active' : 'Inactive'}</TableCell>

                      <TableCell align="left">
                        <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, faculty.facultyId)}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                        <Link to={`/dashboard/faculties/${faculty.facultyId}`}>
                          <Button variant="contained">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                {faculties.faculties.length < 1 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Faculties created yet
                          </Typography>

                          <Typography variant="body2">
                            Click the create new faculty to add new faculty &nbsp;
                            <br />
                            <Button
                              variant="contained"
                              startIcon={<Iconify icon="eva:plus-fill" />}
                              onClick={createFaculty}
                            >
                              Create new faculty
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
            count={faculties.faculties.length}
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
        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteFaculty}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
