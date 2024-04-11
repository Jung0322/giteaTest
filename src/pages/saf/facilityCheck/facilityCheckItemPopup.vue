<!--
  목적 : 설비점검계획 - 설비점검계획 등록 - 점검항목 조회
  Detail : 설비점검결과 수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <div slot="buttonGroup" class="float-right mb-1">
             닫기  
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div> -->
          <!-- 설비유형별 점검 항목 목록 -->
          <!-- <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            :print="true"
            :use-paging="true"
            label="L0000001603"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :height="gridOptions.height"
            :btns="gridOptions.btns"
            :items="gridOptions.data"
            :label="this.$comm.getLangSpecInfoLabel('L0000001603')"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @closePopup="closePopup('CLOSE')"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'facility-check-item-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          plantCd: '', // 사업장
          safCheckTypeCd: '', // 설비점검종류코드
          safFacilityTypeCd: '', // 안전설비유형코드
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '', // 사업장
        safCheckTypeCd: '', // 설비점검종류코드
        safFacilityTypeCd: '', // 안전설비유형코드
      },
      gridOptions: {
        name: 'facillityCheckitemPop',
        header: [],
        data: [],
        height: '300',
      },
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
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
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.baseInfo.facilityCheckItem.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '150',
          style: 'center-align',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'), // 설비유형
          dataField: 'safFacilityTypeNm',
          width: '180',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001616'), // 설비점검종류
          dataField: 'safCheckTypeNm',
          width: '180',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001617'), // 설비점검항목명
          dataField: 'safFacilityCheckNm',
          width: '180',
          align: 'left',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '100',
          style: 'center-align',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'), // 정렬순서
          dataField: 'sortOrder',
          width: '100',
          style: 'center-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        }, // 닫기
      ];
      this.searchParam.plantCd = this.popupParam.plantCd;
      this.searchParam.safCheckTypeCd = this.popupParam.safCheckTypeCd;
      this.searchParam.safFacilityTypeCd = this.popupParam.safFacilityTypeCd;

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
