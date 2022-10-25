import { KeyboardEvent, useEffect, useState } from 'react';

const useModal = () => {
  const [visible, setVisible] = useState(false);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const escKeyModalClose = (e: any) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', escKeyModalClose);
    return () => window.removeEventListener('keydown', escKeyModalClose);
  }, []);

  return [visible, open, close] as const;
};

export default useModal;
