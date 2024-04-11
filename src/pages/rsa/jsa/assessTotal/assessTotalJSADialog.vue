<!--
  목적 : 평가결과 집계 상세 화면
  Detail : 평가결과 집계 중 KARA의 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- JSA 평가결과집계 상세정보 -->
            <y-label
              label="L0000000122"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  apprMode &&
                  !popupParam.apprFlag &&
                  editable &&
                  this.popupParam.bizApprStepCd !== 'BAPSD'
                "
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 결재요청회수 -->
              <y-btn
                v-if="collectCheck && !popupParam.apprFlag"
                title="L0000003420"
                color="black"
                @btnClicked="btnCollectClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup('C')"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="4" md lg="4" xl="4" class="col-xxl-4">
              <!-- 평가명 -->
              <y-label label="L0000003081" />
              <y-label :label="popupParam.assessNm" :fieldable="true" />
            </b-col>
            <b-col
              v-if="
                popupParam.deptNm !== null &&
                popupParam.deptNm !== '' &&
                popupParam.deptNm !== undefined
              "
              sm="4"
              md
              lg="4"
              xl="4"
              class="col-xxl-4"
            >
              <!-- 부서 -->
              <y-label label="L0000001287" />
              <y-label :label="popupParam.deptNm" :fieldable="true" />
            </b-col>
            <b-col
              v-if="
                popupParam.processNm !== null &&
                popupParam.processNm !== '' &&
                popupParam.processNm !== undefined
              "
              sm="4"
              md
              lg="4"
              xl="4"
              class="col-xxl-4"
            >
              <!-- 공정 -->
              <y-label v-if="divisionCheck" label="L0000000515" />
              <y-label
                v-if="divisionCheck"
                :label="popupParam.processNm"
                :fieldable="true"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 평가대상 작업 -->
        <y-auigrid
          ref="yAssessGrid"
          :headers="assessJobGridOptions.header"
          :btns="assessJobGridOptions.btns"
          :height="assessJobGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003071')"
          :useExcelExport="false"
          :showItemCount="false"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 평가대상 작업단계 -->
        <y-auigrid
          ref="yAssessStepGrid"
          :headers="assessStepGridOptions.header"
          :btns="assessStepGridOptions.btns"
          :height="assessStepGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003073')"
          :useExcelExport="false"
          :showItemCount="false"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 평가진행현황 -->
        <y-auigrid
          ref="yJsaGrid"
          :headers="JSAGridOptions.header"
          :btns="JSAGridOptions.btns"
          :height="JSAGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003097')"
          :useExcelExport="false"
          :showItemCount="false"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 위험등록부 등재 목록 -->
        <y-auigrid
          ref="yRiskBookGrid"
          :headers="riskBookGridOptions.header"
          :btns="riskBookGridOptions.btns"
          :height="riskBookGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002130')"
          :useExcelExport="false"
          :showItemCount="false"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 개선진행현황 -->
        <y-auigrid
          ref="yImprActGrid"
          :headers="imprActGridOptions.header"
          :btns="imprActGridOptions.btns"
          :height="imprActGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000283')"
          :useExcelExport="false"
          :showItemCount="false"
        />
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
  name: 'assess-JSA-tab',
  props: {
    popupParam: {
      assessPlanNo: 0,
      assessNm: '',
      deptCd: '',
      deptNm: '',
      processCd: '',
      processNm: '',
      totalDivision: '',
      bizApprStepCd: '',
      apprFlag: false,
      rapprRqstNo: 0,
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '85%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      YAssessGrid: null,
      assessJobGridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      YAssessStepGrid: null,
      assessStepGridOptions: {
        header: [],
        data: [],
        height: 200,
        merge: [],
      },
      YJsaGrid: null,
      JSAGridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      YRiskBookGrid: null,
      riskBookGridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      YImprActGrid: null,
      imprActGridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      editable: false,
      divisionCheck: false,
      apprMode: false,
      collectCheck: false,
      collectUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated() {},
  mounted() {
    this.YAssessGrid = this.$refs.yAssessGrid;
    this.YAssessStepGrid = this.$refs.yAssessStepGrid;
    this.YJsaGrid = this.$refs.yJsaGrid;
    this.YRiskBookGrid = this.$refs.yRiskBookGrid;
    this.YImprActGrid = this.$refs.yImprActGrid;

    this.getAssessJobList();
    this.getAssessStepList();
    this.getJSAList();
    this.getRiskBookList();
    this.getImprActList();
    this.getCollectable();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // url
      this.collectUrl = transactionConfig.manage.appr.collect.url;

      // 권한
      this.editable = this.$route.meta.editable;
      if (this.popupParam.totalDivision === 'PROCESS') {
        this.divisionCheck = true;
      } else if (
        this.popupParam.totalDivision === 'RESULT' &&
        !this.popupParam.bizApprStepCd
      ) {
        this.apprMode = true;
      }

      // GridHeader
      this.assessJobGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'),
          dataField: 'jobCd',
          width: '23%',
        }, // 작업코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '31%',
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000866'),
          dataField: 'jobStepCnt',
          width: '23%',
        }, // 단계건수
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002186'),
          dataField: 'riskhazardCnt',
          width: '23%',
        }, // 유해위험요인건수
      ];

      this.assessStepGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'),
          dataField: 'jobCd',
          width: '17%',
          cellMerge: true,
        }, // 작업코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '17%',
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002401'),
          dataField: 'jobStepNo',
          width: '16%',
        }, // 작업순서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002375'),
          dataField: 'jobStepNm',
          width: '17%',
        }, // 작업단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002886'),
          dataField: 'lastAssessDate',
          width: '17%',
        }, // 최종 평가일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003046'),
          dataField: 'riskHazardCnt',
          width: '16%',
        }, // 평가건수
      ];

      this.JSAGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'),
          dataField: 'jobCd',
          width: '150',
        }, // 작업코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '200',
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002401'),
          dataField: 'jobStepNo',
          width: '150',
        }, // 작업순서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002375'),
          dataField: 'jobStepNm',
          width: '150',
        }, // 작업단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'),
          dataField: 'pRiskHazardNm',
          width: '150',
        }, // 유해위험요인 분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
          dataField: 'riskHazardNm',
          width: '300',
        }, // 유해위험요인

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000273'), // 개선전
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001378'),
              dataField: 'currentFrequencySize',
              width: '100',
            }, // 빈도
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000248'),
              dataField: 'currentStrongSize',
              width: '100',
            }, // 강도
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002121'),
              dataField: 'currentRiskSize',
              width: '100',
            }, // 위험도
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000254'),
          dataField: 'improve',
          width: '200',
        }, // 개선대책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000284'), // 개선후
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001378'),
              dataField: 'afterFrequencySize',
              width: '100',
            }, // 빈도
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000248'),
              dataField: 'afterStrongSize',
              width: '100',
            }, // 강도
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002121'),
              dataField: 'afterRiskSize',
              width: '100',
            }, // 위험도
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001378'),
          dataField: 'afterFrequencySize',
          width: '100',
        }, // 빈도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000248'),
          dataField: 'afterStrongSize',
          width: '100',
        }, // 강도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002121'),
          dataField: 'afterRiskSize',
          width: '100',
        }, // 위험도
      ];

      this.riskBookGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002126'),
          dataField: 'riskBookNo',
          width: '150',
        }, // 위험등록부 No
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000282'),
          dataField: 'imprStepNm',
          width: '150',
        }, // 개선진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'),
          dataField: 'jobCd',
          width: '150',
        }, // 작업코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '200',
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002401'),
          dataField: 'jobStepNo',
          width: '150',
        }, // 작업순서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002375'),
          dataField: 'jobStepNm',
          width: '150',
        }, // 작업단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'),
          dataField: 'pRiskHazardNm',
          width: '150',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
          dataField: 'riskHazardNm',
          width: '300',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000254'),
          dataField: 'improve',
          width: '200',
        }, // 개선대책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003083'),
          dataField: 'evalDesc',
          width: '200',
        }, // 평가상세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '150',
        }, // 등록자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000975'),
          dataField: 'createDt',
          width: '150',
        }, // 등록일자
      ];

      this.imprActGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002126'),
          dataField: 'riskBookNo',
          width: '150',
        }, // 위험등록부 No
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'imprStepNm',
          width: '150',
        }, // 진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001947'),
          dataField: 'imprClassNm',
          width: '200',
        }, // 업무구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'imprTitle',
          width: '250',
        }, // 제목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002051'),
          dataField: 'imprRqstContents',
          width: '250',
        }, // 요청내용
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002057'),
          dataField: 'imprRqstYmd',
          width: '150',
        }, // 요청자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002056'),
          dataField: 'imprRqstYmd',
          width: '150',
        }, // 요청일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002669'),
          dataField: 'actLimitYmd',
          width: '150',
        }, // 조치기간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'),
          dataField: 'actDeptNm',
          width: '150',
        }, // 조치부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002692'),
          dataField: 'actUserNm',
          width: '150',
        }, // 조치자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002691'),
          dataField: 'actConfirmYmd',
          width: '150',
        }, // 조치일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002671'),
          dataField: 'actResultContents',
          width: '250',
        }, // 조치내용
      ];
    },
    getAssessJobList() {
      this.$http.url = selectConfig.rsa.assessTotal.assessJobList.url;
      this.$http.type = 'GET';
      this.$http.param = this.popupParam;
      this.$http.request(
        (_result) => {
          if (_result.data && _result.data.length > 0) {
            this.popupParam.assessNm = _result.data[0].assessNm;
          }
          this.YAssessGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getAssessStepList(data) {
      if (data) this.popupParam.jobId = data.jobId;

      this.$http.url = selectConfig.rsa.assessAction.jsaList.url;
      this.$http.type = 'GET';
      this.$http.param = this.popupParam;
      this.$http.request(
        (_result) => {
          this.YAssessStepGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getJSAList() {
      this.$http.url = selectConfig.rsa.assessResult.jsaList.url;
      this.$http.type = 'GET';
      this.$http.param = this.popupParam;
      this.$http.request(
        (_result) => {
          this.YJsaGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRiskBookList() {
      var searchParam = this.popupParam;
      searchParam.riskBookCheck = 'Y';

      this.$http.url = selectConfig.rsa.assessResult.jsaList.url;
      this.$http.type = 'GET';
      this.$http.param = searchParam;
      this.$http.request(
        (_result) => {
          this.YRiskBookGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCollectable() {
      if (!this.popupParam.rapprRqstNo || this.popupParam.rapprRqstNo <= 0) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.popupParam.rapprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.collectCheck = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getImprActList() {
      var searchParam = this.popupParam;
      searchParam.assessTypeNm = 'JSA';

      this.$http.url = selectConfig.rsa.assessTotal.imprActList.url;
      this.$http.type = 'GET';
      this.$http.param = searchParam;
      this.$http.request(
        (_result) => {
          this.YImprActGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(flag) {
      this.$emit('closePopup', {});
    },
    btnAppr() {
      if (this.riskBookGridOptions.data.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321', // '확인',
          message: 'M0000000672', // 위험등록부를 등록해주세요.
          type: 'warning',
        });
        return;
      }
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'RS-EV-02',
        apprParams: {
          assessPlanNo: this.popupParam.assessPlanNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.apprMode = false;
        this.popupParam.rapprRqstNo = data.apprRqstNo;
        this.collectCheck = true;
      }
    },
    btnCollectClickedCallback() {
      if (this.collectCheck) {
        this.$http.url = this.$format(
          this.collectUrl,
          this.riskAssessPlan.papprRqstNo
        );
        this.$http.type = 'PUT';

        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000507', // 회수되었습니다.
              type: 'success', // success / info / warning / error
            });
            this.closePopup();
          },
          (_error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000506', // 이미 결재된 문서입니다.
          type: 'warning', // success / info / warning / error
        });
        this.closePopup();
      }
    },
  },
};
</script>

<style></style>
