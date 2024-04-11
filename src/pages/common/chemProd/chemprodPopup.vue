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
    <!-- 검색조건 -->
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 화학자재명 -->
          <y-text
            :width="7"
            ui="bootstrap"
            label="L0000003315"
            name="chemProdNmKr"
            v-model="searchParam.chemProdNmKr"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- CAS No. -->
          <y-text
            :width="7"
            ui="bootstrap"
            label="L0000000102"
            name="casNo"
            v-model="searchParam.casNo"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 화학물질 grid -->
    <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
          <!-- 추가 -->
          <!-- <y-btn
                v-if="editable && popupParam.pipeNo !== 0"
                :action-url="insertUrl"
                :param="saveData"
                :is-submit="isInsert"
                title="L0000002892"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
          <!-- 선택 -->
          <!-- <y-btn
                v-if="editable && popupParam.pipeNo === 0"
                title="L0000001561"
                color="orange"
                @btnClicked="btnSelectChemprods"
              /> -->
          <!-- 검색 -->
          <!-- <y-btn
                title="L0000000327"
                color="green"
                @btnClicked="btnSearchClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
          <!-- 닫기 -->
          <!-- <y-btn title="L0000000881" @btnClicked="btnClosePopup('CLOSE')" />
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
              :checkItemData="checkItemData"
              :editable="editable"
              :useRownum="false"
              checkKey="chemProdNo"
              v-model="selectedValue"
            >
              <el-table-column
                :selectable="selectCheck"
                type="selection"
                slot="selection"
                align="center"
                width="55"
              ></el-table-column>
            </y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001313')"
            :useExcelExport="false"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :enableCellMerge="true"
            :cellMergeRowSpan="true"
            :showRowCheckColumn="true"
            @beforeInsert="beforeInsert"
            @btnSearchClickedCallback="btnSearchClickedCallback"
            @btnSelectChemprods="btnSelectChemprods"
            @btnClosePopup="btnClosePopup"
            @cellClick="cellClickHandler"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-chem-prod-popup',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        safFacilityCd: '',
        equipmentNo: 0,
        chemProds: [],
        pipeNo: 0,
        plantCd: '',
      }),
    },
  },
  data: function () {
    return {
      searchParam: {
        plantCd: '',
        chemProdNmKr: '',
        casNo: '',
        // saveChemprodNos: [],
      },
      gridOptions: {
        header: [],
        data: [],
        height: 500,
        merge: [],
      },
      editable: false,
      isInsert: false,
      chemProdNo: 0,
      chemProdRevNo: '0',
      searchUrl: '',
      insertUrl: '',
      selectedValue: [],
      checkItemData: [],
      saveData: {
        pipeNo: '',
        chemprods: [],
      },
      YAuiGrid: null,
    };
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
      this.searchUrl = selectConfig.psm.facilityChemprod.riskHazard.url;
      this.insertUrl = transactionConfig.psm.pipeChemprod.insert.url;

      this.editable = this.$route.meta.editable;
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      } else {
        this.searchParam.plantCd = this.$store.getters.plantCd;
      }

      // this.searchParam.saveChemprodNos = this.popupParam.saveChemprodNos;
      this.getDataList();
      let myTHis = this;
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
        // {
        //   headerText: '',
        //   dataField: 'chemProdNmKr2',
        //   width: '100',
        //   style: 'center',
        //   cellMerge: true,
        //   mergeRef: 'chemProdNmKr',
        //   mergePolicy: 'restrict',
        //   renderer: {
        //     type: 'CheckBoxEditRenderer',
        //     editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
        //     checkValue: 'Y', // true, false 인 경우가 기본
        //     unCheckValue: 'N',
        //   },
        // },
        // { text: 'MSDS', name: 'msds', width: '80', style: 'center', url: 'link' },
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
        }, // cas no
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
        }, // 용량
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
          btnClicked: 'beforeInsert',
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClosePopup',
        }, // 닫기
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    selectCheck() {
      if (!this.editable) return false;
      else return true;
    },
    // 화학물질 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;

          // var resultData;
          // var groups;
          // resultData = this.$_.groupBy(_result.data, 'chemProdNmKr');
          // groups = Object.values(resultData).map((group) => group);

          // const newArray = this.$_.map(_result.data, (obj) => ({
          //   ...obj,
          //   chemProdNmKr2: obj.chemProdNmKr,
          // }));

          // this.$_.forEach(_result.data, (item) => {});

          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          // if (this.gridOptions.data) {
          //   this.checkI`temData = this.popupParam.chemProds;
          // }
          if (this.YAuiGrid.getGridData()) {
            this.checkItemData = this.popupParam.chemProds;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
    },
    // beforeInsert() {
    //   if (this.selectedValue.length === 0) {
    //     window.getApp.$emit('ALERT', {
    //       title: 'L0000003395',
    //       message: 'M0000000170',
    //       // 화학자재를 선택하세요.
    //       type: 'warning',
    //     });
    //     return;
    //   } else {
    //     this.saveData.pipeNo = this.popupParam.pipeNo;
    //     this.saveData.chemprods = this.$_.uniqBy(
    //       this.selectedValue,
    //       'chemProdNo'
    //     );
    //     this.isInsert = true;
    //   }
    // },
    beforeInsert() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000001614',
          // 선택된 항목이 없습니다.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'L0000005772',
          // 선택하신 화학자재의 화학물질이 모두 추가됩니다. 진행하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            let checkedData = this.YAuiGrid.getCheckedRowItems().map(
              (rows) => rows.item
            );
            let gridData = this.YAuiGrid.getGridData();
            // chemProdNo만 담아주는 임시 배열 (체크가 일부 풀려도 해당 화학자재를 통째로 가져오기 위함)
            let tempChemProdData = [];
            // 팝업창이 닫히면서 넘겨줄 배열
            let tempData = [];
            this.$_.forEach(checkedData, (item) => {
              tempChemProdData.push(item.chemProdNo);
            });
            // chemProdNo 중복 제거
            tempChemProdData = this.$_.uniq(tempChemProdData);
            this.$_.forEach(tempChemProdData, (item) => {
              this.$_.forEach(gridData, (item2) => {
                if (item === item2.chemProdNo) {
                  tempData.push(item2);
                }
              });
            });

            this.btnClosePopup(tempData);
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000104',
              // 추가되었습니다.
              type: 'success',
            });

            // let gridData = this.YAuiGrid.getGridData();
            // const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
            //   (rows) => rows.item
            // );
            // this.$_.forEach(selectedRows, (item) => {
            //   gridData = this.$_.reject(gridData, {
            //     processCd: item.processCd,
            //   });
            // });
            // this.YAuiGrid.setGridData(gridData);
            // this.gridOptions.data = gridData;

            // this.$http.url = this.deleteProcessUrl;
            // this.$http.param = {
            //   data: Object.values(selectedRows),
            // };
            // this.$http.type = 'DELETE';
            // this.$http.request(
            //   (_result) => {
            //     window.getApp.$emit('ALERT', {
            //       title: 'L0000003395',
            //       message: 'M0000000007',
            //       // 삭제하였습니다.
            //       type: 'success',
            //     });
            //   },
            //   (_error) => {
            //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
            //   }
            // );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    /** button 관련 이벤트 **/
    // 팝업 닫기
    btnClosePopup(data) {
      // if (data !== "CLOSE") data
      // 부모창에 값 전달
      this.$emit('closePopup', data);
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000104',
        type: 'success',
      });
      this.isInsert = false;
      this.btnSelectChemprods();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    // btnSelectChemprods() {
    //   var resultData = [];
    //   var tempData = [];

    //   this.$_.forEach(this.selectedValue, (chemprod) => {
    //     resultData = this.$_.union(
    //       resultData,
    //       this.$_.filter(this.gridOptions.data, {
    //         chemProdNo: chemprod.chemProdNo,
    //       })
    //     );
    //   });
    //   this.btnClosePopup(resultData);
    // },
    btnSelectChemprods() {
      var resultData = [];
      var tempData = [];
      let gridData = this.YAuiGrid.getGridData();
      const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
        (rows) => rows.item
      );

      this.$_.forEach(selectedRows, (chemprod) => {
        resultData = this.$_.union(
          resultData,
          this.$_.filter(this.gridOptions.data, {
            chemProdNo: chemprod.chemProdNo,
          })
        );
      });
      this.btnClosePopup(resultData);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
