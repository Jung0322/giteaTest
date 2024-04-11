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
        <!-- LOTO 목록 -->
        <!-- *주관부서 검토 시 대상유무 및 잠금위치 명확히 기재 요망 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000126')"
          :useExcelExport="false"
          :showRightLabel="true"
          :rightLabel="this.$comm.getLangSpecInfoLabel('M0000001015')"
          :showRowCheckColumn="!disabled&&editable"
          @cellClick="cellClickHandler"
          @btnAdd="openPopup"
          @btnDelete="btnDeleteClickedCallback"
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
    disabled: {
      type: Boolean,
      default: function() {
        return false;
      },
    },
    wkodMaster: {
      type: Object,
      default: function() {
        return {
          constNo: '',
          wkodNo: 0,
          plantCd: '',
          wkodStepCd: '',
          wkodLotos: [],
        };
      },
    },
    isPrev: {
      type: Boolean,
      default: false,
    }
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
        header: [],
        height: '300',
      },
      searchUrl: '',
      editable: true,
    };
  },
  watch: {
    'wkodMaster.constNo'() {
      this.getList();
    },
    isPrev: {
      handler: function(newVal, oldVal) {
        this.getList();
      },
      deep: true,
    }
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
    this.getList();
  },
  updated() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.searchUrl = selectConfig.saf.wkodMaster.getLotos.url;

      // 설비 grid 헤더
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'), 
          dataField: 'safFacilityTypeNm', 
          width: '30%', 
        }, // 설비유형 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'), 
          dataField: 'facilityNm', 
          width: '35%', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 설비명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002449'), 
          dataField: 'lockLocate', 
          width: '35%', 
          editRenderer: {
            type: 'InputEditRenderer', 
          }, 
        }, // 잠금위치(상세명칭 기재) 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
          color: 'orange', 
          btnClicked: 'btnAdd',
          visible: !this.disabled && this.editable,
        },  //  추가
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000002620'), 
          color: 'red', 
          btnClicked: 'btnDelete',
          visible: !this.disabled && this.editable,
        },  //  제외
      ];
    },
    getList() {
      if (this.wkodMaster.constNo || this.wkodMaster.wkodNo) {
        if (this.wkodMaster.wkodLotos && this.wkodMaster.wkodLotos.length) {
          this.YAuiGrid.setGridData(this.wkodMaster.wkodLotos);
        } else {
          this.$http.url = this.searchUrl;
          this.$http.type = 'get';
          this.$http.param = {
            constNo: this.wkodMaster.constNo,
            wkodNo: this.wkodMaster.wkodNo,
          };
          this.$http.request(
            _result => {
              this.wkodMaster.wkodLotos = _result.data;
              this.YAuiGrid.setGridData(this.wkodMaster.wkodLotos);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
      }
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event.dataField !== 'facilityNm') return; 

      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/facility/createFacilityMst.vue'}`);
      this.popupOptions.title = 'L0000001580'; // 설비등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: event.item ? event.item.safFacilityCd : '',
        facilityPsmCd: event.item.facilityPsmCd === 'FPSM0' ? '' : event.item.facilityPsmCd,
        title: 'L0000003576', // 설비 상세
        flag: true,
      };
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    openPopup() {
      this.popupOptions.param = {
        selectedFacilityMstValue: this.wkodMaster.wkodLotos,
        plantCd: this.wkodMaster.plantCd,
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/facility/facilityMstPopup.vue'}`);
      this.popupOptions.title = 'L0000001580'; // 설비등록
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      var i = 0;
      this.$_.forEach(this.wkodMaster.wkodLotos, item => {
        data = this.$_.clone(
          this.$_.reject(data, { safFacilityCd: item.safFacilityCd })
        );
      });
      this.$_.forEach(data, item => {
        this.wkodMaster.wkodLotos.unshift({
          safFacilityTypeCd: item.safFacilityTypeCd,
          safFacilityTypeNm: item.safFacilityTypeNm,
          safFacilityCd: item.safFacilityCd,
          facilityNm: item.facilityNm,
          facilityPsmCd: item.facilityPsmCd,
          facilityPsmNm: item.facilityPsmNm,
          wkodNo: this.wkodMaster.wkodNo,
          lockLocate: '',
        });
      });
      this.YAuiGrid.setGridData(this.wkodMaster.wkodLotos);
    },
    closeFacilityPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      if (this.YAuigrid.getCheckedRowItems().length <= 0) {
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
            const selectValue = this.YAuigrid.getCheckedRowItems().map(rows => rows.item);
            this.$_.forEach(selectValue, item => {
              this.wkodMaster.wkodLotos = this.$_.reject(this.wkodMaster.wkodLotos, {
                safFacilityCd: item.safFacilityCd,
              });

              this.YAuiGrid.setGridData(this.wkodMaster.wkodLotos);
            });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
  },
};
</script>

<style>
</style>
