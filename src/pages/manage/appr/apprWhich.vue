<!--
  목적 : 공통 > 결재 할 문서
  Detail : 결재 할 문서 조회/결재 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 결재요청일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000442"
            name="createPeriod"
            v-model="searchParam.createPeriod"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 처리여부 -->
          <y-select
            :width="8"
            :comboItems="apprYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000002833"
            name="apprYn"
            v-model="searchParam.apprYn"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 반려여부 -->
          <y-select
            :width="8"
            :comboItems="returnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001067"
            name="apprYn"
            v-model="searchParam.returnYn"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000439"
            name="apprRqstNm"
            v-model="searchParam.apprRqstNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          v-model="this.YAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000420')"
          :useExcelExport="false"
          :showRowCheckColumn="true"
          @cellClick="cellClickHandler"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @apprAll="apprAll"
        />
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
  name: 'appr-which',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
          popupName: '',
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      createPeriod: [], // 결재요청일
      apprYn: 'N', // 처리여부
      returnYn: '', // 반려여부
      apprUserId: '',
      apprRqstNm: '',
    },
    gridOptions: {
      name: 'apprWhich',
      header: [],
      data: [],
      height: '400',
    },
    selectedValue: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    isAppr: false,
    apprYnItems: [], // 처리여부
    returnItems: [], // 반려여부
    searchUrl: '',
    apprAllUrl: '',
    YAuiGrid: null,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;

    if (this.popupParam.popupMode) {
      this.gridOptions.header.splice(1, 0, {
        headerText: this.$comm.getLangSpecInfoLabel('L0000000439'),
        dataField: 'apprRqstNm',
        width: '200',
        renderer: {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        },
      });
    }
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable || this.popupParam.popupMode;
      // Url Setting
      this.searchUrl = selectConfig.manage.appr.whichList.url;
      this.apprAllUrl = transactionConfig.manage.appr.all.url;
      this.searchParam.apprUserId = this.$store.getters.token;

      this.apprYnItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003850') }, // 처리완료
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003851') }, // 미처리
      ];
      this.returnItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003852') }, // 반려
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003853') }, // 승인
      ];
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000442'), // 결재요청일
          dataField: 'createDt',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001948'), // 업무명
          dataField: 'bizNm',
          width: '180px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000439'), // 결재요청명
          dataField: 'apprRqstNm',
          width: '200',
          style: 'center-align',
          // url: 'link',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000450'), // 결재자구분
          dataField: 'apprTypeNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000440'), // 결재요청부서
          dataField: 'apprUserDeptNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000443'), // 결재요청자
          dataField: 'apprUserId',
          width: '100',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'), // 결재진행상태
          dataField: 'bizApprStepNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000453'), // 결재처리상태
          dataField: 'apprStepNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000454'), // 결재처리일시
          dataField: 'apprDt',
          width: '180',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002262'),
          color: 'orange',
          btnClicked: 'apprAll',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      if (this.$route.params && !this.popupParam.popupMode) {
        if (this.$route.params.apprYn || this.$route.params.apprYn === '') {
          this.searchParam.apprYn = this.$route.params.apprYn;
        }
        if (this.$route.params.returnYn || this.$route.params.returnYn === '') {
          this.searchParam.returnYn = this.$route.params.returnYn;
        }
        if (this.$route.params.from) {
          from = this.$route.params.from;
          today = this.$route.params.to;
        }
      }

      this.searchParam.createPeriod = [from, today];

      this.getList(); // 결재 할 목록 조회

      // this.setGridSize(); // 그리드 사이즈 조절
    },
    /** 결재 할 목록 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (this.popupParam.popupMode) {
        this.selectedValue = this.$_.clone(event.item);
      } else {
        this.selectRow = this.$_.clone(event.item);
      }
      if (event.dataField === 'apprRqstNm') {
        this.openDetailPage(event.item);
      }
    },
    openDetailPage(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprConfirm.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprParams: data,
      };
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    closeApprPopup() {
      this.$emit('closePopup');
    },
    apprAll() {
      const selectValue = this.YAuiGrid.getCheckedRowItems();

      let selectValueItems = [];
      for (let i = 0; i < this.YAuiGrid.getCheckedRowItems().length; i++) {
        selectValueItems.push(selectValue[i].item);
      }
      if (selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000510', // 결재 할 업무를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        let apprAllFlag = true;
        this.$_.forEach(selectValue, (element) => {
          if (!this.$_.isNull(element.item.apprStepCd)) {
            apprAllFlag = false;
          }
        });
        if (apprAllFlag) {
          // 일괄결재
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000511', // 일괄결재 하시겠습니까?
            type: 'info',
            // 확인 callback 함수
            confirmCallback: () => {
              this.$http.url = this.apprAllUrl;
              this.$http.type = 'PUT';
              this.$http.param = {
                apprRqstLineList: selectValueItems,
                apprUserId: this.$store.getters.token,
              };
              this.$http.request(
                (_result) => {
                  if (_result.data > 0) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000512', // 일괄결재 처리되었습니다.
                      type: 'success', // success / info / warning / error
                    });
                    this.$root.$emit('UPDATE_APPR_STATUS');
                    this.getList();
                  } else {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003396', // 에러
                      message: 'M0000000513', // 일괄결재 처리 중 오류가 발생했습니다.
                      type: 'error',
                    });
                  }
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            },
            cancelCallback: () => {},
          });
        } else {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000514', // 이미 결재 처리한 업무가 선택되었습니다.
            type: 'warning',
          });
        }
      }
    },

    /** button 관련 이벤트 **/

    btnAllApprClickedCallback() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000503', // 결재되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.getList();
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** end button 관련 이벤트 **/
    // closeApprPopup(data) {
    //   this.$emit('closeApprPopup', data);
    // },
  },
};
</script>
