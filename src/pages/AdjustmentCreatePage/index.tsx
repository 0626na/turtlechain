import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Form, message, notification } from "antd";
import PageHeader from "components/PageHeader";
import StoreSelect from "components/StoreSelect";
import AdjustmentCreateForm from "./AdjustmentCreateForm";
import AdjustmentPreviewList from "./AdjustmentPreviewList";
import Toolbar from "./Toolbar";
import adjustmentAPI, { AdjustmentItem } from "apis/adjustmentAPI";
import { useState } from "react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

const AdjustmentCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment create")}`;
  const [adjList, setAdjList] = useState<Array<AdjustmentItem>>([]);
  
    // 입고장 아이템 추가
    const onAdjItemSubmit = (value: AdjustmentItem) => {
      setAdjList([...adjList, { ...value }]);
    };
 
  const onSubmit = () => {
    createAdjustmentItemQuery.mutate({
      item_list:adjList
    })
  }
  
  const createAdjustmentItemQuery = useMutation(["createAdjustment"], adjustmentAPI.createAdjustmentItem, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      setAdjList([]);
      notification.open({
        type: "success",
        message: t("message.success create adjustment"),
      });
    },
  })

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="adjustment"
        title={t("adjustment create")}
        breadcrumbList={[t("adjustment management"), t("adjustment create")]}
      />
        
        <Toolbar/>
       
      <AdjustmentCreateForm onAdjItemCreated={onAdjItemSubmit}/>
      <AdjustmentPreviewList
      isLoading={false}
      adjList={adjList}
      setAdjList={setAdjList}
      onSubmit={onSubmit}
      />
    </>
  );
};

export default AdjustmentCreatePage;
