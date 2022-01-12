import { Space } from "antd";
import Search from "antd/lib/input/Search";
import { useTranslation } from "react-i18next";
import TurtleSelect from "./common/TurtleSelect";

interface Props {}

function SearchFilter({}: Props) {
  const { t } = useTranslation();

  return (
    <Space>
      <TurtleSelect label={t("common.search")} width="short" placeholder={t("placeholder.all")} />
      <Search placeholder={t("placeholder.search")} enterButton style={{ width: "20rem" }} />
    </Space>
  );
}

export default SearchFilter;
