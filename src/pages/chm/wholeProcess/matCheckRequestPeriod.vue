<!--
  목적 : 물질관리 > 전과정관리 > 물질검토
  작성자 : kdh
  Detail : 물질검토 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자재검토 상세 -->
            <y-label
              label="L0000002323"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 자재검토요청 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="matCheckRequest"
                :is-submit="isSave"
                title="L0000003812"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 자재검토 요청기간 -->
              <y-datepicker
                :width="8"
                :range="true"
                type="rqstDt"
                label="L0000005477"
                :default="period"
                v-model="period"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-mat-check-request-period',
  props: {},
  data() {
    return {
      matCheckRequest: {
        from: '',
        to: '',
        createUserId: '',
        updateUserId: '',
      },
      period: [],
      saveUrl: '',
      isSave: false,
      editable: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    // 윈도우 resize event
    this.editable = this.$route.meta.editable;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.saveUrl =
        transactionConfig.chm.matCheckRequest.sapMatCheckRequest.url;
      this.period.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-1m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.period.push(this.$comm.getToday());
    },
    // 물질검토 grid
    beforeSave() {
      if (!this.period || this.period.length !== 2) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000201', // '자재검토 요청기간을 입력하세요',
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000000202', // '자재검토 요청하시겠습니까?',
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.matCheckRequest.from = this.period[0];
            this.matCheckRequest.to = this.period[1];
            this.matCheckRequest.createUserId = this.$store.getters.token;
            this.matCheckRequest.updateUserId = this.$store.getters.token;

            this.isSave = true;
          },
          // 취소 callback 함수
          cancelCallback: () => {
            this.isSave = false;
          },
        });
      }
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: _result.data + 'M0000000203', // 건 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      // if (_result.data === 0) {
      //   window.getApp.$emit('ALERT', {
      //     title: '안내',
      //     message: '',
      //     type: 'success', // success / info / warning / error
      //   });
      // } else {
      //   window.getApp.$emit('ALERT', {
      //     title: '안내',
      //     message: '저장되었습니다.',
      //     type: 'success', // success / info / warning / error
      //   });
      // }
      this.closePopup();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
