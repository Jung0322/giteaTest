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
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
            <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
            <!-- 추가 -->
            <!-- <y-bt n v-if="editable" title="L0000002892" color="orange" @btnClicked="btnAdd" /> -->
            <!-- 삭제 -->
            <!-- <y-btn
                v-if="gridOptions.data.length > 0 && editable"
                title="L0000001495"
                color="red"
                @btnClicked="btnDelete"
              />
            </div> -->
            <!-- 근무자정보 -->
            <!-- <y-data-table
              v-model="selectVendor"
              label="L0000000759"
              ref="dataTable"
              :height="gridOptions.height"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :useRownum="false"
              :popMode="true"
            >
              <el-table-column
                v-if="editable"
                slot="selection"
                type="selection"
                align="center"
                width="55"
              ></el-table-column>
            </y-data-table> -->
            <!-- 근무자정보 -->
            <y-auigrid
              ref="yAuiGrid"
              :editable="editable"
              :name="gridOptions.name"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000000759')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :showRowCheckColumn="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :softRemoveRowMode="false"
              @btnAdd="btnAdd"
              @btnDelete="btnDelete"
              @cellEditEnd="cellEditEndHandler"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-vendor-master-person',
  props: {
    tempVendorCd: '',
    chemicalVendorMaster: {
      type: Object,
      default: {
        vendorCd: '',
        workers: [],
      },
    },
    // disabled: false,
  },
  data() {
    return {
      component: null,
      chemicalVendorMasterAdd: {
        portalID: '',
        connectYn: 'Y',
      },
      saveData: {
        vendorCd: 0,
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      selectVendor: null,
      editable: false,
      disabled: false,
      searchDetailUrl: '',
      searchOriginUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      saveUrl: '',
      isInsert: false,
      isEdit: false,
      actionType: 'POST',
      paneName: '',
      genderItems: [
        {
          code: '',
          codeNm: '',
        },
      ],
      YAuiGrid: null,
    };
  },
  watch: {
    tempVendorCd: {
      handler: function (val, oldVal) {
        if (this.tempVendorCd !== '') {
          this.searchUrl =
            selectConfig.vendor.baseInfo.vendorMaster.worker.list.url;
          this.getDataList();
        }
      },
      deep: true,
    },
    // 'gridOptions.data': {
    //   handler: function (val, oldVal) {
    //     this.chemicalVendorMaster.workers = this.gridOptions.data;
    //   },
    //   deep: true,
    // },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl =
        selectConfig.vendor.baseInfo.vendorMaster.worker.list.url;
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'workerNm',
          width: '100px',
          style: 'center',
          type: 'text',
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'),
          dataField: 'birthYmd',
          width: '100px',
          editRenderer: {
            type: 'CalendarRenderer',
            defaultFormat: 'yyyy-mm-dd', // 달력 선택 시 데이터에 적용되는 날짜 형식
            showEditorBtn: false,
            showEditorBtnOver: false, // 마우스 오버 시 에디터버턴 출력 여부
            onlyCalendar: true, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
            showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
          },
        }, // 생년월일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'),
          dataField: 'genderCd',
          width: '100px',
          style: 'right',
          type: 'select',
          items: this.genderItems,
          itemText: 'codeNm',
          itemValue: 'code',
        }, // 성별
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002773'),
          dataField: 'workerJob',
          width: '120px',
          style: 'center',
          type: 'text',
        }, // 직책/직무
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003022'),
          dataField: 'speCommts',
          width: '250px',
          style: 'center',
          type: 'text',
        }, // 특이사항
      ];

      this.$comm.getComboItems('COM_SEX_TYPE', false).then((_result) => {
        this.genderItems = _result;
      });
      setTimeout(() => {}, 200);
    },
    cellEditEndHandler() {
      this.chemicalVendorMaster.workers = this.YAuiGrid.getGridData();
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAdd',
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelete',
        }, // 삭제
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    // 근무자 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        vendorCd: this.tempVendorCd,
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnAdd() {
      // this.gridOptions.data.splice(0, 0, {
      //   workerNm: '',
      //   birthYmd: '',
      //   genderCd: 'M',
      //   workerJob: '',
      //   speCommts: '',
      // });
      let row = {
        workerNm: '',
        birthYmd: '',
        genderCd: 'M',
        workerJob: '',
        speCommts: '',
      };
      this.YAuiGrid.addRow(row, 'first');
      this.cellEditEndHandler();
    },
    btnDelete() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        let gridData = this.YAuiGrid.getGridData();
        const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
          (row) => row.item
        );
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.YAuiGrid.setGridData(gridData);
        this.cellEditEndHandler();
      }
    },

    // btnDelete() {
    //
    //   this.$_.forEach(this.selectVendor, (item) => {
    //     if (item.safAccidentCauMeasNo > 0) {
    //       this.$http.url = this.$format(
    //         transactionConfig.saf.accidentCauMeas.delete.url,
    //         item.safAccidentCauMeasNo,
    //         item.safAccidentNo
    //       );
    //       this.$http.type = 'DELETE';
    //       this.$http.request(
    //         (_result) => {
    //           this.gridOptions.data.splice(
    //             this.$_.indexOf(this.gridOptions.data, item),
    //             1
    //           );
    //           window.getApp.$emit('ALERT', {
    //             title: 'L0000003395',
    //             message: 'M0000000007',
    //             // 삭제되었습니다.
    //             type: 'success', // success / info / warning / error
    //           });
    //         },
    //         (_error) => {
    //           window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //         }
    //       );
    //     } else {
    //       // this.gridOptions.data.splice(
    //       //   this.$_.indexOf(this.gridOptions.data, item),
    //       //   1
    //       // );
    //       let removeData = this.YAuiGrid.getCheckedRowItems();
    //       if (!removeData || removeData.length === 0) {
    //         window.getApp.$emit('ALERT', {
    //           title: 'L0000003395', // 안내
    //           message: 'M0000000057', // 삭제할 항목을 선택해주세요.
    //           type: 'warning', // success / info / warning / error
    //         });
    //         return;
    //       } else {
    //         for (let i = 0; i < removeData.length; i++) {
    //           this.YAuiGrid.removeRow(removeData[i].rowIndex);
    //         }
    //       }
    //     }
    //   });
    // },
  },
};
</script>
