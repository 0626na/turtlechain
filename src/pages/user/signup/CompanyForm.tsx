import styled from 'styled-components';
import { t } from 'i18next';
import { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Upload, RadioChangeEvent } from 'antd';
// constant
import { BIZ_TYPE_OPTIONS } from '@constant/index';
import { DaumPostcodeModal } from '@components/combine';
import { Company } from '.';

interface Props {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
  onNext: () => void;
}

function CompanyForm({ company, setCompany, onNext }: Props) {
  const history = useHistory();
  const [visiblePostcodeModal, setVisiblePostcodeModal] = useState(false);

  const handleChangeRadio = (e: RadioChangeEvent) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name as string]: value });
  };

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const nextDisabled = useMemo(() => {
    const { owner, name, biz_num, address_main, biz_license_file } = company;
    if (!owner || !name || !biz_num || !address_main || !biz_license_file) {
      return true;
    } else {
      return false;
    }
  }, [company]);

  return (
    <>
      <DaumPostcodeModal
        visible={visiblePostcodeModal}
        onClose={() => setVisiblePostcodeModal(false)}
        onGetAddress={(address_main) => {
          setCompany({ ...company, address_main });
        }}
      />
      <Form layout="vertical">
        <Form.Item label={t('biz type')}>
          <Radio.Group
            name="biz_type"
            value={company.biz_type}
            onChange={handleChangeRadio}
          >
            {BIZ_TYPE_OPTIONS.map((option) => {
              const label = t(`biz ${option}`);
              return (
                <Radio key={option} value={option}>
                  {label}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('owner')}>
          <Input
            name="owner"
            value={company.owner}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t('biz name')}>
          <Input //
            name="name"
            value={company.name}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t('biz num')}>
          <Input
            name="biz_num"
            placeholder={t('description.only number')}
            value={company.biz_num}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t('biz address')}>
          <Input //
            readOnly
            name="address"
            value={company.address_main}
            suffix={
              <Button
                size="small"
                type="link"
                style={{ fontSize: 13 }}
                onClick={() => setVisiblePostcodeModal(true)}
              >
                {t('find address')}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={t('biz detail address')}>
          <Input
            name="address_sub"
            value={company.address_sub}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t('biz license')}>
          <Upload
            listType="picture"
            fileList={
              company.biz_license_file ? [company.biz_license_file as any] : []
            }
            beforeUpload={(file: File) => {
              setCompany({ ...company, biz_license_file: file });
              return false;
            }}
            onRemove={() => {
              setCompany({ ...company, biz_license_file: null });
            }}
          >
            <Button
              type="primary"
              disabled={company.biz_license_file !== null}
              icon={<UploadOutlined />}
            >
              {t('biz license')}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label={t('etc')}>
          <Input.TextArea
            style={{ height: 100 }}
            name="memo"
            value={company.memo}
            onChange={handleChangeText}
            placeholder="운영중인 쇼핑몰 url 주소 입력해주세요."
          />
        </Form.Item>
        <ButtonContainer>
          <Button block onClick={() => history.push('/')}>
            {t('prev')}
          </Button>
          <Button block disabled={nextDisabled} type="primary" onClick={onNext}>
            {t('next')}
          </Button>
        </ButtonContainer>
      </Form>
    </>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * + * {
    margin-left: 20px;
  }
`;

export default CompanyForm;
