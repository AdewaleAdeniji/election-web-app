import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Grid,
} from '@mui/material';
// components
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import config from '../config';
import {
    AppNewsUpdate,
  } from '../sections/@dashboard/app';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
// mock

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------




export default function ElectionsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchPolls();
  }, []);
  const fetchPolls = async () => {
    try {
      setLoading(true);
      const profile = await config.requests.getProfile();
      setPolls(profile.polls);
      setLoading(false)
    }
    catch {
      setLoading(false)
      toast.error("Failed to fetch elections")
    }
  }
  useEffect(() => {
    if (loading) {
      toast.loading('Loading.....');
    } else {
      toast.dismiss();
    }
  }, [loading]);
  const createElection = async () => {
    // only the name is needed
    const { value: name } = await Swal.fire({
      title: 'Create Election',
      input: 'text',
      inputLabel: 'Election Title',
      inputPlaceholder: 'Election Title',
      confirmButtonText: 'Create Election',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
    });

    if (name) {
      // create faculty
      toast.loading('Creating Election....');
      const cf = await config.requests.createElection(name);
      toast.dismiss();
      if (cf.status) {
        toast.success('Election created successfully');
        fetchPolls();
      } else {
        toast.error('Failed to create Election');
      }
    }
  };
  return (
    <>
      <Helmet>
        <title> Elections </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            -
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={createElection}>
            Create new election
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                {polls.length < 1 && !loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Election created yet
                          </Typography>

                          <Typography variant="body2">
                            Click the create new Election to add new faculty &nbsp;
                            <br />
                            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                              Create new Election
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
        <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Elections"
              list={polls.map((poll, index) => ({
                id: poll.pollId,
                title: poll.title,
                description: poll.createdAt,
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: poll.createdAt,
              }))}
            />
          </Grid>
        </Card>
      </Container>
    </>
  );
}
