<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 배출시설 상세-->
            <y-label
              label="L0000001171"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!--닫기  -->
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
                :disabled="true"
                :plantCd="ghgFclt.plantCd"
                v-model="ghgFclt.processCd"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설분류 -->
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
              <!--시설코드(ERP)  -->
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
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    
    <!-- 배출활동/활동자료 목록 -->
    <b-row class="grid-height grid-box">
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
    <y-dialog :param="popupOptions"></y-dialog>
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
      },
    },
  },
  data() {
    return {
      ghgFclt: {
        ghgFcltNo: 0,
        ghgFcltCd: null,
        ghgFcltGrpNo: 0,
        fcltNm: null,
        plantCd: null,
        lcnFactCd: null,
        ngmsFceqNum: null,
        erpCode: null,
        deptCd: null,
        processCd: null,
        useYn: 'Y',
        year: null,
        chgReason: null,
        sortOrder: null,
        createUserId: null,
        updateUserId: null,
        disActDataList: [],
      },
      gridOptions: {
        name: 'facMgtByYearDetail',
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
      editable: false,
      saveUrl: '',

      disFacItems: [],
      dataItems: [],
      disActItems: [],
      saveItems: [],
      ghgOutActCdNm: '',
      ppActDataNm: '',
      pActDataNm: '',
      ghgActDaCd: '',
      actDataNm: '',

      checkDisabled: true,
      YAuiGrid: null,
    };
  },
  computed: {},
  watch: {},
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
      /* this.ghgOutActCdNm = this.$comm.getLangSpecInfoLabel('L0000001194'); // 배출활동코드
      this.ppActDataNm = this.$comm.getLangSpecInfoLabel('L0000000915'); // 대분류명
      this.pActDataNm = this.$comm.getLangSpecInfoLabel('L0000002731'); // 중분류명
      this.ghgActDaCd = this.$comm.getLangSpecInfoLabel('L0000003353'); // 활동자료코드
      this.actDataNm = this.$comm.getLangSpecInfoLabel('L0000003350'); // 활동자료명 */
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

      this.getDetail();
    },
    setGridHeader() {
      this.gridOptions.header = [
        {/* 배출활동코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001194'),
          dataField: 'ghgOutActCd',
          width: '150',
          style: 'left-align',
          renderer: {
            type: "DropDownListRenderer",
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.disFacItems;
            },
            keyField: "code", // key 에 해당되는 필드명
            valueField: "codeNm", // value 에 해당되는 필드명
            disabledFunction: () => {
              return this.checkDisabled;
            },
          }
        },
        {/* 대분류명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000915'),
          dataField: 'ppActDataNm',
          width: '100',
          style: 'center-align',
        },
        {/* 중분류명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002731'),
          dataField: 'pActDataNm',
          width: '100',
          style: 'center-align',
        },
        {/* 활동자료코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003353'),
          dataField: 'ghgActDaCd',
          width: '100',
          style: 'center-align',
        },
        {/* 활동자료명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003350'),
          dataField: 'actDataNm',
          width: '200',
          style: 'center-align',
        },
        {/* 활동자료명(자체) */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003352'),
          dataField: 'actDaNm',
          width: '100',
          style: 'left-align',
        },
        { /* 데이터연계 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000947'),
          dataField: 'daIfCd',
          width: '100',
          style: 'left-align',
          renderer: {
            type: "DropDownListRenderer",
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.dataItems;
            },
            keyField: "code", // key 에 해당되는 필드명
            valueField: "codeNm", // value 에 해당되는 필드명
            disabledFunction: () => {
              return this.checkDisabled;
            },
          }
        },
        { /* 연계SYS코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001990'),
          dataField: 'ifTagCd',
          width: '100',
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
            this.YAuiGrid.setGridData(this.$_.clone(_result.data.disActDataList));
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
          }
        );
      });
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
