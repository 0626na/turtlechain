import moment from 'moment';
import { atom } from 'recoil';

interface OrderSelectedDateState {
  date: moment.Moment;
}

export const orderSelectedDateState = atom<OrderSelectedDateState>({
  key: 'orderSelectedDate',
  default: {
    date: moment(),
  },
});
