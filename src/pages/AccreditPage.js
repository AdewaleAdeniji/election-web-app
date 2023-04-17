import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, TextField, Stack, Link, Select } from '@mui/material';
// hooks
import { useLocation, useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
import { cachePut } from '../utils/formatTime';
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import config from '../config';



// import Iconify from '../components/iconify';
// sections

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

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

export default function PublicAccredit() {
  const url = useLocation();
  const navigate = useNavigate();
  const mdUp = useResponsive('up', 'md');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);
  const [formStep, setFormStep] = useState(0);
  const [matric, setMatric] = useState('');
  const [dept, setDept] = useState('');
  const [level, setLevel] = useState('');
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
      console.log(err);
      setLoading(false);
      toast.warning('This POLL is either cancelled, or inactive!... Please contact your administrator');
    }
    return false;
  };
  useEffect(() => {
    backgroundPollSync();
  }, []);
  const handleSubmit = () => {
    if (formStep === 0) {
      // validate email
      if (email === '') return toast.warning('Email Field is empty');
      return validateEmail(email);
    }
    if (formStep === 1) {
      // validate otp
      if (otp === '' || otp.length !== 7) return toast.warning('OTP must be 7 characters in length');
      return verifyOTP(otp);
    }
    if (formStep === 2) {
      if (matric === '' || matric.length !== 6) return toast.warning('Please enter a valid matric number');
      if (level === '' || dept === '') return toast.warning('Please fill in level and department');
      return accreditUser(matric, dept, level);
    }
    return false;
  };
  const accreditUser = async (matric, dept, level) => {
    const payload = {
      email,
      level,
      dept,
      matric,
      otp,
      pollId: electionId,
    };
    try {
      toast.loading("Accrediting you for election");
      setLoading(true);
      const acc = await config.requests.accreditUser(payload);
      setLoading(false);
      toast.dismiss();
      if(acc.status){
        cachePut(config.VOTER_STORAGE_KEY, JSON.stringify(acc.data))
        toast.success("Accredited Successfully!");
        navigate(`/vote/${electionId}`, { replace: true });
        Swal.fire({
          title: "Accreditation Successful",
          text: "Proceed to cast your vote now",
          timer: 5000,
          icon: "success"
        })
      }
      else {
        toast.error("Failed to accredit you for the election");
      }
    }
    catch(err) {
      console.log(err);
      toast.dismiss();
      setLoading(false);
      toast.error(err?.response?.data?.message || "Failed to accredit you for the election");
    }
  };
  const verifyOTP = async (otp) => {
    if (otp === '') {
      return toast.warning('otp Field is empty');
    }

    try {
      toast.loading('Verifying otp...');
      setLoading(true);
      await config.requests.tipOtp(otp);
      setLoading(false);
      toast.dismiss();
      setFormStep(2);
    } catch (err) {
      toast.dismiss();
      setLoading(false);
      toast.error('OTP could not be validated');
    }
    return false;
  };
  const validateEmail = async (email) => {
    if (email === '') {
      return toast.warning('Email Field is empty');
    }
    try {
      toast.loading('Validating email...');
      setLoading(true);
      const emailVal = await config.requests.verifyEmail(email);
      setLoading(false);
      toast.dismiss();
      if (emailVal.status) {
        toast.success('An OTP has been sent to your email, Please check it and enter the code to proceed!');
        setFormStep(1);
        return true;
      }
      toast.error('Email could not be validated');
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error('Email could not be validated');
    }
    return false;
  };
  return (
    <>
      <Helmet>
        <title> Election Management Software </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Voters Accreditation for Election
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Enter your school email address
            </Typography>

            <Stack spacing={3} mb={5}>
              <TextField name="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              {formStep > 0 && (
                <TextField
                  name="number"
                  label="OTP"
                  placeholder={`OTP sent to your email ${email}`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}
              {formStep > 1 && (
                <>
                  <TextField
                    type="number"
                    label="Matric Number"
                    value={matric}
                    onChange={(e) => setMatric(e.target.value)}
                  />
                  <InputLabel>Level</InputLabel>
                  <Select label="Level" value={level} onChange={(e) => setLevel(e.target.value)}>
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={300}>300</MenuItem>
                    <MenuItem value={400}>400</MenuItem>
                    <MenuItem value={500}>500</MenuItem>
                  </Select>
                  <InputLabel>Department</InputLabel>
                  <Select label="Department" value={dept} onChange={(e) => setDept(e.target.value)}>
                    {(poll?.departments || []).map((dept) => (
                      <MenuItem key={dept.deptId} value={dept.deptId}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </Stack>
            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSubmit}
              loading={loading}
              disabled={!poll.synced}
            >
              Proceed
            </LoadingButton>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              <Link variant="subtitle2" underline="hover" onClick={() => validateEmail(email)}>
                Resend OTP
              </Link>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
