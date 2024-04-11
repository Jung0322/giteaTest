<!--
  목적 : 화학물질 등록(팝업)
  작성자 : kdh
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 화학물질 grid -->
    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
          <!-- 추가 -->
          <!-- <y-btn
              v-if="!flag && editable"
              title="L0000002892"
              color="orange"
              @btnClicked="btnAddChemprod"
            /> -->
          <!-- 제외 -->
          <!-- <y-btn
              v-if="!flag && editable"
              title="L0000002620"
              color="red"
              @btnClicked="btnDeleteChemprod"
            />
          </div> -->
          <!-- 화학자재 목록 -->
          <!-- <y-data-table
            label="L0000003311"
            ref="dataTable"
            :rows="3"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :height="gridOptions.height"
            :span-options="gridOptions.merge"
            :use-server-paging="true"
            :pageTotal="pageTotal"
            :editable="editable"
            :useRownum="false"
            v-model="selectedValue"
            :popMode="true"
          >
            <el-table-column
              v-if="!flag"
              :selectable="selectCheck"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table> -->
          <!-- 화학자재 목록 -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000003311')"
            :useExcelExport="false"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :showRowCheckColumn="true"
            :enableCellMerge="true"
            :cellMergeRowSpan="true"
            @btnAddChemprod="btnAddChemprod"
            @btnDeleteChemprod="btnDeleteChemprod"
            @cellClick="cellClickHandler"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'facility-chemprod',
  props: {
    disabled: false,
    facilityMst: {
      type: Object,
      default: () => ({
        safFacilityCd: '',
        chemprods: [],
        plantCd: '',
        firstChemprod: [],
      }),
    },
    equipmentNo: {
      type: Number,
      default: 0,
    },
    flag: false,
  },
  data: function () {
    return {
      searchParam: {
        plantCd: '',
        // chemProdNmKr: '',
        safFacilityCd: '',
        equipmentNo: 0,
        // chemProdNos: [],
      },
      gridOptions: {
        header: [],
        data: [],
        height: 500,
        merge: [],
      },
      pageTotal: 0,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      // savedChemprods: [],
      editable: false,
      chemProdNo: 0,
      chemProdRevNo: '0',
      // plantItems: [],
      searchUrl: '',
      deleteUrl: '',
      selectedValue: [],
      chemProds: [],
      YAuiGrid: null,
    };
  },
  watch: {
    'facilityMst.safFacilityCd': {
      handler: function (val, oldVal) {
        if (this.disabled) {
          this.getDataList();
        }
      },
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.facilityMst.chemprods = this.$_.uniqBy(
          this.gridOptions.data,
          'chemProdNo'
        );
        if (this.equipmentNo === 0 || this.equipmentNo === 1) {
          this.$_.forEach(this.facilityMst.chemprods, (item) => {
            item.equipmentNo = this.equipmentNo;
          });
        }
        this.chemProds = val;
        if (this.gridOptions.data && this.gridOptions.data.length > 0) {
          this.pageTotal = this.$_.uniq(
            this.$_.map(this.gridOptions.data, 'chemProdNo')
          ).length;
        } else {
          this.pageTotal = 0;
        }
      },
      deep: true,
    },
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
  //* methods */
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.psm.facilityChemprod.list.url;
      this.deleteUrl = transactionConfig.psm.facilityChemprod.delete.url;

      this.editable = this.$route.meta.editable;
      this.getDataList();
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '150',
          style: 'center',
          cellMerge: true,
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003315'),
          dataField: 'chemProdNmKr',
          width: '150',
          style: 'center',
          cellMerge: true,
        }, // 화학자재명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003298'),
          dataField: 'chemNmKr',
          width: '150',
          style: 'left',
        }, // 화학물질명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
          dataField: 'casNo',
          width: '150',
          style: 'center',
        }, // CAS NO
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001348'),
          dataField: 'moleFormula',
          width: '150',
          style: 'left',
        }, // 분자식
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003147'), // 폭발한계(%)
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001540'),
              dataField: 'explUpLimit',
              width: '80',
              style: 'right',
            }, // 상한
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003166'),
              dataField: 'explLowLimit',
              width: '80',
              style: 'right',
            }, // 하한
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000845'),
          dataField: 'leakThresh',
          width: '130',
          style: 'left',
        }, // 노출기준
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000959'),
          dataField: 'lc50',
          width: '180',
          style: 'left',
        }, // 독성치
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002261'),
          dataField: 'flashingPnt',
          width: '130',
          style: 'right',
        }, // 인화점
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001104'),
          dataField: 'IgnitionPnt',
          width: '130',
          style: 'right',
        }, // 발화점
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002744'),
          dataField: 'vaporPressure',
          width: '130',
          style: 'right',
        }, // 증기압
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001335'),
          dataField: 'corrosivenessYnNm',
          width: '130',
          style: 'center',
        }, // 부식성유무
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002210'),
          dataField: 'extraReactionYnNm',
          width: '130',
          style: 'center',
        }, // 이상반응유무
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002271'),
          dataField: 'dailyVol',
          width: '130',
          style: 'right',
        }, // 일일취급량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002477'),
          dataField: 'maxVol',
          width: '130',
          style: 'right',
        }, // 저장량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '200',
          style: 'left',
        }, // 비고
      ];
      this.gridOptions.merge = [];
      var i = 0;
      for (; i <= this.gridOptions.header.length + 1; i++) {
        if (i !== 3 && i !== 4 && i !== 5) {
          this.gridOptions.merge.push({ index: i, field: 'chemProdNmKr' });
        }
      }
    },
    cellClickHandler(event) {
      console.log('event: ', event);
      if (event.dataField === 'chemProdNmKr') {
        this.test(event.item.chemProdNo);
      }
    },
    test(item) {
      this.YAuiGrid.addCheckedRowsByValue('chemProdNo', item);
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddChemprod',
          visible: !this.flag && this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDeleteChemprod',
          visible: !this.flag && this.editable,
        }, // 제외
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    selectCheck() {
      if (!this.editable) return false;
      else return true;
    },
    // 화학물질 grid
    getDataList() {
      if (!this.facilityMst.safFacilityCd) return;
      this.searchParam.safFacilityCd = this.facilityMst.safFacilityCd;
      this.searchParam.equipmentNo = this.equipmentNo;
      this.$http.url = this.searchUrl; // selectConfig.saf.facilityChemprod.list.url;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(_result.data);
          this.facilityMst.firstChemprod = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류메시지
          );
        }
      );
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let gridData = this.YAuiGrid.getGridData();
      if (data === 'CLOSE') return;
      this.$_.forEach(data, (item) => {
        if (
          this.$_.findIndex(gridData, {
            // 기존 패키지의 조건과 일치하게 코드 작성, chemProdNo 뿐만 아니라 chemNo도 조건으로 삽입
            chemProdNo: item.chemProdNo,
            chemNo: item.chemNo,
          }) === -1
        ) {
          // 중복된 화학물질은 추가되지 않음
          gridData.push(item);
        }
      });
      this.YAuiGrid.setGridData(gridData);
      // this.facilityMst.chemprods = this.YAuiGrid.getGridData();
      this.facilityMst.chemprods = this.$_.uniqBy(
        this.YAuiGrid.getGridData(),
        'chemProdNo'
      );
    },
    /** button 관련 이벤트 **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnAddChemprod() {
      this.popupOptions.target = () =>
        import(`${'../../common/chemProd/chemprodPopup.vue'}`);
      this.popupOptions.title = 'L0000003309'; // 화학자재
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: this.facilityMst.safFacilityCd,
        equipmentNo: this.equipmentNo,
        chemProds: [],
        plantCd: this.facilityMst.plantCd,
        // 'saveChemprodNos': this.savedChemprods,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },

    btnDeleteChemprod() {
      let removeFlag = false;
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000208',
          // 제외 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'L0000005773',
          // 선택하신 화학물질의 화학자재가 모두 제거됩니다. 진행하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            removeFlag = true;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000007',
              // 삭제하였습니다.
              type: 'success',
            });
            if (removeFlag === true) {
              let selectedValue = this.YAuiGrid.getCheckedRowItems();
              let gridData = this.YAuiGrid.getGridData();
              this.$_.forEach(selectedValue, (item) => {
                gridData = this.$_.clone(
                  this.$_.reject(gridData, {
                    chemProdNo: item.item.chemProdNo,
                  })
                );
              });
              this.YAuiGrid.setGridData(gridData);
              this.facilityMst.chemprods = this.YAuiGrid.getGridData();
              this.facilityMst.chemprods = this.$_.uniqBy(
                this.YAuiGrid.getGridData(),
                'chemProdNo'
              );
            }
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
