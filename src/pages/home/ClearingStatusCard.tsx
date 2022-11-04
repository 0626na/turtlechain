import moment from 'moment';
import { t } from 'i18next';
import { Col, Row, Table, Tag, Typography } from 'antd';
import { useQuery } from 'react-query';
// import { TurtleCardHome } from '@components/common';
import clearingAPI from '@apis/clearingAPI';
import { theme } from '@styles/theme';

function ClearingStatusCard() {
  const getSheetQuery = useQuery(['getClearingSheet'], () =>
    clearingAPI.getSheet({
      credit_type: 'general',
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().endOf('month').format('YYYY-MM-DD'),
      status: 'all',
      page_size: 1000,
    }),
  );

  const list = getSheetQuery.data?.data.sheet_list;
  return (
    <div>
      <h4
        css={{
          display: 'inline',
          color: theme.grey500,
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        누적 결제금액
      </h4>

      <span></span>
    </div>
  );
}

export default ClearingStatusCard;
