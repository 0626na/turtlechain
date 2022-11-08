import { useRecoilState } from 'recoil';
import presetState from '@store/presetState';
import presetAPI from '@apis/presetAPI';
import { useCallback } from 'react';

const usePreset = () => {
  const [building, setBuilding] = useRecoilState(presetState.building);
  const [bank, setBank] = useRecoilState(presetState.bank);

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
