import styled from '@emotion/styled';
import 添加BoxIcon from '@mui/icons-material/添加Box';
import 删除Icon from '@mui/icons-material/删除';
import 编辑Icon from '@mui/icons-material/编辑';
import { TreeItem, TreeItemProps } from '@mui/lab';
import { IconButton } from '@mui/material';
import React, { SyntheticEvent } from 'react';

type StyledTreeItemProps = TreeItemProps & {
  isDir: boolean,
  handle创建: (e: SyntheticEvent, dirPath: string) => void,
  handle编辑: (e: SyntheticEvent, filepath: string) => void,
  handle删除: (e: SyntheticEvent, filepath: string) => void
}

const StyledTreeItem = styled((props: StyledTreeItemProps) => {
  const { isDir, handle创建, handle编辑, handle删除, ...otherProps } = props;
  return (
    <TreeItem  {...otherProps} label={
      <>{otherProps.label + ' '}
        {isDir ? <IconButton size="small" onClick={(e) => handle创建(e, otherProps.nodeId)}><添加BoxIcon sx={{ display: 'none', verticalAlign: 'text-bottom' }} fontSize='inherit' /> </IconButton> :
          <>
            <IconButton size="small" onClick={(e) => handle编辑(e, otherProps.nodeId)}><编辑Icon sx={{ display: 'none', verticalAlign: 'text-bottom' }} fontSize='inherit' /></IconButton>
            <IconButton size="small" onClick={(e) => handle删除(e, otherProps.nodeId)}><删除Icon class名称="delete" sx={{ display: 'none', verticalAlign: 'text-bottom' }} fontSize='inherit' /></IconButton>
          </>
        }
      </>
    } />
  )
})(() => ({
  [`& .MuiTreeItem-content .MuiTreeItem-label`]: {
    '&:hover svg': {
      display: 'inline-block',
    },
    '& svg:hover': {
      color: 'blue'
    },
    '& svg.delete:hover': {
      color: 'red'
    }
  },
}));

export default StyledTreeItem;
