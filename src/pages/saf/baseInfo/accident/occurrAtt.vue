<!--
  목적 : 안전 > 기준정보 > 발생형태 (중분류)
  작성자 : kdh
  Detail : 발생형태 (중분류) 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 추가 -->
            <y-btn
              v-if="editable"
              title="L0000002892"
              color="orange"
              @btnClicked="btnAddItemCheck"
            />
            <!-- 삭제 -->
            <y-btn
              v-if="editable"
              title="L0000001495"
              color="red"
              @btnClicked="btnDeleteItemCheck"
            />
          </div>
          <!-- 투자항목(중분류) 목록 -->
          <y-data-table
            label="L0000004263"
            ref="dataTableCheck"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :popMode="true"
            v-model="selectedValue"
          >
            <el-table-column
              align="center"
              type="selection"
              slot="selection"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 발생형태(중분류) 목록 -->
          <y-data-table
            ref="dataTable"
            label="L0000001088"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="getDetail"
            :popMode="true"
            v-model="selectedValue"
          />
        </b-col>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 발생형태 (중분류) 상세 -->
            <y-label
              label="L0000001089"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="codeGroup.codeLength"
                :disabled="!createMode"
                ui="bootstrap"
                label="L0000002969"
                name="code"
                v-model="codeMaster.code"
                v-validate="'required'"
                :state="validateState('code')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 중분류명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002731"
                name="codeNm"
                v-model="codeMaster.codeNm"
                v-validate="'required'"
                :state="validateState('codeNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
                v-model="codeMaster.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="codeMaster.sortOrder"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <!-- 초기화 -->
            <y-btn
              v-if="editable"
              title="L0000002859"
              @btnClicked="btnClearClickedCallback"
            />
            <!-- 저장 -->
            <y-btn
              v-if="editable && createMode"
              :action-url="insertUrl"
              :param="codeMaster"
              :is-submit="isCreateSubmit"
              title="L0000002474"
              color="orange"
              action-type="post"
              beforeSubmit="beforeCreateSubmit"
              @beforeCreateSubmit="beforeCreateSubmit"
              @btnClicked="btnCreateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 저장 -->
            <y-btn
              v-if="editable && !createMode && updateMode"
              :action-url="editUrl"
              :param="codeMaster"
              :is-submit="isUpdateSubmit"
              title="L0000002474"
              color="orange"
              action-type="put"
              beforeSubmit="beforeUpdateSubmit"
              @beforeUpdateSubmit="beforeUpdateSubmit"
              @btnClicked="btnUpdateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-occurr-att',
  props: {
    code: '',
  },
  data() {
    return {
      codeMaster: {
        code: '',
        codeNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      codeGroup: {
        codeLength: 5,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      selectedValue: [],
    };
  },
  watch: {
    code: function (newValue, oldValue) {
      this.btnClearClickedCallback();
      this.getList();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000002969',
          name: 'code',
          type: 'text',
          width: '100px',
          align: 'center',
        }, // 코드
        { text: 'L0000002731', name: 'codeNm', type: 'text', width: '250px' }, // 중분류명
        {
          text: 'L0000001439',
          name: 'useYnNm',
          type: 'switch',
          width: '100px',
          align: 'center',
        }, // 사용여부
        // { text: 'L0000000973', name: 'createDt', width: '110px', align: 'center' }, // 등록일
        // {
        //   text: 'L0000000976', // 등록자
        //   name: 'createUserNm',
        //   width: '100px',
        //   align: 'center',
        // },
        // { text: 'L0000001697', name: 'updateDt', width: '110px', align: 'center' }, // 수정일
        // {
        //   text: 'L0000001698', // 수정자
        //   name: 'updateUserNm',
        //   width: '100px',
        //   align: 'center',
        // },
      ];

      this.insertUrl = transactionConfig.saf.accidentOccurrAtt.insert.url;
      this.editUrl = transactionConfig.saf.accidentOccurrAtt.edit.url;
      this.searchUrl = selectConfig.saf.accidentOccurrAtt.list.url;
      this.detailUrl = selectConfig.saf.accidentOccurrAtt.get.url;
      this.checkUrl = selectConfig.saf.accidentOccurrAtt.check.url;

      this.editable = this.$route.meta.editable;

      this.getList();
    },
    getList() {
      if (!this.code) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = {
        codeGroupCd: this.code,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail(data) {
      this.$http.url = this.$format(this.detailUrl, this.code, data.code);
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeMaster = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkBeforSubmit(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'get';
            this.$http.param = {
              codeGroupCd: this.code,
              code: this.codeMaster.code,
              codeNm: this.codeMaster.codeNm,
            };
            this.$http.request(
              (_result) => {
                let result = true;
                if (_result.data && _result.data.length > 0) {
                  if (
                    flag === 'insert' &&
                    this.$_.findIndex(_result.data, { gubun: 'code' }) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000692', // 이미 같은 코드가 존재합니다.
                      type: 'warning',
                    });
                    result = false;
                  } else if (
                    this.$_.findIndex(_result.data, { gubun: 'name' }) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000696', // 이미 같은 중분류명이 존재합니다.
                      type: 'warning',
                    });
                    result = false;
                  }
                }

                if (result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.codeMaster.createUserId = this.$store.getters.token;
                      this.codeMaster.updateUserId = this.$store.getters.token;
                      if (flag === 'insert') {
                        this.codeMaster.codeGroupCd = this.code;
                        this.isCreateSubmit = true;
                      } else this.isUpdateSubmit = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check('occurrAtt', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도  에러가 발생하였습니다.
          );
        });
    },
    beforeCreateSubmit() {
      this.checkBeforSubmit('insert');
    },
    beforeUpdateSubmit() {
      this.checkBeforSubmit('edit');
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    btnClearClickedCallback(_result) {
      this.createMode = true;
      this.updateMode = false;
      Object.assign(this.$data.codeMaster, this.$options.data().codeMaster);
    },
    btnCreateClickedCallback(_result) {
      this.codeMaster.code = _result.data;
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },

    btnAddItemCheck() {
      this.gridOptions.data.splice(0, 0, {
        mgtMgInfoItmNo: '',
        mgInfoItmNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: this.codeMaster.createUserId,
        createUserNm: this.codeMaster.createUserNm,
        createDt: this.codeMaster.createDt,
        updateUserId: this.codeMaster.updateUserId,
        updateUserNm: this.codeMaster.updateUserNm,
        updateDt: this.codeMaster.updateDt,
        useYnNm: '',
        infoItmAttCd: this.codeMaster.code,
      });
    },
    btnDeleteItemCheck() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      } else {
        this.duplicationValueStr = '';
        this.duplicationValue.map(
          (item) =>
            (this.duplicationValueStr += `${item.mgtMgInfoItmNo}: ${item.mgInfoItmNm}  `)
        );
        this.deleteItem();
      }
    },
  },
};
</script>
