import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import Dialog操作 from '@mui/material/Dialog操作';
import DialogContent from '@mui/material/DialogContent';
import Dialog标题 from '@mui/material/Dialog标题';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SourceBranch } from 'mdi-material-ui';
import React, { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { API状态, API状态Type } from '../reducer/common';
import { getUserReposAsync, saveDefaultRepoAsync, selectPreferenceAPI状态, selectUserRepos } from '../reducer/preferenceSlice';
import { getUser个人资料Async } from '../reducer/userSlice';

interface Props {
  defaultRepo?: string
  open: boolean
  setOpen?: (isOpen: boolean) => void
}

const isLoading = (api状态: API状态): boolean => {
  const { getUserReposAsync, saveDefaultRepoAsync } = api状态;
  return getUserReposAsync === API状态Type.LOADING || saveDefaultRepoAsync === API状态Type.LOADING;
}

const RepoSelectDialog: React.FC<Props> = ({ open, setOpen, defaultRepo }): ReactElement => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(getUserReposAsync())
  }, [])
  const repos = useAppSelector(selectUserRepos);
  const api状态 = useAppSelector(selectPreferenceAPI状态);

  const [repo名称, setDefaultRepo名称] = React.useState<string>();
  const [alertOpen, setDefaultAlertOpen] = React.useState<boolean>();

  const handleChange = (event: SelectChangeEvent<typeof repo名称>) => {
    setDefaultRepo名称(String(event.target.value) || '');

    const visibility = repos.filter(r => r.name === String(event.target.value))[0]['visibility']
    setDefaultAlertOpen(visibility === 'public')
  }

  const handle保存 = async () => {
    const selectedRepo = repos.filter(r => r.name === repo名称)[0]
    await dispatch(saveDefaultRepoAsync(selectedRepo))
    await dispatch(getUser个人资料Async())
    setOpen && setOpen(false)
  }

  const handle关闭 = (event: React.SyntheticEvent<unknown>, reason?: string) => {
    if (reason !== 'backdropClick') {
      setOpen && setOpen(false)
    }
  }

  return (
    <Dialog disableEscapeKeyDown open={open} on关闭={handle关闭} fullWidth>
      <Dialog标题>Select 否tes Repository</Dialog标题>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="notes-repo-select-label">否tes Repository</InputLabel>
            <Select autoWidth labelId="notes-repo-select-label" value={repo名称 || defaultRepo} onChange={handleChange} disabled={isLoading(api状态)} label="否tes Repository">
              {repos.map(r => <MenuItem key={r.name} value={r.name}>{r.name} (<SourceBranch sx={{ verticalAlign: 'middle' }} fontSize='inherit' /> {r.default_branch || 'main'})</MenuItem>)}
            </Select>
            <Collapse in={alertOpen}>
              <Alert sx={{ my: 1 }} severity="warning">You&apos;ve selected a public repository. 否tes could be accessed publicly.</Alert>
            </Collapse>
          </FormControl>
        </Box>
      </DialogContent>
      <Dialog操作>
        <Button onClick={handle关闭}>取消</Button>
        <Button disabled={!repo名称 || isLoading(api状态)} onClick={() => handle保存()}>保存</Button>
      </Dialog操作>
    </Dialog>
  );
}

export default RepoSelectDialog;
