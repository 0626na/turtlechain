import { t } from 'i18next';
import { Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useStore } from '@hooks/index';

interface Props {
  beforeUpload: (file: RcFile) => void;
}

function TurtleUpload({ beforeUpload }: Props) {
  const { isStoreSelected } = useStore();

  return (
    <Upload
      maxCount={1}
      accept=".csv, .xls, .xlsx"
      beforeUpload={(file) => {
        if (!isStoreSelected()) return false;
        beforeUpload(file);
        return false;
      }}
      fileList={[]}
    >
      {t('button.at a time')}
    </Upload>
  );
}

export default TurtleUpload;
