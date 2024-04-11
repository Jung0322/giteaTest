<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="actClsCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="actClsCd"
            v-model="searchParam.actClsCd"
            @datachange="datachange"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            ui="bootstrap"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 활동자료 대분류 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid1"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003347')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>

    <!-- 활동자료 중분류 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid2"
          :name="gridOptions2.name"
          :headers="gridOptions2.header"
          :btns="gridOptions2.btns"
          :height="gridOptions2.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003349')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked2"
          @btnPopupClickedCallback2="btnPopupClickedCallback2"
        />
      </b-col>
    </b-row>

    <!-- 활동자료명 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid3"
          :name="gridOptions3.name"
          :headers="gridOptions3.header"
          :btns="gridOptions3.btns"
          :height="gridOptions3.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003349')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked3"
          @btnPopupClickedCallback3="btnPopupClickedCallback3"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'reference-room',
  props: {},
  data() {
    return {
      searchParam: {
        actClsCd: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'gasTypeMaster1',
        btns: [],
        header: [],
        data: [],
        height: '200',
        merge: [],
      },
      gridOptions2: {
        name: 'gasTypeMaster2',
        btns: [],
        header: [],
        data: [],
        height: '200',
        merge: [],
      },
      gridOptions3: {
        name: 'gasTypeMaster3',
        btns: [],
        header: [],
        data: [],
        height: '200',
        merge: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      actDataCdItems: [],
      actClsCdItems: [],
      tempFirstItems: {},
      tempSecondItems: {},
      useItems: [],
      editable: false,

      flag: false,
      YAuiGrid1: null,
      YAuiGrid2: null,
      YAuiGrid3: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid1 = this.$refs.yAuiGrid1;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;
    this.getList();
  },
  beforeDestroy() {},

  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      this.gridOptions.merge = [];
      this.gridOptions.header = [];
      this.gridOptions.merge.push({ index: 1, field: 'actClsNm' });

      this.gridOptions.header.push(
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'actClsNm',
          width: '14%',
          style: 'left-align',
          cellMerge: true,
        }, // 구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000916'),
          dataField: 'actDataCd',
          width: '15%',
          style: 'left-align grid-link-cell',
        }, // 대분류코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000915'),
          dataField: 'actDataNm',
          width: '15%',
          style: 'left-align',
        }, // 대분류명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '14%',
          style: 'center-align',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '14%',
          style: 'right-align',
        }, // 정렬순서
        {
          /* 작성자 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '14%',
          style: 'center-align',
        },
        {
          /* 작성일 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
          style: 'center-align',
        }
      );
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.gridOptions2.merge.push({ index: 1, field: 'pActDataNm' });
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000915'),
          dataField: 'pActDataNm',
          width: '15%',
          style: 'left-align',
          cellMerge: true,
        }, // 대분류명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002732'),
          dataField: 'actDataCd',
          width: '15%',
          style: 'left-align grid-link-cell',
        }, // 중분류코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002731'),
          dataField: 'actDataNm',
          width: '14%',
          style: 'left-align',
        }, // 중분류명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '14%',
          style: 'center-align',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '14%',
          style: 'right-align',
        }, // 정렬순서
        {
          /* 작성자 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '14%',
          style: 'center-align',
        },
        {
          /* 작성일 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
          style: 'center-align',
        },
      ];
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback2',
        },
      ];

      this.gridOptions3.merge = [];
      this.gridOptions3.header = [];
      this.gridOptions3.merge.push({ index: 1, field: 'pActDataNm' });
      this.gridOptions3.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002731'),
          dataField: 'pActDataNm',
          width: '15%',
          style: 'left-align',
          cellMerge: true,
        }, // 중분류명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003353'),
          dataField: 'actDataCd',
          width: '15%',
          style: 'left-align grid-link-cell',
        }, // 활동자료코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003350'),
          dataField: 'actDataNm',
          width: '14%',
          style: 'left-align',
        }, // 활동자료명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '14%',
          style: 'center-align',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '14%',
          style: 'right-align',
        }, // 정렬순서
        {
          /* 작성자 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '14%',
          style: 'center-align',
        },
        {
          /* 작성일 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
          style: 'center-align',
        },
      ];
      this.gridOptions3.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback3',
        },
      ];

      this.$comm.getComboItems('ACT_CLS_DATA', true).then((_result) => {
        this.actClsCdItems = _result;
      });
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.comboItems();
      this.getList();
    },
    comboItems() {
      this.$http.url = this.$format(
        selectConfig.env.gas.actDataMaster.items.url,
        'ECL01',
        null,
        null
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.actDataCdItems = this.$_.clone(_result.data);
          this.actDataCdItems.splice(0, 0, {
            actDataCd: null,
            actDataNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getList() {
      this.$http.url = selectConfig.env.gas.actDataMaster.list.url;
      this.$http.type = 'GET';
      this.searchParam.dataLvlCd = 'ECL01';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid1.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    selectedRow(data) {
      this.$http.url = selectConfig.env.gas.actDataMaster.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        dataLvlCd: 'ECL02',
        pActDataCd: data.actDataCd,
      };
      this.tempFirstItems = data;
      this.$http.request(
        (_result) => {
          this.YAuiGrid2.setGridData(this.$_.clone(_result.data));
          if (!this.flag) {
            this.tempSecondItems = {};
            this.gridOptions3.data = [];
          }
          setTimeout(() => {
            this.flag = false;
          }, 100);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    selectedRow2(data) {
      this.$http.url = selectConfig.env.gas.actDataMaster.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        dataLvlCd: 'ECL03',
        pActDataCd: data.actDataCd,
      };
      this.tempSecondItems = data;
      this.$http.request(
        (_result) => {
          this.YAuiGrid3.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./actDataFirstMaster.vue'}`);
      this.popupOptions.title = 'L0000003346'; // 활동자료 대분류
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        actDataCd: null,
      };
      this.popupOptions.closeCallback = this.closePopup1;
    },
    btnPopupClickedCallback2() {
      this.popupOptions.target = () => import(`${'./actDataSecondMaster.vue'}`);
      this.popupOptions.title = 'L0000003348'; // 활동자료 중분류
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        actDataCd: null,
      };
      this.popupOptions.closeCallback = this.closePopup2;
    },
    btnPopupClickedCallback3() {
      this.popupOptions.target = () => import(`${'./actDataThirdMaster.vue'}`);
      this.popupOptions.title = 'L0000003345'; // 활동자료
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        actDataCd: null,
      };
      this.popupOptions.closeCallback = this.closePopup3;
    },
    tableLinkClicked(data) {
      if (data === null) return;

      this.selectedRow(data.item);

      if (data.dataField === 'actDataCd') {
        this.popupOptions.target = () =>
          import(`${'./actDataFirstMaster.vue'}`);
        this.popupOptions.title = 'L0000003346'; // 활동자료 대분류
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          actDataCd: data.item.actDataCd,
        };
        this.popupOptions.closeCallback = this.closePopup1;
      }
    },
    tableLinkClicked2(data) {
      if (data === null) return;

      this.selectedRow2(data.item);

      if (data.dataField === 'actDataCd') {
        this.popupOptions.target = () =>
          import(`${'./actDataSecondMaster.vue'}`);
        this.popupOptions.title = 'L0000003348'; // 활동자료 중분류
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          actDataCd: data.item.actDataCd,
        };
        this.popupOptions.closeCallback = this.closePopup2;
      }
    },
    tableLinkClicked3(data) {
      if (data === null) return;
      if (data.dataField === 'actDataCd') {
        this.popupOptions.target = () =>
          import(`${'./actDataThirdMaster.vue'}`);
        this.popupOptions.title = 'L0000003350'; // 활동자료명
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          actDataCd: data.item.actDataCd,
        };
        this.popupOptions.closeCallback = this.closePopup3;
      }
    },
    datachange(data) {
      this.getList();
      this.gridOptions2.data = [];
      this.gridOptions3.data = [];
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    closePopup1(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.comboItems();
      this.getList();
      this.flag = true;

      if (this.tempFirstItems.actDataCd) {
        setTimeout(() => {
          this.selectedRow(this.tempFirstItems);
        }, 50);
      }
      if (this.tempSecondItems.actDataCd) {
        setTimeout(() => {
          this.selectedRow2(this.tempSecondItems);
        }, 50);
      }
    },
    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.flag = true;
      this.comboItems();

      if (this.tempFirstItems.actDataCd) {
        this.selectedRow(this.tempFirstItems);
      }
      if (this.tempSecondItems.actDataCd) {
        this.selectedRow2(this.tempSecondItems);
      }
      setTimeout(() => {
        if (data.data) {
          this.gridOptions3.data = [];
          this.tempSecondItems = {};
        }
      }, 300);
    },
    closePopup3(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.comboItems();
      if (this.tempSecondItems.actDataCd) {
        setTimeout(() => {
          this.selectedRow2(this.tempSecondItems);
        }, 50);
      }
    },
  },
};
</script>
