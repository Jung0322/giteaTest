<!--
  목적 : 폐기물-폐기물 처리/운반업체 검색
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 업체명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001957"
            name="ewstDispoCoNm"
            v-model="searchParam.ewstDispoCoNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            검색
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClicked" />  
            닫기
            <y-btn title="L0000000881" @btnClicked="closePopup" /> 
          </div>
           폐기물 처리/운반업체 목록 
          <y-data-table
            ref="dataTable"
            label="L0000004429"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
          />
        </b-col>
      </b-col>
    </b-row> -->
    <b-row>
      <b-col sm="12" class="h100p">
        <!-- 폐기물 처리/운반업체 목록  -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004429')"
          :useExcelExport="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnSearch="btnSearchClicked"
          @closePopup="closePopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'dispo-company-search',
  props: {
    popupParam: {
      type: Object,
      default: {
        dispoFreightYn: '',
      },
    },
  },
  data() {
    return {
      searchParam: {
        useYn: 'Y',
        dispoYn: '',
        freightYn: '',
        dispoFreightYn: [],
        ewstDispoCoNm: '',
      },
      gridOptions: {
        header: [],
        data: [],
        btns: [],
        height: '250',
      },
      dispoFreightYnItems: [],
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      // 선택항목 설정
      setTimeout(() => {
        this.dispoFreightYnItems.push({
          code: 'dispo',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002831'),
        }); // 처리업체 L0000002831
        this.dispoFreightYnItems.push({
          code: 'freight',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002072'),
        }); // 운반업체 L0000002072
      }, 200);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // { text: '업체코드', name: 'vendorCd', width: '200px' },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001957'),
          dataField: 'vendorNm',
          width: '200px',
        }, // 업체명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005781'),
          dataField: 'bizNum',
          width: '160px',
          align: 'center',
        }, // 사업자등록번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002717'),
          dataField: 'vendorAddr',
          width: '300px',
        }, // 주소
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005780'),
          dataField: 'vendorTel',
          width: '160px',
          align: 'center',
        }, // 담당자전화번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '100px',
          align: 'center',
        }, // 정렬순서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '100px',
          align: 'center',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '500px',
        }, // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'),
          dataField: 'createDt',
          width: '200px',
          align: 'center',
        }, // 등록일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '120px',
          align: 'center',
        }, // 등록자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001697'),
          dataField: 'updateDt',
          width: '200px',
          align: 'center',
        }, // 수정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001698'),
          dataField: 'updateUserNm',
          width: '120px',
          align: 'center',
        }, // 수정자
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        }, //  닫기
      ];
      this.searchUrl = selectConfig.env.waste.baseInfo.disposalCompany.list.url;

      this.getList();
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },

    btnSearchClicked() {
      this.getList();
    },
    cellDoubleClickHandler(data) {
      console.log('1111', data);
      this.$emit('closePopup', { success: true, dispoCo: data });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
