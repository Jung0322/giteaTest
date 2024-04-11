<!--
    AUI Grid를 공통으로 사용하기 위해 래핑한 콤포넌트
    작성자 : 열린기술 아키텍처팀
-->
<template>
  <div class="card grid-box">
    <div class="card-header" v-if="label || useBtn">
      <span v-if="label">
        <!-- y-auigrid Icon -->
        <span class="cutstom-title-color">
          <f-icon icon="list-alt" />
          <!-- <y-label color-class="cutstom-title-color" /> -->
        </span>
        <!-- y-auigrid 게시물 갯수 -->
        <y-label
          v-if="showLabel"
          :label="label"
          color-class="cutstom-title-color"
        />
        <y-label
          v-if="showItemCount"
          :label="' (' + totalItemCount + '건)'"
          color-class="cutstom-title-color"
        />
        <y-label
          v-if="showRightLabel"
          :label="rightLabel"
          color-class="cutstom-title-right-color"
        />
        <span class="grid-show-item-tip-cell" v-if="showItemTip">
          <y-label :label="itemTip" />
        </span>
      </span>
      <!-- 데이터 테이블 위 버튼을 보여줌 -->
      <div v-if="useBtn" slot="buttonGroup" class="float-right">
        <span v-if="showBtnTip">
          <el-tag type="info" style="padding-top: 5px !important">{{
            btnTipLabel
          }}</el-tag>
        </span>
        <span v-for="btn in btnArr" :key="btn.title">
          <y-btn
            class="ml-1"
            v-if="btn.visible"
            :title="btn.title"
            :color="btn.color"
            :icon="btn.icon"
            :actionUrl="btn.actionUrl"
            :param="btn.param"
            :isSubmit="btn.isSubmit"
            :actionType="btn.actionType"
            :beforeSubmit="btn.myBeforeSubmit"
            @myBeforeSubmit="myBeforeSubmit(btn.beforeSubmit)"
            @btnClicked="btnClickedHadnler(btn.btnClicked)"
            @btnClickedErrorCallback="
              btnClickedErrorCallback(btn.btnClickedError)
            "
          />
        </span>
        <y-btn
          v-if="useExcelExport"
          title="Excel"
          color="green"
          icon="list-alt"
          @btnClicked="btnExportClickHandler('XLS')"
          class="ml-1"
        />
        <y-btn
          v-if="useCsvExport"
          title="CSV"
          color="green"
          icon="list-alt"
          @btnClicked="btnExportClickHandler('CSV')"
          class="ml-1"
        />
        <y-btn
          v-if="showGridSetSave"
          title="Grid"
          color="green"
          @btnClicked="btnSaveGridColHandler()"
        />
      </div>
    </div>
    <div class="card-body">
      <AUIGrid
        ref="AuiGrid"
        :name="name"
        @addColumn="addColumnHandler"
        @addRow="addRowHandler"
        @addRowFinish="addRowFinishHandler"
        @addTreeColumn="addTreeColumnHandler"
        @beforeInsertRow="beforeInsertRowHandler"
        @beforeRemoveColumn="beforeRemoveColumnHandler"
        @beforeRemoveRow="beforeRemoveRowHandler"
        @beforeRemoveSoftRows="beforeRemoveSoftRowsHandler"
        @cellClick="cellClickHandler"
        @cellDoubleClick="cellDoubleClickHandler"
        @cellEditBegin="cellEditBeginHandler"
        @cellEditCancel="cellEditCancelHandler"
        @cellEditEnd="cellEditEndHandler"
        @cellEditEndBefore="cellEditEndBeforeHandler"
        @cellLongTap="cellLongTapHandler"
        @columnStateChange="columnStateChangeHandler"
        @contextMenu="contextMenuHandler"
        @dragBegin="dragBeginHandler"
        @dropCancel="dropCancelHandler"
        @dropEnd="dropEndHandler"
        @dropEndBefore="dropEndBeforeHandler"
        @filtering="filteringHandler"
        @footerClick="footerClickHandler"
        @footerDoubleClick="footerDoubleClickHandler"
        @grouping="groupingHandler"
        @headerClick="headerClickHandler"
        @hScrollChange="hScrollChangeHandler"
        @keyDown="keyDownHandler"
        @notFound="notFoundHandler"
        @pageChange="pageChangeHandler"
        @pageRowCountChange="pageRowCountChangeHandler"
        @pasteBegin="pasteBeginHandler"
        @pasteEnd="pasteEndHandler"
        @ready="readyHandler"
        @removeColumn="removeColumnHandler"
        @removeRow="removeRowHandler"
        @removeSoftRows="removeSoftRowsHandler"
        @rowAllCheckClick="rowAllCheckClickHandler"
        @rowAllChkClick="rowAllChkClickHandler"
        @rowCheckClick="rowCheckClickHandler"
        @rowNumCellClick="rowNumCellClickHandler"
        @rowStateCellClick="rowStateCellClickHandler"
        @selectionChange="selectionChangeHandler"
        @sorting="sortingHandler"
        @treeLazyRequest="treeLazyRequestHandler"
        @treeOpenChange="treeOpenChangeHandler"
        @undoRedoChange="undoRedoChangeHandler"
        @updateRow="updateRowHandler"
        @updateRows="updateRowsHandler"
        @vScrollChange="vScrollChangeHandler"
      ></AUIGrid>
    </div>
    <div v-if="usePaginate" style="text-align: center">
      <paginate
        ref="paginate"
        :pageCount="paginatePageCount"
        :pageRange="paginatePageRange"
        :clickHandler="paginateClickHandler"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
    <y-dialog :param="gridPopupOptions"></y-dialog>

    <!-- header context -->
    <!-- <div id="headerContext" v-if="showGridCtrl" >
      <ul id="headerMenu" @click="selectHeaderMenu">
        <li id="selectedHeaderText"></li>
        <li id="item1" click="">컬럼고정</li>
        <li id="item2">고정취소</li>
        <li id="item3">숨기기</li>
        <li id="item4">보이기</li>
      </ul>
    </div> -->
  </div>
</template>

<script>
// AUIGrid 컴포넌트
import AUIGrid from '@/components/grid/AUIGrid-Vue.js/AUIGrid.vue';
import Paginate from 'vuejs-paginate';
import backendConfig from '@/js/backendConfig';
import selectConfig from '@/js/selectConfig';
import { getAccessToken } from '@/utils/auth';
export default {
  // 컴포넌트 사용할 시 이름
  name: 'y-auigrid',
  // 컴포넌트를 포함 할 요소
  components: {
    AUIGrid,
    Paginate,
  },
  props: {
    // 부모로부터 받을 auigrid name 속성
    name: {
      type: String,
      default: null,
    },
    // grid 헤더
    headers: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // grid 아이템들
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // grid 버튼 영역 표시
    useBtn: {
      type: Boolean,
      default: true,
    },
    // paginate 사용할지 여부
    usePaginate: {
      type: Boolean,
      default: false,
    },
    // paginate사용시 List에 몇개 보여줄기
    paginateListCount: {
      type: Number,
      default: 1000,
    },
    // paginate사용시 전체 데이터 개수
    paginateTotalCount: {
      type: Number,
      default: 5000,
    },
    // paginate에서 한번에 몇개 보여줄지
    paginatePageRange: {
      type: Number,
      default: 10,
    },
    paginateCurrentPage: {
      type: Number,
      default: 1,
    },
    // 삽입한 모든 데이터를 세로 스크롤 없이 출력하고 데이터에 맞게 그리드의 높이를 자동 결정할지를 지정합니다.
    autoGridHeight: {
      type: Boolean,
      default: false,
    },
    // autoScrollSize
    cellMergePolicy: {
      type: String,
      default: 'default',
    },
    // 컨텍스트 메뉴 아이템을 사용자 정의 할 수 있는 속성입니다.
    contextMenuItems: {
      type: Array,
      default: () => [],
    },
    // 그리드의 셀 또는 행을 복사(Ctrl+C) 할 때 원래 데이터 값을 복사할 지 그리드에 의해 포매팅된 값을 복사할 지 여부를 결정할 수 있는 함수입니다.
    // 예를 들어 실 데이터는 1000 이나, 그리드에 의해 "1,000원" 으로 포매팅되어 출력되고 있을 때 Ctrl+C 로 복사할 대상이 1000 또는 "1,000원" 인지를 동적으로 결정하게 됩니다.
    // copyDisplayFunction 는 copyDisplayValue 속성보다 우선 순위가 높습니다. 따라서 copyDisplayFunction 를 지정하면 copyDisplayValue 는 무시됩니다.
    copyDisplayFunction: {
      type: Function,
      default: null,
    },
    // 그리드의 셀 또는 행을 복사(Ctrl+C) 할 때 원래 데이터 값을 복사할 지 그리드에 의해 포매팅된 값을 복사할 지 여부를 나타냅니다
    copyDisplayValue: {
      type: Boolean,
      default: false,
    },
    // 계층형 그리드(트리 그리드) 에서 최초로 보여지는 그리드의 브랜치 아이템이 모두 열린 상태로 출력될지 닫힌 상태로 출력될지를 결정합니다.
    displayTreeOpen: {
      type: Boolean,
      default: true,
    },
    // 편집 수정 가능 여부를 지정합니다. true이면 rowIdField를 지정해야 그리드 수정내용이 바인딩된 data에 반영된다.
    editable: {
      type: Boolean,
      default: false,
    },
    // 편집 가능(editable=true) 상태에서 고정 칼럼, 고정 행을 설정했을 때 해당 셀 편집 가능 여부를 지정합니다.
    editableOnFixedCell: {
      type: Boolean,
      default: false,
    },
    // 마우스로 편집, 수정 모드로 들어가는 정책을 지정합니다.
    editBeginMode: {
      type: String,
      // default: "click"
      default: 'doubleClick',
    },
    // 기본적으로 편집 가능 상태(editable = true)일 때 수정 모드 진입은 F2, 더블클릭(클릭)입니다.
    // 그러나 엑셀과 같이 바로 해당 셀에서 어떤 키(any keys)를 누르든 수정 가능 상태로 만들지 여부를 나타냅니다.
    // 바로 편집 가능 상태로 진입한 경우 엔터/탭 키 완료는 물론 키보드 방향 키로도 편집 완료가 가능합니다.(엑셀 UI)
    editingOnKeyDown: {
      type: Boolean,
      default: true,
    },
    // 칼럼 셀 병합(cell merge) 가능 여부를 지정합니다.
    enableCellMerge: {
      type: Boolean,
      default: false,
    },
    // enableCellMerge 할 때 실제로 rowspan 적용 시킬지 여부
    cellMergeRowSpan: {
      type: Boolean,
      default: false,
    },
    // 그리드 데이터 복사하기(Ctrl+C), 붙여넣기(Ctrl+V) 활성화 여부를 지정합니다.
    enableClipboard: {
      type: Boolean,
      default: true,
    },
    // 칼럼 리사이징 가능 여부를 지정합니다.
    enableColumnResize: {
      type: Boolean,
      default: true,
    },
    // 드래깅 행 이동 가능 여부 (기본값 : false)
    enableDrag: {
      type: Boolean,
      default: false,
    },
    // 드랍 가능 여부 (기본값 : true)
    enableDrop: {
      type: Boolean,
      default: false,
    },
    // 다수의 행을 한번에 드래깅 가능 여부 (기본값 : false)
    enableMultipleDrag: {
      type: Boolean,
      default: false,
    },
    // 행 드래깅 손잡이 뿐만 셀을 바로 드래깅해서 행 이동(복사) 가능 여부 (기본값 : false)
    // 속성 enableDrag=true 설정이 선행되어야 합니다.
    enableDragByCellDrag: {
      type: Boolean,
      default: false,
    },
    // 그리드에 필터기능 추가
    enableFilter: {
      type: Boolean,
      default: false,
    },
    // 포커스 가능 여부
    enableFocus: {
      type: Boolean,
      default: true,
    },
    // 마우스 휠(wheel) 활성화 여부를 지정합니다.
    enableMouseWheel: {
      type: Boolean,
      default: true,
    },
    // 칼럼 헤더를 드래그앤드랍으로 자리를 옮기는 기능 활성화 여부를 지정합니다.
    enableMovingColumn: {
      type: Boolean,
      default: false,
    },
    // 정렬 가능 여부를 지정합니다.
    enableSorting: {
      type: Boolean,
      default: false,
    },
    // 편집 가능 그리드(editable=true)에서 실행 취소(Undo), 다시 실행(Redo) 기능을 사용할지 여부를 지정합니다.
    enableUndoRedo: {
      type: Boolean,
      default: true,
    },
    // 엔터키가 다음 행으로 이동하지 않고, 다음 칼럼으로 이동할지 여부를 지정합니다.
    enterKeyColumnBase: {
      type: Boolean,
      default: false,
    },
    // excludeFixedRowsOnSorting
    exportURL: {
      type: String,
      default: backendConfig.getUrl(selectConfig.export.url),
    },
    // 칼럼의 필터링 아이콘 클릭 시 나오는 필터링 메뉴에서 실제 값들이 더 많다는 메세지를 출력할 수 있습니다.
    filterItemMoreMessage: {
      type: String,
      default: 'Too many items...Search words',
    },
    // 칼럼의 필터링 아이콘 클릭 시 나오는 필터링 메뉴에서 해당 칼럼의 값들이 많을 경우 모두 체크 박스로 출력되지 않습니다.
    // filterMenuItemMaxCount 은 필터링 가능한 체크박스의 최대값을 지정합니다.
    filterMenuItemMaxCount: {
      type: Number,
      default: 50,
    },
    // 고정 칼럼의 개수를 지정합니다.
    fixedColumnCount: {
      type: Number,
      default: 0,
    },
    // 고정 행(row)의 개수를 지정합니다.
    fixedRowCount: {
      type: Number,
      default: 0,
    },
    // 그리드에 입력되는 데이터가 계층구조의 데이터는 아니지만, id,
    // parent 구조를 갖는 일반 데이터인 경우 트리 그리드로 출력할지 여부를 나타냅니다.
    flat2tree: {
      type: Boolean,
      default: false,
    },
    // 그룹핑을 할 칼럼의 데이터 필드를 지정합니다.
    groupingFields: {
      type: Array,
      default: () => [],
    },
    // 그룹핑 시 소계 행(Summary Rows)을 생성하고자 할 때 이 속성을 설정함
    groupingSummary: {
      type: Object,
      default: null,
    },
    // 헤더의 높이를 지정합니다.
    headerHeight: {
      type: Number,
      default: 24,
    },

    // 그리드 전체 높이
    height: {
      type: [String, Number],
      default: null,
    },

    // Home, End 키가 칼럼 중심인지 여부
    isColumnOriented: {
      type: Boolean,
      default: true,
    },
    // 에디팅 완료 후 계속 에디팅 상태 유지 여부
    keepEditing: {
      type: Boolean,
      default: false,
    },
    // 최소 칼럼 사이즈
    minColumnWidth: {
      type: Number,
      default: 12,
    },
    // 다중 정렬키 지정
    multiSortingKey: {
      type: String,
      default: 'shiftKey',
    },
    // showAutoNoDataMessage 가 true 인 경우 출력시킬 메세지를 지정합니다.
    noDataMessage: {
      type: String,
      default: 'No Data to display',
    },
    // 페이징을 사용하는 경우 한 페이지에 출력되는 행의 수를 지정합니다.
    pageRowCount: {
      type: Number,
      default: 20,
    },
    // 페이징의 행의 개수를 변경할 수 있는 select 의 option들을 지정합니다.
    pageRowSelectValues: {
      type: Array,
      default: () => [20, 40, 60, 80, 100],
    },
    // 페이징을 사용하는 경우 페이징의 방식을 지정합니다. 유효값은 "default", "simple" 입니다.
    // "simple" 로 설정한 경우 이전, 다음 버턴과 현재페이지/전체페이지 만 출력됩니다.
    pagingMode: {
      type: String,
      default: 'default',
    },
    // 행의 높이를 지정합니다. 행의 높이는 20보다 작아질 수 없습니다. (즉, 행 높이 최소값은 20)
    rowHeight: {
      type: Number,
      default: 26,
    },
    // 개별 행 아이템의 고유 값을 갖는 Key 필드에 해당되는 필드를 지정합니다.
    // DB 의 Record 에 비유하면 Primary Key 입니다.
    rowIdField: {
      type: [String, Number],
      default: '',
    },
    // 행 줄번호(로우 넘버링) 칼럼의 가로 사이즈(width)를 지정합니다.
    rowNumColumnWidth: {
      type: Number,
      default: 40,
    },
    // 행번호 칼럼 설정한 경우(showRowNumColumn=true) 행번호 칼럼의 헤더에 출력할 텍스트를 지정합니다.
    rowNumHeaderText: {
      type: String,
      default: 'No.',
    },
    // 행 스타일 함수 지정
    rowStyleFunction: {
      type: Function,
      default: null,
    },
    // 셀 선택모드를 지정합니다. 유효 속성값은 다음과 같습니다.
    selectionMode: {
      type: String,
      default: 'singleRow', // singleCell, multipleCells, multipleRow
    },
    // 출력할 데이터가 없을 경우 자동 출력 여부
    showAutoNoDataMessage: {
      type: Boolean,
      default: true,
    },
    // 그룹핑 시 브랜치에 해당되는 행 출력 여부를 지정합니다
    showBranchOnGrouping: {
      type: Boolean,
      default: true,
    },
    // 헤더 출력 여부를 지정합니다.
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 푸터 출력 여부를 지정합니다.
    showFooter: {
      type: Boolean,
      default: false,
    },
    // 푸터 행수
    footerRowCount: {
      type: Number,
      default: 1,
    },
    // 페이징을 사용하는 경우 출력되는 페이지의 버턴 개수를 지정합니다.
    showPageButtonCount: {
      type: Number,
      default: 10,
    },
    // 페이징을 사용할 때 1 페이지에 출력할 행의 개수를 변경할 수 있는 select UI 를 하단에 출력할지 여부를 지정합니다.
    showPageRowSelect: {
      type: Boolean,
      default: false,
    },
    // 엑스트라 행 체크박스(showRowCheckColumn=true)를 설정한 경우, 헤더 부분에 전체 선택 체크박스를 표시할지 여부를 지정합니다.
    showRowAllCheckBox: {
      type: Boolean,
      default: true,
    },
    // 엑스트라 행 체크박스 출력 여부를 지정합니다.
    showRowCheckColumn: {
      type: Boolean,
      default: false,
    },
    // 행 줄번호(로우 넘버링) 칼럼의 출력 여부를 지정합니다.
    showRowNumColumn: {
      type: Boolean,
      default: true,
    },
    // showSelectionBorder
    showStateColumn: {
      type: Boolean,
      default: false,
    },
    // 그리드 툴팁 표시 여부를 지정합니다.
    showTooltip: {
      type: Boolean,
      default: false,
    },
    // 읽기 전용 칼럼 설정한 경우 키보드로 셀렉션 이동 가능 여부
    skipReadonlyColumns: {
      type: Boolean,
      default: false,
    },
    // 수정 가능한 상태(editable = true) 인 경우 행을 삭제하면 그리드에서 바로 제거하지 않고,
    // 삭제된 표시를 하고 남겨 둘 지 여부를 나타냅니다.
    softRemoveRowMode: {
      type: Boolean,
      default: true,
    },
    // 툴팁 표시를 설정한 경우(showTooltip:true 설정) 툴팁이 표시되는 시간을 ms 로 지정합니다.
    tooltipSensitivity: {
      type: Number,
      default: 1000,
    },
    // 그리드에 일반 데이터(즉, 트리 계층형 데이터가 아닌 일반 배열 데이터)를 삽입 한 경우,
    // 하위 데이터가 없는 트리 그리드로 출력합니다.
    treeLazyMode: {
      type: Boolean,
      default: false,
    },
    // 계층형 그리드(트리 그리드) 에서 트리 아이콘을 출력시킬 칼럼 인덱스를 지정합니다.
    treeColumnIndex: {
      type: Number,
      default: 0,
    },
    // 트리 그리드에서 트리를 출력하는 칼럼에 표시되는 아이콘을 동적으로 변경 할 수 있는 함수입니다.
    treeIconFunction: {
      type: Function,
      default: null,
    },
    // 그리드에 입력되는 데이터가 계층구조의 데이터는 아니지만, 트리 그리드로 출력하고자 할 때 행이 id, parent 필드를 갖어야 합니다.
    // 이 때 id에 해당되는 데이터의 필드명을 treeIdField 값으로 지정하십시오.
    treeIdField: {
      type: String,
      default: null,
    },
    // 그리드에 입력되는 데이터가 계층구조의 데이터는 아니지만, 트리 그리드로 출력하고자 할 때 행이 id, parent 필드를 갖어야 합니다.
    // 이 때 내 부모행에 해당되는 참고필드를 treeIdRefField 값으로 지정하십시오.
    treeIdRefField: {
      type: String,
      default: null,
    },
    // 계층형 그리드(트리 그리드) 에서 열기/닫기 실행 시 재귀적으로(recursivly) 열/닫을 실행할지 결정합니다.
    treeOpenRecursivly: {
      type: Boolean,
      default: false,
    },
    // 행 선택모드에서 옆으로 칼럼 변경할 시 selectionChange 이벤트 발생 여부
    triggerSelectionChangeOnCell: {
      type: Boolean,
      default: false,
    },
    // 그룹핑 패널 사용 여부
    useGroupingPanel: {
      type: Boolean,
      default: false,
    },
    // 페이징을 사용 여부를 지정합니다.
    usePaging: {
      type: Boolean,
      default: false,
    },
    // -------------- 기타 -------------------------
    // 선택된 Row Item 부모 쪽과 sync를 통해 동기화 된다.
    selectedItem: {
      type: Object,
      default: null,
    },
    // 다중 선택된 Rows Items 부모 쪽과 sync를 통해 동기화 된다.
    selectedItems: {
      type: Array,
      default: null,
    },
    // label
    label: {
      type: String,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    // 게시물 갯수를 보여줌
    showItemCount: {
      type: Boolean,
      default: true,
    },
    showItemTip: {
      type: Boolean,
      default: false,
    },
    // 건수옆에 표시할 라벨
    itemTip: {
      type: String,
    },
    // 버튼의 여러가지 속성을 배열로받음
    btns: {
      type: Array,
      default: null,
    },
    // 엑셀 사용 여부
    useExcelExport: {
      type: Boolean,
      default: true,
    },
    // csv 사용여부
    useCsvExport: {
      type: Boolean,
      default: false,
    },
    exceptColumnFields: {
      type: Array,
      default: null,
    },
    // 엑셀 파일이름
    excelFileName: {
      type: String,
      default: '',
    },
    // 엑셀 이름
    excelSheetName: {
      type: String,
      default: 'Sheet 1',
    },
    // 그리드를 저장
    showGridSetSave: {
      type: Boolean,
      default: false,
    },
    showGridCtrl: {
      type: Boolean,
      default: false,
    },
    // 그리드의 체크박스를 라디오 버튼으로 변경
    rowCheckToRadio: {
      type: Boolean,
      default: false,
    },
    // 버튼 영역에 팁 사용 여부
    showBtnTip: {
      type: Boolean,
      default: false,
    },
    // 버튼 영역에 팁 내용
    btnTipLabel: {
      type: String,
      default: '',
    },
    // 건수표시 다음 보여줄 라벨여부
    showRightLabel: {
      type: Boolean,
      default: false,
    },
    // 건수표시 다음 보여줄 라벨
    rightLabel: {
      type: String,
      default: '',
    },
    useContextMenu: {
      type: Boolean,
      default: false,
    },
    enableRightDownFocus: {
      type: Boolean,
      default: false,
    },
    wordWrap: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      // 타입 이름
      // btn에 값을 전달하는 역할
      btnData: {
        // 버튼 이름
        title: '',
        // 버튼 보일지 여부
        visible: true,
        // 버튼 색상
        color: '',
        // 버튼에 쓰일 클래스
        icon: '',
        // 버튼을 눌렀을때 실행되는 URL
        actionUrl: '',
        // 버튼을 눌렀을때 전송되는 type
        actionType: '',
        // 버튼을 눌럿을때 param
        param: null,
        // 버튼 클릭 후 행동
        isSubmit: false,
        // 버튼 사용 여부
        useSubmit: false,
        myBeforeSubmit: '',
        beforeSubmit: '',
        btnClicked: '',
        btnClickedError: '',
      },
      // 다이얼로그를 펼칠 옵션
      gridPopupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      // 버튼의 배열을 저장할 곳
      btnArr: [],
      useDeepCopy: false,
      // Auigrid 참조를 사용하기 위해만듬
      auiGrid: null,
      // 조회 테이블 개수를 저장
      gridDataLen: 0,
      exportFileName: '',
      // AuiGrid config
      auiGridProps: {
        autoGridHeight: false,
        cellMergePolicy: 'default',
        contextMenuItems: [],
        copyDisplayFunction: null,
        copyDisplayValue: false,
        displayTreeOpen: true,
        editable: false,
        enableFilter: false,
        enableFocus: true,
        editableOnFixedCell: false,
        editBeginMode: 'doubleClick',
        editingOnKeyDown: true,
        enableCellMerge: false,
        cellMergeRowSpan: false,
        enableClipboard: true,
        enableColumnResize: true,
        enableMouseWheel: true,
        enableMovingColumn: true,
        enableSorting: true,
        enableUndoRedo: true,
        enterKeyColumnBase: false,
        exportURL: backendConfig.getUrl(selectConfig.export.url),
        filterItemMoreMessage: 'Too many items...Search words',
        filterMenuItemMaxCount: 50,
        fixedColumnCount: 0,
        fixedRowCount: 0,
        flat2tree: false,
        groupingFields: [],
        groupingSummary: [],
        headerHeight: 24,
        isColumnOriented: true,
        keepEditing: false,
        minColumnWidth: 12,
        multiSortingKey: 'shiftKey',
        noDataMessage: 'No Data to display',
        pageRowCount: 20,
        pageRowSelectValues: [20, 40, 60, 80, 100],
        pagingMode: 'default',
        rowHeight: 26,
        rowIdField: '',
        rowNumColumnWidth: 40,
        rowNumHeaderText: 'No.',
        rowStyleFunction: null,
        rowCheckToRadio: false,
        selectionMode: 'singleRow',
        showAutoNoDataMessage: true,
        showBranchOnGrouping: true,
        showHeader: true,
        showFooter: false,
        footerRowCount: 1,
        showPageButtonCount: 10,
        showPageRowSelect: false,
        showRowAllCheckBox: true,
        showRowCheckColumn: false,
        showRowNumColumn: true,
        showStateColumn: false,
        showTooltip: false,
        skipReadonlyColumns: false,
        softRemoveRowMode: false,
        tooltipSensitivity: 1000,
        treeColumnIndex: 0,
        treeIconFunction: null,
        treeIdField: null,
        treeIdRefField: null,
        treeOpenRecursivly: false,
        treeLazyMode: false,
        triggerSelectionChangeOnCell: false,
        useGroupingPanel: false,
        usePaging: false,
        enableDrag: false,
        enableDrop: false,
        enableMultipleDrag: false,
        enableDragByCellDrag: false,
        useContextMenu: false,
        enableRightDownFocus: false,
        exceptColumnFields: null,
        wordWrap: false,
      },
      myId: null,
      isFirstActive: true,
      nowHeaderMenuVisible: false,
      selectedMenu: {},

      saveData: {
        files: [],
        tempId: [],
      },
    };
  },
  computed: {
    // 전체 데이터 수
    totalItemCount() {
      if (this.usePaginate) {
        // 페이징을 사용하는 화면은
        // 현재 데이터 개수 / 전체 데이터 개수 로 표현
        return this.gridDataLen + '/' + this.paginateTotalCount;
      } else return this.gridDataLen;
    },
    // paginate page count
    paginatePageCount() {
      // 전체 데이터 개수를 List에 표시되는개수로 나누면 전체 페이지수가 나온다.
      return Number(
        Math.trunc(this.paginateTotalCount / this.paginateListCount) + 1
      );
    },
  },
  watch: {
    items: {
      handler: function (val, oldval) {
        if (this.useDeepCopy === true) {
          this.setGridData(this.$_.cloneDeep(this.items));
        } else {
          this.setGridData(this.items);
        }
      },
      deep: true,
    },
    /*
       이쪽으로 들어오게 된다.
       이런 경우 grid가 생성되어 있지 않으면 grid를 생성해준다.
       this.auiGrid 변수는 mounted에서 설정이 되어 있다.
       */
    headers: {
      handler: function (val, oldval) {
        if (!this.auiGrid.isCreated()) {
          this.CreateGrid();
        }
      },
      deep: true,
    },
    // 부모 컴포넌트에게 넘겨 받은 버튼들
    btns: {
      handler: function (val, oldval) {
        this.btnArr.forEach((curBtn) => {
          let newBtn = val.find((t) => t.title === curBtn.title);
          if (newBtn !== undefined) {
            // 변경가능한 변수들
            curBtn.visible = newBtn.visible;
          }
        });
      },
      deep: true,
    },
    excelFileName: {
      handler: function (val, oldval) {
        this.exportFileName = val;
      },
      deep: true,
    },
    // btnSubmit1(val, oldval) {
    //   // console.log("======== Enter Watch btnSubmit1 ============");
    //   // console.log(val);
    //   this.btnSubmitChange(0, this.btnSubmitParam1, val);
    // },
    // btnSubmit2(val, oldval) {
    //   // console.log("======== Enter Watch btnSubmit2 ============");
    //   this.btnSubmitChange(1, btnSubmitParam2, val);
    // },
    // btnSubmit3(val, oldval) {
    //   // console.log("======== Enter Watch btnSubmit3 ============");
    //   this.btnSubmitChange(2, btnSubmitParam3, val);
    // },
    paginateCurrentPage: {
      handler: function (val, oldval) {
        this.$refs.paginate.selected = val;
      },
      deep: true,
    },
  },
  beforeMount() {},
  mounted() {
    // Grid Object 설정
    this.auiGrid = this.$refs.AuiGrid;

    // 헤더 설정
    if (this.headers.length > 0) {
      this.CreateGrid();
    }
    // btnArr에 부모에게 받은 버튼 데이터 저장
    if (this.btns !== undefined && this.btns !== null) {
      this.setBtnArr(this.btns);
    }
    if (this.showGridSetSave) {
      this.setGridColumn();
    }
    if (this.showGridCtrl) {
      this.auiGrid.bind('contextMenu', this.showHeaderContextMenu);
      document.addEventListener('click', this.hideContextMenu);
    }

    if (this.items !== null) {
      this.auiGrid.setGridData(this.items);
    }
  },
  beforeDestroy() {
    if (this.auiGrid != null) {
      this.auiGrid.destroy();
    }
    if (this.showGridCtrl) {
      document.removeEventListener('click', this.hideContextMenu);
    }
  },
  activated() {
    if (this.isFirstActive === false) {
      // AUI Grid가 다시 활성화 될때 resize event를 발생시킨다.
      window.dispatchEvent(new Event('resize'));
    }
    this.isFirstActive = false;
  },
  deactivated() {},
  methods: {
    // Grid 생성
    CreateGrid() {
      // row id field를 지정하면 watch에서 deep copy를 한다.
      if (this.rowIdField !== '') {
        this.useDeepCopy = true;
      }
      // AUI Grid Properties 설정
      this.auiGridProps.height = this.height;
      this.auiGridProps.enableFilter = this.enableFilter;
      this.auiGridProps.enableFocus = this.enableFocus;
      this.auiGridProps.autoGridHeight = this.autoGridHeight;
      this.auiGridProps.cellMergePolicy = this.cellMergePolicy;
      this.auiGridProps.contextMenuItems = this.contextMenuItems;
      this.auiGridProps.copyDisplayFunction = this.copyDisplayFunction;
      this.auiGridProps.copyDisplayValue = this.copyDisplayValue;
      this.auiGridProps.displayTreeOpen = this.displayTreeOpen;
      this.auiGridProps.editable = this.editable;
      this.auiGridProps.editableOnFixedCell = this.editableOnFixedCell;
      this.auiGridProps.editBeginMode = this.editBeginMode;
      this.auiGridProps.editingOnKeyDown = this.editingOnKeyDown;
      this.auiGridProps.enableCellMerge = this.enableCellMerge;
      this.auiGridProps.cellMergeRowSpan = this.cellMergeRowSpan;
      this.auiGridProps.enableClipboard = this.enableClipboard;
      this.auiGridProps.enableColumnResize = this.enableColumnResize;
      this.auiGridProps.enableMouseWheel = this.enableMouseWheel;
      this.auiGridProps.enableMovingColumn = this.enableMovingColumn;
      this.auiGridProps.enableSorting = this.enableSorting;
      this.auiGridProps.enableUndoRedo = this.enableUndoRedo;
      this.auiGridProps.enterKeyColumnBase = this.enterKeyColumnBase;
      this.auiGridProps.exportURL = this.exportURL;
      this.auiGridProps.filterItemMoreMessage = this.filterItemMoreMessage;
      this.auiGridProps.filterMenuItemMaxCount = this.filterMenuItemMaxCount;
      this.auiGridProps.fixedColumnCount = this.fixedColumnCount;
      this.auiGridProps.fixedRowCount = this.fixedRowCount;
      this.auiGridProps.flat2tree = this.flat2tree;
      this.auiGridProps.groupingFields = this.groupingFields;
      this.auiGridProps.groupingSummary = this.groupingSummary;
      this.auiGridProps.headerHeight = this.headerHeight;
      this.auiGridProps.isColumnOriented = this.isColumnOriented;
      this.auiGridProps.keepEditing = this.keepEditing;
      this.auiGridProps.minColumnWidth = this.minColumnWidth;
      this.auiGridProps.multiSortingKey = this.multiSortingKey;
      this.auiGridProps.noDataMessage = this.noDataMessage;
      this.auiGridProps.pageRowCount = this.pageRowCount;
      this.auiGridProps.pageRowSelectValues = this.pageRowSelectValues;
      this.auiGridProps.pagingMode = this.pagingMode;
      this.auiGridProps.rowHeight = this.rowHeight;
      this.auiGridProps.rowIdField = this.rowIdField.toString();
      this.auiGridProps.rowNumColumnWidth = this.rowNumColumnWidth;
      this.auiGridProps.rowNumHeaderText = this.rowNumHeaderText;
      this.auiGridProps.rowStyleFunction = this.rowStyleFunction;
      this.auiGridProps.rowCheckToRadio = this.rowCheckToRadio;
      this.auiGridProps.selectionMode = this.selectionMode;
      this.auiGridProps.showAutoNoDataMessage = this.showAutoNoDataMessage;
      this.auiGridProps.showBranchOnGrouping = this.showBranchOnGrouping;
      this.auiGridProps.showHeader = this.showHeader;
      this.auiGridProps.showFooter = this.showFooter;
      this.auiGridProps.footerRowCount = this.footerRowCount;

      this.auiGridProps.showPageButtonCount = this.showPageButtonCount;
      this.auiGridProps.showPageRowSelect = this.showPageRowSelect;
      this.auiGridProps.showRowAllCheckBox = this.showRowAllCheckBox;
      this.auiGridProps.showRowCheckColumn = this.showRowCheckColumn;
      this.auiGridProps.showRowNumColumn = this.showRowNumColumn;
      this.auiGridProps.showStateColumn = this.showStateColumn;
      this.auiGridProps.showTooltip = this.showTooltip;
      this.auiGridProps.skipReadonlyColumns = this.skipReadonlyColumns;
      this.auiGridProps.softRemoveRowMode = this.softRemoveRowMode;
      this.auiGridProps.tooltipSensitivity = this.tooltipSensitivity;
      this.auiGridProps.treeColumnIndex = this.treeColumnIndex;
      this.auiGridProps.treeIconFunction = this.treeIconFunction;
      this.auiGridProps.treeIdField = this.treeIdField;
      this.auiGridProps.treeIdRefField = this.treeIdRefField;
      this.auiGridProps.treeOpenRecursivly = this.treeOpenRecursivly;
      this.auiGridProps.triggerSelectionChangeOnCell =
        this.triggerSelectionChangeOnCell;
      this.auiGridProps.useGroupingPanel = this.useGroupingPanel;
      this.auiGridProps.usePaging = this.usePaging;
      this.auiGridProps.enableDrag = this.enableDrag;
      this.auiGridProps.enableDrop = this.enableDrop;
      this.auiGridProps.enableMultipleDrag = this.enableMultipleDrag;
      this.auiGridProps.enableDragByCellDrag = this.enableDragByCellDrag;

      this.auiGridProps.useContextMenu = this.useContextMenu;
      this.auiGridProps.enableRightDownFocus = this.enableRightDownFocus;

      this.auiGridProps.exceptColumnFields = this.exceptColumnFields;
      this.auiGridProps.wordWrap = this.wordWrap;

      // AUI Grid 생성
      // myId 는 생성된느 div의 id에 #이 붙이 값이다. ex #aui-grid-wrap-593
      this.myId = this.auiGrid.create(this.headers, this.auiGridProps);
      this.userGridId = this.name;
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // columnIndex : 추가된 열의 인덱스
    // dataFields : 추가된 열들이 출력하고 있는 데이터의 KeyField들 (Array)
    addColumnHandler(event) {
      this.$emit('addColumn', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // items : 추가된 행 아이템들 (Array)
    // console.log(event.type + " 이벤트\r\n" + "\r\n삽입된 행 개수 : " + event.items.length);
    addRowHandler(event) {
      this.$emit('addRow', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // items : 추가된 행 아이템들 (Array)
    addRowFinishHandler(event) {
      this.$emit('addRowFinish', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // columnIndex : 추가된 열의 인덱스
    // index : 부모를 기준으로 추가된 열의 자식 인덱스
    // dataFields : 추가된 열들이 출력하고 있는 데이터의 KeyField들 (Array)
    // parentDataField : 추가된 열의 부모의 dataField
    addTreeColumnHandler(event) {
      this.$emit('addTreeColumn', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // columnInfoList : 칼럼의 출력 정보를 갖는 배열 (Array)
    // isClipboard : 붙여 넣기로 인해 새행이 추가되었는지 여부(Boolean) (v3.0.4 지원)
    beforeInsertRowHandler(event) {
      this.$emit('beforeInsertRow', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // columnIndexes : 삭제될 열의 인덱스 묶음 (Array)
    // dataFields : 삭제될 열의 dataField 묶음 (Array)
    // return false; // 반환을 false 로 처리하면 삭제 실행을 취소함.
    beforeRemoveColumnHandler(event) {
      this.$emit('beforeRemoveColumn', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // softRemoveRowMode : 소프트 제거 모드 사용 여부 즉, 그리드 상에 실제로 삭제될 지 또는 마크 될지 여부
    // items : 삭제될 행 아이템들 (Array)
    // return false; // 반환을 false 로 처리하면 삭제 실행을 취소함.
    beforeRemoveRowHandler(event) {
      this.$emit('beforeRemoveRow', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // items : 삭제될 행 아이템들 (Array)
    beforeRemoveSoftRowsHandler(event) {
      this.$emit('beforeRemoveSoftRows', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 행 인덱스
    // columnIndex : 칼럼 인덱스
    // dataField : 행 아이템에서 현재 칼럼이 출력되고 있는 데이터의 KeyField
    // editable : 해당 셀의 수정 가능 여부
    // value : 셀에 출력되고 있는 값(value)
    // rowIdValue : rowIdField 로 지정한 키에 대한 값. 즉, 행의 고유값 (rowIdField 설정 선행 필수)
    // headerText : 현재 칼럼의 헤더 텍스트
    // item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
    // treeIcon : 트리그리드인 경우 트리그리드의 열기/닫기 버턴 클릭 여부(Boolean)
    cellClickHandler(event) {
      this.$emit('cellClick', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 행 인덱스
    // columnIndex : 칼럼 인덱스
    // editable : 해당 셀의 수정 가능 여부
    // value : 셀에 출력되고 있는 값(value)
    // rowIdValue : rowIdField 로 지정한 키에 대한 값. 즉, 행의 고유값 (rowIdField 설정 선행 필수)
    // headerText : 현재 칼럼의 헤더 텍스트
    // item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
    // dataField : 행 아이템에서 현재 칼럼이 출력되고 있는 데이터의 KeyField
    cellDoubleClickHandler(event) {
      this.$emit('cellDoubleClick', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 행 인덱스
    // columnIndex : 칼럼 인덱스
    // value : 원래 데이터의 해당 셀 값(value)
    // headerText : 현재 칼럼의 헤더 텍스트
    // item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
    // dataField : 행 아이템에서 현재 칼럼이 출력되고 있는 데이터의 KeyField
    // po sition : 셀의 전역 좌표계(Body 기준) 또는 지역 좌표계(그리드 부모 기준) 위치(x좌표 : event.position.x, y좌표 : event.position.y, x지역좌표 : event.position.localX, y지역좌표 : event.position.localY)
    // size : 해당 셀의 가로, 세로 사이즈(width : event.size.width, height : event.size.height)
    // isClipboard : 붙여 넣기(Ctrl+V) 로 이벤트가 발생했는지 여부 (Boolean)
    // which : 편집 시작을 어떤 방식으로 수행 했는지에 대한 정보(String or Number)
    // return false; // false, true 반환으로 동적으로 수정, 편집 제어 가능
    cellEditBeginHandler(event) {
      this.$emit('cellEditBegin', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 행 인덱스
    // columnIndex : 칼럼 인덱스
    // value : 원래 데이터의 해당 셀 값(value)
    // headerText : 현재 칼럼의 헤더 텍스트
    // item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
    // dataField : 행 아이템에서 현재 칼럼이 출력되고 있는 데이터의 KeyField
    // isClipboard : 붙여 넣기(Ctrl+V) 로 이벤트가 발생했는지 여부 (Boolean)
    // which : 편집 취소를 어떤 방식으로 수행 했는지에 대한 정보(String or Number)
    cellEditCancelHandler(event) {
      this.$emit('cellEditCancel', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 행 인덱스
    // columnIndex : 칼럼 인덱스
    // oldValue : 변경 전 셀 값(value)
    // value : 변경 된 셀 값(value)
    // headerText : 현재 칼럼의 헤더 텍스트
    // item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
    // dataField : 행 아이템에서 현재 칼럼이 출력되고 있는 데이터의 KeyField
    // isClipboard : 붙여 넣기(Ctrl+V) 로 이벤트가 발생했는지 여부 (Boolean)
    // which : 편집 완료를 어떤 방식으로 수행 했는지에 대한 정보(String or Number)
    cellEditEndHandler(event) {
      // let gridObj = this.getColumnItemByDataField(event.dataField);
      // if (gridObj.labelFunction) {
      //   if (event.value == 'null') {
      //     this.auiGrid.setCellValue(event.rowIndex, event.dataField, null);
      //   }
      // }
      this.$emit('cellEditEnd', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 행 인덱스
    // columnIndex : 칼럼 인덱스
    // oldValue : 변경 전 셀 값(value)
    // value : 변경 된 셀 값(value)
    // headerText : 현재 칼럼의 헤더 텍스트
    // item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
    // dataField : 행 아이템에서 현재 칼럼이 출력되고 있는 데이터의 KeyField
    // isClipboard : 붙여 넣기(Ctrl+V) 로 이벤트가 발생했는지 여부 (Boolean)
    // which : 편집 완료를 어떤 방식으로 수행 했는지에 대한 정보(String or Number)
    // return removeComma(event.value); // 사용자가 입력한 값에 컴마가 있으면 제거 후 적용
    cellEditEndBeforeHandler(event) {
      this.$emit('cellEditEndBefore', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 행 인덱스
    // columnIndex : 칼럼 인덱스
    // value : 셀에 출력되고 있는 값(value)
    // headerText : 현재 칼럼의 헤더 텍스트
    // item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
    // dataField : 행 아이템에서 현재 칼럼이 출력되고 있는 데이터의 KeyField
    cellLongTapHandler(event) {
      this.$emit('cellLongTap', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // property : 변경된 칼럼의 속성(columnIndex or width) (String)
    // dataField : 적용된 칼럼의 dataField 값 (String)
    // headerText : 적용된 칼럼의 헤더 텍스트 (String)
    // depth : 적용된 칼럼의 depth(계층형인 경우 유효) (Number)
    // isBranch : 적용된 칼럼이 브랜치 칼럼인지 여부(계층형인 경우 유효) (Boolean)
    // old : 바뀌기 전의 값 (Object)
    // current : 사용자에 의해 변경된 새로운 값(현재 값) (Object)
    columnStateChangeHandler(event) {
      this.$emit('columnStateChange', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // target : 헤더(header) 또는 바디(body) 에서 발생했는지를 나타냄
    // dataField : 컨텍스트 활성화 된 지점의 칼럼 데이터 필드명 (String)
    // headerText : 컨텍스트 활성화 된 지점의 칼럼 헤더 텍스트 (String)
    // columnIndex : 컨텍스트 활성화 된 지점의 칼럼 인덱스 (Number)
    // rowIndex : 바디 컨텍스트 활성화 된 지점의 행 인덱스 (target 값이 "body" 인 경우에만 유효) (Number)
    // depth : 헤더 컨텍스트 활성화 된 지점의 헤더 그룹핑 depth 값(target 값이 "header" 인 경우만 유효) (Number)
    // pageX : 컨텍스트 활성화 된 지점의 전역 좌표 X 값 (Number)
    // pageY : 컨텍스트 활성화 된 지점의 전역 좌표 Y 값 (Number)
    contextMenuHandler(event) {
      this.$emit('contextMenu', event);
    },
    // type : 이벤트 유형
    // pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
    // rowIndex : 드래깅 시작 행 인덱스
    // items : 드래깅 되는 행 아이템들 (Array)
    dragBeginHandler(event) {
      this.$emit('dragBegin', event);
    },
    /*
        type : 이벤트 유형
        pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
        pidToDrop : 드랍되는 그리드의 부모 DIV ID
        fromRowIndex : 드래깅된 시점의 행 인덱스
        toRowIndex : 드랍되는 그리드의 드랍 시점의 행 인덱스
        direction : 드래깅 시점에서 드랍되는 곳의 행 인덱스가 증가한 경우 true (Boolean)
        items : 드래깅되고 있으며 드랍될 행 아이템들 (Array)
    */
    dropCancelHandler(event) {
      this.$emit('dropCancel ', event);
    },
    /*
        type : 이벤트 유형
        pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
        pidToDrop : 드랍되는 그리드의 부모 DIV ID
        fromRowIndex : 드래깅된 시점의 행 인덱스
        toRowIndex : 드랍되는 그리드의 드랍 시점의 행 인덱스
        direction : 드래깅 시점에서 드랍되는 곳의 행 인덱스가 증가한 경우 true (Boolean)
        items : 드래깅되고 있으며 드랍될 행 아이템들 (Array)
    */
    dropEndHandler(event) {
      this.$emit('dropEnd', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          pidToDrop : 드랍되는 그리드의 부모 DIV ID
          fromRowIndex : 드래깅된 시점의 행 인덱스
          toRowIndex : 드랍되는 그리드의 드랍 시점의 행 인덱스
          direction : 드래깅 시점에서 드랍되는 곳의 행 인덱스가 증가한 경우 true (Boolean)
          items : 드래깅되고 있으며 드랍될 행 아이템들 (Array)
          isMoveMode : 드랍 액션이 이동인지 복사인지 결정지을 속성 (Boolean)
          // 이벤트의 isMoveMode 속성을 false 설정하면 행 복사를 합니다.
        */
    dropEndBeforeHandler(event) {
      this.$emit('dropEndBefore', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          filterCache : 현재 필터링 설정된 정보들 (Object)
    */
    filteringHandler(event) {
      this.$emit('filtering', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          footerIndex : 푸터 칼럼 인덱스
          footerText : 푸터 텍스트
          footerValue : 포매팅 전 푸터의 값
          pageX : 클릭이 발생한 지점의 전역 X 좌표 값
          pageY : 클릭이 발생한 지점의 전역 Y 좌표 값
      */
    footerClickHandler(event) {
      this.$emit('footerClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          footerIndex : 푸터 칼럼 인덱스
          footerText : 푸터 텍스트
          footerValue : 포매팅 전 푸터의 값
          pageX : 더블 클릭이 발생한 지점의 전역 X 좌표 값
          pageY : 더블 클릭이 발생한 지점의 전역 Y 좌표 값
      */
    footerDoubleClickHandler(event) {
      this.$emit('footerDoubleClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          groupingFields : 현재 그룹핑 된 그룹핑 필드들 (Array)
          groupingSummary : 그룹핑 썸머리를 설정한 경우 적용되는 썸머리 객체 (Object)
      */
    groupingHandler(event) {
      this.$emit('grouping', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          columnIndex : 헤더 칼럼 인덱스
          headerText : 헤더 텍스트
          depth : 헤더의 depth 즉, 헤더를 그룹핑으로 정의한 경우 최상위가 1depth (단일 계층인 경우 depth 는 1)
          item : 칼럼 레이아웃에서 정의한 자신 칼럼 아이템 객체 (Object)
          dataField : 현재 칼럼이 출력되고 있는 데이터의 KeyField
          pageX : 클릭이 발생한 지점의 전역 X 좌표 값
          pageY : 클릭이 발생한 지점의 전역 Y 좌표 값
          이벤트 핸들링 함수에서 false 를 반환하면 기본 행위를 하지 않음.
          return false; // 정렬 실행 안함.
      */
    headerClickHandler(event) {
      this.$emit('headerClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          position : 현재 스크롤의 위치 (Number)
          oldPosition : 변경 전 스크롤의 위치 (Number)
          minPosition : 수직 스크롤의 최대 위치 (Number)
          maxPosition : 수직 스크롤의 최소 위치 (Number)
      */
    hScrollChangeHandler(event) {
      this.$emit('hScrollChange', event);
    },
    /*
        type : 이벤트 유형
        pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
        keyCode : 키보드 누른 경우 해당 키코드 번호 (Number)
        ctrlKey : Ctrl 키 같이 눌렀는지 여부 (Boolean)
        shiftKey : Shift 키 같이 눌렀는지 여부 (Boolean)
        orgEvent : 자바스크립트의 오리지널 키보드 이벤트 객체 (Object)
      */
    keyDownHandler(event) {
      this.$emit('keyDown', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          term : 사용자가 찾고자 했던 문자열(String)
          wrapFound : wrapSearch 를 한 경우 한 바퀴 돌아 같은 행을 찾은 경우. 즉, 문자열에 해당되는 행이 단 1개 인 경우 true임
      */
    notFoundHandler(event) {
      this.$emit('notFound', event);
    },
    /*
        type : 이벤트 유형
        pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
        currentPage : 현재 페이지 번호
        oldPage : 변경 되기 전의 페이지 번호
        totalPageCount : 전체 페이지 수
    */
    pageChangeHandler(event) {
      this.$emit('pageChange', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          rowCount : 현재 1페이지에 출력되는 행의 개수
          oldRowCount : 이전의 1페이지에 출력되었던 행의 개수
          totalPageCount : 전체 페이지 개수
      */
    pageRowCountChangeHandler(event) {
      this.$emit('pageRowCountChange', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          clipboardData : 그리드에 붙여 넣기 한 클립보드의 값 (String)

          console.log("붙여 넣기 시작!!");
          console.log(event.clipboardData);
          // return false; // 붙여 넣기 안함(취소 시킴)

          // event.clipboardData 를 사용자가 파싱하여 2중 배열로 반환하면 해당 값을 그리드의 붙여넣기로 적용
          // 다음처럼 반환하면 4개의 셀에 대하여 1행에 각각 "a1", "a2" 그리고 2행에 "b1", "b2" 가 적용됩니다.
          // return [["a1", "a2"], ["b1", "b2"]];
      */
    pasteBeginHandler(event) {
      this.$emit('pasteBegin', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          clipboardData : 그리드에 붙여 넣기 된 데이터 (Array)

          AUIGrid.setSelectionByIndex(0, 0); // 0, 0 으로 선택자 이동시킴.
          console.log("붙여 넣기 완료!!");
      */
    pasteEndHandler(event) {
      this.$emit('pasteEnd', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
      */
    readyHandler(event) {
      this.$emit('ready', event);
    },
    /*
        type : 이벤트 유형
        pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
        dataFields : 삭제된 열의 dataField 묶음 (Array)
        */
    removeColumnHandler(event) {
      this.$emit('removeColumn', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          softRemoveRowMode : 소프트 제거 모드 사용 여부 즉, 그리드 상에 실제로 삭제가 됐는지 또는 마크 됐지는 여부
          items : 삭제된 행 아이템들 (Array)
      */
    removeRowHandler(event) {
      this.$emit('removeRow', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          items : 삭제된 행 아이템들 (Array)
      */
    removeSoftRowsHandler(event) {
      this.$emit('removeSoftRows', event);
    },
    /*
            [deprecated Ver 2.8] 이 이벤트는 event 객체가 아닌 checked 값 파라메터로 갖습니다. rowAllChkClick 이벤트를 사용하십시오.
            엑스트라 체크박스 칼럼에 있는 전체 선택 체크박스 클릭 시 발생합니다.
            이 이벤트를 핸들링하는 방법은 다음과 같습니다.
        */
    rowAllCheckClickHandler(event) {
      this.$emit('rowAllCheckClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          checked : 체크 유무 (Boolean)
      */
    rowAllChkClickHandler(event) {
      this.$emit('rowAllChkClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          checked : 체크 유무 (Boolean)
          rowIndex : 행 인덱스
          item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
      */
    rowCheckClickHandler(event) {
      this.$emit('rowCheckClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          rowNum : 행 번호 텍스트 값
          rowIndex : 행 인덱스
      */
    rowNumCellClickHandler(event) {
      this.$emit('rowNumCellClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          item : 해당 행의 아이템
          rowIndext : 해당 행의 인덱스
          marker : 해당 행의 편집 상태. 유효값은 다음과 같습니다.
          "added" : 클릭한 행 상태가 추가된 행 임을 의미합니다.
          "added-edited" : 클릭한 행 상태가 추가되고, 수정된 행 임을 의미합니다.
          "edited" : 클릭한 행 상태가 수정된 행 임을 의미합니다.
          "normal" : 클릭한 행 상태가 어떤 편electedRow집 행위도 이루어지지 않은 일반행 임을 의미합니다.
          "removed" : 클릭한 행 상태가 삭제된 행 임을 의미합니다.
      */
    rowStateCellClickHandler(event) {
      this.$emit('rowStateCellClick', event);
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          primeCell : 다수의 선택 셀 중 기본이 되는 주요 셀 정보 (Object) - Ver. 2.13 이상 사용 가능
          selectedItems : 선택된 아이템들을 요소로 갖는 배열(Array-Object)
      */
    selectionChangeHandler(event) {
      let selectedItems = event.selectedItems;
      if (selectedItems.length <= 0) return;

      let first = selectedItems[0];
      this.$emit('selectedRow', first.item, event.primeCell);
      this.$emit('update:selectedItem', first.item);
      // multipleRow인 경우  selectedRows로 rows 전달
      if (selectedItems.length >= 1) {
        // selectedItems 에서 row object에 해당하는 item만 뽑아서
        // 다시 배열로 만든다.
        let items = selectedItems.map(function (selected) {
          return selected.item;
        });
        this.$emit('selectedRows', items);
        this.$emit('update:selectedItems', items);
      }
    },
    /*
          type : 이벤트 유형
          pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
          sortingFields : 현재 정렬된 필드 및 정렬 방법들 (Array)
      */
    sortingHandler(event) {
      this.$emit('sorting', event);
    },
    /*
            type : 이벤트 유형
            pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
            rowIndex : 해당 아이템의 rowIndex
            depth : 트리 아이템의 depth 즉, 최상위 브랜치 아이템이 1 depth 이며 아래로 내려갈 수록 depth 1씩 증가함
            item : 열기/닫기의 대상이 된 브랜치(branch) 행 아이템 객체 (Object)
            response : 응답으로 설정할 함수(Function)
        */
    treeLazyRequestHandler(event) {
      this.$emit('treeLazyRequest', event);
    },
    /*
            type : 이벤트 유형
            pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
            isOpen : 현재 열린 상태인지 닫힌 상태인지 여부
            rowIndex : 해당 아이템의 rowIndex
            depth : 트리 아이템의 depth 즉, 최상위 브랜치 아이템이 1 depth 이며 아래로 내려갈 수록 depth 1씩 증가함
            item : 열기/닫기의 대상이 된 브랜치(branch) 행 아이템 객체 (Object)
        */
    treeOpenChangeHandler(event) {
      this.$emit('treeOpenChange', event);
    },
    /*
            type : 이벤트 유형
            pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
            action : 다시 실행, 실행 취소 등과 같이 어떤 행위로 인해 이 이벤트가 발생했는지 나태내며 다음과 같은 값을 갖습니다.
            "add" : 커맨드 스택에 새로운 커맨드가 추가됨
            "clear" : 커맨드 스택이 초기화 됨
            "redo" : 다시 실행이 행해짐
            "undo" : 실행 취소가 행해짐
            stackIndex : 커맨드 스택에서 현재 커맨드의 인덱스
            stackSize : 커맨드 스택의 총 길이
            redoable : 다시 실행(redo) 가능 여부
            undoable : 실행 취소(undo) 가능 여부
        */
    undoRedoChangeHandler(event) {
      this.$emit('undoRedoChange', event);
    },
    updateRowHandler(event) {
      /*
                type : 이벤트 유형
                pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
                rowIndex : 행 인덱스
                columnIndexes : 수정된 칼럼 인덱스들(배열)
                values : 수정된 값들(배열)
                headerTexts : 수정된 칼럼의 헤더 텍스트들(배열)
                item : 해당 행에 출력되고 있는 행 아이템 객체 (Object)
                dataFields : 행 아이템에서 수정된 칼럼이 출력되고 있는 데이터의 KeyField들(배열)
            */
      this.$emit('updateRow', event);
    },
    /*
                type : 이벤트 유형
                pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
                items : 변경된 행 아이템 객체 (Array-Object)
            */
    updateRowsHandler(event) {
      this.$emit('updateRows ', event);
    },
    /*
                type : 이벤트 유형
                pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
                position : 현재 스크롤의 위치 (Number)
                oldPosition : 변경 전 스크롤의 위치 (Number)
                minPosition : 수직 스크롤의 최대 위치 (Number)
                maxPosition : 수직 스크롤의 최소 위치 (Number)
            */
    vScrollChangeHandler(event) {
      this.$emit('vScrollChange', event);
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 rowIdField 를 이용해 특정 행에 체크를 표시합니다.
            반드시 rowIdField 속성 설정이 선행되어야 가능합니다.
            이 메소드는 기존에 체크된 항목에 누적해서 체크됩니다.
            파라메터 설명
            ids : (Array) 행의 rowId 값들을 요소로 갖는 배열
            참고 : 기존 체크 항목을 제거하고 새로 설정하는 값으로만 체크하고자 한다면 setCheckedRowsByIds 메소드를 사용하십시오.
        */
    addCheckedRowsByIds(ids) {
      return this.auiGrid.addCheckedRowsByIds(ids);
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 특정 행의 dataField 의 값과 일치하는 행에 체크를 표시합니다.
            이 메소드는 기존에 체크된 항목에 누적해서 체크됩니다.
            파라메터 설명
            dataField : (String) 행 아이템에서 체크하고자 하는 필드명
            values : (Array or String) 행 아이템에서 체크하고자 하는 필드의 값(value), 복수의 값을 체크하고자 한다면 배열로 설정(예: ["Anna", "Steve"])
            예를 들어 이름(name) 이 "Anna" 라는 사람을 기존에 누적해서 체크하고자 한다면 다음과 같습니다.
        */
    addCheckedRowsByValue(dataField, value) {
      return this.auiGrid.addCheckedRowsByValue(dataField, value);
    },
    /*
            그리드 열(column) 을 추가, 삽입합니다.
            추가 하는 열(column) 은 반드시 dataField 를 지정해야 하며, 해당 dataField 는 기존과 중복되지 않는 고유값이여야 합니다.
            그리드의 속성 editable 과 무관하게 이 메소드를 통해 열(column)을 추가할 수 있습니다.
            파라메터 설명
            columnObj (Object or Array) : 삽입하고자 하는 열 객체(columnm Object), 복수의 열을 삽입하고자 하는 경우 Object 를 배열로 묶으십시오.
            columnIndex (Number or String) : 삽입될 열의 인덱스, columnIndex 에 다음 문자를 설정한 경우.
            "first" : 맨처음, "last" : 맨끝, "selectionLeft" : 선택 열 왼쪽에, "selectionRight" : 선택 열 오른쪽에 추가 열이 삽입됩니다.
            var columnObj = { dataField : "myNumField1", dataType : "numeric", formatString : "#,##0" };
        */
    addColumn(cItems, position) {
      return this.auiGrid.addColumn(cItems, position);
    },
    /*
            그리드 행(row) 아이템을 추가, 삽입합니다.
            그리드의 속성 editable 과 무관하게 이 메소드를 통해 아이템을 추가할 수 있습니다.
            파라메터 설명
            items (Object or Array) : 삽입하고자 하는 행 아이템, 복수의 행을 삽입하고자 하는 경우 Object 를 배열로 묶으십시오.
            rowIndex (Number or String) : 삽입될 행의 인덱스, rowIndex 에 다음 문자를 설정한 경우.
            "first" : 첫 행, "last" : 최하단, "selectionUp" : 선택행 위, "selectionDown" : 선택행 아래에 추가행이 삽입됩니다.
            주의 : 복수의 행을 추가하기 위해 반복문 안에 addRow 메소드를 사용하지 마십시오.
            배열로 묶어 한번의 addRow 메소드로 처리하십시오.
            var items = [ {...}, {...}, ... ]; //복수의 Object
            예4 : AUIGrid.addRow(myGridID, items, "last"); // 배열로 묶어 한번의 다수의 행 추가.
            참고 : 일반 그리드의 행 추가입니다. 트리 그리드(계층형 그리드) 의 행 추가는 addTreeRow() 메소드를 참고하십시오.
        */
    addRow(items, rowIndex) {
      return this.auiGrid.addRow(items, rowIndex);
    },
    /*
            Type : Method   Version: 3.0
            그리드에서 특정 열(column)의 자식으로 열을 추가, 삽입합니다.
            추가 하는 열(column) 은 반드시 dataField 를 지정해야 하며, 해당 dataField 는 기존과 중복되지 않는 고유값이여야 합니다.
            그리드의 속성 editable 과 무관하게 이 메소드를 통해 열(column)을 추가할 수 있습니다.
            파라메터 설명
            columnObj (Object or Array) : 삽입하고자 하는 열 객체(columnm Object), 복수의 열을 삽입하고자 하는 경우 Object 를 배열로 묶으십시오.
            parentDataField (String) : 부모 dataField 명, 해당 dataField 의 자식으로 칼럼이 추가됩니다.
            columnIndex (Number or String) : 삽입될 열의 인덱스, columnIndex 에 다음 문자를 설정한 경우.
            "first" : 맨처음, "last" : 맨끝에 추가 열이 삽입됩니다.
        */
    addTreeColumn(cItems, parentDataField, position) {
      return this.auiGrid.addTreeColumn(cItems, parentDataField, position);
    },
    /*
            트리 그리드 행(row) 아이템을 추가, 삽입합니다. (그리드의 rowIdField 속성 설정 선행 필수)
            그리드의 속성 editable 과 무관하게 이 메소드를 통해 아이템을 추가할 수 있습니다.
            파라메터 설명
            items (Object or Array) : 삽입하고자 하는 행 아이템, 복수의 행을 삽입하고자 하는 경우 Object 를 배열로 묶으십시오.
            parentRowId (String) : 추가될 행의 부모 rowId 값.
            rowPosition (String) : 삽입될 행의 위치 값, 유효값은 다음과 같습니다.
            "first" : 첫 행, "last" : 최하단, "selectionUp" : 선택행 위, "selectionDown" : 선택행 아래에 추가행이 삽입됩니다.
        */
    addTreeRow(item, parentRowId, position) {
      return this.auiGrid.addTreeRow(item, parentRowId, position);
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 특정 행의 dataField 의 값과 일치하는 행에 체크 해제를 설정합니다.
            부분적으로 엑스트라 행 체크박스를 해제하고자 할 때 유용합니다.
            파라메터 설명
            dataField : (String) 행 아이템에서 체크 해제 하고자 하는 필드명
            values : (Array or String) 행 아이템에서 체크 해제 하고자 하는 필드의 값(value), 복수의 값을 체크하고자 한다면 배열로 설정(예: ["Anna", "Steve"])
        */
    addUncheckedRowsByIds(ids) {
      return this.auiGrid.addUncheckedRowsByIds(ids);
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 rowIdField 를 이용해 특정 행에 체크 해제를 설정합니다.
            반드시 rowIdField 속성 설정이 선행되어야 가능합니다.
            부분적으로 엑스트라 행 체크박스를 해제하고자 할 때 유용합니다.
            파라메터 설명
            ids : (Array) 행의 rowId 값들을 요소로 갖는 배열
        */
    addUncheckedRowsByValue(dataField, value) {
      return this.auiGrid.addUncheckedRowsByValue(dataField, value);
    },
    /*
            기존 그리드 데이터의 하단에 추가로 데이터를 붙입니다.
            파라메터 설명
            additionalData (Array) : 추가시키고자 하는 데이터
        */
    appendData(items) {
      return this.auiGrid.appendData(items);
    },
    /*
            그리드 이벤트를 핸들링하기 위해 이벤트를 바인딩하는 메소드입니다.
            파라메터 설명
            type : (String or Array) 바인딩하고자 하는 이벤트 유형
            function : (Function) 이벤트 핸들러 함수
            예를 들면 cellClick 이벤트를 핸들링하고 싶다면 다음과 같습니다.
            AUIGrid.bind(myGridID, "cellClick", function( event ) {
                alert("rowIndex : " + event.rowIndex + ", "columnIndex : " + event.columnIndex + " clicked");
            });

            // 복수의 이벤트를 한번에 핸들링 하기 (이벤트 유형을 배열로 설정)
            AUIGrid.bind(myGridID, ["cellClick", "headerClick", "footerClick"], function( event ) {
                if(event.type == "cellClick") alert("You clicked cell : " + event.value);
                else if(event.type == "headerClick") alert("You clicked header : " + event.headerText);
            });
        */
    bind(name, func) {
      if (this.auiGrid !== null) {
        this.auiGrid.bind(name, func);
      }
    },
    /*
            그리드의 칼럼 레이아웃(columnLayout) 을 변경합니다.
            최초에 출력된 그리드를 다른 칼럼 구조를 갖는 칼럼 레이아웃으로 변경합니다.
            파라메터 설명
            columnLayout : (Array-Object) 변경하고자 하는 새로운 칼럼 레이아웃
        */
    changeColumnLayout(columnLayout) {
      return this.auiGrid.changeColumnLayout(columnLayout);
    },
    /*
            그리드의 푸터 레이아웃(footerLayout) 을 변경합니다.
            최초에 출력된 그리드의 푸터를 다른 푸터로 변경합니다.
            파라메터 설명
            footerLayout : (Array-Object) 변경하고자 하는 새로운 푸터 레이아웃
        */
    changeFooterLayout(footerLayout) {
      return this.auiGrid.changeFooterLayout(footerLayout);
    },
    /*
            메뉴얼에 없네.. -_-
        */
    clearCellStyleAll() {
      this.auiGrid.clearCellStyleAll();
    },
    /*
            필터링이 설정되어 있다면 해당 칼럼의 필터링을 해제합니다.
            enableFilter 속성이 true 설정되어야 가능합니다.
            파라메터 설명
            dataField (String) : 칼럼이 출력하고 있는 데이터의 필드명
        */
    clearFilter(dataField) {
      return this.auiGrid.clearFilter(dataField);
    },
    /*
            모든 필터링을 해제합니다.
        */
    clearFilterAll() {
      this.auiGrid.clearFilterAll();
    },
    /*
            그리드 데이터를 모두 초기화하여 빈 그리드로 만듭니다.
        */
    clearGridData() {
      if (this.auiGrid !== null) {
        this.auiGrid.clearGridData();
        this.gridDataLen = 0;
      }
    },
    /*
            선택되어진 모든 아이템들을 초기화합니다.
        */
    clearSelection(mode) {
      this.auiGrid.clearSelection(mode);
    },
    /*
            정렬(Sorting)이 설정되어 있다면 모든 정렬을 초기화 합니다.
        */
    clearSortingAll() {
      this.auiGrid.clearSortingAll();
    },
    /*
            실행 취소(Undo), 다시 실행(Redo) 커맨드 스택을 초기화 합니다.
        */
    clearUndoRedoStack() {
      this.auiGrid.clearUndoRedoStack();
    },
    /*
            그리드 필터를 설정한 경우, 필터 레이어(필터 메뉴)가 오픈되어 있을 때 닫도록 지시합니다.
            // 필터 레이어(필터 메뉴)가 열린 경우 닫습니다.
            AUIGrid.closeFilterLayer(myGridID);
        */
    closeFilterLayer() {
      this.auiGrid.closeFilterLayer();
    },
    /*
            계층 구조 데이터 표현(트리 데이터)인 경우 모든 노드들을 닫고 최상위 Branch 만 표시합니다.
        */
    collapseAll() {
      this.auiGrid.collapseAll();
    },
    /*
            계층 구조 데이터 표현인 경우 모든 노드들을 열어 전체 펼치기를 실행합니다.
        */
    expandAll() {
      this.auiGrid.expandAll();
    },
    /*
            계층형 그리드(트리 그리드)인 경우 rowId 값에 맞는 아이템이 브랜치(branch)일 때 열기/닫기를 실행합니다.
            rowIdField 가 반드시 선행적으로 설정되어야 합니다.
            파라메터 설명
            rowIds (Array 또는 String) : rowId 값 (복수인 경우 Array 로 지정)
            open (Boolean) : 열기 할지 닫기 할지 여부(true 인 경우 열기 실행)
            recursive (Boolean) : 해당 아이템의 자손까지 모두 열지 여부
        */
    expandItemByRowId(rowId, open, recursive) {
      return this.auiGrid.expandItemByRowId(rowId, open, recursive);
    },
    exportAsCsv(props) {
      this.auiGrid.exportAsCsv(props);
    },
    exportAsJson(keyValueMode, props) {
      this.auiGrid.exportAsJson(keyValueMode, props);
    },
    exportAsObject(keyValueMode) {
      return this.auiGrid.exportAsObject(keyValueMode);
    },
    exportAsPdf(props) {
      this.auiGrid.exportAsPdf(props);
    },
    exportAsTxt(props) {
      this.auiGrid.exportAsTxt(props);
    },
    exportAsXlsx(exportWithStyle, props) {
      this.auiGrid.exportAsXlsx(exportWithStyle, props);
    },
    exportAsXml(props) {
      this.auiGrid.exportAsXml(props);
    },
    /*
            그리드에 출력된 현재 데이터를 다운로드 가능한 CSV 형태로 내보내기 합니다.
            파라메터 설명
            exportProps (Object) : 내보내기 할 때 파일명 등을 지정할 수 있는 파라메터입니다.
            ■ exportProps 파라메터 설명 ■
            exportProps 파라메터는 Object 로 그 요소는 다음과 같습니다.
            afterRequestCallback (Function) : 내보내기 후 호출될 콜백함수를 지정합니다.
            beforeRequestCallback (Function) : 내보내기 전 호출될 콜백함수를 지정합니다.
            fileName (String) : 내보내기 할 때 파일명을 지정하면 해당 파일명을 서버 사이드에서 파라메터로 받을 수 있습니다.
            postToServer (Boolean) : exportURL 속성에 지정한 URL (즉, 서버)로 작성된 데이터를 보낼지를 지정합니다.(기본값 : false, 단, IE <10 은 항상 true)
            progressBar (Boolean) : 내보내기 진행 상황을 퍼센티지로 보여줄지 여부를 나타냅니다.(기본값 : false)
        */

    exportToCsv(props) {
      this.auiGrid.exportToCsv(props);
    },
    /*
            그리드에 출력된 현재 데이터를 다운로드 가능한 JSON 형태로 내보내기 합니다.
            파라메터 설명
            exportProps (Object) : 내보내기 할 때 파일명 등을 지정할 수 있는 파라메터입니다.
            ■ exportProps 파라메터 설명 ■
            exportProps 파라메터는 Object 로 그 요소는 다음과 같습니다.
            afterRequestCallback (Function) : 내보내기 후 호출될 콜백함수를 지정합니다.
            beforeRequestCallback (Function) : 내보내기 전 호출될 콜백함수를 지정합니다.
            fileName (String) : 내보내기 할 때 파일명을 지정하면 해당 파일명을 서버 사이드에서 파라메터로 받을 수 있습니다.
            keyValueMode (Boolean) : 내보내기 할 때 Row 데이터를 칼럼 인덱스에 맞는 배열로 할 지 key-value 로 짝을 갖는 Object 요소 배열로 할지 여부를 나타냅니다.
            postToServer (Boolean) : exportURL 속성에 지정한 URL (즉, 서버)로 작성된 데이터를 보낼지를 지정합니다.(기본값 : false, 단, IE <10 은 항상 true)
        */

    exportToJson(keyValueMode, props) {
      this.auiGrid.exportToJson(keyValueMode, props);
    },
    /*
            그리드에 출력된 현재 데이터를 자바스크립트 Array-Object 로 내보내기 합니다.
            파라메터 설명
            keyValueMode (Boolean) : 내보내기 할 때 Row 데이터를 칼럼 인덱스에 맞는 배열로 할 지 key-value 로 짝을 갖는 Object 요소 배열로 할지 여부를 나타냅니다.
            keyValueMode 를 true 로 지정한 경우 한 행의 구조는 다음과 같습니다.
            [ {"name" : "Anna", "country" : "USA" .... } ]
            keyValueMode 를 false 로 지정한 경우 한 행의 구조는 다음과 같습니다.
            [ "Anna", "USA", .... ]
            Return : (Array) 그리드의 Array-Object 데이터
        */

    exportToObject(keyValueMode) {
      return this.auiGrid.exportToObject(keyValueMode);
    },
    /*
            그리드에 출력된 현재 데이터를 다운로드 가능한 PDF 로 내보내기 합니다.
            파라메터 설명
            exportProps (Object) : PDF로 내보내기 할 때 파일명, 상단, 하단 추가 텍스트를 지정할 수 있는 파라메터입니다.
            ■ exportProps 파라메터 작성 설명 ■
            exportProps 파라메터는 Object 로 그 요소는 다음과 같습니다.
            fontPath 는 반드시 지정해야 PDF 저장이 가능합니다.
            afterRequestCallback (Function) : 내보내기 후 호출될 콜백함수를 지정합니다.
            beforeRequestCallback (Function) : 내보내기 전 호출될 콜백함수를 지정합니다.
            fontPath (String) : PDF 파일 작성 시 사용할 글꼴(Font) URL 경로입니다.(필수)
            compress (Boolean) : PDF 파일 작성 시 압축을 할 지 여부를 지정합니다.(기본값: false)
            fileName (String) : PDF로 내보내기 할 때 파일명을 지정하면 해당 파일명을 서버 사이드에서 파라메터로 받을 수 있습니다.
            postToServer (Boolean) : exportURL 속성에 지정한 URL (즉, 서버)로 작성된 데이터를 보낼지를 지정합니다.(기본값 : false)
            headers (Array) : 그리드 상단에 표시할 추가 행들을 지정합니다. 제목이나 부제목과 같은 내용이 될 수 있습니다.
            footers (Array) : 그리드 하단에 표시할 추가 행들을 지정합니다.
            headers 와 footer 는 Array 이며 요소로는 Object 를 갖으며 개별 요소(1개의 Object)가 1행을 나타냅니다.
            Object 는 "text", "height", "style" 의 필드를 갖으며 다음은 이에 대한 설명입니다.
            text (String) : PDF에 표시할 텍스트입니다.
            height (Number) : PDF에서 행의 높이를 지정합니다.(px 단위, 실제 PDF는 pt 입니다. 그리드가 px 를 pt 로 변환하므로 px 단위로 지정하십시오.)
            style (Object) : 행의 스타일을 지정합니다. (유효값 : fontSize, textAlign, underline, background, color)
            종합하여 exportToPdf 메소드 사용 예는 다음과 같습니다.
            // PDF 내보내기 속성
            var exportProps = {
                    // 저장하기 파일명
                    fileName : "2013년_지역별_매출_내역(AUIGrid)",
                    // 헤더 내용
                    headers : [ {
                        text : "", height:20 // 첫행 빈줄
                    }, {
                        text : "2013년 지역별 매출 내역", height:24, style :
                            { fontSize:20, textAlign:"center", underline:true, background:"#DAD9FF"}
                    }, {
                        text : "작성자 : 에이유아이", style : { textAlign:"right"}
                    }, {
                        text : "작성일 : 2015. 03. 29", style : { textAlign:"right"}
                    }, {
                        text : "", height:5, style : { background:"#555555"} // 빈줄 색깔 경계 만듬
                    }],
                    // 푸터 내용
                    footers : [ {
                        text : "", height:5, style : { background:"#555555"} // 빈줄 색깔 경계 만듬
                    }, {
                        text : "참고 : 문의 사항은 전산팀으로 연락 하십시오.", style : { fontSize:15, color:"#2F9D27"}
                    }, {
                        text : "Copyright 2015 AUISoft", height:24, style :
                            { textAlign:"right", color:"#ffffff", background:"#222222"}
                    }]
            };
            // 내보내기 실행
            AUIGrid.exportToPdf(myGridID, exportProps);
        */

    exportToPdf(props) {
      this.auiGrid.exportToPdf(props);
    },
    /*
            그리드에 출력된 현재 데이터를 다운로드 가능한 TXT 형태로 내보내기 합니다.
            파라메터 설명
            exportProps (Object) : 내보내기 할 때 파일명 등을 지정할 수 있는 파라메터입니다.
            ■ exportProps 파라메터 설명 ■
            exportProps 파라메터는 Object 로 그 요소는 다음과 같습니다.
            afterRequestCallback (Function) : 내보내기 후 호출될 콜백함수를 지정합니다.
            beforeRequestCallback (Function) : 내보내기 전 호출될 콜백함수를 지정합니다.
            fileName (String) : 내보내기 할 때 파일명을 지정하면 해당 파일명을 서버 사이드에서 파라메터로 받을 수 있습니다.
            postToServer (Boolean) : exportURL 속성에 지정한 URL (즉, 서버)로 작성된 데이터를 보낼지를 지정합니다.(기본값 : false, 단, IE <10 은 항상 true)
            progressBar (Boolean) : 내보내기 진행 상황을 퍼센티지로 보여줄지 여부를 나타냅니다.(기본값 : false)
        */

    exportToTxt(props) {
      this.auiGrid.exportToTxt(props);
    },
    /*
            그리드에 출력된 현재 데이터를 다운로드 가능한 엑셀(xlsx) 로 내보내기 합니다.
            파라메터 설명
            exportProps (Object) : 엑셀로 내보내기 할 때 파일명, 상단, 하단 추가 텍스트를 지정할 수 있는 파라메터입니다.
            ■ exportProps 파라메터 작성 설명 ■
            exportProps 파라메터는 Object 로 그 요소는 다음과 같습니다.
            afterRequestCallback (Function) : 엑셀로 내보내기 후 호출될 콜백함수를 지정합니다.
            beforeRequestCallback (Function) : 엑셀로 내보내기 전 호출될 콜백함수를 지정합니다.
            compress (Boolean) : 엑셀 파일 작성 시 압축을 할 지 여부를 지정합니다.(기본값: false)
            exportWithStyle (Boolean) : 엑셀로 내보내기 할 때 스타일 정보(폰트 및 컬러 등)을 함께 내보내기 할지 여부를 나타냅니다. (단, IE8 의 경우 항상 false)
            fileName (String) : 엑셀로 내보내기 할 때 파일명을 지정하면 해당 파일명을 서버 사이드에서 파라메터로 받을 수 있습니다.
            fontFamily (String) : 엑셀로 저장 시 적용될 폰트명을 지정하십시오.(기본값: "맑은 고딕") 예를 들어 Arial 폰트로 적용하고자 한다면 "Arial" 로 설정하십시오.
            postToServer (Boolean) : exportURL 속성에 지정한 URL (즉, 서버)로 작성된 xlsx 데이터를 보낼지를 지정합니다.(기본값 : false, 단, IE <10 은 항상 true)
            progressBar (Boolean) : 내보내기 진행 상황을 퍼센티지로 보여줄지 여부를 나타냅니다.(기본값 : false)
            sheetName (String) : 엑셀로 내보내기 할 때 엑셀의 시트명을 지정합니다. (기본값 : Sheet 1)
            fixedColumnCount (Number) : 엑셀로 내보내기 할 때 엑셀 상의 틀고정 열(column)을 임의로 지정합니다.
            fixedRowCount (Number) : 엑셀로 내보내기 할 때 엑셀 상의 틀고정 행(row)을 임의로 지정합니다.
            headers (Array) : 그리드 상단에 표시할 추가 행들을 지정합니다. 제목이나 부제목과 같은 내용이 될 수 있습니다.
            footers (Array) : 그리드 하단에 표시할 추가 행들을 지정합니다.
            headers 와 footer 는 Array 이며 요소로는 Object 를 갖으며 개별 요소(1개의 Object)가 엑셀에서 1행을 나타냅니다.
            Object 는 "text", "height", "style" 의 필드를 갖으며 다음은 이에 대한 설명입니다.
            text (String) : 엑셀에 표시할 텍스트입니다.
            height (Number) : 엑셀에서 행의 높이를 지정합니다.(px 단위, 실제 엑셀은 pt 입니다. 그리드가 px 를 pt 로 변환하므로 px 단위로 지정하십시오.)
            style (Object) : 행의 스타일을 지정합니다. (유효값 : fontSize, textAlign, fontWeight, underline, background, color)
            종합하여 exportToXlsx 메소드 사용 예는 다음과 같습니다.
            // 엑셀 내보내기 속성
            var exportProps = {
                    // 저장하기 파일명
                    fileName : "2016년_지역별_매출_내역(AUIGrid)",
                    // 저장 할 때 dataField 가 name, product 인 칼럼들 저장에서 제외시킴.
                    // 헤더 내용
                    headers : [ {
                        text : "", height:20 // 첫행 빈줄
                    }, {
                        text : "2016년 지역별 매출 내역", height:24, style :
                            { fontSize:20, textAlign:"center", fontWeight:"bold", underline:true, background:"#DAD9FF"}
                    }, {
                        text : "작성자 : 에이유아이", style : { textAlign:"right"}
                    }, {
                        text : "작성일 : 2017. 03. 29", style : { textAlign:"right"}
                    }, {
                        text : "", height:5, style : { background:"#555555"} // 빈줄 색깔 경계 만듬
                    }],
                    // 푸터 내용
                    footers : [ {
                        text : "", height:5, style : { background:"#555555"} // 빈줄 색깔 경계 만듬
                    }, {
                        text : "참고 : 문의 사항은 전산팀으로 연락 하십시오.", style : { fontSize:15, color:"#2F9D27"}
                    }, {
                        text : "Copyright 2017 AUISoft", height:24, style :
                            { textAlign:"right", fontWeight:"bold", color:"#ffffff", background:"#222222"}
                    }]
            };
            // 내보내기 실행
            AUIGrid.exportToXlsx(myGridID, exportProps);
        */

    exportToXlsx(props) {
      // console.log('props', props);
      this.auiGrid.exportToXlsx(props);
    },
    /*
            그리드에 출력된 현재 데이터를 다운로드 가능한 XML 형태로 내보내기 합니다.
            파라메터 설명
            exportProps (Object) : 내보내기 할 때 파일명 등을 지정할 수 있는 파라메터입니다.
            ■ exportProps 파라메터 설명 ■
            exportProps 파라메터는 Object 로 그 요소는 다음과 같습니다.
            afterRequestCallback (Function) : 내보내기 후 호출될 콜백함수를 지정합니다.
            beforeRequestCallback (Function) : 내보내기 전 호출될 콜백함수를 지정합니다.
            fileName (String) : 내보내기 할 때 파일명을 지정하면 해당 파일명을 서버 사이드에서 파라메터로 받을 수 있습니다.
            postToServer (Boolean) : exportURL 속성에 지정한 URL (즉, 서버)로 작성된 데이터를 보낼지를 지정합니다.(기본값 : false, 단, IE <10 은 항상 true)
        */
    exportToXml(props) {
      this.auiGrid.exportToXml(props);
    },
    /*
            편집모드(editable=true)인 경우 해당 input 의 값을 강제적으로 편집 완료 또는 취소 상태로 만듭니다.
            이 메소드는 (더블)클릭 또는 F2 키 등과 같이 편집 진입한 상태인 경우에만 유효합니다.
            사용자 정의 편집 렌더러(customEditRenderer) 를 사용했을 때 편집 렌더러의 값을 강제적으로 완료 또는 취소로 만들고자 한다면 이 메소드를 사용하세요.
            현재 편집 인풋터(inputer)에 있는 값으로 편집 완료 상태로 만들고자 한다면 value 를 null 로 설정하십시오.
            파라메터 설명
            value (Object) : 설정하고자 하는 값
            cancel (Boolean) : 이 값이 true 라면 에디팅 취소(cancel) 가 적용됩니다.
        */
    forceEditingComplete(value, cancel) {
      return this.auiGrid.forceEditingComplete(value, cancel);
    },
    getActiveGrid() {
      return this.auiGrid.getActiveGrid();
    },
    /*
            그리드에서 추가된 열(column) 의 dataField 들의 묶음(배열)을 반환합니다.
            사용자가 임의로 열을 추가한 후, 다시 삭제하였다면 추가된 열에 포함되지 않습니다.
            Return : (Array) 추가된 열의 dataField 들
        */

    getAddedColumnFields() {
      return this.auiGrid.getAddedColumnFields();
    },
    /*
            그리드에서 추가된 아이템들의 묶음(배열)을 반환합니다.
            Return : (Array) 추가된 행 아이템들
        */
    getAddedRowItems() {
      return this.auiGrid.getAddedRowItems();
    },
    /*
            트리 그리드(계층형 그리드)에서 rowId 에 해당되는 모든 조상(ascendants) 행 아이템을 찾아 배열로 반환합니다.(rowIdField 속성 설정 필수)
            파라메터 설명
            rowId : (String) 행 아이템의 rowId 값
            Return : (Array) 주어진 rowId 에 따른 모든 조상 행 아이템들
        */
    getAscendantsByRowId(rowId) {
      return this.auiGrid.getAscendantsByRowId(rowId);
    },
    /*
            그리드의 특정 셀의 포매팅된 값을 반환합니다.
            파라메터 설명
            rowIndex (Number) : 얻고자하는 행 인덱스
            dataField or columnIndex(String or Number) : 얻고자 하는 칼럼의 dataField 또는 칼럼 인덱스
            // 0번째 행의 price 칼럼의 포매팅된 값 얻기
            var myValue = AUIGrid.getCellFormatValue(myGridID, 0, "price");
            // 3번째 행의 1 번째 칼럼 즉, (3, 1) 의 셀의 포매팅된 값 얻기
            var myValue = AUIGrid.getCellFormatValue(myGridID, 3, 1);
            Return : 선택 셀 포매팅된 값
            참고 : getCellValue 과 getCellFormatValue 의 차이는 값의 포매팅 여부 입니다.
            예를 들어 칼럼에 labelFunction 이나 formatString 으로 값의 출력 형식을 변경했을 때,
            getCellValue 는 원래 값이 반환되고, getCellFormatValue 는 labelFunction 또는 formatString 이 적용된 값을 반환합니다.
        */
    getCellFormatValue(rowIndex, dataField) {
      return this.auiGrid.getCellFormatValue(rowIndex, dataField);
    },
    getCellFormattedValue(rowIndex, dataField) {
      return this.auiGrid.getCellFormattedValue(rowIndex, dataField);
    },
    /*
            그리드의 특정 셀의 값을 반환합니다.
            파라메터 설명
            rowIndex (Number) : 얻고자하는 행 인덱스
            dataField or columnIndex(String or Number) : 얻고자 하는 칼럼의 dataField 또는 칼럼 인덱스
            Return : 선택 셀 값
            // 0번째 행의 name 칼럼의 값 얻기
            var myValue = AUIGrid.getCellValue(myGridID, 0, "name");
            // 3번째 행의 1 번째 칼럼 즉, (3, 1) 의 셀의 값 얻기
            var myValue = AUIGrid.getCellValue(myGridID, 3, 1);
            참고 : getCellValue 과 getCellFormatValue 의 차이는 값의 포매팅 여부 입니다.
            예를 들어 칼럼에 labelFunction 이나 formatString 으로 값의 출력 형식을 변경했을 때
            getCellValue 는 원래 값이 반환되고, getCellFormatValue 는 labelFunction 또는 formatString 이 적용된 값을 반환합니다.
        */
    getCellValue(rowIndex, dataField) {
      return this.auiGrid.getCellValue(rowIndex, dataField);
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 체크박스로 체크된 모든 행의 아이템과 행인덱스를 갖는 배열을 반환 합니다.
            Return : (Array) 체크된 행 아이템 및 행 인덱스 배열
        */
    getCheckedRowItems() {
      return this.auiGrid.getCheckedRowItems();
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 체크박스로 체크된 모든 행의 아이템을 반환합니다.
            이 메소드는 순수 행 아이템을 요소로 갖는 배열을 반환합니다.
            즉, getCheckedRowItems 메소드는 행 아이템과 행인덱스 배열을 반환하지만 이 메소드는 순수 행 아이템을 요소로 갖는 배열을 반환합니다.
            트리 그리드인 경우, 체크된 행이 부모의 열기/닫기로 인해 숨겨진 경우 getCheckedRowItems() 는 숨겨진 행 아이템을 반환하지 않습니다.
            트리 그리드에서 숨겨진 행 아이템들도 얻고자 하는 경우 getCheckedRowItemsAll() 를 사용하십시오.
            Return : (Array) 체크된 행 아이템 배열
        */
    getCheckedRowItemsAll() {
      return this.auiGrid.getCheckedRowItemsAll();
    },
    /*
            현재 그리드에서 출력하고 있는 전체 열(columns)의 개수를 반환합니다.
            Return : (Number) 전체 열(columns) 수
        */
    getColumnCount() {
      return this.auiGrid.getColumnCount();
    },
    /*
        그리드의 칼럼이 출력하는 모든 값들을 반환하되 중복된 값을 제거하고 반환합니다.
        참고 : getColumnDistinctValues 메소드는 중복을 제거한 값을 반환하는 반면 getColumnValues 메소드는 모든 값을 반환합니다.
        파라메터 설명
        dataField : (String) 칼럼의 dataField 명
        total : (Boolean) 그리드의 원래 데이터를 대상으로 할지 여부. 즉, 필터링이 된 경우 필터링 된 상태의 값만 원한다면 false 지정
        Return : (Array) 해당 칼럼이 출력하고 있는 모든 값들(중복된 값이 제거된 고유값들만 반환)
        */
    getColumnDistinctValues(dataField, total) {
      return this.auiGrid.getColumnDistinctValues(dataField, total);
    },
    /*
            데이터 필드에 맞는 현재 그리드의 칼럼인덱스를 반환합니다.
            파라메터 설명
            dataField : (String) 데이터 필드명
            Return : (Number) 칼럼인덱스
        */
    getColumnIndexByDataField(dataField) {
      return this.auiGrid.getColumnIndexByDataField(dataField);
    },
    /*
            그리드에 출력된 칼럼 정보를 갖는 1차원 배열을 반환합니다.
            만약 칼럼 레이아웃을 그룹형(계층형)으로 설정한 경우 이 메소드의 반환 값은 최하위 자식들의 정보만을 담은 배열입니다.
            그룹형이 아닌 경우, 이 반환값은 getColumnLayout() 메소드의 값과 같습니다.
            Return : (Array) 현재 그리드 칼럼 레이아웃
        */
    getColumnInfoList() {
      return this.auiGrid.getColumnInfoList();
    },
    /*
            데이터 필드(dataField)에 맞는 칼럼 레이아웃의 칼럼 객체를 반환합니다.
            파라메터 설명
            dataField : (String) 컬럼이 출력하고 있는 데이터필드명
            Return : (Object) 칼럼 레이아웃의 칼럼 객체
        */
    getColumnItemByDataField(dataField) {
      return this.auiGrid.getColumnItemByDataField(dataField);
    },
    /*
            그리드에 출력된 현재 칼럼 레이아웃을 반환합니다.
            Return : (Array) 현재 그리드 칼럼 레이아웃
        */
    getColumnLayout() {
      return this.auiGrid.getColumnLayout();
    },
    /*
            그리드의 칼럼이 출력하는 모든 값들을 반환합니다.
            참고 : getColumnDistinctValues 메소드는 중복을 제거한 값을 반환하는 반면 getColumnValues 메소드는 모든 값을 반환합니다.
            파라메터 설명
            dataField : (String) 칼럼의 dataField 명
            total : (Boolean) 그리드의 원래 데이터를 대상으로 할지 여부. 즉, 필터링이 된 경우 필터링 된 상태의 값만 원한다면 false 지정
            Return : (Array) 해당 칼럼이 출력하고 있는 모든 값들
        */
    getColumnValues(dataField, total) {
      return this.auiGrid.getColumnValues(dataField, total);
    },
    getCreatedGridAll() {
      return this.auiGrid.getCreatedGridAll();
    },
    /*
            현재 그리드의 칼럼인덱스에 출력 중인 데이터필드(dataField)를 반환합니다.
            파라메터 설명
            columnIndex : (Number) 칼럼 인덱스
            Return : (String) 데이터 필드명
        */
    getDataFieldByColumnIndex(idx) {
      return this.auiGrid.getDataFieldByColumnIndex(idx);
    },
    /*
            계층형 그리드(트리 그리드)인 경우 rowId 값에 맞는 행 아이템의 depth를 반환합니다.
            깊이(depth) 는 최상위가 1에 해당되며 하위로 갈수록 1씩 증가합니다.
            rowIdField 가 반드시 선행적으로 설정되어야 합니다.
            파라메터 설명
            rowId (String) : rowId 값
            Return : (Number) 계층구조에서 depth
        */
    getDepthByRowId(rowId) {
      return this.auiGrid.getDepthByRowId(rowId);
    },
    /*
            트리 그리드(계층형 그리드)에서 rowId 에 해당되는 모든 자손(descendants) 행 아이템을 찾아 배열로 반환합니다.(rowIdField 속성 설정 필수)
            파라메터 설명
            rowId : (String) 행 아이템의 rowId 값
            Return : (Array) 주어진 rowId 에 따른 모든 자손 행 아이템들
        */
    getDescendantsByRowId(rowId) {
      return this.auiGrid.getDescendantsByRowId(rowId);
    },
    /*
            그리드에서 수정된 아이템들의 묶음(배열)을 반환합니다.
            getEditedRowItems() 과 다르게 이 메소드는 행 아이템 전체를 반환하지 않습니다. 예를들어 칼럼이 총 10개 있다고 했을 때 그 중 2개 칼럼만 수정했다면 해당 2개 칼럼만을 반환합니다.
            행 아이템 전체를 얻고자 한다면 getEditedRowItems() 메소드를, 행에서 진짜로 수정된 칼럼들만 얻고자 한다면 이 메소드를 사용하십시오.
            수정된 아이템은 최초의 데이터에서 addRow 메소드로 추가된 아이템을 수정한 경우 포함되지 않습니다.
            addRow 메소드로 추가된 아이템은 수정했더라도 최종적으로 추가된 아이템에 해당되기 때문입니다.(getAddedRowItems으로 확인 가능)
            Return : (Array) 수정된 행 아이템들
        */
    getEditedRowColumnItems() {
      return this.auiGrid.getEditedRowColumnItems();
    },
    /*
            그리드에서 수정된 아이템들의 묶음(배열)을 반환합니다.
            수정된 아이템은 최초의 데이터에서 addRow 메소드로 추가된 아이템을 수정한 경우 포함되지 않습니다.
            addRow 메소드로 추가된 아이템은 수정했더라도 최종적으로 추가된 아이템에 해당되기 때문입니다.(getAddedRowItems으로 확인 가능)
            Return : (Array) 수정된 행 아이템들
        */
    getEditedRowItems() {
      return this.auiGrid.getEditedRowItems();
    },
    /*
            현재 출력된 헤더 텍스트를 모함하여 모든 셀들의 길이를 조사하여 최적의 칼럼 사이즈를 배열 형태로 반환합니다.
            파라메터 설명
            fitToGrid (Boolean) : 모든 칼럼 사이즈들의 총합이 그리드 전체 크기보다 작은 경우 그리드 크기에 맞출지 여부를 지정합니다. (기본값: false)
            Return : (Array) 모든 칼럼들의 크기를 담은 배열
            참고 : getFitColumnSizeList 메소드로 얻은 값을 setColumnSizeList 메소드로 활용하십시오.
        */
    getFitColumnSizeList(fitToGrid) {
      return this.auiGrid.getFitColumnSizeList(fitToGrid);
    },
    /*
            현재 그리드에 출력된 푸터 데이터를 반환합니다.
            반환형은 Object 를 요소로 갖는 배열입니다.
            개별 Object 는 다음과 같은 key-value 로 이루어집니다.
            index : 출력된 값의 칼럼 인덱스 값 ("#base" 로 행 번호 칼럼에 출력된 푸터 값은 index 가 -1입니다.)
            value : 푸터의 값이 포매팅 전의 순수 값 (labelFunction 으로 사용자가 임의 지정한 경우 value 는 text 와 같습니다.)
            text : 실제로 푸터의 셀에 출력된 포매팅 된 값
            Return : (Array) 출력된 푸터 데이터
        */
    getFooterData() {
      return this.auiGrid.getFooterData();
    },
    getFooterFormatValueByDataField(posField) {
      return this.auiGrid.getFooterFormatValueByDataField(posField);
    },
    /*
            사용자가 설정한 푸터 객체(푸터 레이아웃) 을 반환합니다.
            즉, AUIGrid.setFooter() 메소드로 삽입한 푸터 객체를 반환합니다.
            Return : (Array) 사용자가 설정한 푸터 객체(푸터 레이아웃)
        */

    getFooterLayout() {
      return this.auiGrid.getFooterLayout();
    },
    getFooterValueByDataField(posField) {
      return this.auiGrid.getFooterValueByDataField(posField);
    },
    /*
            그리드에 출력된 현재 데이터를 반환합니다.
            필터링, 정렬 등으로 현재 그리드에 보여지는 데이터가 변했다면, 그 상태의 모습 그대로를 반환합니다.
            필터링, 정렬 등으로 변한 데이터가 아닌 전체 데이터를 얻고자 한다면 getOrgGridData 메소드를 사용하십시오.
            Return : (Array) 현재 그리드 행 아이템들
        */
    getGridData() {
      return this.auiGrid.getGridData();
    },
    /*
            현재 그리드에서 숨겨진 칼럼(hidden Columns)이 있는 경우 숨겨진 칼럼들의 모든 dataField 를 반환합니다.
            Return : (Array) 숨겨진 칼럼(hidden Columns)들의 dataField 를 담은 배열
        */
    getHiddenColumnDataFields() {
      return this.auiGrid.getHiddenColumnDataFields();
    },
    /*
            현재 그리드에서 숨겨진 칼럼(hidden Columns)이 있는 경우 숨겨진 칼럼들의 칼럼 인덱스(columnIndex) 를 반환합니다.
            Return : (Array) 숨겨진 칼럼(hidden Columns)들의 칼럼 인덱스를 담은 배열
        */
    getHiddenColumnIndexes() {
      return this.auiGrid.getHiddenColumnIndexes();
    },
    /*
            특정 셀(rowId 에 맞는 행, dataField 에 맞는 열 부합하는 셀)이 수정된 경우 최초의 그리드 셀 값을 반환합니다.
            즉, 수정되기 전 원래의 셀 값을 반환합니다.
            파라메터 설명
            rowId : (String) 행 아이템의 rowId 값
            dataField : (String) 열의 dataField
            Return : (String or Object) 변경 전 원래 셀의 값
            // "#Cust1" 이 행의 ID 이고, 데이터 필드명이 "name" 인 열인 셀의 원래 값 반환
            var orgValue = AUIGrid.getInitCellValue(myGridID, "#Cust1", "name");
        */
    getInitCellValue(rowId, dataField) {
      return this.auiGrid.getInitCellValue(rowId, dataField);
    },
    /*
            그리드 행이 수정된 경우 최초의 그리드 행 아이템을 반환합니다. 즉, 수정되기 전 원래의 값을 갖는 행 아이템을 반환합니다.
            파라메터 설명
            rowId : (String or Array) 행 아이템의 rowId 값
            Return : (Object or Array) 수정 전의 행 아이템(들), 만약 해당 행이 수정되지 않았다면 null 반환
            // rowId 가 "#Cust0" 인 행의 원본 행 아이템 반환
            if(AUIGrid.isEditedById(myGridID, "#Cust0")) { // 먼저 수정되었는지 체크
                var orgItem = AUIGrid.getInitValueItem(myGridID, "#Cust0");
            }
            // rowId 가 "#Cust0", "#Cust1"인 행들의 원본 행 아이템들 반환 - 복수 사용 예
            var orgItems = AUIGrid.getInitValueItem(myGridID, ["#Cust0", "#Cust1"]);
        */
    getInitValueItem(rowId) {
      return this.auiGrid.getInitValueItem(rowId);
    },
    /*
            rowId 에 맞는 행 아이템을 반환합니다.
            이 메소드를 사용하기 위해서는 rowIdField 속성이 선행적으로 설정되어야 합니다.
            파라메터 설명
            rowIdValue (String) : rowIdField 에 맞는 값
            Return : (Object) 행아이템 객체
        */
    getItemByRowId(rowIdValue) {
      return this.auiGrid.getItemByRowId(rowIdValue);
    },
    /*
            행 인덱스에 맞는 행 아이템을 반환합니다.
            파라메터 설명
            rowIndex (Number) : 행인덱스
            Return : (Object) 행아이템 객체
        */
    getItemByRowIndex(rowIndex) {
      return this.auiGrid.getItemByRowIndex(rowIndex);
    },
    /*
            특정 value 에 맞는 행 아이템을 반환합니다.
            파라메터 설명
            dataField : (String) 행 아이템에서 얻고자하는 필드명
            value : (String) 행 아이템에서 얻고자 하는 필드의 값(value)
            예를 들어 이름(name) 이 "Anna" 라는 사람의 행 아이템을 얻고자 한다면 다음과 같습니다.
            var rowItems = AUIGrid.getItemsByValue(myGridID, "name", "Anna");
            Return : (Array) 조건에 맞는 행 아이템 묶음
            참고 : 복수의 값 즉, 이름이 "Anna", "Emma" 등의 복수 값에 대한 행 아이템을 얻고자 한다면 getRowsByValue 메소드를 사용하십시오.
        */
    getItemsByValue(dataField, value) {
      return this.auiGrid.getItemsByValue(dataField, value);
    },
    getMergeEndRowIndex(rowIndex, columnIndex) {
      return this.auiGrid.getMergeEndRowIndex(rowIndex, columnIndex);
    },
    getMergeStartRowIndex(rowIndex, columnIndex) {
      return this.auiGrid.getMergeStartRowIndex(rowIndex, columnIndex);
    },
    /*
            [deprecated Ver 3.0.4] 수정되기 전의 셀 값을 반환합니다.
        */
    getOrgCellValue(uid, dataField) {
      return this.auiGrid.getOrgCellValue(uid, dataField);
    },
    /*
            그리드의 데이터를 반환합니다.
            이 메소드는 필터링, 정렬 등으로 현재 그리드에 보여지는 데이터가 아닌 전체 데이터를 반환합니다.
            현재 보여지는 데이터를 얻고자 한다면 getGridData 메소드를 사용하십시오.
            Return : (Array) 현재 그리드 행 아이템들
        */
    getOrgGridData() {
      return this.auiGrid.getOrgGridData();
    },
    /*
            [deprecated Ver 3.0.4] 수정되기 전 원래의 값을 갖는 행 아이템을 반환합니다.
        */
    getOrgValueItem(uids) {
      return this.auiGrid.getOrgValueItem(uids);
    },
    /*
            계층형 그리드(트리 그리드)인 경우 rowId 값에 맞는 행 아이템의 부모 행 아이템을 찾아 반환합니다.
            즉, rowId 의 부모 아이템을 반환합니다.
            부모 아이템이 없는 루트(root)에 해당되는 행인 경우 null 을 반환합니다.
            rowIdField 가 반드시 선행적으로 설정되어야 합니다.
            파라메터 설명
            rowId (String) : rowId 값
            Return : (Object) 부모 행 아이템
        */
    getParentItemByRowId(rowId) {
      return this.auiGrid.getParentItemByRowId(rowId);
    },
    /*
            그리드 속성의 값을 반환합니다.
            파라메터 설명
            name (String) : 속성명
            Return : (Object) 속성값
        */
    getProp(name) {
      return this.auiGrid.getProp(name);
    },
    getProperty(name) {
      return this.auiGrid.getProperty(name);
    },
    /*
            그리드에서 삭제된 열(column) 의 dataField 들의 묶음(배열)을 반환합니다.
            삭제된 열이란 최초 칼럼 레이아웃 작성 시 정의한 칼럼을 삭제 한 것을 말합니다.
            즉, 사용자가 임의로 추가한 후 삭제하였다면 삭제된 열에 포함되지 않습니다.
            Return : (Array) 삭제된 열의 dataField 들
        */
    getRemovedColumnFields() {
      return this.auiGrid.getRemovedColumnFields();
    },
    /*
            그리드에서 삭제된 아이템들의 묶음(배열)을 반환합니다.
            기본적으로, 삭제된 아이템은 최초의 데이터에서 addRow 메소드로 추가된 아이템을 삭제한 경우 포함되지 않습니다.
            즉, 최초 그리드에 삽입된 데이터를 삭제한 행 아이템만 반환합니다.
            만약, 추가된 행을 삭제 했을 때 그 추가된 행까지 얻고자 한다면 includeAdded 파라메터를 true 로 설정하십시오.
            파라메터 설명
            includeAdded (Boolean) : 최초의 데이터에서 사용자에 의해 추가된 행을 다시 사용자가 삭제한 경우, 해당 아이템까지 반환 여부
            Return : (Array) 삭제된 행 아이템들
        */
    getRemovedItems(includeAdded) {
      return this.auiGrid.getRemovedItems(includeAdded);
    },
    /*
            그리드에서 사용자에 의해 추가되어 다시 삭제된 아이템들의 묶음(배열)을 반환합니다.
            즉, 최초 그리드에 삽입된 데이터가 아닌 addRow 메소드나 Insert 키와 같은 방식으로 최초 이후 추가된 행이 삭제된 경우 그 행 아이템들만 반환합니다.
            Return : (Array) 추가된 후 삭제된 행 아이템들
        */
    getRemovedNewItems() {
      return this.auiGrid.getRemovedNewItems();
    },
    /*
            현재 그리드에서 출력하고 있는 전체 행의 개수를 반환합니다.
            만약 트리 그리드로 출력하고 있을 때 접혀진 브랜치(branch) 행 그대로 개수를 반환합니다. 예를 들어 브랜치 행이 모두 닫혀져 3개만 보이고 있을 때 3이 반환됩니다.
            Return : (Number) 전체 행 수
        */
    getRowCount() {
      return this.auiGrid.getRowCount();
    },
    /*
            특정 칼럼의 값과 일치하는 값이 있는 행을 모두 찾아 행인덱스(rowIndex)를 반환합니다.
            파라메터 설명
            dataField : (String) 찾고자 하는 칼럼의 dataField 명
            values : (String or Array) dataField 에서 찾고자 하는 값( 복수의 값인 경우 Array )
            예를 들어 "이름이 Anna, Lawrence 인 사람의 행 인덱스 모두 반환" 하고자 한다면 다음과 같습니다.
            var rows = AUIGrid.getRowIndexesByValue(myGridID, "name", ["Anna", "Lawrence"]);
            Return : (Array) 해당 dataField 에서 주어진 값(values) 와 일치하는 모든 행 아이템들의 rowIndex
            참고 : 행 아이템을 얻고자 한다면 getRowsByValue 메소드 참고
        */
    getRowIndexesByValue(dataField, values) {
      return this.auiGrid.getRowIndexesByValue(dataField, values);
    },
    /*
            수직 스크롤이 생성된 경우 현재 그리드가 출력되고 있는 행의 최상단 인덱스를 반환합니다.
            즉, 스크롤에 의해 현재 보여지고 있는 아이템들의 최상단 행의 인덱스를 반환합니다.
            수직 스크롤이 생성되지 않은 경우 이 값은 0 을 반환합니다.
            Return : (Number) 최상단 행 인덱스
        */
    getRowPosition() {
      return this.auiGrid.getRowPosition();
    },
    /*
            특정 칼럼의 값과 일치하는 값이 있는 행을 모두 찾아 반환합니다.
            파라메터 설명
            dataField : (String) 찾고자 하는 칼럼의 dataField 명
            values : (String or Array) dataField 에서 찾고자 하는 값( 복수의 값인 경우 Array )
            예를 들어 "이름이 Anna, Lawrence 인 사람의 행 아이템 모두 반환" 하고자 한다면 다음과 같습니다.
            var rows = AUIGrid.getRowsByValue(myGridID, "name", ["Anna", "Lawrence"]);
            Return : (Array) 해당 dataField 에서 주어진 값(values) 와 일치하는 모든 행 아이템들
            참고 : 행인덱스을 얻고자 한다면 getRowIndexesByValue 메소드 참고
        */
    getRowsByValue(dataField, values) {
      return this.auiGrid.getRowsByValue(dataField, values);
    },
    /*
            선택 모드가 "none" 이 아닌 경우 현재 선택된 아이템의 rowIndex, columnIndex 를 반환합니다.
            다수의 셀 또는 행을 선택한 경우 첫번째 선택된 셀 또는 행의 rowIndex, columnIndex 를 반환합니다.
            선택된 모든 셀 또는 행을 얻고자 한다면 getSelectedItems() 메소드를 사용하십시오.
            rowIndex 는 반환값의 0 번째, columnIndex 는 반환값의 1 번째 요소입니다.
            Return : (Array) rowIndex, columnIndex 를 갖는 배열(배열 요소 2개임 0번째는 rowIndex, 1번째는 columnIndex)
        */
    getSelectedIndex() {
      return this.auiGrid.getSelectedIndex();
    },
    /*
            선택모드(selectionMode)가 "none" 이 아닌 경우 현재 선택된 모든 셀(또는 행) 아이템을 반환합니다.
            반환값은 배열로 개별 배열 요소는 다음과 같은 요소를 갖는 Object 입니다.
            rowIndex : 행의 인덱스
            columnIndex : 칼럼의 인덱스
            dataField : 선택 칼럼이 출력하고 있는 그리드 데이터의 필드명
            headerText : 선택 칼럼의 헤더 텍스트
            editable : 선택 칼럼의 수정 가능 여부
            value : 선택 셀의 현재 그리드 값
            item : 선택 행 아이템들을 갖는 Object
            사용 예는 다음과 같습니다.
            var selectedItems = AUIGrid.getSelectedItems(myGridID);
            if(selectedItems.length <= 0) return;
            // singleRow, singleCell 이 아닌 multiple 인 경우 선택된 개수 만큼 배열의 요소가 있음
            var first = selectedItems[0];

            // first 의 값을 보고자 한다면? first.value
            // first 의 행, 칼럼 인덱스를 보고자 한다면? first.rowIndex, first.columnIndex
            // first 의 행 아이템 전체를 보고자 한다면? first.item
            console.log(first);
            alert( JSON.stringify(first) );
            Return : (Array) 선택된 아이템들을 요소로 갖는 배열
        */
    getSelectedItems() {
      return this.auiGrid.getSelectedItems();
    },
    getSelectedRows() {
      return this.auiGrid.getSelectedRows();
    },
    /*
            그리드 선택 셀의 값을 텍스트로 반환합니다.
            다수의 셀이 선택된 경우 행, 열에 구분은 탭(\t)과 캐리지 리턴(\r\n) 으로 구분된 텍스트를 반환합니다.
            Return : (String) 선택 셀 값 텍스트
        */
    getSelectedText() {
      return this.auiGrid.getSelectedText();
    },
    /*
            트리 그리드의 계층적 구조를 갖는 데이터의 자손행들까지 포함하여 모두 1차원 배열 형태로 반환합니다.
            Return : (Array) 전체 행 아이템들
        */
    getTreeFlatData() {
      return this.auiGrid.getTreeFlatData();
    },
    /*
            트리 그리드의 계층적 구조를 갖는 데이터를 반환합니다.
            필터링, 정렬 등으로 현재 그리드에 보여지는 데이터가 변했다면, 그 상태의 모습 그대로를 반환합니다.
            필터링, 정렬 등으로 변한 데이터가 아닌 전체 데이터를 얻고자 한다면 getOrgGridData 메소드를 사용하십시오.
            Return : (Array) 계층적 구조 행 아이템들
        */
    getTreeGridData() {
      return this.auiGrid.getTreeGridData();
    },
    /*
            트리 그리드 또는 그룹형으로 계층형으로 만든 경우 계층형 데이터의 전체 depth 를 반환합니다.
            Return : (Number) 전체 depth
        */
    getTreeTotalDepth() {
      return this.auiGrid.getTreeTotalDepth();
    },
    /*
            주어진 파라메터(dataField)에 맞게 출력된 그리드 칼럼을 보이지 않도록 지정합니다.
            복수의 칼럼을 보이지 않도록 지정하고자 한다면 배열로 설정하십시오. (예: ["name", "country", "product"] )
            파라메터 설명
            dataField (String or Array) : 칼럼의 데이터 필드명(들)
        */
    hideColumnByDataField(dataField) {
      return this.auiGrid.hideColumnByDataField(dataField);
    },
    /*
            편집 가능 상태인 경우 선택한 행을 들여 쓰기 하여 계층 구조로 만듭니다.
            들여 쓰기 된 행은 상단 행의 자식으로 붙습니다.
        */
    indentTreeDepth() {
      this.auiGrid.indentTreeDepth();
    },
    /*
            사용자가 rowIdField 속성을 설정한 경우 rowIndex 에 맞는 행의 rowId 값을 반환합니다
            파라메터 설명
            rowIndex : (Number) 행 인덱스
            Return : rowId : (String) 행 고유값(rowId 값)
            Also See : rowIdToIndex
        */
    indexToRowId(rowIndex) {
      return this.auiGrid.indexToRowId(rowIndex);
    },
    /*
            rowId 에 맞는 행 아이템이 추가된 행인지 여부를 반환합니다. (rowIdField 속성 설정 필수)
            파라메터 설명
            rowId : (String) 행 아이템의 rowId 값
            Return : (Boolean) 추가된 행인 경우 true 반환
        */
    isAddedById(rowId) {
      return this.auiGrid.isAddedById(rowId);
    },
    /*
            현재 브라우저에서 그리드의 기능인 PDF 내보내기(Export) 사용 가능 여부를 반환합니다.
            완전히 HTML5 를 지원하는 브라우저에서 true를 반환합니다. 즉, 완전히 HTML5 를 지원하는 브라우저에서 PDF 내보내기 사용 가능합니다.
            Return : (Boolean) PDF 내보내기 가능 여부
        */
    isAvailabePdf() {
      return this.auiGrid.isAvailabePdf();
    },
    /*
            엑셀(xlsx), CSV, TXT 등으로 내보내기 할 때 로컬(Local) 자원만을 갖고 다운로딩 처리 가능한지 여부를 반환합니다.
            완전히 HTML5 를 지원하는 브라우저에서 true를 반환합니다. 즉, 완전히 HTML5 를 지원하는 브라우저에서 서버사이드 거치지 않고 바로 내보내기 가능합니다.
            Return : (Boolean) 로컬 다운로드 가능 여부
        */

    isAvailableLocalDownload() {
      return this.auiGrid.isAvailableLocalDownload();
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 rowIdField 를 이용해 해당 행 아이디(rowId)가 체크됐는지 여부를 반환합니다.
            반드시 rowIdField 속성 설정이 선행되어야 가능합니다.
            파라메터 설명
            id : (String) 행의 고유 ID 값(rowId)
            Return : (Boolean) 현재 체크 박스에 체크된 행인지 여부
        */

    isCheckedRowById(id) {
      return this.auiGrid.isCheckedRowById(id);
    },
    /*
            리드가 생성되었는지 여부를 반환합니다.
            var isCreated = AUIGrid.isCreated("#myGrid1");
            예를 들어 위와 같이 작성한다면 myGrid1 을 id 로 갖는 Div 에 그리드가 생성되었는지 여부를 반환합니다.
            Return : (Boolean) 생성되었는지 여부
        */

    isCreated() {
      if (this.auiGrid !== null) {
        return this.auiGrid.isCreated();
      }
      return false;
    },
    destroy() {
      if (this.auiGrid !== null) {
        this.auiGrid.destroy();
      }
    },
    /*
            rowId 에 맞는 행 아이템이 수정된 행인지 여부를 반환합니다. (rowIdField 속성 설정 필수)
            파라메터 설명
            rowId : (String) 행 아이템의 rowId 값
            Return : (Boolean) 수정된 행인 경우 true 반환.
        */

    isEditedById(uid) {
      return this.auiGrid.isEditedById(uid);
    },
    /*
            특정 셀(rowId 에 맞는 행, dataField 에 맞는 열 부합하는 셀)이 수정되었는지 여부를 반환합니다. (rowIdField 속성 설정 필수)
            파라메터 설명
            rowId : (String) 행 아이템의 rowId 값
            dataField : (String) 열의 dataField
            Return : (Boolean) 수정된 셀인 경우 true 반환.
            // "#Cust1" 이 행의 ID 이고, 데이터 필드명이 "name" 인 열인 셀이 현재 수정되었는지 여부 반환
            var isEdited = AUIGrid.isEditedCell(myGridID, "#Cust1", "name");
            alert(isEdited);
        */

    isEditedCell(uid, dataField) {
      return this.auiGrid.isEditedCell(uid, dataField);
    },
    /*
            현재 그리드 데이터가 필터링(filtering) 되었는지 여부를 반환합니다.
            Return : (Boolean) 필터링 여부 반환
        */

    isFilteredGrid() {
      return this.auiGrid.isFilteredGrid();
    },
    /*
            계층형 그리드(트리 그리드)인 경우 rowId 값에 맞는 행 아이템이 브랜치(branch) 인지 여부를 반환합니다.
            rowIdField 가 반드시 선행적으로 설정되어야 합니다.
            파라메터 설명
            rowId (String) : rowId 값
            Return : (Boolean) 브랜치(branch) 여부
        */

    isItemBranchByRowId(rowId) {
      return this.auiGrid.isItemBranchByRowId(rowId);
    },
    /*
            계층형 그리드(트리 그리드)인 경우 rowId 값에 맞는 행 아이템이 현재 열려진 상태인지 여부를 반환합니다.
            rowIdField 가 반드시 선행적으로 설정되어야 합니다.
            파라메터 설명
            rowId (String) : rowId 값
            Return : (Boolean) 열린 상태 여부
        */

    isItemOpenByRowId(rowId) {
      return this.auiGrid.isItemOpenByRowId(rowId);
    },
    /*
            rowId 값에 맞는 행 아이템이 현재 그리드에 출력된 상태인지 여부를 나타냅니다.
            이 상태는 현재 시각적으로 눈에 보이지 않는 행이라면 false 를 반환합니다.
            rowIdField 가 반드시 선행적으로 설정되어야 합니다.
            파라메터 설명
            rowId (String) : rowId 값
            Return : (Boolean) 보여지는 행 아이템인지 여부
        */

    isItemVisibleByRowId(rowId) {
      return this.auiGrid.isItemVisibleByRowId(rowId);
    },
    isMergedCell(rowIndex, columnIndex) {
      return this.auiGrid.isMergedCell(rowIndex, columnIndex);
    },
    /*
            그리드 필터를 설정한 경우, 필터 레이어의 현재 오픈 여부를 반환합니다.
            Return : (Boolean) 현재 열려 있는지 여부 반환
        */

    isOpenFilterLayer() {
      return this.auiGrid.isOpenFilterLayer();
    },
    /*
            rowId 에 맞는 행 아이템이 삭제된 행인지 여부를 반환합니다. (rowIdField 속성 설정 필수)
            파라메터 설명
            rowId : (String) 행 아이템의 rowId 값
            Return : (Boolean) 삭제된 행인 경우 true 반환.
        */

    isRemovedById(uid) {
      return this.auiGrid.isRemovedById(uid);
    },
    /*
            현재 그리드 데이터가 정렬(sorting) 되었는지 여부를 반환합니다.
            Return : (Boolean) 정렬 여부 반환
        */

    isSortedGrid() {
      return this.auiGrid.isSortedGrid();
    },
    /*
            현재 그리드의 상태가 트리 그리드(TreeGrid) 인지 여부를 반환합니다.
            트리 그리드는 사용자가 계층형 데이터를 삽입한 경우 또는 그룹핑을 실행한 경우 트리 그리드입니다.
            Return : (Boolean) 현재 그리드의 상태가 트리 그리드인지 여부
        */

    isTreeGrid() {
      return this.auiGrid.isTreeGrid();
    },
    /*
            그리드 칼럼에서 특정 값(value)이 전체 데이터에 대하여 칼럼의 고유값인지 여부를 반환합니다.
            파라메터 설명
            dataField : (String) 고유값인지 보고자 하는 데이터의 데이터필드명
            value : (Object) 고유값인지 알고자 하는 값(value)
            Return : (Boolean) 값이 고유값이면 true, 중복된 값이 있다면 false 반환.
        */

    isUniqueValue(dataField, value) {
      return this.auiGrid.isUniqueValue(dataField, value);
    },
    /*
            페이징을 사용하는 경우(usePaging=true) 원하는 페이지로 이동시키는 메소드입니다.
            파라메터 설명
            pageNum (Number) : 이동하고자 하는 페이지 번호
            keepVScrollPos (Boolean) : 이동할 때 수직 스크롤의 위치 유지 여부(기본값:false)
            keepHScrollPos (Boolean) : 이동할 때 수평 스크롤의 위치 유지 여부(기본값:false)
        */

    movePageTo(pageNum, maintainVScroll, maintainHScroll) {
      return this.auiGrid.movePageTo(pageNum, maintainVScroll, maintainHScroll);
    },
    moveRows2Down() {
      return this.auiGrid.moveRows2Down();
    },
    moveRows2Up() {
      return this.auiGrid.moveRows2Up();
    },
    /*
            그리드 선택 행(들)의 인덱스를 아래로 한 단계 이동시킵니다.
            행 이동은 일반 그리드 뿐만 아니라 트리 그리드(계층형 데이터)에서도 적용이 가능합니다.
            브랜치(Branch) 를 이동시키는 경우 아래 자손들도 함께 따라 움직입니다. 트리 그리드에서 리프(Leaf)의 이동은 자신의 부모를 벗어 날 수 없습니다.
        */

    moveRowsToDown() {
      return this.auiGrid.moveRowsToDown();
    },
    /*
            그리드 선택 행(들)의 인덱스를 위로 한 단계 이동시킵니다.
            행 이동은 일반 그리드 뿐만 아니라 트리 그리드(계층형 데이터)에서도 적용이 가능합니다.
            브랜치(Branch) 를 이동시키는 경우 아래 자손들도 함께 따라 움직입니다. 트리 그리드에서 리프(Leaf)의 이동은 자신의 부모를 벗어 날 수 없습니다.
        */

    moveRowsToUp() {
      return this.auiGrid.moveRowsToUp();
    },
    /*
            그리드 필터를 설정한 경우, 지정한 dataField 에 맞는 필터 레이어(필터 메뉴)를 오픈합니다.
            만약, 동일한 칼럼의 필터 레이어(필터 메뉴)가 이미 열려진 경우, 이 메소드는 닫는 역할(즉, 토글 역할)을 하게 됩니다.
            파라메터 설명
            dataField (String) : 칼럼의 dataField 명
            // 이름 칼럼의 필터 레이어(필터 메뉴)를 오픈합니다.
            AUIGrid.openFilterLayer(myGridID, "name");
        */

    openFilterLayer(dataField) {
      return this.auiGrid.openFilterLayer(dataField);
    },
    /*
            사용자의 키 입력 또는 F2, 마우스 (더블) 클릭 등의 행위 없이 셀을 수정할 수 있게 편집기(Inputer)를 강제로 오픈합니다.
        */

    openInputer() {
      return this.auiGrid.openInputer();
    },
    /*
            편집 가능 상태인 경우 선택한 행을 내어 쓰기 하여 계층 구조로 만듭니다.
            내어 쓰기 된 행은 부모 행(branch) 이 될 수가 있습니다.
        */

    outdentTreeDepth() {
      this.auiGrid.outdentTreeDepth();
    },
    /*
            편집 가능한 그리드에서 enableUndoRedo=true 설정한 경우, 다시 실행(Redo) 를 실행합니다.
        */

    redo() {
      this.auiGrid.redo();
    },
    /*
            다시 실행(Redo) 이 가능한지 여부를 반환합니다.
            Return : (Boolean) 다시 실행 가능 여부
        */

    redoable() {
      return this.auiGrid.redoable();
    },
    /*
            그리드의 상태가 변경된 경우 이 메소드를 호출하여 실제 적용시킵니다.
            그리드의 속성을 동적으로 변경한 후 그리드 상태가 시각적으로 변경되어야 할 때 이 메소드를 호출하십시오.
            주의 : refresh 메소드는 속성 변경을 참조하여 DOM 을 재작성합니다.
            단순 셀의 내용만 갱신하고자 한다면 update 메소드를 사용하십시오.
            refresh 메소드를 불필요하게 자주 호출하지 마십시오. 성능에 영향을 미칩니다.
        */

    refresh() {
      this.auiGrid.refresh();
    },
    /*
            그리드에 데이터를 삽입해 이미 출력된 모습에서 특정 행들 찾아 갱신(refresh)합니다. (rowIdField 속성 설정 필수)
            예를 들어 변경된 데이터를 DB Select 할 수 있다면, 이 메소드를 통해 특정 행만 갱신할 수 있습니다.
            기존에 출력된 데이터와 형식이 같아야만 유효합니다.
            예를 들어 rowIdField 를 id 로 설정한 경우, id 가 20, 21, 30 인 행을 찾아 특정 셀만 업데이트 하고자 한다면 다음과 같습니다.
            var items = [ { id : 20, price : 2000, name : "A" },
                            { id : 21, price : 1000, name : "B" },
                            { id : 30, price : 4000, name : "C" }];
            AUIGrid.refreshRows(myGridID, items, "my-flash-style", 200);
            파라메터 설명
            items (Array or Object) : 복수 또는 1개의 행을 갱신 합니다.
            flashStyle (String) : 갱신 시 갱신된 셀이 깜빡이도록 표시해 주는 CSS 클래스명(스타일)을 지정합니다.
            flashTime (Number) : flashStyle 이 출력되는 시간을 밀리세컨드 단위로 지정합니다. 예를 들어 이 값이 300 이라면 0.3 초 후 flashStyle 이 사라집니다.
            기존 데이터 양이 수만행 이상이라면 전체 데이터 갱신(setGridData) 하는게 성능면에서 유리합니다.
            참고 : refreshRows() 는 updateRowsById() 와 같은 기능을 합니다.(셀 수정 마커 표시 항상 false, 변경 셀에 깜빡이는 스타일 지정 가능이 다름)
        */

    refreshRows(items, style, flashTime) {
      return this.auiGrid.refreshRows(items, style, flashTime);
    },
    /*
            그리드에 표시된 프리로더가 있다면 삭제합니다
        */

    removeAjaxLoader() {
      this.auiGrid.removeAjaxLoader();
    },
    /*
            체크박스 엑스트라 렌더러를 사용한 경우 체크박스에 체크된 행(들)을 그리드에서 삭제 처리 합니다.
        */

    removeCheckedRows() {
      // console.log("Enter removeCheckedRows");
      return this.auiGrid.removeCheckedRows();
    },
    /*
            그리드 열(column)을 삭제합니다.
            파라메터 설명
            columnIndex (Number or String) : 삭제하고자 하는 열의 인덱스, columnIndex 대신 "selectedIndex" 문자열을 설정한 경우 현재 선택된 열이 삭제됩니다.
            예1 : AUIGrid.removeColumn(myGridID, 5); // columnIndex 5 삭제
            예2 : AUIGrid.removeColumn(myGridID, "selectedIndex"); // 현재 선택된 열(들) 삭제
            예3 : AUIGrid.removeColumn(myGridID, [0,1,2]); // columnIndex 0, 1, 2 삭제(즉, 3개의 열 삭제)
        */

    removeColumn(columnIndex) {
      this.auiGrid.removeColumn(columnIndex);
    },
    /*
            그리드에 메세지가 출력되었다면 제거합니다.
        */

    removeInfoMessage() {
      this.auiGrid.removeInfoMessage();
    },
    /*
            그리드 행(row) 아이템을 삭제합니다.
            파라메터 설명
            rowIndex (Number or String) : 삭제하고자 하는 행의 인덱스, rowIndex 대신 "selectedIndex" 문자열을 설정한 경우 현재 선택된 행이 삭제됩니다.
            예1 : AUIGrid.removeRow(myGridID, 5); // rowIndex 5 삭제
            예2 : AUIGrid.removeRow(myGridID, "selectedIndex"); // 현재 선택된 행(들) 삭제
            예3 : AUIGrid.removeRow(myGridID, [0,1,2]); // rowIndex 0, 1, 2 삭제(즉, 3개의 행 삭제)
        */

    removeRow(rowIndex) {
      return this.auiGrid.removeRow(rowIndex);
    },
    /*
            rowIdField 를 지정한 한 경우 rowId 값을 통해 그리드 행(row) 아이템을 삭제합니다.
            파라메터 설명
            rowIdValue (Array or String) : 삭제하고자 하는 행의 rowId 값 (복수를 삭제하고자 할 때 rowId 값들을 배열로 묶으십시오.)
        */

    removeRowByRowId(rowIds) {
      return this.auiGrid.removeRowByRowId(rowIds);
    },
    /*
            그리드 삭제 모드가 소프트 삭제(softRemoveRowMode=true)인 경우 행을 삭제하면 삭제된 표시가 된 채로 그리드에 남아 있습니다.
            그 표시된 삭제 행을 그리드에서 완전히 제거할 수 있는 메소드입니다.
            파라메터 설명
            rowIds (String or Array) : 삭제할 행의 rowId 값(들) (단수 또는 복수)
            만약 파라메터인 rowIds 를 넣지 않으면 삭제 표시된 행 전체를 그리드에서 제거합니다.
        */

    removeSoftRows(ids) {
      return this.auiGrid.removeSoftRows(ids);
    },
    /*
            특정 셀에 출력된 메세지를 제거합니다.
        */
    removeToastMessage() {
      this.auiGrid.removeToastMessage();
    },
    /*
            그리드의 열(column) 을 추가, 삭제했을 때 해당 데이터필드(dataField)를 그리드가 캐시에 보관합니다.
            이 보관된 데이터필드(dataField)를 모두 초기화하여 그리드 열이 수정되지 않은 상태로 만듭니다.
            파라메터 설명
            option (String) : 추가, 삭제된 해당 캐시를 초기화 할 옵션을 지정합니다. 유효 값은 "c", "d", "a" 입니다.
            "c" : 추가된 데이터만 흔적을 제거하고 초기화 시킵니다.
            "d" : 삭제된 데이터만 흔적을 제거하고 초기화 시킵니다.
            "a" : 추가, 삭제 모두 흔적을 제거하고 초기화 시킵니다. (기본값)
        */

    resetUpdatedColumns(opts) {
      this.auiGrid.resetUpdatedColumns(opts);
    },
    /*
            편집모드에서 그리드의 데이터를 추가, 수정, 삭제했을 때 해당 데이터를 그리드가 캐시에 보관합니다.
            이 보관된 데이터를 모두 초기화하여 그리드가 수정되지 않은 상태로 만듭니다.
            예를 들어 그리드에 추가, 수정, 삭제된 데이터를 DB에 모두 저장 했을 때 유용할 수 있습니다.
            파라메터 설명
            option (String) : 추가, 수정, 삭제된 해당 데이터 캐시를 초기화 할 옵션을 지정합니다. 유효 값은 "c", "u"("e"), "d", "a" 입니다.
            "c" : 추가된 데이터만 흔적을 제거하고 초기화 시킵니다.
            "u"(or "e") : 수정된 데이터만 흔적을 제거하고 초기화 시킵니다.
            "d" : 삭제된 데이터만 흔적을 제거하고 초기화 시킵니다.
            "a" : 추가, 수정, 삭제 모두 흔적을 제거하고 초기화 시킵니다. (기본값)
        */

    resetUpdatedItems(flag) {
      return this.auiGrid.resetUpdatedItems(flag);
    },
    /*
            그리드의 크기를 변경합니다.
            파라메터 설명
            width (Number) : 변경시키고자 하는 가로 사이즈
            height (Number) : 변경시키고자 하는 세로 사이즈
            만약 파라메터 없이 resize 메소드 호출 시 부모 Div의 크기를 다시 계산하여 그에 맞게 사이즈를 변경합니다.
        */

    resize(w, h) {
      // keep-alive를 사용하는경우 메뉴가 안보이게 되면 grid의 DOM (div)가 없어진다.
      // 이때 resize 를 하면 오류발생
      // DOM이 있는지 체크해서 처리한다.
      if (this.myId != null) {
        const myCheck = document.getElementById(this.myId.replace('#', ''));
        if (myCheck === null) {
          return;
        }
        this.auiGrid.resize(w, h);
      }
    },
    /*
            그리드의 셀을 수정한 해당 셀 값을 수정 취소(복구) 합니다.
            수정 취소(복구)는 최초 그리드에 삽입된 셀의 값으로 되돌립니다.
            파라메터 설명
            cells (Array or String) : 행인덱스와 dataField 를 각각 0, 1 요소로 갖는 배열, "selectedIndex" 문자열을 설정한 경우 현재 선택된 셀들이 복구됩니다
            // 현재 선택된 셀들 전체 수정 취소(복구)
            AUIGrid.restoreEditedCells(myGridID, "selectedIndex");
                // 행인덱스 5 의 dataField="country" 인 셀의 값을 수정 취소(복구)
            AUIGrid.restoreEditedCells(myGridID, [5, "country"] );

            // 복수의 셀 값들 지정 예제
            AUIGrid.restoreEditedCells(myGridID, [[2, "country"], [3, "country"], [3, "product"]] );
        */

    restoreEditedCells(cells) {
      this.auiGrid.restoreEditedCells(cells);
    },
    /*
            그리드의 행을 수정한 해당 행 전체 셀 값을 수정 취소(복구) 합니다.
            수정 취소(복구)는 최초 그리드에 삽입된 행의 셀 값들로 되돌립니다.
            파라메터 설명
            rowIndex (Number(Array) or String) : 삭제하고자 하는 행의 인덱스, rowIndex 대신 "selectedIndex" 문자열을 설정한 경우 현재 선택된 행이 복구됩니다.
            // 현재 선택된 행을 수정 취소(복구)
            AUIGrid.restoreEditedRows(myGridID, "selectedIndex");

            // 행인덱스 5의 행을 수정 취소(복구)
            AUIGrid.restoreEditedRows(myGridID, 5);

            // 행인덱스 5,6,7 의 복수 행을 수정 취소(복구)
            AUIGrid.restoreEditedRows(myGridID, [5, 6, 7]);
        */

    restoreEditedRows(rowIndex) {
      this.auiGrid.restoreEditedRows(rowIndex);
    },
    /*
            그리드 삭제 모드가 소프트 삭제(softRemoveRowMode=true)인 경우 행을 삭제하면 삭제된 표시가 된 채로 그리드에 남아 있습니다.
            그 표시된 삭제 행을 복원 할 수 있는 메소드입니다.(삭제 취소)
            이 메소드로 복원된 행은 더 이상 삭제 아이템이 아니게 되며, 기존 상태로 복구됩니다.
            기존 상태의 의미는 이 행이 사용자에 의해 추가되었다면 추가 아이템...이 행이 삭제 되기 전 변경 되었다면 수정 아이템이 됩니다.
            파라메터 설명
            option (String or Number) : 복구할 대상을 지정할 수 있는 옵션. 유효 값은 "selectedIndex", "all", rowIndex 입니다.
            "selectedIndex" : 현재 선택되어 있는 행을 복구 합니다.(선택된 행이 삭제 표시된(softRemoveRow) 아이템이여야 함)
            "all" : 그리드의 모든 삭제 표시된 행을 복구합니다.
            rowIndex : 지정된 행 인덱스의 삭제 표시된 행을 복구합니다.(Number)
        */

    restoreSoftRows(flag) {
      return this.auiGrid.restoreSoftRows(flag);
    },
    /*
            사용자가 rowIdField 속성을 설정한 경우 rowId 값을 통해 행 인덱스를 반환합니다
            파라메터 설명
            rowIdValue : (String) rowIdField 에 맞는 값
            Return : rowIndex : (Number) 행 인덱스
        */

    rowIdToIndex(rowId) {
      return this.auiGrid.rowIdToIndex(rowId);
    },
    /*
            그리드의 특정 칼럼에서 문자열을 검색합니다.
            파라메터 설명
            dataField : (String) 검색하고자 하는 칼럼의 데이터필드명
            term : (String) 검색하고자 하는 문자열
            options : (Object) 검색 옵션
            검색 옵션(options) 은 다음과 같은 필드를 갖습니다.
            direction (기본값 : true) : 검색 방향 (true : 다음, false : 이전 검색)
            caseSensitive (기본값 : false) : 대소문자 구분 여부 (true : 대소문자 구별, false : 무시)
            wholeWord (기본값 : false) : 온전한 단어 여부
            wrapSearch (기본값 : true) : 끝에서 되돌리기 여부
            // 이름(name) 칼럼에서 "anna" 찾기
            //options 를 지정하지 않으면 기본값이 적용됨(기본값은 direction : true, wrapSearch : true)
            AUIGrid.search(myGridID, "name", "anna");
        */

    search(dataField, term, opts) {
      return this.auiGrid.search(dataField, term, opts);
    },
    /*
            그리드의 전체 칼럼을 대상으로 문자열을 검색합니다.
            이 메소드는 트리그리드 또는 그룹핑이 설정된 상태에서는 무시됩니다.(즉, 트리그리드 및 그룹핑이 설정된 상태에서는 사용할 수 없습니다.)
            파라메터 설명
            term : (String) 검색하고자 하는 문자열
            options : (Object) 검색 옵션
            검색 옵션(options) 은 다음과 같은 필드를 갖습니다.
            direction (기본값 : true) : 검색 방향 (true : 다음, false : 이전 검색)
            caseSensitive (기본값 : false) : 대소문자 구분 여부 (true : 대소문자 구별, false : 무시)
            wholeWord (기본값 : false) : 온전한 단어 여부
            wrapSearch (기본값 : true) : 끝에서 되돌리기 여부
            // 그리드 전체 칼럼에서 "a" 찾기
            //options 를 지정하지 않으면 기본값이 적용됨(기본값은 direction : true, wrapSearch : true)
            AUIGrid.searchAll(myGridID, "a");
        */

    searchAll(term, opts) {
      return this.auiGrid.searchAll(term, opts);
    },
    /*
            선택모드(selectionMode)가 "none" 이 아닌 경우 특정 행 아이템들을 선택하도록 지시합니다.
            행 아이템을 선택할 때 rowId 로 지정합니다. (rowIdField 설정 필수)
            파라메터 설명
            rowIds : (Array 또는 String) 선택하고자 하는 rowId 값(들)
        */

    selectRowsByRowId(rowIds) {
      return this.auiGrid.selectRowsByRowId(rowIds);
    },
    /*
            엑스트라 체크박스(showRowCheckColumn=true 로 나오는 체크박스)가 설정된 경우 모든 체크박스를 true, 또는 false 로 설정합니다.
            파라메터 설명
            checked : (Boolean) true 또는 false, true인 경우 전체 선택, false 인 경우 전체 해제
        */

    setAllCheckedRows(check) {
      this.auiGrid.setAllCheckedRows(check);
    },
    /*
            셀 병합(cell merge) 를 활성화시키거나 비활성화 시킵니다.
            파라메터 설명
            flag (Boolean) : true 인 경우 셀 병합 활성화, false 인 경우 비활성화
        */

    setCellMerge(flag) {
      this.auiGrid.setCellMerge(flag);
    },
    setCellStyle(rowIndex, columnIndex, style) {
      this.auiGrid.setCellStyle(rowIndex, columnIndex, style);
    },
    setCellStyleById(rowId, dataField, style) {
      this.auiGrid.setCellStyleById(rowId, dataField, style);
    },
    /*
            그리드의 특정 셀의 값을 변경합니다.
            파라메터 설명
            rowIndex (Number) : 변경하고자 하는 행 인덱스
            dataField or columnIndex(String or Number) : 변경하고자 하는 칼럼의 dataField 또는 칼럼 인덱스
            value (Object) : 변경하고자 하는 값
        */

    setCellValue(rowIndex, dataField, value) {
      return this.auiGrid.setCellValue(rowIndex, dataField, value);
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 rowIdField 를 이용해 특정 행에 체크를 표시합니다.
            반드시 rowIdField 속성 설정이 선행되어야 가능합니다.
            이 메소드는 기존에 체크된 항목이 제거되고 새로 설정된 값으로만 체크됩니다.
            파라메터 설명
            ids : (Array) 행의 rowId 값들을 요소로 갖는 배열
            참고 : 기존 체크 항목에 누적해서 체크를 넣고자 한다면 addCheckedRowsByIds 메소드를 사용하십시오.
        */

    setCheckedRowsByIds(ids) {
      return this.auiGrid.setCheckedRowsByIds(ids);
    },
    /*
            엑스트라 행 체크박스가 설정된 경우 특정 행의 dataField 의 값과 일치하는 행에 체크를 표시합니다.
            이 메소드는 기존에 체크된 항목이 제거되고 새로 설정된 값으로만 체크됩니다.
            예를 들어 이름(name) 이 "Anna" 라는 사람만을 체크하고자 한다면 다음과 같습니다.
            AUIGrid.setCheckedRowsByValue(myGridID, "name", "Anna");
            파라메터 설명
            dataField : (String) 행 아이템에서 체크하고자 하는 필드명
            values : (Array or String) 행 아이템에서 체크하고자 하는 필드의 값(value), 복수의 값을 체크하고자 한다면 배열로 설정(예: ["Anna", "Steve"])
            참고 : 기존 체크 항목에 누적해서 체크를 넣고자 한다면 addCheckedRowsByValue 메소드를 사용하십시오.
        */

    setCheckedRowsByValue(dataField, value) {
      return this.auiGrid.setCheckedRowsByValue(dataField, value);
    },
    /*
            그룹 칼럼의 자식들의 위치 순서를 지정하여 그리드를 출력하도록 합니다.
            파라메터 설명
            dataFields (Array) : 그룹 칼럼의 자식의 순서를 표현하는 dataField 값들
            // c1, c2, c3 를 dataField 로 갖는 칼럼이 Group 으로 되어 있는 경우, 순서를 c3, c1, c2 로 출력 시킴.
            AUIGrid.setColumnChildOrder(myGridID, ["c3", "c1", "c2"]);

            // 그룹 칼럼의 자식들 중 c2를 자식들 중 처음으로 위치시킴.
            AUIGrid.setColumnChildOrder(myGridID, ["c2"] );
        */

    setColumnChildOrder(dataFieldOrders) {
      this.auiGrid.setColumnChildOrder(dataFieldOrders);
    },
    /*
            칼럼의 위치 순서를 지정하여 그리드를 출력하도록 합니다.
            파라메터 설명
            dataFields (Array) : 칼럼의 순서를 표현하는 dataField 값들
            // 칼럼의 순서를 차례로 Counry, Name, Price, Date 순으로 출력시킴.
            AUIGrid.setColumnOrder(myGridID, ["country", "name", "price", "date"]);

            // 칼럼의 순서를 Date 를 맨 앞으로 출력하고, 나머지 칼럼은 기존 순서 유지 시킴.
            AUIGrid.setColumnOrder(myGridID, ["date"] );
        */

    setColumnOrder(dataFieldOrders) {
      this.auiGrid.setColumnOrder(dataFieldOrders);
    },
    /*
            최초 설정한 칼럼 레이아웃의 columnIndex 에 맞는 칼럼의 속성을 변경합니다.
            파라메터 설명
            columnIndex (Number) : 변경하고자 하는 칼럼 인덱스
            propObj (Object) : 변경하고자 하는 칼럼의 속성명과 값을 갖는 Object
            예를 들어 1 번째 칼럼의 헤더 텍스트(headerText) 와 넓이(width) 를 변경하고자 한다면 다음과 같습니다.
            // 인덱스 1번째 칼럼의 헤더 명과 넓이를 각각 "헤더 텍스트 변경", 100 으로 변경
            AUIGrid.setColumnProp( myGridID, 1, { headerText : "헤더 텍스트 변경", width : 100 } );
            참고 : setColumnProp 으로 renderer, children 등 DOM 이 변경되는 속성의 설정을 바꿀 수는 없습니다.
             이런 경우는 destroy 후 다시 새로운 칼럼 레이아웃으로 create 하십시오.
        */

    setColumnProp(columnIndex, obj) {
      this.auiGrid.setColumnProp(columnIndex, obj);
    },
    /*
            최초 설정한 칼럼 레이아웃의 데이터필드(dataField)에 맞는 칼럼의 속성을 변경합니다.
            파라메터 설명
            dataField (String) : 변경하고자 하는 칼럼의 데이터필드명
            propObj (Object) : 변경하고자 하는 칼럼의 속성명과 값을 갖는 Object
            예를 들어 "name" 칼럼의 헤더 텍스트(headerText) 와 넓이(width) 를 변경하고자 한다면 다음과 같습니다.
            // "name" 칼럼의 헤더 명과 넓이를 각각 "헤더 텍스트 변경", 100 으로 변경
            AUIGrid.setColumnPropByDataField( myGridID, "name", { headerText : "헤더 텍스트 변경", width : 100 } );

            // "myGroupHeader" 를 dataField 로 갖는 그룹 헤더의 헤더 텍스트 변경
            AUIGrid.setColumnPropByDataField( myGridID, "myGroupHeader", { headerText : "그룹 헤더 텍스트 변경" } );
            참고 : setColumnPropByDataField 으로 renderer, children 등 DOM 이 변경되는 속성의 설정을 바꿀 수는 없습니다.
            이런 경우는 destroy 후 다시 새로운 칼럼 레이아웃으로 create 하십시오.
        */

    setColumnPropByDataField(dataField, obj) {
      this.auiGrid.setColumnPropByDataField(dataField, obj);
    },
    /*
            그리드 칼럼의 가로 크기(width size)를 지정할 수 있습니다.
            파라메터 설명
            sizeList : (Array) 변경할 가로 사이즈들
            다음은 사용 예를 나타냅니다.
            // 그리드의 칼럼 사이즈들을 강제로 지정합니다.
            AUIGrid.setColumnSizeList(myGridID, [100, 100, 100, 100, 100, 100, 100, 100, 100]);
            // 만약 특정 인덱스의 사이즈는 유지하고 싶다면 다음처럼 null 삽입
            AUIGrid.setColumnSizeList(myGridID, [100, 100, null, null, 100, 100, 100, 100]);
            // 0, 1번째 칼럼만 100, 100으로 지정합니다. 나머지 칼럼은 기존 유지
            AUIGrid.setColumnSizeList(myGridID, [100, 100]);
        */

    setColumnSizeList(value) {
      return this.auiGrid.setColumnSizeList(value);
    },
    /*
            그리드 데이터를 CSV로 설정합니다.
            파라메터 설명
            csvData (String) : 그리드가 표현할 CSV 데이터
            isSimpleMode (Boolean) : 단순 컴마 구분자로 CSV 가 있는지 여부. 만약 컴마 구분자가 데이터의 값으로 존재한다면 이 속성을 false 로 처리하십시오.
        */

    setCsvGridData(gridData, isSimple) {
      return this.auiGrid.setCsvGridData(gridData, isSimple);
    },
    /*
            편집모드(editable=true)인 경우 해당 input 의 값을 설정합니다.
            이 값 설정은 (더블)클릭 또는 F2 키 등과 같이 편집 진입한 상태인 경우에만 유효합니다.
            사용자 정의 편집 렌더러(customEditRenderer) 를 사용했을 때 편집 렌더러의 값에 따라 그리드의 input 값을 이 메소드를 통해 동적으로 변경 가능합니다.
            파라메터 설명
            value (Object) : 설정하고자 하는 값
        */

    setEditingInputValue(gridData, isSimple) {
      return this.auiGrid.setEditingInputValue(gridData, isSimple);
    },
    /*
            필터링을 설정하고 실행합니다.
            enableFilter 속성이 true 설정되어야 가능합니다.
            파라메터 설명
            dataField (String) : 칼럼이 출력하고 있는 데이터의 필드명
            filterFunction (Function) : 필터링 비교 함수
            사용 예는 다음과 같습니다.
            // dataField : 칼럼이 출력하고 있는 데이터의 필드명
            // value : 행의 dataField 에 맞는 값.
            // item : 행 전체 아이템
            AUIGrid.setFilter(myGridID, "name",  function(dataField, value, item) {
                return value > 10 ? true : false; // 10 보다 큰 값만 출력
            });
        */

    setFilter(dataField, func) {
      return this.auiGrid.setFilter(dataField, func);
    },
    /*
            칼럼의 값(들)만을 이용하여 필터링하고 실행합니다.
            enableFilter 속성이 true 설정되어야 가능합니다.
            파라메터 설명
            dataField (String) : 칼럼이 출력하고 있는 데이터의 필드명
            values (String or Array) : 해당 dataField 에서 필터링하고자 하는 값(들)
            이 메소드의 사용예는 다음과 같습니다.
            // 이름의 값이 Anna, Emma 만 필터링 하기
            AUIGrid.setFilterByValues(myGridID, "name",  ["Anna", "Emma"]);
            참고 : 정규식 및 비교 문(if) 등으로 필터링을 결정하고자 한다면 setFilter 메소드를 사용하십시오.
        */

    setFilterByValues(dataField, values) {
      return this.auiGrid.setFilterByValues(dataField, values);
    },
    /*
            스크롤에 영향을 받지 않는 고정칼럼(FixedColumn)을 주어진 개수만큼 지정합니다.
            0 인 경우 지정된 고정칼럼이 해제됩니다.
            파라메터 설명
            count : (Number) 고정칼럼(FixedColumn) 실행시킬 개수
        */

    setFixedColumnCount(value) {
      this.auiGrid.setFixedColumnCount(value);
    },
    /*
            스크롤에 영향을 받지 않는 고정행(FixedRow)을 주어진 개수만큼 지정합니다.
            0 인 경우 지정된 고정행이 해제됩니다.
            파라메터 설명
            count : (Number) 고정행(FixedRow) 실행시킬 개수
        */

    setFixedRowCount(value) {
      this.auiGrid.setFixedRowCount(value);
    },
    /*
            그리드에 키보드 포커싱이 되도록 지정합니다.
            그리드의 속성인 enableFocus 를 false 로 설정했다면, setFocus 메소드 호출은 의미가 없습니다.
        */

    setFocus() {
      this.auiGrid.setFocus();
    },
    /*
            그리드의 푸터(footer) 출력을 위해 푸터 레이아웃을 설정합니다.
            푸터 레이아웃 작성에 대한 자세한 사항은 푸터(Footer) 레이아웃 작성에 대하여 를 참고하십시오.
            파라메터 설명
            footerLayout (Array) : 푸터 출력을 위한 푸터 설정 레이아웃
        */

    setFooter(footerData) {
      return this.auiGrid.setFooter(footerData);
    },
    /*
            그리드 데이터를 설정합니다. 그리드 데이터는 반드시 배열요소가 Object 인 배열(Array) 여야 합니다.
            만약 XML 을 데이터로 사용하고자 하는 경우 setXmlGridData() 를, CSV 데이터를 사용하고자 한다면 setCsvGridData()를 사용하십시오.
            파라메터 설명
            data (Array) : 그리드가 표현할 데이터 배열
        */

    setGridData(gridData) {
      if (this.auiGrid !== null) {
        // 여기서 clearGridData를 하면 안됨 느려짐 -_-
        // GridData를 가공시켜서 자식 auigrid에 보냄
        this.auiGrid.setGridData(this.$comm.replaceChar(gridData));

        this.gridDataLen = this.auiGrid.getRowCount();
      }
    },
    // 자동 정렬 지원.
    setGridDataA(gridData) {
      if (this.auiGrid !== null) {
        // 여기서 clearGridData를 하면 안됨 느려짐 -_-
        // this.auiGrid.clearGridData();
        this.auiGrid.setGridData(this.$comm.replaceChar(gridData));
        this.gridDataLen = this.auiGrid.getRowCount();
        this.setFitColumnSizeToGrid();
      }
    },
    /*
            특정 데이터 칼럼 필드로 그룹핑을 실행합니다.
            파라메터 설명
            groupingFields (Array) : 그룹핑을 하고자 하는 필드명을 요소로 갖는 배열
            summaryFields (Object) : 그룹핑 시 소계를 출력하고자 하는 경우, 소계 정보 Object
            사용 예는 다음과 같습니다.
            // Country, Product 순으로 그룹핑을 하고자 하는 경우 다음과 같습니다.
            AUIGrid.setGroupBy(myGridID, ["country", "product"] );

            // Country 로 그룹핑하고, Price 에 대하여 소계를 출력함. 단, 소계명은 "가격 합계" 로 출력 시킴
            AUIGrid.setGroupBy(myGridID,  ["country"], {
                    dataFields : [ "price" ],
                    labelTexts : ["가격 합계"]
            });
        */

    setGroupBy(groupingFields, summaryProps) {
      return this.auiGrid.setGroupBy(groupingFields, summaryProps);
    },
    /*
            최초 설정한 칼럼 레이아웃의 columnIndex 에 맞는 칼럼의 headerRenderer 속성을 변경합니다.
            파라메터 설명
            columnIndex (Number) : 변경하고자 하는 칼럼 인덱스
            propObj (Object) : 변경하고자 하는 헤더렌더러(headerRenderer)의 속성명과 값을 갖는 Object
            예를 들어 1번째 칼럼의 headerRenderer 를 다음처럼 CheckBoxHeaderRenderer 로 정의한 경우 속성 변경이 가능합니다.
            dataField : "field2",
            headerRenderer : { // 헤더 렌더러
                type : "CheckBoxHeaderRenderer",
                checked : true, // 최초 체크 여부
                }

            // 인덱스 1번째 칼럼의 헤더 체크박스 렌더러의 checked 속성 변경
            AUIGrid.setHeaderRendererProp(myGridID, 1, {"checked" : false} );
            참고 : setHeaderRendererProp 으로 headerRenderer 의 기본인 type 설정을 바꿀 수는 없습니다.
        */

    setHeaderRendererProp(columnIndex, obj) {
      this.auiGrid.setHeaderRendererProp(columnIndex, obj);
    },
    /*
        수평 스크롤이 생성되어 있을 때 수평 스크롤을 칼럼 인덱스 단위로 이동 시킬 수 있는 메소드입니다.
        파라메터 설명
        columnIndex (Number) : 수평 스크롤의 시작점이 될 칼럼의 인덱스
        */

    setHScrollPosition(columnIndex) {
      return this.auiGrid.setHScrollPosition(columnIndex);
    },
    /*
        수평 스크롤이 생성되어 있을 때 수평 스크롤을 픽셀 단위로 이동 시킬 수 있는 메소드입니다.
        파라메터 설명
        px (Number) : 수평 스크롤이 이동할 픽셀 단위의 값
        */

    setHScrollPositionByPx(px) {
      return this.auiGrid.setHScrollPositionByPx(px);
    },
    /*
            [deprecated Ver 3.0.4] 그리드에 메세지를 출력시킵니다
        */

    setInfoMessage(msgHTML) {
      this.auiGrid.setInfoMessage(msgHTML);
    },
    /*
            페이징을 사용하는 경우 1 페이지에 출력되는 행의 개수를 변경합니다.
            파라메터 설명
            pageRowCount : (Number) 1 페이지에 출력 시킬 행의 개수
        */

    setPageRowCount(count) {
      this.auiGrid.setPageRowCount(count);
    },
    setProp(obj, value) {
      this.auiGrid.setProp(obj, value);
    },
    /*
            그리드의 속성을 변경합니다.
            최초 그리드를 생성할 때 속성을 설정하나 경우에 따라 이 속성을 동적으로 변경해야 할 때가 있습니다.
            이런 경우 이 메소드를 통해 속성을 변경하십시오.
        */

    setProperty(obj, value) {
      return this.auiGrid.setProperty(obj, value);
    },
    /*
            최초 설정한 칼럼 레이아웃의 columnIndex 에 맞는 칼럼의 renderer 속성을 변경합니다.
            renderer 속성의 기본인 type 을 제외한 속성을 변경할 수 있습니다.
            파라메터 설명
            columnIndex (Number) : 변경하고자 하는 칼럼 인덱스
            propObj (Object) : 변경하고자 하는 렌더러(renderer)의 속성명과 값을 갖는 Object
            예를 들어 1번째 칼럼의 renderer 를 다음처럼 BarRenderer 로 정의한 경우 BarRenderer 의 세부 속성 변경이 가능합니다.
            dataField : "field2",
            headerText : "-100 ~ 100 범위",
            renderer : {
            type : "BarRenderer",
                    min : -100,
                    max : 100
            }

            // 인덱스 1번째 칼럼의 renderer 인 BarRenderer 의 min, max 속성 변경
            AUIGrid.setRendererProp( myGridID, 1, { min : 0, max : 150 } );
            참고 : setRendererProp 으로 renderer 의 기본인 type 설정을 바꿀 수는 없습니다.
            type 설정을 변경하고자 한다면, 전체 그리드를 destroy 후 다시 create 하여 새로운 칼럼 레이아웃으로 그리드를 재생성 하십시오.
        */

    setRendererProp(columnIndex, obj) {
      this.auiGrid.setRendererProp(columnIndex, obj);
    },
    /*
            수직 스크롤이 생긴 경우 해당 rowIndex 를 그리드 최상단으로 보이도록 지정합니다.
            파라메터 설명
            rowPosition (Number) : 그리드 상단으로 위치할 rowIndex
        */

    setRowPosition(rowPosition) {
      return this.auiGrid.setRowPosition(rowPosition);
    },
    setSelectionAll() {
      this.auiGrid.setSelectionAll();
    },
    /*
            그리드의 셀에 선택 블록(selection block) 을 강제로 지정합니다.
            이 메소드는 selectionMode 를 "multipleCells" 로 설정했을 때 사용자의 의도대로 출력됩니다.
            만약 "multipleCells" 가 아닌 다른 값이라면 해당 속성값에 맞게 선택이 자동 변경되어 지정됩니다.
            파라메터 설명
            startRowIndex (Number) : 블록을 만들 시작 행 인덱스
            endRowIndex (Number) : 블록을 만들 종료 행 인덱스
            startColumnIndex (Number) : 블록을 만들 시작 칼럼 인덱스
            endColumnIndex (Number) : 블록을 만들 종료 칼럼 인덱스
            // (1,1) 셀에서 시작하여 (4,4) 셀에서 끝나는 선택 블록 지정하기
            AUIGrid.setSelectionBlock(myGridID, 1, 4, 1, 4);
        */

    setSelectionBlock(sr, er, sc, ec) {
      this.auiGrid.setSelectionBlock(sr, er, sc, ec);
    },
    /*
            선택모드(selectionMode)가 "none" 이 아닌 경우 특정 아이템을 선택하도록 지시합니다.
            만약 columnIndex 를 생략하면 행을 선택합니다.
            파라메터 설명
            rowIndex : (Number) 선택하고자 하는 행 인덱스
            columnIndex : (Number) 선택하고자 하는 칼럼 인덱스
        */

    setSelectionByIndex(rowIndex, columnIndex) {
      return this.auiGrid.setSelectionByIndex(rowIndex, columnIndex);
    },
    setSelectionColumn(startColIdx, endColIdx) {
      return this.auiGrid.setSelectionColumn(startColIdx, endColIdx);
    },
    /*
            선택모드(selectionMode) 를 변경합니다.
            파라메터 설명
            selectionMode (String) : 설정하고자 하는 selectionMode(유효값 : singleCell, singleRow, multipleCells, multipleRows, none)
        */

    setSelectionMode(mode) {
      return this.auiGrid.setSelectionMode(mode);
    },
    /*
            정렬(Sorting)을 설정하고 실행합니다.
            파라메터 설명
            sortingInfo (Array) : 정렬 실행 시킬 정보를 담은 배열
            onlyLastDepthSorting (Boolean) : 트리 그리드 인 경우 최하단 깊이(depth) 만 정렬 실행할 지 여부, 기본적으로 그리드의 onlyTreeLastDepthSorting 속성을 따름.
            예를 들어 차례로 Country, Name, Price 에 대하여 각각 오름차순, 내림차순, 오름차순 지정하고자 한다면 다음과 같이 설정하십시오.
            var sortingInfo = [];
            // 차례로 Country, Name, Price 에 대하여 각각 오름차순, 내림차순, 오름차순 지정.
            sortingInfo[0] = { dataField : "country", sortType : 1 }; // 오름차순 1
            sortingInfo[1] = { dataField : "name", sortType : -1 }; // 내림 차순 -1
            sortingInfo[2] = { dataField : "price", sortType : 1 };
            AUIGrid.setSorting(myGridID, sortingInfo);
            위와 같이 원하는 개수만큼 다중 정렬 및 단일 정렬 sortingInfo 배열을 만들어 setSorting 파라메터로 지정하십시오.
        */

    setSorting(sortingInfoArr, onlyLastDepthSorting) {
      return this.auiGrid.setSorting(sortingInfoArr, onlyLastDepthSorting);
    },
    /*
            그리드 데이터를 XML로 설정합니다.
            파라메터 설명
            xmlData (Object) : 그리드가 표현할 XML 데이터
            tagName (String) : XML 에서 개별 행(row)을 구성하는 태그명을 지정합니다.
            예를 들어 "<item><col1>1</col1><col2>2</col2></item>" 과 같이 구성된 XML 인 경우 tagName 으로 "item" 을 지정하십시오.(기본값:"row")
        */

    setXmlGridData(gridData, selector) {
      return this.auiGrid.setXmlGridData(gridData, selector);
    },
    /*
            그리드에 프리로더를 표시합니다
        */

    showAjaxLoader() {
      this.auiGrid.showAjaxLoader();
    },
    /*
            그리드 칼럼을 숨기기 한 경우, 원래 설정한 칼럼 모두를 보이는 상태로 만듭니다.
        */

    showAllColumns() {
      this.auiGrid.showAllColumns();
    },
    /*
            주어진 파라메터(dataField)에 맞게 출력된 그리드 칼럼을 보이도록 지정합니다.
            복수의 칼럼을 보이도록 지정하고자 한다면 배열로 설정하십시오. (예: ["name", "country", "product"] )
            파라메터 설명
            dataField (String or Array) : 칼럼의 데이터 필드명(들)
        */

    showColumnByDataField(dataField) {
      return this.auiGrid.showColumnByDataField(dataField);
    },
    /*
            그리드에 메세지를 출력시킵니다.
            파라메터 설명
            msgHTML (String) : 그리드에 표시될 메세지를 포함한 HTML 구문입니다.
            만약 데이터가 존재하지 않아 데이터가 없다는 메세지를 출력시키는 예는 다음과 같습니다.
            AUIGrid.showInfoMessage(myGridId, "<div>출력할 데이터가 없습니다.</div>");
        */

    showInfoMessage(msgHTML) {
      this.auiGrid.showInfoMessage(msgHTML);
    },
    /*
            계층형 그리드(트리 그리드)인 경우 주어진 depth 까지만 Open 하여 보이도록 지정합니다.
            깊이(depth) 는 Root 가 1에 해당되며 하위 브랜치로 내려갈 수록 1씩 증가합니다.
            파라메터 설명
            depth (Number) : 표현하고자 하는 계층 깊이(depth)
        */

    showItemsOnDepth(depth) {
      return this.auiGrid.showItemsOnDepth(depth);
    },
    /*
            지정한 특정 셀에 메세지를 출력합니다.
            파라메터 설명
            rowIndex (Number) : 행 인덱스
            columnIndex (Number) : 칼럼 인덱스
            message (String) : 행, 열로 대표되는 셀에 출력할 메시지
        */

    showToastMessage(rowIndex, columnIndex, msg) {
      return this.auiGrid.showToastMessage(rowIndex, columnIndex, msg);
    },
    /*
            그리드 이벤트 핸들링을 마무리 짓습니다. 즉, 언바인딩하는 메소드입니다.
            파라메터 설명
            type : (String or Array) 언바인딩하고자 하는 이벤트 유형
            예를 들면 cellClick 이벤트를 언바인당하고자 하는 경우 다음과 같습니다.
            AUIGrid.unbind(myGridID, "cellClick");
        */

    unbind(name, func) {
      return this.auiGrid.unbind(name, func);
    },
    /*
            편집 가능한 그리드에서 enableUndoRedo=true 설정한 경우, 실행 취소(Undo) 를 실행합니다.
        */

    undo() {
      this.auiGrid.undo();
    },
    /*
            실행 취소(Undo) 가 가능한지 여부를 반환합니다.
            Return : (Boolean) 실행 취소 가능 여부
        */

    undoable() {
      return this.auiGrid.undoable();
    },
    /*
            그리드 셀의 내용을 갱신합니다.
            그리드 셀의 내용 갱신의 의미는 현재 출력되고 셀의 텍스트를 재처리하여 출력시킵니다.
            예를 들어 특정 칼럼에 labelFunction, formatString 등이 정의 되어 있다면, 해당 로직을 다시 실행해서 셀에 출력 시킵니다.
            따라서 labelFunction 에 전역 변수를 참고하고 있을 경우, 전역 변수의 값이 변했을 때 사용하면 유효합니다.
            기존 속성의 변경에 반응하지 않습니다. 기존 속성 변경을 한 경우 refresh 메소드를 사용하십시오.
            refresh 메소드를 불필요하게 자주 호출하지 마십시오. 성능에 영향을 미칩니다.
        */

    update() {
      this.auiGrid.update();
    },
    /*
            그리드 전체 데이터를 대상으로 지정한 dataField 의 값을 지정한 value 로 모두 변경합니다.
            updateAllToValue 메소드는 그리드 전체의 특정 필드를 일괄적으로 변경할 수 있습니다.
            updateAllToValue 로 값을 변경할 때 updateRow 이벤트 발생지 않고, cellEditedMark 와 stateCoulumn 에 수정 표시가 나타나지 않습니다.
            뿐만 아니라 getEditedRowItems, getEditedRowColumnItems 메소드로 수정된 행을 얻을 수 없습니다. getGridData 메소드를 활용하여 전체 데이터를 얻어야 합니다.
            행 전체에 대하여 특정 필드를 일괄적으로 변경하고자 할 때 사용하십시오. 가장 빠르게 행 전체의 특정 필드를 변경합니다.
            파라메터 설명
            dataField : (String) 데이터 필드 명
            value : (Object) 변경할 값
            Also See : updateRowBlockToValue
        */

    updateAllToValue(dataField, value) {
      return this.auiGrid.updateAllToValue(dataField, value);
    },
    /*
            그리드 행(row) 아이템을 수정합니다.
            그리드의 속성 editable 과 무관하게 이 메소드를 통해 아이템을 수정할 수 있습니다.
            때로는 사용자가 그리드 상에서 직접 수정을 못하게 막고(editable=false) 개발자가 의도하는 방향으로 수정을 해야 할 때가 있습니다.
            그런 경우 editable=false 이지만, 이 메소드를 통해 행 수정을 외부에서 할 수 있습니다.
            파라메터 설명
            item (Object) : 수정하고자 하는 행 아이템
            rowIndex (Number or String) : 수정하고자 하는 행의 인덱스, , rowIndex 대신 "selectedIndex" 문자열을 설정한 경우 현재 선택된 행이 수정됩니다.
            isMarkEdited (Boolean) : 셀 수정 마커(marker) 표시를 할지 여부를 나타냅니다.(기본값 : true)
            예를들어, 행인덱스(rowIndex) 5번째, 칼럼의 dataField=name 을 "안녕하세요" 로 바꾸고자 한다면..
            var item = { name : "안녕하세요" };
            AUIGrid.updateRow(myGridID, item, 5);
        */

    updateRow(item, rowIndex, isMarkEdited) {
      return this.auiGrid.updateRow(item, rowIndex, isMarkEdited);
    },
    /*
            지정한 다수의 행을 대상으로 지정한 dataFields(단수 or 복수)의 값을 일괄적으로 모두 변경합니다.
            다수의 행을 빠르게 변경할 뿐만 아니라 getEditedRowItems, getEditedRowColumnItems 메소드를 통하여 수정된 행으로 얻을 수 있습니다.
            파라메터 설명
            startRowIndex : 시작 행 인덱스
            endRowIndex : 종료 행 인덱스
            dataFields : (String or Array) 데이터 필드 명
            values : (Object or Array) 변경할 값
            dataFields 와 values 를 배열로 삽입하면 블록 단위의 행 일괄 수정이 가능합니다.
            // 0~100 행의 name 필드를 "Anna" 로 일괄 수정
            AUIGrid.updateRowBlockToValue(myGridID, 0, 100, "name", "Anna");

            // 0~100 행의 name, country 필드를 각각 "Anna", "Korea" 로 일괄 수정
            AUIGrid.updateRowBlockToValue(myGridID, 0, 100, ["name", "country"], ["Anna", "Korea"]);

            // 0~100 행의 name 필드를 "Anna", "John", "Kim" 이 3행마다 반복되게 일괄 수정
            AUIGrid.updateRowBlockToValue(myGridID, 0, 100, "name", [["Anna"], ["John"], ["Kim"]]);

            // 0~100 행의 name, country 필드를 블럭으로 일괄 수정
            AUIGrid.updateRowBlockToValue(myGridID, 0, 100, ["name", "country"], [["Anna", "USA"], ["John", "UK"], ["Kim", "Korea"]]);
        */

    updateRowBlockToValue(start, end, dataField, value) {
      this.auiGrid.updateRowBlockToValue(start, end, dataField, value);
    },
    /*
            그리드 rowIdField 의 값에 해당되는 행을 수정합니다.(rowIdField 속성 설정 필수)
            그리드의 속성 editable 과 무관하게 이 메소드를 통해 아이템을 수정할 수 있습니다.
            때로는 사용자가 그리드 상에서 직접 수정을 못하게 막고(editable=false) 개발자가 의도하는 방향으로 수정을 해야 할 때가 있습니다.
            그런 경우 editable=false 이지만, 이 메소드를 통해 행 수정을 외부에서 할 수 있습니다.
            파라메터 설명
            items (Array or Object) : 복수 또는 1개의 행을 업데이트 합니다.
            isMarkEdited (Boolean) : 셀 수정 마커(marker) 표시를 할지 여부를 나타냅니다.(기본값 : true)
            기존 데이터 양이 수만행 이상이라면 전체 데이터 갱신(setGridData) 하는게 성능면에서 유리합니다.
            예를 들어 rowIdField 를 id 로 설정한 경우, id 가 20 인 행을 찾아 특정 셀(price, name 2개만) 업데이트 하고자 한다면 다음과 같습니다.
            var item = { id : 20, price : 2000, name : "우리" }; // ID 가 20인 행을 찾아 price 2000, name 우리로 변경
            AUIGrid.updateRowsById(myGridID, item); // 1개 업데이트
        */

    updateRowsById(items, isMarkEdited) {
      return this.auiGrid.updateRowsById(items, isMarkEdited);
    },
    validateChangedGridData(dataFields, msg) {
      return this.auiGrid.validateChangedGridData(dataFields, msg);
    },
    /*
            그리드 데이터의 필드들 중 빈값(undefined, null, "")에 해당되는 값이 있는지 검사합니다.
            사용자가 반드시 입력해야 하는 값이 있다면 이 메소드로 체크 할 수 있습니다.
            빈값에 해당되는 값이 존재한다면 해당 셀에 지정된 메세지를 띄우고 값을 입력 하도록 요구합니다.
            파라메터 설명
            requireFields (String or Array) : 필수로 값이 있어야 하는 dataField 들. 즉, 모두 값이 채워 졌는지 체크 하고자 하는 dataField
            message (String) : 빈값, null 이 존재할 때 적용 시킬 toast alert 메세지. message 파라메터를 설정하지 않으면 toast 는 출력되지 않음.
            Return : (Boolean) 빈값 없이 모두 정상적이라면 true 반환
            // name 과 country 는 필수로 입력되어야 하는 필드임. 이것을 검사
            var isValid = AUIGrid.validateGridData(myGridID, ["name", "country"], "필수 필드는 반드시 값을 직접 입력해야 합니다.");

            // 다른 JS 에서 제공하는 toast 나 alert 으로 경고문을 띄우고자 하는 경우 다음처럼 message 파라메터 생략.
            // AUIGrid.validateGridData(myGridID, ["name", "country"]);

            if(isValid) {
            alert("정상적으로 모두 입력됨. 서버로 전송하십시오.");
            }
        */

    validateGridData(fields, msg) {
      return this.auiGrid.validateGridData(fields, msg);
    },
    // ----------------------------------------------------
    // --------------------- AUI Grid Static Util ------------
    // http://www.auisoft.net/documentation/auigrid/DataGrid/StaticUtils.html
    formatDate(value, formatString) {
      return this.auiGrid.formatDate(value, formatString);
    },
    formatNumber(value, formatString, rounding) {
      return this.auiGrid.formatNumber(value, formatString, rounding);
    },
    releaseDate() {
      return this.auiGrid.releaseDate;
    },
    version() {
      return this.auiGrid.version;
    },
    // ----------------------------------------------------
    // -------------- 사용자 정의 method ---------------------------
    /*
            softRemoveRowMode 가 true(default) 인경우
            행을 삭제해도 grid에는 남아있고 삭제되었다는 표시만 된다.
            이 경우 삭제된 행을 제외하고 삭제되지 않는 행데이터들을 가져오려면
            이 함수를 호출하면 된다.
        */
    getUnRemovedGridData() {
      let allItems = this.getGridData();
      let rowIdField = this.getProperty('rowIdField');
      let unRemovedItems = [];

      if (rowIdField !== '') {
        allItems.forEach((item) => {
          if (this.isRemovedById(item[rowIdField].toString()) === false) {
            unRemovedItems.push(item);
          }
        });

        return unRemovedItems;
      }

      return allItems;
    },
    UpdateGridDataCount() {
      if (this.auiGrid !== null) {
        this.gridDataLen = this.getRowCount();
      }
    },
    setFitColumnSizeToGrid() {
      if (this.auiGrid !== null) {
        let colSizeList = this.auiGrid.getFitColumnSizeList(true);
        this.auiGrid.setColumnSizeList(colSizeList);
      }
    },
    getXXData(rHeader, rData) {
      let dataField = '';
      if (!rHeader.dataField) {
        dataField = rHeader.children[0].children[0].children[0].dataField;
      } else {
        // 일반적인거
        dataField = rHeader.dataField;
      }

      return rData[dataField];
    },
    exportGridNoSign(exportType) {
      // access token 정보를 param에 전달하고 /api/common/export 함수에서 token 인증을 거친다.
      // 결국 서버에서 처리하고 있음.

      let fileName = this.$route.meta.title;
      fileName = this.$comm.isStrEmpty(this.excelFileName)
        ? fileName
        : this.excelFileName;
      fileName = this.$comm.isStrEmpty(fileName) ? this.name : fileName;
      // console.log(fileName, exportType);
      if (exportType === 'XLS') {
        let exportProps = {};
        if (this.auiGrid.isAvailableLocalDownload()) {
          this.auiGrid.setProp('exportURL', null);
          exportProps = {
            fileName: fileName,
            param: getAccessToken(),
            postToServer: false,
            columnSizeOfDataField: {
              smpId: 130,
              smpNm: 150,
              prodNm: 150,
              lotNo: 100,
              testNm: 150,
              prptNm: 150,
              charVal: 150,
            },
          };
          this.exportToXlsx(exportProps);
        } else {
          this.auiGrid.setProp(
            'exportURL',
            backendConfig.getUrl(selectConfig.export.url)
          );
          exportProps = {
            fileName: fileName,
            param: getAccessToken(),
            postToServer: true,
          };
          this.exportToXlsx(exportProps);
        }
      } else {
        this.exportToCsv({ fileName: fileName, param: getAccessToken() });
      }
    },

    exportGrid(exportType) {
      // access token 정보를 param에 전달하고 /api/common/export 함수에서 token 인증을 거친다.
      // 결국 서버에서 처리하고 있음.
      let fileName =
        this.$route.meta.title +
        '_' +
        this.$comm.moment(new Date()).format('YYYYMMDDHHmmss');
      fileName = this.$comm.isStrEmpty(this.excelFileName)
        ? fileName
        : this.excelFileName;
      fileName = this.$comm.isStrEmpty(fileName) ? this.name : fileName;
      // console.log(fileName, exportType);
      var rowCount = this.auiGrid.getRowCount();

      if (exportType === 'XLS' && rowCount <= 2500) {
        let exportProps = {};
        this.auiGrid.setProp(
          'exportURL',
          backendConfig.getUrl(selectConfig.export.url)
        );
        exportProps = {
          fileName: fileName,
          param: getAccessToken(),
          postToServer: true,
          exceptColumnFields: this.exceptColumnFields,
        };
        this.exportToXlsx(exportProps);
      } else {
        this.exportToCsv({ fileName: fileName, param: getAccessToken() });
      }
    },

    btnExportClickHandler(exportType) {
      this.exportGrid(exportType);
    },
    btnClickedHadnler(callbackName) {
      this.$emit(callbackName);
    },
    btnClickedErrorCallback(callbackName) {
      this.$emit(callbackName);
    },
    myBeforeSubmit(callbackName) {
      if (callbackName) {
        this.$emit(callbackName);
      }
    },
    // btnData -> btnArr에 값 전달
    setBtnArr(btns) {
      btns.forEach((btn) => {
        this.btnArr.push(this.copyBtnData(btn));
      });
    },
    setNewBtnArr(btns) {
      this.btnArr = [];
      if (btns.length > 0) {
        this.setBtnArr(btns);
      }
    },
    // 버튼데이터에 있는 모든 값들을 복사
    copyBtnData(btn) {
      let btnData = { ...this.btnData };

      btnData.visible = true;
      if (btn.visible !== undefined) {
        btnData.visible = btn.visible;
      }

      if (btn.title !== undefined) {
        btnData.title = btn.title;
      }
      if (btn.color !== undefined) {
        btnData.color = btn.color;
      }
      if (btn.actionUrl !== undefined) {
        btnData.actionUrl = btn.actionUrl;
      }
      if (btn.actionType !== undefined) {
        btnData.actionType = btn.actionType;
      }
      if (btn.icon !== undefined) {
        btnData.icon = btn.icon;
      }
      btnData.param = null;
      if (btn.isSubmit !== undefined) {
        btnData.isSubmit = btn.isSubmit;
      }
      if (btn.useSubmit !== undefined) {
        btnData.useSubmit = btn.useSubmit;
      }
      if (btn.beforeSubmit !== undefined) {
        btnData.beforeSubmit = btn.beforeSubmit;
        if (btnData.beforeSubmit) {
          btnData.myBeforeSubmit = 'myBeforeSubmit';
        }
      }
      if (btn.btnClicked !== undefined) {
        btnData.btnClicked = btn.btnClicked;
      }
      if (btn.btnClickedError !== undefined) {
        btnData.btnClickedError = btn.btnClickedError;
      }
      return btnData;
    },
    btnSubmitChange(idx, submitParam, val) {
      let submitBtns = this.btnArr.filter((t) => t.useSubmit === true);
      if (
        submitBtns !== undefined &&
        submitBtns.length > 0 &&
        submitBtns.length > idx
      ) {
        submitBtns[idx].isSubmit = val;
        submitBtns[idx].param = submitParam;
      }
    },
    getFormatDate(date) {
      var year = date.getFullYear(); // yyyy
      var month = 1 + date.getMonth(); // M
      month = month >= 10 ? month : '0' + month; // month 두자리로 저장
      var day = date.getDate(); // d
      day = day >= 10 ? day : '0' + day; // day 두자리로 저장
      var hour = date.getHours();
      var min = date.getMinutes();
      return String(String(String(String(year) + month) + day) + hour) + min;
    },
    paginateClickHandler(pageNum) {
      this.$emit('paginateClick', pageNum);
    },

    // 그리드설정 팝업창을 열고 처리.
    btnSaveGridColHandler() {
      // 현재 컬럼 레이아웃정보를 설정에 전달.
      this.gridPopupOptions.title = '그리드설정';
      this.gridPopupOptions.target = () =>
        import(`${'@/pages/common/popUserGridCol.vue'}`);
      this.gridPopupOptions.visible = true;
      this.gridPopupOptions.width = '600px';
      this.gridPopupOptions.param = {
        parentTarget: this,
        userId: this.$store.state.user.user.userId,
        menuId: this.$route.name,
        gridId: this.userGridId,
        headers: this.auiGrid.getColumnLayout(),
      };
      this.gridPopupOptions.closeCallback = this.btnSaveGridColHandlerCallBack;
    },
    btnSaveGridColHandlerCallBack(data) {
      if (data.state !== 'close') {
        this.setGridColumn(data.state);
      }
      this.gridPopupOptions.visible = false;
    },
    // 그리드 설정 정보를 읽어서 데이터처리
    setGridColumn(gbn) {
      // 저장된 정보를 가져와서 처리하는 부분.
      // 그리드저장기준 : 사용자번호 + 메뉴 + 그리드코드
      const param = {
        userId: this.$store.state.user.user.userId,
        menuId: this.$route.name,
        gridId: this.userGridId,
      };
      this.$http.url = selectConfig.gridCol.list.url;
      this.$http.type = 'GET';
      this.$http.param = param;
      this.$http.request(
        (_result) => {
          const gridColumns =
            (_result.data || null) !== null && _result.data.length > 0
              ? this.$_.clone(_result.data)
              : this.auiGrid.getColumnLayout();
          this.updateGridColumn(gridColumns, gbn);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    updateGridColumn(gridColumns, gbn) {
      // 그리드 순서처리
      gridColumns.sort(function (a, b) {
        return a.dispOrd - b.dispOrd;
      });

      let sortDispOrds = [];
      gridColumns.forEach((col) => {
        sortDispOrds.push(col.colNm);
      });

      let headers = this.$_.cloneDeep(this.headers);
      if (gbn === 'clear') {
        this.$parent.selGridColArr = this.$_.clone(headers);
      } else if (gbn === 'save' && this.dynamicColGrid) {
        if (this.$parent.selGridColArr.length > 0) {
          headers = this.$_.clone(this.$parent.selGridColArr);
        }
      }

      // 그리드 넓이, 정렬 처리
      let findCol = null;
      headers.forEach((col) => {
        findCol = gridColumns.find(
          (t) => String(t.colNm) === String(col.dataField)
        );
        if ((findCol || null) !== null) {
          col.width = Number(findCol.width);
          col.style = this.$comm.isStrEmpty(findCol.style)
            ? 'center-align'
            : findCol.style;
        }
      });
      this.auiGrid.changeColumnLayout(headers);

      // 그리드 보이기/숨기기
      gridColumns.forEach((col) => {
        col.visible === 'N'
          ? this.auiGrid.hideColumnByDataField(col.colNm)
          : this.auiGrid.showColumnByDataField(col.colNm);
      });
      // 그리드 순서반영
      this.auiGrid.setColumnOrder(sortDispOrds);
    },
    showHeaderContextMenu(event) {
      if (event.target === 'header') {
        if (
          this.nowHeaderMenuVisible &&
          this.selectedMenu.dataField === event.dataField
        ) {
          this.hideContextMenu();
          this.selectedMenu = {};
        } else {
          this.nowHeaderMenuVisible = true;
          this.selectedMenu = event;
          $('#selectedHeaderText').text(event.headerText);

          $('#headerMenu')
            .css({
              left: event.pageX - 230,
              top: event.pageY - 270,
            })
            .show();
        }
      } else {
        if (this.nowHeaderMenuVisible) {
          this.hideContextMenu();
        }
        return false;
      }
    },
    hideContextMenu() {
      if (this.nowHeaderMenuVisible) {
        // 메뉴 감추기
        // $("#headerContext").menu("destroy");
        $('#headerMenu').hide();
        this.nowHeaderMenuVisible = false;
      }
    },
    selectHeaderMenu(event) {
      if (event.target === null) return;
      const id = event.target.id || '';
      if (id === '' || id === 'selectedHeaderText') return;

      switch (id) {
        case 'item1': // 컬럼고정
          this.setFixedColumnCount(this.selectedMenu.columnIndex || 0);
          break;
        case 'item2': // 고정취소
          this.setFixedColumnCount(0);
          break;
        case 'item3': // 숨기기
          this.hideColumnByDataField(this.selectedMenu.dataField);
          break;
        case 'item4': // 보이기
          this.showAllColumns();
          break;
      }
      this.hideContextMenu();
    },
    getSaveDataObj() {
      return this.saveData;
    },
    setSaveFiles(saveData) {
      this.saveData = saveData;
    },
    getSaveFiles() {
      let returnData = {
        tempId: [],
        files: [],
      };
      let ready = this.$_.filter(this.$_.clone(this.saveData.files), {
        status: 'ready',
      });
      let tempIds = [];
      let files = [];
      if (ready && ready.length > 0) {
        this.$_.forEach(ready, (item) => {
          tempIds = this.$_.concat(tempIds, this.$_.map(item.raw, 'tempId'));
          files = this.$_.concat(files, item.raw);
        });
      }
      tempIds = this.$_.uniq(tempIds);

      returnData.tempId = tempIds;
      returnData.files = files;
      return returnData;
    },
  },
};
</script>

<style>
/* 커스텀 칼럼 스타일 정의 */
/* 헤더 메뉴 스타일 정의 */
#headerMenu {
  position: absolute;
  display: none;
  z-index: 100000;
  background: #ffffff;
  font-size: 15px;
  padding: 5px 10px;
  width: 6vw;
  overflow: visible;
}
#headerMenu > li {
  list-style-type: none;
  cursor: pointer;
}
#selectedHeaderText {
  font-weight: bold;
  text-align: center;
}

/* AUI Grid CSS 변경은 여기서 지정 */
/* 그리드 메인 외곽 DIV */
.aui-grid {
  font-size: 13px;
  border-top: 2px solid #5b5f67 !important;
  border-left: 1px solid #bcbec4 !important;
  border-right: 1px solid #bcbec4 !important;
  border-bottom: 1px solid #bcbec4 !important;
  outline: 0;
  height: null;
}
/* 편집 모드 기본 텍스트 인풋  */
.aui-grid .aui-textinputer {
  font-size: 13px;
}
/* 셀력션 행 대표 백그라운드 스타일. NTW 수정 */
.aui-grid-selection-row-bg {
  background: #ebf7ff !important;
  color: #000 !important;
  font-weight: 600;
}
/* 셀력션 행 대표 셀 이외의 백그라운드 스타일. NTW 수정 */
.aui-grid-selection-row-others-bg {
  /* background: rgba(38,43,53,0.25) !important; */
  /* background: linear-gradient(to bottom, #d6d6d6, #dadada) !important; */
  background-color: #ffffe4 !important;
  color: #000 !important;
  border-bottom-color: #dcdce3 !important;
  border-right-color: #dcdce3 !important;
  background: -webkit-linear-gradient(top, #f0f9ff, #f0f9ff) !important;
  background: -moz-linear-gradient(top, #f0f9ff, #f0f9ff) !important;
  background: -ms-linear-gradient(top, #f0f9ff, #f0f9ff) !important;
  background: -o-linear-gradient(top, #f0f9ff, #f0f9ff) !important;
  /* background: linear-gradient(to bottom, #f0f9ff, #f0f9ff) !important; */
  /* background: linear-gradient(to bottom, #B3E5FC, #B3E5FC) !important; */
  background: linear-gradient(to bottom, #d4e8fb, #d4e8fb) !important;
}
/* Row 컬럼 액티브 시 컬럼 넘버 백그라운드 칼라 */
.aui-grid-selection-row-num-column {
  background: #486088 !important;
  color: #fff !important;
  border-bottom-color: #3d537a !important;
}
/* 드랍다운리스트 렌더러 시작 */
.aui-grid-drop-list-wrapper {
  background: #fff;
}
/* 그리드 table, tr, td 기본 - 셀 기본 */
.aui-grid .aui-grid-table,
.aui-grid .aui-grid-table tr,
.aui-grid .aui-grid-table td {
  font-size: 13px; /* 그리드 폰트 사이즈 변경 */
}
/*디폴트 헤더 스타일*/
.aui-grid-default-header {
  font-weight: 600;
  background: #f1f2f4;
  /*background: -webkit-linear-gradient(top, #eaeaee, #d9d9dd);
  background: -moz-linear-gradient(top, #eaeaee, #d9d9dd);
  background: -ms-linear-gradient(top, #eaeaee, #d9d9dd);
  background: -o-linear-gradient(top, #eaeaee, #d9d9dd);
  background: linear-gradient(to bottom, #eaeaee, #d9d9dd);*/
}
/*디폴트 헤더 마우스 오버 스타일*/
.aui-grid-default-header:hover {
  background: #e9eaed;
  /*background: -webkit-linear-gradient(top, #fafafe, #e4e4eb);
  background: -moz-linear-gradient(top, #fafafe, #e4e4eb);
  background: -ms-linear-gradient(top, #fafafe, #e4e4eb);
  background: -o-linear-gradient(top, #fafafe, #e4e4eb);
  background: linear-gradient(to bottom, #fafafe, #e4e4eb);*/
}
/* 셀렉션 헤더 칼럼 스타일 */
.aui-grid-selection-header-column {
  font-weight: bold !important;
  background: -webkit-linear-gradient(top, #fafafe, #e4e4eb) !important;
  background: -moz-linear-gradient(top, #fafafe, #e4e4eb) !important;
  background: -ms-linear-gradient(top, #fafafe, #e4e4eb) !important;
  background: -o-linear-gradient(top, #fafafe, #e4e4eb) !important;
  background: linear-gradient(to bottom, #fafafe, #e4e4eb) !important;
  color: #000 !important;
}

/* 셀렉션 헤더 라인 스타일 */
.aui-grid-header-panel .aui-grid-table tr td {
  color: #333333;
  border-top: none;
  border-right: 1px solid #c8cedc;
  border-bottom: 1px solid #c8cedc;
  border-left: none;
}

/* 그리드 수평, 수직 라인 만들기 - 바디 */
.aui-grid-body-panel .aui-grid-table tr td {
  color: #333333;
  border-right: 1px solid #c8cedc;
  border-bottom: 1px solid #c8cedc;
}

/* 링크 렌더러 */
.aui-grid-link-renderer > a {
  color: #0a85e7;
  text-decoration: none;
}

/* 고정 칼럼과 일반 칼럼 경계선 */
.aui-grid-fixed-column-rule {
  background: #c8cedc;
  width: 1px;
}

/* 그리드 Row 배경색 */
.aui-grid-row-background {
  background: #fff;
}
/* 그리드 Row 다음 배경색*/
.aui-grid-alternative-row-background {
  /* background: #ffffff; */
  background: #ffffff;
}
/* 그리드 Row 체크된 배경색 */
.aui-grid-extra-checked-row {
  background: #ffffe4 !important;
}
.right-align {
  text-align: right;
}
.left-align {
  text-align: left;
}
.aui-grid-drop-list-item-wrapper {
  z-index: 9999;
}
.text-center span span label {
  font-weight: bold;
}
.aui-grid-calendar-wrapper {
  z-index: 9999;
}

/** pagination */
.pagination {
  display: inline-block;
  padding-left: 0;
  margin: 10px 0 0 0;
  border-radius: 4px;
}
.pagination > li {
  display: inline;
}
.pagination > li > a,
.pagination > li > span {
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  line-height: 1.42857143;
  color: #337ab7;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #ddd;
}
.pagination > li:first-child > a,
.pagination > li:first-child > span {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.pagination > li:last-child > a,
.pagination > li:last-child > span {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.pagination > li > a:hover,
.pagination > li > span:hover,
.pagination > li > a:focus,
.pagination > li > span:focus {
  z-index: 3;
  color: #23527c;
  background-color: #eee;
  border-color: #ddd;
}
.pagination > .active > a,
.pagination > .active > span,
.pagination > .active > a:hover,
.pagination > .active > span:hover,
.pagination > .active > a:focus,
.pagination > .active > span:focus {
  z-index: 2;
  color: #fff;
  cursor: default;
  background-color: #409eff;
  border-color: #409eff;
}
.pagination > .disabled > span,
.pagination > .disabled > span:hover,
.pagination > .disabled > span:focus,
.pagination > .disabled > a,
.pagination > .disabled > a:hover,
.pagination > .disabled > a:focus {
  color: #777;
  cursor: not-allowed;
  background-color: #fff;
  border-color: #ddd;
}
.pagination-lg > li > a,
.pagination-lg > li > span {
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.3333333;
}
.pagination-lg > li:first-child > a,
.pagination-lg > li:first-child > span {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}
.pagination-lg > li:last-child > a,
.pagination-lg > li:last-child > span {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.pagination-sm > li > a,
.pagination-sm > li > span {
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
}
.pagination-sm > li:first-child > a,
.pagination-sm > li:first-child > span {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.pagination-sm > li:last-child > a,
.pagination-sm > li:last-child > span {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.pager {
  padding-left: 0;
  margin: 20px 0;
  text-align: center;
  list-style: none;
}
.pager li {
  display: inline;
}
.pager li > a,
.pager li > span {
  display: inline-block;
  padding: 5px 14px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
}
.pager li > a:hover,
.pager li > a:focus {
  text-decoration: none;
  background-color: #eee;
}
.pager .next > a,
.pager .next > span {
  float: right;
}
.pager .previous > a,
.pager .previous > span {
  float: left;
}
.pager .disabled > a,
.pager .disabled > a:hover,
.pager .disabled > a:focus,
.pager .disabled > span {
  color: #777;
  cursor: not-allowed;
  background-color: #fff;
}
/** End pagination */

.grid-link-cell {
  color: #0a85e7 !important;
  text-decoration: none;
  cursor: pointer !important;
}
.grid-link-cell-red {
  color: red !important;
  cursor: pointer !important;
}
.grid-cell-disable {
  background-color: #80808042 !important;
  pointer-events: none;
}
.grid-cell-bold {
  color: black !important;
  pointer-events: none;
}
</style>
