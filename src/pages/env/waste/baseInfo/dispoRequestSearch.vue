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
    <!-- <b-row>
      <b-col sm="12">
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <y-label label="검색" />
            <div class="float-right">
              <y-btn title="검색" color="green" @btnClicked="btnSearchClicked" />
            </div>
          </div>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="search"
                v-model="searchParam.plantCd"
                @datachange="val => {searchParam.plantCd = val, getList();}"
              ></y-plant>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="ewstDispoStCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDispoStCd"
                label="처리상태"
                :disabled="true"
                v-model="searchParam.ewstDispoStCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :range="true"
                label="요청일"
                name="reqYmdPeriod"
                default="searchParam.reqYmdPeriod"
                v-model="searchParam.reqYmdPeriod"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row> -->
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
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
          <!-- 처리상태 -->
          <y-select
            :width="8"
            :comboItems="ewstDispoStCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="ewstDispoStCd"
            label="L0000002830"
            :disabled="true"
            v-model="searchParam.ewstDispoStCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 요청일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002055"
            name="reqYmdPeriod"
            default="searchParam.reqYmdPeriod"
            v-model="searchParam.reqYmdPeriod"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 폐기물 요청 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004430')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @selectDispo="selectDispo"
          @btnSearchClicked="btnSearchClicked"
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
        ewstWasteNo: '',
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '',
        reqYmdPeriod: [],
        ewstDispoStCd: '11',
        ewstWasteNo: '',
      },
      gridOptions: {
        name: 'dispoRequestSearch',
        header: [],
        data: [],
        btns: [],
        height: '250',
      },
      editable: true,
      selectedValue: [],
      ewstDispoStCdItems: [],
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
    this.getList();
  },
  beforeDestory() {},
  methods: {
    init() {
      this.getEwstDispoStCdItems();
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '110',
          style: 'center-align',
        }, // 사업장

        {
          // 폐기물분류
          headerText: this.$comm.getLangSpecInfoLabel('L0000003120'),
          dataField: 'ewstClassNm',
          width: '160',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003102'),
          dataField: 'ewstWasteNm',
          width: '160',
          style: 'left-align',
        }, // 폐기물
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002055'),
          dataField: 'reqYmd',
          width: '120',
          style: 'center-align',
        }, // 요청일
        {
          // 요청부서
          headerText: this.$comm.getLangSpecInfoLabel('L0000002053'),
          dataField: 'reqDeptNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002057'),
          dataField: 'reqUserNm',
          width: '120',
          style: 'center-align',
        }, // 요청자
        {
          // 처리상태
          headerText: this.$comm.getLangSpecInfoLabel('L0000002830'),
          dataField: 'ewstDispoStNm',
          width: '100',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001075'),
          dataField: 'amtGenList',
          width: '100',
          style: 'right-align',
        }, // 발생량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '120',
          style: 'center-align',
        }, // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '350',
          style: 'left-align',
        }, // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'),
          dataField: 'createDt',
          width: '200',
          style: 'center-align',
        }, // 등록일
        {
          // 등록자
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '120',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'selectDispo',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          color: 'gray',
          btnClicked: 'closePopup',
        },
      ];

      this.searchUrl =
        selectConfig.env.waste.operationLog.disposalRequest.list.url;

      this.searchParam.ewstWasteNo = this.popupParam.ewstWasteNo;

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
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getEwstDispoStCdItems() {
      this.$http.url = this.$format(
        selectConfig.manage.codeMaster.getSelect.url,
        'EWST_DISPO_ST'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          }); // 전체
          this.ewstDispoStCdItems = _result.data;
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
    selectDispo(data) {
      if (this.YAuiGrid.getCheckedRowItemsAll().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001433', // 폐기물을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$emit('closePopup', {
        success: true,
        dispoRequest: this.YAuiGrid.getCheckedRowItemsAll(),
      });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
