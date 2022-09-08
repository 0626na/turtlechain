import {
  TurtleConfirmModal,
  TurtleSecondaryRangePicker,
} from '@components/element';
import moment from 'moment';
import { useState } from 'react';
import { css } from '@emotion/react';
import { useEffect } from 'react';

interface Date {
  start_date: string;
  end_date: string;
}

interface Props {
  visible: boolean;
  onCancel(): void;
  onOk(date: Date): void;
  title: string;
  description: string[];
  loading: boolean;
  inThreeMonth?: boolean;
}

function InventoryModal({
  visible,
  onCancel,
  onOk,
  title,
  description,
  loading,
  inThreeMonth,
}: Props) {
  const [date, setDate] = useState<Date>({
    start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    if (visible) return;
    setDate({
      start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    });
  }, [visible]);

  return (
    <TurtleConfirmModal
      visible={visible}
      loading={loading}
      onCancel={loading ? () => {} : onCancel}
      onOk={() => {
        onOk(date);
      }}
      title={title}
      description={description}
      children={
        <div css={marginTop}>
          <TurtleSecondaryRangePicker
            disabledDate={(current) =>
              inThreeMonth
                ? current > moment() || current < moment().subtract(3, 'months')
                : current > moment()
            }
            disabled={loading}
            value={[moment(date.start_date), moment(date.end_date)]}
            onChange={(_, dateStrings) => {
              const start_date = dateStrings[0];
              const end_date = dateStrings[1];
              setDate({ ...date, start_date, end_date });
            }}
          />
        </div>
      }
    />
  );
}

const marginTop = css`
  margin-top: 24px;
`;

export default InventoryModal;
