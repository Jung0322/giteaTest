<!--
  목적 : 작업허가서 설비지정
  Detail : 작업허가서 설비지정 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 독성여부 -->
            <!-- 독성O -->
            <!-- 독성X -->
            <y-switch
              :width="10"
              :disabled="disabled"
              :editable="editable"
              true-value="Y"
              false-value="N"
              ui="bootstrap"
              label="L0000000958"
              name="toxiYn"
              selectText="L0000003657"
              unselectText="L0000003658"
              v-model="accidentDetail.toxiYn"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- 등록 -->
    <b-row>
      <b-col sm="6">
        <!-- 화학자재 목록 -->
        <y-auigrid
          ref="yAuiGrid2"
          :headers="gridOptions.pheader"
          :btns="gridOptions.btns"
          :height="gridOptions.pheight"
          :label="this.$comm.getLangSpecInfoLabel('L0000003311')"
          :useExcelExport="false"
          :showRowCheckColumn="updateMod && !disabled && editable"
          @btnAdd="openPopup('P')"
          @btnDelete="btnpDeleteClickedCallback"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
      <b-col sm="6">
        <b-row>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
            <!-- 설비 목록 -->
            <y-auigrid
              ref="yAuiGrid"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000001581')"
              :useExcelExport="false"
              :showRowCheckColumn="updateMod && !disabled && editable"
              @cellClick="cellClickHandler"
              @btnAdd="openPopup('F')"
              @btnDelete="btnDeleteClickedCallback"
              @btnClickedError="btnClickedErrorCallback"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'accident-items',
  props: {
    disabled: false,
    accidentDetail: {
      type: Object,
      default: {
        safAccidentNo: 0,
        accidentStepCd: '',
        toxiYn: '',
        accidentFacility: [], // 사내사고 설비
        accidentChemprod: [], // 사내사고 물질
      },
    },
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
      YAuiGrid2: null,
      gridOptions: {
        header: [],
        data: [],
        height: '300',
        pheader: [],
        pdata: [],
        pheight: '300',
      },
      updateMod: true,
      searchFacilityUrl: '',
      searchChemprodUrl: '',
      deleteUrl: '',
      editable: true,
      deleteValue: null,
    };
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
    this.YAuiGrid2 = this.$refs.yAuiGrid2;

    this.getFacilityList();
    this.getChemprodList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.searchFacilityUrl = selectConfig.saf.accidentFacility.list.url;
      this.searchChemprodUrl = selectConfig.saf.accidentChemprod.list.url;
      this.deleteUrl = transactionConfig.saf.wkodMaster.deleteFacility.url;

      // 설비 grid 헤더
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '150',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '250',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 설비명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'deptNm',
          width: '120',
        }, // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '120',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002884'),
          dataField: 'selfChkYmd',
          width: '120',
        }, // 최근자체점검일
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAdd',
          btnClickedError: 'btnClickedError',
          visible: this.updateMod && !this.disabled && this.editable,
        }, //  추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDelete',
          btnClickedError: 'btnClickedError',
          visible: this.updateMod && !this.disabled && this.editable,
        }, //  제외
      ];

      this.gridOptions.pheader = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003317'),
          dataField: 'chemProdNmKr',
          width: '25%',
          style: 'left-align',
        }, // 화학자재명(KR)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002329'),
          dataField: 'sapMatCd',
          width: '25%',
        }, // 자재번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001635'),
          dataField: 'propertyNm',
          width: '25%',
        }, // 성상
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002627'),
          dataField: 'makerNm',
          width: '25%',
          style: 'left-align',
        }, // 제조업체
      ];
    },
    getFacilityList() {
      if (!this.accidentDetail.safAccidentNo) return;
      this.$http.url = this.searchFacilityUrl;
      this.$http.type = 'get';
      this.$http.param = {
        safAccidentNo: this.accidentDetail.safAccidentNo,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.accidentDetail.accidentFacility = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 화학물질 grid
    getChemprodList() {
      if (!this.accidentDetail.safAccidentNo) return;
      this.$http.url = this.searchChemprodUrl;
      this.$http.type = 'get';
      this.$http.param = {
        safAccidentNo: this.accidentDetail.safAccidentNo,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid2.setGridData(_result.data);
          this.accidentDetail.accidentChemprod = _result.data;
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
        import(`${'@/pages/baseInfo/facility/createFacilityMst.vue'}`);
      this.popupOptions.title = 'L0000003659'; // 설비
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: event.item.safFacilityCd || '',
        facilityPsmCd:
          event.item.facilityPsmCd === 'FPSM0' ? '' : event.item.facilityPsmCd,
        title: 'L0000003576', // 설비 상세
        flag: true,
      };
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    openPopup(gubun) {
      if (gubun === 'F') {
        this.popupOptions.param = {
          selectedFacilityMstValue: [], // this.gridOptions.data,
        };
        this.popupOptions.target = () =>
          import(`${'@/pages/baseInfo/facility/facilityMstPopup.vue'}`);
        this.popupOptions.title = 'L0000001580'; // 설비 등록
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/chm/chemprod/chemprod.vue'}`);
        this.popupOptions.title = 'L0000003309'; // 화학자재
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          popupMode: true,
          multiple: true,
          // chemprod: this.gridOptions.pdata,
        };
        this.popupOptions.width = '75%';
        this.popupOptions.top = '100px';
        this.popupOptions.closeCallback = this.closePopupSearchChemProd;
      }
    },
    closePopupSearchChemProd(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C') {
        let gridData = this.YAuiGrid2.getGridData();
        if (gridData.length > 0) {
          this.$_.forEach(gridData, (item) => {
            data.data = this.$_.reject(data.data, {
              chemProdNo: item.chemProdNo,
            });
          });
        }

        const newGridData = [...gridData, ...data.data];
        this.YAuiGrid2.setGridData(newGridData);
        this.accidentDetail.accidentChemprod = newGridData;
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;

      let gridData = this.YAuiGrid.getGridData();
      if (gridData.length > 0) {
        this.$_.forEach(gridData, (item) => {
          data = this.$_.reject(data, { safFacilityCd: item.safFacilityCd });
        });
      }

      const newGridData = [...gridData, ...data];
      this.YAuiGrid.setGridData(newGridData);
      this.accidentDetail.accidentFacility = newGridData;
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      if (this.YAuiGrid.getCheckedRowItems().length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000767', // 설비목록에서 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000093', // 제외하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGrid.getGridData();
            const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
              (row) => row.item
            );

            this.$_.forEach(selectedRows, (item) => {
              gridData = this.$_.reject(gridData, item);
            });

            this.YAuiGrid.setGridData(gridData);
            this.accidentDetail.accidentFacility = gridData;

            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000686', // 제외되었습니다.',
              type: 'success', // success / info / warning / error
            });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    btnpDeleteClickedCallback(_result) {
      if (this.YAuiGrid2.getCheckedRowItems().length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000169', // 화학자재 목록에서 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000093', // 제외하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGrid2.getGridData();
            const selectedRows = this.YAuiGrid2.getCheckedRowItems().map(
              (row) => row.item
            );

            this.$_.forEach(selectedRows, (item) => {
              gridData = this.$_.reject(gridData, {
                chemProdNo: item.chemProdNo,
              });
            });

            this.YAuiGrid2.setGridData(gridData);
            this.accidentDetail.accidentChemprod = gridData;

            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
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
