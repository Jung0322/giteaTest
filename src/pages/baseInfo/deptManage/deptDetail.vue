<!--
  목적 : 부서 마스터 정보
  작성자 : JKL
  Detail : 부서 상세정보를 보여주는 화면.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3 mb-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 부서 정보 -->
            <y-label
              label="L0000001297"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- beforeSave: 유효성 검사, 데이터 처리
                    btnSaveClickedCallback: flag처리 isSave : false,,,
                                            ,pk값 다시 넣어주기
              -->
              <!-- 저장 -->
              <y-btn
                v-if="!updateMode && editable"
                :action-url="saveUrl"
                :param="dept"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장(수정)L0000002474 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="dept"
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
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <!-- 사업장 -->
                  <y-plant
                    type="edit"
                    :required="true"
                    :width="10"
                    :editable="editable"
                    name="plantCd"
                    v-model="dept.plantCd"
                    v-validate="'required'"
                    :state="validateState('plantCd')"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <!-- 부서 코드 -->
                  <y-text
                    :width="10"
                    :editable="editable"
                    :disabled="updateMode"
                    :required="true"
                    ui="bootstrap"
                    label="L0000001332"
                    :maxlength="10"
                    name="tempDeptCd"
                    v-model="tempDeptCd"
                    v-validate="'required'"
                    :state="validateState('tempDeptCd')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <!-- 부서명 -->
                  <y-text
                    :width="10"
                    :editable="editable"
                    :required="true"
                    ui="bootstrap"
                    label="L0000001287"
                    :maxlength="10"
                    name="deptNm"
                    v-model="dept.deptNm"
                    v-validate="'required'"
                    :state="validateState('deptNm')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="6" class="col-xxl-6">
                  <!-- 상위부서 -->
                  <y-tree-dept
                    :width="8"
                    :editable="editable"
                    :disabled="false"
                    :required="true"
                    label="L0000001536"
                    name="deptCd"
                    :plant-cd="dept.plantCd"
                    v-model="dept.pdeptCd"
                    v-validate="'required'"
                    :state="validateState('pdeptCd')"
                    @setDeptLvl="
                      (deptLvl) => {
                        setDeptLvl(deptLvl);
                      }
                    "
                  />
                </b-col>
              </b-row>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                 부서레벨 
                  <y-label label="L0000001307" />
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label :label="this.dept.deptLvl" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col> -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 사용여부 -->
                  <y-switch
                    :width="8"
                    :editable="editable"
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label="L0000001439"
                    name="useYn"
                    selectText="L0000001440"
                    unselectText="L0000001063"
                    v-model="dept.useYn"
                  ></y-switch>
                </b-col>
              </b-row>
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
  /** attributes: name, props, data **/
  name: 'dept-manage',
  props: {
    popupParam: {
      type: Object,
      default: {
        deptCd: '',
      },
    },
  },
  data() {
    return {
      dept: {
        plantCd: '',
        deptCd: '',
        deptNm: '',
        pdeptCd: '',
        pdeptNm: '',
        deptLvl: '',
        useYn: 'Y',

        createUserId: '',
        updateUserId: '',
        keyValue: '',
      },
      editable: false,
      tempDeptCd: '', // 임시부서 코드
      isSave: false,
      isEdit: false,
      updateMode: false,
      saveUrl: '', // 부서신규등록 URL
      editUrl: '', // 부서수정 URL
      countUrl: '', // 부서Cd 중복 유효성검사 URL
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.saveUrl = transactionConfig.manage.dept.insert.url;
      this.editUrl = transactionConfig.manage.dept.update.url;
      this.countUrl = selectConfig.manage.dept.count.url;

      if (this.popupParam.deptCd) {
        this.getDetail();
      }
    },
    // 상세화면 불러오기
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.manage.dept.get.url,
        this.popupParam.deptCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.dept = _result.data;
          this.tempDeptCd = this.dept.deptCd;
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    btnClosePopup(data) {
      this.$emit('closePopup', { success: true });
    },
    setDeptLvl(deptLvl) {
      this.dept.deptLvl = 0;
      this.dept.deptLvl = String(Number(deptLvl) + 10);
    },
    beforeSave() {
      this.dept.deptCd = this.tempDeptCd;
      this.dept.createUserId = this.$store.getters.token;
      this.checkValidationInsert('insert');
    },
    // 유효성 검사 메소드
    checkValidationInsert(flag) {
      // 신규등록 부서코드 중복 변수
      var countDept = 0;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (!_result) {
            if (!this.dept.plantCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000066', // 사업장을 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
            } else if (!this.dept.deptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001615', // 부서코드를 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
            } else if (!this.dept.deptNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001616', // 부서를 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
            } else if (!this.dept.pdeptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001617', // 상위부서를 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
            }
          } else {
            this.$http.url = this.countUrl;
            this.$http.param = {
              deptCd: this.dept.deptCd,
            };
            this.$http.type = 'GET';
            this.$http.request((_result) => {
              countDept = _result.data;
              if (countDept > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001619', // 이미 존재하는 부서코드입니다.
                  type: 'warning',
                });
                return;
              } else {
                // 저장 수정버튼 클릭후 최종 컨펌창
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message:
                    flag === 'insert'
                      ? 'M0000000105' // 등록하시겠습니까?
                      : 'M0000000060', // 수정하시겠습니까?
                  type: 'info',
                  // 확인 callback 함수
                  confirmCallback: () => {
                    if (flag === 'insert') {
                      this.dept.createUserId = this.$store.getters.token;
                      this.isSave = true;
                    } else {
                      this.dept.updateUserId = this.$store.getters.token;
                      this.isEdit = true;
                    }
                  },
                  cancelCallback: () => {
                    this.isInsert = false;
                    this.isEdit = false;
                  },
                });
              }
            });
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    btnSaveClickedCallback(_result) {
      this.updateMode = true;
      this.dept.deptCd = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다
        type: 'success',
      });
      this.isSave = false;
    },

    beforeEdit() {
      this.dept.updateUserId = this.$store.getters.token;
      this.dept.keyValue = this.dept.deptCd;
      this.checkValidationInsert('edit');
    },
    // 수정
    btnEditClickedCallback() {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다
        type: 'success',
      });
      this.updateMode = true;
    },

    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isEdit = false;

      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
