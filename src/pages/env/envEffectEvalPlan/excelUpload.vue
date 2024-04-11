<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 결과 엑셀 업로드
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              label="L0000001938"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 적용 -->
              <y-btn
                v-if="gridOptions.data.length > 0"
                title="L0000002482"
                color="orange"
                @btnClicked="applyData"
              />
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <el-upload
                class="upload-demo"
                ref="upload"
                name="files"
                method="post"
                :headers="uploadHeader"
                :action="uploadUrl"
                :data="uploadParam"
                :auto-upload="false"
                :drag="false"
                :multiple="false"
                :limit="1"
                :on-success="onSuccess"
                :on-error="onError"
                v-loading="loading"
              >
                <el-button size="small" type="primary">{{
                  $comm.getLangSpecInfoLabel('L0000003028')
                }}</el-button>
                <!-- 파일선택 -->
                <el-button
                  slot="tip"
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="submitUpload"
                  >{{ $comm.getLangSpecInfoLabel('L0000001934') }}</el-button
                >
                <!-- 업로드 -->
              </el-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col sm="12" class="mt-3">
        <y-data-table
          ref="dataTable"
          label="L0000004898"
          :editable="false"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :useRownum="false"
        >
          <div slot="helpText">
            <!-- 자동 계산 항목 -->
            <y-label :label="gridHelpText" />
          </div>
          <el-table-column
            slot="expand"
            align="center"
            label="Upload Message"
            width="200px"
          >
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row['uploadMessageValue']">
                <el-option
                  v-for="(item, index) in scope.row['uploadMessages']"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </y-data-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import backendConfig from '@/js/backendConfig.js';
import { getAccessToken } from '@/utils/auth';
export default {
  name: 'env-effect-eval-rslt-excel-upload',
  props: {
    popupParam: {
      type: Object,
      default: {
        evalPlanNo: 0,
      },
    },
  },
  data() {
    return {
      uploadHeader: {},
      uploadUrl: '',
      uploadParam: {
        lang: 'kr',
        evalPlanNo: 0,
      },

      loading: false,

      gridOptions: {
        header: [],
        data: [],
        height: '500',
        selectedValue: [],
      },

      saveUrl: '',
    };
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    init() {
      this.saveUrl = '/api/env/enveffectevalplan/result';
      this.uploadUrl = backendConfig.getUrl(
        '/api/env/enveffectevalplan/result/excelupload'
      );
      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };
      this.uploadParam = {
        lang: this.$comm.getLang(),
        evalPlanNo: this.popupParam.evalPlanNo,
      };

      this.gridHelpText =
        this.$comm.getLangSpecInfoLabel('L0000004940') + // 자동 계산 항목
        ' : ' +
        this.$comm.getLangSpecInfoLabel('L0000004933') + // 부정적영향
        ', ' +
        'Score, ' +
        this.$comm.getLangSpecInfoLabel('L0000004936') + // 심각성
        ', ' +
        this.$comm.getLangSpecInfoLabel('L0000003944'); // 등급
      this.setHeader();
    },
    applyData() {
      // 데이터 적용,
      let valid = true;
      this.gridOptions.data.forEach((item) => {
        if (item.uploadFlag === false) {
          valid = false;
        }
      });

      if (!valid) {
        window.getApp.$emit(
          'APP_REQUEST_ERROR',
          'M0000001610' // '업로드 데이터가 유효하지 않습니다. 업로드 메시지를 확인하세요.'
        );
        return;
      }

      let evalPlan = {
        evalPlanNo: this.popupParam.evalPlanNo,
        envEffectEvalRslts: this.gridOptions.data,
      };
      this.$http.url = this.saveUrl;
      this.$http.type = 'POST';
      this.$http.param = evalPlan;
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.$emit('closePopup', true);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    submitUpload() {
      if (this.$refs.upload.uploadFiles.length > 0) {
        let uploadFileName =
          this.$refs.upload.uploadFiles[0].name.toLowerCase();
        if (uploadFileName.indexOf('xlsx') === -1) {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000900' // 업로드 파일은 XLSX 형식이어야 합니다.
          );
          return;
        }
        this.loading = true;
        this.$refs.upload.submit();
      }
    },
    onSuccess(response, file, fileList) {
      this.loading = false;
      this.$refs.upload.clearFiles();
      // console.log('response', response);
      if (response.success) {
        response.uploadResult.forEach((item) => {
          // 유효한 데이터의 경우 자동계산
          if (item.uploadFlag === true) {
            item.createUserId = this.$store.getters.token;
            this.calcImpoEffect(item);
          }
          item.uploadMessageValue = item.uploadMessages[0];
        });
        this.gridOptions.data = response.uploadResult;
      } else {
        window.getApp.$emit(
          'APP_REQUEST_ERROR',
          'M0000000086' // '업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.'
        );
      }
    },
    onError() {
      this.loading = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000086' // '업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.'
      );
      return;
    },
    closePopup(data) {
      this.$emit('closePopup');
    },
    calcImpoEffect(row) {
      // 부정적영향 계산 : 유해성+양+통제방안의 합
      let toxic = 1;
      let qnt = 1;
      let ctrl = 0;
      if (row.impoToxic === this.$comm.getLangSpecInfoLabel('L0000004909')) {
        toxic = 2;
      }
      // 높음

      if (row.impoQnt === this.$comm.getLangSpecInfoLabel('L0000004910')) {
        qnt = 2;
      }
      // 많음

      if (row.impoCtrl === this.$comm.getLangSpecInfoLabel('L0000004909')) {
        ctrl = 1;
      }
      // 높음

      row.impoToxicScore = toxic;
      row.impoQntScore = qnt;
      row.impoCtrlScore = ctrl;
      row.impoEffect = toxic + qnt + ctrl;

      this.calcImpoSeriousness(row);
    },
    calcImpoSeriousness(row) {
      // 심각성 계산 : 발생가능성*부정적영향*가중치
      row.impoSeriousness =
        parseInt(row.impoGen, 10) *
        parseInt(row.impoEffect, 10) *
        parseInt(row.impoWeight, 10);

      this.calcImpoRate(row);
    },
    calcImpoRate(row) {
      // 등급 계산 : 심각성 16이상=H, 4이상~16미만=M, 4미만=L
      row.impoRate =
        parseInt(row.impoSeriousness, 10) >= 16
          ? 'H'
          : parseInt(row.impoSeriousness, 10) < 4
            ? 'L'
            : 'M';
      row.envImpoYn = row.impoRate === 'H' ? 'Y' : 'N';
      row.envImpoYnNm =
        row.impoRate === 'H'
          ? this.$comm.getLangSpecInfoLabel('L0000003213') // 해당
          : this.$comm.getLangSpecInfoLabel('L0000001065'); // 미해당
    },
    setHeader() {
      let header = [
        {
          text: 'L0000004911', // 활동
          align: 'center',
          child: [
            {
              text: 'L0000003659',
              name: 'safFacilityNm',
              width: '200px',
              align: 'center',
            }, // 설비
            {
              text: 'L0000004912', // 세부공정
              name: 'detailProcess',
              width: '100px',
              align: 'center',
            },
          ],
        },
        {
          text: 'L0000004913', // 기초정보
          align: 'center',
          child: [
            {
              text: 'L0000004914', // 구동설비(KJ/day)
              align: 'center',
              child: [
                {
                  text: 'L0000004915',
                  name: 'facilityNm',
                  width: '120px',
                  align: 'center',
                }, // 구동설비명
                {
                  text: 'L0000001996',
                  name: 'facilityFuel',
                  width: '120px',
                  align: 'center',
                }, // 연료
                {
                  text: 'L0000001445',
                  name: 'facilityAmt',
                  width: '100px',
                  align: 'center',
                }, // 사용량
              ],
            },
            {
              text: 'L0000004916', // 입력(ton/day)
              align: 'center',
              child: [
                {
                  text: 'L0000004917',
                  name: 'inputNm',
                  width: '120px',
                  align: 'center',
                }, // 입력물
                {
                  text: 'L0000004918',
                  name: 'inputAmt',
                  width: '100px',
                  align: 'center',
                }, // 입력량
              ],
            },
            {
              text: 'L0000004919', // 출력(ton/day)
              align: 'center',
              child: [
                {
                  text: 'L0000004920',
                  name: 'outputNm',
                  width: '120px',
                  align: 'center',
                }, // 출력물
                {
                  text: 'L0000004921',
                  name: 'outputAmt',
                  width: '100px',
                  align: 'center',
                }, // 출력량
              ],
            },
            {
              text: 'L0000004922', // 부산물(ton/day)
              align: 'center',
              child: [
                {
                  text: 'L0000004923',
                  name: 'residueNm',
                  width: '120px',
                  align: 'center',
                }, // 부산물
                {
                  text: 'L0000004924',
                  name: 'residueAmt',
                  width: '100px',
                  align: 'center',
                }, // 부산물량
              ],
            },
          ],
        },
        {
          text: 'L0000003332', // 환경측면
          align: 'center',
          child: [
            {
              text: 'L0000004925', // 발생조건
              name: 'envGen',
              width: '100px',
              align: 'center',
            },
            {
              text: 'L0000004926',
              name: 'envAct',
              width: '200px',
              align: 'center',
            }, // 상세활동
          ],
        },
        {
          text: 'L0000004927', // 환경영향
          align: 'center',
          child: [
            {
              text: 'L0000004928', // 환경분야
              name: 'envImpDiv',
              width: '120px',
              align: 'center',
            },
            {
              text: 'L0000004929',
              name: 'envImpMng',
              width: '200px',
              align: 'center',
            }, // 통제/관리방안
            {
              text: 'L0000004930', // 환경이슈
              name: 'envImpIssue',
              width: '100px',
              align: 'center',
            },
          ],
        },
        {
          text: 'L0000004931', // 중요성평가
          align: 'center',
          child: [
            {
              text: 'L0000004932', // 발생가능성
              name: 'impoGen',
              width: '100px',
              align: 'center',
            },
            {
              text: 'L0000004933', // 부정적영향
              align: 'center',
              child: [
                {
                  text: 'L0000004933',
                  name: 'impoEffect',
                  width: '100px',
                  align: 'center',
                }, // 부정적영향
                {
                  text: 'L0000002166', // 유해성
                  name: 'impoToxic',
                  width: '100px',
                  align: 'center',
                },
                {
                  text: 'Score',
                  name: 'impoToxicScore',
                  width: '70px',
                  align: 'center',
                },
                {
                  text: 'L0000004934', // 양
                  name: 'impoQnt',
                  width: '100px',
                  align: 'center',
                },
                {
                  text: 'Score',
                  name: 'impoQntScore',
                  width: '70px',
                  align: 'center',
                },
                {
                  text: 'L0000004935', // 통제방안
                  name: 'impoCtrl',
                  width: '100px',
                  align: 'center',
                },
                {
                  text: 'Score',
                  name: 'impoCtrlScore',
                  width: '70px',
                  align: 'center',
                },
              ],
            },
            {
              text: 'L0000000218', // 가중치
              name: 'impoWeight',
              width: '80px',
              align: 'center',
            },
            {
              text: 'L0000004936',
              name: 'impoSeriousness',
              width: '80px',
              align: 'center',
            }, // 심각성
            {
              text: 'L0000003944',
              name: 'impoRate',
              width: '80px',
              align: 'center',
            }, // 등급
            {
              text: 'L0000002203', // 유형
              name: 'impoType',
              width: '80px',
              align: 'center',
            },
          ],
        },
        {
          text: 'L0000004937',
          name: 'confDesc',
          width: '200px',
          align: 'center',
        }, // 대응방안
        {
          text: 'L0000004938',
          name: 'envImpoYnNm',
          width: '100px',
          align: 'center',
        }, // 중요 환경영향 여부
      ];

      this.gridOptions.header = header;
    },
  },
};
</script>
