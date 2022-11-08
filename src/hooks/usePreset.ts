import { useRecoilState } from 'recoil';
import presetState from '@store/presetState';
import presetAPI from '@apis/presetAPI';
import { useCallback, useEffect } from 'react';

const usePreset = () => {
  const [building, setBuilding] = useRecoilState(presetState.building);
  const [bank, setBank] = useRecoilState(presetState.bank);

  useEffect(() => {
    // building이나 bank 중 한개라도 있으면 재요청 하지 않는다.
    const existPreset = building || bank;

    if (existPreset) return;

    initializePreset();
  }, [building, bank]);

  const initializePreset = useCallback(async () => {
    setBuilding(await presetAPI.getBuilding());
    setBank(await presetAPI.getBank());
  }, []);

  return {
    initializePreset,
    buildingData: building,
    bankData: bank,
  };
};

export default usePreset;
