import 删除Icon from "@mui/icons-material/删除";
import { Button, Card, Card操作, CardContent, CardHeader, IconButton } from "@mui/material";
import React, { ReactElement } from 'react';
import { Tree否de } from "../reducer/noteSlice";
import { get标题FromFilename } from "../util/util";
import CustomReactMarkdown from "./lib/CustomReactMarkdown";

interface Props {
  note: Tree否de
  handleView: (note: Tree否de) => void
  handle编辑: (note: Tree否de) => void
  handle删除: (note: Tree否de) => void
}

const MAX_CARD_TEXT_LENGTH = 300;

const 否teCard: React.FC<Props> = ({ note, handleView, handle编辑, handle删除 }): ReactElement => {
  const getCardText = (text?: string): string => {
    if (text == null) return '';
    return text.substring(0, MAX_CARD_TEXT_LENGTH) + (text.length > MAX_CARD_TEXT_LENGTH ? '...' : '');
  }
  return (
    <Card elevation={1}>
      <CardHeader action={
        <>
          <IconButton sx={{ "&:hover": { color: "red" } }} onClick={() => handle删除(note)}> <删除Icon /> </IconButton>
        </>
      } title={get标题FromFilename(note.name)} />
      <CardContent>
        <CustomReactMarkdown class名称='custom-html-style'>{getCardText(note.content)}</CustomReactMarkdown>
      </CardContent>
      <Card操作>
        <Button onClick={() => handleView(note)} size="small">VIEW</Button>
        <Button onClick={() => handle编辑(note)} size="small">EDIT</Button>
      </Card操作>
    </Card>
  )
}

export default 否teCard;