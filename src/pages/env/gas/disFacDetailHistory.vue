<template>
  <b-container fluid>
    <!-- 시설사용변경이력 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000001746')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @delRow="delRow"
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
  /** attributes: name, components, props, data **/
  name: 'y-dis-fac-detail',
  props: {
    ghgFclt: {
      type: Object,
      default: function () {
        return {
          ghgFcltNo: '',
          ghgFcltGrpNo: '',
          disActDataHistoryList: [],
        };
      },
    },
  },
  data: () => ({
    editable: false,
    gridOptions: {
      selectValue: [],
      name: 'disFacDetailHistory',
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
    deleteRows: [],
    isDeleteSubmit: false,
    revdeleteUrl: '',
    YAuiGrid: null,
  }),
  computed: {
    isAdd() {
      return !(this.gridOptions.data.length === 0);
    },
  },
  watch: {
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.ghgFclt.disActDataHistoryList = this.gridOptions.data;
      },
      deep: true,
    },
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
      this.editable = this.$route.meta.editable;
      this.revdeleteUrl =
        transactionConfig.env.gas.dischargeFacility.delete.url;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000294'),
          dataField: 'chgReason',
          width: '20%',
          style: 'left-align',
        } /* 개정사유 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'),
          dataField: 'revisionNo',
          width: '20%',
          style: 'center-align',
        } /* 개정번호 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'ghgFcltNo',
          width: '20%',
          style: 'center-align',
        } /* 주관부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '20%',
          style: 'center-align',
        } /* 등록자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000297'),
          dataField: 'createDt',
          width: '20%',
          style: 'center-align',
        } /* 개정일 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'delRow',
        },
      ];

      this.$comm.getComboItems('GHG_ACT_DATA', false).then((_result) => {
        this.disFacItems = _result;
      });
      this.getList();
    },
    getList() {
      this.$http.url = this.$format(
        selectConfig.env.gas.dischargeFacility.histroys.url,
        this.ghgFclt.ghgFcltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchActDataClicked(row) {
      this.data = row;
      this.popupOptions.target = () => import(`${'./actDataMasterPopup.vue'}`);
      this.popupOptions.width = '80%';
      this.popupOptions.title = 'L0000004493'; // '활동자료 검색';
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.visible = false;
      this.popupOptions.target = null;
      if (data.data) {
        if (
          this.$_.findIndex(this.gridOptions.data, {
            actDataCd: data.data.actDataCd,
          }) === -1
        ) {
          this.data.actDataCd = data.data.actDataCd;
          this.data.actDataNm = data.data.actDataNm;
          this.data.pActDataNm = data.data.pActDataNm;
          this.data.ppActDataNm = data.data.ppActDataNm;
        } else {
          window.getApp.$emit('ALERT', {
            title: 'L0000003321' /* 확인 */,
            message: 'M0000000333' /* 이미 선택한 활동자료입니다. */,
            type: 'warning',
          });
          return;
        }
      }
    },
    addrow() {
      this.gridOptions.data.splice(0, 0, {
        ghgFcltNo: 0,
        chgReason: '',
        historyNo: 0,
        createUserId: '',
        createUserNm: '',
        createDt: '',
      });
    },
    delRow() {
      let selectRowItem = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectRowItem.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000001022' /* 개정이력 목록에서 제외 하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.revdeleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(selectRowItem)),
            };
            this.$http.request(
              (_result) => {
                if (_result.data) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395' /* 안내 */,
                    message:
                      'M0000001024' /* 선택된 개정이력을 목록에서 제외하였습니다. */,
                    type: 'success',
                  });
                  this.getList();
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000001023' /* 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요. */,
          type: 'warning',
        });
        return;
      }
    },
  },
};
</script>
