/**
 * RendererTemplate.js 에서 사용할 전역 함수 선언.
 * 템플릿 렌더러는 단순히 스트링으로 작성된 html 을 innerHTML 처리함.
 * 따라서 해당 템플릿의 엘리먼트에 onclick 과 같은 이벤트를 작성한 경우
 * Vue.js 나 React.js 등의 라이프 사이클 및 해당 클래스 인스턴스와 무관하게 오로지 window 전역 함수만을 호출하게 됨.
 * 오로지 window 전역 함수만을 호출하기 때문에 window 전역에서 따로 관리해야 함.
 */
const $ag = window.AUIGrid;
window.$agRendererTemplate = {
  // 버튼 클릭 핸들러
  agBtnClick: (gridId, rowIndex, dataField, event) => {
    // Sample
    const myGridID = gridId;

    let updateValue = {};
    updateValue[dataField] = '';

    // 그리드에 실제 업데이트 적용 시킴
    $ag.updateRow(myGridID, updateValue, rowIndex);
  },

  // 셀렉트 변경 핸들러
  agSelectChangeHandler: (
    gridId,
    rowIndex,
    dataField,
    selectedValue,
    event
  ) => {
    // Sample
    const myGridID = gridId;

    let updateValue = {};
    updateValue[dataField] = selectedValue;
    // 그리드에 실제 업데이트 적용 시킴
    $ag.updateRow(myGridID, updateValue, rowIndex);
  },

  // 체크박스 그룹 클릭 핸들러
  agCheckClick: (gridId, rowIndex, dataField, event) => {
    const myGridID = gridId;
    const target = event.target ? event.target : event.srcElement;

    // 해당 행의 아이템 얻기
    const item = $ag.getItemByRowIndex(myGridID, rowIndex);
    const checkValue = item[dataField];
    const checkArr = !checkValue || !checkValue.length ? [] : checkValue;

    // 체크된 경우 포함시킴
    if (target.checked) {
      checkArr.push(target.value);
    } else {
      // 해제된 경우 제거함.
      checkArr.splice(checkArr.indexOf(target.value), 1);
    }

    let updateValue = {};
    updateValue[dataField] = checkArr.length <= 0 ? [] : checkArr;

    // 그리드 값 수정함.
    $ag.updateRow(myGridID, updateValue, rowIndex);
  },

  // 라디오 그룹 클릭 핸들러
  agRadioClick: (gridId, rowIndex, dataField, event) => {
    // Sample
    const myGridID = gridId;
    const target = event.target ? event.target : event.srcElement;

    // 해당 행의 아이템 얻기
    const item = $ag.getItemByRowIndex(myGridID, rowIndex);
    let checkValue = '';

    // 체크된 경우 포함시킴
    if (target.checked) {
      checkValue = target.value;
    }

    let updateValue = {};
    updateValue[dataField] = checkValue;

    // 그리드 값 수정함.
    $ag.updateRow(myGridID, updateValue, rowIndex);
  },
};
