<!--
  목적 : 설비관리 > 유형별 설비관리 > 신규등록/수정 팝업 > 설비항목 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable&&!flag"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001587')"
          :useExcelExport="false"
          :showItemCount="false"
        />
      </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'facility-type-item',
  props: {
    facilityMst: {
      type: Object,
      default: {
        safFacilityTypeCd: null,
        safFacilityCd: '',
        facilityTypeItemVals: [],
      },
    },
    flag: false,
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '210',
      },
      facilityTypeItem: {
        itemValue: '',
      },
      baseWidth: 8,
      editable: false,
      searchUrl: '',
      isSubmit: false, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
    };
  },
  watch: {
    'facilityMst.safFacilityTypeCd': function(val, oldVal) {
      this.getDataList();
    },
    // 'gridOptions.data': {
    //   handler: function(val, oldVal) {
    //     this.facilityMst.facilityTypeItemVals = [];
    //     let gridData = val;
    //     this.$_.forEach(gridData, item => {
    //       if (item.itemValue) this.facilityMst.facilityTypeItemVals.push(item);
    //     });

    //     this.yAuigrid.setGridData(gridData);
    //   },
    //   deep: true,
    // },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDataList();
  },
  beforeDestroy() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.facilityMst.facilityTypeItem.url;

      this.editable = this.$route.meta.editable;

      // 설비항목 출고 grid 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001645'), 
          dataField: 'safFacilityTypeItemNm', 
          width: '20%', 
        }, // 세부항목
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002894'), 
          dataField: 'safFacilityTypeItemExplain', 
          width: '30%', 
          style: 'left-align', 
        }, // 추가설명
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001526'), 
          dataField: 'itemValue', 
          width: '20%', 
          style: 'right-align', 
          editRenderer: {
            type: 'InputEditRenderer', 
          }, 
        }, // 상세
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'remark', 
          width: '30%', 
          style: 'left-align', 
        }, // 비고
      ];
    },
    getDataList() {
      if (
        this.facilityMst.safFacilityCd !== null &&
        this.facilityMst.safFacilityTypeCd !== null
      ) {
        this.$http.url = this.searchUrl;
        this.$http.type = 'GET';
        this.$http.param = {
          safFacilityCd: this.facilityMst.safFacilityCd,
          safFacilityTypeCd: this.facilityMst.safFacilityTypeCd,
        };
        this.$http.request(
          _result => {
            console.log(_result.data);
            this.YAuiGrid.setGridData(_result.data);
            this.facilityMst.facilityTypeItemVals = _result.data;
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    checkValidation() {
      this.$validator
        .validateAll()
        .then(_result => {
          this.isSubmit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isSubmit) {
            window.getApp.emit(
              'APP_VALID_ERROR',
              'M0000000876'
              // 유효성 검사도중 에러가 발생하였습니다.
            );
          }
        })
        .catch(() => {
          this.isSubmit = false;
        });
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
    btnSaveClickedCallback(_result) {
      this.isSubmit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.emit('APP_REQUEST_SUCCESS', 'M0000000006');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSubmit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>