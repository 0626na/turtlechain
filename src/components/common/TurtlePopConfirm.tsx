import { t } from 'i18next';
import { Popconfirm } from 'antd';

interface Props {
  title: React.ReactNode;
  onConfirm: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  children: React.ReactNode;
}

function TurtlePopConfirm({ title, onConfirm, children }: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popconfirm
        title={<div style={{ paddingRight: 22 }}>{title}</div>}
        icon=""
        okText={t('button.ok')}
        cancelText={t('button.cancel')}
        onConfirm={onConfirm}
      >
        {children}
      </Popconfirm>
    </div>
  );
}

export default TurtlePopConfirm;
