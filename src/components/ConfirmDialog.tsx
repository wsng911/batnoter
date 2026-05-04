
import { Button, Dialog, Dialog操作, DialogContent, DialogProps, Dialog标题 } from '@mui/material';
import React from 'react';

type Props = DialogProps & {
  desc: string
  on确认: () => void
}

const 确认Dialog: React.FC<Props> = (props: Props) => {
  const { desc, on确认, ...otherProps } = props;
  return (
    <Dialog {...otherProps}>
      <Dialog标题 id="confirm-dialog">Please 确认</Dialog标题>
      <DialogContent>{desc}</DialogContent>
      <Dialog操作>
        <Button variant="outlined" onClick={(e) => otherProps.on关闭?.(e, "backdropClick")}>CANCEL</Button>
        <Button variant="contained" onClick={(e) => { on确认(); otherProps.on关闭?.(e, "backdropClick") }}>YES</Button>
      </Dialog操作>
    </Dialog>
  );
};

export default 确认Dialog;
