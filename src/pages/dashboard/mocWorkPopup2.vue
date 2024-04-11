<!--
  목적 : 안전 - 변경관리 상세 - 진행관리
  Detail : 진행관리 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row
      v-for="(changeRefWork, index) in changeRefWorksInfo"
      :key="index"
      class="mb-3"
    >
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              :label="
                changeRefWork.codeNm +
                ' ' +
                $comm.getLangSpecInfoLabel('L0000001526')
              "
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col v-if="changeRefWork.gridView">
              <y-data-table
                ref="dataTable"
                :height="200"
                :headers="changeRefWork.gridOptionsHeader"
                :items="changeRefWork.gridOptionsData"
                :label="
                  changeRefWork.codeNm +
                  ' ' +
                  $comm.getLangSpecInfoLabel('L0000001022')
                "
                minHeight="150px"
                @tableLinkClicked="tableLinkClicked"
                :popMode="true"
              >
              </y-data-table>
            </b-col>
            <!-- 첨부파일 -->
            <el-divider content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000002843')
            }}</el-divider>
            <b-col sm="12" class="mb-2">
              <y-file-upload
                :ref="'fileupload_' + changeRefWork.code"
                :label="changeRefWork.attachFileGrp.label"
                :showUploadBtn="false"
                :drag="changeRefWork.attachFileGrp.drag"
                :editable="false"
                :multiple="changeRefWork.attachFileGrp.multiple"
                :attach-file-grp="changeRefWork.attachFileGrp"
                :close="true"
                :limit="changeRefWork.attachFileGrp.limit"
                :disabled="true"
                :listType="changeRefWork.attachFileGrp.listType"
                :showFileSearch="false"
                :onlyDownload="true"
                :uploadTempFiles="changeRefWork.attachFileGrp.uploadTempFiles"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-change-ref-work',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          safChngNo: 0,
          chngRefWorkCd: '',
          plantCd: '',
        };
      },
    },
  },
  data: () => ({
    changeRefWorksInfo: [],
    changeRefWorks: [],
    attachFileGrps: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    searchUrl: '',
  }),
  watch: {},
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

      this.searchUrl = selectConfig.saf.changeRefWork.list.url;
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safChngNo: this.popupParam.safChngNo,
        chngRefWorkCd: this.popupParam.chngRefWorkCd,
      };
      this.$http.request(
        (_result) => {
          this.changeRefWorks = _result.data;
          this.getComboItems(); // 진행사항
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 공통 마스터 정보 조회 (변경구분, 등급(작성), 등급(검토))
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$comm.getComboItems('SAF_CHNG_REF_WORK').then((_result) => {
        this.changeRefWorksInfo = this.$_.filter(_result, {
          code: this.popupParam.chngRefWorkCd,
        });

        this.setAttachFileGrps(); // 첨부파일 셋팅
        this.setGridOption(); // 테이블 셋팅
      });
    },
    setAttachFileGrps() {
      this.$_.forEach(this.changeRefWorksInfo, (item) => {
        let taskKey = this.popupParam.safChngNo
          ? item.code + this.popupParam.safChngNo.toString()
          : '';
        item.attachFileGrp = {
          label: '',
          listType: 'text',
          drag: false,
          editable: false,
          limit: 10,
          multiple: false,
          uploadTempFiles: null,
          taskClassNm: 'CHANGE_REF_WORK_' + item.code,
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        };
      });
    },
    setGridOption() {
      this.$_.forEach(this.changeRefWorksInfo, (item) => {
        let filterData = this.$_.filter(this.changeRefWorks, {
          chngRefWorkCd: item.code,
        });
        switch (item.code) {
          // 공정안전자료
          case 'CGRW1':
            item.gridView = true;
            item.typeCd = 'PSM';
            item.plantCd = this.popupParam.plantCd;
            item.selectValue = [];
            item.gridOptionsHeader = [
              { text: 'L0000002616', name: 'refWorkNm', url: 'true' }, // 제목
              { text: 'L0000000973', name: 'refWorkDt', align: 'center' }, // 등록일
            ];
            break;
          // 공정위험성평가
          case 'CGRW2':
            item.gridView = true;
            item.typeCd = 'RISK';
            item.plantCd = this.popupParam.plantCd;
            item.selectValue = [];
            item.gridOptionsHeader = [
              { text: 'L0000002616', name: 'refWorkNm', url: 'true' }, // 제목
              { text: 'L0000002779', name: 'stepNm' }, // 진행상태
              { text: 'L0000003091', name: 'refWorkDt', align: 'center' }, // 평가일
            ];
            item.gridOptionsData = [];
            break;
          // 교육/훈련
          case 'CGRW3':
            item.gridView = true;
            item.typeCd = 'EDU';
            item.plantCd = this.popupParam.plantCd;
            item.selectValue = [];
            item.gridOptionsHeader = [
              { text: 'L0000002616', name: 'refWorkNm', url: 'true' }, // 제목
              { text: 'L0000002779', name: 'stepNm' }, // 진행상태
              { text: 'L0000003603', name: 'refWorkDt', align: 'center' }, // 교육일
            ];
            break;
          // 안전운전계획
          case 'CGRW4':
            item.gridView = false;
            break;
          // 가동전점검
          case 'CGRW5':
            item.gridView = true;
            item.typeCd = 'FACI';
            item.plantCd = this.popupParam.plantCd;
            item.selectValue = [];
            item.gridOptionsHeader = [
              { text: 'L0000002616', name: 'refWorkNm', url: 'true' }, // 제목
              { text: 'L0000002779', name: 'stepNm' }, // 진행상태
              { text: 'L0000000973', name: 'refWorkDt', align: 'center' }, // 등록일
            ];
            item.gridOptionsData = [];
            break;
          // 비상조치계획
          case 'CGRW6':
            item.gridView = true;
            item.typeCd = 'TRAIN';
            item.plantCd = this.popupParam.plantCd;
            item.selectValue = [];
            item.gridOptionsHeader = [
              { text: 'L0000002616', name: 'refWorkNm', url: 'true' }, // 제목
              { text: 'L0000002779', name: 'stepNm' }, // 진행상태
              { text: 'L0000003385', name: 'refWorkDt', align: 'center' }, // 훈련일
            ];
            item.gridOptionsData = [];
            break;
          // 장외영향평가
          case 'CGRW7':
            item.gridView = false;
            break;
          // 위해관리계획
          case 'CGRW8':
            item.gridView = false;
            break;
          // 설치검사
          case 'CGRW9':
            item.gridView = false;
            break;
          default:
          // code block
        }
        item.gridOptionsData = [];
        if (filterData && filterData.length > 0) {
          this.$_.forEach(filterData, (data) => {
            item.gridOptionsData.splice(0, 0, {
              chngRefWorkCd: item.code,
              refWorkNm: data.refWorkNm,
              stepCd: data.stepCd,
              stepNm: data.stepNm,
              refWorkDt: data.refWorkDt,
              typeCd: data.typeCd,
              refTableId: data.refTableId,
              refTableNm: data.refTableNm,
              safChngRefWorkNo: data.safChngRefWorkNo,
              createUserId: data.createUserId,
              createDt: data.createDt,
              updateUserId: data.updateUserId,
              updateDt: data.updateDt,
              pipeCd: data.pipeCd,
              processCd: data.processCd,
              diagramNo: data.diagramNo,
              diagGrpNo: data.diagGrpNo,
              diagTitle: data.diagTitle,
              diagKindNo: data.diagKindNo,
              diagClassCd: data.diagClassCd,
              taskClassNm: data.taskClassNm,
            });
          });
        }
      });
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
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    tableLinkClicked(header, data) {
      switch (data.refTableNm) {
        case 'saf_facility_pwr_info':
          this.popupOptions.target = () =>
            import(`${'@/pages/baseInfo/facility/createFacilityMst.vue'}`);
          this.popupOptions.title = 'L0000000960'; // 동력기계
          this.popupOptions.param = {
            safFacilityCd: data.refTableId,
            facilityPsmCd: 'FPSM1',
            title: 'L0000000962', // 동력기계 상세
            flag: true, // data ? data.count !== '0' ? true : false : false
          };
          break;
        case 'saf_facility_valve_info':
          this.popupOptions.target = () =>
            import(`${'@/pages/baseInfo/facility/createFacilityMst.vue'}`);
          this.popupOptions.title = 'L0000001855'; // 안전밸브 및 파열판
          this.popupOptions.param = {
            safFacilityCd: data.refTableId,
            facilityPsmCd: 'FPSM5',
            title: 'L0000001857', // 안전밸브 및 파열판 상세
            flag: true, // data ? data.count !== '0' ? true : false : false
          };
          break;
        case 'saf_facility_equip_spec':
          this.popupOptions.target = () =>
            import(`${'@/pages/baseInfo/facility/createFacilityMst.vue'}`);
          this.popupOptions.title = 'L0000002453'; // 장치 및 설비
          this.popupOptions.param = {
            safFacilityCd: data.refTableId,
            facilityPsmCd: 'FPSM2',
            title: 'L0000002455', // 장치 및 설비 상세
            flag: true, // data ? data.count !== '0' ? true : false : false
          };
          break;
        case 'saf_facility_pipe_info':
          this.popupOptions.target = () =>
            import(
              `${'@/pages/processSafetyData/processFacility/pipePopup.vue'}`
            );
          this.popupOptions.title = 'L0000001130'; // 배관 및 개스킷
          this.popupOptions.param = {
            plantCd: data.plantCd,
            processCd: data.plantCd,
            pipeCd: data.pipeCd,
            editCheck: true,
            search: true,
          };
          break;
        case 'saf_fire_proofs':
          this.popupOptions.target = () =>
            import(
              `${'@/pages/processSafetyData/buildingFacilitiesLayout/safFacilityInfo/fireProofsDialog.vue'}`
            );
          this.popupOptions.title = 'L0000003604'; // 내화구조명세서 상세
          this.popupOptions.param = {
            fireProofsNo: data.refTableId,
            search: true,
          };
          break;

        case 'saf_gas_detector':
          this.popupOptions.target = () =>
            import(
              `${'@/pages/processSafetyData/buildingFacilitiesLayout/safFacilityInfo/gasDetectorDialog.vue'}`
            );
          this.popupOptions.title = 'L0000000207'; // 가스누출감지 경보기 설치계획 상세
          this.popupOptions.param = {
            gasDetectorNo: data.refTableId,
            search: true,
          };
          break;
        case 'saf_extingushing':
          this.popupOptions.target = () =>
            import(
              `${'@/pages/processSafetyData/buildingFacilitiesLayout/safFacilityInfo/extingushingDialog.vue'}`
            );
          this.popupOptions.title = 'L0000001674'; // 소화설비 설치계획 상세
          this.popupOptions.param = {
            extingushingNo: data.refTableId,
            search: true,
          };
          break;
        case 'saf_fire_detection':
          this.popupOptions.target = () =>
            import(
              `${'@/pages/processSafetyData/buildingFacilitiesLayout/safFacilityInfo/fireDetectionDialog.vue'}`
            );
          this.popupOptions.title = 'L0000003280'; // 화재탐지 및 경보설비 설치계획 상세
          this.popupOptions.param = {
            fireDetectionNo: data.refTableId,
            search: true,
          };
          break;
        case 'saf_washup':
          this.popupOptions.target = () =>
            import(
              `${'@/pages/processSafetyData/buildingFacilitiesLayout/safFacilityInfo/washupDialog.vue'}`
            );
          this.popupOptions.title = 'L0000003605'; // 세척ㆍ세안 시설 및 안전 보호장구 설치계획 상세
          this.popupOptions.param = {
            washupNo: data.refTableId,
            search: true,
          };
          break;
        case 'saf_local_ventilation':
          this.popupOptions.target = () =>
            import(
              `${'@/pages/processSafetyData/buildingFacilitiesLayout/safFacilityInfo/localVentilationDialog.vue'}`
            );
          this.popupOptions.title = 'L0000000713'; // 국소배기장치 설치계획서 상세
          this.popupOptions.param = {
            localVentilationNo: data.refTableId,
            search: true,
          };
          break;
        case 'saf_diagram':
          this.popupOptions.target = () =>
            import(`${'@/pages/common/diagram/diagramFileDialog.vue'}`);
          this.popupOptions.title = 'L0000000955'; // 도면파일 상세
          this.popupOptions.param = {
            diagramSeq: data.refTableId,
            diagGrpNo: data.diagGrpNo,
            taskKey: data.refTableId,
            taskClassNm: data.taskClassNm,
            taskFlag: 'SAF',
            diagClassCd: data.diagClassCd,
            label: 'L0000000951', // 도면
            data: {
              plantCd: data.plantCd,
              diagramNo: data.diagramNo,
              diagramSeq: data.refTableId,
              diagTitle: data.diagTitle,
              revContents: data.revContents,
            },
            key1: data.refTableId,
            editable: false,
          };
          break;
        case 'saf_edu_mst':
          if (data.stepCd === 'SES01') {
            this.popupOptions.target = () =>
              import(`${'@/pages/education/eduPlan.vue'}`);
            this.popupOptions.title = 'L0000003606'; // 교육계획
            this.popupOptions.param = {
              safEduMstNo: data.refTableId,
              search: true,
            };
          } else {
            this.popupOptions.target = () =>
              import(`${'@/pages/education/eduResult.vue'}`);
            this.popupOptions.title = 'L0000003607'; // 교육결과
            this.popupOptions.param = {
              safEduMstNo: data.refTableId,
              search: true,
            };
          }
          break;
        case 'saf_facil_chk_plan':
          if (data.stepCd === 'CHS01') {
            this.popupOptions.target = () =>
              import(`${'@/pages/saf/facilityCheck/facilChkPlanDetail.vue'}`);
            this.popupOptions.title = 'L0000003608'; // 설비점검계획
            this.popupOptions.param = {
              safFacilChkNo: data.refTableId,
              isSearch: true,
            };
          } else {
            this.popupOptions.target = () =>
              import(`${'@/pages/saf/facilityCheck/facilChkResultDetail.vue'}`);
            this.popupOptions.title = 'L0000001608'; // 설비점검결과
            this.popupOptions.param = {
              safFacilChkNo: data.refTableId,
              isSearch: true,
            };
          }
          break;
        case 'saf_train_mst':
          if (data.stepCd === 'SES01') {
            this.popupOptions.target = () =>
              import(`${'@/pages/saf/emergency/trainingPlan.vue'}`);
            this.popupOptions.title = 'L0000003609'; // 훈련 계획
            this.popupOptions.param = {
              safTrainMstNo: data.refTableId,
              isSearch: true,
            };
          } else {
            this.popupOptions.target = () =>
              import(`${'@/pages/saf/emergency/trainingResult.vue'}`);
            this.popupOptions.title = 'L0000003610'; // 훈련 결과
            this.popupOptions.param = {
              safTrainMstNo: data.refTableId,
              popMode: true,
            };
          }
          break;
        default:
        // code block
      }

      this.popupOptions.width = '85%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeLinkPopup;
    },
    closeLinkPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
