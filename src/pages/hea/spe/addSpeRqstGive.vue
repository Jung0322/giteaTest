<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 보호구 지급 -->
            <y-label
              label="L0000003999"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && this.speRqst.speStepCd !== 'SPES4'"
                title="L0000002474"
                color="orange"
                @btnClicked="addGiveList"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 지급보호구종류 -->
              <y-text
                :width="baseWidth"
                :disabled="true"
                ui="bootstrap"
                label="L0000002748"
                name="speKindNm"
                v-model="popupParam.speKindNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 지급보호구 -->
              <y-select
                :width="baseWidth"
                :editable="editable"
                :comboItems="popupParam.speList"
                :required="true"
                itemText="speNm"
                itemValue="safSpeNo"
                ui="bootstrap"
                type="search"
                label="L0000004008"
                name="safSpeNo"
                v-model="safSpeNo"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단가 -->
              <y-number
                :width="baseWidth"
                :disabled="true"
                ui="bootstrap"
                label="L0000000865"
                name="unitCost"
                v-model="unitCost"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-text
                :width="baseWidth"
                :disabled="true"
                ui="bootstrap"
                label="L0000000870"
                name="unit"
                v-model="unit"
              ></y-text>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- <div slot="buttonGroup" class="float-right mb-1">
                   추가
                  <y-btn
                    v-if="editable && this.speRqst.speStepCd !== 'SPES4'"
                    title="L0000002892"
                    color="blue"
                    @btnClicked="searchUserClicked"
                  />
                   삭제 
                  <y-btn
                    v-if="editable && this.speRqst.speStepCd !== 'SPES4'"
                    title="L0000001495"
                    color="red"
                    @btnClicked="deleteUserList"
                  />
                </div>
                 보호구 수령인 목록 
                <y-data-table
                  label="L0000004003"
                  ref="dataTable"
                  :height="gridOptions2.height"
                  :headers="gridOptions2.header"
                  :items="gridOptions2.data"
                  :useRownum="false"
                  v-model="selectedValue"
                  :popMode="true"
                >
                  <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
                </y-data-table> -->
              <el-divider content-position="left">{{
                $comm.getLangSpecInfoLabel('L0000004002')
              }}</el-divider>
              <!-- 보호구 수령인 목록 -->
              <y-auigrid
                ref="yAuiGrid"
                :editable="true"
                :name="gridOptions2.name"
                :headers="gridOptions2.header"
                :btns="gridOptions2.btns"
                :height="gridOptions2.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000004003')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :showRowCheckColumn="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                @btnAddClicked="btnAddClicked"
                @btnDeleteClicked="btnDeleteClicked"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'create-spe-rqst',
  props: {
    popupParam: {
      type: Object,
      default: {
        safSpeRqstGiveNo: 0, // 보호구신청및지급번호
        speList: [],
        speKindNm: '',
        speKindCd: '',
        giveCyclCdItems: [],
      },
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      gridOptions2: {
        header: [],
        data: [],
        height: '300',
      },
      gridOptions3: {
        header: [],
        data: [],
        height: '300',
      },
      speRqst: {
        safSpeRqstGiveNo: 0, // 보호구신청및지급번호
        giveYmd: null, // 지급일
        rqstDeptCd: '',
        rqstDeptNm: '',
        rqstUserNm: '',
        rqstRemark: '',
        speKindCd: null, // 보호구종류
        speRqDtlList: [], // 신청목록
        speGiDtlList: [], // 지급목록
        createUserId: '',
        updateUserId: '',
        plantCd: '',
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
      rqstYnNm: '신청지급',
      speKindNm: '', // 지급보호구 종류명
      speKindCd: '', // 지급보호구 종류코드
      safSpeNo: null, // 지급보호구
      // speList: [{ speNm: '선택하세요', safSpeNo: null }], // 지급보호구 목록
      unitCost: '', // 단가
      unit: '', // 단위
      baseWidth: 8,
      editable: false,
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      completeUrl: '',
      isInsert: false,
      isEdit: false,
      isFinish: false,
      insertMode: false,
      updateMode: false,
      selectedValue: [],
      selectedValue2: [],
      giveCyclCdItems: [],

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],

      YAuiGrid: null,
    };
  },
  watch: {
    speKindCd: function (newVal, oldVal) {
      this.getSpeList();
    },
    safSpeNo: function (newVal, oldVal) {
      if (this.safSpeNo) {
        let spe = this.$_.find(this.popupParam.speList, {
          safSpeNo: this.safSpeNo,
        });
        this.unit = spe.giveUnitNm;
        this.unitCost = spe.unitCost;
        if (spe.safSpeNo) {
          this.unitCost = ''; // 단가
          this.getSafSpeData(spe.safSpeNo);
        } else {
          this.unitCost = ''; // 단가
        }
      }
      this.gridOptions2.data = [];
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      //   this.editable = this.$route.meta.editable;
      let userAuthGrps = this.$store.getters.userAuthGrps;
      this.$_.forEach(userAuthGrps, (item) => {
        if (
          (item.authGrpNo === '1036' && item.settingYn === 'Y') ||
          (item.authGrpNo === '1090' && item.settingYn === 'Y') ||
          (item.authGrpNo === '1095' && item.settingYn === 'Y')
        ) {
          this.editable = true;
        }
      });
      this.speRqst.safSpeRqstGiveNo = this.popupParam.safSpeRqstGiveNo;
      // URL 셋팅
      this.searchUrl = selectConfig.saf.speRqstDtl.list.url;
      this.searchSpeKindUrl = selectConfig.saf.spe.kinds.url;
      this.insertUrl = transactionConfig.saf.speRqst.insert.url;
      this.editUrl = transactionConfig.saf.speRqst.edit.url;
      this.completeUrl = transactionConfig.saf.speRqst.complete.url;
      this.deleteUrl = transactionConfig.saf.speRqst.delete.url;
      this.getSpeRqst();
      if (this.popupParam.safSpeRqstGiveNo > 0) {
        this.speRqst.safSpeRqstGiveNo = this.popupParam.safSpeRqstGiveNo;
        this.getSpeRqst();
      } else {
        this.speRqst.plantCd = this.$store.getters.plantCd;
        this.speRqst.rqstUserNm = this.$store.getters.name;
        this.speRqst.rqstDeptCd = this.$store.getters.deptCd;
        this.speRqst.rqstDeptNm = this.$store.getters.deptNm;
        this.speRqst.rqstYmd = this.$comm.getToday();
      }

      // 보호구 지급 추가 그리드 헤더
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004367'),
          dataField: 'deptNm',
          width: '100px',
          align: 'center',
        }, // 부서명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'),
          dataField: 'userId',
          width: '100px',
          align: 'center',
        }, // 사번
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '100px',
          align: 'center',
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002750'),
          dataField: 'giveNum',
          width: '100px',
          type: 'number',
          hasSeperator: true,
          maxlength: 6,
        }, // 지급수량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004007'),
          dataField: 'giveCyclCd',
          width: '100px',
          align: 'center',
          type: 'select',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.popupParam.giveCyclCdItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
            // disabledFunction: () => {
            //   return this.checkDisabled;
            // },
          },
        }, // 지급주기
      ];
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteClicked',
          visible: true,
        },
      ];
    },
    // 보호구 data조회
    getSafSpeData(safSpeNo) {
      this.$http.url = selectConfig.saf.speRqst.getPayList.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safSpeNo: this.safSpeNo,
      };
      this.$http.request(
        (_result) => {
          this.unitCost = this.$_.clone(_result.data.unitCost); // 단가
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 보호구 신청 상세
    getSpeRqst() {
      if (!this.speRqst.safSpeRqstGiveNo) return;
      this.$http.url = this.$format(
        selectConfig.saf.speRqst.get.url,
        this.speRqst.safSpeRqstGiveNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.speRqst = this.$_.clone(_result.data);
          this.gridOptions.data = this.$_.clone(_result.data.speRqDtlList);
          this.gridOptions3.data = this.$_.clone(_result.data.speGiDtlList);
          this.speKindCd = this.gridOptions.data[0].speKindCd;
          this.speKindNm = this.gridOptions.data[0].speKindNm;

          if (!this.speRqst.giveYmd) {
            this.speRqst.giveYmd = this.$comm.getToday();
          }
          if (this.gridOptions3.data.length > 0) {
            this.insertMode = false;
            this.updateMode = true;
          } else {
            this.insertMode = true;
            this.updateMode = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 수령인 검색
    btnAddClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        plantCd: this.speRqst.plantCd,
        multiple: true,
      };
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 수령인 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        this.$_.forEach(data.users, (item) => {
          if (
            !this.$_.find(this.YAuiGrid.getGridData(), { userId: item.userId })
          ) {
            let addItem = {
              deptNm: item.deptNm,
              userId: item.userId,
              userNm: item.userNm,
              giveNum: 0,
              giveCyclCd: 'SPC00',
            };
            this.YAuiGrid.addRow(addItem, 'last');
          }
        });
      }
    },
    // 수령인 삭제
    btnDeleteClicked() {
      let selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      let gridData = this.YAuiGrid.getGridData();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.clone(this.$_.reject(gridData, item));
        });
        this.YAuiGrid.setGridData(gridData);
      }
    },
    addGiveList() {
      if (!this.popupParam.speKindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000781', // 지급보호구 종류를 선택하세요.
          type: 'warning',
        });
        return;
      }
      if (!this.safSpeNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000782', // 지급보호구를 선택하세요.
          type: 'warning',
        });
        return;
      }
      let totGiveNum = 0;
      let gridData2 = this.YAuiGrid.getGridData();
      if (gridData2.length > 0) {
        let giveNumFlag = false;
        this.$_.forEach(gridData2, (item) => {
          totGiveNum += Number(item.giveNum);
          if (!item.giveNum || item.giveNum <= 0) {
            giveNumFlag = true;
          }
        });
        if (giveNumFlag) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000783', // 지급수량을 입력해주세요.
            type: 'warning',
          });
          return;
        }
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000784', // 보호구 수령인을 추가해주세요.
          type: 'warning',
        });
        return;
      }
      if (this.$_.find(this.gridOptions3.data, { safSpeNo: this.safSpeNo })) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: 'M0000000785', // 이미 추가된 지급보호구 입니다. 다른 보호구를 추가해주세요.
          type: 'warning',
        });
        return;
      }
      // 재고량 확인
      this.addGiveList2();
    },
    addGiveList2() {
      let spe = this.$_.find(this.popupParam.speList, {
        safSpeNo: this.safSpeNo,
      });
      let addList = this.$_.clone(this.YAuiGrid.getGridData());
      this.$_.forEach(addList, (item) => {
        if (
          this.$_.findIndex(this.gridOptions3.data, {
            safSpeNo: this.safSpeNo,
            userId: item.userId,
          }) === -1
        ) {
          let giveCycle = this.$_.find(this.popupParam.giveCyclCdItems, {
            code: item.giveCyclCd,
          });
          let addItem = {
            speKindCd: this.popupParam.speKindCd,
            speKindNm: this.popupParam.speKindNm,
            safSpeNo: this.safSpeNo,
            speNm: spe.speNm,
            giveNum: item.giveNum,
            giveUnitNm: this.unit,
            unitCost: this.unitCost,
            userNm: item.userNm,
            userId: item.userId,
            giveCyclCd: item.giveCyclCd,
            giveCyclNm: giveCycle.codeNm,
          };
          this.gridOptions3.data.push(addItem);
        }
      });
      this.$emit('callBack', { gridOptions3: this.gridOptions3.data });
      this.closePopup();
    },
    cellEditEndHandler() {},
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
