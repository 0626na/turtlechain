import { CloseOutlined } from '@ant-design/icons';
import { PrimaryButton, TurtleIcon, TurtleText } from '@components/element';
import { Col, Popover, PopoverProps, Row, Typography } from 'antd';
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import useProductCart from '@hooks/useProductCart';
import { t } from 'i18next';

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
      overlayInnerStyle={styles.overlayInnerStyle}
      content={
        <Row align="top">
          <Col span={3}>
            <TurtleIcon name="warning" />
          </Col>
          <Col span={20} offset={1}>
            <Row
              align="middle"
              justify="space-between"
              css={styles.marginBottom}
            >
              <TurtleText css={styles.font}>
                {t('description.need product update')}
              </TurtleText>
              <CloseOutlined style={{ color: 'grey' }} onClick={close} />
            </Row>
            <Row css={styles.marginBottom}>
              <Typography css={styles.grey}>
                {t('description.to correspond turtlechain')}
                <br />
                {t('description.update sellmate product')}
              </Typography>
            </Row>
            <Row justify="end">
              <PrimaryButton
                size="small"
                href="https://www.sellmate.co.kr/login"
                target="_blank"
              >
                {t('description.go sellmate')}
              </PrimaryButton>
            </Row>
          </Col>
        </Row>
      }
    />
  );
}

export default NeedUpdatePopover;

const styles = {
  marginBottom: css({
    marginBottom: 8,
  }),
  font: css({
    fontWeight: 700,
    fontSize: 16,
  }),
  grey: css({
    color: '#5b5d63',
  }),
  overlayInnerStyle: { borderRadius: 10, width: 380 },
};
