import { Space } from "antd";
import Search from "antd/lib/input/Search";
import { stringify } from "querystring";
import { useTranslation } from "react-i18next";
import TurtleSelect from "./common/TurtleSelect";

interface Props {}

function SearchFilter({}: Props) {
  const { t } = useTranslation();

  const options: Array<{ name: string; value: string }> = [
    {
      name: t("common.all"),
      value: "all",
    },
    {
      name: t("vendor.name"),
      value: "name",
    },
    {
      name: t("vendor.account"),
      value: "account",
    },
    {
      name: t("vendor.phone"),
      value: "phone",
    },
  ];

  return (
    <Space>
      <TurtleSelect //
        label={t("common.search")}
        width="short"
        placeholder={t("placeholder.all")}
        options={options}
      />
      <Search //
        placeholder={t("placeholder.search")}
        //enterButton
        style={{ width: "20rem" }}
      />
    </Space>
  );
}

export default SearchFilter;
