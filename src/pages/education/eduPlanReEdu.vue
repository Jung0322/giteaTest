<!--
  목적 : 교육결과 등록-> 불참자재교육
  Detail : 불참자재교육 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 불참자재교육 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 불참자재교육 상세 -->
            <y-label label="L0000003906" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 완료 -->
              <y-btn
                v-if="editable && isComplete"
                title="L0000002039"
                color="black"
                @btnClicked="completeAction"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && isComplete"
                :action-url="editUrl"
                :param="eduMaster"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육분류 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000659"
                name="eduAttNm"
                v-model="eduMaster.eduAttNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육과정 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000633"
                name="eduCourseNm"
                v-model="eduMaster.eduCourseNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육명 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000653"
                name="eduNm"
                v-model="eduMaster.eduNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 재교육기간 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :range="true"
                :required="true"
                :disalbed="isComplete"
                label="L0000002465"
                name="period"
                v-validate="'required'"
                v-model="eduMaster.period"
                :state="validateState('period')"
              ></y-datepicker>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육시간 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :required="true"
                :disabled="!isComplete"
                ui="bootstrap"
                label="L0000000660"
                name="reEduTime"
                v-validate="'required'"
                v-model="eduMaster.reEduTime"
                :state="validateState('reEduTime')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육장소 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="60"
                :disabled="!isComplete"
                :required="true"
                ui="bootstrap"
                label="L0000000672"
                name="reEduPlace"
                v-validate="'required'"
                v-model="eduMaster.reEduPlace"
                :state="validateState('reEduPlace')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육강사 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                :disabled="!isComplete"
                ui="bootstrap"
                label="L0000003649"
                name="reEduTeacher"
                v-model="eduMaster.reEduTeacher"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 불참자 목록 -->
          <y-data-table
            label="L0000001355"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            v-model="gridOptions.selectedItems"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'edu-plan-re-edu',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        safEduMstNo: 0,
      }),
    },
  },
  data: () => ({
    eduMaster: {
      eduAttCd: null,
      safEduCourseNo: null,
      useYn: 'Y',
      eduNm: null,
      period: [],
      safEduMstNo: 0,
      reEduYn: '',
      reEduSYmd: '',
      reEduEYmd: '',
      reEduTime: '',
      reEduPlace: '',
      reEduTeacher: '',
      reEduEndYn: '',
      eduDetailPersons: [],
    },
    gridOptions: {
      header: [],
      data: [],
      height: '300',
      selectedItems: [],
    },
    editUrl: '',
    completeUrl: '',
    editable: true,
    isEdit: false,
    isComplete: true,
    eduAttCdItems: [],
    eduCourseItems: [],
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.editUrl = transactionConfig.saf.education.eduMasterUser.edit.url;
      this.completeUrl =
        transactionConfig.saf.education.eduMasterUser.complete.url;

      this.gridOptions.header = [
        { text: 'L0000001662', name: 'deptNm', width: '120px', align: 'center' }, /* 소속 */
        { text: 'L0000001630', name: 'userNm', width: '100px', align: 'center' }, /* 성명 */
        /* 재교육이수여부 */
        {
          text: 'L0000002467',
          name: 'reCompletYn',
          width: '100px',
          align: 'center',
          type: 'singlecheckbox',
        },
        /* 이수일 */
        {
          text: 'L0000002217',
          name: 'completYmd',
          width: '120px',
          align: 'center',
          type: 'datepicker',
        },
        /* 비고/불참사유 */
        {
          text: 'L0000001362',
          name: 'remark',
          width: '250px',
          align: 'center',
        },
        /* 재교육 비고/불참사유 */
        {
          text: 'L0000002464',
          name: 'reRemark',
          width: '250px',
          align: 'center',
          type: 'text',
          maxlength: 100,
        },
      ];
      this.validComplete();

      this.getDetail();
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.education.eduMaster.get.url,
        this.popupParam.safEduMstNo
      );
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        _result => {
          this.eduMaster = this.$_.clone(_result.data);
          this.eduMaster.period = [
            _result.data.reEduSYmd,
            _result.data.reEduEYmd,
          ];

          this.getList();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getList() {
      this.$http.url = selectConfig.saf.education.eduDetailPerson.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safEduMstNo: this.eduMaster.safEduMstNo,
        completYn: 'N',
        reEduNotYn: 'N',
      };
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    validComplete() {
      this.$http.url = this.$format(
        selectConfig.saf.education.eduMasterUser.getComplete.url,
        this.popupParam.safEduMstNo
      );
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        _result => {
          if (_result.data === 'Y') {
            this.isComplete = false;
          }
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    completeAction() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',  /* 확인 */
        message: 'M0000000284', /* 재교육결과를 완료처리 하시겠습니까? */
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.completeUrl,
            this.eduMaster.safEduMstNo
          );
          this.$http.type = 'GET';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000000285', /* 완료처리 되었습니다. */
                type: 'success',
              });
              this.closePopup();
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',  /* 확인 */
              message: 'M0000000286', /* 재교육정보를 저장하시겠습니까? */
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.eduDetailPersons = this.gridOptions.data;
                this.isEdit = true;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000005', /* 필수입력값을 입력해주세요. */
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },

    closePopup(data) {
      this.$emit('closePopup');
    },

    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000287', /* 재교육정보를 정상적으로 저장하였습니다. */
        type: 'success', // success / info / warning / error
      });

      this.isEdit = false;
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 추가
    btnAddAnswer() {},
    // 삭제
    btnDeleteAnswer() {},
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
  },
};
</script>
