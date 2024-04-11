<!--
  목적 : 작업허가서 안전조치사항
  Detail : 작업허가서 안전조치사항 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="!disabled && editable"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004661')"
          :useExcelExport="false"
        />
      </b-col>
    </b-row>

    <b-row v-for="(kind, index) in kinds" :key="String(index)" class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              :label="
                kind.label + ' ' + $comm.getLangSpecInfoLabel('L0000004662')
              "
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              v-for="(type, index2) in kind.types"
              :key="String(index2)"
              :sm="type.sm"
            >
              <y-datepicker
                v-if="type.name === 'period'"
                :width="8"
                type="time"
                :minuteStep="10"
                :range="true"
                :disabled="disabled"
                :editable="editable"
                :label="type.chkItemNm"
                :name="'period_' + String(index2)"
                v-model="type.value"
              >
              </y-datepicker>

              <y-auigrid
                v-else-if="
                  type.name === 'datatable' || type.name === 'datatable_check'
                "
                :ref="'datatable_' + kind.code + '_' + index + '_' + index2"
                :editable="!disabled && editable"
                :headers="setGridHeader(type)"
                :height="setHeight('datatable_' + kind.code)"
                :useExcelExport="false"
                :items="type.value"
                :label="false"
                :useBtn="false"
                @cellEditEnd="
                  cellEditEndHandler(
                    'datatable_' + kind.code + '_' + index + '_' + index2,
                    String(index),
                    String(index2)
                  )
                "
              />
              <el-divider
                v-else-if="type.name === 'divider'"
                content-position="left"
                >{{ type.chkItemNm }}</el-divider
              >
              <y-text
                v-else-if="type.name === 'text'"
                :width="8"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                :label="type.chkItemNm"
                :name="'text_' + String(index2)"
                v-model="type.chkValue1"
              ></y-text>
              <y-datepicker
                v-else-if="type.name === 'time'"
                :width="8"
                type="time"
                :minuteStep="10"
                :disabled="disabled"
                :editable="editable"
                :label="type.chkItemNm"
                :name="'period_' + String(index2)"
                v-model="type.chkValue1"
              ></y-datepicker>
              <y-text
                v-else-if="type.name === 'usersearch'"
                :width="8"
                :disabled="true"
                ui="bootstrap"
                :label="type.chkItemNm"
                :name="'period_' + String(index2)"
                v-model="type.chkUserNm"
                :appendIcon="
                  editable && !disabled
                    ? [
                        { icon: 'times', callbackName: 'clear' },
                        { icon: 'search', callbackName: 'searchUser' },
                      ]
                    : null
                "
                @searchUser="SearchUserClicked(type)"
                @clear="userClear(type)"
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
import searchIcon from '@/assets/images/info.png';

export default {
  /* attributes: name, components, props, data */
  name: 'confirm-inspection-index',
  props: {
    isVendor: {
      type: Boolean,
      default() {
        return false;
      },
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    wkodMaster: {
      type: Object,
      default() {
        return {
          wkodNo: '',
          plantCd: '',
          wkodStepCd: '',
          wkodKindSaves: [],
          wkodCheckResult: [],
        };
      },
    },
    wkodChkItemBase: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      kinds: [],
      type: null,
      row: null,
      editable: true,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '70%',
        top: '10px',
        closeCallback: null,
      },
    };
  },
  watch: {
    'wkodMaster.wkodClsCd': {
      handler: function (val, oldVal) {
        // 허가서 구분 값이 변경된 경우
        this.setGridData(true);
      },
    },
    'wkodMaster.wkodKindSaves': {
      handler: function (val, oldVal) {
        // 보충작업이 변경된 경우

        // 옛날기준으로 현재에 사라진 작업구분에 대하여 base 정보의 값을 삭제시킨다.
        this.$_.forEach(oldVal, (old) => {
          if (this.$_.findIndex(val, { code: old.code }) === -1) {
            let filterTypes = this.$_.filter(this.wkodChkItemBase, {
              wkodKindCd: old.code,
            });
            if (filterTypes && filterTypes.length > 0) {
              this.$_.forEach(filterTypes, (item) => {
                item.chkValue1 = null;
                item.chkValue2 = null;
                item.chkUserId = null;
                item.chkUserNm = null;
              });
            }
          }
        });
        this.setKinds();
      },
      deep: true,
    },
    kinds: {
      handler: function (val, oldVal) {
        this.setWkodCheckResult();
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.setWkodCheckResult();
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

    this.setKinds();
    this.setGridData(false);
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // GridHeader
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'wkodKindNm',
          width: '25%',
        }, // 구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'chkItemNm',
          width: '25%',
        }, // 점검항목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001790'),
          dataField: 'chkValue1',
          width: '25%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: this.editable,
            checkValue: 'Y',
            unCheckValue: 'N',
          },
        }, // 신청
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000221'),
          dataField: 'chkValue2',
          width: '25%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: this.editable,
            checkValue: 'Y',
            unCheckValue: 'N',
          },
        }, // 감독
      ];
    },
    setGridData(isChange) {
      this.gridOptions.data = this.$_.filter(this.wkodChkItemBase, {
        wkodDptyCd: 'WDT03',
      });
      this.gridOptions.data = this.$_.concat(
        this.gridOptions.data,
        this.$_.filter(this.wkodChkItemBase, {
          wkodKindCd: this.wkodMaster.wkodClsCd,
        })
      );
      if (isChange) {
        this.$_.forEach(this.gridOptions.data, (item) => {
          item.chkValue1 = null;
          item.chkValue2 = null;
          item.chkUserId = null;
          item.chkUserNm = null;
        });
      }

      this.YAuiGrid.setGridData(this.gridOptions.data);
    },
    setGridHeader(type) {
      const gridHeader = [];
      gridHeader.push(
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'chkItemNm',
          width: '40%',
          editable: false,
        }, // 점검항목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001790'),
          dataField: 'chkValue1',
          width: '15%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            checkValue: 'Y',
            unCheckValue: 'N',
            editable: this.editable,
            disabledFunction: (
              rowIndex,
              columnIndex,
              value,
              isChecked,
              item,
              dataField
            ) => {
              return this.disabled;
            },
          },
        }, // 신청
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000221'),
          dataField: 'chkValue2',
          width: '15%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            checkValue: 'Y',
            unCheckValue: 'N',
            editable: this.editable,
            disabledFunction: (
              rowIndex,
              columnIndex,
              value,
              isChecked,
              item,
              dataField
            ) => {
              return this.disabled;
            },
          },
        } // 감독
      );

      if (type.name === 'datatable_check') {
        gridHeader.push(
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002572'),
            dataField: 'chkUserNm',
            width: '30%',
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
                this.gridSearchUserClicked(event.item);
              },
            },
          } // 점검자
        );
      }

      return gridHeader;
    },
    setKinds() {
      if (
        !this.wkodMaster.wkodKindSaves ||
        this.wkodMaster.wkodKindSaves.length > 0
      ) {
        let tempKinds = [];
        this.$_.forEach(this.wkodMaster.wkodKindSaves, (item) => {
          let filterTypes = this.$_.filter(this.wkodChkItemBase, {
            wkodKindCd: item.code,
          });
          let types = [];
          this.$_.forEach(filterTypes, (type) => {
            if (
              type.chkTypeCd !== 'datatable' &&
              type.chkTypeCd !== 'datatable_check'
            ) {
              types.push({
                sm: type.chkTypeCd !== 'divider' ? '4' : '12',
                name: type.chkTypeCd,
                chkItemNo: type.chkItemNo,
                chkItemNm: type.chkItemNm,
                chkValue1: type.chkValue1,
                chkValue2: type.chkValue2,
                chkUserId: type.chkUserId,
                chkUserNm: type.chkUserNm,
                value:
                  type.chkTypeCd === 'period' &&
                  type.chkValue1 &&
                  type.chkValue2
                    ? [type.chkValue1, type.chkValue2]
                    : [],
                text: null,
              });
            } else {
              let dataTableIndex = this.$_.findIndex(types, {
                name: 'datatable',
              });
              if (dataTableIndex === -1) {
                dataTableIndex = this.$_.findIndex(types, {
                  name: 'datatable_check',
                });
              }
              if (dataTableIndex === -1) {
                types.push({
                  sm: '12',
                  name: type.chkTypeCd,
                  value: [
                    {
                      chkItemNo: type.chkItemNo,
                      chkItemNm: type.chkItemNm,
                      chkValue1: type.chkValue1,
                      chkValue2: type.chkValue2,
                      chkUserId: type.chkUserId,
                      chkUserNm: type.chkUserNm,
                    },
                  ],
                });
              } else {
                types[dataTableIndex].value.push({
                  chkItemNo: type.chkItemNo,
                  chkItemNm: type.chkItemNm,
                  chkValue1: type.chkValue1,
                  chkValue2: type.chkValue2,
                  chkUserId: type.chkUserId,
                  chkUserNm: type.chkUserNm,
                });
              }
            }
          });
          tempKinds.push({
            label: item.name,
            code: item.code,
            types: types,
          });
        });
        this.kinds = tempKinds;
      } else {
        this.kinds = [];
      }
    },
    gridSearchUserClicked(row) {
      this.row = row;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.wkodMaster.plantCd,
        deptCd: this.$store.getters.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupGridSearchUser;
    },
    closePopupGridSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.row.chkUserNm = data.user.userNm;
        this.row.chkUserId = data.user.userId;
      }
    },
    gridUserClear(row) {
      row.chkUserNm = null;
      row.chkUserId = null;
    },
    SearchUserClicked(type) {
      this.type = type;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.wkodMaster.plantCd,
        deptCd: this.$store.getters.deptCd,
      };
      this.popupOptions.title = 'L0000001466';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.type.chkUserNm = data.user.userNm;
        this.type.chkUserId = data.user.userId;
      }
    },
    userClear(type) {
      type.chkUserNm = null;
      type.chkUserId = null;
    },
    setWkodCheckResult() {
      this.wkodMaster.wkodCheckResult = [];
      if (!this.kinds || this.kinds.length > 0) {
        this.$_.forEach(this.kinds, (kind) => {
          this.$_.forEach(kind.types, (type) => {
            if (
              type.name !== 'period' &&
              type.name !== 'datatable' &&
              type.name !== 'datatable_check'
            ) {
              this.wkodMaster.wkodCheckResult.push({
                wkodNo: 0, // backend에서 삽입
                chkItemNo: type.chkItemNo,
                chkValue1: type.chkValue1,
                chkValue2: type.chkValue2,
                chkUserId: type.chkUserId,
              });
            } else if (type.name === 'period') {
              this.wkodMaster.wkodCheckResult.push({
                wkodNo: 0, // backend에서 삽입
                chkItemNo: type.chkItemNo,
                chkValue1:
                  type.value && type.value.length === 2 ? type.value[0] : null,
                chkValue2:
                  type.value && type.value.length === 2 ? type.value[1] : null,
                chkUserId: type.chkUserId,
              });
            } else {
              this.$_.forEach(type.value, (item) => {
                this.wkodMaster.wkodCheckResult.push({
                  wkodNo: 0, // backend에서 삽입
                  chkItemNo: item.chkItemNo,
                  chkValue1: item.chkValue1,
                  chkValue2: item.chkValue2,
                  chkUserId: item.chkUserId,
                });
              });
            }
          });
        });
      }

      if (!this.gridOptions.data || this.gridOptions.data.length > 0) {
        this.$_.forEach(this.gridOptions.data, (item) => {
          this.wkodMaster.wkodCheckResult.push({
            wkodNo: 0, // backend에서 삽입
            chkItemNo: item.chkItemNo,
            chkValue1: item.chkValue1,
            chkValue2: item.chkValue2,
            chkUserId: item.chkUserId,
          });
        });
      }
    },
    changChkValue1(scope) {},
    setHeight(refName) {},
    cellEditEndHandler(ref, idx, idx2) {
      const [grid] = this.$refs[ref];
      if ((grid || null) !== null) {
        const type = (this.kinds[idx] || []).types[idx2];
        type.value = grid.getGridData();
      }
    },
  },
};
</script>
