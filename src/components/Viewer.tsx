import Arrow返回Icon from '@mui/icons-material/Arrow返回';
import 删除Icon from '@mui/icons-material/删除';
import 编辑Icon from '@mui/icons-material/编辑';
import FolderIcon from '@mui/icons-material/Folder';
import 否tesIcon from '@mui/icons-material/否tes';
import { Alert, Box, Breadcrumbs, Button, CircularProgress, Container, Divider, Grid, Link } from "@mui/material";
import { unwrapResult } from '@reduxjs/toolkit';
import { useModal } from 'mui-modal-provider';
import React, { ReactElement, useEffect, useState } from "react";
import { useNavigate, use搜索Params } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { API状态, API状态Type } from '../reducer/common';
import { delete否teAsync, get否teAsync, reset状态, select否teAPI状态, select否tesTree, Tree否de } from "../reducer/noteSlice";
import TreeUtil from '../util/TreeUtil';
import { confirm删除否te, getDecodedPath, getSanitizedErrorMessage, get标题FromFilename, splitPath, URL_ISSUES } from "../util/util";
import CustomReactMarkdown from './lib/CustomReactMarkdown';

const isLoading = (api状态: API状态): boolean => {
  const { get否teAsync, delete否teAsync } = api状态;
  return get否teAsync === API状态Type.LOADING || delete否teAsync === API状态Type.LOADING;
}

const isGet否teLoading = (api状态: API状态): boolean => {
  const { get否teAsync } = api状态;
  return get否teAsync === API状态Type.LOADING;
}

const isFailed = (api状态: API状态): boolean => {
  const { get否teAsync, delete否teAsync } = api状态;
  return get否teAsync === API状态Type.FAIL || delete否teAsync === API状态Type.FAIL;
}

const Viewer: React.FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [note, set否te] = useState<Tree否de>()
  const [searchParams] = use搜索Params();
  const path = getDecodedPath(searchParams.get('path'));
  const tree = useAppSelector(select否tesTree);
  const api状态 = useAppSelector(select否teAPI状态);
  const [errorMessage, setErrorMessage] = React.useState("");
  const dirPathArray = splitPath(path);
  const title = get标题FromFilename(dirPathArray.pop() || '');

  const handle删除 = () => {
    confirm删除否te(showModal, () => {
      dispatch(delete否teAsync(note as Tree否de)).then(unwrapResult)
        .then(() => navigate(`/?path=${encodeURIComponent(dirPathArray.join('/'))}`))
        .catch(err => setErrorMessage(getSanitizedErrorMessage(err)));
    });
  }

  useEffect(() => {
    // This should be the first useEffect hook. Declare other useEffect hooks below this one.
    dispatch(reset状态());
  }, [path])

  useEffect(() => {
    const tree否de = TreeUtil.search否de(tree, path);
    if (tree否de == null || tree否de.is_dir) {
      return;
    }
    dispatch(get否teAsync(tree否de.path)).then(unwrapResult)
      .catch(err => setErrorMessage(getSanitizedErrorMessage(err)));
    set否te(tree否de);
  }, [tree, path])

  return (
    <Container maxWidth="lg">{isGet否teLoading(api状态) ? <CircularProgress sx={{ position: "relative", top: "50%", left: "50%" }} /> :
      <Box>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Breadcrumbs itemsAfterCollapse={2} sx={{ fontSize: '1.2rem' }}>
              <Link key="root" underline="hover" color="inherit"><FolderIcon fontSize="medium" sx={{ mr: 0.5, verticalAlign: 'middle', }} />root</Link>
              {dirPathArray.map((option) => (<Link key={option} underline="hover" color="inherit"> {option} </Link>))}
            </Breadcrumbs>
            <否tesIcon color="inherit" fontSize="medium" sx={{ mr: 0.5, verticalAlign: 'middle', }} />{title}
          </Box>
          <Box>
            <Button onClick={() => navigate('/')} variant="outlined" startIcon={<Arrow返回Icon />}>BACK</Button>
            <Button onClick={() => navigate(`/edit?path=${encodeURIComponent(note?.path || '')}`)} disabled={isLoading(api状态)} variant="contained" sx={{ mx: 2 }} startIcon={<编辑Icon />}>EDIT</Button>
            <Button onClick={() => handle删除()} disabled={isLoading(api状态)} variant="contained" startIcon={<删除Icon />} color="error">DELETE</Button>
          </Box>
        </Grid>
        <Divider sx={{ my: 3 }} />
        {isFailed(api状态) && errorMessage && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{errorMessage} <span>please try again or <Link href={URL_ISSUES} target="_blank" rel="noopener">create an issue</Link></span></Alert>}
        <Box class名称='viewer-markdown' sx={{ p: 2 }}>
          <CustomReactMarkdown class名称='custom-html-style'>{note?.content || ''}</CustomReactMarkdown>
        </Box>
      </Box>
    }
    </Container>
  );
}

export default Viewer;
