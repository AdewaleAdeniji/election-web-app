import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Button, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Swal from 'sweetalert2';
import config from '../../../config';
import Iconify from '../../../components/iconify';
import { cachePut, request } from '../../../utils/formatTime';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: '',
    password: '',
    loading: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e) => {
    console.log('handle click called');
    e.preventDefault();
    if (payload.email.length === 0 || payload.password.length === 0)
      return inform(false, 'Email or password is required');
  
    // make the api call
    setPayload({ ...payload, loading: true });

    const req = {
      method: 'post',
      path: `/login`,
      data: JSON.stringify(payload),
    };

    const login = await request(req);
    setPayload({ ...payload, loading: false });
    if(login.status === 200){
      // console.log(login.data.data)
      cachePut(config.USER_STORAGE_KEY, JSON.stringify(login.data.data))
      inform("success","Login Successful");
      navigate('/dashboard', { replace: true });
    }
    else {
      const message = login.data.message || "Unknown error occured";
      inform(false, message);
    }
    return true;
  };
  const inform = (type, message) => {
    Swal.fire({
      text: message,
      icon: type || 'error',
    });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          onChange={(e) => setPayload({ ...payload, email: e.target.value })}
          type="email"
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPayload({ ...payload, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <Button fullWidth size="large" type="button" variant="contained" onClick={handleClick} loading={payload.loading}>
        Login
      </Button>
    </>
  );
}
