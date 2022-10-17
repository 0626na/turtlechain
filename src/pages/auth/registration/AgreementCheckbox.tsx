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
  plainOptions: string[];
  onChange: (list: CheckboxValueType[]) => void;
}

function AgreeCheckbox({ plainOptions, onChange }: Props) {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>();
  const [checkAll, setCheckAll] = useState(false);

  const [modalVisible, modalOpen, modalClose] = useModal();

  const handleChange = (list: CheckboxValueType[]) => {
    onChange(list);
    setCheckedList(list);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    onChange(e.target.checked ? plainOptions : []);
    setCheckedList(e.target.checked ? plainOptions : []);
    setCheckAll(e.target.checked);
  };

  return (
    <>
      {/* 약관 내용 모달 */}
      <AgreementModal visible={modalVisible} onClose={modalClose} />

      <Checkbox onChange={onCheckAllChange} checked={checkAll}>
        {t(`agreement.all`)}
      </Checkbox>

      <TurtleDivider marginTop={16} marginBottom={16} />

      <Checkbox.Group
        css={checkboxGroup}
        value={checkedList}
        onChange={handleChange}
      >
        {plainOptions.map((option, idx) => (
          <Checkbox key={idx} css={item} value={option}>
            <div>{t(`agreement.${option}`)}</div>
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
