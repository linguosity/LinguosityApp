import React from 'react';
import { Box, Button, Layer } from 'grommet';
import { FormClose } from 'grommet-icons';

export default function Modal({ target, onClose, children, position }) {
  return (
    <Layer target={target} modal onEsc={onClose} onClickOutside={onClose} position={position}>
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
