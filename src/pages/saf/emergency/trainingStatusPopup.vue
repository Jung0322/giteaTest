<!--
  목적 : 안전 관리 > 비상대응훈련 관리 > 훈련결과 현황 팝업
  Detail : 결제진행 상태 팝업
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004993')"
          :useExcelExport="true"
          @btnClose="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'appr-progress-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          monFlag: 'mon100',
          gubun: '',
          plantCd: '',
          year: '',
          trainTypeCd: '',
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        monFlag: '',
        gubun: '',
        plantCd: '',
        year: '',
        trainTypeCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '400',
      },
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
  },
  //* methods */
  methods: {
    init() {
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.saf.emergencyResult.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
        }, /* 사업장 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
          dataField: 'stateAnm', 
          width: '120', 
        }, /* 진행상태 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003375'), 
          dataField: 'trainTypeNm', 
          width: '150', 
        }, /* 훈련구분 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003385'), 
          dataField: 'trainYmd', 
          width: '100', 
        }, /* 훈련일 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003379'), 
          dataField: 'trainTime', 
          width: '120', 
        }, /* 훈련시간 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003378'), 
          dataField: 'trainNm', 
          width: '200',
          style: 'left-align',
        }, /* 훈련명 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003386'), 
          dataField: 'trainPlace', 
          width: '150', 
        }, /* 훈련장소 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005015'), 
          dataField: 'deptNm', 
          width: '150', 
        }, /* 주관부서 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'), 
          dataField: 'subDeptNm', 
          width: '200', 
        }, /* 대상부서 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'createUserNm', 
          width: '120', 
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'createDt', 
          width: '100', 
        }, /* 작성일 */ 

      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'btnClose',
        },  // 닫기
      ]; 
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
