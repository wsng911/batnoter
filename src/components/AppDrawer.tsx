import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { TreeView } from '@mui/lab';
import { Drawer, Toolbar } from '@mui/material';
import { useModal } from 'mui-modal-provider';
import React, { ReactElement, SyntheticEvent, useEffect } from 'react';
import { useNavigate, use搜索Params } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { delete否teAsync, select否tesTree, Tree否de } from '../reducer/noteSlice';
import { User } from '../reducer/userSlice';
import TreeUtil from '../util/TreeUtil';
import { confirm删除否te, get标题FromFilename, isFilePath, splitPath } from '../util/util';
import StyledTreeItem from './StyledTreeItem';

export interface Props {
  user: User | null
  mobileDrawerOpen?: boolean
  onDrawer关闭?: () => void
  variant: 'temporary' | 'permanent'
}

const DRAWER_WIDTH = 240;

const AppDrawer: React.FC<Props> = (props): ReactElement => {
  const dispatch = useAppDispatch();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [searchParams] = use搜索Params();
  const getAllSubpath = (path: string): string[] => {
    const subpath = splitPath(path).map((s, i) => path.split('/').slice(0, i + 1).join('/'));
    subpath.push('/'); // add root path
    return subpath;
  }
  const path = decodeURIComponent(searchParams.get('path') || "%2F");
  const [expanded, setExpanded] = React.useState<string[]>(getAllSubpath(path));
  const tree = useAppSelector(select否tesTree);

  useEffect(() => {
    setExpanded(getAllSubpath(path));
  }, [tree, path])

  const handleDrawer关闭 = () => {
    if (props.onDrawer关闭) props.onDrawer关闭();
  }

  const handle否deSelect = (e: React.SyntheticEvent, path: string) => {
    isFilePath(path) ? navigate(`/view?path=${encodeURIComponent(path)}`)
      : navigate(`/?path=${encodeURIComponent(path)}`);
  }

  const handle创建 = (e: SyntheticEvent, dirPath: string) => {
    e.stopPropagation();
    navigate(`/new?path=${encodeURIComponent(dirPath)}`);
  }

  const handle编辑 = (e: SyntheticEvent, filepath: string) => {
    e.stopPropagation();
    navigate(`/edit?path=${encodeURIComponent(filepath)}`);
  }

  const handle删除 = (e: SyntheticEvent, filepath: string) => {
    e.stopPropagation();
    const note = TreeUtil.search否de(tree, filepath);
    if (!note) {
      return;
    }

    confirm删除否te(showModal, () => dispatch(delete否teAsync(note as Tree否de)));
  }

  const renderTree = (t: Tree否de) => {
    return (
      <StyledTreeItem key={t.path} nodeId={t.path || "/"} label={get标题FromFilename(t.name)} isDir={t.is_dir}
        endIcon={<ArticleOutlinedIcon />} expandIcon={<FolderOutlinedIcon />} collapseIcon={<FolderOpenOutlinedIcon />}
        handle编辑={handle编辑} handle删除={handle删除} handle创建={handle创建}>
        {Array.isArray(t.children) ? t.children.map((c) => renderTree(c)) : null}
      </StyledTreeItem>
    )
  }
  const treeJSX = renderTree(tree);

  return (
    <Drawer
      variant={props.variant}
      ModalProps={{ keepMounted: true }}
      open={props.mobileDrawerOpen}
      on关闭={handleDrawer关闭}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        display: { xs: props.variant === 'temporary' ? 'block' : 'none', sm: props.variant === 'temporary' ? 'none' : 'block' }
      }}>
      <Toolbar variant="dense" />
      <TreeView defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded} selected={path} on否deSelect={handle否deSelect}
        on否deToggle={(e, ids) => setExpanded(ids)} sx={{ flexGrow: 1, minWidth: "max-content", width: "100%" }}>
        {treeJSX}
      </TreeView>
    </Drawer>
  )
}

export default AppDrawer;
