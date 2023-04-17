import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// components
// sections
import { useEffect, useState } from 'react';
import config from '../config';
import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  // fetch election, departments and faculties
  // use the one in local before calling api
  const user = config.getUser();
  if(!user) return <></>;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [result, setResult] =  useState({
    polls: user?.polls?.length||0,
    faculties:user?.faculties?.length||0,
    depts: user?.depts?.length||0
  })
  const fetchStats = async () => {
    const profile = await config.requests.getProfile()
    // setResult(getProfile)
    setResult({
      polls: profile?.polls?.length||0,
      faculties: profile?.faculties?.length||0,
      depts: profile?.depts?.length||0
    })
    // console.log('updated!')
    
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=> {
    fetchStats();
  },[])
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Elections" total={result.polls} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Faculties" total={result.faculties} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Departments" total={result.depts} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>


        </Grid>
      </Container>
    </>
  );
}
