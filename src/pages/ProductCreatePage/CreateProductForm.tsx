import Form, { useForm } from "antd/lib/form/Form";
import TurtleInput from "components/common/TurtleInput";
import TurtleText from "components/common/TurtleText";
import { t } from "i18next";

function CreateProductForm() {
  const [form] = useForm();

  return (
    <Form
      layout="horizontal"
      form={form}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 7 }}
      colon={false}
    >
      <TurtleText>{t("product.basic info")}</TurtleText>
      <TurtleInput label="상품명" name="product_name" required={true} />
      <TurtleInput label="거래처 상품명" name="vendor_product_name" required={true} />
      <TurtleInput label="상품 바코드 번호" name="product_code" />
      <TurtleInput label="옵션" name="product_option" />
      <TurtleInput label="공급가" name="product_price" />
      <TurtleInput label="상품 이미지 URL" name="product_image_url" />
      <TurtleInput label="메모" name="product_memo" />
    </Form>
  );
}

export default CreateProductForm;
