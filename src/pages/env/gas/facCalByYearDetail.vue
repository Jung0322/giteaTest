<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 배출시설 상세 -->
            <y-label
              label="L0000001171"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 이전 배출계수 불러오기 -->
              <y-btn
                title="L0000004494"
                color="blue"
                @btnClicked="btnPrevParameterClicked"
              />
              <!-- 저장 -->
              <y-btn
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
            <!-- 배출시설분류 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="disFacItems"
                :disabled="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001175"
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
          </b-row>
        </b-card>

        <!-- 배출활동/활동자료 목록 -->
        <b-row class="grid-height grid-box mt-3">
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :editable="false"
              :name="gridOptions.name"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000001190')"
              :enableCellMerge="true"
              :useExcelExport="false"
              :enableSorting="true"
            />
          </b-col>
        </b-row>
        <b-row class="mt-3">
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
            <!-- 배출활동코드 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000001194"
                placeholder="배출활동/활동자료를 선택하세요."
                v-model="selected.ghgOutActNm"
              >
              </y-text>
            </b-col>
            <!-- 적용Tier -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="tierItems"
                :disabled="!selectedFlag"
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
            <!-- 산정단위 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :disabled="!selectedFlag"
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
            <!-- 배출계수(TCO2/TJ,MWH) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :disabled="!selectedFlag"
                ui="bootstrap"
                :editable="editable"
                label="L0000001141"
                :hasSeperator="false"
                :pointNumber="3"
                name="paEmiCoeCo2"
                v-model="ghgFclt.paEmiCoeCo2"
              ></y-number>
            </b-col>
            <!-- 배출계수(kgCH4/TJ,MWH) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :disabled="!selectedFlag"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                label="L0000001139"
                :pointNumber="3"
                name="paEmiCoeCh4"
                v-model="ghgFclt.paEmiCoeCh4"
              ></y-number>
            </b-col>
            <!-- 배출계수(kgN20/TJ,MWH) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                :disabled="!selectedFlag"
                label="L0000001140"
                :pointNumber="3"
                name="paEmiCoeN20"
                v-model="ghgFclt.paEmiCoeN20"
              ></y-number>
            </b-col>
            <!-- 배출계수(kgHFCs/TJ,MWH) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                :disabled="!selectedFlag"
                label="L0000004495"
                :pointNumber="3"
                name="paEmiCoeHfcs"
                v-model="ghgFclt.paEmiCoeHfcs"
              ></y-number>
            </b-col>
            <!-- 배출계수(kgPfcs/TJ,MWH) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                :disabled="!selectedFlag"
                label="L0000004496"
                :pointNumber="3"
                name="paEmiCoePfcs"
                v-model="ghgFclt.paEmiCoePfcs"
              ></y-number>
            </b-col>
            <!-- 배출계수(kgSf6/TJ,MWH) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                :disabled="!selectedFlag"
                label="L0000004497"
                :pointNumber="3"
                name="paEmiCoeSf6"
                v-model="ghgFclt.paEmiCoeSf6"
              ></y-number>
            </b-col>
            <!-- 열량계수(순발열량-GJ/단위) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :hasSeperator="false"
                :editable="editable"
                :disabled="!selectedFlag"
                label="L0000002011"
                :pointNumber="2"
                name="paCalCoeP"
                v-model="ghgFclt.paCalCoeP"
              ></y-number>
            </b-col>
            <!-- 산화율(산화계수) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                :disabled="!selectedFlag"
                :hasSeperator="false"
                label="L0000001514"
                :pointNumber="2"
                name="paOxiCoe"
                v-model="ghgFclt.paOxiCoe"
              ></y-number>
            </b-col>
            <!-- 열량계수(총발열량-GJ/단위) -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="!selectedFlag"
                :hasSeperator="false"
                :editable="editable"
                label="L0000002012"
                :pointNumber="2"
                name="paCalCoeT"
                v-model="ghgFclt.paCalCoeT"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="!selectedFlag"
                :editable="editable"
                label="GWP-CO2"
                name="paGwpCo2"
                v-model="ghgFclt.paGwpCo2"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                :disabled="!selectedFlag"
                label="GWP-CH4"
                name="paGwpCh4"
                v-model="ghgFclt.paGwpCh4"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                :disabled="!selectedFlag"
                label="GWP-N20"
                name="paGwpN2o"
                v-model="ghgFclt.paGwpN2o"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                :disabled="!selectedFlag"
                label="GWP-HFCs"
                name="paGwpHfcs"
                v-model="ghgFclt.paGwpHfcs"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                :disabled="!selectedFlag"
                label="GWP-PFCs"
                name="paGwpPfcs"
                v-model="ghgFclt.paGwpPfcs"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                ui="bootstrap"
                :editable="editable"
                :disabled="!selectedFlag"
                label="GWP-SF6"
                name="paGwpSf6"
                v-model="ghgFclt.paGwpSf6"
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
  name: 'y-elect-his-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ghgFcltNo: 0, // key
        year: '',
      },
    },
  },
  data() {
    return {
      ghgFclt: {
        ghgFcltNo: 0,
        ghgFcltCd: null,
        ghgFcltGrpNo: 0,
        fcltCalcMtdNo: 0,
        ghgOutActCd: '',
        ghgActDaCd: '',
        fcltNm: null,
        ghgUnitCd: null,
        paEmiCoeCo2: null,
        paEmiCoeCh4: null,
        paEmiCoeN20: null,
        paEmiCoeHfcs: null,
        paEmiCoePfcs: null,
        paEmiCoeSf6: null,
        paCalCoeP: null,
        paCalCoeT: null,
        paOxiCoe: null,
        paGwpCo2: null,
        paGwpCh4: null,
        paGwpN2o: null,
        paGwpHfcs: null,
        paGwpPfcs: null,
        paGwpSf6: null,
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
        name: 'facCalByYearDetail',
        header: [],
        data: [],
        btns: [],
        height: 200,
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
      selected: {
        ghgOutActCd: '',
        ghgActDaCd: '',
        ghgOutActNm: '',
      },
      selectedFlag: false,
      editable: false,
      saveUrl: '',

      disFacItems: [],
      dataItems: [],
      disActItems: [],

      saveItems: [], // 저장해야할 대상
      searchedItems: [], // 조회해온 대상

      unitItems: [],
      tierItems: [],
      prevParameterButtonClicked: false,
      noPrevParameterPopupFlag: false,
      savedSelectedRow: null,
      gridOptionsLength: 0,

      ghgOutActCdNm: '',
      ppActDataNm: '',
      pActDataNm: '',
      ghgActDaCd: '',
      actDataNm: '',

      checkDisabled: true,
      YAuiGrid: null,
    };
  },
  watch: {
    'selected.ghgActDaCd': function (newVal, oldVal) {
      if (this.selected.ghgActDaCd) {
        this.selectedFlag = true;
      } else {
        this.selectedFlag = false;
      }
    },
    gridOptionsLength: function (newVal, oldVal) {
      if (this.gridOptionsLength === this.gridOptions.data.length) {
        if (this.savedSelectedRow) {
          this.selected.ghgOutActCd = this.savedGhgOutActCd;
          this.selected.ghgActDaCd = this.savedGhgActDaCd;
          this.ghgFclt.ghgOutActCd = this.savedSelectedRow.ghgOutActCd;
          this.ghgFclt.ghgActDaCd = this.savedSelectedRow.ghgActDaCd;
          this.getParameter();
        } else {
          this.ghgFclt.paTier = null;
          this.ghgFclt.ghgUnitCd = null;
          this.ghgFclt.paEmiCoeCo2 = null;
          this.ghgFclt.paEmiCoeCh4 = null;
          this.ghgFclt.paEmiCoeN20 = null;
          this.ghgFclt.paEmiCoeHfcs = null;
          this.ghgFclt.paEmiCoePfcs = null;
          this.ghgFclt.paEmiCoeSf6 = null;
          this.ghgFclt.paCalCoeP = null;
          this.ghgFclt.paOxiCoe = null;
          this.ghgFclt.paCalCoeT = null;
          this.ghgFclt.paGwpCo2 = null;
          this.ghgFclt.paGwpCh4 = null;
          this.ghgFclt.paGwpN2o = null;
          this.ghgFclt.paGwpHfcs = null;
          this.ghgFclt.paGwpPfcs = null;
          this.ghgFclt.paGwpSf6 = null;
        }
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDetail();
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
      this.getDetail();
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
            unitNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
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
          /* 배출활동코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001194'),
          dataField: 'ghgOutActCd',
          width: '14%',
          style: 'left-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.disFacItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
            disabledFunction: () => {
              return this.checkDisabled;
            },
          },
        },
        {
          /* 대분류명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000915'),
          dataField: 'ppActDataNm',
          width: '12%',
          style: 'center-align',
        },
        {
          /* 중분류명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002731'),
          dataField: 'pActDataNm',
          width: '12%',
          style: 'center-align',
        },
        {
          /* 활동자료코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003353'),
          dataField: 'ghgActDaCd',
          width: '12%',
          style: 'center-align',
        },
        {
          /* 활동자료명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003350'),
          dataField: 'actDataNm',
          width: '14%',
          style: 'center-align',
        },
        {
          /* 활동자료명(자체) */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003352'),
          dataField: 'actDaNm',
          width: '12%',
          style: 'left-align',
        },
        {
          /* 데이터연계 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000947'),
          dataField: 'daIfCd',
          width: '12%',
          style: 'left-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.dataItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
            disabledFunction: () => {
              return this.checkDisabled;
            },
          },
        },
        {
          /* 연계SYS코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001990'),
          dataField: 'ifTagCd',
          width: '12%',
          style: 'left-align',
        },
      ];
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.ghgFcltNo || this.popupParam.ghgFcltNo === 0) {
          this.ghgFclt.createUserNm = this.$store.getters.name;
          return;
        }
        this.$http.url = this.$format(
          selectConfig.env.gas.facMgtYear.get.url,
          this.popupParam.ghgFcltNo,
          this.popupParam.year
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.ghgFclt = _result.data;
            this.YAuiGrid.setGridData(
              this.$_.clone(_result.data.disActDataList)
            );
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
          }
        );
      });
    },
    getParameter(_action) {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.ghgFcltNo || this.popupParam.ghgFcltNo === 0) {
          this.ghgFclt.createUserNm = this.$store.getters.name;
          return;
        }

        // 이미 조회해서 변경한 데이터가 있는지 확인
        let searchedIdx = this.$_.findIndex(this.saveItems, {
          ghgActDaCd: this.selected.ghgActDaCd,
        });

        // 조회후 변경한 데이터(저장대상)가 없는경우 새로 조회
        if (searchedIdx === -1) {
          this.$http.url = this.$format(
            selectConfig.env.gas.facFacYear.get.url,
            this.popupParam.ghgFcltNo,
            this.prevParameterButtonClicked
              ? this.popupParam.year - 1
              : this.popupParam.year,
            this.selected.ghgOutActCd,
            this.selected.ghgActDaCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              if (_result.data === '') {
                if (!this.noPrevParameterPopupFlag) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message:
                      'M0000001061' /* 기존에 등록된 내역이 없는 활동자료가 있습니다. 등록된 내역이 없는 경우 직접 등록하여 주시기 바랍니다. */,
                    type: 'warning',
                  });
                }
                this.noPrevParameterPopupFlag = true;

                this.$http.url = this.$format(
                  selectConfig.env.gas.facFacYear.get.url,
                  this.popupParam.ghgFcltNo,
                  this.popupParam.year,
                  this.selected.ghgOutActCd,
                  this.selected.ghgActDaCd
                );
                this.$http.type = 'GET';
                this.$http.request(
                  (_innerResult) => {
                    this.ghgFclt = _innerResult.data;
                    this.ghgFclt.year = this.popupParam.year;
                    this.ghgFclt.fcltCalcMtdNo =
                      _innerResult.data.fcltCalcMtdNo;
                    this.ghgFclt.paTier = null;
                    this.ghgFclt.ghgUnitCd = null;
                    this.ghgFclt.paEmiCoeCo2 = null;
                    this.ghgFclt.paEmiCoeCh4 = null;
                    this.ghgFclt.paEmiCoeN20 = null;
                    this.ghgFclt.paEmiCoeHfcs = null;
                    this.ghgFclt.paEmiCoePfcs = null;
                    this.ghgFclt.paEmiCoeSf6 = null;
                    this.ghgFclt.paCalCoeP = null;
                    this.ghgFclt.paOxiCoe = null;
                    this.ghgFclt.paCalCoeT = null;
                    this.ghgFclt.paGwpCo2 = null;
                    this.ghgFclt.paGwpCh4 = null;
                    this.ghgFclt.paGwpN2o = null;
                    this.ghgFclt.paGwpHfcs = null;
                    this.ghgFclt.paGwpPfcs = null;
                    this.ghgFclt.paGwpSf6 = null;

                    this.ghgFclt.createUserId = this.$store.getters.token;
                    this.ghgFclt.updateUserId = this.$store.getters.token;

                    // 변경여부를 확인하기 위해 복사
                    // 조회한 데이터가 이미 조회하여 담았는지 여부 확인하기 위한 idx 추출
                    let searchedIdx = this.$_.findIndex(this.searchedItems, {
                      ghgActDaCd: this.ghgFclt.ghgActDaCd,
                    });
                    // 담겨져 있으면 지운다.
                    if (searchedIdx !== -1) {
                      this.searchedItems.splice(searchedIdx, 1);
                    }
                    // 새로 담아주기
                    this.searchedItems.push(this.$_.cloneDeep(this.ghgFclt));

                    if (_action === 'prevParameterClicked') {
                      this.gridOptionsLength += 1;
                    }
                    _resolve(true);
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                    _resolve(false);
                  }
                );
                return;
              }
              this.$http.url = this.$format(
                selectConfig.env.gas.facFacYear.get.url,
                this.popupParam.ghgFcltNo,
                this.popupParam.year,
                this.selected.ghgOutActCd,
                this.selected.ghgActDaCd
              );
              this.$http.request(
                (_innerResult) => {
                  this.ghgFclt = _result.data;
                  this.ghgFclt.year = this.popupParam.year;
                  this.ghgFclt.fcltCalcMtdNo = _innerResult.data.fcltCalcMtdNo;

                  this.ghgFclt.createUserId = this.$store.getters.token;
                  this.ghgFclt.updateUserId = this.$store.getters.token;

                  // 변경여부를 확인하기 위해 복사
                  // 조회한 데이터가 이미 조회하여 담았는지 여부 확인하기 위한 idx 추출
                  let searchedIdx = this.$_.findIndex(this.searchedItems, {
                    ghgActDaCd: this.ghgFclt.ghgActDaCd,
                  });
                  // 담겨져 있으면 지운다
                  if (searchedIdx !== -1) {
                    this.searchedItems.splice(searchedIdx, 1);
                  }
                  // 다시 담는다.
                  this.searchedItems.push(this.$_.cloneDeep(this.ghgFclt));

                  if (
                    _action === 'selected' &&
                    !this.prevParameterButtonClicked
                  ) {
                    this.savedSelectedRow = this.ghgFclt;
                  }
                  if (_action === 'prevParameterClicked') {
                    this.gridOptionsLength += 1;
                  }
                  _resolve(true);
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  _resolve(false);
                }
              );
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _resolve(false);
            }
          );

          // 변경대상 데이터라면 변경했던 데이터로 매개변수부분 셋팅
        } else {
          this.ghgFclt = this.saveItems[searchedIdx];
        }
      });
    },
    btnPrevParameterClicked() {
      this.gridOptionsLength = 0;
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message:
          'M0000001062' /* 배출계수 불러오기 적용시 기존에 작성된 내역은 초기화 됩니다. 진행하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.prevParameterButtonClicked = true;
          for (let i = 0; i < this.gridOptions.data.length; i++) {
            this.selected.ghgOutActNm = this.$_.filter(this.disActItems, {
              code: this.gridOptions.data[i].ghgOutActCd,
            })[0].codeNm;

            this.selected.ghgOutActCd = this.gridOptions.data[i].ghgOutActCd;
            this.selected.ghgActDaCd = this.gridOptions.data[i].ghgActDaCd;
            this.ghgFclt.ghgOutActCd = this.gridOptions.data[i].ghgOutActCd;
            this.ghgFclt.ghgActDaCd = this.gridOptions.data[i].ghgActDaCd;
            this.getParameter('prevParameterClicked');
          }
        },
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = transactionConfig.env.gas.facFacYear.save.url;
        this.$http.type = 'POST';
        this.$http.param = this.saveItems;
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
    selectedRow(data) {
      // 데이터를 선택시 기존에 선택되었던 데이터가 존재하면 변경여부 확인하여 변경시 저장 대상 아이템으로 넣어준다.
      if (this.selectedFlag) {
        // 조회했을 당시에 데이터가 존재하는지 확인하기 위한 idx 추출
        let searchedIdx = this.$_.findIndex(this.searchedItems, {
          ghgActDaCd: this.ghgFclt.ghgActDaCd,
        });

        // 조회를 이미 했던 데이터라면 현재 선택이전의 매개변수가 변경되었는지 확인하기 위해 꺼낸다.
        let searchedGhgFclt = {};
        if (searchedIdx !== -1) {
          searchedGhgFclt = this.searchedItems[searchedIdx];
        }

        if (!this.$_.isEqual(this.ghgFclt, searchedGhgFclt)) {
          // 변경여부 비교

          // 이미 담겨져 있는지 확인하기 위한 index 추출
          let saveIdx = this.$_.findIndex(this.saveItems, {
            ghgActDaCd: this.ghgFclt.ghgActDaCd,
          });

          // 이미 담겨져 있다면 삭제
          if (saveIdx !== -1) {
            this.saveItems.splice(saveIdx, 1);
          }

          // 변경 데이터 담아주기 (저장대상)
          this.saveItems.push(this.$_.cloneDeep(this.ghgFclt));
        }
      }

      this.selected.ghgOutActNm = this.$_.filter(this.disActItems, {
        code: data.ghgOutActCd,
      })[0].codeNm;

      this.selected.ghgOutActCd = data.ghgOutActCd;
      this.savedGhgOutActCd = data.ghgOutActCd;
      this.selected.ghgActDaCd = data.ghgActDaCd;
      this.savedGhgActDaCd = data.ghgActDaCd;
      this.selected.ghgActDaCd = data.ghgActDaCd;
      this.ghgFclt.ghgActDaCd = data.ghgActDaCd;
      this.ghgFclt.ghgActDaCd = data.ghgActDaCd;

      // 매개변수 조회
      this.getParameter('selected');
    },
    btnSaveClicked() {
      let searchedIdx = this.$_.findIndex(this.searchedItems, {
        ghgActDaCd: this.ghgFclt.ghgActDaCd,
      });

      // 조회를 이미 했던 데이터라면 현재 선택이전의 매개변수가 변경되었는지 확인하기 위해 꺼낸다.
      let searchedGhgFclt = {};
      if (searchedIdx !== -1) {
        searchedGhgFclt = this.searchedItems[searchedIdx];
      }

      if (!this.$_.isEqual(this.ghgFclt, searchedGhgFclt)) {
        // 변경여부 비교

        // 이미 담겨져 있는지 확인하기 위한 index 추출
        let saveIdx = this.$_.findIndex(this.saveItems, {
          ghgActDaCd: this.ghgFclt.ghgActDaCd,
        });

        // 이미 담겨져 있다면 삭제
        if (saveIdx !== -1) {
          this.saveItems.splice(saveIdx, 1);
        }

        // 변경 데이터 담아주기 (저장대상)
        this.saveItems.push(this.$_.cloneDeep(this.ghgFclt));
      }

      this.$comm.recursivePromise([
        {
          func: this.checkValid,
          exceptionMessage:
            'M0000001063' /* 배출활동/활동자료 목록 을 선택하세요. */,
        },
        { func: this.checkValidation },
        { func: this.confirm, param: 'M0000000011' } /* 저장하시겠습니까? */,
        { func: this.saveData },
        { func: this.getDetail },
        {
          func: this.getParameter,
          successMessage: 'M0000000006',
        } /* 저장되었습니다. */,
      ]);
      this.prevParameterButtonClicked = false;
    },
    /**
     * 필수입력값 유효성 검사
     */
    checkValidation() {
      return new Promise((_resolve, _reject) => {
        let isOk = true;

        // 저장대상 리스트에 담겨진 데이터를 확인하여 필수값 입력여부 체크한다.
        this.saveItems.forEach((item) => {
          if (!item.paTier) {
            let targetNm = this.$_.filter(this.disActItems, {
              code: item.ghgOutActCd,
            })[0].codeNm;

            // alert 메시지 셋팅
            let alertMsg = this.$comm.getLangSpecInfoMessage('M0000001587', {
              t1: targetNm, // {t1}의 적용Tier가 입력되지 않았습니다.
            });

            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: alertMsg,
              type: 'warning',
            });

            isOk = false;
            return false;
          }
        });

        if (isOk) {
          _resolve(true);
        } else {
          _resolve(false);
        }
      });
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
    checkValid() {
      return new Promise((_resolve, _resject) => {
        if (!this.selected.ghgOutActCd) {
          _resolve(false);
        } else {
          _resolve(true);
        }
      });
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
