import { TurtleConfirmModal, TurtleFormInput } from '@components/element';
import { css } from '@emotion/react';
import React, { ReactElement, useEffect, useState } from 'react';

interface Props {
  visible: boolean;
  onCancel(): void;
  onOk(value: string): void;
  title: string;
  description: string[];
  loading?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

function InputModal({
  visible,
  onCancel,
  onOk,
  title,
  description,
  loading,
  placeholder,
  defaultValue,
}: Props) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!visible) return;
    setInputValue(defaultValue ?? '');
  }, [visible, defaultValue]);

  return (
    <TurtleConfirmModal
      visible={visible}
      loading={loading}
      onCancel={loading ? () => {} : onCancel}
      onOk={() => {
        onOk(inputValue);
      }}
      title={title}
      description={description}
      okDisabled={inputValue === ''}
    >
      <div css={marginTop}>
        <TurtleFormInput
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
          }}
          placeholder={placeholder}
          disabled={loading}
        />
      </div>
    </TurtleConfirmModal>
  );
}

const marginTop = css`
  margin-top: 24px;
`;

export default InputModal;
