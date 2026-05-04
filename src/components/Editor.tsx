
import 保存Icon from '@mui/icons-material/保存';
import { LoadingButton } from '@mui/lab';
import { Alert, Autocomplete, Breadcrumbs, Button, CircularProgress, Container, Link, styled, TextField, Theme } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import MD编辑or from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useLocation, useNavigate, use搜索Params } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { API状态, API状态Type } from '../reducer/common';
import { get否teAsync, reset状态, save否teAsync, select否teAPI状态, select否tesTree } from '../reducer/noteSlice';
import TreeUtil from '../util/TreeUtil';
import { appendPath, getDecodedPath, getFilenameFrom标题, getSanitizedErrorMessage, get标题FromFilename, splitPath, URL_ISSUES } from '../util/util';
import CustomReactMarkdown from './lib/CustomReactMarkdown';

const VALID_DIR_PATH_REGEX = /^((?!\/)([a-zA-Z0-9-]([/]|[^\S\r\n])?)*)([a-zA-Z0-9-])$/gm;
const VALID_FILENAME_REGEX = /^([a-zA-Z0-9-]|[^\S\r\n])+(\.md)$/gm;

const StyledMD编辑or = styled(MD编辑or)(({ theme }: { theme: Theme }) => ({
  "&.rc-md-editor.batnoter-md-editor": {
    margin: "16px 0",
    height: 375,
    borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
    borderRadius: theme.shape.borderRadius,
    background: 'unset',
    "& > .rc-md-navigation": {
      minHeight: 56,
      background: theme.palette.background.default,
      borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
      borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
      ".button-wrap": {
        ".button": {
          color: theme.palette.text.disabled,
          "&:hover": {
            color: theme.palette.action.active
          },
          ".drop-wrap": {
            background: theme.palette.background.default
          },
          "& .header-list .list-item:hover": {
            background: theme.palette.action.hover
          },
          margin: "0 5px",
        },
        ".rmel-iconfont": {
          fontSize: theme.typography.fontSize + 8
        }
      }
    },
    "&.batnoter-md-editor .editor-container .sec-md textarea.input": {
      color: theme.palette.text.primary,
      background: theme.palette.background.default
    },
    "&.error": {
      borderColor: theme.palette.error.main
    }
  }
}));

const isLoading = (api状态: API状态): boolean => {
  const { get否teAsync, save否teAsync } = api状态;
  return get否teAsync === API状态Type.LOADING || save否teAsync === API状态Type.LOADING;
}

const isGet否teLoading = (api状态: API状态): boolean => {
  const { get否teAsync } = api状态;
  return get否teAsync === API状态Type.LOADING;
}

const isFailed = (api状态: API状态): boolean => {
  const { get否teAsync, save否teAsync } = api状态;
  return get否teAsync === API状态Type.FAIL || save否teAsync === API状态Type.FAIL;
}

const 编辑or: React.FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [searchParams] = use搜索Params();
  const editMode = pathname.startsWith('/edit');
  const path = getDecodedPath(searchParams.get('path'));
  const tree = useAppSelector(select否tesTree);
  const api状态 = useAppSelector(select否teAPI状态);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [sha, setSHA] = useState('');
  const [title, set标题] = useState('');
  const [titleError, set标题Error] = useState(false);
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState(false);
  const [endDir, setEndDir] = useState('');
  const [dirPathArray, setDirPathArray] = useState([] as string[]);
  const [dirPathError, setDirPathError] = useState(false);
  const [pathAutoCompleteOptions, setPathAutoCompleteOptions] = useState(TreeUtil.getChildDirs(tree, path));

  useEffect(() => {
    // This should be the first useEffect hook. Declare other useEffect hooks below this one.
    dispatch(reset状态());
  }, [path])

  useEffect(() => {
    const tree否de = TreeUtil.search否de(tree, path);
    const dirPathArray = splitPath(path);
    editMode && dirPathArray.pop(); // remove the filename from path
    setDirPathArray(dirPathArray);
    setPathAutoCompleteOptions(TreeUtil.getChildDirs(tree, path));

    if (tree否de == null || tree否de.is_dir) {
      return;
    }
    dispatch(get否teAsync(tree否de.path)).then(unwrapResult)
      .catch(err => setErrorMessage(getSanitizedErrorMessage(err)));

    setSHA(tree否de?.sha || '');
    set标题(get标题FromFilename(tree否de.name));
    setContent(tree否de?.content || '');
  }, [tree, path, editMode])

  const handle提交 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDirPathError(false);
    set标题Error(false);
    setContentError(false);

    const autoSelectedDirPath = dirPathArray.join('/');
    const dirPath = appendPath(autoSelectedDirPath, endDir);
    if (dirPath !== "" && !dirPath.match(VALID_DIR_PATH_REGEX)) {
      setDirPathError(true);
      return;
    }

    const filename = getFilenameFrom标题(title);
    if (!filename.match(VALID_FILENAME_REGEX)) {
      set标题Error(true);
      return;
    }

    if (content === "") {
      setContentError(true);
      return;
    }

    const fullPath = appendPath(dirPath, filename);
    await dispatch(save否teAsync({ path: fullPath, content: content, sha: sha }))
      .then(unwrapResult).then(() => navigate(`/?path=${encodeURIComponent(dirPath)}`))
      .catch(err => setErrorMessage(getSanitizedErrorMessage(err)));
  }

  return (
    <Container maxWidth="lg">
      {isGet否teLoading(api状态) ? <CircularProgress sx={{ position: "relative", top: "50%", left: "50%" }} /> :
        <form noValidate autoComplete="off" on提交={handle提交}>
          {isFailed(api状态) && errorMessage &&
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorMessage} <span>please try again or <Link href={URL_ISSUES} target="_blank" rel="noopener">create an issue</Link></span>
            </Alert>}
          <Autocomplete freeSolo fullWidth multiple openOnFocus value={dirPathArray} options={pathAutoCompleteOptions}
            disabled={editMode}
            onChange={(e, newPath) => {
              setDirPathArray([...newPath]);
              setPathAutoCompleteOptions(TreeUtil.getChildDirs(tree, newPath.join("/")));
            }}

            renderTags={(tagValue) => (
              <Breadcrumbs itemsAfterCollapse={2}>
                {tagValue.map((option) => (<Link key={option} underline="hover" color="inherit"> {option} </Link>))}
                <span>{/* just a placeholder to show a / at the end */}</span>
              </Breadcrumbs>
            )}

            inputValue={endDir}
            onInputChange={(e, newInputValue) => {
              setDirPathError(false);
              if (newInputValue.indexOf('/') > -1) {
                const trimmedPath = newInputValue.trim().replace(/^\/+|\/+$/g, '');
                const pathArray = [...dirPathArray, ...splitPath(trimmedPath)];
                if (trimmedPath) {
                  setDirPathArray(pathArray);
                  setPathAutoCompleteOptions(TreeUtil.getChildDirs(tree, pathArray.join("/")));
                }
                setEndDir('');
                return;
              }
              setEndDir(newInputValue);
            }}

            renderInput={(params) => (
              <TextField {...params}
                helperText="Only alphanumeric characters, space, hyphen (-) and forward slash (/) are allowed."
                label="Path" variant="outlined" fullWidth error={dirPathError} placeholder="Select Path..." sx={{ my: 2, display: "block" }} />
            )}
          />

          <TextField sx={{ my: 2, display: "block" }}
            helperText="Only alphanumeric characters, space and hyphen (-) are allowed."
            value={title} disabled={editMode}
            onChange={(e) => { set标题Error(false); set标题(e.target.value) }} label="否te 标题"
            variant="outlined" fullWidth required error={titleError}
          />

          <StyledMD编辑or view={{ menu: true, md: true, html: false }} canView={{ menu: true, md: true, html: true, fullScreen: false, hideMenu: false, both: true }}
            value={content}
            renderHTML={(text: string) => <CustomReactMarkdown>{text}</CustomReactMarkdown>}
            placeholder="否te Content*" class名称={"batnoter-md-editor " + (contentError ? "error" : "")}
            onChange={({ text }: { text: string }) => { setContentError(false); setContent(text) }} />

          <LoadingButton loading={isLoading(api状态)} type="submit" variant="contained" startIcon={<保存Icon />} sx={{ float: 'right' }}>SAVE</LoadingButton>
          <Button onClick={() => navigate('/')} variant="outlined" sx={{ float: 'right', mx: 1 }} >CANCEL</Button>
        </form>
      }
    </Container>
  )
}

export default 编辑or;
