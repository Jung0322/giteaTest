<!--
  목적 : 작업허가서 신청 목록
  Detail : 작업허가서 신청 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <b-col v-if="tabParam.target !== 'IMM'" sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              v-if="!disabled && editable && gridOptions2.data.length > 0"
              title="행 삭제"
              color="red"
              :showLoading="false"
              @btnClicked="deleteRow2"
            />
          </div>
          <!-- 즉시조치사항 목록 -->
          <y-data-table
            label="L0000002742"
            ref="dataTable"
            :useRownum="false"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :editable="!disabled && editable"
            v-model="gridOptions2.selectValue"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
        <div v-if="tabParam.target !== 'RQT'" class="mt-3" />
        <b-col v-if="tabParam.target !== 'IMM'" sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- <y-btn v-if="!disabled && editable" title="삭제" color="red" @btnClicked="deleteRow" /> -->
          </div>
          <!-- 개선요청사항 목록 -->
          <y-data-table
            label="L0000000270"
            ref="dataTable"
            :useRownum="false"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="!disabled && editable"
            v-model="gridOptions.selectValue"
            @tableLinkClicked="tableLinkimprTitleClicked"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
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
  /* attributes: name, components, props, data */
  name: 'meet-impr-act-tab',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    tabParam: {
      type: Object,
      default: function () {
        return {
          imprClassCd: 'ICL13',
          refTableId: 0,
          editable: true,
          detailCheck: false,
          status: '',
          message: '',
          committeeConfNo: 0,
          tabClickCnt: 0,
        };
      },
    },
    tabIndex: '',
    industrialSafetyHealthCommittee: {
      type: Object,
      default: function () {
        return {
          committeeConfNo: 0,
          mgtCommitteeAgendaImprs: [], // 개선사항
          deleteMgtCommitteeAgendaImprs: [], // 삭제할 개선사항
        };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        selectValue: [],
      },
      gridOptions2: {
        header: [],
        data: [],
        selectValue: [],
      },
      searchUrl: '',
      saveUrl: '',
      deleteUrl: '',
      editable: false,
      searchParam: {
        imprClassCd: 'ICL13',
        committeeConfNo: 0,
      },
    };
  },
  watch: {
    'tabParam.tabClickCnt': {
      handler: function (val, oldVal) {
        this.getList();
      },
      deep: true,
    },

    'industrialSafetyHealthCommittee.committeeConfNo': {
      handler: function (val, oldVal) {
        this.getList();
      },
      deep: true,
    },
    'gridOptions2.data': {
      handler: function (val, oldVal) {
        this.$_.forEach(
          this.industrialSafetyHealthCommittee.mgtCommitteeAgendaImprs,
          (item) => {
            if (item.actClassCd === 'ACL01') {
              // 즉시조치
              if (item.safImprActNo) {
                let index = this.$_.findIndex(this.gridOptions2.data, {
                  safImprActNo: item.safImprActNo,
                });
                if (index > -1) {
                  item.dtlLocat = this.gridOptions2.data[index].dtlLocat;
                  item.discoverMatter =
                    this.gridOptions2.data[index].discoverMatter;
                  item.actResultContents =
                    this.gridOptions2.data[index].actResultContents;
                  item.actConfirmYmd =
                    this.gridOptions2.data[index].actConfirmYmd;
                }
              }
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
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.mgt.meetingAgendaImprAct.list.url;
      this.editable = this.$route.meta.editable;
      this.getList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000003364',
          name: 'agendaDesc',
          width: '130px',
          align: 'center',
        }, // 회의안건
        {
          text: 'L0000002668',
          name: 'actClassNm',
          width: '130px',
          align: 'center',
        }, // 조치구분
        {
          text: 'L0000000267',
          name: 'imprRqstContents',
          width: '300px',
          url: 'true',
        }, // 개선요청내용
        { text: 'L0000002666', name: 'actResultContents', width: '250px' }, // 조치결과내용
        {
          text: 'L0000002673',
          name: 'actDeptNm',
          width: '130px',
          align: 'center',
        }, // 조치부서
        {
          text: 'L0000002682',
          name: 'actSchYmd',
          width: '130px',
          align: 'center',
        }, // 조치예정일
        {
          text: '조치완료일',
          name: 'actConfirmYmd',
          width: '130px',
          align: 'center',
        }, // L0000002685
      ];
      this.gridOptions2.header = [
        {
          text: 'L0000003364',
          name: 'agendaDesc',
          width: '130px',
          align: 'center',
        }, // 회의안건
        {
          text: 'L0000001641',
          name: 'dtlLocat',
          width: '130px',
          align: 'center',
          type: 'text',
          maxlength: 50,
        }, // 세부위치
        {
          text: 'L0000001073',
          name: 'discoverMatter',
          width: '300px',
          type: 'textarea',
          maxlength: 600,
        }, // 발견사항
        {
          text: 'L0000002666',
          name: 'actResultContents',
          width: '250px',
          type: 'text',
          maxlength: 1300,
        }, // 조치결과내용
        {
          text: 'L0000002692',
          name: 'actUser',
          width: '130px',
          align: 'center',
          type: 'userSearch',
        }, // 조치자
        {
          text: 'L0000002691',
          name: 'actConfirmYmd',
          width: '170px',
          align: 'center',
          type: 'datepicker',
        }, // 조치일자
      ];
    },
    getList() {
      if (this.industrialSafetyHealthCommittee.committeeConfNo === 0) return;
      this.searchParam.imprClassCd = this.tabParam.imprClassCd;
      this.searchParam.committeeConfNo =
        this.industrialSafetyHealthCommittee.committeeConfNo;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.industrialSafetyHealthCommittee.mgtCommitteeAgendaImprs =
            _result.data;
          if (this.gridOptions2.data && this.gridOptions2.data.length > 0) {
            this.gridOptions2.data = [];
          }
          let immData = this.$_.filter(_result.data, {
            actClassCd: 'ACL01',
          });
          this.$_.forEach(immData, (item) => {
            this.gridOptions2.data.push({
              safImprActNo: item.safImprActNo,
              imprStepCd: item.imprStepCd,
              actClassCd: item.actClassCd,
              imprClassCd: item.imprClassCd,
              plantCd: item.plantCd,
              dtlLocat: item.dtlLocat,
              discoverMatter: item.discoverMatter,
              actResultContents: item.actResultContents,
              actConfirmYmd: item.actConfirmYmd,
              actUserId: item.actUserId,
              actUserNm: item.actUserNm,
              actUser: {
                userId: item.actUserId,
                userNm: item.actUserNm,
              },
              actDeptCd: item.actDeptCd,
              agendaDesc: item.agendaDesc,
              createUserId: item.createUserId,
              updateUserId: item.updateUserId,
            });
          });
          // 개선요청사항 목록
          this.gridOptions.data = this.$_.filter(_result.data, {
            actClassCd: 'ACL02',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** button 관련 이벤트 **/
    deleteRow() {
      if (
        !this.gridOptions.selectValue ||
        this.gridOptions.selectValue.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001148', // 삭제 할 행을 선택하세요.
          type: 'warning',
        });
      } else {
        if (
          !this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendaImprs
        ) {
          this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendaImprs =
            [];
        }
        this.$_.forEach(this.gridOptions.selectValue, (item) => {
          this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendaImprs.push(
            item
          );
          this.gridOptions.data.splice(
            this.$_.findIndex(this.gridOptions.data, {
              safImprActNo: item.safImprActNo,
            }),
            1
          );
        });
      }
    },
    deleteRow2() {
      if (
        !this.gridOptions2.selectValue ||
        this.gridOptions2.selectValue.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001148', // 삭제 할 행을 선택하세요.
          type: 'warning',
        });
      } else {
        if (
          !this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendaImprs
        ) {
          this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendaImprs =
            [];
        }
        this.$_.forEach(this.gridOptions2.selectValue, (item) => {
          this.industrialSafetyHealthCommittee.deleteMgtCommitteeAgendaImprs.push(
            item
          );
          this.gridOptions2.data.splice(
            this.$_.findIndex(this.gridOptions2.data, {
              safImprActNo: item.safImprActNo,
            }),
            1
          );
        });
      }
    },
    tableLinkimprTitleClicked(header, data) {
      this.openDialogPage('DETAIL', data);
    },
    openDialogPage(flag, data) {
      if (data !== undefined) {
        if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL01') {
          flag = 'NOW';
        } else if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL02') {
          flag = 'REQUEST';
        }
        if (!this.editable) flag = 'DETAIL';
        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
          editable: this.tabParam.editable2,
        };
      } else {
        if (!this.editable) flag = 'DETAIL';

        this.popupOptions.param = {
          safImprActNo: 0,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
          editable: this.tabParam.editable2,
        };
      }
      if (this.tabParam.detailCheck) {
        flag = 'DETAIL';
        this.popupOptions.param.flag = 'DETAIL';
      }
      if (flag === 'NOW' && this.gridOptions2.data.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000096', // 즉시조치사항 목록에 있는 데이터가 저장된 후 즉시조치등록팝업이 뜹니다. 진행하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            let saveData = this.$_.reject(this.gridOptions2.data, {
              safImprActNo: 0,
              dtlLocat: '',
              discoverMatter: '',
              actResultContents: '',
            });
            this.$_.forEach(saveData, (item) => {
              item.refTableId = this.tabParam.refTableId;
              item.actUserId = item.actUser.userId;
              item.actUserNm = item.actUser.userNm;
            });
            this.$http.url = this.saveUrl;
            this.$http.type = 'POST';
            this.$http.param = saveData;
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000006', // 저장되었습니다
                  type: 'success', // success / info / warning / error
                });
                this.getList();
                this.popupOptions.title = 'L0000002740'; // 즉시조치등록
                this.popupOptions.target = () =>
                  import(`${'../../impr/immediateActionNewDetail.vue'}`);
                this.popupOptions.top = '10px';
                this.popupOptions.visible = true;
                this.popupOptions.closeCallback = this.closePopup;
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      } else if (flag === 'NOW') {
        this.popupOptions.title = 'L0000002740'; // 즉시조치등록
        this.popupOptions.target = () =>
          import(`${'../../impr/immediateActionNewDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (flag === 'DETAIL') {
        this.popupOptions.title = 'L0000003458'; // 개선요청상세
        this.popupOptions.target = () =>
          import(`${'../../impr/improveDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.title = 'L0000000268'; // 개선요청등록
        this.popupOptions.target = () =>
          import(`${'../../impr/actionRequest.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
