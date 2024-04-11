<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자가측정결과 업로드 -->
            <y-label label="L0000003462" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                :editable="editable"
                :required="true"
                :state="validateState('plantCd')"
                type="edit"
                name="plantCd"
                v-validate="'required'"
                v-model="uploadParam.plantCd"
              />
            </b-col>
          </b-row>
        </b-card>
        <b-card header-class="default-card bg-light" body-class="default-body-card" class="mt-3">
          <div slot="header">
            <div class="float-left">
              <!-- 엑셀업로드 -->
              <y-label label="L0000001969" />
            </div>
          </div>
          <b-row>
            <b-col sm="12">
              <el-upload
                class="upload-demo"
                ref="upload"
                name="files"
                :headers="uploadHeader"
                :action="uploadUrl"
                :data="uploadParam"
                :auto-upload="false"
                :on-success="onSuccess"
                :drag="false"
                :multiple="false"
                :limit="1"
                :on-error="onError"
                v-loading="loading"
              >
                <!-- 파일선택 -->
                <el-button size="small" type="primary">{{$comm.getLangSpecInfoLabel('L0000003028')}}</el-button>
                <!-- 업로드 -->
                <el-button slot="tip" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">{{$comm.getLangSpecInfoLabel('L0000001934')}}</el-button>
              </el-upload>
            </b-col>
            <!--<b-col sm="12" class="mt-3">
              <div>
                <el-tag size="medium" type="danger">
                  <-- 마지막에 업로드한 내역만 보입니다. ->
                  <i class="el-icon-info"></i> {{$comm.getLangSpecInfoLabel('L0000001000')}}
                </el-tag>
              </div>
              <-- 업로드 결과 목록 --
              <y-data-table
                ref="dataTable"
                label="L0000001935"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="uploadList"
                :useRownum="false"
              ></y-data-table>
            </b-col>-->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :items="gridOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000001935')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRightLabel="true"
                :rightLabel="this.$comm.getLangSpecInfoLabel('L0000001000')"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
import backendConfig from '@/js/backendConfig.js';
import { getAccessToken } from '@/utils/auth';
export default {
  name: 'self-measurement-excel-upload',
  props: {},
  data() {
    return {
      gridOptions: {
        name: 'selfMeasurementExcelUpload',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },

      editable: false,
      uploadHeader: {},
      uploadParam: {
        plantCd: '',
        createUserId: '',
      },
      uploadList: [],
      loading: false,
      uploadUrl: '',
      YAuiGrid: null,
    }
  },
  computed: {},
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.uploadUrl = backendConfig.getUrl(
        transactionConfig.env.air.facility.selfMeasurement.excelUpload.url
      );
      this.uploadParam.createUserId = this.$store.getters.token;

      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };

      this.gridOptions.header = [
        // 실패내용
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001818'), dataField: 'failMessage', width: '150', style: 'left-align', },
        // 배출구일련번호
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001150'), dataField: 'eairOutletNm', width: '130', style: 'center-align', },
        // 허가증상배출구번호
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003235'), dataField: 'eairOutletPermitNo', width: '130', style: 'center-align', },
        // 배출구명
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001147'), dataField: 'mainDischFacNm', width: '130', style: 'center-align', },
        // 기상
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003465'), dataField: 'weatherNm', width: '130', style: 'center-align', },
        // 온도(℃)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002029'), dataField: 'temp', width: '130', style: 'center-align', },
        // 습도(%)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001730'), dataField: 'hum', width: '130', style: 'center-align', },
        // 기압(mmHg)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003467'), dataField: 'airPress', width: '130', style: 'center-align', },
        // 풍향(풍)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003156'), dataField: 'windDir', width: '130', style: 'center-align', },
        // 풍속(m/sec)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003155'), dataField: 'windSpeed', width: '130', style: 'center-align', },
        // 측정일자
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002953'), dataField: 'measureYmd', width: '130', style: 'center-align', },
        // 자가측정방법
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002302'), dataField: 'methodNm', width: '130', style: 'center-align', },
        // 가스속도(m/s)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000212'), dataField: 'gasSpeed', width: '130', style: 'center-align', },
        // 가스온도(℃)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000213'), dataField: 'gasTemp', width: '130', style: 'center-align', },
        // 수분함량(%)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001685'), dataField: 'wtrPer', width: '130', style: 'center-align', },
        // 실측산소농도(%)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001813'), dataField: 'realO2Val', width: '130', style: 'center-align', },
        // 표준산소농도(%)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003152'), dataField: 'stndO2Val', width: '130', style: 'center-align', },
        // 배출가스유량(S㎥/min)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003468'), dataField: 'stndO2Val', width: '130', style: 'center-align', },
        // 연료명 및 사용량
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002001'), dataField: 'fuelNmResult', width: '130', style: 'center-align', },
        // 원료명 및 사용량
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002089'), dataField: 'ingrNmResult', width: '130', style: 'center-align', },
        // 환경기술인
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003326'), dataField: 'envEngrNm', width: '130', style: 'center-align', },
        // 환경기술인의견
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003327'), dataField: 'envEngrOpn', width: '130', style: 'center-align', },
        // 대기오염물질
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000910'), dataField: 'eairTestItemNm', width: '130', style: 'center-align', },
        // 측정농도
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002932'), dataField: 'numResult', width: '130', style: 'center-align', },
        // 일일배출량(kg/day)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002270'), dataField: 'dischAmtPerDay', width: '130', style: 'center-align', },
        // 검사기기
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000309'), dataField: 'eairInstNm', width: '130', style: 'center-align', },
        // 검사방법
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000311'), dataField: 'eairTestMtdNm', width: '130', style: 'center-align', },
      ];
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    // 업로드
    submitUpload() {
      // 파일이 있는지 여부 확인
      if (this.$refs.upload.uploadFiles.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000001934', // '업로드',
          message: 'M0000000083', // '업로드할 파일이 없습니다. 파일을 선택하세요',
          type: 'warning',
        });
        return;
      }
      var uploadFileName = this.$refs.upload.uploadFiles[0].name.toLowerCase();
      if (uploadFileName.indexOf('xlsx') === -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000900', // '업로드 파일은 XLSX 형식이어야 합니다.',
          type: 'warning',
        });
        return;
      }
      this.loading = true;
      this.$refs.upload.submit();
    },
    onSuccess(response, file, fileList) {
      this.loading = false;
      this.$refs.upload.clearFiles();
      if (response.success) {
        let msg = this.getConfirmMsg(response);
        this.uploadList = response.uploadList;
        // this.research = !this.research;
        window.getApp.$emit('ALERT', {
          title: 'L0000001936', // '업로드 결과내역',
          message: msg,
          type: 'warning',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000001936', // '업로드 결과내역',
          message: response.message,
          type: 'warning',
        });
      }
    },
    getConfirmMsg(response) {
      var returnMsg = '';
      if (response.totCount === 0) {
        returnMsg = this.$comm.getLangSpecInfoMessage('M0000000084');
        // returnMsg = '업로드한 파일에 업로드할 데이터가 없습니다. 업로드할 데이터가 있는지 다시한번 확인해 주세요.';
      } else {
        returnMsg = this.$comm.getLangSpecInfoMessage('M0000000085', {
          s0: response.totCount,
          s1: response.completeCount,
          s2: response.dontCount,
        });
        // returnMsg = String(
        //   '총 ' +
        //     response.totCount +
        //     '건 (완료 : ' +
        //     response.completeCount +
        //     ', 실패 : ' +
        //     response.dontCount +
        //     ')이 업로드 되었습니다.'
        // );
      }
      return returnMsg;
    },
    onError(err, file, fileList) {
      this.loading = false;
      console.log(JSON.stringify(err));
      // 인증오류처리
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000086', // '업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.'
      );
      return;
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },

}
</script>