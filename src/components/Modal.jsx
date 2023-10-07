import React from 'react';
import { Box, Button, Layer, Grommet } from 'grommet'; // 1. Import Grommet
import { FormClose } from 'grommet-icons';

// 2. Define custom theme
const customTheme = {
  layer: {
    border: {
      radius: '24px', // set your desired border radius value
      
    },
  },
  
};

export default function Modal({
  target,
  onClose,
  children,
  closeClickingOutside = true
}) {
  return (
    // 3. Wrap Layer component with Grommet component
    <Grommet theme={customTheme}> 
      <Layer target={target?.current} modal onEsc={onClose} onClickOutside={closeClickingOutside ? onClose : undefined}>
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
    </Grommet>
  );
}
