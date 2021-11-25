import styled from "styled-components";
import { useMemo } from "react";
// antd
import {
  CaretLeftOutlined as PrevIcon,
  CaretRightOutlined as NextIcon,
} from "@ant-design/icons";
import { Button, Typography } from "antd";

interface Props {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const SimplePagination = function ({
  currentPage,
  pageSize,
  totalCount,
  isLoading,
  onPrev,
  onNext,
}: Props) {
  const lastPage = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  return (
    <Container>
      <Button //
        size="small"
        disabled={currentPage === 1 || isLoading}
        onClick={onPrev}
      >
        <PrevIcon />
      </Button>
      <Typography>
        {currentPage} / {lastPage}
      </Typography>
      <Button //
        size="small"
        disabled={currentPage === lastPage || isLoading}
        onClick={onNext}
      >
        <NextIcon />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 10px;
  }
`;

export default SimplePagination;
