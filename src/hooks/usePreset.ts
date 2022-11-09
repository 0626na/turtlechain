import { useRecoilState } from 'recoil';
import presetState from '@store/presetState';
import presetAPI from '@apis/presetAPI';
import { useCallback, useEffect } from 'react';

const usePreset = () => {
  const [buildingData, setBuildingData] = useRecoilState(
    presetState.buildingData,
  );
  const [bankData, setBankData] = useRecoilState(presetState.bankData);

  useEffect(() => {
    // building이나 bank 중 한개라도 있으면 재요청 하지 않는다.
    const existPreset = buildingData || bankData;

    if (existPreset) return;

    initializePreset();
  }, [buildingData, bankData]);

  const initializePreset = useCallback(async () => {
    setBuildingData(await presetAPI.getBuilding());
    setBankData(await presetAPI.getBank());
  }, []);

  return {
    initializePreset,
    buildingData,
    bankData,
  };
};

export default usePreset;
