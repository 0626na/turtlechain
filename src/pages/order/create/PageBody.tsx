import React from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
  TurtleIcon,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import TurtleTabs from '@components/element/TurtleTabs';
import SuccessTab from './tabs/SucceessTab';

import useModal from '@hooks/useModal';
import AddOrderColumnModal from './modals/AddOrderColumnModal';
import { message, Upload } from 'antd';
import { useMutation } from 'react-query';
import orderAPI, {
  CreatingOrdersItem,
  OrderItemList,
  //PreParsingOrderList,
} from '@apis/orderAPI';
import { t } from 'i18next';
import useOrderCart from '@hooks/useOrderCart';
//import ExcelPreParsingModal from './modals/ExcelPreParsingModal';
//import { RcFile } from 'antd/lib/upload';
//import { TurtleContentModal } from '@components/combine';

function PageBody() {
  const { cart, ready } = useOrderCart();
  //const [fileList, setFileList] = useState<RcFile[]>([]);
  // const [preParsingList, setPreParsingList] = useState<PreParsingOrderList>({
  //   first_order: [],
  //   second_order: [],
  //   third_order: [],
  // });
  const [orderColumnVisible, openSettingColumnModal, closeSettingColumnModal] =
    useModal();
  //const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();
  //const [preparsingModalVisible, openPreparsingModal, closePreparsingModal] =
  useModal();

  const createOrderExcelParseMutation = useMutation(
    orderAPI.createOrderExcelParsing,
    {
      onSuccess: (data) => {
        console.log(data);
        ready(data);
      },
    },
  );
  //const loading = !createOrderExcelParseMutation.isSuccess;

  const createOrderSheetMutation = useMutation(orderAPI.createOrderSheet, {
    onSuccess: () => {
      const rt_stores = cart.successList.map<OrderItemList>((store) => {
        const orders = store.orders.map<CreatingOrdersItem>((order) => {
          return {
            vendor_name: order.vendor_name,
            vendor_address: order.vendor_address,
            vendor_mobile: order.vendor_mobile,
            product_name: order.product_name,
            product_option: order.product_option,
            product_count: Number(order.product_count),
            product_price: Number(order.product_price),
            order_type: order.order_type,
            memo: order.memo,
            ws_store_id: order.ws_store_info[0].id,
          };
        });

        return {
          rt_store_id: store.rt_store_id,
          orders,
        };
      });

      createOrderItemMutation.mutate({ rt_stores });
    },
  });

  const createOrderItemMutation = useMutation(orderAPI.createOrderItem, {
    onSuccess: (data) => {
      message.success(data.msg);
    },
  });

  // const creatOrderSheetsPreParsingMutation = useMutation(
  //   orderAPI.createPreParsing,
  //   {
  //     onSuccess: (data) => {
  //       //setPreParsingList(data.data);
  //       //createOrderExcelParseMutation.mutate({ files: fileList });
  //       // if (data.data.third_order.length === 0) {
  //       //   createOrderExcelParseMutation.mutate({ files: fileList });
  //       //   return;
  //       // }
  //       // openPreparsingModal();
  //     },
  //   },
  // );

  return (
    <>
      <AddOrderColumnModal
        visible={orderColumnVisible}
        closeModal={closeSettingColumnModal}
      />
      {/* <TurtleContentModal
        size="middle"
        visible={preparsingModalVisible}
        title="발주서 재등록"
        onClose={closePreparsingModal}
      >
        <p>
          2차 발주까지 완료된 쇼핑몰은 발주서 등록이 금일은 불가능합니다.
          <br />
          {preParsingList.third_order.map(
            (store) => `${store.rt_store_name}, `,
          )}
          <br />
          <br />위 쇼핑몰을 제외한 나머지 발주서만 등록합니다. <br />
          1차발주:
          {preParsingList.first_order.map(
            (store) => `${store.rt_store_name}, `,
          )}
          <br />
          2차발주:
          {preParsingList.second_order.map(
            (store) => ` ${store.rt_store_name}, `,
          )}
        </p>

        <Row justify="end">
          <PrimaryButton>재등록하기</PrimaryButton>
        </Row>
      </TurtleContentModal> */}

      {/*
       * Page
       */}
      <PageTitle
        title="발주서 미리보기"
        buttons={[
          <TeriaryButton text="발주서 설정" onClick={openSettingColumnModal} />,
          <TurtleDropdown
            triggerButton={<SecondaryButton>발주 추가하기</SecondaryButton>}
            items={[
              {
                key: '0',
                label: (
                  <Upload
                    accept=".csv, .xls, .xlsx"
                    multiple
                    beforeUpload={(_, list) => {
                      //setFileList(list);
                      // creatOrderSheetsPreParsingMutation.mutate({
                      //   files: list,
                      // });

                      createOrderExcelParseMutation.mutate({ files: list });

                      return false;
                    }}
                    fileList={[]}
                  >
                    {t('button.uploadExcel')}
                  </Upload>
                ),
                icon: <TurtleIcon name="exel" />,
              },
              {
                key: '1',
                label: '단건추가',
                icon: <TurtleIcon name="single" />,
              },
            ]}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <SuccessTab
            key="success"
            tab={`성공(${cart.successList.length})`}
            loading={false}
          />
          {/* <FailTab
            key="fail"
            tab={`실패(${cart.failList.length})`}
            loading={false}
          /> */}
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
          onClick={() => {
            createOrderSheetMutation.mutate({
              rt_store_ids: cart.successList.map((store) => store.rt_store_id),
            });
            //openConfirmModal();
          }}
        >
          발주 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;
