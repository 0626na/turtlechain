import { t } from 'i18next';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  Button,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
  Upload,
  Image,
  Col,
} from 'antd';
import retailerCompanyAPI from '@apis/retailerCompanyAPI';
import { DaumPostcodeModal } from '@components/combine';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleCardSetting,
} from '@components/common';
import { bizNumPattern } from '@utils/pattern';

import { MinusCircleOutlined } from '@ant-design/icons';
import { AxiosError } from 'axios';

function PageBody() {
  const [form] = Form.useForm();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);

  const getQuery = useQuery('getCompany', retailerCompanyAPI.get, {
    onSuccess: (data) => {
      form.setFieldsValue({
        biz_license_file: `${data?.biz_license_path}?_=${+new Date()}`,
      });
    },
  });

  const updateQuery = useMutation('updateCompany', retailerCompanyAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update'));

      setIsUpdateMode(false);
      getQuery.refetch();
    },
  });

  const checkEmailValidityQuery = useMutation(
    'checkEmailValidityQuery',
    retailerCompanyAPI.checkEmailValidity,
    {
      onSuccess: (data) => {
        message.success(data.msg);

        form.setFieldsValue({
          ...form.getFieldsValue(),
          email: [
            ...form.getFieldValue('email'),
            form.getFieldValue('newEmail'),
          ],
        });
        form.resetFields(['newEmail']);
      },
      onError: (data: AxiosError) => {
        message.error(data.response?.data.msg);
      },
    },
  );

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Row>
      <TurtleCardSetting
        title={t('company.info')}
        style={{ marginBottom: 24 }}
        extra={
          isUpdateMode ? (
            <Typography.Link
              type="secondary"
              onClick={() => {
                form.setFieldsValue({
                  biz_license_file: `${
                    getQuery?.data?.biz_license_path
                  }?_=${+new Date()}`,
                });

                setIsUpdateMode(false);
              }}
            >
              닫기
            </Typography.Link>
          ) : (
            <Typography.Link
              type="secondary"
              onClick={() => {
                setIsUpdateMode(true);
                form.resetFields();
                form.setFieldsValue({
                  company_id: getQuery.data?.id,
                  biz_type: getQuery.data?.biz_type,
                  name: getQuery.data?.name,
                  address_main: getQuery.data?.address.split('::')[0],
                  address_sub: getQuery.data?.address.split('::')[1],
                  email: getQuery.data?.email,
                  memo: getQuery.data?.memo,
                  biz_license_file: [
                    {
                      uid: '1',
                      name: getQuery.data?.biz_license_path.split('/').pop()!,
                      status: 'done',
                      url: `${
                        getQuery.data?.biz_license_path
                      }?_=${+new Date()}`,
                    },
                  ],
                });
              }}
            >
              수정하기
            </Typography.Link>
          )
        }
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          onFinish={(value) => {
            updateQuery.mutate({
              company_id: value.company_id,
              biz_type: value.biz_type,
              name: value.name,
              address_main: value.address_main,
              address_sub: form.getFieldValue('address_sub') ?? '',
              email: value.email.join(',') ?? '',
              memo: value.memo,
              biz_license_file:
                form.getFieldValue('biz_license_file')[0].originFileObj,
            });
          }}
        >
          <Form.Item name="company_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item
            label={t('company.type.')}
            name="biz_type"
            wrapperCol={{ span: 6 }}
          >
            {isUpdateMode ? (
              <Select>
                <Select.Option value="personal">
                  {t(`company.type.personal`)}
                </Select.Option>
                <Select.Option value="entity">
                  {t(`company.type.entity`)}
                </Select.Option>
                <Select.Option value="simple">
                  {t(`company.type.simple`)}
                </Select.Option>
              </Select>
            ) : (
              t(`company.type.${getQuery.data?.biz_type}`)
            )}
          </Form.Item>
          <Form.Item label="사업자 번호">
            {getQuery.data?.biz_num.replace(bizNumPattern, '$1-$2-$3')}
          </Form.Item>
          <Form.Item label="사업자명" name="name" wrapperCol={{ span: 6 }}>
            {isUpdateMode ? <Input /> : getQuery.data?.name}
          </Form.Item>

          <Form.Item label="사업자 주소">
            {isUpdateMode ? (
              <Row>
                <Col span={18}>
                  <Form.Item noStyle name="address_main">
                    <Input
                      readOnly
                      onClick={() => setPostcodeModalVisible(true)}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    style={{ marginLeft: 8 }}
                    size="middle"
                    onClick={() => setPostcodeModalVisible(true)}
                  >
                    {t('find address')}
                  </Button>
                </Col>
              </Row>
            ) : (
              getQuery.data?.address
            )}
          </Form.Item>
          <DaumPostcodeModal
            visible={postcodeModalVisible}
            onClose={() => setPostcodeModalVisible(false)}
            onGetAddress={(address_main) => {
              form.setFieldsValue({ ...form.getFieldsValue, address_main });
            }}
          />

          <Form.Item
            label="상세주소"
            name="address_sub"
            wrapperCol={{ span: 6 }}
            hidden={!isUpdateMode}
          >
            <Input />
          </Form.Item>

          <Form.Item label="세금계산서 발행메일">
            <Form.Item
              style={{
                marginBottom: 8,
                display: isUpdateMode ? 'block' : 'none',
              }}
            >
              <Row>
                <Col span={18}>
                  <Form.Item noStyle name="newEmail">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => (
                      <Button
                        style={{ marginLeft: 8 }}
                        disabled={getFieldValue('email')?.length === 4}
                        loading={checkEmailValidityQuery.isLoading}
                        onClick={() => {
                          checkEmailValidityQuery.mutate({
                            email: getFieldValue('newEmail'),
                          });
                        }}
                      >
                        추가
                      </Button>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.List name="email">
              {(fields, { remove }) => {
                if (!isUpdateMode) {
                  return (
                    <>
                      {getQuery.data?.email.map((item, idx) => {
                        return <div key={idx}>{item}</div>;
                      })}
                    </>
                  );
                }

                return (
                  <>
                    {fields.map((field) => {
                      return (
                        <Row
                          style={{ marginBottom: 8 }}
                          key={field.key}
                          align="middle"
                          gutter={12}
                        >
                          <Col span={12}>
                            <Form.Item {...field} noStyle>
                              <Input disabled />
                            </Form.Item>
                          </Col>
                          <Col span={3}>
                            <MinusCircleOutlined
                              style={{ padding: 8 }}
                              onClick={() => remove(field.name)}
                            />
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
          </Form.Item>

          <Form.Item label="메모" name="memo" wrapperCol={{ span: 6 }}>
            {isUpdateMode ? <Input /> : getQuery.data?.memo}
          </Form.Item>
          <Form.Item
            label="사업자등록증"
            name="biz_license_file"
            wrapperCol={{ span: 6 }}
            getValueFromEvent={isUpdateMode ? normFile : () => {}}
            valuePropName={isUpdateMode ? 'fileList' : 'src'}
          >
            {isUpdateMode ? (
              <Upload
                listType="picture"
                maxCount={1}
                accept=".jpg, .png, .jpeg, .pdf"
                beforeUpload={() => false}
              >
                <TurtleButtonSub size="small">파일 선택하기</TurtleButtonSub>
              </Upload>
            ) : (
              <Image width={300} />
            )}
          </Form.Item>
          <Row justify="end">
            {isUpdateMode && (
              <TurtleButton
                htmlType="submit"
                type="default"
                loading={updateQuery.isLoading}
              >
                수정하기
              </TurtleButton>
            )}
          </Row>
        </Form>
      </TurtleCardSetting>
    </Row>
  );
}

export default PageBody;
