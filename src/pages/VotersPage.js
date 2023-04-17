import { Helmet } from 'react-helmet-async';
// @mui
import { Typography, Container, Stack, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
// components
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
import Iconify from '../components/iconify';
import BallotCard from '../sections/@dashboard/blog/Ballot';
import config from '../config';
// ----------------------------------------------------------------------

export default function PublicVotersPage() {

  const [subpolls, setSubPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(config.getUser(false) || {});
  const [voterPolls, setVoterPolls] = useState({
    dept: [],
    faculty: [],
    general: [],
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
  const checkIfChosen = (subpollid, contestantId) => {
    const subpoll = subpolls.filter((p) => p.subPollId === subpollid)[0];
    return subpoll.contestantId === contestantId;
  };
  const voteContestant = (subpollid, contestantid) => {
    const newMap = subpolls.map((sub) => {
      if (sub.subPollId === subpollid) {
        sub.contestantId = contestantid;
      }
      return sub;
    });
    setSubPolls(newMap);
  };
  const electionId = s[2];
  const getPolls = async () => {
    try {
      setLoading(true);
      toast.loading('Loading...');
      const polls = await config.requests.getVoterPolls();
      setLoading(false);
      setVoterPolls(polls?.data);
      mapSubPoll(polls?.data);
      toast.dismiss();
    } catch (err) {
      setLoading(false);
      toast.dismiss();
      toast.error("Coundn't load your polls");
    }
  };
  const mapSubPoll = (data) => {
    const depts = data?.dept || [];
    const facs = data?.faculty || [];
    const gen = data?.general || [];
    const all = [];
    all.push(...depts, ...facs, ...gen);
    setSubPolls(
      all.map((d) => ({
        contestantId: '',
        subPollId: d.subPollId,
      }))
    );
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
        // console.log(polll.data)
      } else {
        toast.warning('This POLL is either cancelled, or inactive!.. Please contact your administrator');
      }
    } catch (err) {
      setLoading(false);
      toast.warning('This POLL is either cancelled, or inactive!... Please contact your administrator');
    }
    return false;
  };
  useEffect(() => {
    backgroundPollSync();
    getPolls();
  }, []);
  const vote = async () => {
    // validate poll
    // ask for confirmation
    const unpoll =  subpolls.filter((p) => p.contestantId === "")
    if(unpoll.length > 0) return toast.warning('You have open ballots');
 
    try {
      setLoading(true);
      toast.loading("Casting vote..");
      const cast =  await config.requests.vote({
        ballots: subpolls
      })
      toast.dismiss();

      setLoading(false);
      if(cast.status){
        localStorage.removeItem(config.VOTER_STORAGE_KEY);
        setUser({
          ...user,
          voted: true
        })
        Swal.fire({
          text: "Vote Casted Successfully",
          icon: "success",
          showConfirmButton: false,
        })
        navigate(`/accredit/${electionId}`, { replace: true });
      }
      else {
        toast.error("Failed to submit vote!");
      }

    }
    catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("Failed to vote!, You have already voted before");
      setLoading(false);
    }
    return false
  }
  return (
    <>
      <Helmet>
        <title> VOTE FOR YOUR CANDIDATE </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={10}>
          <Typography variant="h4" gutterBottom>
            {poll?.details?.title}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={1}>
          <Typography variant="h6" gutterBottom>
            Cast your Vote by selecting aspirants below
          </Typography>
        </Stack>
        <Stack sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            SUG Election
          </Typography>
        </Stack>
        {(voterPolls?.general || []).map((poll) => (
          <Stack sx={{ mt: 2 }} key={poll.subPollId}>
            <Typography variant="h4" gutterBottom>
              {poll.title}
            </Typography>
            <Grid container spacing={3}>
              {poll.contestants.map((user, index) => (
                <BallotCard
                  key={index}
                  user={user}
                  index={index}
                  voted={checkIfChosen(poll.subPollId, user.contestantId)}
                  handleVote={() => voteContestant(poll.subPollId, user.contestantId)}
                />
              ))}
            </Grid>
          </Stack>
        ))}
        <Stack sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            Faculty Election
          </Typography>
        </Stack>
        {(voterPolls?.faculty || []).map((poll) => (
          <Stack sx={{ mt: 2 }} key={poll.subPollId}>
            <Typography variant="h4" gutterBottom>
              {poll.title}
            </Typography>
            <Grid container spacing={3}>
              {poll.contestants.map((user, index) => (
                <BallotCard
                  key={index}
                  user={user}
                  index={index}
                  voted={checkIfChosen(poll.subPollId, user.contestantId)}
                  handleVote={() => voteContestant(poll.subPollId, user.contestantId)}
                />
              ))}
            </Grid>
          </Stack>
        ))}
        <Stack sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            Department Election
          </Typography>
        </Stack>
        {(voterPolls?.dept || []).map((poll) => (
          <Stack sx={{ mt: 2 }} key={poll.subPollId}>
            <Typography variant="h4" gutterBottom>
              {poll.title}
            </Typography>
            <Grid container spacing={3}>
              {poll.contestants.map((user, index) => (
                <BallotCard
                  key={index}
                  user={user}
                  index={index}
                  voted={checkIfChosen(poll.subPollId, user.contestantId)}
                  handleVote={() => voteContestant(poll.subPollId, user.contestantId)}
                />
              ))}
            </Grid>
          </Stack>
        ))}

        <Stack sx={{ mt: 10, mb: 10 }}>
          <Typography variant="body2">
            <LoadingButton
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              loading={loading}
              disabled={!poll.synced || user.voted || !user.voter}
              onClick={vote}
            >
              Submit Votes!
            </LoadingButton>
          </Typography>
        </Stack>
        <Stack sx={{ mt: 10, mb: 10 }} />
      </Container>
    </>
  );
}
