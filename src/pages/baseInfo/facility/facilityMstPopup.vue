<!--
  목적 : 설비점검 - 설비점검계획
  Detail : 설비점검계획 등록화면으로  설비유형별로 설비를 조회 및 선택하여 설비점검종류와 설비점검예정일을 등록한다.
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
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
            :disabled="plantDisabled"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            :disabled="deptDisabled"
            label="L0000000591"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-process
            name="processCd"
            :disabled="processDisabled"
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            v-model="searchParam.processCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설비유형 -->
          <y-tree-facility-type
            label="L0000001597"
            type="search"
            name="searchSafFacilityTypeCd"
            v-model="searchParam.safFacilityTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설비명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="facilityNm"
            label="L0000001596"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 설비 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001581')"
          :useExcelExport="false"
          :showRowCheckColumn="popupParam.multiple"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnSelect="selectFacility"
          @btnSearch="getList"
          @btnClose="closePopup"
        />
      </b-col>

      <!-- <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            
            :use-paging="true"
            :checkItemData="checkItemData"
            checkKey="safFacilityCd"
            v-model="facilityMstValue"
            label="L0000001581"
          >
            <el-table-column
              v-if="multiple"
              :selectable="selectedCheck"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col> -->
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-mst-popup',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        multiple: false,
        selectedFacilityMstValue: [], // 선택 된 설비
        plantDisabled: false,
        deptDisabled: false,
        processDisabled: false,
        plantCd: '',
        deptcd: '',
        processCd: '',
        safCheckTypeCd: '',
      }),
    },
  },
  data: () => ({
    searchParam: {
      safFacilityTypeCd: '', // 설비유형코드
      plantCd: '',
      deptCd: '', // 관리부서 코드
      facilityNm: '', // 설비명
      processCd: '', // 공정
      safCheckTypeCd: '',
      disuseYn: 'N',
    },
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    checkItemData: [],
    editable: false,
    searchUrl: '',
    selectedFacility: null,
    multiple: false,
    plantDisabled: false,
    deptDisabled: false,
    processDisabled: false,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    if (typeof this.popupParam.multiple !== 'undefined') {
      this.multiple = this.popupParam.multiple;
    }

    this.searchParam.safCheckTypeCd = this.popupParam.safCheckTypeCd;
    if (this.popupParam.plantCd) {
      this.searchParam.plantCd = this.popupParam.plantCd;
    }
    if (this.popupParam.deptCd) {
      this.searchParam.deptCd = this.popupParam.deptCd;
    }
    if (this.popupParam.processCd) {
      this.searchParam.processCd = this.popupParam.processCd;
    }

    if (this.popupParam.plantDisabled) {
      this.plantDisabled = this.popupParam.plantDisabled;
    }
    if (this.popupParam.deptDisabled) {
      this.deptDisabled = this.popupParam.deptDisabled;
    }
    if (this.popupParam.processDisabled) {
      this.processDisabled = this.popupParam.processDisabled;
    }

    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.facilityMst.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'deptNm',
          width: '11%',
        }, // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '11%',
          style: 'left-align',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '11%',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '11%',
        }, // 설비코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '16%',
          style: 'left-align',
        }, // 설비명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002882'),
          dataField: 'lawChkYmd',
          width: '11%',
        }, // 최근설비법정점검일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002883'),
          dataField: 'selfChkYmd',
          width: '11%',
        }, // 최근설비자체점검일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003797'),
          dataField: 'inspChkYmd',
          width: '11%',
        }, // 최근가동전점검일
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
        }, //  선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
        }, //  닫기
      ];
    },
    selectedCheck() {
      return this.editable;
    },
    /** 설비 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          if (
            this.popupParam.selectedFacilityMstValue &&
            this.popupParam.selectedFacilityMstValue.length > 0
          ) {
            this.checkItemData = this.popupParam.selectedFacilityMstValue;
          } else {
            this.checkItemData = [];
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(data) {
      if (this.multiple) {
        return;
      }
      this.selectedFacility = data.item;
    },
    cellDoubleClickHandler(event) {
      if (this.multiple) return;
      this.$emit('closePopup', event.item);
    },
    selectFacility() {
      if (this.multiple) {
        if (this.YAuiGrid.getCheckedRowItemsAll().length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000121', // 추가할 설비를 한 개 이상 선택하세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        }
        this.$emit('closePopup', {
          facilitys: this.YAuiGrid.getCheckedRowItemsAll(),
        });
      } else {
        this.selectFacility2();
      }
    },
    selectFacility2() {
      if (!this.selectedFacility) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: '설비를 먼저 지정하세요',
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$emit('closePopup', this.selectedFacility);
      }
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },

    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
