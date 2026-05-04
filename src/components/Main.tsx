
import { CircularProgress, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React, { ReactElement, useEffect, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { API_URL } from '../api/api';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { API状态Type } from '../reducer/common';
import { get否tesAsync, get否tesTreeAsync } from '../reducer/noteSlice';
import { getUser个人资料Async, selectUser, selectUserAPI状态, userLoading, user退出登录 } from '../reducer/userSlice';
import ErrorPage from "./404";
import AppBar from './AppBar';
import AppDrawer, { Props } from './AppDrawer';
import 编辑or from './编辑or';
import Finder from './Finder';
import RequireAuth from './lib/RequireAuth';
import Login from './Login';
import RepoSetupDialog from './RepoSetupDialog';
import 设置 from './设置';
import Viewer from './Viewer';
const DrawerLayout: React.FC<Omit<Props, 'variant'>> = (props): ReactElement => {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <AppDrawer user={props.user} variant={'permanent'} />
      <AppDrawer user={props.user} mobileDrawerOpen={props.mobileDrawerOpen} onDrawer关闭={props.onDrawer关闭} variant={'temporary'} />
      <Box component="main" sx={{
        flexGrow: 1, height: '100vh', overflow: 'auto'
      }}>
        <Toolbar variant="dense" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

const isUserAPILoading = (userAPI状态: API状态Type): boolean => {
  return userAPI状态 === API状态Type.LOADING;
}

const Main: React.FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userAPI状态 = useAppSelector(selectUserAPI状态);
  const [apiTriggered, setAPITriggered] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const handleLogin = () => {
    dispatch(userLoading());
    window.location.href = API_URL + "/oauth2/login/github";
  }

  const handle退出登录 = () => {
    dispatch(user退出登录());
  }

  const handleDrawer关闭 = () => {
    setMobileDrawerOpen(false);
  }

  const handleDrawerToggle= () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  }

  useEffect(() => {
    dispatch(getUser个人资料Async());
    setAPITriggered(true);
  }, [])

  useEffect(() => {
    (async () => {
      if (userAPI状态 == API状态Type.IDLE && user != null) {
        await dispatch(get否tesTreeAsync());
        dispatch(get否tesAsync(""));
      }
    })()
  }, [userAPI状态, user]);

  return (
    <>
      <AppBar userAPI状态={userAPI状态} handleLogin={handleLogin} handle退出登录={handle退出登录} user={user} onDrawerToggle={handleDrawerToggle} />
      <Container maxWidth="xl">
        {user != null && !user?.default_repo?.name && <RepoSetupDialog open={true}></RepoSetupDialog>}
        {
          !apiTriggered || isUserAPILoading(userAPI状态) ? <CircularProgress color="inherit" sx={{ ml: '50%', mt: 10 }} /> :
            <Routes>
              <Route path="/login" element={<Login userAPI状态={userAPI状态} handleLogin={handleLogin} user={user} />} />
              <Route path="/" element={<DrawerLayout user={user} mobileDrawerOpen={mobileDrawerOpen} onDrawer关闭={handleDrawer关闭} />} >
                <Route index element={<RequireAuth user={user}><Finder /></RequireAuth>} />
                <Route path="/new" element={<RequireAuth user={user}><编辑or key={'new'} /></RequireAuth>} />
                <Route path="/edit" element={<RequireAuth user={user}><编辑or key={'edit'} /></RequireAuth>} />
                <Route path="/view" element={<RequireAuth user={user}><Viewer key={'view'} /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth user={user}><设置 user={user} /></RequireAuth>} />
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Routes>
        }
      </Container>
    </>
  );
}

export default Main;
