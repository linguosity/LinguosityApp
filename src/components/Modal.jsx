import React from 'react';
import { Box, Button, Layer } from 'grommet';
import { FormClose } from 'grommet-icons';

export default function Modal({
  target,
  onClose,
  children,
  closeClickingOutside = true
}) {
  return (
    <Layer target={target?.current} modal onEsc={onClose} onClickOutside={closeClickingOutside ? onClose : undefined} >
      <Box
        align="center"
        justify="center"
        pad="small"
        overflow={{ vertical: 'auto' }}
      >
        <Button icon={<FormClose />} onClick={onClose} plain alignSelf='end' />
        {children}
      </Box>
    </Layer>
  )
}

