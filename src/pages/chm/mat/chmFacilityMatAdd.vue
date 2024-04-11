<!--
  목적 : 재고현황
  작성자 : kdh
  Detail : 저장/보관 위치에 따른 재고현황을 보는 화면
   1. 위험물에 따른 허가량을 선정
   2. 저장위치에 따른 자재의 재고량을 확인
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row sm="12">
      <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
        <!-- 총허가량(kg) -->
        <y-number
          :width="8"
          :disabled="true"
          :editable="editable"
          ui="bootstrap"
          label="L0000002877"
          name="allPermitAmt"
          v-model="storageFacilityManagement.allPermitAmt"
        ></y-number>
      </b-col>
      <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
        <!-- 총허가량 대비 재고량비율(%) -->
        <y-text
          :width="8"
          :disabled="true"
          :editable="editable"
          ui="bootstrap"
          label="L0000002876"
          name="allPermitAmtPercent"
          v-model="allPermitAmtPercent"
        ></y-text>
      </b-col>
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <el-tag v-if="!storageFacilityManagement.matStrgCd" size="medium" type="danger">
            <!-- 먼저 위치정보를 입력하세요. -->
            <i class="el-icon-warning"></i> {{ $comm.getLangSpecInfoLabel('L0000003845') }}
          </el-tag>
          <!-- 위험물 허가량 추가 -->
          <y-btn
            v-if="storageFacilityManagement.matStrgCd&&editable"
            title="L0000002138"
            color="orange"
            @btnClicked="OpenPopup"
          />
          <!-- 위험물 허가량 제외 -->
          <y-btn
            v-if="storageFacilityManagement.matStrgCd&&editable"
            title="L0000002137"
            color="red"
            @btnClicked="removeDgr"
          />
        </div>
        <!-- 특정위험물에 대한 허가량 및 재고량 비율(%) 목록 -->
        <y-data-table
          label="L0000003024"
          ref="dataTable"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :useRownum="false"
          v-model="selectedValue"
          :popMode="true"
        >
          <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
        </y-data-table>
      </b-col>
    </b-row>

    <b-row sm="12" class="mt-3">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <el-tag size="medium" type="info">
            <!-- 위치정보에 따른 자재의 재고량을 보여줍니다. -->
            <i class="el-icon-info"></i> {{ $comm.getLangSpecInfoLabel('L0000002110') }}
          </el-tag>
        </div>
        <!-- 자재 재고량 현황 -->
        <y-data-table
          label="L0000002319"
          ref="dataTable"
          :height="gridOptions2.height"
          :headers="gridOptions2.header"
          :items="gridOptions2.data"
          :useRownum="false"
          :span-options="gridOptions2.merge"
          :popMode="true"
        ></y-data-table>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'chm-facility-mat-add',
  props: {
    tabDisabled: false,
    storageFacilityManagement: {
      type: Object,
      default() {
        return {
          plantCd: '',
          plantNm: '',
          matStrgCd: '',
          matStrgNm: '',
          location: '',
          allPermitAmt: '',
          storageFacilityManagementDgrPerms: [],
        }
      },
    },
  },
  data() {
    return {
      allPermitAmtPercent: '',
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      gridOptions2: {
        header: [],
        data: [],
        height: 400,
        merge: [],
      },
      selectedValue: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchMatStatusUrl: '',
    };
  },
  watch: {
    'gridOptions.data': {
      handler: function(val, oldVal) {
        this.$_.forEach(this.gridOptions.data, item => {
          if (
            this.$_.findIndex(
              this.storageFacilityManagement.storageFacilityManagementDgrPerms,
              { chmDgrAttAmtNo: item.chmDgrAttAmtNo }
            ) === -1
          ) {
            if (
              !this.storageFacilityManagement.storageFacilityManagementDgrPerms
            ) {
              this.storageFacilityManagement.storageFacilityManagementDgrPerms = [];
            }
            this.storageFacilityManagement.storageFacilityManagementDgrPerms.push(
              item
            );
          }
        });
        let deleteDate = [];
        this.$_.forEach(
          this.storageFacilityManagement.storageFacilityManagementDgrPerms,
          item => {
            if (
              this.$_.findIndex(this.gridOptions.data, {
                chmDgrAttAmtNo: item.chmDgrAttAmtNo,
              }) === -1
            ) {
              deleteDate.push(item);
            }
          }
        );
        this.$_.forEach(deleteDate, data => {
          this.storageFacilityManagement.storageFacilityManagementDgrPerms = this.$_.reject(
            this.storageFacilityManagement.storageFacilityManagementDgrPerms,
            data
          );
        });
      },
      deep: true,
    },
    'storageFacilityManagement.storageFacilityManagementDgrPerms': {
      handler: function(val, oldVal) {
        this.gridOptions.data = this.$_.clone(
          this.storageFacilityManagement.storageFacilityManagementDgrPerms
        );
        this.setAllPermitAmtPercent();
      },
    },
    'storageFacilityManagement.plantCd': {
      handler: function(val, oldVal) {
        this.getDataList(); // 자재 재고량 현황 grid
      },
    },
    'storageFacilityManagement.matStrgCd': {
      handler: function(val, oldVal) {
        this.getDataList(); // 자재 재고량 현황 grid
      },
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchMatStatusUrl = selectConfig.chm.mat.storageFacilityManagement.matStatus.url;

      this.editable = this.$route.meta.editable && !this.tabDisabled;

      this.gridOptions.data = this.$_.clone(
        this.storageFacilityManagement.storageFacilityManagementDgrPerms
      );

      // 특정위험물에 대한 허가량 및 재고량 비율(%) grid 헤더 설정
      this.gridOptions.header = [
        // 위험물 구분
        { text: 'L0000002136', name: 'regulItmNm', width: '150px', align: 'center', },
        // 세부품명
        { text: 'L0000001644', name: 'dgrNm', width: '150px', align: 'center', },
        // 위험물종류별 허가량(kg)
        { text: 'L0000002142', name: 'appAmt', width: '150px', align: 'right', },
        // 허가량 대비 비율(%)
        { text: 'L0000002875', name: 'appAmtRate', width: '130px', align: 'right', },
      ];
      // 자재 재고량 현황 grid 헤더 설정
      this.gridOptions2.header = [
        // 자재코드
        { text: 'L0000002332', name: 'matCode', width: '150px', align: 'left', },
        // 자재명
        { text: 'L0000002326', name: 'matName', width: '150px', align: 'left', },
        // 재고량
        { text: 'L0000002461', name: 'stocAmt', width: '150px', align: 'right', },
        // 단위
        { text: 'L0000000870', name: 'unit', width: '130px', align: 'right', },
        // 화학자재명
        { text: 'L0000003315', name: 'chemProdNmKr', width: '150px', align: 'left', },
        // 제조업체명
        { text: 'L0000002632', name: 'vendorNm', width: '150px', align: 'left', },
        // 비율(%)
        { text: 'L0000001373', name: 'rate', width: '150px', align: 'right', },
        // 위험물종류
        { text: 'L0000002141', name: 'regulItmNm', width: '150px', align: 'left', },
        // 화학자재 재고
        { text: 'L0000003313', name: 'chemProdStocAmt', width: '130px', align: 'right', },
        // 화학자재 비중
        { text: 'L0000003312', name: 'specificGravity', width: '140px', align: 'right', },
        // 화학자재 환산값
        { text: 'L0000003314', name: 'chemProdSpGraStocAmt', width: '140px', align: 'right', },
      ];
      this.gridOptions2.merge = [];
      this.gridOptions2.merge.push({ index: 0, field: 'matCode' });
      this.gridOptions2.merge.push({ index: 1, field: 'matCode' });
      this.gridOptions2.merge.push({ index: 2, field: 'matCode' });
      this.gridOptions2.merge.push({ index: 3, field: 'matCode' });
    },
    // 자재 재고량 현황 grid
    getDataList() {
      if (
        this.storageFacilityManagement.plantCd &&
        this.storageFacilityManagement.matStrgCd
      ) {
        this.$http.url = this.searchMatStatusUrl;
        this.$http.type = 'GET';
        this.$http.param = {
          plantCd: this.storageFacilityManagement.plantCd,
          matStrgCd: this.storageFacilityManagement.matStrgCd,
        };
        this.$http.request(
          _result => {
            this.gridOptions2.data = _result.data;
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    beforeSave() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.saveData.safFacilityCd = this.$_.clone(this.safFacilityCd);
          this.saveData.createUserId = this.$store.getters.token;
          this.saveData.updateUserId = this.$store.getters.token;

          this.saveData.chmFacilityMat = this.$_.clone(this.gridOptions.data);

          this.isSave = true;
        },
        cancelCallback: () => {
          this.isSave = false;
        },
      });
    },
    btnSaveClickedCallback(_result) {
      this.getDataList(); // 구성성분 grid
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    OpenPopup(data) {
      this.popupOptions.target = () => import(`${'./chmDgrAttAmt.vue'}`);
      this.popupOptions.title = 'L0000003808'; // '위험물 허가량';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.storageFacilityManagement.plantCd,
        plantNm: this.storageFacilityManagement.plantNm,
        matStrgCd: this.storageFacilityManagement.matStrgCd,
        matStrgNm: this.storageFacilityManagement.matStrgNm,
        location: this.storageFacilityManagement.location,
        data: this.gridOptions.data,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.$_.forEach(data.list, item => {
          let appAmt = isNaN(item.appAmt) ? 0 : this.$_.parseInt(item.appAmt);
          let chemProdSpGraStocAmt = 0;
          this.$_.forEach(this.gridOptions2.data, mat => {
            if (mat.chemprodRegulItmNo === item.chmDgrAttAmtNo) {
              chemProdSpGraStocAmt += isNaN(data.chemProdSpGraStocAmt)
                ? 0
                : this.$_.parseInt(data.chemProdSpGraStocAmt);
            }
          });
          item.appAmtRate = (chemProdSpGraStocAmt / appAmt) * 100;
        });
        this.gridOptions.data = data.list;
        // this.storageFacilityManagement.allPermitAmt =
        //   (isNaN(this.storageFacilityManagement.allPermitAmt) ||
        //   !this.storageFacilityManagement.allPermitAmt
        //     ? 0
        //     : parseFloat(this.storageFacilityManagement.allPermitAmt)) +
        //   data.allPermitAmt;
        this.storageFacilityManagement.allPermitAmt = data.allPermitAmt;
        this.setAllPermitAmtPercent();
      }
    },
    removeDgr() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000178', // '제외할 위험물을 선택하세요.',
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.selectedValue, item => {
          this.gridOptions.data = this.$_.reject(this.gridOptions.data, item);
        });

        this.storageFacilityManagement.allPermitAmt = 0;
        this.$_.forEach(this.gridOptions.data, item => {
          let val = item.appAmt;
          if (isNaN(val)) {
            val = 0;
          } else {
            val = this.$_.parseInt(val);
          }
          this.storageFacilityManagement.allPermitAmt += val;
          this.setAllPermitAmtPercent();
        });
      }
    },
    setAllPermitAmtPercent() {
      // *총허가량 대비 재고량비율=(자재명1재고량+자재명2재고량)/허가량X100
      if (this.$_.parseInt(this.storageFacilityManagement.allPermitAmt) === 0) {
        this.allPermitAmtPercent = 0;
      } else {
        if (this.gridOptions2.data.length > 0) {
          this.$_.forEach(this.gridOptions2.data, item => {
            let val = item.chemProdStocAmt;
            if (isNaN(val)) {
              val = 0;
            } else {
              val = this.$_.parseInt(val);
            }
            this.allPermitAmtPercent += val;
          });
        } else {
          this.allPermitAmtPercent = 0;
        }
        this.allPermitAmtPercent =
          (this.allPermitAmtPercent /
            this.$_.parseInt(this.storageFacilityManagement.allPermitAmt)) *
          100;
      }
    },
  },
};
</script>