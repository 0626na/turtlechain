import moment from 'moment';

export const aWeekAgo = () => {
  return moment().subtract(1, 'weeks').format('YYYY-MM-DD');
};
