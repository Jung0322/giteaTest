<!--
  목적 : 안전보호구 > 보호구 목록
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 보호구 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 
            <y-btn title="L0000000881" @btnClicked="closePop"/>
          </div>
           보호구 목록 
          <y-data-table
            label="L0000001261"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001261')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @closePop="closePop"
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
  name: 'spe',
  props: {
    popupParam: {
      type: Object,
      default: {
        plantCd: '',
        speKindCd: '',
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '',
        speKindCd: '',
        speNm: '',
      },
      gridOptions: {
        name: 'speListPop',
        btns: [],
        header: [],
        data: [],
        height: '210',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      baseWidth: 8,
      selSpeKindCds: [], // 보호구 종류 - 검색조건
      searchUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.saf.spe.list.url;

      this.getCommonCodeList('SAF_SPE_KIND'); // 보호구 종류

      setTimeout(() => {
        this.searchParam.plantCd = this.popupParam.plantCd;
        this.searchParam.speKindCd = this.popupParam.speKindCd;
        this.getDataList(); // 보호구 grid
      }, 600);

      // 보호구 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001270'),
          dataField: 'speKindNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001275'),
          dataField: 'speNm',
          width: '40%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004396'),
          dataField: 'matCd',
          width: '15%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'giveUnitNm',
          width: '15%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePop',
        },
      ];
    },
    getCommonCodeList(codeGroup) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroup
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (codeGroup === 'SAF_SPE_KIND') {
            // 보호구 종류
            this.selSpeKindCds = this.$_.clone(_result.data);
            this.selSpeKindCds.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 보호구 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 보호구 이미지 팝업
    tableLinkClicked(header, data) {
      if (data.fileNo) {
        this.popupOptions.target = () => import(`${'./speShieldPop.vue'}`);
        this.popupOptions.title = 'L0000001269'; // 보호구 이미지
        this.popupOptions.visible = true;
        this.popupOptions.width = '70%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          fileNo: data.fileNo,
        };
        this.popupOptions.closeCallback = this.closeShieldPop;
      }
    },
    closeShieldPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closePop() {
      this.$emit('closePopup');
    },
    /** /Button Event **/
  },
};
</script>
