<template>
  <b-container fluid>
    <!--<b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!- 행추가 --
            <y-btn
              v-if="isEnable"
              title="L0000003226"
              color="blue"
              :show-loading="false"
              @btnClicked="addrow"
            />
            <-- 행 삭제 --
            <y-btn
              v-if="isAdd && isEnable"
              title="L0000003223"
              color="red"
              :show-loading="false"
              @btnClicked="removeRow"
            />
          </div>
          <-- 배출활동/활동자료 목록 --
          <y-data-table
            label="L0000001190"
            ref="dataTable"
            :useRownum="false"
            :editable="isEnable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridOptions.selectValue"
            :popMode="true"
          >
            !-- 배출활동코드 --
            <el-table-column
              slot="expand"
              :label="ghgOutActCdNm"
              width="150"
              align="center"
              class-name="default-td"
            >
              <template slot-scope="scope">
                <y-select
                  :width="12"
                  :comboItems="disFacItems"
                  :editable="isEnable"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  name="ghgOutActCd"
                  v-model="scope.row.ghgOutActCd"
                ></y-select>
              </template>
            </el-table-column>
            <!- 대분류명 ->
            <el-table-column
              slot="expand"
              :label="ppActDataNm"
              width="100"
              align="center"
              class-name="default-td"
            >
              <template slot-scope="scope">
                <span
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  {{ scope.row.ppActDataNm }}
                </span>
              </template>
            </el-table-column>
            <!- 중분류명 --
            <el-table-column
              slot="expand"
              :label="pActDataNm"
              width="100"
              align="center"
              class-name="default-td"
            >
              <template slot-scope="scope">
                <span
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  {{ scope.row.pActDataNm }}
                </span>
              </template>
            </el-table-column>
            <!- 활동자료코드 --
            <el-table-column
              slot="expand"
              :label="ghgActDaCd"
              width="100"
              align="center"
              class-name="default-td"
            >
              <template slot-scope="scope">
                <span
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  {{ scope.row.ghgActDaCd }}
                </span>
              </template>
            </el-table-column>
            <-- 활동자료명 --
            <el-table-column
              slot="expand"
              :label="actDataNm"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <y-text
                  :width="12"
                  :editable="isEnable"
                  :useRownum="false"
                  readonly="true"
                  ui="bootstrap"
                  placeholder="선택하세요"
                  v-model="scope.row.actDataNm"
                  :appendIcon="[
                    { icon: 'search', callbackName: 'searchActData' },
                  ]"
                  @searchActData="btnSearchActDataClicked(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              type="selection"
              slot="selection"
              width="55"
            />
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>-->
    <!-- 배출활동/활동자료 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000001190')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @cellEditEnd="cellEditEndHandler"
          @addrow="addrow"
          @removeRow="removeRow"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import searchIcon from '@/assets/images/info.png';
import transactionConfig from '@/js/transactionConfig';
import { v4 as uuidv4 } from 'uuid';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-dis-act-data',
  props: {
    ghgFclt: {
      type: Object,
      default: function () {
        return {
          ghgFcltNo: '',
          disActDataList: [],
        };
      },
    },
    isEnable: false,
  },
  data() {
    return {
      editable: false,
      gridOptions: {
        selectValue: [],
        name: 'disActData',
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      disFacItems: [],
      dataItems: [],
      ghgOutActCdNm: '',
      ppActDataNm: '',
      pActDataNm: '',
      ghgActDaCd: '',
      actDataNm: '',

      isAdd: false,
      isAll: false,
      YAuiGrid: null,
    };
  },
  computed: {},
  watch: {
    'ghgFclt.ghgFcltNo': {
      handler: function (newValue, oldValue) {
        this.getList();
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      console.log(this.isEnable);
      this.editable = this.$route.meta.editable;
      this.$comm.getComboItems('DATA_LINK', false).then((_result) => {
        this.dataItems = _result;
        this.setGridHeader();
      });
      this.setGridBtn();

      this.$comm.getComboItems('GHG_ACT_DATA', false).then((_result) => {
        this.disFacItems = _result;
      });

      this.getList();
    },
    setGridHeader() {
      this.gridOptions.header = [
        {
          /* 배출활동코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001194'),
          dataField: 'ghgOutActCd',
          width: '13%',
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
          width: '13%',
          style: 'center-align',
          editable: false,
        },
        {
          /* 중분류명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002731'),
          dataField: 'pActDataNm',
          width: '13%',
          style: 'center-align',
          editable: false,
        },
        {
          /* 활동자료코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003353'),
          dataField: 'ghgActDaCd',
          width: '12%',
          style: 'center-align',
          editable: false,
        },
        {
          /* 활동자료명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003350'),
          dataField: 'actDataNm',
          width: '13%',
          style: 'center-align',
          editable: false,
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 20,
            iconHeight: 20,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (this.editable) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              this.btnSearchActDataClicked(event);
            },
          },
        },
        {
          /* 활동자료명(자체) */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003352'),
          dataField: 'actDaNm',
          width: '12%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
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
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
      ];
    },
    setGridBtn() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'), // 행추가
          color: 'blue',
          btnClicked: 'addrow',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'), // 행 삭제
          color: 'red',
          btnClicked: 'removeRow',
          visible: this.isAdd,
        },
      ];
    },
    getList() {
      this.$http.url = this.$format(
        selectConfig.env.gas.dischargeFacility.dataItems.url,
        this.ghgFclt.ghgFcltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          if (this.gridOptions.data.length > 0) {
            this.isAdd = true;
            this.setGridBtn();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    addrow() {
      this.gridOptions.data.splice(0, 0, {
        ghgActDaCd: null,
        ghgOutActCd: null,
        pActDataCd: '',
        ppActDataCd: '',
        actDataNm: '',
        actDaNm: '',
        daIfCd: null,
        ifTagCd: '',
      });
      this.isAdd = true;
      this.setGridBtn();
    },
    removeRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000068' /* 하나 이상 선택하세요 */,
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        let gridData = this.YAuiGrid.getGridData();
        const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
          (row) => row.item
        );
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.gridOptions.data = gridData;
        this.YAuiGrid.setGridData(gridData);

        if (this.YAuiGrid.getRowCount() === 0) {
          this.isAdd = false;
          this.setGridBtn();
        }
      }
    },
    btnSearchActDataClicked(row) {
      this.data = row;
      this.popupOptions.target = () => import(`${'./actDataMasterPopup.vue'}`);
      this.popupOptions.width = '80%';
      this.popupOptions.title = 'L0000004493'; /* 활동자료검색 */
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    cellEditEndHandler() {
      this.ghgFclt.disActDataList = this.YAuiGrid.getGridData();
    },
    closePopup(data) {
      this.popupOptions.visible = false;
      this.popupOptions.target = null;
      const gridData = this.YAuiGrid.getGridData();
      if (data.data) {
        if (
          this.$_.findIndex(gridData, {
            ghgActDaCd: data.data.actDataCd,
          }) === -1
        ) {
          this.gridOptions.data[this.data.rowIndex].ghgActDaCd =
            data.data.actDataCd;
          this.gridOptions.data[this.data.rowIndex].actDataNm =
            data.data.actDataNm;
          this.gridOptions.data[this.data.rowIndex].pActDataNm =
            data.data.pActDataNm;
          this.gridOptions.data[this.data.rowIndex].ppActDataNm =
            data.data.ppActDataNm;
          this.cellEditEndHandler();
        } else {
          window.getApp.$emit('ALERT', {
            title: 'L0000003321' /* 확인 */,
            message: 'M0000000333' /* 이미 선택한 활동자료입니다 */,
            type: 'warning',
          });
          return;
        }
      }
    },
  },
};
</script>
