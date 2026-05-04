import GitHubIcon from '@mui/icons-material/GitHub';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Toolbar, Typography } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import { useNavigate, use搜索Params } from 'react-router-dom';
import { getToken } from '../api/api';
import { useAppDispatch } from '../app/hooks';
import { API状态Type } from '../reducer/common';
import { getUser个人资料Async, User } from '../reducer/userSlice';

interface Props {
  user: User | null
  userAPI状态: API状态Type
  handleLogin: () => void
}

const isLoading = (api状态: API状态Type, user: User | null): boolean => {
  return api状态 === API状态Type.LOADING || user != null;
}

const Login: React.FC<Props> = ({ user, handleLogin, userAPI状态 }): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = use搜索Params();
  const loginSuccess = searchParams.get('success') === "true";

  useEffect(() => {
    user != null && navigate("/", { replace: true });
    if (loginSuccess) {
      // user has just completed the oauth login
      // call getToken api to get the app token and store it in localStorage
      getToken().then(() => {
        dispatch(getUser个人资料Async());
        navigate("/", { replace: true });
      })
    }
  }, [user, loginSuccess]);

  return (
    <Container maxWidth="xl">
      <Toolbar variant="dense" />

      <Box display="flex" sx={{ my: 2 }} alignItems="center" justifyContent={'space-around'}>
        <Box flexGrow={1} sx={{ mx: 0, my: 2 }} display={{ xs: "none", md: "block" }}>
          <img style={{ width: '100%', border: "1px solid #80808080", borderRadius: "8px" }} src="/demo.gif" />
        </Box>
        <Box flexShrink={0} sx={{ my: 6, ml: 4, p: 2, width: '400px', height: '100%', border: '1px solid grey', borderRadius: 2 }}>
          <Typography variant="h5" align="center">GET STARTED</Typography>
          <p>Welcome to Bat否ter &#127881;. Please login with your github account to start using the application</p>
          <LoadingButton onClick={() => handleLogin()}
            loading={isLoading(userAPI状态, user)} fullWidth sx={{ my: 2 }}
            variant="contained" startIcon={<GitHubIcon />}>Login with Github</LoadingButton>
        </Box>
      </Box>
    </Container>
  )
}

export default Login;
