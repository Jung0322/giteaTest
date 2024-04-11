<!--
  목적 : 위험성평가 > 기준정보 > 변수 > 상세정보 팝업
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <!-- 변수 -->
        <y-label label="L0000001236" icon="user-edit" color-class="cutstom-title-color" />
        <!-- 저장 -->
        <div slot="buttonGroup" class="float-right mb-1">
          <y-btn
            v-if="editable"
            :action-url="saveUrl"
            :param="variable"
            :is-submit="isSave"
            title="L0000002474"
            color="orange"
            :action-type="actionType"
            beforeSubmit = "beforeSave"
            @beforeSave="beforeSave"
            @btnClicked="btnSaveClickedCallback" 
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
      </b-col>
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 변수명(KOR) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                label="L0000001242"
                name="varNmKr"
                v-model="variable.varNmKr"
                v-validate="'required'"
                :state="validateState('varNmKr')"
              >
              </y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 변수명(ENG) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                label="L0000001241"
                name="varNmEn"
                v-model="variable.varNmEn"
                v-validate="'required'"
                :state="validateState('varNmEn')"
              >
              </y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="2">
                  <!-- 사용가능한 가이드워드 -->
                  <y-label label="사용가능한 가이드워드"></y-label>
                </b-col>
                <b-col sm="10">
                  <el-checkbox-group v-model="variable.variableUseGuidewordCombo">
                    <el-checkbox-button 
                      v-for="guidword in guidwordItems" 
                      :key="guidword.code"
                      :label="guidword.code"
                      @change="val => changeGuideword(val, guidword.code)">
                      {{guidword.codeNm}}
                    </el-checkbox-button>
                  </el-checkbox-group>
                </b-col>
              </b-row>
            </b-col>
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
                v-model="variable.useYn"
                >
              </y-switch>
            </b-col>
            <el-divider content-position="left">가능한 원인</el-divider>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6"
              v-for="(guidword, index) in variable.variableUseGuideword" 
              :key="index"
              v-if="guidword.useYn === 'Y'"
            >
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 추가 -->
                <y-btn v-if="editable" title="L0000002892" color="orange" :showLoading="false" @btnClicked="addCause(guidword)" />
                <!-- 삭제 -->
                <y-btn v-if="editable && guidword.posibleCauses && guidword.posibleCauses.length > 0" title="L0000001495" color="red" @btnClicked="deleteCause(guidword)" />
              </div>
              <y-data-table
                :label="getTableTitle(guidword.guidewordCd)"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="guidword.posibleCauses"
                v-model="guidword.selectedValue"
              >
                <el-table-column
                  v-if="editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
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
  name: 'y-variable-detail',
  components: {
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        varId: 0,
      },
    },
  },
  data () {
    return {
      editable: false,
      insertUrl: '',
      editUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'PUT',
      variable: {
        varId: '',
        varNmKr: '',
        varNmEn: '',
        useYn: 'Y',
        variableUseGuideword: [],
        variableUseGuidewordCombo: [],
      },
      guidwordItems: [], // 가이드워드
      gridOptions: {
        header: [],
        height: 300,
      },
      selectedValue: [],
    };
  },
  computed: {
  },
  watch: {
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // 작성권한
      this.editable = this.$route.meta.editable;

      // URL 셋팅 
      this.insertUrl = transactionConfig.rsa.variable.insert.url;
      this.editUrl = transactionConfig.rsa.variable.edit.url;

      this.gridOptions.header = [
        {
          text: 'L0000000190', // 가능한 원인
          name: 'posibleCauseNm',
          width: '100%',
          align: 'left',
          type: 'textarea',
          maxlength: 250,
        },
      ];

      // 가이드워드
      this.$comm.getComboItems('RSA_GUIDEWORD').then(_result => {
        this.guidwordItems = _result;
        this.getDetail();
      });
    },
    // 변수 상세
    getDetail () {
      if (this.popupParam.varId > 0) {
        this.$http.url = this.$format(selectConfig.rsa.variable.get.url, this.popupParam.varId);
        this.$http.type = 'get'; 
        this.$http.request((_result) => {
          this.$_.extend(this.variable, _result.data)

          if (this.variable.variableUseGuideword && this.variable.variableUseGuideword.length > 0) {
            this.variable.variableUseGuidewordCombo = this.$_.map(this.$_.filter(this.variable.variableUseGuideword, { useYn: 'Y' }), 'guidewordCd');
          }
        }, (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        });
      }
    },
    /** validation checking **/
    beforeSave () {
      if (this.popupParam.varId > 0) {
        this.actionType = 'PUT';
        this.saveUrl = this.$_.clone(this.editUrl);
      } else {
        this.actionType = 'POST';
        this.saveUrl = this.$_.clone(this.insertUrl);
      }
      this.checkDuplicate()
    },
    // 신규등록 및 수정 시 중복검사
    checkDuplicate () {
      this.$validator.validateAll().then((_result) => {
        if (_result) {
          this.$http.url = selectConfig.rsa.variable.check.url;
          this.$http.type = 'GET';
          this.$http.param = {
            'varNmKr': this.variable.varNmKr,
            'varNmEn': this.variable.varNmEn,
            'varId': this.popupParam.varId > 0 ? this.popupParam.varId : 0,
          };
          this.$http.request((_result) => {
            var i = 0;
            var checkText = '';
            for (; i < _result.data.length; i++)
            {
              if (_result.data[i].cnt !== 0)
              {
                checkText = _result.data[i].gubun === 'varNmKr' ? 'M0000000666' : 'M0000000667';
                // '이미 존재하는 변수명' + (_result.data[i].gubun === 'varNmKr' ? '(KOR)' : '(ENG)') + '입니다.
                break;
              }
            }
            
            if (!checkText) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000011', // 저장하시겠습니까?
                type: 'info',
                // 확인 callback 함수
                confirmCallback: () => {
                  this.variable.createUserId = this.$store.getters.token;
                  this.variable.updateUserId = this.$store.getters.token;
                  this.isSave = true;
                },
                cancelCallback: () => {
                }
              });
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: checkText,
                type: 'warning',
              });
            }
          }, (_error) => {
            this.isSave = false;
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          });
        } else if (!_result) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000005', // 필수 입력값을 입력해 주세요.
            type: 'warning',
          });
        }
      }).catch(() => {
        window.getApp.$emit('APP_VALID_ERROR', 'M0000000876'); // 유효성 검사도중 에러가 발생하였습니다.
        this.isSave = false;
      });
      
    },
    validateState (_ref) {
      if (this.veeBag[_ref] && (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** /validation checking **/

    /** Button Event **/
    // 신규등록
    btnSaveClickedCallback (_result) {
      this.isSave = false;
      if (!this.popupParam.varId) {
        this.popupParam.varId = _result.data;
      }
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getDetail();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback (_result) {
      this.isSave = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 팝업 안 보이도록 closePopup emit
     * 팝업 close
     * data : 팝업창에서 return하는 데이터
     **/
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    changeGuideword(bool, guidewordCd) {
      let check = bool ? 'Y' : 'N';
      let index = this.$_.findIndex(this.variable.variableUseGuideword, { guidewordCd: guidewordCd })
      if (index > -1) {
        if (!bool) {
          // this.variable.variableUseGuidewordCombo
          if (this.variable.variableUseGuideword[index].posibleCauses && this.variable.variableUseGuideword[index].posibleCauses.length > 0) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: '체크해제 시 작성한 가능한 원인정보가 사라집니다. 계속하시겠습니까?', // 체크해제 시 작성한 가능한 원인정보가 사라집니다. 계속하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.variable.variableUseGuideword[index].posibleCauses = [];
                this.variable.variableUseGuideword[index].selectedValue = [];
                this.variable.variableUseGuideword[index].useYn = 'N';
              },
              cancelCallback: () => {
                this.variable.variableUseGuideword[index].useYn = 'Y'
                this.variable.variableUseGuidewordCombo.push(guidewordCd)
              }
            });
          } else {
            this.variable.variableUseGuideword[index].posibleCauses = [];
            this.variable.variableUseGuideword[index].selectedValue = [];
            this.variable.variableUseGuideword[index].useYn = 'N';
          }
        } else {
          this.variable.variableUseGuideword[index].posibleCauses = [];
          this.variable.variableUseGuideword[index].selectedValue = [];
          this.variable.variableUseGuideword[index].useYn = 'Y'
        }
      } else {
        this.variable.variableUseGuideword.push({
          varId: 0,
          guidewordCd: guidewordCd,
          useYn: check,
          posibleCauses: [],
          selectedValue: [],
        })
      }
    },
    getTableTitle(guidewordCd) {
      let data = this.$_.find(this.guidwordItems, { code: guidewordCd });
      if (data) {
        return data.codeNm + '에 대한 가능한 원인 목록';
      } else {
        return '에 대한 가능한 원인 목록';
      }
    },
    addCause(guidword) {
      if (!guidword.posibleCauses) {
        guidword.posibleCauses = [];
      }

      guidword.posibleCauses.splice(0, 0, {
        posibleCauseNo: 0,
        posibleCauseNm: '',
      });

      this.$forceUpdate();
    },
    deleteCause(guidword) {
      if (!guidword.selectedValue || guidword.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000068', // 하나 이상 선택하세요.
          type: 'warning',
        });
      } else {
        this.$_.forEach(guidword.selectedValue, item => {
          guidword.posibleCauses = this.$_.reject(guidword.posibleCauses, item);
        });

      }
    },
    /** /Button Event **/
  }
};
</script>