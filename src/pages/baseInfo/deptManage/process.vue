<!--
  목적 : 작업공정관리
  작성자 : khk
  Detail : 작업공정 목록 조회 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            :disabled="disabledPlant"
            type="search"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 부서 -->
          <y-tree-dept
            :disabled="disabledDept"
            label="L0000001287"
            type="search"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공정 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000515"
            name="processNmSearch"
            v-model="searchParam.processNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!-- Grid 조정 버튼 :showGridSetSave="true" -->
        <!-- Excel 출력 유무 버튼 :useExcelExport="true" -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000516')"
          :useExcelExport="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showGridSetSave="true"
          :showRowCheckColumn="editable && popupParam.multiple"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnAdd="btnAdd"
          @btnGetList="getList"
          @btnPopupClicked="btnPopupClickedCallback"
          @closePopup="closePopup"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  /** attributes: name, components, props, data **/
  name: 'process', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        popupMode: false,
        multiple: false,
        plantCd: '',
        deptCd: '',
      }),
    },
  },
  data() {
    return {
      process: {
        processCd: '',
        processNm: null,
        sortOrder: null,
        useYn: 'Y',
        plants: [],
        depts: [],
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        processNm: '', // 공정명
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processMain',
        header: [],
        data: [],
        height: 'auto',
      },

      editable: false,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      selectRow: null,
      searchUrl: '',
      detailUrl: '',
      disabledPlant: false,
      disabledDept: false,
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.manage.process.list.url;
      this.detailUrl = selectConfig.manage.process.get.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNms',
          width: '300',
          style: 'left-align',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNms',
          width: '400',
          style: 'left-align',
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '100',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '200',
        }, // 정렬순서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '200',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '200',
        } /* 작성일 */,
      ];
      const obj = {
        headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), // 공정
        dataField: 'processNm',
        width: '400',
        style: 'left-align',
      };
      if (!this.popupParam.popupMode) {
        obj.renderer = {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        };
      }
      this.gridOptions.header.unshift(obj);
    },

    mountedInit() {
      if (this.popupParam.popupMode) {
        this.gridOptions.btn = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001561'),
            color: 'orange',
            btnClicked: 'btnAdd',
          }, // 선택
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000327'),
            color: 'green',
            btnClicked: 'btnGetList',
          }, // 검색
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000881'),
            btnClicked: 'closePopup',
          }, // 닫기
        ];
      } else {
        this.gridOptions.btn = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001789'),
            color: 'orange',
            btnClicked: 'btnPopupClicked',
            visible: this.editable,
          }, // 신규등록
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000327'),
            color: 'green',
            btnClicked: 'btnGetList',
          }, // 검색
        ];
      }
      this.YAuiGrid.setBtnArr(this.gridOptions.btn);

      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
        this.disabledPlant = true;
      } else {
        this.searchParam.plantCd = this.$store.getters.plantCd;
      }
      if (this.popupParam.deptCd) {
        this.searchParam.deptCd = this.popupParam.deptCd;
        this.disabledDept = true;
      }

      this.getList();
    },
    /** /초기화 관련 함수 **/
    /** Call API service */
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    rowClicked(data) {
      if (this.popupParam.popupMode) {
        this.selectRow = data;
      } else {
        this.$http.url = this.detailUrl;
        this.$http.type = 'get';
        this.$http.param = {
          processCd: data.processCd,
        };
        this.$http.request(
          (_result) => {
            this.updateMode = true;
            this.process = _result.data;
            console.log('rowClicked', _result.data);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnAdd() {
      console.log('btnAdd');
      if (!this.popupParam.multiple) {
        if (!this.selectRow) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000115', // 공정을 선택하세요
            type: 'warning',
          });
        } else {
          this.closePopup(this.selectRow);
        }
      } else {
        if (this.YAuiGrid.getCheckedRowItems().length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000116', // 공정을 하나 이상 선택하세요
            type: 'warning',
          });
        } else {
          const selectedProcess = this.YAuiGrid.getCheckedRowItems().map(
            (rows) => rows.item
          );
          this.closePopup(selectedProcess);
        }
      }
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (!this.popupParam.popupMode) {
        if (
          event.item === null ||
          event.item === undefined ||
          event.dataField !== 'processNm'
        ) {
          return;
        }
        this.rowClicked(event.item);
        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.target = () => import(`${'./processAddDetail.vue'}`);
        this.popupOptions.title = 'L0000000526'; // 공정 상세 등록/수정
        this.popupOptions.visible = true;
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
    },
    cellDoubleClickHandler(event) {
      console.log('cellDoubleClickHandler');
      if (!this.popupParam.popupMode || this.popupParam.multiple) return;
      this.closePopup(event.item);
    },

    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      console.log('btnPopupClickedCallback');
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./processAddDetail.vue'}`);
      this.popupOptions.title = 'L0000000526'; // 공정 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        processCd: '',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopup(data) {
      this.$emit('closePopup', {
        process: data ? data : null,
      });
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
