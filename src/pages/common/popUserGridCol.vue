<!--
  목적 : 사용자 메뉴 그리드별 컬럼정보 설정 팝업 
  작성자 : 열린기술 아키텍처팀 
  Detail :  사용자 + 메뉴번호 + 그리드아이디 별로 컬럼의 숨김여부, 넓이, 순서를 저장.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
     <b-row>
      <b-col sm="12" class="mt-3">
        <y-auigrid
          ref="yGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :editable="true"
          :useExcelExport="false"
          :height="300"
          :enableDrag="true"
          :enableDrop="true"
          :enableMultipleDrag="true"
          :enableDragByCellDrag="true"
          selectionMode="multipleCells"
          @btnUp="btnUp"
          @btnDown="btnDown"
        />
        <div slot="buttonGroup" class="popup-footer float-right">
          <!-- <y-btn :title="this.$yt('MSG_0000', '전역초기화')" v-if="this.$store.getters.user.adminYn === 'Y'" color="red" @btnClicked="btnClear('ALL')" :disabled="this.btnDisabled" />
          <y-btn :title="this.$yt('MSG_0000', '전역저장')" v-if="this.$store.getters.user.adminYn === 'Y'" color="red" @btnClicked="btnSave('ALL')" :disabled="this.btnDisabled" /> -->
          <y-btn title="전역초기화" color="red" @btnClicked="btnClear('ALL')" :disabled="this.btnDisabled" />
          <y-btn title="전역저장" color="red" @btnClicked="btnSave('ALL')" :disabled="this.btnDisabled" />
          <y-btn title="초기화" color="red" @btnClicked="btnClear" :disabled="this.btnDisabled" />
          <y-btn title="저장" color="orange" @btnClicked="btnSave" :disabled="this.btnDisabled" />
          <y-btn title="닫기" @btnClicked="closeSndPopup('close')" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'pop-user-grid-col',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        parentTarget: null,
        userNo: 0,
        menuNo: 0,
        gridId: '',
      }),
    },
  },
  data() {
    return {
      userGridCol: {
        userNo: 0,
        menuNo: 0,
        gridId: '',
        isAll: 'NO',
        type: 'NO',
        userGridCols: [],
      },
      parentHeaders: [],
      // 그리드
      gridOptions: {
        header: [],
        data: [],
        height: [],
        btns: [{
          title: '위로 (Alt + Shift + 위 키)',
          color: 'blue',
          btnClicked: 'btnUp',
        },
        {
          title: '아래로 (Alft + Shift + 아래 키)',
          color: 'blue',
          btnClicked: 'btnDown',
        }],
      },
      colAlignItems: [],
      // Grid object
      AUIGrid: null,
      btnDisabled: false,
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.AUIGrid = this.$refs.yGrid;
    this.init();
  },
  beforeDestroy() {
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    init() {
      this.userGridCol.userId = this.popupParam.userId;
      this.userGridCol.menuId = this.popupParam.menuId;
      this.userGridCol.gridId = this.popupParam.gridId;
      this.parentHeaders = this.popupParam.headers;

      this.colAlignItems = [
        { code: 'left-align', codeNm: '왼쪽' },
        { code: 'center-align', codeNm: '가운데' },
        { code: 'right-align', codeNm: '오른쪽' },
      ];

      this.setGridOption().then(() => {
        this.getList();
      })
    },
    /** 그리드 헤더, button 설정 */
    setGridOption() {
      return new Promise(resolve => {
        this.gridOptions.header = [
          {
            headerText: '컬럼',
            dataField: 'headerText',
            width: '190',
            style: 'left-align',
            editable: false,
            renderer: { type: 'TemplateRenderer' },
          },
          {
            headerText: '정렬',
            dataField: 'style',
            width: '100',
            style: 'left-align',
            renderer: {
              type: 'DropDownListRenderer',
              keyField: 'code',
              valueField: 'codeNm',
              list: this.colAlignItems,
            },
          },
          {
            headerText: '넓이',
            dataField: 'width',
            width: '80',
            editable: true,
            editRenderer: {
              editable: true,
              type: 'InputEditRenderer',
              allowNegative: false, // 마이너스 부호(-) 허용 여부
              onlyNumeric: true, // 0~9 까지만 허용
              allowPoint: false, // onlyNumeric 인 경우 소수점(.) 도 허용
              textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
              maxlength: 5, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
              autoThousandSeparator: false, // 천단위 구분자 삽입 여부
            },
          },
          {
            headerText: '보이기',
            dataField: 'visible',
            width: '80',
            editable: true,
            renderer: {
              type: 'CheckBoxEditRenderer',
              editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
              checkValue: 'Y',
              unCheckValue: 'N',
              // 체크박스 disabled 함수
              disabledFunction: function (rowIndex, columnIndex, value, isChecked, item, dataField) {
                if (item.userColDisable !== undefined && item.userColDisable === true) {
                  return true;
                }
                return false;
              },
            },
          },
        ];

        resolve();
      });
    },
    // 컬럼설정 목록 조회 (없으면 컬럼설정정보를 가져와서 사용하고, 있는경우 데이터를 사용한다.)
    getList() {
      const gridColumns = [];
      let width = null;
      let visible = null;
      let dispOrd = null;
      let oriStyle = null;
      let chageStyle = null;
      this.parentHeaders.forEach(col => {
        width = col.width === undefined || col.width === null ? '100' : String(col.width);
        visible = col.visible === undefined || col.visible === null ? 'Y' : col.visible ? 'Y' : 'N';
        dispOrd = col.columnIndex === undefined || col.columnIndex === null ? '0' : String(col.columnIndex);
        oriStyle = col.style;
        if (this.$comm.isStrEmpty(col.style)) {
          chageStyle = 'center-align';
        } else {
          if (col.style.indexOf('left-align') > -1) {
            chageStyle = col.style.substr(col.style.indexOf('left-align'), 10);
          } else if (col.style.indexOf('center-align') > -1) {
            chageStyle = col.style.substr(col.style.indexOf('center-align'), 12);
          } else if (col.style.indexOf('right-align') > -1) {
            chageStyle = col.style.substr(col.style.indexOf('right-align'), 11);
          } else {
            chageStyle = 'center-align';
          }
        }
        // 23.01.25 brpark 동적컬럼이 있다면, 동적컬럼으로 생성되는 컬럼은 숨겨준다.
        // 23.02.28 tsjang 컬럼명이 없거나 null이면 목록에 추가하지 않도록 한다
        // if (!this.popupParam.parentTarget.dynamicColGrid || (this.popupParam.parentTarget.dynamicColGrid && !col.userColVisable)) {
        if (!col.userColHide && col.headerText && col.headerText !== '' && col.headerText !== null) {
          gridColumns.push({
            colNm: col.dataField,
            width: width,
            visible: visible,
            headerText: col.headerText,
            dispOrd: dispOrd,
            userColDisable: col.userColDisable,
            oriStyle: oriStyle,
            style: chageStyle,
          });
        }
      });
      gridColumns.sort(function (a, b) {
        return a.dispOrd - b.dispOrd;
      });
      if (gridColumns.length === 0) {
        // 목록이 없다면 버튼 비활성화
        this.btnDisabled = true;
      }
      this.AUIGrid.setGridData(gridColumns);
    },
    // 설정저장
    btnSave(type) {
      if ((this.userGridCol.gridId || null) === null) {
        window.getApp.$emit('APP_REQUEST_ERROR', 'Grid정보가 누락되었습니다. 관리자에게 문의하세요.');
        return;    
      }

      this.userGridCol.isAll = 'NO';
      if (type === 'ALL') {
        this.userGridCol.isAll = 'YES';
      }
      let i = 1;
      this.userGridCol.userGridCols = this.AUIGrid.getGridData();
      this.userGridCol.userGridCols.forEach(col => {
        col.dispOrd = i++;
        col.width = isNaN(col.width) ? 100 : Number(col.width)

        // 23.02.17 brpark style지정 아래코드를 타는거면 정렬이 바뀌었다는 것
        if (!this.$comm.isStrEmpty(col.oriStyle) && col.oriStyle.indexOf(col.style) < 0) {
          // oriStyle의 정렬정보 제외한 style만 가져와서 더해준다.
          const arr = col.oriStyle.split(' ');
          const newArr = arr.length > 0 ? arr.filter(item => !item.includes('align')) : [];
          newArr.push(col.style);
          col.style = newArr.join(' ');
        }
      });
      
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message: '저장 하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = transactionConfig.gridCol.save.url;
          this.$http.type = 'POST';
          this.$http.param = this.userGridCol;
          this.$http.request(
            (_result) => {
              this.closeSndPopup('save');
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
      });
    },
    // 설정초기화
    btnClear(type) {
      this.userGridCol.isAll = 'NO';
      this.userGridCol.type = 'NO';
      if (type === 'ALL') {
        this.userGridCol.isAll = 'YES';
        this.userGridCol.type = 'ALL_INIT';
      }
      
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message: '초기화 하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(transactionConfig.gridCol.delete.url, this.userGridCol.userId, this.userGridCol.menuId, this.userGridCol.gridId, this.userGridCol.isAll, this.userGridCol.type);
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: '안내',
                message: '초기화 되었습니다.',
                type: 'info', // success / info / warning / error
              });

              this.closeSndPopup('clear');
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
      });
    },
    // 샘플정보 수정 팝업창 닫기
    closeSndPopup(state) {
      this.$emit('closePopup', { state: state, parentTarget: this.popupParam.parentTarget });
    },
    // 위로
    btnUp() {
      this.AUIGrid.moveRowsToUp();
    },
    // 아래로
    btnDown() {
      this.AUIGrid.moveRowsToDown();
    },
  },
};
</script>
