<!--
  목적 : 등록/접수/조치결과 - 조사결과
  Detail : 조사결과
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <!-- <b-row>
      <b-col sm="12">
         조사결과 테이블 
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                 행 추가 
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000003224"
                  color="blue"
                  :showLoading="false"
                  @btnClicked="btnAdd"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                행 삭제 
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000003223"
                  color="red"
                  :showLoading="false"
                  @btnClicked="btnDelete"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
               안건 목록 
              <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="industrialSafetyHealthCommittee.mgtCommitteeAgendas"
                :editable="!disabled && editable"
                v-model="selectedValue"
                label="L0000001841"
                @tableLinkClicked="tableLinkClicked"
              >
                <el-table-column
                  v-if="!disabled && editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col>
        </b-row>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001841')"
          :useExcelExport="false"
          :enableSorting="true"
          :showRowCheckColumn="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :softRemoveRowMode="false"
          @cellClick="cellClickHandler"
          @cellEditEnd="cellEditEndHandler"
          @btnAddRow="btnAddRow"
          @deleteRow="deleteRow"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */ name: 'meeting-agenda',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    industrialSafetyHealthCommittee: {
      type: Object,
      default: function () {
        return {
          committeeConfNo: 0,
          mgtCommitteeAgendas: [], // 위원회 회의안건
          deleteMgtCommitteeAgendas: [], // [삭제] 위원회 회의안건
        };
      },
    },
    tabParam: {
      type: Object,
      default: {
        imprClassCd: '',
        refTableId: 0,
        editable: true,
        tabClickCnt: 0,
      },
    },
  },
  data: () => ({
    gridOptions: {
      // 조사결과
      header: [],
      data: [],
      height: '400',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    selectedValue: [],
    editable: false,
    YAuiGrid: null,
  }),
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());

    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.setGridHeader().then(() => {
        this.setData();
      });

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'),
          color: 'blue',
          btnClicked: 'btnAddRow',
          visible: !this.disabled,
        }, // 행추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'deleteRow',
          visible: !this.disabled,
        }, // 행삭제
      ];
    },
    setGridHeader() {
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003365'),
            dataField: 'agendaDesc',
            editable: !this.disabled,
            width: '16%',
            editRenderer: {
              type: 'InputEditRenderer',
            }, // 회희안건
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001825'),
            dataField: 'agendaReview',
            width: '16%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
            },
          }, // 심의
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003267'),
            dataField: 'agendaResult',
            width: '16%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
            },
          }, // 협의결과
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '16%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
            },
          }, // 비고
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
            dataField: 'improvement',
            width: '16%',
            editable: false,
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {},
            },
          }, // 개선요청
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002737'),
            dataField: 'imprAct',
            width: '16%',
            editable: false,
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {},
            },
          }, // 즉시조치
        ];
        resolve();
      });
    },
    setData() {
      this.YAuiGrid.setGridData(
        this.industrialSafetyHealthCommittee.mgtCommitteeAgendas
      );
    },
    tableLinkClicked(header, data) {
      if (data.agendaNo > 0) {
        if (!(!this.disabled && this.editable)) {
          return;
        }
        let flag = '';

        if (!this.editable) {
          flag = 'DETAIL';
        } else {
          // 개선요청
          if (header.name === 'improvement') {
            flag = 'REQUEST';
          } else {
            flag = 'NOW';
          }
        }

        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: data ? data.agendaNo : 0,
          flag: flag,
          editable: this.editable,
          title: this.industrialSafetyHealthCommittee.confNm,
        };

        // 개선요청
        if (header.name === 'improvement') {
          // 무조건 등록만 뜨도록 수정
          this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
          this.popupOptions.target = () =>
            import(`${'@/pages/impr/actionRequestBatch.vue'}`);

          this.popupOptions.param.flag = flag;
        } else if (header.name === 'imprAct') {
          // 무조건 등록만 뜨도록 수정
          this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
          this.popupOptions.param.flag = flag;
          this.popupOptions.target = () =>
            import(`${'@/pages/impr/immediateActionNewDetail.vue'}`);
        }

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      // if (data !== 'CLOSE') this.getList();
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 회의안건 행 추가
     */
    btnAddRow() {
      return new Promise((_resolve, _reject) => {
        if (
          this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.length > 0
        ) {
          this.$_.forEach(
            this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
            (item) => {
              item.subPlantNm = this.industrialSafetyHealthCommittee.subPlantNm;
              item.subConfNm = this.industrialSafetyHealthCommittee.subConfNm;
              item.subHalfTypeNm =
                this.industrialSafetyHealthCommittee.subHalfTypeNm;
            }
          );
        }
        let row = {
          committeeConfNo: this.industrialSafetyHealthCommittee.committeeConfNo,
          subPlantNm: this.industrialSafetyHealthCommittee.subPlantNm,
          subConfNm: this.industrialSafetyHealthCommittee.subConfNm,
          subHalfTypeNm: this.industrialSafetyHealthCommittee.subHalfTypeNm,
          agendaNo: '',
          agendaDesc: '',
          agendaReview: '',
          agendaResult: '',
          remark: '',
          safImprActNo: 0,
          improvement: '개선요청',
          imprAct: '즉시초지',
        };
        this.YAuiGrid.addRow(row, 'first');
        var date = new Date();
        this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.splice(0, 0, {
          tempId: String(date.getTime()),
          committeeConfNo: this.industrialSafetyHealthCommittee.committeeConfNo,
          subPlantNm: this.industrialSafetyHealthCommittee.subPlantNm,
          subConfNm: this.industrialSafetyHealthCommittee.subConfNm,
          subHalfTypeNm: this.industrialSafetyHealthCommittee.subHalfTypeNm,
          agendaNo: '',
          agendaDesc: '',
          agendaReview: '',
          agendaResult: '',
          remark: '',
          safImprActNo: 0,
          improvement: '',
          imprAct: '',
        });
      });
    },
    /**
     * 사내사고 원인 및 재발방지대책행 삭제
     */
    deleteRow() {
      let selectedRow = this.YAuiGrid.getCheckedRowItems();
      if (!selectedRow || selectedRow.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000911' /*  삭제 할 데이터를 선택하세요. */,
          type: 'warning', // success / info / warning / error
        });
      } else {
        for (let i = 0; i < selectedRow.length; i++) {
          this.YAuiGrid.removeRow(selectedRow[i].rowIndex);
        }
        // 삭제한 항목을 따로 저장해 둔 후 저장 버튼을 누를때 가지고 가서
        // 개선요청 묶여 있는 건들도 같이 지운다.
        if (!this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendas) {
          this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendas = [];
        }

        this.$_.forEach(selectedRow, (item) => {
          if (item.tempId) {
            this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.splice(
              this.$_.findIndex(
                this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
                { tempId: item.tempId }
              ),
              1
            );
          } else {
            item.imprClassCd = 'ICL13';
            this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendas.push(
              item.item
            );
            this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.splice(
              this.$_.findIndex(
                this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
                {
                  agendaNo: item.item.agendaNo,
                }
              ),
              1
            );
          }
        });
      }
    },
    cellEditEndHandler(data) {
      if (data.item.committeeConfNo && data.item.agendaNo) {
        this.deleteImpr(data.item);
      }
      this.industrialSafetyHealthCommittee.mgtCommitteeAgendas =
        this.YAuiGrid.getGridData();
    },
    deleteImpr(data) {
      this.$http.url = this.$format(
        transactionConfig.mgt.industrialSafetyHealthCommittee.imprDelete.url,
        data.agendaNo,
        'ICL13'
      );
      this.$http.type = 'DELETE';
      this.$http.request(
        (_result) => {},
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(data) {
      if (data.item.agendaNo > 0) {
        if (data.dataField !== 'improvement' && data.dataField !== 'imprAct') {
          return;
        }
        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: 'ICL13',
          refTableId: data.item ? data.item.agendaNo : 0,
          flag: 'BATCH',
          title: this.industrialSafetyHealthCommittee.confNm,
        };

        // 개선요청
        if (data.dataField === 'improvement') {
          this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
          this.popupOptions.param.actClassCd = 'ACL02';
        } else if (data.dataField === 'imprAct') {
          this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
          this.popupOptions.param.actClassCd = 'ACL01';
        }
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/imprActTabDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
