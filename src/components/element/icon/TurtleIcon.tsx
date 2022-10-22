import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as ModalCloseIcon } from '@icons/modalClose.svg';

import { ReactComponent as MatchingIcon } from '@icons/matching.svg';
import { ReactComponent as MisMatchingIcon } from '@icons/misMatching.svg';

import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { ReactComponent as UpdateVendorNameIcon } from '@icons/updateVendorName.svg';
import { ReactComponent as UpdateVendorInfoIcon } from '@icons/updateVendorInfo.svg';
import { ReactComponent as MoreIcon } from '@icons/more.svg';
import { ReactComponent as WarningIcon } from '@icons/warning.svg';
import { ReactComponent as SiderSelectIcon } from '@icons/siderSelect.svg';

import { ReactComponent as DownLoadIcon } from '@icons/download.svg';
import { ReactComponent as AddReserveIcon } from '@icons/addReserve.svg';
import { ReactComponent as AddExchangeRefundIcon } from '@icons/addExchangeRefund.svg';

import { ReactComponent as ArrowDownIcon } from '@icons/arrowDown.svg';

import { ReactComponent as ProcessIcon } from '@icons/process.svg';

import { ReactComponent as UserIcon } from '@icons/user.svg';
import { ReactComponent as CompanyIcon } from '@icons/company.svg';
import { ReactComponent as StoreListIcon } from '@icons/storeList.svg';
import { ReactComponent as MembershipIcon } from '@icons/membership.svg';

import { ReactComponent as AccountIcon } from '@icons/account.svg';
import { ReactComponent as AtIcon } from '@icons/at.svg';
import { ReactComponent as ClipIcon } from '@icons/clip.svg';
import { ReactComponent as PencilIcon } from '@icons/pencil.svg';
import { ReactComponent as PhoneIcon } from '@icons/phone.svg';
import { ReactComponent as InfoIcon } from '@icons/info.svg';
import { ReactComponent as ListIcon } from '@icons/list.svg';
import { ReactComponent as ListViewIcon } from '@icons/listView.svg';

import { ReactComponent as VendorProductIcon } from '@icons/vendorProduct.svg';
import { ReactComponent as OrderIcon } from '@icons/order.svg';
import { ReactComponent as WarehousingIcon } from '@icons/warehousing.svg';
import { ReactComponent as SettingIcon } from '@icons/setting.svg';
import { ReactComponent as TutorialIcon } from '@icons/tutorial.svg';
import { ReactComponent as ClearingIcon } from '@icons/clearing.svg';
import { ReactComponent as PlusIcon } from '@icons/plus.svg';

import { ReactComponent as ExcludeWonIcon } from '@icons/excludeWon.svg';
import { ReactComponent as IncludeWonIcon } from '@icons/includeWon.svg';
import { ReactComponent as CoinIcon } from '@icons/coin.svg';
import { ReactComponent as RightTriangleIcon } from '@icons/rightTriangle.svg';
import { ReactComponent as UserCheckIcon } from '@icons/userCheck.svg';
import { ReactComponent as UserLineIcon } from '@icons/userLine.svg';
import { ReactComponent as MarkIcon } from '@icons/mark.svg';
import { css } from '@emotion/react';
import React from 'react';

interface Props {
  danger?: boolean;
  name:
    | 'mark'
    | 'delete'
    | 'download'
    | 'modalClose'
    | 'matching'
    | 'misMatching'
    | 'exel'
    | 'single'
    | 'updateVendorName'
    | 'updateVendorInfo'
    | 'more'
    | 'warning'
    | 'siderSelect'
    | 'exchangeRefund'
    | 'reserve'
    | 'arrowDown'
    | 'user'
    | 'membership'
    | 'company'
    | 'storeList'
    | 'process'
    | 'at'
    | 'clip'
    | 'pencil'
    | 'phone'
    | 'account'
    | 'info'
    | 'list'
    | 'listView'
    | 'vendorProduct'
    | 'order'
    | 'warehousing'
    | 'clearing'
    | 'setting'
    | 'tutorial'
    | 'plus'
    | 'includeWon'
    | 'excludeWon'
    | 'coin'
    | 'rightTriangle'
    | 'userCheck'
    | 'userLine';

  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function TurtleIcon({ name, onClick, danger }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onClick && onClick(e);
  };

  if (name === 'mark') {
    return <MarkIcon />;
  }

  if (name === 'rightTriangle') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <RightTriangleIcon />
      </div>
    );
  }

  if (name === 'userCheck') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <UserCheckIcon />
      </div>
    );
  }

  if (name === 'userLine') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <UserLineIcon />
      </div>
    );
  }

  if (name === 'coin') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <CoinIcon />
      </div>
    );
  }

  if (name === 'includeWon') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <IncludeWonIcon />
      </div>
    );
  }

  if (name === 'excludeWon') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ExcludeWonIcon />
      </div>
    );
  }

  if (name === 'plus') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <PlusIcon />
      </div>
    );
  }

  if (name === 'clearing') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ClearingIcon />
      </div>
    );
  }

  if (name === 'vendorProduct') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <VendorProductIcon />
      </div>
    );
  }

  if (name === 'order') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <OrderIcon />
      </div>
    );
  }

  if (name === 'warehousing') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <WarehousingIcon />
      </div>
    );
  }

  if (name === 'setting') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <SettingIcon />
      </div>
    );
  }

  if (name === 'tutorial') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <TutorialIcon />
      </div>
    );
  }

  if (name === 'listView') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ListViewIcon />
      </div>
    );
  }

  if (name === 'list') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ListIcon />
      </div>
    );
  }

  if (name === 'account') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <AccountIcon />
      </div>
    );
  }

  if (name === 'info') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <InfoIcon />
      </div>
    );
  }

  if (name === 'at') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <AtIcon />
      </div>
    );
  }

  if (name === 'clip') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ClipIcon />
      </div>
    );
  }

  if (name === 'pencil') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <PencilIcon />
      </div>
    );
  }

  if (name === 'phone') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <PhoneIcon />
      </div>
    );
  }

  if (name === 'delete') {
    return (
      <div
        css={[removeIconContainer, { stroke: danger ? 'red' : '#A1A2A6' }]}
        onClick={handleClick}
      >
        <RemoveIcon />
      </div>
    );
  }

  if (name === 'modalClose') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ModalCloseIcon />
      </div>
    );
  }

  if (name === 'matching') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <MatchingIcon />
      </div>
    );
  }

  if (name === 'misMatching') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <MisMatchingIcon />
      </div>
    );
  }

  if (name === 'exel') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ExelIcon />
      </div>
    );
  }

  if (name === 'single') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <SingleIcon />
      </div>
    );
  }

  if (name === 'warning') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <WarningIcon />
      </div>
    );
  }

  if (name === 'updateVendorName') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <UpdateVendorNameIcon />
      </div>
    );
  }

  if (name === 'updateVendorInfo') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <UpdateVendorInfoIcon />
      </div>
    );
  }

  if (name === 'more') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <MoreIcon />
      </div>
    );
  }

  if (name === 'siderSelect') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <SiderSelectIcon />
      </div>
    );
  }

  if (name === 'exchangeRefund') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <AddExchangeRefundIcon />
      </div>
    );
  }

  if (name === 'reserve') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <AddReserveIcon />
      </div>
    );
  }

  if (name === 'arrowDown') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <ArrowDownIcon />
      </div>
    );
  }

  if (name === 'download') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <DownLoadIcon />
      </div>
    );
  }

  if (name === 'process') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <ProcessIcon />
      </div>
    );
  }
  if (name === 'user') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <UserIcon />
      </div>
    );
  }
  if (name === 'membership') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <CompanyIcon />
      </div>
    );
  }
  if (name === 'company') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <StoreListIcon />
      </div>
    );
  }
  if (name === 'storeList') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <MembershipIcon />
      </div>
    );
  }

  return <></>;
}

const iconContainer = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const removeIconContainer = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`;
export default TurtleIcon;
