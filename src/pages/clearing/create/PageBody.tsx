import useStore from '@hooks/useStore';
import AgencyService from './AgencyService';
import Service from './Service';

function PageBody() {
  const { store } = useStore();
  const serviceVersion = store.selected?.companies[0].version;

  return serviceVersion === '2.0' ? <Service /> : <AgencyService />;
}

export default PageBody;
