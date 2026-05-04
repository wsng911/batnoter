import { Masonry } from '@mui/lab';
import { Alert, CircularProgress, Container, Link } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useModal } from 'mui-modal-provider';
import React, { ReactElement, useEffect } from 'react';
import { useNavigate, use搜索Params } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { API状态, API状态Type } from '../reducer/common';
import { delete否teAsync, get否tesAsync, reset状态, select否teAPI状态, select否tesTree, Tree否de } from '../reducer/noteSlice';
import TreeUtil from '../util/TreeUtil';
import { confirm删除否te, getDecodedPath, getSanitizedErrorMessage, URL_ISSUES } from '../util/util';
import 否teCard from './否teCard';

const isGet否tesLoading = (api状态: API状态): boolean => {
  const { get否tesAsync } = api状态;
  return get否tesAsync === API状态Type.LOADING;
}

const isGet否tesFailed = (api状态: API状态): boolean => {
  const { get否tesAsync } = api状态;
  return get否tesAsync === API状态Type.FAIL;
}

const Finder = (): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showModal } = useModal();
  const tree = useAppSelector(select否tesTree);
  const api状态 = useAppSelector(select否teAPI状态);
  const [searchParams] = use搜索Params();
  const path = getDecodedPath(searchParams.get('path'));
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    // This should be the first useEffect hook. Declare other useEffect hooks below this one.
    dispatch(reset状态());
  }, [path])

  useEffect(() => {
    dispatch(get否tesAsync(path)).then(unwrapResult)
      .catch(err => setErrorMessage(getSanitizedErrorMessage(err)));
  }, [tree, path])

  const handle删除 = (note: Tree否de) => {
    confirm删除否te(showModal, () => dispatch(delete否teAsync(note as Tree否de)));
  }

  const handleView = (note: Tree否de) => {
    navigate(`/view?path=${encodeURIComponent(note.path)}`);
  }

  const handle编辑 = (note: Tree否de) => {
    navigate(`/edit?path=${encodeURIComponent(note.path)}`);
  }

  const getChildren = (path: string): Tree否de[] | undefined => {
    const node = TreeUtil.search否de(tree, path);
    if (node?.cached) {
      return node.children;
    }
  }

  const notes = getChildren(path) || [] as Tree否de[];

  return (
    <Container>
      {isGet否tesFailed(api状态) && errorMessage && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{errorMessage} <span>please try again or <Link href={URL_ISSUES} target="_blank" rel="noopener">create an issue</Link></span></Alert>}

      <Masonry columns={{ xs: 1, md: 3, xl: 4 }} spacing={2}>
        {isGet否tesLoading(api状态) ? <CircularProgress sx={{ position: "relative", top: "50%", left: "50%" }} /> :

          notes.filter(n => !n.is_dir).map(note => (
            <div key={note.path}> <否teCard note={note} handleView={handleView} handle编辑={handle编辑} handle删除={handle删除} /> </div>
          ))}
      </Masonry>
    </Container>
  );
}

export default Finder;
