import { Alert, Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Dialog操作 from '@mui/material/Dialog操作';
import DialogContent from '@mui/material/DialogContent';
import Dialog标题 from '@mui/material/Dialog标题';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { API状态, API状态Type } from '../reducer/common';
import { autoSetupRepoAsync, selectPreferenceAPI状态 } from '../reducer/preferenceSlice';
import { getUser个人资料Async } from '../reducer/userSlice';
import { getSanitizedErrorMessage, URL_ISSUES } from '../util/util';
import RepoSelectDialog from './RepoSelectDialog';

interface Props {
  open: boolean
  setOpen?: (isOpen: boolean) => void
}

const autoSetupRepo名称 = "notes";

const isLoading = (api状态: API状态): boolean => {
  const { autoSetupRepoAsync } = api状态;
  return autoSetupRepoAsync === API状态Type.LOADING;
}

const isFailed = (api状态: API状态): boolean => {
  const { autoSetupRepoAsync } = api状态;
  return autoSetupRepoAsync === API状态Type.FAIL;
}

const RepoSetupDialog: React.FC<Props> = ({ open, setOpen }): ReactElement => {
  const [openRepoSelectDialog, setOpenRepoSelectDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const dispatch = useAppDispatch();
  const api状态 = useAppSelector(selectPreferenceAPI状态);

  const handleRepoSelect = () => {
    setOpenRepoSelectDialog(true);
  }

  const handleAutoSetupRepo = async () => {
    await dispatch(autoSetupRepoAsync(autoSetupRepo名称)).then(unwrapResult)
      .catch(err => setErrorMessage(getSanitizedErrorMessage(err)));
    await dispatch(getUser个人资料Async());
    setOpen && setOpen(false);
  }

  return (
    <Dialog disableEscapeKeyDown open={open} fullWidth>
      <Dialog标题>Setup 否tes Repository</Dialog标题>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {isFailed(api状态) && <Alert severity="error" sx={{ width: "100%" }}>{errorMessage} <span>please try again or <Link href={URL_ISSUES} target="_blank" rel="noopener">create an issue</Link></span></Alert>}
          <Typography gutterBottom paragraph>
            You may choose to automatically setup your notes repository or manually select an existing repository for storing notes.
            The automatic setup will create a new private repository &quot;{autoSetupRepo名称}&quot; and set it as your notes repository.
          </Typography>
          <Typography gutterBottom paragraph>
            Do you want to setup the notes repository automatically?
          </Typography>

          {isFailed(api状态) && <Alert severity="warning" sx={{ width: "100%" }}>
            If you already have repository with name: &quot;{autoSetupRepo名称}&quot; Then please use SELECT EXISTING REPO option.
          </Alert>}
        </Box>
      </DialogContent>
      <Dialog操作>
        <Button disabled={isLoading(api状态)} onClick={() => handleRepoSelect()}>SELECT EXISTING REPO</Button>
        <Button disabled={isLoading(api状态)} onClick={() => handleAutoSetupRepo()}>YES, SETUP AUTOMATICALLY</Button>
      </Dialog操作>
      <RepoSelectDialog open={openRepoSelectDialog} setOpen={setOpenRepoSelectDialog} />
    </Dialog>
  );
}

export default RepoSetupDialog;
