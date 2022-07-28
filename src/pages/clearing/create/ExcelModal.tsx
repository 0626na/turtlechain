import moment from 'moment';
import { t } from 'i18next';
import { TurtleButton, TurtleButtonSub, TurtleModal } from '@components/common';
import { DatePicker, Form, message, Popconfirm, Row, Tabs, Upload } from 'antd';
import { useEffect } from 'react';
import SuccessTab from './SuccessTab';
import { useMutation } from 'react-query';
import clearingAPI from '@apis/clearingAPI';
import FailTab from './FailTab';
import { storeState } from '@store/storeState';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function ExcelModal({ visible, closeModal }: Props) {
  const store = useRecoilValue(storeState);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const parseQuery = useMutation('parseClearingExcel', clearingAPI.parseExcel);

  const createQuery = useMutation(
    'createClearingParse',
    clearingAPI.createParse,
    {
      onSuccess: () => {
        message.success(t('message.success create clearing'));
        closeModal();
        navigate('/clearing/list');
      },
    },
  );

  useEffect(() => {
    if (visible) return;
    form.setFieldsValue({ request_date: moment() });
    parseQuery.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, form]);

  return (
    <TurtleModal
      centered
      width="90vw"
      bodyStyle={{ height: '80vh', overflow: 'auto' }}
      title="정산서 업로드"
      visible={visible}
      onCancel={closeModal}
      forceRender
      footer={false}
    >
      <Form colon={false} form={form} layout="inline">
        <Form.Item name="request_date" label="이체요청일">
          <DatePicker
            allowClear={false}
            style={{ width: 200 }}
            disabledDate={(current) => current > moment()}
          />
        </Form.Item>
        <Form.Item label="정산서">
          <Upload
            maxCount={1}
            accept=".csv, .xls, .xlsx"
            beforeUpload={(file) => {
              parseQuery.mutate({
                files: file,
                rt_store_id: store.id ?? -1,
              });

              return false;
            }}
            fileList={[]}
          >
            <TurtleButtonSub icon="file">파일선택</TurtleButtonSub>
          </Upload>
        </Form.Item>
      </Form>

      {/* 성공 실패 탭*/}
      <Tabs defaultActiveKey="1" size="large" style={{ width: '100%' }}>
        <SuccessTab
          key="1"
          tab={`성공(${parseQuery.data?.count.success_count ?? 0})`}
          loading={parseQuery.isLoading}
          successList={parseQuery.data?.success ?? []}
        />
        <FailTab
          key="2"
          tab={`실패(${parseQuery.data?.count.fail_count ?? 0})`}
          loading={parseQuery.isLoading}
          failList={parseQuery.data?.fail ?? []}
        />
      </Tabs>

      <Row justify="end" style={{ paddingTop: 20 }}>
        <Popconfirm
          title={t('description.really register')}
          okText={t('yes')}
          cancelText={t('no')}
          onConfirm={() => {
            createQuery.mutate({
              store_id: store.id ?? -1,
              store_name: store.name,
              total_clearing_amount:
                parseQuery.data?.success.reduce(
                  (acc, cur) => acc + cur.credit_amount,
                  0,
                ) ?? 0,
              credit_type: 'general',
              request_date: moment(form.getFieldValue('request_date')).format(
                'YYYY-MM-DD',
              ),
              clearing_add_request:
                parseQuery.data?.success.map((item) => ({
                  ...item,
                })) ?? [],
            });
          }}
        >
          <TurtleButton
            type="primary"
            disabled={parseQuery.data?.count.fail_count !== 0}
            loading={createQuery.isLoading}
          >
            결제요청 등록
          </TurtleButton>
        </Popconfirm>
      </Row>
    </TurtleModal>
  );
}

export default ExcelModal;
