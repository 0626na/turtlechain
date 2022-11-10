import { useState } from 'react';

const useModal = (initialValue = false) => {
  const [visible, setVisible] = useState(initialValue);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return [visible, open, close] as const;
};

export default useModal;
