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
      </b-row>
    </y-search-box>

    <!-- 유해인자 grid-->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             선택 
            <y-btn
              v-if="popupParam.isMulti"
              title="L0000001561"
              color="orange"
              @btnClicked="btnSave"
            />
             선택 
            <y-btn v-else title="L0000001561" color="orange" @btnClicked="btnSave2" />
             검색 
              <y-btn
                title="L0000000327"
                color="green"
                @btnClicked="btnSearchClickedCallback"
              />
               닫기 
            <y-btn title="L0000000881" @btnClicked="closePopupThis" />
          </div>
           유해인자 목록 
          <y-data-table
            label="L0000002190"
            gridType="edit"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
            v-model="selectedValue"
          >
            <el-table-column
              v-if="popupParam.isMulti"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column
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
          :showRowCheckColumn="this.popupParam.isMulti"
          @closePopupThis="closePopupThis"
          @btnSave="btnSave"
          @btnSave2="btnSave2"
        />
      </b-col>
    </b-row>
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
          isMulti: false,
          // popupMode: false,
        };
      },
    },
  },
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        hazardClsCd: '',
        hazardGradCd: '',
        hazardNmKo: null,
        workEnvYn: 'Y',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'hazardSearch',
        btns: [],
        header: [],
        data: [],
        height: '350',
      },
      YAuiGrid: null,
      selectedHazard: null,
      selectedValue: [],
      editable: false,
      searchUrl: '',
      hazardClsSelItems: [],
      hazardGradSelItems: [],
      hazardGradSelAllItems: [],
    };
  },
  watch: {
    'searchParam.hazardClsCd'() {
      // 화학적인자, 물리적인자 구분 작업 후 활성화
      // if (this.searchParam.hazardClsCd === 'P') {
      //   this.hazardGradSelItems = this.$_.filter(this.hazardGradSelAllItems, {
      //     attr1: 'P',
      //   });
      // } else if (this.searchParam.hazardClsCd === 'C') {
      //   this.hazardGradSelItems = [];
      //   this.hazardGradSelItems = this.$_.filter(this.hazardGradSelAllItems, {
      //     attr1: 'C',
      //   });
      // } else {
      //   this.hazardGradSelItems = this.$_.clone(this.hazardGradSelAllItems);
      // }

      this.hazardGradSelItems.splice(0, 0, {
        code: '',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
      });

      if (
        this.$_.findIndex(this.hazardGradSelItems, {
          code: this.searchParam.hazardGradCd,
        }) === -1
      ) {
        this.searchParam.hazardGradCd = '';
      }
    },
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
      // URL 셋팅
      this.searchUrl = selectConfig.hea.hazard.list.url;

      this.editable = this.$route.meta.editable;

      // 유해인자 대분류
      this.getComboItems('WORK_AREA_GRADE');
      // 유해인자 분류
      this.getComboItems('HEA_HAZARD_CLASS');

      this.getDataList();

      // 유해인자 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002189'),
          dataField: 'hazardClsNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002191'),
          dataField: 'hazardGradNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002197'),
          dataField: 'hazardNmKo',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002196'),
          dataField: 'hazardNmEn',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYn',
          width: '20%',
        },
      ];

      // <b-col sm="12" class="px-0">
      //     <div slot="buttonGroup" class="float-right mb-1">
      //        선택
      //       <y-btn
      //         v-if="popupParam.isMulti"
      //         title="L0000001561"
      //         color="orange"
      //         @btnClicked="btnSave"
      //       />
      //        선택
      //       <y-btn v-else title="L0000001561" color="orange" @btnClicked="btnSave2" />
      //        검색
      //         <y-btn
      //           title="L0000000327"
      //           color="green"
      //           @btnClicked="btnSearchClickedCallback"
      //         />
      //          닫기
      //       <y-btn title="L0000000881" @btnClicked="closePopupThis" />
      //     </div>
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSave',
          visible: this.popupParam.isMulti,
        },
        {
          title: '체크',
          color: 'orange',
          btnClicked: 'btnSave2',
          visible: !this.popupParam.isMulti,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopupThis',
        },
      ];
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
            this.hazardGradSelItems = [];
            this.searchParam.hazardGradCd = '';
            this.hazardGradSelAllItems = this.$_.clone(_result.data);
            this.hazardGradSelItems = this.$_.clone(_result.data);
            this.hazardGradSelItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
          } else if (comCode === 'WORK_AREA_GRADE') {
            this.hazardClsSelItems = this.$_.clone(_result.data);
            this.hazardClsSelItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 유해인자 그리드
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

    btnSave() {
      let checkingData = this.YAuiGrid.getCheckedRowItems();
      if (!checkingData || (checkingData && checkingData.length === 0)) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000470', // 유해인자를 선택하세요.
          type: 'info', // success / info / warning / error
        });
        return;
      }
      this.closePopupThis(checkingData);
    },

    btnSave2() {
      if (!this.selectedWorker) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000470', // 유해인자를 선택하세요.
          type: 'info', // success / info / warning / error
        });
      } else {
        this.closePopupThis(this.selectedHazard);
      }
    },

    selectedRow(data) {
      if (this.popupParam.isMulti) return;
      this.selectedHazard = data;
    },
    rowDoubleClicked(data) {
      if (this.popupParam.isMulti) {
        return;
      }
      this.closePopupThis(data);
    },
    /** /validation checking **/

    /** Button Event **/
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 검색박스숨기기
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) {
        this.searchArea.title = 'L0000000329'; // 검색박스숨기기
      } else this.searchArea.title = 'L0000003907'; // 검색박스보이기

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
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
