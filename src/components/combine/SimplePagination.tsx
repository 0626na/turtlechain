import styled from "styled-components";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
// antd
import { Button, Typography } from "antd";

interface Props {
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  isLoading?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

// TODO: 삭제예정 컴포넌트
const SimplePagination = function ({
  currentPage = 1,
  pageSize = 1,
  totalCount = 1,
  isLoading = false,
  onPrev,
  onNext,
}: Props) {
  const { t } = useTranslation();

  const lastPage = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  return (
    <Container>
      <Button //
        size="small"
        type="link"
        disabled={currentPage === 1 || isLoading}
        onClick={onPrev}
      >
        {t("prev")}
      </Button>
      <Typography>
        {currentPage} / {lastPage}
      </Typography>
      <Button //
        size="small"
        type="link"
        disabled={currentPage === lastPage || isLoading}
        onClick={onNext}
      >
        {t("next")}
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
