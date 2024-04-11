<!--
  목적 : 대기-검사항목
  작성자 : khk
  Detail : 대기 검사항목 관리
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
            name="searchPlantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검사항목 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000000321')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @btnAdd="btnAdd"
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
  /** attributes: name, components, props, data **/
  name: 'test-item-popup',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          paramTestItems: [],
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'testItemPopup',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      searchParam: {
        plantCd: '',
        useYn: 'Y',
      },
      editable: false,
      selectedValue: [],
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
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '20%',
          style: 'center-align',
        },
        // 검사항목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000319'),
          dataField: 'eairTestItemNm',
          width: '20%',
          style: 'left-align',
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '20%',
          style: 'center-align',
        },
        // 일일배출량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004420'),
          dataField: 'limitPerDay',
          width: '20%',
          style: 'left-align',
        },
        // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '20%',
          style: 'left-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnAdd',
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
      this.searchUrl = selectConfig.env.air.baseInfo.testItem.list.url;

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // 검사항목코드 배열
          let filteredArray = this.popupParam.paramTestItems.map(
            (v) => v.eairTestItemCd
          );
          // 이미 추가된 검사항목코드 제외한 배열
          this.gridOptions.data = _result.data.filter((v) => {
            return filteredArray.indexOf(v.eairTestItemCd) === -1;
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClose() {
      this.closePopup('C');
    },
    closePopup(data) {
      this.$emit('closePopup', { data });
    },
    btnAdd() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000385', // '검사항목을 선택하세요.',
          type: 'warning',
        });
      } else {
        this.closePopup(this.YAuiGrid.getCheckedRowItemsAll());
      }
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
  },
};
</script>
