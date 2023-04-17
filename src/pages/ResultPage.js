import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Container, Stack, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AppWidgetSummary } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------
import ContestantsList from '../sections/@dashboard/products/ContestantList';
import config from '../config';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function PublicResultPage() {
  const url = useLocation();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    accreditedVoters: 0,
    votes: 0,
    results: [],
  });
  const [poll, setPollSync] = useState({
    id: '',
    synced: false,
    departments: [],
  });
  const s = url.pathname.split('/');
  if (s.length !== 3) {
    toast.warning('This POLL is either cancelled, or inactive!. Please contact your administrator');
  }
  const electionId = s[2];
  const fetchResults = async (refresh = false) => {
    try {
      if(!refresh) {
        toast.loading('Refreshing results....');
      }
      const res = await config.requests.getResults(electionId);
      setResults({
        ...results,
        ...res.data
      });
      window.setTimeout(()=> fetchResults(true), 5000);
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
      toast.error('Could not fetch results');
    }
  };
  const backgroundPollSync = async () => {
    setLoading(true);
    try {
      const polll = await config.requests.getElectionTip(electionId);
      setLoading(false);
      // console.log(polll);
      if (polll.status && polll?.data?.poll?.status) {
        setPollSync({
          ...poll,
          synced: polll?.data?.poll?.status || false,
          departments: polll?.data?.depts || [],
          details: polll?.data?.poll,
        });
        fetchResults();
        // console.log(polll.data)
      } else {
        toast.warning('This POLL is either cancelled, or inactive!.. Please contact your administrator');
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.warning('This POLL is either cancelled, or inactive!... Please contact your administrator');
    }
    return false;
  };
  useEffect(() => {
    backgroundPollSync();
  }, []);

  return (
    <>
      <Helmet>
        <title> Election Results Page </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={10}>
          <Typography variant="h4" gutterBottom>
            {poll?.details?.title} - Election Results
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Accredited Voters"
              total={results?.accreditedVoters || 0}
              color="info"
              icon={'ant-design:apple-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Valid Votes"
              total={results?.votes || 0}
              color="warning"
              icon={'ant-design:windows-filled'}
            />
          </Grid>
        </Grid>
        <Stack sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            Result Breakdown
          </Typography>
        </Stack>
          {
            results.results.map((poll)=> (<Stack sx={{ mt: 10 }} key={poll.title}>
              <Typography variant="h6" gutterBottom>
                {poll.title}
              </Typography>
              <ContestantsList contestants={(poll.result||[]).map((r)=> ({
                  ...r,
                  results: true,
                }))} />
            </Stack>))
          }
        
      </Container>
    </>
  );
}
