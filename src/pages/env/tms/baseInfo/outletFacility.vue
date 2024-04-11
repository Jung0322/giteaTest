<!--
  목적 : 대기 배출구
  작성자 : khk
  Detail : 
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
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getList();
              }
            "
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            label="L0000000591"
            v-model="searchParam.mgDeptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    
    <!-- 배출구 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001143')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @btnSelect="btnSelect"
          @getList="getList"
          @btnClosePopup="btnClosePopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'outlet-facility',
  props: {
    popupParam: {
      type: Object,
      default: {
        plantCd: '',
      },
    },
  },
  data() {
    return {
      searchParam: {
        mgDeptCd: '',
        plantCd: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'outletFacility',
        header: [],
        data: [],
        btns: [],
        height: 'auto',
      },
      editable: true,
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
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.env.tms.baseInfo.tmsStation.outlet.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { /* 사업장 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm',
          width: '110',
          style: 'center-align',
        },

        { /* 관리부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'), 
          dataField: 'mgDeptNm',
          width: '130',
          style: 'center-align',
        },
        { /* 일지작성부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002282'), 
          dataField: 'deptNm',
          width: '130',
          style: 'center-align',
        },
        { /* 배출시설명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'), 
          dataField: 'eairDischFacNm',
          width: '200',
          style: 'left-align',
        },
        { /* 배출구명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'), 
          dataField: 'mainDischFacNm',
          width: '200',
          style: 'left-align',
        },
        { /* 배출구일련번호 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001150'), 
          dataField: 'eairOutletNm',
          width: '200',
          style: 'center-align',
        },
        { /* 배출구허가증상배출구번호 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001152'), 
          dataField: 'eairOutletPermitNo',
          width: '200',
          style: 'center-align',
        },
        { /* 배출구직경(m) */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001151'), 
          dataField: 'eairOutletDiam',
          width: '130',
          style: 'right-align',
        },
        { /* 배출구높이(m)  */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001146'), 
          dataField: 'eairOutletHt',
          width: '130',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002965'), 
          dataField: 'airPerdNm',
          width: '100',
          style: 'center-align',
        } /* 측정횟수 */,
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
          btnClicked: 'getList',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          color: 'color',
          btnClicked: 'btnClosePopup',
        },
      ]

      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.$_.clone(this.popupParam.plantCd);

        if (this.popupParam.plantCd !== this.$store.getters.plantCd) {
          this.searchParam.mgDeptCd = null;
        }
      }

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    btnSelect() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000301', // 선택된 배출구가 없습니다. 배출구를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (this.YAuiGrid.getCheckedRowItemsAll().length > 1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'L0000005776', // 하나의 배출구만 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.btnClosePopup(this.YAuiGrid.getCheckedRowItemsAll());
    },
    btnClosePopup(data) {
      if (!data) {
        data = 'CLOSE';
      }
      this.$emit('closePopup', data);
    },
  },
};
</script>
