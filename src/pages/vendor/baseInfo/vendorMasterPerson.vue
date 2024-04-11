<!--
  목적 : 협력업체관리 > 기준정보 > 협력업체사람관리
  작성자 : kdh
  Detail : 협력업체사람관리 목록/등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색조건 -->
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 성명 -->
          <y-text
            :width="9"
            ui="bootstrap"
            label="L0000001630"
            name="vendorPersonNmSearch"
            v-model="searchParam.vendorPersonNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002413')"
          :useExcelExport="false"
          :showRowCheckColumn="popupParam.multiple && editable"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnSelect="btnAdd"
          @btnSearch="getDataList"
          @btnClose="closePopup('C')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-vendor-master-person',
  props: {
    popupParam: {
      type: Object,
      default: {
        popupMode: false,
        vendorPerson: [],
        multiple: true,
        vendorCd: '',
      },
    },
  },
  data() {
    return {
      selectValue: null,
      selectVendor: [],
      searchParam: {
        workerNm: '', // 작업자명
        vendorCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 350,
      },
      editable: false,
      searchUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;

    this.getDataList();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.vendor.baseInfo.vendorMaster.worker.list.url;
      this.editable = this.$route.meta.editable;

      if (this.popupParam.vendorCd) {
        this.searchParam.vendorCd = this.popupParam.vendorCd;
        this.searchParam.vendorNm = this.popupParam.vendorNm;
      }

      // grid 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003246'), 
          dataField: 'vendorNm', 
          width: '130', 
        }, // 협력업체 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'workerNm', 
          width: '100', 
        }, // 성명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'), 
          dataField: 'birthYmd', 
          width: '100', 
        }, // 생년월일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'), 
          dataField: 'genderNm', 
          width: '100', 
        }, // 성별 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002773'), 
          dataField: 'workerJob', 
          width: '120', 
        }, // 직책/직무 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003022'), 
          dataField: 'speCommts', 
          width: '250', 
          style: 'left-align', 
        }, // 특이사항 

      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), 
          color: 'orange', 
          btnClicked: 'btnSelect',
          visible: this.popupParam.popupMode && this.editable,
        },  // 선택 
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
          visible: this.editable,
        },  // 검색 
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'btnClose',
          visible: this.popupParam.popupMode && this.editable,
        },  //  닫기
      ];
    },
    // 작업자 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event === null) return;
      if (!this.popupParam.multiple) this.selectValue = event.item;
    },
    cellDoubleClickHandler(event) {
      if (!this.popupParam.popupMode || this.popupParam.multiple) return;
      this.closePopup(event.item);
    },

    /** /validation checking **/

    /** Button Event **/
    btnAdd() {
      if (this.popupParam.multiple) {
        if (this.YAuiGrid.getCheckedRowItems().length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000817', // 작업자를 선택하세요.
            type: 'warning',
          });
        } else {
          this.selectVendor = this.YAuiGrid.getCheckedRowItems().map(rows => rows.item);
          this.closePopup(this.selectVendor);
        }
      } else {
        if (!this.selectValue) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000817', // 작업자를 선택하세요.
            type: 'warning',
          });
        } else this.closePopup(this.selectValue);
      }
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { data: data, gubun: this.popupParam.gubun });
    },
    /** /Button Event **/
  },
};
</script>