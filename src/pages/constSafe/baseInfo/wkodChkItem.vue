<!--
  목적 : 작업허가서 항목 관리
  Detail : 작업허가서 항목 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업종류 -->
          <y-select
            :width="8"
            :comboItems="comboWkodKindItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002422"
            name="wkodKindCd"
            v-model="searchParam.wkodKindCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="comboUseYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 항목명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003205"
            name="chkItemNm"
            v-model="searchParam.chkItemNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003200')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          @cellClick="cellClickHandler"
          @btnCreate="btnPopupClickedCallback"
          @btnSearch="getList"
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
  name: 'wkod-chk-item',
  props: {},
  data() {
    return {
      wkodChkItem: {
        plantCd: null,
        chkItemNo: '',
        wkodKindCd: null,
        chkItemNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      searchParam: {
        plantCd: null,
        wkodKindCd: '',
        chkItemNm: '',
        useYn: 'Y',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'constSafeBaseInfoWkodChkItem',
        header: [],
        data: [],
        height: '420',
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
      editable: true,
      updateMod: false,
      isInsert: false,
      isEdit: false,
      // comboWkodDptyItems: [],
      comboWkodKindItems: [],
      comboDetailWkodDptyItems: [],
      comboDetailWkodKindItems: [],
      radioItems: null,
      searchUrl: '',
      comboUseYnItems: [],
    };
  },
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.saf.wkodChkItem.list.url;

      this.comboUseYnItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') },
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') },
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') },
      ];
      this.radioItems = [
        { useYn: 'Y', useName: this.$comm.getLangSpecInfoLabel('L0000001440') },
        { useYn: 'N', useName: this.$comm.getLangSpecInfoLabel('L0000001063') },
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002422'),
          dataField: 'wkodKindNm',
          width: '14%',
        }, // 작업종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003205'),
          dataField: 'chkItemNm',
          width: '24%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 항목명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '14%',
        }, // 정렬순서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '14%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnCreate',
          visible: this.editable,
        }, //  신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
      ];
      // 작업종류
      this.$comm.getComboItems('SAF_WKOD_KIND', true).then((_result) => {
        _result.push({
          code: 'W997',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003612'),
        });
        _result.push({
          code: 'W998',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003613'),
        });
        _result.push({
          code: 'W999',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003614'),
        });
        this.comboWkodKindItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'chkItemNm') return;

      if (event.item === null || event.item === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./wkodChkItemDetail.vue'}`);
      this.popupOptions.title = 'L0000003204'; // 항목 상세 수정/등록
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./wkodChkItemDetail.vue'}`);
      this.popupOptions.title = 'L0000003204'; // 항목 상세 수정/등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        chkItemNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /** button 관련 이벤트 **/

    getList() {
      this.$http.url = selectConfig.saf.wkodChkItem.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
