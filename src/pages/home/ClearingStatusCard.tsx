import { ClearingSheetShow } from '@apis/clearingAPI';
import { theme } from '@styles/theme';
import { ArrowRightIcon, TurtleTag } from '@components/element';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

const statusColor = {
  request: 'green',
  pending: 'orange',
  complete: 'cyan',
} as const;

interface Props {
  clearingSheetList: ClearingSheetShow[];
}

const item = (data: ClearingSheetShow) => (
  <div key={data.id} css={{ display: 'flex', justifyContent: 'space-between' }}>
    <div css={{ display: 'flex' }}>
      <TurtleTag color={statusColor[data.status]} size="large">
        {t(`clearing.status.${data.status}`)}
      </TurtleTag>

      <div
        css={{
          marginLeft: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <span css={{ color: theme.grey400 }}>{data.request_date}</span>
        <span css={{ color: theme.grey800, fontWeight: 500, fontSize: 18 }}>
          {data.store_name}
        </span>
      </div>
    </div>

    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      {data.total_deposit_amount.toLocaleString()}원
    </div>
  </div>
);

function ClearingStatusCard({ clearingSheetList }: Props) {
  const navigate = useNavigate();
  const goClearingHistory = () => {
    navigate('/clearing/history');
  };
  return (
    <div
      css={{ cursor: 'pointer' }}
      onClick={() => {
        goClearingHistory();
      }}
    >
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4
          css={{
            display: 'inline',
            color: theme.grey500,
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          {t('recent payments')}
        </h4>
        <div>
          <ArrowRightIcon value={theme.grey300} />
        </div>
      </div>
      <div
        css={{
          marginTop: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        {clearingSheetList.slice(0, 4).map((sheet) => item(sheet))}
      </div>
    </div>
  );
}

export default ClearingStatusCard;
