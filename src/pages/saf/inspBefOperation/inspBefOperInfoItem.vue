<!--
  목적 : 평가계획수립 - 대상노드
  Detail : 평가계획에서 선택된 평가계획별 대상노드 리스트를 조회한다.
  *
  examples:
  *
  -->
<template>
  <div>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row class="mt-3">
          <b-col sm="12">
            <b-row>
              <b-col sm="12">
                <!-- 가동전점검계획 -->
                <y-label
                  label="L0000003985"
                  icon="user-edit"
                  color-class="cutstom-title-color"
                />
                <div slot="buttonGroup" class="float-right mb-1">
                  <!-- 점검유형별 저장 -->
                  <y-btn
                    v-if="editable && !disabled && safCheckTypeCd"
                    title="L0000004086"
                    color="orange"
                    @btnClicked="beforeSubEdit"
                    @btnClickedErrorCallback="btnClickedErrorCallback"
                  />
                </div>
              </b-col>
            </b-row>
            <b-card>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 점검유형 -->
                  <y-select
                    :width="8"
                    :comboItems="comboCheckTypeItems"
                    :required="true"
                    :disabled="disabled || typeDisabled"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    label="L0000004068"
                    name="safCheckTypeCd"
                    v-model="safCheckTypeCd"
                  ></y-select>
                </b-col>
                <!-- 점검수행부서 -->
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <y-tree-dept
                    :required="true"
                    type="search"
                    label="L0000004852"
                    name="pDeptCd"
                    v-model="pDeptCd"
                  />
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 점검일 -->
                  <y-datepicker
                    :width="8"
                    :required="true"
                    :editable="editable && !disabled && !!safCheckTypeCd"
                    true-value="Y"
                    false-value="N"
                    label="L0000002570"
                    ui="bootstrap"
                    name="chkSchYmd"
                    v-model="chkSchYmd"
                  />
                </b-col>
                <!-- 점검수행자 -->
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <y-text
                    :width="8"
                    :editable="editable && !disabled"
                    :disabled="true"
                    :required="true"
                    rowClass
                    ui="bootstrap"
                    label="L0000004853"
                    name="chkUserNm"
                    v-model="chkUserNm"
                    :appendIcon="
                      safCheckTypeCd
                        ? [{ icon: 'search', callbackName: 'searchUser' }]
                        : null
                    "
                    @searchUser="btnSearchUserClicked"
                  />
                </b-col>
              </b-row>
              <!--  "점검설비별 점검항목"  -->
              <b-row>
                <b-col sm="12">
                  <y-auigrid
                    ref="auiGrid"
                    :name="chkItemResultGridOptions.name"
                    :headers="chkItemResultGridOptions.header"
                    :btns="chkItemResultGridOptions.btns"
                    :height="chkItemResultGridOptions.height"
                    :label="this.$comm.getLangSpecInfoLabel('L0000004084')"
                    :useExcelExport="false"
                    :enableSorting="true"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"
                  />
                </b-col>
              </b-row>

              <!-- 점검유형별 설비 목록 -->
              <b-row>
                <b-col sm="12">
                  <y-auigrid
                    ref="yAuiGrid"
                    :name="gridOptions.name"
                    :headers="gridOptions.header"
                    :btns="gridOptions.btns"
                    :height="gridOptions.height"
                    :label="this.$comm.getLangSpecInfoLabel('L0000004338')"
                    :useExcelExport="false"
                    :enableSorting="true"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"
                    :showRowCheckColumn="true"
                    :softRemoveRowMode="false"
                    @openPopup="openPopup"
                    @btnDelRow="btnDelRow"
                  />
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'insp-bef-oper-info-item',
  props: {
    infoItemProps: {
      type: Object,
      default: function () {
        return {
          safCheckTypeCd: '',
          safFacilityCd: '',
          chkUserNm: '',
          chkSchYmd: '',
          plantCd: '',
          pDeptCd: '',
          safFacilChkNo: 0,
          typeInfoList: null,
          forEachFacilityList: [],
        };
      },
    },
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data: () => ({
    editable: false,
    safCheckTypeCd: '',
    safCheckTypeNm: '',
    chkUserId: [],
    chkUserNm: '',
    chkSchYmd: '',
    chkEndYn: 'N',
    pDeptCd: '',
    chkItemResultGridOptions: {
      name: 'inspBefOperInfoItemChkItem',
      header: [],
      data: [],
      selectValue: [],
      height: '250',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '85%',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    gridOptions: {
      name: 'inspBefOperInfoItem',
      btns: [],
      header: [],
      data: [],
      height: '180',
    },
    YAuiGrid: null,
    AuiGrid: null,
    selectValue: [],
    saveUrl: '',
    isSave: false,
    searchUrl: '',
    comboCheckTypeItems: [], // 점검종류
    actionType: 'POST',
    isAll: true,

    typeDisabled: false,
    count: 0,
  }),
  computed: {
    isAdd2() {
      return this.chkItemResultGridOptions.data.length > 0;
    },
    isAdd() {
      return this.gridOptions.data.length > 0;
    },
  },
  watch: {
    safCheckTypeCd: {
      handler: function (newValue, oldValue) {
        if (this.safCheckTypeCd) {
          this.count = 0;
          this.getData();
        }
      },
    },
    infoItemProps: {
      handler: function (newValue, oldValue) {
        if (this.infoItemProps.safCheckTypeCd) {
          this.safCheckTypeCd = this.infoItemProps.safCheckTypeCd;
          this.chkUserNm = this.infoItemProps.chkUserNm;
          this.chkSchYmd = this.infoItemProps.chkSchYmd;
          this.pDeptCd = this.infoItemProps.pDeptCd;
          this.YAuiGrid.setGridData(this.infoItemProps.forEachFacilityList);
          this.gridOptions.data = this.infoItemProps.forEachFacilityList;
          setTimeout(() => {
            this.getData();
          }, 200);
          this.typeDisabled = true;
        } else {
          this.safCheckTypeCd = null;
          this.chkUserNm = '';
          this.chkSchYmd = '';
          this.pDeptCd = '';
          this.chkItemResultGridOptions.data = [];
          this.gridOptions.data = [];
          this.typeDisabled = false;
        }
        this.$comm
          .getComboItems('SAF_PREOPERATION_CHECK', false)
          .then((_result) => {
            if (this.infoItemProps != null && this.infoItemProps.typeInfoList) {
              this.$_.forEach(this.infoItemProps.typeInfoList, (item) => {
                if (item.safCheckTypeCd !== this.safCheckTypeCd) {
                  const findIndex = this.$_.findIndex(_result, {
                    code: item.safCheckTypeCd,
                  });
                  if (findIndex !== -1) {
                    _result.splice(findIndex, 1);
                  }
                }
              });
            }
            this.comboCheckTypeItems = _result;
          });
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.subInsertUrl = transactionConfig.saf.befInspPlan.insert.sub.url;
      this.searchUrl = selectConfig.saf.befInspResult.items.url;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003725'),
          dataField: 'facilityMgrNum',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '20%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '30%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
          dataField: 'deptNm',
          width: '20%',
        },
      ]; // 점검예정일

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ];

      this.$comm
        .getComboItems('SAF_PREOPERATION_CHECK', false)
        .then((_result) => {
          if (this.infoItemProps.typeInfoList) {
            this.$_.forEach(this.infoItemProps.typeInfoList, (item) => {
              const findIndex = this.$_.findIndex(_result, { code: item });
              if (findIndex !== -1) {
                _result.splice(findIndex, 1);
              }
            });
          }
          this.comboCheckTypeItems = _result;
        });

      // 그리드 헤더 설정
      this.chkItemResultGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'safFacilityCheckItemNo',
          width: '100%',
          style: 'left-align',
          renderer: {
            type: 'TemplateRenderer',
          },
          // dataField 로 정의된 필드 값이 HTML 이라면 labelFunction 으로 처리할 필요 없음.
          labelFunction: function (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item
          ) {
            console.log('111', value);
            // console.log('222', item);
          },
        },
      ];
    },
    getData() {
      if (
        this.infoItemProps.safFacilChkNo &&
        this.infoItemProps.safFacilChkNo > 0
      ) {
        this.$http.url = selectConfig.saf.befInspResult.items.url;
        this.$http.type = 'GET';
        this.$http.param = {
          safFacilChkNo: this.infoItemProps.safFacilChkNo,
          plantCd: this.infoItemProps.plantCd,
          safCheckTypeCd: this.safCheckTypeCd,
        };
        this.$http.request(
          (_result) => {
            this.chkItemResultGridOptions.data = _result.data;
            this.AuiGrid.setGridData(_result.data);
            this.chkItemResultGridOptions.data.map((item) => {
              item.checkYn = 'Y';
              return item;
            });
            if (_result.data) {
              if (_result.data.length > 0) {
                this.safCheckTypeNm = _result.data[0].safCheckTypeNm;
              } else {
                this.$http.url = this.$format(
                  selectConfig.codeMaster.get.url,
                  'SAF_PREOPERATION_CHECK',
                  this.safCheckTypeCd
                );
                this.$http.type = 'GET';
                this.$http.request(
                  (_result) => {
                    this.safCheckTypeNm = _result.data.codeNm;
                    this.count++;
                    if (this.count === 1) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message: 'M0000001602', // 등록된 점검항목이 없습니다.
                        type: 'warning', // success / info / warning / error
                      });
                      return;
                    }
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              }
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
      // this.getSubDetail();
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    beforeSubEdit() {
      if (!this.safCheckTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001151', // 점검유형을 선택하세요.
          type: 'warning', // success / info / warning / error
        });
      }

      if (!this.chkSchYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001603', // 점검일을 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (!this.pDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001604', // 점검수행부서를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (!this.chkUserNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001605', // 점검수행자를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000011', // 저장하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.subInsertUrl;
          this.$http.type = 'POST';
          this.$http.param = {
            safCheckTypeCd: this.safCheckTypeCd,
            chkSchYmd: this.chkSchYmd,
            chkUserNm: this.chkUserNm,
            pDeptCd: this.pDeptCd,
            chkEndYn: this.chkEndYn,
            safFacilChkNo: this.infoItemProps.safFacilChkNo,
            forEachFacilList: this.YAuiGrid.getGridData(),
            forEachTypeList: this.chkItemResultGridOptions.data,
            kind: 'plan',
          };
          this.$http.request(
            (_result) => {
              this.btnEditSubClickedCallback();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    promiseSubEdit() {
      return new Promise((resolve, reject) => {
        if (!this.safCheckTypeCd) {
          reject(new Error('noSafCheckTypeCd'));
          return;
        }
        this.$http.url = this.subInsertUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          safCheckTypeCd: this.safCheckTypeCd,
          chkSchYmd: this.chkSchYmd,
          chkUserNm: this.chkUserNm,
          pDeptCd: this.pDeptCd,
          safFacilChkNo: this.infoItemProps.safFacilChkNo,
          forEachFacilList: this.gridOptions.data,
          forEachTypeList: this.chkItemResultGridOptions.data,
          kind: 'plan',
        };
        this.$http.request((_result) => {
          resolve();
        });
      });
    },
    btnEditSubClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.getSubDetail();
    },
    getSubDetail() {
      this.isItems = true;
      this.$http.url = selectConfig.saf.befInspResult.forEachType.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.infoItemProps.safFacilChkNo,
      };

      this.$http.request(
        (_result) => {
          this.typeInfoList = [];
          this.typeInfoList.push({
            safCheckTypeCd: null,
            safFacilChkNo: this.infoItemProps.safFacilChkNo,
          });

          let inspBefItemView = {
            typeInfoList:
              this.$_.clone(_result.data).length > 0
                ? this.$_.clone(_result.data)
                : [
                    {
                      safCheckTypeCd: null,
                      safFacilChkNo: this.infoItemProps.safFacilChkNo,
                    },
                  ],
            safFacilChkNo: this.infoItemProps.safFacilChkNo,
            // safFacilityCd: data.safFacilityCd ? data.safFacilityCd : null,
            plantCd: this.infoItemProps.plantCd,
          };

          this.$emit('editItemCd', {
            safCheckTypeCd: this.safCheckTypeCd,
            safCheckTypeNm: this.safCheckTypeNm,
            inspBefItemView: inspBefItemView,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openPopup() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
      this.popupOptions.title = 'L0000003680';
      // 설비 추가
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.infoItemProps.plantCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      // 데이터의 타입이 배열이 아닌 알 수 없는값으로 표기 될 시에 배열로 초기화
      if (!this.gridOptions.data) this.gridOptions.data = [];

      // let row = {
      //   budgetTypeCd: this.codeMaster.code,
      //   budgetClsCd: null, // 예산구분 코드
      //   budgetActCd: '', // 예산계정코드
      //   budgetActNm: '', // 예산계정명
      //   sortOrder: 0, // 정렬순서
      //   useYn: 'Y', // 사용여부
      // };
      // this.YAuiGrid.addRow(row, 'first');
      this.$_.forEach(data, (facility) => {
        // 점검설비 목록에 선택되어져 온 설비를 바인딩한다.
        let index = this.$_.findIndex(this.YAuiGrid.getGridData(), {
          safFacilityCd: facility.safFacilityCd,
        });
        // 팝업창에서 선택한 값이 기존에 없는 값이라면 점검설비목록에 추가한다.
        if (index === -1) {
          let row = {
            safFacilityTypeNm: facility.safFacilityTypeNm,
            processNms: facility.processNms,
            safFacilityCd: facility.safFacilityCd,
            facilityNm: facility.facilityNm,
            facilityMgrNum: facility.facilityMgrNum,
            deptNm: facility.deptNm,
          };
          this.YAuiGrid.addRow(row, 'last');
          // this.gridOptions.data.splice(0, 0, {
          //   safFacilityTypeNm: facility.safFacilityTypeNm,
          //   processNms: facility.processNms,
          //   safFacilityCd: facility.safFacilityCd,
          //   facilityNm: facility.facilityNm,
          //   facilityMgrNum: facility.facilityMgrNum,
          //   deptNm: facility.deptNm,
          // });
        } else {
          // 기존에 있는 데이터의 경우에는 데이터를 추가하지 않고 그대로 놔둔다.
        }
      });
    },
    btnSearchUserClicked(row) {
      if (!this.editable) return;
      // 선택한 row와 헤더의 명칭을 저장한다.
      this.data = row;

      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.infoItemProps.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let i = 0;
      if (data.users) {
        this.chkUserNm = '';
        this.chkUserId = [];
        this.$_.forEach(data.users, (_item) => {
          if (data.users.length - 1 === i) {
            this.chkUserNm += _item.userNm;
          } else {
            this.chkUserNm += _item.userNm + ', ';
            i++;
          }
          this.chkUserId.push(_item.userId);
        });
      }
    },
    btnDelRow() {
      this.deleteList = [];
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092',
          // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      for (let i = 0; i < removeData.length; i++) {
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }
    },
    btnDeleteFacilityClickedCallback(_result) {
      if (this.selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092',
          // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        this.$_.forEach(this.selectValue, (item) => {
          this.gridOptions.data = this.$_.reject(this.gridOptions.data, {
            safFacilityCd: item.safFacilityCd,
          });
        });
        this.isItems = false;
      }
    },
    allClicked(data) {
      if (data === 'T') {
        this.$_.forEach(this.chkItemResultGridOptions.data, (_item) => {
          _item.checkYn = 'Y';
        });
        this.isAll = false;
      } else if (data === 'F') {
        this.$_.forEach(this.chkItemResultGridOptions.data, (_item) => {
          _item.checkYn = 'N';
        });
        this.isAll = true;
      }
    },
    resizeGrid() {
      let _height = 150;

      this.YAuiGrid.resize(null, _height);
      this.AuiGrid.resize(null, _height + 100);
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
