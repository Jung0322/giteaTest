<!--
  목적 : 질환 기준정보 - 질환
  Detail : 질환 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 질환종류 -->
          <y-select
            :width="8"
            :comboItems="comboDisaseTypeSelectItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002785"
            name="heaDiseaseClassCd"
            v-model="searchParam.heaDiseaseClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 질환명 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            label="L0000002784"
            name="heaDiseaseNm"
            v-model="searchParam.heaDiseaseNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
            검색            <y-btn
              :action-url="searchUrl"
              :param="searchParam"
              title="L0000000327"
              color="green"
              action-type="get"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           질환 목록 
          <y-data-table
            ref="dataTable"
            :editable="editable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :useRownum="false"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            label="L0000002781"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002781')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @cellClick="cellClickHandler"
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
  name: 'y-deisease',
  props: {},
  data: () => ({
    disease: {
      heaDiseaseClassCd: null,
      heaDiseaseClassNm: '',
      heaDiseaseCd: '',
      heaDiseaseNm: '',
      remark: '',
      sortOrder: '',
      useYn: 'Y',
      updateUserId: '',
      createUserId: '',
    },
    searchParam: {
      heaDiseaseClassCd: '',
      heaDiseaseNm: '',
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
    searchArea: {
      title: '검색박스숨기기',
      show: true,
    },
    gridOptions: {
      name: 'disease',
      btns: [],
      header: [],
      data: [],
      height: 'auto',
    },
    YAuiGrid: null,
    baseWidth: 9,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    comboDisaseTypeItems: [],
    comboDisaseTypeSelectItems: [],
    radioItems: null,

    searchUrl: '',
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
    this.resizeGrid();
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      setTimeout(() => {
        // Url Setting
        this.searchUrl = selectConfig.hea.disease.list.url;

        // radio 버튼 셋팅
        this.radioItems = [
          { useYn: 'Y', useName: 'L0000001440' }, // 사용
          { useYn: 'N', useName: 'L0000001063' }, // 미사용
        ];
      }, 100);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002785'),
          dataField: 'heaDiseaseClassNm',
          width: '15%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002784'),
          dataField: 'heaDiseaseNm',
          width: '15%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002787'),
          dataField: 'heaDiseaseCd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '20%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '10%',
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
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.getComboItems('HEA_DISEASE_CLASS'); // 질환종류

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize(); // 그리드 사이즈 조절
    },

    resizeGrid() {
      let _height = window.innerHeight - 300;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'heaDiseaseNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./diseaseDetail.vue'}`);
      this.popupOptions.title = 'L0000002783'; // 질환 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./diseaseDetail.vue'}`);
      this.popupOptions.title = 'L0000002783'; // 질환 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./diseaseDetail.vue'}`);
      this.popupOptions.title = 'L0000001891'; // 안전활동목표 등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        heaDiseaseCd: '',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 공통 마스터 정보 조회 (질환종류)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.comboDisaseTypeItems = this.$_.clone(_result.data);
          this.comboDisaseTypeItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
          this.comboDisaseTypeSelectItems = this.$_.clone(_result.data);
          this.comboDisaseTypeSelectItems.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // '전체',
          });
          if (
            this.$_.findIndex(this.comboDisaseTypeSelectItems, {
              code: this.searchParam.heaDiseaseClassCd,
            }) === -1
          ) {
            this.searchParam.heaDiseaseClassCd = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** 질환 목록 조회 **/
    getList() {
      this.$http.url = selectConfig.hea.disease.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** button 관련 이벤트 **/

    /**
     * 검색 조건에 따른 데이터 조회 후 질환 목록에 리스트 적용
     * _result : backend에서 return하는 데이터
     */
    btnSearchClickedCallback(_result) {
      this.isInsert = false;
      this.gridOptions.data = this.$_.clone(_result.data);
    },

    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.updateMode = false;
      this.isInsert = false;
      this.isEdit = false;

      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
