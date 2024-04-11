<!--
  목적 : 환경 > 대기 > 시설관리 > 방지시설
  작성자 : jkl
  Detail : 대기 방지시설 관리
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
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            label="L0000000591"
            name="mgDeptCd"
            v-model="searchParam.mgDeptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 방지시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001117"
            name="eairPreventFacNm"
            v-model="searchParam.eairPreventFacNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    
    <!-- 방지시설 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000001111')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @btnSelect="btnSelect"
          @btnClose="btnClose"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'prevent-base',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        plantCd: '',
        mgDeptCd: '',
        row: '',
      },
    },
  },
  data: function () {
    return {
      searchParam: {
        plantCd: '',
        mgDeptCd: '',
        eairPreventFacNm: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'createPrevention',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },

      editable: false,
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.env.air.facility.preventionN.list.url;
      this.searchParam.plantCd = this.popupParam.plantCd;
      this.searchParam.mgDeptCd = this.popupParam.mgDeptCd;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '110',
          style: 'center-align',
        },
        // 방지시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'eairPreventFacNm',
          width: '160',
          style: 'left-align',
        },
        // 관리부서
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000591'), dataField: 'mgDeptNm', width: '160', style: 'left-align', },
        // 일지작성부서
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002282'), dataField: 'deptNm', width: '160', style: 'left-align', },
        // 방지시설분류
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001118'), dataField: 'eairPreventFacClassNm', width: '160', style: 'left-align', },
        // 방지시설일련번호
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001119'), dataField: 'eairPreventFacNum', width: '160', style: 'left-align', },
        // 고유방지시설번호
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000477'), dataField: 'eairPreventFacInhNum', width: '160', style: 'left-align', },
        // 설치위치
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001626'), dataField: 'installPos', width: '160', style: 'left-align', },

        // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '100',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          color: 'gray',
          btnClicked: 'btnClose',
        },
      ];

      this.getList();
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSelect() {
      if (!this.YAuiGrid.getCheckedRowItemsAll() || this.YAuiGrid.getCheckedRowItemsAll().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'L0000005552', // '방지시설을 1개이상 선택하세요.', // 방지시설을 1개이상 선택하세요.
          type: 'warning',
        });
      } else {
        this.btnClose(this.YAuiGrid.getCheckedRowItemsAll());
      }
    },
    btnClose(data) {
      let sData = {
        data: data,
        row: this.popupParam.row,
      };
      if (!data) {
        data = 'CLOSE';
      }
      this.$emit('closePopup', sData);
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
  },
};
</script>
