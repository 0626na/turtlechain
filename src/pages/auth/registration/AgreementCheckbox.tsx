import { TurtleDivider } from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { t } from 'i18next';
import React, { useState } from 'react';
import AgreementModal from './AgreementModal';

interface Props {
  onChange: (list: CheckboxValueType[]) => void;
  value?: CheckboxValueType[];
}

const options = [
  'service_use',
  'personal_information',
  'third_party',
  'event_notificaton',
];

function AgreeCheckbox({ onChange, value = [] }: Props) {
  const [checkAll, setCheckAll] = useState(false);
  const [modalVisible, modalOpen, modalClose] = useModal();

  const handleChange = (list: CheckboxValueType[]) => {
    onChange(list);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    onChange(e.target.checked ? options : []);
    setCheckAll(e.target.checked);
  };

  return (
    <>
      {/* 약관 내용 모달 */}
      <AgreementModal visible={modalVisible} onClose={modalClose} />

      <Checkbox onChange={onCheckAllChange} checked={checkAll}>
        {t(`type.agreement.all`)}
      </Checkbox>

      <TurtleDivider marginTop={16} marginBottom={16} />

      <Checkbox.Group css={checkboxGroup} value={value} onChange={handleChange}>
        {options.map((option, idx) => (
          <Checkbox key={idx} css={item} value={option}>
            <div>{t(`type.agreement.${option}`)}</div>
            <div
              css={itemDetail}
              onClick={() => {
                modalOpen();
              }}
            >
              자세히
            </div>
          </Checkbox>
        ))}
      </Checkbox.Group>
    </>
  );
}

const checkboxGroup = css({
  '.ant-checkbox + span': {
    paddingRight: 0,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 17,
  },
  '.ant-checkbox-wrapper + .ant-checkbox-wrapper': {
    margin: 0,
  },
});

const item = css({ color: '#6B6D73', width: '100%' });
const itemDetail = css({ color: '#A1A2A6' });

export default AgreeCheckbox;
