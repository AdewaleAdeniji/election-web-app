import { Helmet } from 'react-helmet-async';
// @mui
import { useState, useEffect } from 'react';

import {
  Grid,
  Container,
  Typography,
  Card,
  Table,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Stack,
  TableContainer,
} from '@mui/material';

// components
// sections
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { AppConversionRates, AppWidgetSummary, AppCurrentVisits, AppNewsUpdate } from '../sections/@dashboard/app';
import Iconify from '../components/iconify';
import config from '../config';
import Scrollbar from '../components/scrollbar';

// ----------------------------------------------------------------------

export default function ElectionPage() {
  const url = useLocation();
  const s = url.pathname.split('/');
  if (s.length !== 4) {
    window.location.href = '/dashboard/elections';
  }
  const electionId = s[3];
  const theme = useTheme();
  const [election, setElection] = useState({
    loading: true,
    faculties: [],
    poll: {
      subPolls: [],
      levelsCount: [],
    },
  });
  useEffect(() => {
    if (election.loading) {
      toast.loading('Loading.....');
    } else {
      toast.dismiss();
    }
  }, [election.loading]);
  const fetchElection = async () => {
    setElection({
      ...election,
      loading: true,
    });
    try {
      const e = await config.requests.getElection(electionId);
      const f = await config.requests.getFaculties();
      setElection({
        ...election,
        loading: false,
      });
      if (e.status) {
        setElection({
          faculties: f.data || [],
          poll: e.data,
          loading: false,
        });
      }
    } catch (err) {
      setElection({
        ...election,
        loading: false,
      });
      toast.error(err?.response?.data?.message || 'Error occured');
    }
  };
  useEffect(() => {
    fetchElection();
  }, []);
  const createSubPoll = async () => {
    const { value: title } = await Swal.fire({
      title: 'Create Sub Election',
      input: 'text',
      inputLabel: 'Sub Election Title',
      inputPlaceholder: 'e.g PRO Election',
      confirmButtonText: 'Proceed',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
    });

    if (title) {
      const { value: type } = await Swal.fire({
        title: 'Select Election Type',
        input: 'select',
        inputLabel: ' Election Type',
        inputOptions: ['general', 'faculty', 'department'],
        inputPlaceholder: 'Election type',
        confirmButtonText: 'Proceed',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
      });
      console.log(title, type);

      // eslint-disable-next-line radix
      if (parseInt(type) === 0) {
        console.log('here');
        // create right there
        return handleCreateSubPoll(title, 'general', '', electionId);
      }
      // console.log('here1');
      // ASK FOR FACULTY
      const { value: facultyIndex } = await Swal.fire({
        title: 'Select Faculty',
        input: 'select',
        inputLabel: 'Faculty',
        inputOptions: election?.faculties?.map((faculty) => faculty.faculty.name),
        inputPlaceholder: 'Faculty',
        confirmButtonText: 'Proceed',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
      });
      if (facultyIndex) {
        const faculty = election.faculties[facultyIndex];
        if (parseInt(type, 10) === 1) {
          // create right there
          return handleCreateSubPoll(title, 'faculty', faculty.faculty.facultyId, electionId);
        }
        const depts = faculty.depts || [];
        const { value: deptIndex } = await Swal.fire({
          title: 'Select Departments',
          input: 'select',
          inputLabel: 'Department',
          inputOptions: depts.map((d) => d.name),
          inputPlaceholder: 'Department',
          confirmButtonText: 'Proceed',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        });
        if (deptIndex) {
          const dept = depts[deptIndex];
          return handleCreateSubPoll(title, 'dept', dept.deptId, electionId);
        }
      }
    }
    return true;
  };

  const handleCreateSubPoll = async (title, type, relatedId, pollId) => {
    try {
      toast.loading('Creating subpoll..');
      const e = await config.requests.createSubElection(title, type, relatedId, pollId);
      toast.dismiss();
      if (e.status) {
        fetchElection();
        toast.success('Subpoll created successfully');
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || 'Error occured');
    }
  };
  const updateElection = async (status) => {
    const payload = {
      status,
      pollId: electionId,
    };
    try {
      toast.loading(`updating election....`);
      const e = await config.requests.updateElection(payload);
      toast.dismiss();
      fetchElection();
      if (e.status) {
        toast.success(`Election ${status ? 'Commenced, you can now share the election link' : 'Ended'}`);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || 'Error occured');
    }
  };
  // console.log(election)
  return (
    <>
      <Helmet>
        <title> Election </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {election?.poll?.poll?.title} <br />
            {election?.poll?.poll?.status && (
              <p
                style={{
                  fontSize: '14px',
                }}
              >
                POLL LINK: {`${window.location.origin}/accredit/${electionId}`}
              </p>
            )}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button variant="contained" disabled={election?.poll?.poll?.status} onClick={() => updateElection(true)}>
              Commence Election
            </Button>
            &nbsp;
            {election?.poll?.poll?.status && (
              <Button
                variant="contained"
                disabled={!election?.poll?.poll?.status}
                onClick={() => updateElection(false)}
              >
                End Election
              </Button>
            )}
            &nbsp;
            <Button variant="contained" onClick={createSubPoll}>
              Create Subpoll
            </Button>
            &nbsp;
            <Button
              variant="contained"
              disabled={!election?.poll?.poll?.status}
              target="_blank"
              href={`${window.location.origin}/results/${electionId}`}
            >
              View Results
            </Button>{' '}
            &nbsp;
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Accredited Voters"
              total={election?.poll?.accreditedVoters}
              color="info"
              icon={'ant-design:apple-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Valid Votes"
              total={election?.poll?.votes}
              color="warning"
              icon={'ant-design:windows-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Polls"
              total={election?.poll?.subPolls?.length || 0}
              color="error"
              icon={'ant-design:bug-filled'}
            />
          </Grid>
        </Grid>
        <Card sx={{ mb: 5, mt: 5 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                {election?.poll?.subPolls?.length < 1 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Sub Election created yet
                          </Typography>

                          <Typography variant="body2">
                            Click the create new Sub Election to add new faculty &nbsp;
                            <br />
                          </Typography>
                        </Paper>
                      </TableCell>
                      <TableCell align="right" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'right',
                          }}
                        >
                          <Typography variant="body2">
                            <Button
                              variant="contained"
                              startIcon={<Iconify icon="eva:plus-fill" />}
                              onClick={createSubPoll}
                            >
                              Create new Sub Election
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
              title=""
              subPoll
              list={(election?.poll?.subPolls || []).map((subPoll, index) => ({
                id: subPoll?.subPollId || index,
                title: subPoll?.title,
                description: subPoll?.visibility,
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: subPoll?.createdAt,
              }))}
            />
          </Grid>
        </Card>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Level Statistics"
              subheader="Levels Participating in the Poll"
              chartData={(election?.poll?.levelsCount || []).map((lc) => ({ label: lc?.level, value: lc?.count }))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Voters"
              chartData={[
                {
                  label: 'Accredited Voters but not voted',
                  value: (election?.poll?.accreditedVoters || 0) - (election?.poll?.votes || 0),
                },
                {
                  label: 'Accredited Voters',
                  value: election?.poll?.accreditedVoters || 0,
                },
                { label: 'Voted', value: election?.poll?.votes || 0 },
              ]}
              chartColors={[theme.palette.primary.main, theme.palette.info.main]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
