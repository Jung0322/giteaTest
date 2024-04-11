<!--
  목적 : LOTO
  Detail : LOTO Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000126')"
          :useExcelExport="false"
          :showRowCheckColumn="true"
          :showItemCount="false"
          :showRightLabel="true"
          :rightLabel="this.$comm.getLangSpecInfoLabel('M0000001015')"
          @cellClick="cellClickHandler"
          @btnOpenClicked="openPopup"
          @btnDeleteClicked="btnDeleteClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'loto',
  props: {
    constUpdateMod: {
      type: Boolean,
      default: function () {
        return false;
      },
    },

    constSafe: {
      type: Object,
      default: function () {
        return {
          constNo: '',
          plantCd: '',
          constStepCd: '',
          constLotos: [],
        };
      },
    },
    wkodMaster: {
      type: Object,
      default: function () {
        return {
          constNo: '',
          wkodNo: '',
          plantCd: '',
          wkodStepCd: '',
          constLotos: [],
        };
      },
    },
    isConstWrite: false,
    paneName: {
      type: String,
      default: '',
    },
    authDuringAppr: false,
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'constSafeLoto',
        header: [],
        data: [],
        height: '400',
      },
      constNo: '',
      updateMod: true,
      searchUrl: '',
      deleteUrl: '',
      disabled: false,
      editable: true,
      deleteValue: null,
    };
  },
  watch: {
    // 'gridOptions.data': {
    //   handler: function(val, oldVal) {
    //     this.constSafe.constLotos = this.$_.clone(val);
    //   },
    //   deep: true,
    // },
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName() {
      this.YAuiGrid.resize(null, this.gridOptions.height);

      // if (this.wkodMaster.wkodNum !== undefined) this.disabled = true;
      // else this.disabled = false;
      // this.getList();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.setGridBtns();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.constSafe.const.getLOTO.url;
      if (this.constSafe) {
        this.editable = this.constSafe.constStepCd !== 'CONS4';
      }

      // 설비 grid 헤더
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '33%',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '33%',
          style: 'left-align grid-link-cell',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 설비명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002449'),
          dataField: 'lockLocate',
          width: '34%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 잠금위치(상세명칭 기재)
      ];

      if (this.constSafe.constNo) this.constNo = this.constSafe.constNo;
      if (this.wkodMaster.constNo) this.constNo = this.wkodMaster.constNo;
      // 입력 못 하도록 막는다.
      if (this.wkodMaster.wkodNum !== undefined) this.disabled = true;
      else this.disabled = false;

      this.editable = this.constUpdateMod ? this.editable : this.constUpdateMod;
    },
    setGridBtns() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'orange',
          btnClicked: 'btnOpenClicked',
          visible: !this.disabled && this.editable && !this.authDuringAppr,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'), // 제외
          color: 'red',
          btnClicked: 'btnDeleteClicked',
          visible: !this.disabled && this.editable && !this.authDuringAppr,
        },
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btns);
    },
    getList() {
      if (!this.constNo) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = {
        constNo: this.constNo,
      };
      this.$http.request(
        (_result) => {
          this.constSafe.constLotos = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event.dataField !== 'facilityNm') return;

      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/createFacilityMst.vue'}`);
      this.popupOptions.title = 'L0000001580'; // 설비등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: event.item ? event.item.safFacilityCd : '',
        title: 'L0000003576', // 설비 상세
        flag: true,
      };
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    openPopup() {
      let plantCd = '';

      if (this.constSafe) {
        plantCd = this.constSafe.plantCd;
      } else if (this.wkodMaster) {
        plantCd = this.wkodMaster.plantCd;
      }
      this.popupOptions.param = {
        selectedFacilityMstValue: this.YAuiGrid.getGridData(),
        plantCd: plantCd,
      };
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
      this.popupOptions.title = 'L0000001580'; // 설비등록
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      var i = 0;
      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        data = this.$_.clone(
          this.$_.reject(data, { safFacilityCd: item.safFacilityCd })
        );
      });
      let gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(data, (item) => {
        gridData.splice(0, 0, {
          safFacilityTypeCd: item.safFacilityTypeCd,
          safFacilityTypeNm: item.safFacilityTypeNm,
          safFacilityCd: item.safFacilityCd,
          facilityNm: item.facilityNm,
          facilityPsmCd: item.facilityPsmCd,
          facilityPsmNm: item.facilityPsmNm,
          constNo: this.constSafe.constNo,
          lockLocate: '',
        });
      });
      this.constSafe.constLotos = gridData;
      this.YAuiGrid.setGridData(gridData);
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      const selectValue = this.YAuiGrid.getCheckedRowItems();
      if (selectValue <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000795', // 설비목록에서 계획을 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000093', // 제외하시겠습니까?
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGrid.getGridData();
            this.$_.forEach(selectValue, (rows) => {
              gridData = this.$_.reject(gridData, {
                safFacilityCd: rows.item.safFacilityCd,
              });
            });
            this.YAuiGrid.setGridData(gridData);

            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000686', // 제외되었습니다.
              type: 'success', // success / info / warning / error
            });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>

<style></style>
