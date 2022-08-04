import useStoreExist from '@hooks/useStoreExist';
import RequestModal from '@pages/vendor/create/RequestModal';
import { Typography } from 'antd';
import { useState } from 'react';

function AddBucketlistSign() {
  const isStoreExist = useStoreExist();
  const [addBucketlistModalVisible, setAddBucketlistModalVisible] =
    useState(false); // 거래처 신규 등록 요청 모달

  return (
    <>
      {/* 거래처 신규 등록 요청 모달 */}
      <RequestModal //
        visible={addBucketlistModalVisible}
        closeModal={() => {
          setAddBucketlistModalVisible(false);
        }}
      />
      <Typography.Text>
        등록 하고 싶은 거래처가 없나요? 신규 거래처 등록을 해주세요!&nbsp;
      </Typography.Text>
      <Typography.Link
        style={{ textDecoration: 'underline' }}
        onClick={() => {
          if (!isStoreExist()) {
            return;
          }
          setAddBucketlistModalVisible(true);
        }}
      >
        신규 거래처 등록하기
      </Typography.Link>
    </>
  );
}

export default AddBucketlistSign;
