import { Helmet } from 'react-helmet-async';
// @mui
import { useState, useEffect } from 'react';
import { Grid, Container, Typography, Button, Stack } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
// components
// sections
import ContestantsList from '../sections/@dashboard/products/ContestantList';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import config from '../config';

// ----------------------------------------------------------------------

export default function SubPollPage() {
  const navigate = useNavigate();
  const url = useLocation();
  const s = url.pathname.split('/');
  if (s.length !== 4) {
    window.location.href = '/dashboard/elections';
  }
  const electionId = s[3];

  const [election, setElection] = useState({
    loading: true,
    poll: {
      contestants: [],
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
      const e = await config.requests.getSubElection(electionId);
      setElection({
        ...election,
        loading: false,
      });
      if (e.status) {
        setElection({
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
  const createContestant = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create Contestant',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Nick Name">' +
        '<input id="swal-input3" type="file" class="swal2-input" placeholder="Photo" accept=".jpg, .jpeg">',
      focusConfirm: false,
      preConfirm: () => [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value,
        document.getElementById('swal-input3'),
      ],
    });

    if (formValues) {
      const name = formValues[0];
      const nickname = formValues[1];
      const photo = formValues[2].files;
      if (name === '' || nickname === '' || photo.length === 0) {
        return toast.error('Please fill in the details correctly');
      }
      return uploadFile(photo[0], name, nickname);
    }
    return true;
  };
  // console.log(election);
  function uploadFile(file, name, nickname) {
    const configs = {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    };

    // add cloudinary url
    toast.loading(`Creating Contestant ${name}`);
    const url = 'https://api.imgbb.com/1/upload'; // "https://api.cloudinary.com/v1_1/hdlky7wud/upload/";
    const data = new FormData();
    data.append('upload_preset', 'phalconwise_users'); // append cloudinary specific config
    data.append('file', file);
    data.append('image', file, `${name}-${nickname}.jpeg`);
    data.append('key', '324e405ba26e81468f379a74133a3d3f');
    axios
      .post(url, data, configs)
      .then(async (res) => {
        toast.dismiss();
        if (res.data) {
          const imageurl = res.data.data.url;
          // console.log(imageurl);
          const payload = {
            name,
            nickname,
            imageUrl: imageurl,
            pollId: election?.poll?.poll?.pollId,
            subPollId: electionId,
          };

          const createC = await config.requests.createContestant(payload);
          toast.dismiss();
          if (createC) {
            toast.success(`Contestant ${name} created successfully`);
            fetchElection();
          }
        }
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss();
        toast.error('Image Upload failed');
      });
  }
  const handleDeleteSubElection = () => {
    Swal.fire({
      text: 'are you sure you want to delete this sub election?',
      confirmButtonText: 'Yes delete',
      showCancelButton: true,
      cancelButtonText: 'No, Cancel',
    }).then(async (confirm) => {
      if (confirm.isConfirmed) {
        // delete faculty
        toast.loading('Deleting Subpoll....');
        const cf = await config.requests.deleteSubElection(electionId);
        toast.dismiss();
        if (cf.status) {
          navigate(`/dashboard/elections/${election?.poll?.poll?.pollId}`, { replace: true });
          toast.success('Sub election deleted successfully');
        } else {
          toast.error('Failed to delete Sub election');
        }
      }
    });
  };
  const deleteContestants = (id) => {
    Swal.fire({
      text: 'are you sure you want to delete this contestant?',
      confirmButtonText: 'Yes delete',
      showCancelButton: true,
      cancelButtonText: 'No, Cancel',
    }).then(async (confirm) => {
      if (confirm.isConfirmed) {
        // delete faculty
        toast.loading('Deleting contestant....');
        const cf = await config.requests.deleteContestant(id);
        toast.dismiss();
        if (cf.status) {
          toast.success('Department deleted successfully');
          fetchElection();
        } else {
          toast.error('Failed to delete contestant');
        }
      }
    });
  };
  return (
    <>
      <Helmet>
        <title> Election </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {election?.poll?.poll?.title} - {election?.poll?.poll?.visibility}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button variant="contained" onClick={createContestant}>
              Add Contestants
            </Button>
            &nbsp;
            <Button variant="contained" color="error" onClick={handleDeleteSubElection}>
              Delete Sub Election{' '}
            </Button>
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
              title="Contestants"
              total={(election?.poll?.contestants || []).length}
              color="error"
              icon={'ant-design:bug-filled'}
            />
          </Grid>
        </Grid>
        <Stack sx={{ mt: 10 }}>
          <ContestantsList contestants={election?.poll?.contestants || []} deleteContestant={deleteContestants} />
        </Stack>
      </Container>
    </>
  );
}
