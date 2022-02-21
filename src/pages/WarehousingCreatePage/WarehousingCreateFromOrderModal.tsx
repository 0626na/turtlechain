import { Card, Statistic } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { Form, DatePicker, Select } from "antd";
import{getDateRangeFromToday} from "utils/general";
import moment from "moment";

interface Props {
    mall_name: string;
    visible: boolean;
    onClose: () => void;
    // onAddToWarehousing: () => void;
    
}

const WarehousingCreateFromOrderModal = function({
    mall_name,
    visible,
    onClose 
}: Props){
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    type SearchType = "product_barcode" |  "ws_name" | "ws_address" | "product_name" ; 
    const [searchType, setSearchType] = useState<SearchType>("ws_name");
    const search_options = [
        {
            value: "product_barcode",
            label: t("product_barcode")
        },
        {
            value: "ws_name",
            label: t("ws_name")
        },
        {
            value: "ws_name",
            label: t("ws_name")
        },
        {
            value: "product_name",
            label: t("product_name")
        },

    ];

    return(
        <Modal
        centered
        width="90%"
        maskClosable = {false}
        visible={visible}
        title={`${mall_name} ${t("modal.title.warehousing_create_from_order")}`}
        onCancel={()=>{
            onClose();
        }}
        
        >
            <ModalInner>
                <Form>
                    <Form.Item label={t("modal.form.order_date_range")}>
                    <DatePicker.RangePicker
                        allowClear={false}
                        value = {[moment(getDateRangeFromToday(1)), moment(getDateRangeFromToday(0))]}  
                    />
                        
                    </Form.Item>

                </Form>
                <StatisticContainer>
                    <Card>
                        <Statistic
                        title={t("modal.stat.ws_count")}
                        value="999"
                        />
                    </Card>
                    <Card>
                        <Statistic
                        title={t("modal.stat.order_count")}
                        value="999,999"
                        />
                    </Card>
                    <Card>
                        <Statistic
                        title={t("modal.stat.order_amt_total")}
                        value="9,999,999"
                        />
                    </Card>
                </StatisticContainer>

            </ModalInner>
        </Modal>
    );

}

const ModalInner = styled.div`
  height: 70vh;
  overflow: auto;
  & > * + * {
    margin-top: 20px;
  }
`;

const StatisticContainer = styled.div`
    display: flex;
    & > * + * {
    margin-left: 20px;
    }
    * {
    font-size: 1rem;
    }
    `;

export default WarehousingCreateFromOrderModal;