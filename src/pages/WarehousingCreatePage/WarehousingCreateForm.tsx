import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateSheetItems, WarehousingSheetItem } from "apis/warehousingAPI";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card, Row, message } from "antd";
import TurtleText from "components/common/TurtleText";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleInput from "components/common/TurtleInput";
import TurtleInputNumber from "components/common/TurtleInputNumber";
import TurtleButton from "components/common/TurtleButton";
import { storeIdState } from "store/storeIdState";
import { useRecoilValue } from "recoil";
import TurtleInputCurrency from "components/common/TurtleInputCurrency";
// import { WholeSaleStore } from "apis/vendorAPI";
import SearchWholesaleModal from "pages/VendorCreatePage/SearchWholesaleModal";
import { Vendor, Wholesale } from "apis/vendorAPI";
import { storeState } from "store/storeState";
import SearchVendorModal from "components/SearchVendorModal";
import SearchProductModal from "components/SearchProductModal";
interface Props {
  onSheetDetailsAdded: (value: WarehousingSheetItem) => void;

}

const WarehousingCreateForm = function ({ onSheetDetailsAdded }: Props) {

  const { t } = useTranslation();
  const [tempId, setTempId] = useState(1); // 임시 아이디
  const storeId = useRecoilValue(storeIdState);
  const store = useRecoilValue(storeState);
  const [form] = Form.useForm();
  // 거래처 검색 모달
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  // 선택된 거래처
  
  const closeSearchModal = () => {
    setVendorModalVisible(false);
  };



  const onClickCreate = () => {
  
    form.validateFields().then(()=>{
      onSheetDetailsAdded({
        ...form.getFieldsValue()
      });
      form.resetFields();
    })
  }

    // 거래처 선택후 폼에 채워넣기
    const selectVendor = useCallback(
      (vendor_id, vendor_name, vendor_address, vendor_phone) => {
        form.setFieldsValue({
          vendor_id,
          vendor_name,
          vendor_address,
          vendor_phone,
          product_id: undefined,
          product_name: undefined,
          product_code: undefined,
          product_option: undefined,
          product_price: undefined,
          product_count: undefined,
        });
        setVendorModalVisible(false);
      },
      [form],
    );

    const selectProduct = useCallback(
      (product_id, product_name,  product_code, vendor_product_name,product_option, product_price) => {
        form.setFieldsValue({
          product_id,
          product_name,
          vendor_product_name,
          product_code,
          product_option,
          product_price,
          product_count: 1,
        });
        setProductModalVisible(false);
      },
      [form],
    );


  //쇼핑몰 선택 감지하여 form에 넣어줌
  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      rt_store_id: store.id,
    });
  }, [store.id, form]);

  return (
    <>
    <Form //
      layout="horizontal"
      form={form}
      labelCol={{span: 3}}
      wrapperCol={{span:8}}
      colon={false}
    >
      <Form.Item name="sheet_id" hidden>
          <Input hidden />
        </Form.Item>

       <Form.Item name="vendor_id" hidden>
          <Input hidden />
        </Form.Item> 

       <Form.Item name="product_id" hidden>
          <Input hidden />
        </Form.Item> 
      <Form.Item name="rt_store_id" hidden>
          <Input hidden />
        </Form.Item>
        
      <TurtleText>{t("warehousing.section_title1")}</TurtleText>
      
      <TurtleSearchInput //
          name="vendor_name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          onSearch={() => {
            if (!store.id) {
              message.warn("쇼핑몰을 선택해주세요.");
              return;
            }
            setVendorModalVisible(true);
          }}
        />

      <TurtleInput // 거래처 주소 Input
        name="vendor_address"
        disabled={true}
        label={t("vendor.address")}/>

    <TurtleSearchInput
              name="product_name"
              label={t("product.name")}
              placeholder={t("placeholder.product name")}
              onSearch={() => {
                if (!store.id) {
                  message.warn("쇼핑몰을 선택해주세요.");
                  return;
                }
                if (!form.getFieldValue("vendor_id")) {
                  message.warn("거래처를 선택해주세요.");
                  return;
                }
                setProductModalVisible(true);
              }}
              />
      
      <TurtleInput // 거래처상품명 Input
        disabled={true}
        name="vendor_product_name"
        label={t("product.vendor_product_name")}/> 
      
      <TurtleInput // 상품 바코드 Input
        disabled={true}
        name="product_code"
        label={t("product.code")}/> 
      
      <TurtleInput // 옵션Input
        disabled={true}
        name="product_option"
        label={t("product.option")}/> 
        
      <TurtleInput // price Input
        disabled={true}
        name="product_price"
        label={t("product.price")}/> 
      
      <TurtleInputNumber // count Input
        name="product_count"
        min = {1}
        defaultValue={1}
        label={t("warehousing.count")}/> 
    <Row justify="center">
      <TurtleButton type="default" onClick={onClickCreate}>{t("button.add")}</TurtleButton>
    </Row>
    </Form>
    <SearchVendorModal
        visible={vendorModalVisible}
        closeModal={closeSearchModal}
        onClickSelect={selectVendor}
      />

<SearchProductModal
        visible={productModalVisible}
        closeModal={() => {
          setProductModalVisible(false);
        }}
        vendorId={form.getFieldValue("vendor_id")}
        onClickSelect={selectProduct}
      />    
    </>
  );
};

const ItemGroup = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`;

export default WarehousingCreateForm;
