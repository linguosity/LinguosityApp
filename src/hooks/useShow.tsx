import { useState } from 'react';

export default function useShow(initialState = false) {
  const [show, setShow] = useState(initialState);

  const open = () => {
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  const toggle = () => {
    setShow(prevState => !prevState);
  };

  return {
    show,
    open,
    close,
    toggle,
  };
}