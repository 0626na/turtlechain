import { Helmet } from "react-helmet";
import { t } from "i18next";
import FindIdForm from "./FindIdForm";
import TurtleTemplate from "components/common/TurtleTemplate";

const FindIdPage = function () {
  const title = `${t("turtlechain")} - ${t("find id")}`;

  return (
    <>
      <Helmet title={title} />
      <TurtleTemplate>
        <FindIdForm />
      </TurtleTemplate>
    </>
  );
};

export default FindIdPage;
