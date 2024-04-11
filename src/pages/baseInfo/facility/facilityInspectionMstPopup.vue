<!--
  목적 : 시설점검 - 시설점검일정
  Detail : 시설점검일정 등록화면으로 시설유형별로 시설을 조회 및 선택하여 시설점검종류와 시설점검예정일을 등록한다.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchVisibleClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설유형 -->
          <y-select
            :width="8"
            :comboItems="comboFacilityTypeItems"
            itemText="safFacilityTypeNm"
            itemValue="safFacilityTypeCd"
            ui="bootstrap"
            name="safFacilityTypeCd"
            label="L0000001747"
            v-model="searchParam.safFacilityTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="facilityNm"
            label="L0000001743"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검부서 -->
          <y-tree-dept
            type="search"
            label="L0000002552"
            v-model="searchParam.deptCd"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              title="L0000001561"
              color="orange"
              @btnClicked="closePopup('SAVE')"
            />
            <!-- 선택 -->
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
            <!-- 닫기 -->
          </div>
          <!-- 시설 목록 -->
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :use-paging="true"
            :checkItemData="checkItemData"
            checkKey="safFacilityCd"
            v-model="facilityMstValue"
            label="L0000001738"
          >
            <el-table-column
              :selectable="selectedCheck"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-mst-popup',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        selectedFacilityMstValue: [], // 선택 된 설비
      }),
    },
  },
  data: () => ({
    searchParam: {
      safFacilityTypeCd: '', // 설비유형코드
      deptCd: '', // 관리부서 코드
      facilityNm: '', // 설비명
      processCd: '', // 공정
    },
    gridOptions: {
      header: [],
      data: [],
      height: '350',
    },
    checkItemTempData: [],
    checkItemData: [],
    baseWidth: 9,
    editable: false,
    comboFacilityTypeItems: [], // 설비유형
    comboDeptItems: [], // 관리부서
    comboProcessItems: [], // 공정
    facilityMstValue: [], // 체크된 설비목록
    searchUrl: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
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
          text: 'L0000000515' /* 공정 */,
          name: 'processNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000001597' /* 설비유형 */,
          name: 'safFacilityTypeNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000001618' /* 설비코드 */,
          name: 'safFacilityCd',
          width: '130px',
          align: 'center',
        },
        {
          text: 'L0000001596',
          name: 'facilityNm',
          width: '250px',
        } /* 설비명 */,
        {
          text: 'L0000005410',
          name: 'deptNm',
          width: '150px',
        } /* 설비관리부서 */,
        {
          text: 'L0000002882' /* 최근설비법정점검일 */,
          name: 'lawChkYmd',
          width: '160px',
          align: 'center',
        },
        {
          text: '설비법정점검예정일' /* 설비법정점검예정일 */,
          name: 'lawChkSchYmd',
          width: '160px',
          align: 'center',
        },
        {
          text: 'L0000002883' /* 최근설비자체점검일 */,
          name: 'selfChkYmd',
          width: '160px',
          align: 'center',
        },
        {
          text: 'L0000005411' /* 설비자체점검예정일 */,
          name: 'selfChkSchYmd',
          width: '160px',
          align: 'center',
        },
      ];
      this.getProcessNoItems(); // 공정
      this.getComboFacilityTypeItems(); // 설비유형
      this.getList();
    },
    selectedCheck() {
      return this.editable;
    },
    /**
     * 공정 조회
     */
    getProcessNoItems() {
      this.$http.url = selectConfig.manage.process.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            processNo: 0,
            processNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); /* 전체 */
          this.comboProcessItems = _result.data;
          this.searchParam.processNo = 0;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 설비유형 조회
     */
    getComboFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.comboFacilityTypeItems = this.$_.clone(_result.data);
          this.comboFacilityTypeItems.splice(0, 0, {
            safFacilityTypeCd: '',
            safFacilityTypeNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
          // this.searchParam.safFacilityTypeCd = '';
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 설비 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
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
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === 'SAVE') data = this.facilityMstValue;
      this.$emit('closePopup', data);
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
