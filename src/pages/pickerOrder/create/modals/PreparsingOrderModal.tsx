import React from 'react';
import orderAPI, { ResponseCreatePreParsing } from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import { AnswerButton } from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row } from 'antd';
import { useMutation } from 'react-query';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';
import { t } from 'i18next';

interface Props {
  visible: boolean;
  close: () => void;
  open: () => void;
  data: {
    files: RcFile[];
    preParsingResult: ResponseCreatePreParsing;
  };
}

function PreparsingOrderModal({ visible, close, open, data }: Props) {
  const { ready, cart } = useOrderCart();

  //발주서 파싱
  const createOrderExcelParseMutation = useMutation(
    orderAPI.createOrderExcelParsing,
    {
      onSuccess: (parsingData) => {
        ready({
          ...parsingData,
          data: {
            ...parsingData.data,
            successes: parsingData.data.successes.map((item) => ({
              ...item,
              type: 'excel',
            })),
            fails: parsingData.data.fails.map((item) => ({
              ...item,
              type: 'excel',
            })),
          },
        });
      },
    },
  );

  return (
    <>
      <TurtleContentModal
        size="small"
        visible={visible}
        title={t('order.orderPreParsing')}
        onClose={close}
      >
        <p>
          {t('order.description1')}
          <br />
          {data.preParsingResult.data.third_order.map((store, index) =>
            data.preParsingResult.data.third_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
          <br />
          <br />
          {t('order.description2')} <br />
          {t('order.1stOrder')}:
          {data.preParsingResult.data.first_order.map((store, index) =>
            data.preParsingResult.data.first_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
          <br />
          {t('order.2ndOrder')}:
          {data.preParsingResult.data.second_order.map((store, index) =>
            data.preParsingResult.data.second_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
        </p>

        <Row justify="end">
          <Col style={{ marginRight: 20 }}>
            <AnswerButton type="NO" text={t('cancel')} onClick={close} />
          </Col>
          <Col>
            <AnswerButton
              type="YES"
              text={t('order.orderPreparsing.recreate')}
              disabled={
                data.preParsingResult.data.third_order.length !== 0 &&
                data.preParsingResult.data.first_order.length === 0 &&
                data.preParsingResult.data.second_order.length === 0
              }
              onClick={() => {
                createOrderExcelParseMutation.mutate({
                  files: data.files,
                  request_date: moment(cart.selectedDate).format('YYYY-MM-DD'),
                });
                close();
              }}
            />
          </Col>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default PreparsingOrderModal;
