<!--
  목적 : 방지시설 관리
  작성자 : kkc
  Detail : 방지시설 조회,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 기본정보 상세 -->
            <y-label
              label="L0000000777"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div class="float-right">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="ewtrPreventFac"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="ewtrPreventFac"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12">
              <el-tag size="mini" type="danger">
                <!-- 사업장별로 클린센터가 조회됩니다. -->
                <i class="el-icon-info"></i>
                {{ this.$comm.getLangSpecInfoLabel('L0000001434') }}
              </el-tag>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                v-model="ewtrPreventFac.plantCd"
                :required="true"
                :editable="editable"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리부서 -->
              <y-tree-dept
                type="edit"
                :editable="editable"
                label="L0000000591"
                :plantCd="ewtrPreventFac.plantCd"
                v-model="ewtrPreventFac.deptCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001117"
                name="ewtrPreventFacNm"
                v-model="ewtrPreventFac.ewtrPreventFacNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrPreventFacNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리방법명 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="dispoMtdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002826"
                name="ewtrDispoMtdCd"
                v-model="ewtrPreventFac.ewtrDispoMtdCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrDispoMtdCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 클린센터 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="ewtrCleanFacItems"
                itemText="ewtrCleanFacNm"
                itemValue="ewtrCleanFacNo"
                ui="bootstrap"
                label="L0000002988"
                name="ewtrCleanFacNo"
                v-model="ewtrPreventFac.ewtrCleanFacNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrCleanFacNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="8">
                  <!-- 용량 -->
                  <y-number
                    :width="6"
                    :editable="editable"
                    :required="true"
                    :maxlength="10"
                    :hasSeperator="true"
                    :pointNumber="2"
                    ui="bootstrap"
                    label="L0000002061"
                    name="vol"
                    v-model="ewtrPreventFac.vol"
                    v-validate="'required'"
                    :state="validateState('vol')"
                  />
                </b-col>
                <b-col sm="4">
                  <y-select
                    :width="12"
                    :editable="editable"
                    :required="true"
                    :comboItems="envUnitCdItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="unitCd"
                    v-model="ewtrPreventFac.unitCd"
                    v-validate="'required'"
                    :state="validateState('unitCd')"
                  ></y-select>
                </b-col>
              </b-row>
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
                v-model="ewtrPreventFac.useYn"
              ></y-switch>
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="ewtrPreventFac.remark"
                :rows="2"
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
  /* attributes: name, components, props, data */
  name: 'prevention',
  props: {
    selectedPreventFacNo: 0,
    tabDisabled: 0,
  },
  data() {
    return {
      ewtrPreventFac: {
        ewtrPreventFacNo: 0,
        ewtrPreventFacNm: '',
        ewtrCleanFacNo: null,
        ewtrDispoMtdCd: null,
        plantCd: null,
        plantNm: null,
        remark: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        deptCd: null,
        vol: null,
        unitCd: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      editable: true,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      dispoMtdItems: [],
      ewtrCleanFacItems: [],
      editUrl: '',
      insertUrl: '',
      colsItems: [],
      envUnitCdItems: [],
    };
  },
  watch: {
    selectedPreventFacNo: function (newValue, oldValue) {
      this.ewtrPreventFac.ewtrPreventFacNo = this.selectedPreventFacNo;
      this.getDetail();
      this.getList();
    },
    'ewtrPreventFac.plantCd': function (newValue, oldValue) {
      this.getCleanItems();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    // this.ewtrPreventFac.plantCd = this.$store.getters.plantCd;
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable && !this.tabDisabled;
      this.ewtrPreventFac.plantCd = this.$store.getters.plantCd;

      // 처리방법
      this.$comm.getComboItems('EWTR_DISPO_MTD', false).then((_result) => {
        this.dispoMtdItems = _result;
      });
      // 단위
      this.$comm.getComboItems('ENV_UNIT', false).then((_result) => {
        this.envUnitCdItems = _result;
      });
      // 클린센터
      this.getCleanItems();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 방지시설명
        {
          text: 'L0000001117',
          name: 'ewtrPreventFacNm',
          width: '200px',
          align: 'left',
        },
        // 처리방법명
        {
          text: 'L0000002826',
          name: 'ewtrDispoMtdNm',
          width: '200px',
          align: 'left',
        },
        // 비고
        { text: 'L0000001360', name: 'remark', width: '300px', align: 'left' },
        // 사용여부
        {
          text: 'L0000001439',
          name: 'useYnNm',
          width: '100px',
          align: 'center',
        },
        // 정렬순서
        {
          text: 'L0000002601',
          name: 'sortOrder',
          width: '100px',
          align: 'center',
        },
        // 등록일
        {
          text: 'L0000000973',
          name: 'createDt',
          width: '200px',
          align: 'center',
        },
        // 등록자
        {
          text: 'L0000000976',
          name: 'createUserNm',
          width: '120px',
          align: 'center',
        },
        // 수정일
        {
          text: 'L0000001697',
          name: 'updateDt',
          width: '200px',
          align: 'center',
        },
        // 수정자
        {
          text: 'L0000001698',
          name: 'updateUserNm',
          width: '120px',
          align: 'center',
        },
      ];

      this.editUrl = transactionConfig.env.water.facility.preventFac.edit.url;
      this.insertUrl =
        transactionConfig.env.water.facility.preventFac.insert.url;
      this.ewtrPreventFac.ewtrPreventFacNo = this.selectedPreventFacNo;
      if (this.ewtrPreventFac.ewtrPreventFacNo !== 0) {
        this.getDetail();
      }
      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.env.water.facility.preventFac.list.url;
      this.$http.type = 'GET';
      this.$http.param = { plantCd: this.ewtrPreventFac.plantCd };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCleanItems() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = { plantCd: this.ewtrPreventFac.plantCd };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewtrCleanFacNo: null,
            ewtrCleanFacNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.ewtrCleanFacItems = this.$_.clone(_result.data);
          //  this.ewtrPreventFac.ewtrCleanFacNo = null;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail(data) {
      if (data === null) return;

      this.$http.url = this.$format(
        selectConfig.env.water.facility.preventFac.get.url,
        this.ewtrPreventFac.ewtrPreventFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.ewtrPreventFac = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      if (this.checkDuplicate()) return;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.ewtrPreventFac.ewtrPreventFacNo = '';
                this.updateMode = false;
                this.ewtrPreventFac.createUserId = this.$store.getters.token;

                this.isInsert = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'ewtrPrevention',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    beforeEdit() {
      if (this.checkDuplicate()) return;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.ewtrPreventFac.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'ewtrPrevention',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    checkDuplicate() {
      var test = {
        ewtrPreventFacNm: this.ewtrPreventFac.ewtrPreventFacNm,
      };
      var item = this.$_.find(this.gridOptions.data, test);
      if (item != null) {
        if (
          this.updateMode &&
          this.ewtrPreventFac.ewtrPreventFacNo === item.ewtrPreventFacNo
        ) {
          return false;
        }

        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000393', // '이미 같은 이름의 방지시설명이 존재합니다.',
          type: 'warning',
        });
        return true;
      }
      return false;
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

    /** button 관련 이벤트 **/
    btnInsertClickedCallback(_result) {
      this.ewtrPreventFac.ewtrPreventFacNo = _result.data;
      this.getList();
      this.isInsert = false;
      this.updateMode = true;
      this.$emit('changePrevention');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnEditClickedCallback(_result) {
      this.getList();
      this.isEdit = false;
      this.$emit('changePrevention');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
