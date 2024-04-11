<!--
  목적 : 교육 계획 등록/수정
  작성자 : kkc
  Detail : 교육 계획 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 계획 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육결과 QR코드 -->
            <y-label
              label="L0000000155"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 출력 -->
              <y-btn title="L0000004214" @btnClicked="btnPrint" />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <div style="text-align: center">
                <qrcode-vue
                  ref="qrRef"
                  :value="redirectUrl"
                  class="canvasQr"
                  size="300"
                  level="H"
                ></qrcode-vue>
              </div>
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
import transactionConfig from '@/js/transactionConfig';
import QrcodeVue from 'qrcode.vue';

export default {
  /** attributes: name, components, props, data **/
  name: 'edu-plan',
  components: {
    QrcodeVue,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        safEduMstNo: 0,
        processStepCd: '',
        safEduCourseNo: 0,
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '850px',
        top: '100px',
        param: {},
        closeCallback: null,
      },
      redirectUrl: '',
      component: null,
      tabIndex: 0,
      eduMaster: {
        safEduMstNo: 0, // 교육마스터 번호
        safEduCourseNo: null, // 교육과정 번호
        safEduCourseNm: null, // 교육과정 번호
        eduTypeCd: null, // 교육구분코드
        eduAttCd: null, // 교육분류
        deptCd: null, // 교육담당부서코드
        userId: null, // 교육담당자 아이디
        eduNm: null, // 교육명
        eduSYmd: null, // 교육시작일
        eduEYmd: null, // 교육종료일
        eduTime: 0, // 실제교육시간
        eduTimePlan: null, // 계획교육시간
        startHour: null, // 교육시작시
        startMinute: null, // 교육시작시
        eduSHour: null, // 교육시작시
        endHour: null, // 교육시작시
        endMinute: null, // 교육시작시
        eduEHour: null, // 교육종료시
        eduPlace: null, // 교육장소
        eduTeacher: null, // 교육강사
        eduContent: null, // 교육내용
        eduResultSummary: null, // 교육결과요약
        eduEvalOpin: null, // 교육총평
        processStepCd: null, // 교육진행단계코드
        plantCd: null, // 사업장
        questionUseYn: null, // 교육문제풀이여부
        reEduYn: null, // 재교육수행여부
        reEduSYmd: null, // 재교육시작일
        reEduEYmd: null, // 재교육종료일
        reEduTime: 0, // 재교육시간
        reEduPlace: null, // 재교육장소
        reEduTeacher: null, // 재교육강사
        reEduEndYn: null, // 재교육완료여부
        papprRqstNo: 0, // 계획결재요청번호
        rApprRqstNo: 0, // 결과결재요청번호
        createUserId: null, // 등록자아이디
        createDt: null, // 등록일
        updateUserId: null, // 수정자아이디
        updateDt: null, // 수정일
        eduClassCd: null,
        eduClassNm: null,
        questionLsts: [],
        dataLsts: [],
        eduCourseMat: [],
        chngNum: '', // 변경발의번호
        safChngNo: 0,
      },
      addUser: '',
      getUrl: '',
      dataLoadingFinished: false,
      eduTypeCdItems: [],
    };
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/

  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.$comm.getComboItems('SAF_EDU_TYPE', true).then((_result) => {
        this.eduTypeCdItems = _result;
      });
      this.getUrl = selectConfig.saf.education.eduMaster.get.url;
      this.comUrl();
      this.getDetail();
      // var canvas = this.$refs.qrRef.$refs['qrcode-vue'];
    },
    comUrl() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_QR_PATH'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.redirectUrl =
            _result.data[0].codeNm + this.popupParam.safEduMstNo;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(this.getUrl, this.popupParam.safEduMstNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.eduMaster, _result.data);
          if (this.eduMaster.eduSHour) {
            let splitData = this.eduMaster.eduSHour.split(':');
            if (splitData && splitData.length === 2) {
              this.eduMaster.startHour = splitData[0];
              this.eduMaster.startMinute = splitData[1];
            } else {
              this.eduMaster.startHour = null;
              this.eduMaster.startMinute = null;
            }
          }
          if (this.eduMaster.eduEHour) {
            let splitData = this.eduMaster.eduEHour.split(':');
            if (splitData && splitData.length === 2) {
              this.eduMaster.endHour = splitData[0];
              this.eduMaster.endMinute = splitData[1];
            } else {
              this.eduMaster.endHour = null;
              this.eduMaster.endMinute = null;
            }
          }
          this.addUser =
            String(_result.data.deptNm) + ' / ' + String(_result.data.userNm);
          this.dataLoadingFinished = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnPrint() {
      if (!this.dataLoadingFinished) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005542', // '데이터 로딩중입니다. 잠시후 다시 시도해주세요.',
          type: 'warning',
        });
        return;
      }
      let dataUrl = document.getElementsByTagName('canvas')[0].toDataURL();
      let windowContent = '<!DOCTYPE html>';
      windowContent += '<html>';
      windowContent += '<body>';
      windowContent += '<div style="margin-left: 10%">';
      windowContent +=
        '<table style="margin: 45px 0 0 -60px; table-layout: fixed; word-break: break-all">';
      windowContent += '<tr>';
      windowContent += '<td class="label" >';
      windowContent += `<span>사업장</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value" >';
      windowContent += `<span>${this.eduMaster.plantNm}</span>`;
      windowContent += '</td>';
      windowContent += '<td class="label" style="padding: 5px; width: 200px" >';
      windowContent += `<span>교육구분</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.eduTypeNm}</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육대분류</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.eduAttNm}</span>`;
      windowContent += '</td>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육분류</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.eduClassNm}</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육과정</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.eduCourseNm}</span>`;
      windowContent += '</td>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육담당자</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.addUser}</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육명</span>`;
      windowContent += '</td>';
      windowContent += '<td colspan="3">';
      windowContent += `<span>&nbsp;${this.eduMaster.eduNm}</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육시작일시</span>`;
      windowContent += '</td>';
      windowContent += '<td colspan="3">';
      windowContent += `<span>&nbsp;${this.eduMaster.eduSYmd}일 ${
        isNaN(this.eduMaster.eduSHour.substr(1, 1))
          ? this.eduMaster.eduSHour.substr(0, 1)
          : this.eduMaster.eduSHour.substr(0, 2)
      }시 ${
        isNaN(this.eduMaster.eduSHour.substr(1, 1))
          ? this.eduMaster.eduSHour.substr(2, 2)
          : this.eduMaster.eduSHour.substr(3, 2)
      }분</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육종료일시</span>`;
      windowContent += '</td>';
      windowContent += '<td colspan="3">';
      windowContent += `<span>&nbsp;${this.eduMaster.eduEYmd}일 ${
        isNaN(this.eduMaster.eduEHour.substr(1, 1))
          ? this.eduMaster.eduEHour.substr(0, 1)
          : this.eduMaster.eduEHour.substr(0, 2)
      }시 ${
        isNaN(this.eduMaster.eduEHour.substr(1, 1))
          ? this.eduMaster.eduEHour.substr(2, 2)
          : this.eduMaster.eduEHour.substr(3, 2)
      }분</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육시간</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.eduTimePlan}시간</span>`;
      windowContent += '</td>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육장소</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.eduPlace}</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td class="label">';
      windowContent += `<span>교육강사</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.eduTeacher}</span>`;
      windowContent += '</td>';
      windowContent += '<td class="label">';
      windowContent += `<span>변경발의번호</span>`;
      windowContent += '</td>';
      windowContent += '<td class="value">';
      windowContent += `<span>${this.eduMaster.chngNum}</span>`;
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr height="130px">';
      windowContent += '<td class="label">';
      windowContent += `<span>교육내용</span>`;
      windowContent += '</td>';
      windowContent += '<td colspan="3">';
      windowContent += '<div style="padding: 5px">';
      windowContent += `<span>${this.eduMaster.eduContent}</span>`;
      windowContent += '</div>';
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '<tr>';
      windowContent += '<td colspan="4">';
      windowContent += '<div style="text-align: center; margin: 30px 0;">';
      windowContent += '<img src="' + dataUrl + '">';
      windowContent += '</div>';
      windowContent += '</td>';
      windowContent += '</tr>';
      windowContent += '</table>';
      windowContent += '</div>';
      windowContent += '</body>';
      windowContent += '<style>';
      windowContent +=
        '.label{padding: 7px; width: 200px; background-color: #eeeeee !important; -webkit-print-color-adjust: exact;}';
      windowContent += '.value{padding: 7px; width: 300px; font-size: 14px;}';
      windowContent += 'table{border-collapse: collapse;}';
      windowContent += 'td{border: 1px solid #444444}';
      windowContent += '</style>';
      windowContent += '</html>';
      let printWin = window.open('', '', 'width=700px,height=900px');
      printWin.document.open();
      printWin.document.write(windowContent);
      printWin.document.close();
      setTimeout(function () {
        printWin.focus();
        printWin.print();
        printWin.close();
      }, 1000);
    },

    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>
<style scoped>
.canvasQr canvas {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: inherit;
}
#details {
  width: 100%;
}
#details h5 {
  text-align: left;
  margin-left: 30%;
}
</style>
