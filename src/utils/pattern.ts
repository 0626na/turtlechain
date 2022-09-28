// 이메일 패턴
export const emailPattern =
  /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;

// 숫자 패턴
export const numPattern = /[0-9]/;

// 휴대번호 패턴
export const phonePattern = /^(\d{2,3})(\d{3,4})(\d{4})$/;

// 금액 패턴
export const pricePattern = /\B(?=(\d{3})+(?!\d))/g;

// 사업자번호 패턴
export const bizNumPattern = /(\d{3})(\d{2})(\d{5})/;

// 하이푼제거
export const removeHyphen = /-/g;
