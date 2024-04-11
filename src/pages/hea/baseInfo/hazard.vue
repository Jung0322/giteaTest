<!--
  목적 : 유해인자
  Detail : 유해인자 검색/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유해인자 대분류 -->
          <y-select
            :width="7"
            :comboItems="hazardClsSelItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000002189"
            name="hazardClsCd"
            v-model="searchParam.hazardClsCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유해인자 분류 -->
          <y-select
            :width="7"
            :comboItems="hazardGradSelItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000002191"
            name="hazardGradCd"
            v-model="searchParam.hazardGradCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유해인자명(한글) -->
          <y-text
            :width="7"
            ui="bootstrap"
            type="search"
            label="L0000002197"
            name="hazardNmKo"
            v-model="searchParam.hazardNmKo"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 특수건강검진 관련 여부 -->
          <y-select
            :width="7"
            :comboItems="comboSpecialYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000003014"
            name="specialYn"
            v-model="searchParam.specialYn"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업환경 관련 여부 -->
          <y-select
            :width="7"
            :comboItems="comboWorkEnvYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000002436"
            name="workEnvYn"
            v-model="searchParam.workEnvYn"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 유해인자 grid-->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable && !popupParam.popupMode"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             선택 
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000001561" color="orange"
              @btnClicked="btnSelect"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             닫기 
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="closePopupThis"
            />
          </div>
           유해인자 목록 
          <y-data-table
            label="L0000002190"
            ref="dataTable"
            v-model="hazard"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
            @tableLinkClicked="tableLinkClicked"
            :use-paging="true"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002190')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @cellClick="cellClickHandler"
          @closePopupThis="closePopupThis"
          @btnSelect="btnSelect"
          @selectedRow="selectedRow"
          @cellDoubleClick="cellDoubleClickHandler"
        />
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'hazard',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
          workAreaGradeCd: '',
        };
      },
    },
  },
  data() {
    return {
      hazard: {
        hazardCd: null,
        hazardClsCd: null,
        hazardGradCd: null,
        hazardNmKo: '',
        hazardNmEn: '',
        specialYn: 'N',
        workEnvYn: 'N',
        useYn: 'Y',
        processCd: '',
        createUserId: '',
        updateUserId: '',
        hazardProcessList: [],
      },
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        hazardClsCd: '',
        hazardGradCd: '',
        hazardNmKo: null,
        specialYn: '',
        workEnvYn: '',
      },
      gridOptions: {
        name: 'hazard',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      selectedHazard: null,
      baseWidth: 8,
      editable: false,
      updateMode: false,
      searchUrl: '',
      searchCountUrl: '',
      insertUrl: '',
      editUrl: '',
      hazardClsSelItems: [],
      hazardClsInsItems: [],
      hazardGradSelItems: [],
      hazardGradInsItems: [],
      comboSpecialYnItems: [],
      comboWorkEnvYnItems: [],
      processItems: [],
      isInsert: false,
      isEdit: false,
      gridProcessOptions: {
        header: [],
        data: [],
        height: '200',
      },
      selectProcess: [],
    };
  },
  // watch: {
  //   'hazard.hazardClsCd'() {
  //     if(this.hazard.hazardClsCd === 'P') {
  //       this.
  //     }
  //   },
  // },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {},
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.hea.hazard.list.url;
      this.searchCountUrl = selectConfig.hea.hazard.count.url;

      this.editable = this.$route.meta.editable;

      setTimeout(() => {
        this.comboSpecialYnItems.push({
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        }); // 전체
        this.comboSpecialYnItems.push({
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003788'),
        }); // 관련
        this.comboSpecialYnItems.push({
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003789'),
        }); // 미관련

        this.comboWorkEnvYnItems.push({
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        }); // 전체
        this.comboWorkEnvYnItems.push({
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003788'),
        }); // 관련
        this.comboWorkEnvYnItems.push({
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003789'),
        }); // 미관련

        // 유해인자 대분류
        this.getComboItems('WORK_AREA_GRADE');
        // 유해인자 분류
        this.getComboItems('HEA_HAZARD_CLASS');

        /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
        var searchParamByCookie = this.$comm.setSearchParamByCookie();
        if (typeof searchParamByCookie !== 'undefined') {
          this.searchParam = searchParamByCookie;
        }
        this.getDataList();
        // this.setGridSize();
      }, 200);

      // 유해인자 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002189'),
          dataField: 'hazardClsNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002191'),
          dataField: 'hazardGradNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002199'),
          dataField: 'hazardCd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002197'),
          dataField: 'hazardNmKo',
          width: '20%',
          renderer: {
            type: !this.popupParam.popupMode ? 'LinkRenderer' : '',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002196'),
          dataField: 'hazardNmEn',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003016'),
          dataField: 'specialYn',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002436'),
          dataField: 'workEnvYn',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYn',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopupThis',
          visible: true,
        },
      ];
      if (this.popupParam.popupMode) {
        this.searchParam.hazardClsCd = this.popupParam.workAreaGradeCd;
      }
    },

    // 유해인자 분류
    getComboItems(comCode) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        comCode
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (comCode === 'HEA_HAZARD_CLASS') {
            this.hazardGradSelItems = this.$_.clone(_result.data);
            this.hazardGradSelItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
            this.hazardGradInsItems = this.$_.clone(_result.data);
            this.hazardGradInsItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (comCode === 'WORK_AREA_GRADE') {
            this.hazardClsSelItems = this.$_.clone(_result.data);
            this.hazardClsSelItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
            this.hazardClsInsItems = this.$_.clone(_result.data);
            this.hazardClsInsItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    // 유해인자 그리드
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.popupParam.popupMode) {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[3].visible = true;
          } else {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = false;
            this.gridOptions.btns[3].visible = false;
          }
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    btnSearchProcessClicked() {
      if (!this.editable || this.disabled) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000529'; // 공정검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.plantCd,
        deptCd: this.deptCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.process) {
        this.processCd = data.process.processCd;
        this.processNm = data.process.processNm;
      }
    },

    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (this.popupParam.popupMode) return;
      if (event.dataField !== 'hazardNmKo') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./hazardDetail.vue'}`);
      this.popupOptions.title = 'L0000002193'; // 유해인자 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./hazardDetail.vue'}`);
      this.popupOptions.title = 'L0000002193'; // 유해인자 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./hazardDetail.vue'}`);
      this.popupOptions.title = 'L0000002193'; // 유해인자 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        hazardCd: null,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    selectedRow(data) {
      if (data && this.popupParam.popupMode) {
        this.selectedHazard = data;
      }
    },
    cellDoubleClickHandler(data) {
      if (data && this.popupParam.popupMode) {
        this.closePopupThis(data);
      }
    },
    /** /validation checking **/

    /** Button Event **/
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    deleteProcess() {
      this.$_.forEach(this.selectProcess, (item) => {
        this.gridProcessOptions.data = this.$_.reject(
          this.gridProcessOptions.data,
          { processCd: item.processCd }
        );
      });
    },
    btnSelect() {
      if (!this.selectedHazard) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000414', // 목록에서 한 행을 선택하세요.
          type: 'warning',
        });
      } else {
        let checkingData = {
          item: [],
        };
        checkingData.item = this.selectedHazard;
        this.closePopupThis(checkingData);
      }
    },
    // 팝업 닫기
    closePopupThis(data) {
      if (!data) {
        data = 'CLOSE';
      }
      // 부모창에 값 전달
      this.$emit('closePopup', data);
    },
    /** /Button Event **/
  },
};
</script>
