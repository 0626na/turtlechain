import { t } from "i18next";
import { Upload } from "antd";
import { RcFile } from "antd/lib/upload";
import { useStoreExist } from "hooks";

interface Props {
  beforeUpload: (file: RcFile) => void;
  onRemove: () => void;
  fileList: Array<RcFile>;
}

function TurtleUpload({ beforeUpload, onRemove, fileList }: Props) {
  const isStoreExist = useStoreExist();

  return (
    <Upload
      maxCount={1}
      accept=".csv, .xls, .xlsx"
      beforeUpload={(file) => {
        if (!isStoreExist()) return false;
        beforeUpload(file);
        return false;
      }}
      onRemove={() => {
        onRemove();
        return false;
      }}
      fileList={fileList}
    >
      {t("button.upload excel")}
    </Upload>
  );
}

export default TurtleUpload;
