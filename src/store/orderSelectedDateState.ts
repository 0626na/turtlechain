import moment from 'moment';
import { atom } from 'recoil';

interface OrderSelectedDateState {
  selectedDate: moment.Moment;
}

export const orderSelectedDateState = atom<OrderSelectedDateState>({
  key: 'orderSelectedDate',
  default: {
    selectedDate: moment(),
  },
});
