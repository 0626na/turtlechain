import pickerAPI from '@apis/pickerAPI';
import { StoreShow } from '@apis/retailerStoreAPI';
import {
  AddButton,
  GridIcon,
  SpecialButton,
  TurtleIcon,
  TurtleSearchInput,
  TurtleTableTitle,
  TurtleTag,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import useUser from '@hooks/useUser';
import { PageContent } from '@layout/page';
import { phonePattern } from '@utils/pattern';
import { Col, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import StorePickerCard from './card/StorePickerCard';
import AddPickerModal from './modals/AddPickerModal';
import DetailPickerModal from './modals/DetailPickerModal';

function PageBody() {
  const [mode, setMode] = useState<'cardView' | 'listView'>('listView');
  const { user } = useUser();
  const [selectedRow, setSelectedRow] = useState<StoreShow>();
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const [addModalVisible, openAddDetailModal, closeAddDetailModal] = useModal();

  const getStoreListQuery = useQuery(['getStoreList'], pickerAPI.getList, {
    enabled: !!user,
  });

  const filteredList = useMemo(() => {
    return getStoreListQuery.data?.data.store_list.filter(
      (store) =>
        store.name.includes(searchQuery) ||
        store.store_phone[0].phone.includes(searchQuery),
    );
  }, [getStoreListQuery, searchQuery]);

  const changeMode = () => {
    setMode((mode) => {
      if (mode === 'cardView') return 'listView';
      return 'cardView';
    });
  };

  return (
    <PageContent>
      {/*
       * 쇼핑몰 상세보기 모달
       */}
      <DetailPickerModal
        visible={detailModalVisible}
        closeModal={closeDetailModal}
        selectedRow={selectedRow}
      />

      {/*
       * 쇼핑몰 추가 모달
       */}
      <AddPickerModal
        visible={addModalVisible}
        closeModal={closeAddDetailModal}
      />

      <Row
        align="middle"
        justify="space-between"
        css={css`
          margin-bottom: 16px;
        `}
      >
        <Col>
          <Row align="middle">
            <Col
              css={css`
                margin-right: 12px;
              `}
            >
              <TurtleIcon name="storeList" />
            </Col>
            <Col
              css={css`
                font-size: 20px;
                font-weight: 500;
                color: #242934;
              `}
            >
              <TurtleText>{t('store.info')}</TurtleText>
            </Col>
          </Row>
        </Col>

        <Col>
          <SpecialButton
            onClick={() => {
              openAddDetailModal();
            }}
          >
            <TurtleText>{t('store.create')}</TurtleText>
          </SpecialButton>
        </Col>
      </Row>

      <TurtleTableTitle
        totalCount={getStoreListQuery.data?.data.store_list.length ?? 0}
        rightContent={
          <Row align="middle">
            <Col css={css({ marginRight: 15 })}>
              <TurtleSearchInput
                placeholder={t('placeholder.input store name, mobile')}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </Col>
            <Col>
              <AddButton
                icon={
                  mode === 'cardView' ? (
                    <TurtleIcon name="listView" />
                  ) : (
                    <GridIcon value="#6B6D73" />
                  )
                }
                onClick={() => {
                  changeMode();
                }}
              >
                {mode === 'cardView' ? t('listView') : t('cardView')}
              </AddButton>
            </Col>
          </Row>
        }
      />

      {mode === 'cardView' ? (
        <Row gutter={[27, 27]} css={cardsContainer}>
          {getStoreListQuery.data?.data.store_list.map((item, idx) => (
            <Col
              key={idx}
              span={8}
              onClick={() => {
                setSelectedRow({ ...item });
                openDetailModal();
              }}
              css={css`
                cursor: pointer;
              `}
            >
              <StorePickerCard store={item} />
            </Col>
          ))}
        </Row>
      ) : (
        <Table
          size="small"
          loading={getStoreListQuery.isLoading}
          dataSource={filteredList}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRow({ ...record });
              openDetailModal();
            },
          })}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          scroll={{ x: 950, y: 'auto' }}
          columns={[
            {
              ellipsis: true,
              width: 90,
              title: t('table.operatorStatus'),
              render: (_, record) => {
                const { is_closed } = record;
                const color = is_closed ? 'gray' : 'skyblue';
                const str = is_closed ? t('table.closed') : t('table.open');
                return <TurtleTag color={color}>{str}</TurtleTag>;
              },
            },
            {
              ellipsis: true,

              title: t('table.retailerStoreName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,

              title: t('table.mobile'),
              render: (_, record) =>
                record.store_phone[0]?.phone.replace(
                  phonePattern,
                  '$1-$2-$3',
                ) ?? '',
            },
            // {
            //   render: (_, record) => <TurtleIcon name="delete" />,
            // },
          ]}
        />
      )}
    </PageContent>
  );
}

const cardsContainer = css`
  height: 70vh;
  overflow: auto;
`;

export default PageBody;
