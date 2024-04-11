<!--
  목적 : 등록/접수/조치결과 - 조사결과
  Detail : 조사결과
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 조사결과 테이블 -->
        <b-row>
          <b-col sm="12">
            <y-auigrid
              ref="yAuiGrid"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :editable="!disabled && editable"
              :label="this.$comm.getLangSpecInfoLabel('L0000004791')"
              :useExcelExport="false"
              :showRowCheckColumn="!disabled && editable"
              @cellClick="cellClickHandler"
              @cellEditEnd="cellEditEndHandler"
              @btnAdd="btnAdd"
              @btnDelete="btnDelete"
              @btnClickedError="btnClickedErrorCallback"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-accident-cause-measures',
  props: {
    research: false,
    disabled: false,
    accidentDetail: {
      type: Object,
      default: {
        safAccidentNo: 0,
        accidentCauMeass: [],
        accidentStepCd: '',
      },
    },
    immCauseNm: '',
    indCauseNm: '',
  },
  data: () => ({
    YAuiGrid: null,
    gridOptions: {
      // 조사결과
      header: [],
      data: [],
      height: '400',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '1000px',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    editable: false,
    isInsert: false,
    isEdit: false,
    searchUrl: '',
    actClsCdArr: [],
  }),
  watch: {
    'accidentDetail.safAccidentNo': function (newValue, oldValue) {
      this.getList(); // 사내사고 원인 및 대책 목록 조회
    },
    research: {
      handler: function (val, oldVal) {
        // 저장이 이루어지고 난 후에 개선요청과 즉시조치 버튼이 살아나도록 설정
        this.getList(); // 사내사고 원인 및 대책 목록 조회
      },
    },
    // 'accidentDetail.accidentStepCd': function(newValue, oldValue) {
    //   this.disabled =
    //     this.accidentDetail.accidentStepCd === 'ACCS4' ||
    //     this.accidentDetail.accidentStepCd === 'ACCS5';
    // },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.accidentDetail.accidentCauMeass = this.gridOptions.data;
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList(); // 사내사고 원인 및 대책 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // this.disabled =
      //   this.accidentDetail.accidentStepCd === 'ACCS4' ||
      //   this.accidentDetail.accidentStepCd === 'ACCS5';

      // Url Setting
      this.searchUrl = selectConfig.saf.accidentCauMeas.list.url;

      // 구분
      this.$comm.getComboItems('SAF_ACCIDENT_ACT_CLS').then((_result) => {
        this.actClsCdArr = _result;

        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
            dataField: 'actClsCd',
            width: '25%',
            renderer: {
              type: 'DropDownListRenderer',
              list: _result,
              keyField: 'code',
              valueField: 'codeNm',
            },
          }, // 구분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000760'),
            dataField: 'rootCause',
            style: 'left-align',
            width: '35%',
            editRenderer: {
              type: 'InputEditRenderer',
            },
          }, // 근본원인
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000252'),
            dataField: 'imprMeasure',
            width: '35%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
            },
          }, // 개선계획
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
            dataField: 'improvement',
            width: '15%',
            editable: false,
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: (rowIndex, columnIndex, value, item) => {},
            },
          }, // 개선요청
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002737'),
            dataField: 'request',
            width: '15%',
            editable: false,
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: (rowIndex, columnIndex, value, item) => {},
            },
          }, // 즉시조치
        ];
      });

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAdd',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelete',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        }, // 삭제
      ];
    },
    /** 사내사고 원인 및 대책 목록 조회 **/
    getList() {
      if (
        !this.accidentDetail.safAccidentNo ||
        this.accidentDetail.safAccidentNo === 0
      ) {
        this.YAuiGrid.clearGridData();
        return;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safAccidentNo: this.accidentDetail.safAccidentNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.gridOptions.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * showAccidentPopup 호출
     * 사고등록 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField !== 'improvement' && event.dataField !== 'request') {
        return;
      }

      if (!(!this.disabled && this.editable)) {
        // window.getApp.$emit('ALERT', {
        //   title: '안내',
        //   message: '쓰기권한이 없습니다.',
        //   type: 'warning', // success / info / warning / error
        // });
        return;
      }
      this.popupOptions.param = {
        safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
        imprClassCd: 'ICL44',
        refTableId: event.item ? event.item.safAccidentCauMeasNo : 0,
        flag: 'BATCH',
      };

      if (event.item.safAccidentCauMeasNo === 0) {
        return false;
      } else {
        // 개선요청
        if (event.dataField === 'improvement') {
          // 무조건 등록만 뜨도록 수정
          this.popupOptions.param.actClassCd = 'ACL02';
          this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        }
        // 즉시조치
        else if (event.dataField === 'request') {
          this.popupOptions.param.actClassCd = 'ACL01';
          this.popupOptions.title = 'L0000002740'; // 즉시조치등록
        }
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/imprActTabDetail.vue'}`);
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    cellEditEndHandler(event) {
      this.gridOptions.data = this.YAuiGrid.getGridData();
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') this.getList();
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 사내사고 원인 및 재발방지대책 행 추가
     */
    btnAdd() {
      const rootCaseDefaultText =
        this.$comm.getLangSpecInfoLabel('L0000002771') +
        ' : ' +
        this.immCauseNm +
        '\n' +
        this.$comm.getLangSpecInfoLabel('L0000000220') +
        ' : ' +
        this.indCauseNm;
      const addData = {
        actClsCd: this.actClsCdArr[0].code,
        rootCause: rootCaseDefaultText,
        imprMeasure: '',
        improvement: '',
        request: '',
        safAccidentNo: this.accidentDetail.safAccidentNo,
        safAccidentCauMeasNo: 0,
        safImprActNo: 0,
      };
      this.gridOptions.data.push(addData);
      this.YAuiGrid.addRow(addData);
    },
    /**
     * 사내사고 원인 및 재발방지대책행 삭제
     */
    async btnDelete() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      let gridData = this.YAuiGrid.getGridData();
      if (selectedRows.length > 0) {
        const promises = selectedRows.map(async (item) => {
          if (item.safAccidentCauMeasNo > 0) {
            await this.deleteItem(item);
          }
          gridData = this.$_.reject(gridData, item);
        });

        await Promise.all(promises).then(() => {
          this.gridOptions.data = gridData;
          this.YAuiGrid.setGridData(this.gridOptions.data);
        });
      }
    },
    async deleteItem(item) {
      return new Promise((resolve) => {
        this.$http.url = this.$format(
          transactionConfig.saf.accidentCauMeas.delete.url,
          item.safAccidentCauMeasNo,
          item.safAccidentNo
        );
        this.$http.type = 'DELETE';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000007', // 삭제되었습니다.
              type: 'success', // success / info / warning / error
            });
            resolve();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
