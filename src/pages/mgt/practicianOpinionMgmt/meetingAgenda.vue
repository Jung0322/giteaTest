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
                <el-tag type="danger">
                  {{ $comm.getLangSpecInfoLabel('L0000005377') }}
                </el-tag>
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
                :useRownum="false"
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
  /* attributes: name, components, props, data */
  name: 'meeting-agenda',
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

    apprMode: false,
  },
  data: () => ({
    gridOptions: {
      // 조사결과
      name: 'meetingAgenda',
      btns: [],
      header: [],
      data: [],
      height: '400',
    },
    YAuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    selectedValue: [],
    editable: false,
  }),
  watch: {
    'industrialSafetyHealthCommittee.cmiClsCd'() {
      this.headerSet();
    },
    'industrialSafetyHealthCommittee.mgtCommitteeAgendas': {
      handler: function (val, oldVal) {
        this.$_.forEach(
          this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
          (item) => {
            if (item.workerOpinionYn === 'N') {
              item.imprAct = '';
              item.improvement = '';
              if (item.committeeConfNo && item.agendaNo) {
                this.deleteImpr(item);
              }
            } else if (item.workerOpinionYn === 'Y') {
              item.imprAct = '즉시조치';
              item.improvement = '개선요청';
            }
          }
        );
      },
      deep: true,
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.gridOptions.header = [];
      // this.getList(); // 회의 안건 목록 조회
      this.headerSet().then(() => {
        this.setData();
      });
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'),
          color: 'blue',
          btnClicked: 'btnAddRow',
          visible: !this.disabled,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'deleteRow',
          visible: !this.disabled,
        },
      ];
    },
    headerSet() {
      return new Promise((resovle) => {
        if (this.industrialSafetyHealthCommittee.cmiClsCd === 'CMCL3') {
          this.gridOptions.header = [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
              dataField: 'sortOrder',
              dataType: 'numeric',
              width: '10%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                autoThousandSeparator: true, // 천단위 구분자 삽입 여부
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003365'),
              dataField: 'agendaDesc',
              editable: !this.disabled,
              width: '15%',
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001825'),
              dataField: 'agendaReview',
              width: '15%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003267'),
              dataField: 'agendaResult',
              width: '15%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
              dataField: 'remark',
              width: '15%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005066'),
              dataField: 'workerOpinionYn',
              width: '10%',
              editable: !this.disabled,
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
                checkValue: 'Y', // true, false 인 경우가 기본
                unCheckValue: 'N',
                checkableFunction: function (
                  rowIndex,
                  columnIndex,
                  value,
                  isChecked,
                  item,
                  dataField
                ) {
                  if (value) {
                    return true;
                  }
                },
              },
            },
            // {
            //   text: 'L0000005066' /* 종사자의견여부 */,
            //   name: 'workerOpinionYn',
            //   width: '120px',
            //   type: 'checkbox',
            //   align: 'center',
            //   useDefault: true,
            // },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
              dataField: 'improvement',
              width: '10%',
              editable: false,
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002737'),
              dataField: 'imprAct',
              width: '10%',
              editable: false,
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
          ];
        } else {
          this.gridOptions.header = [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
              dataField: 'sortOrder',
              dataType: 'numeric',
              editable: !this.disabled,
              width: '10%',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                autoThousandSeparator: true, // 천단위 구분자 삽입 여부
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003365'),
              dataField: 'agendaDesc',
              width: '15%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001825'),
              dataField: 'agendaReview',
              width: '15%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003267'),
              dataField: 'agendaResult',
              width: '15%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
              dataField: 'remark',
              width: '15%',
              editable: !this.disabled,
              editRenderer: {
                type: 'InputEditRenderer',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005066'),
              dataField: 'workerOpinionYn',
              width: '10%',
              editable: !this.disabled,
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
                checkValue: 'Y', // true, false 인 경우가 기본
                unCheckValue: 'N',
                // checkableFunction: function (rowIndex, columnIndex, value, isChecked, item, dataField) {
                //   if (value) {
                //     return true;
                //   }
                // }
              },
            },
            // {
            //   text: 'L0000005066' /* 종사자의견여부 */,
            //   name: 'workerOpinionYn',
            //   width: '120px',
            //   type: 'checkbox',
            //   align: 'center',
            //   useDefault: true,
            // },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
              dataField: 'improvement',
              width: '10%',
              editable: false,
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002737'),
              dataField: 'imprAct',
              width: '10%',
              editable: false,
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
          ];
        }
        resovle();
      });
    },
    setData() {
      this.YAuiGrid.setGridData(
        this.industrialSafetyHealthCommittee.mgtCommitteeAgendas
      );
    },
    cellEditEndHandler(event) {
      if (event.item.workerOpinionYn === 'N') {
        if (event.item.committeeConfNo && event.item.agendaNo) {
          this.deleteImpr(event.item);
        }
      }
      this.industrialSafetyHealthCommittee.mgtCommitteeAgendas =
        this.YAuiGrid.getGridData();
    },
    cellClickHandler(event) {
      if (event.item.agendaNo > 0) {
        if (!(!this.disabled && this.editable)) {
          return;
        }
        if (
          event.dataField !== 'improvement' &&
          event.dataField !== 'imprAct'
        ) {
          return;
        }

        if (event.item.workerOpinionYn === 'N') return;

        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: 'ICL13',
          refTableId: event.item ? event.item.agendaNo : 0,
          flag: 'BATCH',
          title: this.industrialSafetyHealthCommittee.confNm,
        };

        // 개선요청
        if (event.dataField === 'improvement') {
          this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
          this.popupOptions.param.actClassCd = 'ACL02';
        } else if (event.dataField === 'imprAct') {
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
    tableLinkClicked(header, data) {
      if (data.agendaNo > 0) {
        if (!(!this.disabled && this.editable)) {
          return;
        }

        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: 'ICL13',
          refTableId: data ? data.agendaNo : 0,
          flag: 'BATCH',
          title: this.industrialSafetyHealthCommittee.confNm,
        };

        // 개선요청
        if (header.name === 'improvement') {
          this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
          this.popupOptions.param.actClassCd = 'ACL02';
        } else if (header.name === 'imprAct') {
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
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.$emit('refresh', true);

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
          sortOrder: 0,
          agendaNo: '',
          agendaDesc: '',
          agendaReview: '',
          agendaResult: '',
          remark: '',
          workerOpinionYn: 'Y',
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
          sortOrder: 0,
          agendaNo: '',
          agendaDesc: '',
          agendaReview: '',
          agendaResult: '',
          remark: '',
          workerOpinionYn: 'Y',
          safImprActNo: 0,
          improvement: '',
          imprAct: '',
        });
      });
    },
    deleteRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000911' /*  삭제 할 데이터를 선택하세요. */,
          type: 'warning', // success / info / warning / error
        });
      } else {
        for (let i = 0; i < removeData.length; i++) {
          this.YAuiGrid.removeRow(removeData[i].rowIndex);
        }
        // 삭제한 항목을 따로 저장해 둔 후 저장 버튼을 누를때 가지고 가서
        // 개선요청 묶여 있는 건들도 같이 지운다.
        if (!this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendas) {
          this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendas = [];
        }

        this.$_.forEach(removeData, (item) => {
          if (item.tempId) {
            this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.splice(
              this.$_.findIndex(
                this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
                { tempId: item.tempId }
              ),
              1
            );
          } else {
            item.item.imprClassCd = 'ICL13';
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
    btnAdd() {
      return new Promise((_resolve, _reject) => {
        // if (!this.industrialSafetyHealthCommittee.subPlantNm) {
        //   window.getApp.$emit('ALERT', {
        //     title: 'L0000003395' /* 안내 */,
        //     message: 'L0000005081', // 본문 사업장을 선택해주세요.
        //     type: 'warning', // success / info / warning / error
        //   });
        //   _resolve(false);
        //   return;
        // }
        // if (!this.industrialSafetyHealthCommittee.subConfNm) {
        //   window.getApp.$emit('ALERT', {
        //     title: 'L0000003395' /* 안내 */,
        //     message: 'L0000005080', // 본문 제목을 입력해주세요.
        //     type: 'warning', // success / info / warning / error
        //   });
        //   _resolve(false);
        //   return;
        // }
        // if (!this.industrialSafetyHealthCommittee.subHalfTypeNm) {
        //   window.getApp.$emit('ALERT', {
        //     title: 'L0000005079' /* 안내 */,
        //     message: 'L0000005079', // 본문 구분을 선택해주세요.
        //     type: 'warning', // success / info / warning / error
        //   });
        //   _resolve(false);
        //   return;
        // }
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
        var date = new Date();
        this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.splice(0, 0, {
          tempId: String(date.getTime()),
          committeeConfNo: this.industrialSafetyHealthCommittee.committeeConfNo,
          subPlantNm: this.industrialSafetyHealthCommittee.subPlantNm,
          subConfNm: this.industrialSafetyHealthCommittee.subConfNm,
          subHalfTypeNm: this.industrialSafetyHealthCommittee.subHalfTypeNm,
          sortOrder: 0,
          agendaNo: '',
          agendaDesc: '',
          agendaReview: '',
          agendaResult: '',
          remark: '',
          workerOpinionYn: 'Y',
          safImprActNo: 0,
          improvement: '',
          imprAct: '',
        });
      });
    },
    /**
     * 사내사고 원인 및 재발방지대책행 삭제
     */
    btnDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000911' /*  삭제 할 데이터를 선택하세요. */,
          type: 'warning', // success / info / warning / error
        });
      } else {
        // 삭제한 항목을 따로 저장해 둔 후 저장 버튼을 누를때 가지고 가서
        // 개선요청 묶여 있는 건들도 같이 지운다.
        if (!this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendas) {
          this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendas = [];
        }

        this.$_.forEach(this.selectedValue, (item) => {
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
              item
            );
            this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.splice(
              this.$_.findIndex(
                this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
                {
                  agendaNo: item.agendaNo,
                }
              ),
              1
            );
          }
        });
      }
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
    /** end button 관련 이벤트 **/
  },
};
</script>
