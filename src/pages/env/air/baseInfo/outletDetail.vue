<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 배출구 정보 -->
            <y-label
              label="L0000001144"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="outlet"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="outlet.plantCd"
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
                name="mgDeptCd"
                :plantCd="outlet.plantCd"
                v-model="outlet.mgDeptCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('mgDeptCd')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구일련번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001150"
                name="eairOutletNm"
                v-model="outlet.eairOutletNm"
                v-validate="'required'"
                :state="validateState('eairOutletNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001147"
                name="mainDischFacNm"
                v-model="outlet.mainDischFacNm"
                v-validate="'required'"
                :state="validateState('mainDischFacNm')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구허가증상배출구번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="25"
                ui="bootstrap"
                label="L0000001152"
                name="eairOutletPermitNo"
                v-model="outlet.eairOutletPermitNo"
                v-validate="'required'"
                :state="validateState('eairOutletPermitNo')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구직경(m) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001151"
                name="eairOutletDiam"
                v-model="outlet.eairOutletDiam"
                v-validate="'required'"
                :required="true"
                :state="validateState('eairOutletDiam')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구높이(m) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001146"
                name="eairOutletHt"
                v-model="outlet.eairOutletHt"
                v-validate="'required'"
                :required="true"
                :state="validateState('eairOutletHt')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정횟수 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="measureCntTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="airPerdCd"
                label="L0000002965"
                :required="true"
                v-validate="'required'"
                :state="validateState('airPerdCd')"
                v-model="outlet.airPerdCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대기총량제 대상여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000004794"
                name="airtotTargetYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="outlet.airtotTargetYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설효율(%) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="3"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000004795"
                name="efficiency"
                v-model="outlet.efficiency"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- ERP 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000000111"
                name="sapCd"
                v-model="outlet.sapCd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설면제여부 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="preventFacExemYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001116"
                name="preventFacExemYn"
                v-model="outlet.preventFacExemYn"
                :required="true"
                v-validate="'required'"
                :state="validateState('preventFacExemYn')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 연결배출시설 -->
              <y-multi-select
                :width="8"
                :editable="editable && preventFaxExemFlag"
                :needDefaultView="true"
                :comboItems="dischFacItems"
                itemText="eairDischFacNm"
                itemValue="eairDischFacNo"
                ui="bootstrap"
                label="L0000004200"
                name="outletDischItem"
                v-model="outlet.outletDischItem"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- SEMS대상여부 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="semsTargetYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004221"
                name="semsYn"
                v-model="outlet.semsYn"
              ></y-select>
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
                v-model="outlet.useYn"
              />
            </b-col>
          </b-row>

          <b-row>
            <!-- 방지시설 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-auigrid
                ref="yAuiGrid1"
                :editable="this.editable"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :items="gridOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000001107')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                @btnPrevClickedCallback="btnPrevClickedCallback"
                @cellEditEnd="cellEditEndHandlerPrev"
              />
            </b-col>

            <!-- 검사항목 목록 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-auigrid
                ref="yAuiGrid2"
                :editable="this.editable"
                :name="testitemgridOptions.name"
                :headers="testitemgridOptions.header"
                :btns="testitemgridOptions.btns"
                :height="testitemgridOptions.height"
                :items="testitemgridOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000000321')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRowCheckColumn="true"
                @btnTestItemClickedCallback="btnTestItemClickedCallback"
                @btnReject="btnReject"
                @cellEditEnd="cellEditEndHandlerTest"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'outlet-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        eairOutletNo: 0,
        facilityCd: 0,
        disabled: false,
      },
    },
  },
  data() {
    return {
      outlet: {
        eairOutletNo: 0,
        eairOutletNm: '',
        eairOutletPermitNo: null,
        eairOutletDiam: null,
        eairOutletHt: null,
        mainDischFacNm: '',
        sortserial: null,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        sapCd: '',
        updateUserId: '',
        updateUserNm: '',
        plantCd: '',
        plantNm: null,
        updateDt: '',
        eairTestItemCds: [],
        deptCd: '',
        mgDeptCd: '',
        measureCnt: null,
        preventFacExemYn: null,
        airtotTargetYn: 'Y',
        efficiency: null,

        outletDischItem: [],
        serial: 1,
        outletPreventSerial: [],
        semsYn: null,
      },
      testitemgridOptions: {
        name: 'outletTest',
        header: [],
        data: [],
        btns: [],
        height: '400',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '60px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'outletPrev',
        header: [],
        data: [],
        btns: [],
        height: '300',
        merge: [],
      },
      editable: false,
      isSave: false,
      actionType: 'POST',
      saveUrl: '',
      detailUrl: '',
      checkUrl: '',
      preventFaxExemFlag: false,

      selectedValue: [],
      eairInstCdItems: [], // 검사기기
      eairTestMtdCdItems: [], // 검사방법
      measureCntTypeItems: [], // 측정횟수
      preventFacExemYnItems: [], // 방지시설 면제여부
      preventionItems: [], // 연결방지시설
      dischFacItems: [], // 연결배출시설
      serialItem: [], // 차순
      tempPreventNm: '',
      tempserial: 1,
      semsTargetYnItems: [], // SEMS 대상여부 콤보 아이템
      YAuiGrid1: null,
      YAuiGrid2: null,
    };
  },
  watch: {
    'outlet.preventFacExemYn': function (newVal, oldVal) {
      if (this.outlet.preventFacExemYn === 'Y') {
        this.preventFaxExemFlag = true;
      } else if (this.outlet.preventFacExemYn === 'N') {
        this.outlet.outletDischItem = [];
        this.preventFaxExemFlag = false;
      } else {
        this.outlet.outletDischItem = [];
        this.preventFaxExemFlag = false;
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid1 = this.$refs.yAuiGrid1;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable && !this.popupParam.disabled;

      this.saveUrl = transactionConfig.env.air.baseInfo.outlet.insert.url;
      this.detailUrl = selectConfig.env.air.baseInfo.outletN.get.url;
      this.checkUrl = selectConfig.env.air.baseInfo.outletN.check.url;

      // 측정횟수
      this.$comm.getComboItems('EAIR_SELF_TEST_PERD', false).then((_result) => {
        this.measureCntTypeItems = _result;
      });

      this.setPrevGrid();
      this.setTestItem();
      this.setTestBtn();

      // 방지시설 면제여부
      this.preventFacExemYnItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // '선택하세요'
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003213') }, // 해당
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001065') }, // 미해당
      ];

      // SEMS대상여부
      this.semsTargetYnItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // '선택하세요'
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003213') }, // 해당
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001065') }, // 미해당
      ];

      this.serialItem = [
        { code: 1, codeNm: this.$comm.getLangSpecInfoLabel('L0000005557') }, // 1차
        { code: 2, codeNm: this.$comm.getLangSpecInfoLabel('L0000005558') }, // 2차
        { code: 3, codeNm: this.$comm.getLangSpecInfoLabel('L0000005559') }, // 3차
        { code: 4, codeNm: this.$comm.getLangSpecInfoLabel('L0000005560') }, // 4차
        { code: 5, codeNm: this.$comm.getLangSpecInfoLabel('L0000005561') }, // 5차
      ];
      // 방지시설
      this.getPreventionItems();
      // 배출시설
      this.getDischFacItems();

      if (this.popupParam.facilityCd) {
        this.popupParam.eairOutletNo = this.popupParam.facilityCd;
      }

      if (this.popupParam.eairOutletNo > 0) {
        this.outlet.eairOutletNo = this.popupParam.eairOutletNo;
        this.getDetail();
      }
    },
    setPrevGrid() {
      let myThis = this;
      return new Promise((resolve) => {
        this.gridOptions.merge = [];
        this.gridOptions.merge.push({ index: 0, field: 'eairPreventFacNo' });
        this.gridOptions.header = [
          // 방지시설명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
            dataField: 'eairPreventFacNm',
            width: '35%',
            style: 'center-align',
            editable: false,
            cellMerge: true,
          },
          // 차순
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004414'),
            dataField: 'serial',
            width: '10%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.serialItem;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
            },
          },
          // 방지시설명(직렬)
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004415'),
            dataField: 'eairSerialPreventFacNm',
            width: '35%',
            style: 'center-align',
            editable: false,
          },
          // 방지시설추가
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004419'),
            dataField: '',
            width: '10%',
            style: 'center-align',
            editable: false,
            renderer: {
              type: 'ButtonRenderer',
              labelText: '추가',
              onClick: function (rowIndex, columnIndex, value, item) {
                myThis.add(rowIndex);
              },
            },
          },
          // 방지시설삭제
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005775'),
            dataField: '',
            width: '10%',
            style: 'center-align',
            editable: false,
            renderer: {
              type: 'ButtonRenderer',
              labelText: '삭제',
              onClick: function (rowIndex, columnIndex, value, item) {
                myThis.del(rowIndex);
              },
            },
          },
        ];
        this.gridOptions.btns = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004419'), // 방지시설추가
            color: 'orange',
            btnClicked: 'btnPrevClickedCallback',
            visible: this.editable && !this.preventFaxExemFlag,
          },
        ];
        resolve();
      });
    },
    // 검사항목 셋팅
    setTestItem() {
      // 검사기기
      this.$comm.getComboItems('EAIR_INST', false).then((_result) => {
        this.eairInstCdItems = _result;
        // 검사방법
        this.$comm.getComboItems('EAIR_TEST_MTD', false).then((_result) => {
          this.eairTestMtdCdItems = _result;
          // 검사항목 목록 헤더 설정
          this.testitemgridOptions.header = [
            // 검사항목
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000319'),
              dataField: 'eairTestItemNm',
              width: '200',
              style: 'center-align',
              editable: false,
            },
            // 단위
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
              dataField: 'envUnitNm',
              width: '100',
              style: 'center-align',
              editable: false,
            },
            // 배출량계산팩터
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001157'),
              dataField: 'dischAmtCalcFactor',
              width: '140',
              dataType: 'numeric',
              editRenderer: {
                type: 'InputEditRenderer',
                maxlength: 7,
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: false, // 소수점( . ) 도 허용할지 여부
                allowNegative: false, // 마이너스 부호(-) 허용 여부
                textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: false, // 천단위 구분자 삽입 여부
              },
            },
            // 법적기준
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
              dataField: 'legalLimit',
              width: '140',
              dataType: 'numeric',
              editRenderer: {
                type: 'InputEditRenderer',
                maxlength: 7,
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: false, // 소수점( . ) 도 허용할지 여부
                allowNegative: false, // 마이너스 부호(-) 허용 여부
                textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: false, // 천단위 구분자 삽입 여부
              },
            },
            // 자체기준
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002336'),
              dataField: 'selfLimit',
              width: '140',
              dataType: 'numeric',
              editRenderer: {
                type: 'InputEditRenderer',
                maxlength: 7,
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: false, // 소수점( . ) 도 허용할지 여부
                allowNegative: false, // 마이너스 부호(-) 허용 여부
                textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: false, // 천단위 구분자 삽입 여부
              },
            },
            // 일일 배출량기준
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004420'),
              dataField: 'limitPerDay',
              width: '140',
              dataType: 'numeric',
              editRenderer: {
                type: 'InputEditRenderer',
                maxlength: 9,
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: false, // 소수점( . ) 도 허용할지 여부
                allowNegative: false, // 마이너스 부호(-) 허용 여부
                textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: false, // 천단위 구분자 삽입 여부
              },
            },
            // 검사기기
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000309'),
              dataField: 'eairInstCd',
              width: '250',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.eairInstCdItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
              },
            },
            // 검사방법
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000311'),
              dataField: 'eairTestMtdCd',
              width: '250',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.eairTestMtdCdItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
              },
            },
            // 사용여부
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
              dataField: 'useYn',
              width: '100',
              style: 'center-align',
              renderer: {
                type: 'CheckBoxEditRenderer',
                checkValue: 'Y',
                unCheckValue: 'N',
                checkableFunction: function (
                  rowIndex,
                  columnIndex,
                  value,
                  isChecked,
                  item,
                  dataField
                ) {
                  if (value) {
                    return true;
                  }
                },
              },
            },
            // 정렬순서
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
              dataField: 'sortserial',
              width: '120px',
              dataType: 'numeric',
              editRenderer: {
                type: 'InputEditRenderer',
                maxlength: 5,
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: false, // 소수점( . ) 도 허용할지 여부
                allowNegative: false, // 마이너스 부호(-) 허용 여부
                textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: false, // 천단위 구분자 삽입 여부
              },
            },
          ];
        });
      });
    },
    setTestBtn() {
      this.testitemgridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'orange',
          btnClicked: 'btnTestItemClickedCallback',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'), // 삭제
          color: 'red',
          btnClicked: 'btnReject',
          visible: this.testitemgridOptions.data.length > 0 && this.editable,
        },
      ];
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.outlet.eairOutletNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          console.log('111', _result.data);
          this.outlet = this.$_.clone(_result.data);
          console.log('222', this.outlet.eairTestItemCds);
          this.gridOptions.data = this.outlet.outletPreventSerial;
          this.testitemgridOptions.data = this.outlet.eairTestItemCds;
          // this.YAuiGrid2.setGridData(this.outlet.eairTestItemCds);
          console.log('333', this.YAuiGrid2.getGridData());

          // this.setTestBtn();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPreventionItems() {
      this.$http.url = selectConfig.env.air.facility.preventionN.list.url;
      this.$http.type = 'GET';
      this.$http.param = { plantCd: this.outlet.plantCd, useYn: 'Y' };
      this.$http.request(
        (_result) => {
          this.preventionItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDischFacItems() {
      this.$http.url = selectConfig.env.air.facility.dischargeN.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.outlet.plantCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.dischFacItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    beforeSave() {
      let flag = '';

      this.outlet.outletPreventSerial = this.gridOptions.data;

      if (this.outlet.eairOutletNo) {
        // 수정
        flag = 'update';
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.env.air.baseInfo.outlet.edit.url;
      } else {
        // 신규등록
        flag = 'insert';
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.env.air.baseInfo.outlet.insert.url;
      }
      this.check(flag);
    },
    check(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              eairOutletNo: flag === 'insert' ? 0 : this.outlet.eairOutletNo,
              mainDischFacNm: this.outlet.mainDischFacNm,
              plantCd: this.outlet.plantCd,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000302', // '이미 같은 이름의 배출구명이 있습니다.',
                    type: 'warning',
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      if (flag === 'insert') {
                        this.outlet.createUserId = this.$store.getters.token;
                      } else {
                        this.outlet.updateUserId = this.$store.getters.token;
                      }
                      // this.outlet.eairTestItemCds = this.testitemgridOptions.data;
                      this.isSave = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            this.isSave = false;
            this.$popupRequired.check('outletDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      this.outlet.eairOutletNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnPrevClickedCallback() {
      this.openPopup('P');
    },
    btnTestItemClickedCallback() {
      this.openPopup('T');
    },
    openPopup(data) {
      if (data === 'P') {
        this.popupOptions.target = () => import(`${'./createPrevention.vue'}`);
        this.popupOptions.title = 'L0000001107'; // 방지시설
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          plantCd: this.outlet.plantCd,
          mgDeptCd: this.outlet.mgDeptCd,
        };
        this.popupOptions.closeCallback = this.closePreventPopup;
      } else if (data === 'T') {
        this.popupOptions.target = () => import(`${'./testItemPopup.vue'}`);
        this.popupOptions.title = 'L0000000319'; // '검사항목';
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          paramTestItems: this.testitemgridOptions.data,
        };
        this.popupOptions.closeCallback = this.closeTestItemPopup;
      }
    },

    // 방지시설 닫기
    closePreventPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'CLOSE') {
        this.$_.forEach(data.data, (item) => {
          if (
            this.$_.findIndex(this.gridOptions.data, {
              eairPreventFacNo: item.eairPreventFacNo,
            }) === -1
          ) {
            this.gridOptions.data.push({
              eairPreventFacNo: item.eairPreventFacNo,
              eairPreventFacNm: item.eairPreventFacNm,
              serial: 1,
            });
          }
        });
      }
    },
    closeTestItemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.$_.forEach(data.data, (item) => {
          this.testitemgridOptions.data.push({
            eairTestItemNm: item.eairTestItemNm,
            envUnitNm: item.envUnitNm,
            limitPerDay: null,
            dischAmtCalcFactor: null,
            legalLimit: null,
            selfLimit: null,
            eairInstCd: null,
            eairTestMtdCd: null,
            eairTestItemCd: item.eairTestItemCd,
            useYn: item.useYn,
            sortOrder: null,
          });
        });
      }
      this.setTestBtn();
    },
    add(data) {
      if (data) {
        this.popupOptions.target = () => import(`${'./createPrevention.vue'}`);
        this.popupOptions.title = 'L0000001107'; // 방지시설
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          plantCd: this.outlet.plantCd,
          mgDeptCd: this.outlet.mgDeptCd,
          row: data,
        };
        this.popupOptions.closeCallback = this.closeSerialPreventPopup;
      }
    },
    btnFlag(data) {
      if (data.row.eairPreventFacNo === data.row.eairSerialPreventFacNo) {
        return false;
      } else {
        return true;
      }
    },
    closeSerialPreventPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'CLOSE' && data.data) {
        let index =
          this.$_.findIndex(this.gridOptions.data, {
            eairPreventFacNo: data.row.item.eairPreventFacNo,
          }) + 1;

        let forFlag = false;

        this.$_.forEach(data.data, (item) => {
          if (!forFlag) {
            this.$_.forEach(this.gridOptions.data, (_item) => {
              if (
                _item.eairPreventFacNo === data.row.item.eairPreventFacNo &&
                !_item.eairSerialPreventFacNo
              ) {
                _item.eairSerialPreventFacNo = data.row.item.eairPreventFacNo;
                _item.eairSerialPreventFacNm = data.row.item.eairPreventFacNm;

                forFlag = true;
              }
            });
          }
          if (
            this.$_.findIndex(this.gridOptions.data, {
              eairSerialPreventFacNo: item.eairPreventFacNo,
            }) === -1
          ) {
            this.gridOptions.data.splice(index++, 0, {
              eairPreventFacNo: data.row.item.eairPreventFacNo,
              eairPreventFacNm: data.row.item.eairPreventFacNm,
              eairSerialPreventFacNm: item.eairPreventFacNm,
              eairSerialPreventFacNo: item.eairPreventFacNo,
            });
          }
        });
        let tempData = this.$_.filter(this.gridOptions.data, {
          eairPreventFacNo: data.row.item.eairPreventFacNo,
        });

        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.eairPreventFacNo === data.row.item.eairPreventFacNo) {
            item.serial = tempData.length--;
          }
        });
      }
    },
    del(data) {
      if (data) {
        if (data.item.eairPreventFacNo === data.item.eairSerialPreventFacNo) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // '확인',
            message: 'M0000001051', // 해당 관련방지시설이 삭제됩니다. 삭제하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.gridOptions.data = this.$_.clone(
                this.$_.reject(this.gridOptions.data, {
                  eairPreventFacNo: data.item.eairPreventFacNo,
                })
              );
            },
          });
        } else {
          let gridData = this.YAuiGrid1.getGridData();
          gridData = this.$_.reject(gridData, data.item);

          let tempData = this.$_.filter(gridData, {
            eairPreventFacNo: data.item.eairPreventFacNo,
          });

          this.$_.forEach(gridData, (item) => {
            if (item.eairPreventFacNo === data.item.eairPreventFacNo) {
              item.serial = tempData.length--;
            }
          });
          this.gridOptions.data = gridData;
          this.YAuiGrid1.setGridData(gridData);
          this.cellEditEndHandlerPrev();
        }
      }
    },

    btnReject() {
      if (this.YAuiGrid2.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목를 선택하세요.',
          type: 'warning',
        });
      } else {
        let gridData = this.YAuiGrid2.getGridData();
        const selectedRows = this.YAuiGrid2.getCheckedRowItems().map(
          (row) => row.item
        );
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.testitemgridOptions.data = gridData;
        this.YAuiGrid2.setGridData(gridData);
        this.cellEditEndHandlerTest();

        if (this.YAuiGrid2.getRowCount() === 0) {
          this.setTestBtn();
        }
      }
    },

    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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
    cellEditEndHandlerPrev() {
      this.outlet.outletPreventSerial = this.YAuiGrid1.getGridData();
    },
    cellEditEndHandlerTest() {
      this.outlet.eairTestItemCds = this.YAuiGrid2.getGridData();
    },
  },
};
</script>
