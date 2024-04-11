<!--
  목적 : 합동점검 관리 - 합동점검 - 점검자
  Detail : 합동점검 점검자
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 점검팀원 테이블 -->
        <b-row>
          <b-col sm="12">
            <y-auigrid
              ref="yAuiGrid"
              :editable="editable && !disabled"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :items="gridOptions.data"
              label="참여부서 목록"
              :useExcelExport="false"
              :showItemCount="false"
              :showRowCheckColumn="true"
              @cellEditEnd="cellEditEndHandler"
              @btnDeptAdd="btnDeptAdd"
              @btnDeptDelete="btnDeptDelete"
              @btnClickedError="btnClickedErrorCallback"
            />
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col sm="12">
            <y-auigrid
              ref="yAuiGrid2"
              :editable="editable && !disabled"
              :headers="gridOptions2.header"
              :btns="gridOptions2.btns"
              :height="gridOptions2.height"
              :items="gridOptions2.data"
              label="참여업체 목록"
              :useExcelExport="false"
              :showItemCount="false"
              :showRowCheckColumn="true"
              @cellEditEnd="cellEditEndHandler2"
              @btnVendorAdd="btnVendorAdd"
              @btnVendorDelete="btnVendorDelete"
              @btnClickedError="btnClickedErrorCallback"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import searchIcon from '@/assets/images/info.png';

export default {
  /* attributes: name, components, props, data */
  name: 'check-inspector',
  props: {
    checkPlanDetail: {
      type: Object,
      default: {
        safCongChkRsltNo: 0,
        plantCd: '',
        innerTeamData: [],
        outerTeamData: [],
      },
    },
    disabled: false,
  },
  data: () => ({
    YAuiGrid: null,
    gridOptions: {
      // 참여부서
      header: [],
      data: [],
      height: '250',
    },
    YAuiGrid2: null,
    gridOptions2: {
      // 참여업체
      header: [],
      data: [],
      height: '250',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '60%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    editable: false,
    checkSchHourItems: [],
    checkSchMinuteItems: [],
    data: '',
  }),
  computed: {},
  watch: {
    'checkPlanDetail.safCongChkRsltNo': {
      handler: function (val, oldVal) {
        this.getList(); // 점검팀원 리스트 조회
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.checkPlanDetail.innerTeamData = this.gridOptions.data;
      },
      deep: true,
    },
    'gridOptions2.data': {
      handler: function (val, oldVal) {
        this.checkPlanDetail.outerTeamData = this.gridOptions2.data;
      },
      deep: true,
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
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestroy() {},
  activated() {
    this.resizeGrid();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getList(); // 점검팀원 리스트 조회
      this.setHeader();
    },
    setHeader() {
      this.gridOptions.header = [
        {
          headerText: '부서',
          dataField: 'deptNm',
          width: '17%',
          editable: false,
        },
        {
          headerText: '참석자1',
          dataField: 'userNmF',
          width: '17%',
          editable: false,
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 20,
            iconHeight: 20,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (this.editable && !this.disabled) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              this.btnSearchUserClicked1(event);
            },
          },
        }, // 참석자1
        {
          headerText: '서명',
          dataField: 'signImgF',
          width: '16%',
          editable: false,
          renderer: {
            type: 'ImageRenderer',
          },
        },
        {
          headerText: '참석자2',
          dataField: 'userNmS',
          width: '17%',
          editable: false,
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 20,
            iconHeight: 20,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (this.editable && !this.disabled) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              this.btnSearchUserClicked2(event);
            },
          },
        }, // 참석자2
        {
          headerText: '서명',
          dataField: 'signImgS',
          width: '16%',
          editable: false,
          renderer: {
            type: 'ImageRenderer',
          },
        },
        {
          headerText: '비고',
          dataField: 'remark',
          width: '17%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 600,
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: '추가',
          color: 'blue',
          btnClicked: 'btnDeptAdd',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        },
        {
          title: '삭제',
          color: 'red',
          btnClicked: 'btnDeptDelete',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        },
      ];

      this.gridOptions2.header = [
        {
          headerText: '업체명',
          dataField: 'vendorNm',
          width: '14%',
          editable: false,
        },
        {
          headerText: '참석답신여부',
          dataField: 'vendorActCfmYn',
          width: '14%',
          editable: false,
        },
        {
          headerText: '참석여부',
          dataField: 'vendorActYn',
          width: '14%',
          editable: false,
        },
        {
          headerText: '불참사유',
          dataField: 'abseRsn',
          width: '14%',
          style: 'left-align',
          editable: false,
        },
        {
          headerText: '참석자1',
          dataField: 'userNmF',
          width: '15%',
          style: 'left-align',
          editable: this.editable && !this.disabled,
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
        {
          headerText: '참석자2',
          dataField: 'userNmS',
          width: '15%',
          style: 'left-align',
          editable: this.editable && !this.disabled,
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
        {
          headerText: '비고',
          dataField: 'remark',
          width: '14%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 250,
          },
        },
      ];
      this.gridOptions2.btns = [
        {
          title: '추가',
          color: 'blue',
          btnClicked: 'btnVendorAdd',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        },
        {
          title: '삭제',
          color: 'red',
          btnClicked: 'btnVendorDelete',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        },
      ];
    },
    /** 점검팀원 목록 목록 조회 **/
    getList() {
      this.$http.url = this.$format(
        selectConfig.saf.consolPlan.inspector.url,
        this.checkPlanDetail.safCongChkRsltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = [];
          this.gridOptions2.data = [];
          this.$_.forEach(_result.data, (_item) => {
            if (_item.personList && _item.personList.length > 0) {
              // 참석자가 존재할때,
              if (_item.inspClsCd === 'DPT') {
                this.gridOptions.data.push({
                  deptCd: _item.deptCd,
                  deptNm: _item.deptNm,
                  // 참석자1 참석자2 구분하기위해 F = 1, S = 2
                  // 참석자한명만 들어갈수도 있고, 두명이 들어갈수도 있어서(최대2명고정) 인덱스로 구분
                  // 한명도 없을때도 저장이 됨. -> 부서를 가져가야 하기 때문에
                  userIdF: _item.personList ? _item.personList[0].userId : '',
                  userNmF: _item.personList ? _item.personList[0].userNm : '',

                  userIdS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].userId
                      : '',
                  userNmS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].userNm
                      : '',

                  signCfmYnF: _item.personList
                    ? _item.personList[0].signCfmYn
                    : '',
                  signCfmYnS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].signCfmYn
                      : '',

                  signImgF: _item.personList ? _item.personList[0].signImg : '',
                  signImgS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].signImg
                      : '',
                  remark: _item.remark,
                  inspClsCd: 'DPT',
                  safChkInspDeptNo: _item.safChkInspDeptNo,
                });
              } else {
                // 협력업체 모바일 필요(아직은 서명못함.)
                this.gridOptions2.data.push({
                  vendorCd: _item.vendorCd,
                  vendorNm: _item.vendorNm,
                  inspClsCd: 'VDR',
                  userIdF: _item.personList ? _item.personList[0].userId : '',
                  userNmF: _item.personList ? _item.personList[0].userNm : '',

                  userIdS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].userId
                      : '',
                  userNmS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].userNm
                      : '',
                  signCfmYnF: _item.personList
                    ? _item.personList[0].signCfmYn
                    : '',
                  signCfmYnS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].signCfmYn
                      : '',

                  signImgF: _item.personList ? _item.personList[0].signImg : '',
                  signImgS:
                    _item.personList && _item.personList.length === 2
                      ? _item.personList[1].signImg
                      : '',
                  remark: _item.remark,
                  vendorActYn: _item.vendorActYn,
                  vendorActCfmYn: _item.vendorActCfmYn,
                  abseRsn: _item.abseRsn,
                  vendorActCfmDt: _item.vendorActCfmDt,
                  safChkInspDeptNo: _item.safChkInspDeptNo,
                });
              }
            } else {
              // 참석자가 존재하지않을때
              if (_item.inspClsCd === 'DPT') {
                this.gridOptions.data.push({
                  deptCd: _item.deptCd,
                  deptNm: _item.deptNm,
                  inspClsCd: 'DPT',
                  userIdF: '',
                  userNmF: '',
                  userIdS: '',
                  userNmS: '',
                  signCfmYnF: '',
                  signCfmYnS: '',
                  signImgF: '',
                  signImgS: '',
                  remark: _item.remark,
                  safChkInspDeptNo: _item.safChkInspDeptNo,
                });
              } else {
                this.gridOptions2.data.push({
                  vendorCd: _item.vendorCd,
                  vendorNm: _item.vendorNm,
                  inspClsCd: 'VDR',
                  userIdF: '',
                  userNmF: '',
                  userIdS: '',
                  userNmS: '',
                  signCfmYnF: '',
                  signCfmYnS: '',
                  signImgF: '',
                  signImgS: '',
                  remark: _item.remark,
                  vendorActYn: _item.vendorActYn,
                  vendorActCfmYn: _item.vendorActCfmYn,
                  abseRsn: _item.abseRsn,
                  vendorActCfmDt: _item.vendorActCfmDt,
                  safChkInspDeptNo: _item.safChkInspDeptNo,
                });
              }
            }

            console.log(this.gridOptions.data);
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** button 관련 이벤트 **/
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDeptAdd() {
      if (!this.checkPlanDetail.plantCd) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '사업장을 선택하세요.',
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
        this.popupOptions.title = '대상부서 검색';
        this.popupOptions.param = {
          multiple: true,
          plantCd: this.checkPlanDetail.plantCd,
          isSubDeptSelection: true,
        };
        this.popupOptions.width = '35%';
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeDeptPopup;
      }
    },
    btnVendorAdd() {
      if (!this.checkPlanDetail.plantCd) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '사업장을 선택하세요.',
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
        this.popupOptions.title = '협력업체 검색';
        this.popupOptions.param = {
          plantCd: this.checkPlanDetail.plantCd,
          popupMode: true,
          multiSelect: true,
        };
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeVendorPopup;
      }
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.$_.forEach(data, (item) => {
        if (item.deptCd) {
          if (!this.$_.find(this.gridOptions.data, { deptCd: item.deptCd })) {
            let addItem = {
              deptCd: item.deptCd,
              deptNm: item.deptNm,
              userIdF: '',
              userNmF: '',
              userIdS: '',
              userNmS: '',
              remark: '',
              signCfmYnF: '',
              signCfmYnS: '',
              signImgF: '',
              signImgS: '',
              inspClsCd: 'DPT',
              safChkInspDeptNo: 0,
            };
            if (item.plantCd === this.checkPlanDetail.plantCd) {
              this.gridOptions.data.push(addItem);
            }
          }
        }
      });
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.$_.forEach(data.data, (item) => {
        if (item.vendorCd) {
          if (
            !this.$_.find(this.gridOptions2.data, { vendorCd: item.vendorCd })
          ) {
            let addItem = {
              vendorCd: item.vendorCd,
              vendorNm: item.vendorNm,
              inspClsCd: 'VDR',
              userIdF: '',
              userNmF: '',
              userIdS: '',
              userNmS: '',
              signCfmYnF: '',
              signCfmYnS: '',
              signImgF: '',
              signImgS: '',
              remark: '',
              vendorActYn: '',
              vendorActCfmYn: '',
              abseRsn: '',
              vendorActCfmDt: '',
              safChkInspDeptNo: 0,
            };
            this.gridOptions2.data.push(addItem);
          }
        }
      });
    },
    btnDeptDelete() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: '확인',
          message: '하나 이상 선택하세요',
          type: 'warning',
        });
        return;
      }
      let gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(gridData, item);
      });
      this.gridOptions.data = gridData;
    },
    btnSearchUserClicked1(event) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.checkPlanDetail.plantCd,
        deptCd: event.item.deptCd,
      };
      this.popupOptions.selectedRowInfo = event;

      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser1;
    },
    closePopupSearchUser1(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        const rowIndex = this.popupOptions.selectedRowInfo.rowIndex;
        this.gridOptions.data[rowIndex].userIdF = data.user.userId;
        this.gridOptions.data[rowIndex].d = data.user.userNm;
      }
    },
    btnSearchUserClicked2(event) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.checkPlanDetail.plantCd,
        deptCd: event.item.deptCd,
      };
      this.popupOptions.selectedRowInfo = event;

      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser2;
    },
    closePopupSearchUser2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        const rowIndex = this.popupOptions.selectedRowInfo.rowIndex;
        this.gridOptions.data[rowIndex].userIdS = data.user.userId;
        this.gridOptions.data[rowIndex].userNmS = data.user.userNm;
      }
    },
    btnVendorDelete() {
      const selectedRows = this.YAuiGrid2.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: '확인',
          message: '하나 이상 선택하세요',
          type: 'warning',
        });
        return;
      }
      let gridData = this.YAuiGrid2.getGridData();
      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(gridData, item);
      });
      this.gridOptions2.data = gridData;
    },
    /** /기타 function **/
    cellEditEndHandler(event) {
      this.gridOptions.data[event.rowIndex][event.dataField] = event.value;
    },
    cellEditEndHandler2(event) {
      this.gridOptions2.data[event.rowIndex][event.dataField] = event.value;
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
      this.YAuiGrid2.resize(null, this.gridOptions2.height);
    },
  },
};
</script>
