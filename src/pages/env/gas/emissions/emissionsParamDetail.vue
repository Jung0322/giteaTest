<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 시뮬레이션 산정 매개변수 등록 -->
            <y-label
              label="L0000005648"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!--저장  -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClicked"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-text
                :width="8"
                label="L0000000829"
                :editable="editable"
                :disabled="true"
                name="year"
                v-model="ghgFclt.year"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :width="8"
                :editable="editable"
                :disabled="true"
                name="plantCd"
                v-model="ghgFclt.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 부서 -->
              <y-tree-dept
                type="search"
                label="L0000001287"
                name="deptCd"
                :editable="editable"
                :disabled="true"
                :plantCd="ghgFclt.plantCd"
                v-model="ghgFclt.deptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공정 -->
              <y-tree-process
                label="L0000000515"
                name="processCd"
                type="search"
                :editable="editable"
                :disabled="true"
                :plantCd="ghgFclt.plantCd"
                v-model="ghgFclt.processCd"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설명 -->
              <y-select
                :width="8"
                :comboItems="disFacItems"
                :disabled="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001174"
                name="ghgFcltCd"
                v-model="ghgFclt.ghgFcltCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설명 -->
              <y-text
                :width="8"
                ui="bootstrap"
                :disabled="true"
                :editable="editable"
                label="L0000001174"
                name="fcltNm"
                v-model="ghgFclt.fcltNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- NGMS시설일련번호 -->
              <y-text
                :width="8"
                ui="bootstrap"
                :disabled="true"
                :editable="editable"
                label="L0000000136"
                name="ngmsFceqNum"
                v-model="ghgFclt.ngmsFceqNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설코드(ERP) -->
              <y-text
                :width="8"
                ui="bootstrap"
                :disabled="true"
                :editable="editable"
                label="L0000001768"
                name="erpCode"
                v-model="ghgFclt.erpCode"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출활동명 -->
              <y-text
                :width="8"
                ui="bootstrap"
                :disabled="true"
                :editable="editable"
                label="L0000001192"
                name="actNm"
                v-model="ghgFclt.actNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 활동자료명 -->
              <y-text
                :width="8"
                ui="bootstrap"
                :disabled="true"
                :editable="editable"
                label="L0000003350"
                name="actDataNm"
                v-model="ghgFclt.actDataNm"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
        <b-row>
          <b-col sm="12">
            <!-- 매개변수 -->
            <y-label
              label="L0000001001"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 적용Tier -->
              <y-select
                :width="8"
                :comboItems="tierItems"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                :required="true"
                label="L0000002483"
                name="paTier"
                v-model="ghgFclt.paTier"
                v-validate="'required'"
                :state="validateState('paTier')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- L0000002483 -->
              <y-select
                :width="8"
                :comboItems="unitItems"
                :editable="editable"
                itemText="unitNm"
                itemValue="unitCd"
                ui="bootstrap"
                label="L0000001509"
                name="ghgUnitCd"
                v-model="ghgFclt.ghgUnitCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출계수(TCO2/TJ,MWH) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                label="L0000001141"
                :hasSeperator="false"
                :pointNumber="3"
                name="paEmiCoeCo2"
                v-model="ghgFclt.paEmiCoeCo2"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출계수(kgCH4/TJ,MWH) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                label="L0000001139"
                :pointNumber="3"
                name="paEmiCoeCh4"
                v-model="ghgFclt.paEmiCoeCh4"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출계수(kgN20/TJ,MWH) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                label="L0000001140"
                :pointNumber="3"
                name="paEmiCoeN20"
                v-model="ghgFclt.paEmiCoeN20"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 열량계수(순발열량-GJ/단위) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                label="L0000002011"
                :pointNumber="2"
                name="paCalCoeP"
                v-model="ghgFclt.paCalCoeP"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 산화율(산화계수) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                :hasSeperator="false"
                label="L0000001514"
                :pointNumber="2"
                name="paOxiCoe"
                v-model="ghgFclt.paOxiCoe"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 열량계수(총발열량-GJ/단위) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                label="L0000002012"
                :pointNumber="2"
                name="paCalCoeT"
                v-model="ghgFclt.paCalCoeT"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- GWP-CO2 -->
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                label="L0000005649"
                name="paGwpCo2"
                v-model="ghgFclt.paGwpCo2"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- GWP-CH4 -->
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                label="L0000005650"
                name="paGwpCh4"
                v-model="ghgFclt.paGwpCh4"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- GWP-N20 -->
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                label="L0000005651"
                name="paGwpN2o"
                v-model="ghgFclt.paGwpN2o"
              ></y-number>
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
  name: 'emission-param-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ghgFcltNo: 0, // key
        year: '',
        ghgOutActCd: '',
        ghgActDaCd: '',
      },
    },
  },
  data() {
    return {
      ghgFclt: {
        ghgFcltNo: 0,
        ghgFcltCd: null,
        ghgFcltGrpNo: 0,
        fcltCalcNo: 0,
        ghgYn: '',
        ghgOutActCd: '',
        ghgActDaCd: '',
        fcltNm: null,
        ghgUnitCd: null,
        paEmiCoeCo2: null,
        paEmiCoeCh4: null,
        paEmiCoeN20: null,
        paCalCoeP: null,
        paCalCoeT: null,
        paOxiCoe: null,
        paGwpCo2: null,
        paGwpCh4: null,
        paGwpN2o: null,
        plantCd: null,
        lcnFactCd: null,
        ngmsFceqNum: null,
        erpCode: null,
        deptCd: null,
        processCd: null,
        useYn: 'Y',
        year: null,
        actNm: '',

        actDataNm: '',
        chgReason: null,
        sortOrder: null,
        createUserId: null,
        updateUserId: null,
      },
      gridOptions: {
        selectValue: [],
        header: [],
        data: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      saveUrl: '',

      disFacItems: [],
      dataItems: [],
      disActItems: [],
      saveItems: [],
      unitItems: [],
      tierItems: [],
    };
  },
  computed: {
    isAdd() {
      return !(this.gridOptions.data.length === 0);
    },
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('GHG_FAC_DATA', false).then((_result) => {
        this.disFacItems = _result;
      });
      this.$comm.getComboItems('DATA_LINK', false).then((_result) => {
        this.dataItems = _result;
        this.setGridHeader();
      });
      this.$comm.getComboItems('GHG_ACT_DATA', false).then((_result) => {
        this.disActItems = _result;
      });
      this.$comm.getComboItems('APPLY_TIER', false).then((_result) => {
        this.tierItems = _result;
      });
      this.getComboItems();
      this.realDetail();
    },
    getComboItems() {
      this.$http.url = selectConfig.env.gas.baseInfo.gasUnit.listCdNm.url;
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        (_result) => {
          this.unitItems = this.$_.clone(_result.data);
          this.unitItems.splice(0, 0, {
            unitCd: null,
            unitNm: this.$comm.getLangSpecInfoLabel('L00002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setGridHeader() {
      this.gridOptions.header = [
        {
          text: 'L0000003352',
          type: 'text',
          name: 'actDaNm',
          width: '100px',
          align: 'left',
        }, // 활동자료명(자체)
        {
          text: 'L0000000947',
          type: 'select',
          name: 'daIfCd',
          width: '100px',
          align: 'left',
          items: this.dataItems,
          itemText: 'codeNm',
          itemValue: 'code',
        }, // 데이터연계
        {
          text: 'L0000001990',
          type: 'text',
          name: 'ifTagCd',
          width: '100px',
          align: 'left',
        }, // 연계SYS코드
      ];
    },
    realDetail() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.ghgFcltNo || this.popupParam.ghgFcltNo === 0) {
          this.ghgFclt.createUserNm = this.$store.getters.name;
          return;
        }
        this.$http.url = this.$format(
          selectConfig.env.gas.emissions.get.url,
          this.popupParam.ghgFcltNo,
          this.popupParam.year,
          this.popupParam.ghgOutActCd,
          this.popupParam.ghgActDaCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data.fcltCalcNo > 0) {
              this.$_.extend(this.ghgFclt, _result.data);
            } else {
              this.getDetail();
            }
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
          }
        );
      });
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.ghgFcltNo || this.popupParam.ghgFcltNo === 0) {
          this.ghgFclt.createUserNm = this.$store.getters.name;
          return;
        }
        this.$http.url = this.$format(
          selectConfig.env.gas.facFacYear.get.url,
          this.popupParam.ghgFcltNo,
          this.popupParam.year,
          this.popupParam.ghgOutActCd,
          this.popupParam.ghgActDaCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.ghgFclt, _result.data);
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
          }
        );
      });
    },
    btnSaveClicked() {
      this.$comm.recursivePromise([
        {
          func: this.checkValidation,
          exceptionMessage: this.$comm.getLangSpecInfoLabel('M0000000005'), // '필수값을 입력하세요.',
        },
        {
          func: this.confirm,
          param: this.$comm.getLangSpecInfoLabel('M0000000011'),
        }, // 저장하시겠습니까?
        { func: this.saveData },
        {
          func: this.realDetail,
          successMessage: this.$comm.getLangSpecInfoLabel('M0000000006'),
        }, // 저장되었습니다
      ]);
    },
    /**
     * 필수입력값 유효성 검사
     */
    checkValidation() {
      return this.$validator.validateAll();
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
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000000011' /* 저장하시겠습니까? */,
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        if (this.ghgFclt.fcltCalcNo && this.ghgFclt.fcltCalcNo > 0) {
          this.$http.url = transactionConfig.env.gas.emissions.update.url;
          this.$http.type = 'PUT';
        } else {
          this.$http.url = transactionConfig.env.gas.emissions.insert.url;
          this.$http.type = 'POST';
        }

        this.ghgFclt.createUserId = this.$store.getters.token;
        this.ghgFclt.updateUserId = this.$store.getters.token;
        this.$http.param = this.ghgFclt;
        this.$http.request(
          (_result) => {
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
            _resolve(false);
          }
        );
      });
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
