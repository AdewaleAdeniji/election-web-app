import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Stack } from '@mui/material';

// components
// sections
import ContestantsList from '../sections/@dashboard/products/ContestantList';
import { AppWidgetSummary } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function ResultsPage() {
  const contestants = [
    { name: 'oluwaferanmi', imageUrl: '/assets/images/products/product_1.jpg', nickName: 'devferanmi',votes: 50000, results: true },
  ];
  return (
    <>
      <Helmet>
        <title> Results </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Election Title - Election Results
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Accredited Voters" total={0} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Valid Votes" total={0} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Contestants" total={0} color="error" icon={'ant-design:bug-filled'} />
          </Grid>
        </Grid>
        <Stack sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            General Election
          </Typography>
          <ContestantsList contestants={contestants} />
        </Stack>
        <Stack sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            Faculty Elections
          </Typography>
          <ContestantsList contestants={contestants} />
        </Stack>
      </Container>
    </>
  );
}
