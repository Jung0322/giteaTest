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
    <b-row>
      <b-col sm="12">
        <!-- 조사결과 테이블 -->
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 행추가 -->
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000003224"
                  color="blue"
                  :showLoading="false"
                  @btnClicked="btnAdd"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 행삭제 -->
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000003223"
                  color="red"
                  :showLoading="false"
                  @btnClicked="btnDelete"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
              <!-- 안건 목록 -->
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
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
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
    research: {
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
    isInsert: false,
    isEdit: false,
    searchUrl: '',
  }),
  watch: {
    // 'industrialSafetyHealthCommittee': {
    //   handler: function (val, oldVal) {
    //     this.getList(); // 회의안건
    //   },
    //   deep: true,
    // },
    // 'gridOptions.data': {
    //   handler: function (val, oldVal) {
    //     let deleteData = this.$_.clone(
    //       this.industrialSafetyHealthCommittee.mgtCommitteeAgendas
    //     );
    //     this.$_.forEach(
    //       this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
    //       (item) => {
    //         if (item.agendaNo) {
    //           let index = this.$_.findIndex(this.gridOptions.data, {
    //             agendaNo: item.agendaNo,
    //           });
    //           if (index === -1) {
    //             deleteData = this.$_.reject(deleteData, {
    //               agendaNo: item.agendaNo,
    //             });
    //           }
    //         } else {
    //           let index = this.$_.findIndex(this.gridOptions.data, {
    //             tempId: item.tempId,
    //           });
    //           if (index === -1) {
    //             deleteData = this.$_.reject(deleteData, {
    //               tempId: item.tempId,
    //             });
    //           }
    //         }
    //       }
    //     );
    //     this.industrialSafetyHealthCommittee.mgtCommitteeAgendas = deleteData;
    //     this.$_.forEach(this.gridOptions.data, (item) => {
    //       if (item.agendaNo) {
    //         let index = this.$_.findIndex(
    //           this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
    //           {
    //             agendaNo: item.agendaNo,
    //           }
    //         );
    //         if (index > -1) {
    //           this.industrialSafetyHealthCommittee.mgtCommitteeAgendas[
    //             index
    //           ] = item;
    //         } else {
    //           this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.push(
    //             item
    //           );
    //         }
    //       } else {
    //         let index = this.$_.findIndex(
    //           this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
    //           {
    //             tempId: item.tempId,
    //           }
    //         );
    //         if (index > -1) {
    //           this.industrialSafetyHealthCommittee.mgtCommitteeAgendas[
    //             index
    //           ] = item;
    //         } else {
    //           this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.push(
    //             item
    //           );
    //         }
    //       }
    //     });
    //   },
    //   deep: true,
    // },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          text: 'L0000003365',
          name: 'agendaDesc',
          width: '250px',
          type: 'text',
          maxLength: 30,
          required: true,
        }, // 회의안건(*)
        {
          text: 'L0000001825',
          name: 'agendaReview',
          width: '150px',
          type: 'text',
          maxLength: 30,
        }, // 심의
        {
          text: 'L0000003267',
          name: 'agendaResult',
          width: '250px',
          type: 'text',
          maxLength: 30,
        }, // 협의결과(*)
        {
          text: 'L0000001360',
          name: 'remark',
          width: '250px',
          type: 'text',
          maxLength: 30,
        }, // 비고
        {
          text: 'L0000000264',
          name: 'improvement',
          width: '100px',
          url: 'true',
          align: 'center',
        }, // 개선요청
        {
          text: 'L0000002737',
          name: 'imprAct',
          width: '100px',
          url: 'true',
          align: 'center',
        }, // 즉시조치
      ];

      // this.getList(); // 회의 안건 목록 조회
    },
    /** 회의 안건 목록 조회 **/
    // getList() {
    //   if (!this.industrialSafetyHealthCommittee.committeeConfNo) {
    //     return;
    //   } else {
    //     if (
    //       this.industrialSafetyHealthCommittee.mgtCommitteeAgendas &&
    //       this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.length > 0
    //     ) {
    //       this.gridOptions.data = [];
    //       this.gridOptions.data = this.industrialSafetyHealthCommittee.mgtCommitteeAgendas;
    //     }
    //   }
    // },

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
          this.popupOptions.title = 'L0000002740'; // 즉시조치 등록
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
    btnAdd() {
      var date = new Date();
      this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.splice(0, 0, {
        tempId: String(date.getTime()),
        committeeConfNo: this.industrialSafetyHealthCommittee.committeeConfNo,
        agendaNo: '',
        agendaDesc: '',
        agendaReview: '',
        agendaResult: '',
        remark: '',
        safImprActNo: 0,
        improvement: '',
        imprAct: '',
      });
    },
    /**
     * 사내사고 원인 및 재발방지대책행 삭제
     */
    btnDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
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
            item.imprClassCd = this.tabParam.imprClassCd;
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
    /** end button 관련 이벤트 **/
  },
};
</script>
