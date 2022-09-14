import { CloseOutlined } from '@ant-design/icons';
import { PrimaryButton, TurtleIcon, TurtleText } from '@components/element';
import { Col, Popover, PopoverProps, Row, Typography } from 'antd';
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import useProductCart from '@hooks/useProductCart';

interface Props extends PopoverProps {}

function NeedUpdatePopover({ ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const { cart } = useProductCart();

  const close = () => {
    setVisible(false);
  };

  const open = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (cart.successList.length === 0) {
      close();
      return;
    }

    cart.successList.forEach((store) => {
      store.need_update && open();
      return;
    });
  }, [cart.successList]);

  return (
    <Popover
      {...props}
      visible={visible}
      overlayInnerStyle={{ borderRadius: 10, width: 380 }}
      content={
        <Row align="top">
          <Col span={3}>
            <TurtleIcon name="warning" />
          </Col>
          <Col span={20} offset={1}>
            <Row
              align="middle"
              justify="space-between"
              css={css`
                margin-bottom: 8px;
              `}
            >
              <TurtleText
                css={css`
                  font-weight: 700;
                  font-size: 16px;
                `}
              >
                셀메이트 내 상품정보 수정이 필요해요
              </TurtleText>
              <CloseOutlined style={{ color: 'grey' }} onClick={close} />
            </Row>
            <Row
              css={css`
                margin-bottom: 8px;
              `}
            >
              <Typography
                css={css`
                  color: #5b5d63;
                `}
              >
                터틀체인에 등록한 상품정보와 일치하도록
                <br />
                셀메이트 내 상품 세부정보를 업데이트해주세요.
              </Typography>
            </Row>
            <Row justify="end">
              <PrimaryButton
                size="small"
                href="https://www.sellmate.co.kr/login"
                target="_blank"
              >
                셀메이트 바로가기
              </PrimaryButton>
            </Row>
          </Col>
        </Row>
      }
    />
  );
}

export default NeedUpdatePopover;
