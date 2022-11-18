// 이메일 패턴
// 숫자 (0~9) or 알파벳 (a~z, A~Z) 으로 시작하며 중간에 -_. 문자가 있을 수 있으며 그 후 숫자 (0~9) or 알파벳 (a~z, A~Z)이 올 수도 있고 연달아 올 수도 있고 없을 수도 있다.
// @ 는 반드시 존재하며 . 도 반드시 존재하고 a~z, A~Z 의 문자가 2,3개 존재하고 i = 대소문자 구분 안한다.
// ^ 문자열의 시작
// ? 존재여부 (앞의 문자가 없거나 1개 있는경우)
// * 반복 여부 표현 - (aa)* (aa) 가 0개 ~ infinite까지 모두 가능
// $ 문자열의 종료
export const emailPattern =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

// 숫자 패턴
export const numPattern = /[0-9]/;

//숫자제외 패턴
export const notNumPattern = /[^0-9]/g;

// 휴대번호 패턴
export const phonePattern = /^(\d{3})-?(\d{4})-?(\d{4})$/;

// 금액 패턴
export const pricePattern = /\B(?=(\d{3})+(?!\d))/g;

// 사업자번호 패턴
export const bizNumPattern = /(\d{3})(\d{2})(\d{5})/;

// 하이푼제거
export const removeHyphen = /-/g;

//영어와 숫자만 패턴
export const englishAndNumberPatten = /[^A-Z|a-z|0-9]/g;
