<!--
  목적 : 등록/접수/조치결과 - 피해내역
  Detail : 피해내역
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col
            v-if="!ourCompanyShow && !partnersShow"
            sm="12"
            md="12"
            lg="12"
            xl="12"
            class="col-xxl-12 mb-2"
          >
            <el-tag size="medium" type="danger">
              <i class="el-icon-warning"></i>
              <!-- 사고구분을 선택하시면 사고자 정보를 기입할 수 있습니다. -->
              {{ $comm.getLangSpecInfoLabel('L0000001387') }}
            </el-tag>
          </b-col>
          <b-col sm="6">
            <!-- 상해자(당사) 테이블 -->
            <b-row>
              <b-col sm="12">
                <y-auigrid
                  ref="yOurCompanyGrid"
                  :editable="!disabled && editable"
                  :headers="gridOurCompanyOptions.header"
                  :btns="gridOurCompanyOptions.btns"
                  :height="gridOurCompanyOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000001542')"
                  :useExcelExport="false"
                  :showRowCheckColumn="!disabled && editable"
                  :rowHeight="60"
                  @cellEditEnd="cellEditEndHandler"
                  @btnOurCompanyAdd="btnOurCompanyAdd"
                  @btnOurCompanyDelete="btnOurCompanyDelete"
                  @btnClickedError="btnClickedErrorCallback"
                />
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="6">
            <!-- 상해자(협력업체) 테이블 -->
            <b-row>
              <b-col sm="12">
                <y-auigrid
                  ref="yPartnersyGrid"
                  :editable="!disabled && editable"
                  :headers="gridPartnersOptions.header"
                  :btns="gridPartnersOptions.btns"
                  :height="gridPartnersOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000001543')"
                  :useExcelExport="false"
                  :showRowCheckColumn="!disabled && editable"
                  :rowHeight="60"
                  @cellEditEnd="cellEditEndHandler2"
                  @btnPartnersAdd="btnPartnersAdd"
                  @btnPartnersDelete="btnPartnersDelete"
                  @btnClickedError="btnClickedErrorCallback"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-accident-person-damage',
  props: {
    disabled: false,
    tempAccKindCds: {
      type: Array,
    },
    accidentDetail: {
      type: Object,
      default: {
        safAccidentNo: 0,

        outCompanyData: [], // 상해자(당사)
        partenersData: [], // 상해자(협력업체)

        accidentStepCd: '',
        plantCd: '',
        deptCd: '',
      },
    },
  },
  data: () => ({
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '60%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    YOurCompanyGrid: null,
    gridOurCompanyOptions: {
      // 상해자(당사)
      header: [],
      data: [],
      height: '400',
    },
    ourCompanyShow: false,
    YPartnersGrid: null,
    gridPartnersOptions: {
      // 상해자(협렵업체)
      header: [],
      data: [],
      height: '400',
    },
    partnersShow: false,
    openUserFlag: '',
    searchVictimUrl: '', // 사내사고 피해자정보 검색 url
    comboDamageLevlItems: [], // 상해구분
    comboHumanInjuryPartlItems: [], // 상해부위
    comboHumanInjuryClslItems: [], // 상해종류
    editable: true,
    tmpIdx: 0,
  }),
  watch: {
    tempAccKindCds: {
      handler: function (val, oldVal) {
        this.setVisible();
      },
      deep: true,
    },
    'accidentDetail.safAccidentNo': {
      handler: function (val, oldVal) {
        this.getVictimList('VICT1'); // 사내사고 피해자정보(당사)
        this.getVictimList('VICT2'); // 사내사고 피해자정보(협력업체)
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.YOurCompanyGrid = this.$refs.yOurCompanyGrid;
    this.YPartnersGrid = this.$refs.yPartnersyGrid;
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    // tableCellClassName({ row, column, rowIndex, colIndex }) {
    //   if (
    //     column.property === 'humanInjuryClsCds' ||
    //     column.property === 'humanInjuryPartCds'
    //   ) {
    //     return 'fontSize';
    //   }
    // },
    // tableCellClassName2({ row, column, rowIndex, colIndex }) {
    //   if (
    //     column.property === 'humanInjuryClsCds' ||
    //     column.property === 'humanInjuryPartCds'
    //   ) {
    //     return 'fontSize';
    //   }
    // },
    init() {
      // Url Setting
      this.searchVictimUrl = selectConfig.saf.accidentVictim.list.url; // 사내사고 피해자정보 검색 url

      const promise1 = this.$comm.getComboItems('SAF_DAMAGE_LVL', false); // 사고피해레벨
      const promise2 = this.$comm.getComboItems('SAF_ACCIDENT_DP_CLS'); // 상해부위
      const promise3 = this.$comm.getComboItems('SAF_ACCIDENT_DMG_CLS'); // 상해종류

      this.setVisible();
      Promise.all([promise1, promise2, promise3]).then((values) => {
        let [damageLvl = null, accidentDp = null, accidentDmg = null] = values;
        damageLvl = damageLvl.map(item => {
          item.code = item.code === null ? '' : item.code;
          return item;
        });
        this.comboDamageLevlItems = this.$_.cloneDeep(damageLvl);
        this.comboHumanInjuryPartlItems = this.$_.cloneDeep(accidentDp);
        this.comboHumanInjuryClslItems = this.$_.cloneDeep(accidentDmg);

        this.setGridInit();

        this.getVictimList('VICT1'); // 사내사고 피해자정보(당사)
        this.getVictimList('VICT2'); // 사내사고 피해자정보(협력업체)
      });
    },
    setGridInit() {
      // 상해자(당사) 그리드
      this.gridOurCompanyOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
          dataField: 'damageLvlCd', 
          width: '140', 
          renderer: { 
            type: 'DropDownListRenderer',
            list: this.comboDamageLevlItems, 
            keyField: 'code', 
            valueField: 'codeNm', 
            disabledFunction: () => {
              return this.disabled || !this.editable;
            }
          }, 
        }, // 구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001541'), 
          dataField: 'humanInjuryPartCds', 
          width: '250',
          style: 'left-align',
          renderer: {
            type: "TemplateRenderer"
          },
          labelFunction: (rowIndex, columnIndex, values, headerText, item) => { 
            const name = "companyPartCd_" + (item.safAccidentVictimNo || 'id_' + item.id);
            console.log(values)
            // if (values.length > 0) {
            //   values.forEach((value, idx) => {
            //     if (typeof value._$uid !== undefined) {
            //       delete value._$uid;
            //       values[idx] = Object.values(value).join("");
            //     }
            //   })
            // }

            const selectedList = document.querySelectorAll('input[name="' + name + '"]:checked');
            if (selectedList.length > 0) {
              values = Array.from(selectedList).map(items => items.value);
              item.humanInjuryPartCds = values;
              this.cellEditEndHandler();
            } 

            let template = '<div> ';
            if ((this.comboHumanInjuryPartlItems || null) !== null) {
              this.comboHumanInjuryPartlItems.forEach((row, idx) => {
                let checkedTag = '';
                let disabledTab = '';
                if (values.includes(row.code)) checkedTag = " checked='checked'";
                if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";

                const id = name + "_" + row.code;
                template += " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
                template += " <input type='checkbox' class='custom-control-input' id='" + id + "' name='" + name + "' value='" + row.code + "'" + checkedTag + disabledTab + ">";
                template += "<label for='" + id + "' class='custom-control-label'>" + row.codeNm + " </label>";
                template += " </input>";
                template += " </div> ";

                if (idx > 0 && Number(idx % 3) === 0) template += " <br/> "
              });
            }
            template += ' </div>';
            return template;
          }
        }, // 상해부위 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001544'), 
          dataField: 'humanInjuryClsCds', 
          width: '200', 
          style: 'left-align',
          renderer: {
            type: "TemplateRenderer"
          },
          labelFunction: (rowIndex, columnIndex, values, headerText, item) => { 
            const name = "clsCd_" + (item.safAccidentVictimNo || 'id_' + item.id);

            if (values.length > 0) {
              values.forEach((value, idx) => {
                if (typeof value._$uid !== undefined) {
                  delete value._$uid;
                  values[idx] = Object.values(value).join("");
                }
              })
            }

            const selectedList = document.querySelectorAll('input[name="' + name + '"]:checked');
            if (selectedList.length > 0) {
              values = Array.from(selectedList).map(items => items.value);
              item.humanInjuryClsCds = values;
              this.cellEditEndHandler();
            } 

            let template = '<div> ';
            if ((this.comboHumanInjuryClslItems || null) !== null) {
              this.comboHumanInjuryClslItems.forEach((row, idx) => {
                let checkedTag = '';
                let disabledTab = '';
                if (values.includes(row.code)) checkedTag = " checked='checked'";
                if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";

                const id = name + "_" + row.code;
                template += " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
                template += " <input type='checkbox' class='custom-control-input' id='" + id + "' name='" + name + "' value='" + row.code + "'" + checkedTag + disabledTab + ">";
                template += "<label for='" + id + "' class='custom-control-label'>" + row.codeNm + " </label>";
                template += " </input>";
                template += " </div> ";
              });
            }
            template += ' </div>';
            return template;
          }
        }, // 상해종류 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'victimDeptNm', 
          editable: false,
          width: '120', 
        }, // 부서 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'victimNm', 
          editable: false,
          width: '120', 
        }, // 성명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'), 
          dataField: 'victimUserId', 
          editable: false,
          width: '120', 
        }, // 사번 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002293'), 
          dataField: 'entDt', 
          editable: false,
          width: '120', 
        }, // 입사일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'), 
          dataField: 'victimBirthday', 
          editable: false,
          width: '120', 
        }, // 생년월일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000802'), 
          dataField: 'years', 
          editable: false,
          width: '120', 
        }, // 나이 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002768'), 
          dataField: 'position', 
          editable: false,
          width: '120', 
        }, // 직급 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'), 
          dataField: 'victimDutyNm', 
          editable: false,
          width: '120', 
        }, // 직책 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000458'), 
          dataField: 'workHis', 
          width: '250', 
          style: 'left-align',
          editable: !this.disabled && this.editable,
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 경력 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002513'), 
          dataField: 'jobHis', 
          width: '250', 
          style: 'left-align',
          editable: !this.disabled && this.editable,
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 전업무직무경력 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001400'), 
          dataField: 'accidentHis', 
          width: '250', 
          style: 'left-align',
          editable: !this.disabled && this.editable,
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 사고이력 

      ];
      this.gridOurCompanyOptions.btns = [];
      if (this.ourCompanyShow) {
        this.gridOurCompanyOptions.btns = [
          { 
            title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
            color: 'blue', 
            btnClicked: 'btnOurCompanyAdd',
            btnClickedError: 'btnClickedError',
            visible: !this.disabled && this.editable,
          },  // 추가
          { 
            title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
            color: 'red', 
            btnClicked: 'btnOurCompanyDelete',
            btnClickedError: 'btnClickedError',
            visible: !this.disabled && this.editable,
          },  // 삭제
        ];
      }
      this.YOurCompanyGrid.setBtnArr(this.gridOurCompanyOptions.btns);

      this.gridPartnersOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
          dataField: 'damageLvlCd', 
          width: '140', 
          renderer: { 
            type: 'DropDownListRenderer',
            list: this.comboDamageLevlItems, 
            keyField: 'code', 
            valueField: 'codeNm', 
            disabledFunction: () => {
              return this.disabled || !this.editable;
            }
          }, 
        }, // 구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001541'), 
          dataField: 'humanInjuryPartCds', 
          width: '250',
          style: 'left-align',
          renderer: {
            type: "TemplateRenderer"
          },
          labelFunction: (rowIndex, columnIndex, values, headerText, item) => { 
            const name = "partnersPartCd_" + (item.safAccidentVictimNo || 'id_' + item.id);
            if (values.length > 0) {
              values.forEach((value, idx) => {
                if (typeof value._$uid !== undefined) {
                  delete value._$uid;
                  values[idx] = Object.values(value).join("");
                }
              })
            }
              
            const selectedList = document.querySelectorAll('input[name="' + name + '"]:checked');
            if (selectedList.length > 0) {
              values = Array.from(selectedList).map(items => items.value);
              item.humanInjuryPartCds = values;
              this.cellEditEndHandler2();
            }

            let template = '<div> ';
            if ((this.comboHumanInjuryPartlItems || null) !== null) {
              this.comboHumanInjuryPartlItems.forEach((row, idx) => {
                let checkedTag = '';
                let disabledTab = '';
                if (values.includes(row.code)) checkedTag = " checked='checked'";
                if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";

                const id = name + "_" + row.code;
                template += " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
                template += " <input type='checkbox' class='custom-control-input' id='" + id + "' name='" + name + "' value='" + row.code + "'" + checkedTag + disabledTab + ">";
                template += "<label for='" + id + "' class='custom-control-label'>" + row.codeNm + " </label>";
                template += " </input>";
                template += " </div> ";

                if (idx > 0 && Number(idx % 3) === 0) template += " <br/> "
              });
            }
            template += ' </div>';
            return template;
          }
        }, // 상해부위 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001544'), 
          dataField: 'humanInjuryClsCds', 
          width: '200', 
          style: 'left-align',
          renderer: {
            type: "TemplateRenderer"
          },
          labelFunction: (rowIndex, columnIndex, values, headerText, item) => { 
            const name = "partnersClsCd_" + (item.safAccidentVictimNo || 'id_' + item.id);
            if (values.length > 0) {
              values.forEach((value, idx) => {
                if (typeof value._$uid !== undefined) {
                  delete value._$uid;
                  values[idx] = Object.values(value).join("");
                }
              })
            }

            const selectedList = document.querySelectorAll('input[name="' + name + '"]:checked');
            if (selectedList.length > 0) {
              values = Array.from(selectedList).map(items => items.value);
              item.humanInjuryClsCds = values;
              this.cellEditEndHandler2();
            } 

            let template = '<div> ';
            if ((this.comboHumanInjuryClslItems || null) !== null) {
              this.comboHumanInjuryClslItems.forEach((row, idx) => {
                let checkedTag = '';
                let disabledTab = '';
                if (values.includes(row.code)) checkedTag = " checked='checked'";
                if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";

                const id = name + "_" + row.code;
                template += " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
                template += " <input type='checkbox' class='custom-control-input' id='" + id + "' name='" + name + "' value='" + row.code + "'" + checkedTag + disabledTab + ">";
                template += "<label for='" + id + "' class='custom-control-label'>" + row.codeNm + " </label>";
                template += " </input>";
                template += " </div> ";

                if (idx > 0 && Number(idx % 3) === 0) template += " <br/> "
              });
            }
            template += ' </div>';
            return template;
          }
        }, // 상해종류 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'), 
          dataField: 'victimDeptNm', 
          width: '150', 
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer', 
          }, 
        }, // 소속 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'victimNm', 
          width: '120',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          }, 
        }, // 성명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'), 
          dataField: 'victimBirthday', 
          width: '150', 
          editRenderer: { 
            type: 'CalendarRenderer', 
            onlyCalendar: true, 
            defaultFormat: 'yyyy-mm-dd', 
          },
        }, // 생년월일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000802'), 
          dataField: 'years', 
          width: '120', 
          editable: false,
        }, // 나이 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002768'), 
          dataField: 'position', 
          width: '120', 
          editRenderer: {
            type: 'InputEditRenderer', 
          },
        }, // 직급 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'), 
          dataField: 'victimDutyNm', 
          width: '120', 
          editRenderer: {
            type: 'InputEditRenderer', 
            //  maxlength: ,
          }, 

        }, // 직책 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000458'), 
          dataField: 'workHis', 
          width: '250', 
          editRenderer: {
            type: 'InputEditRenderer', 
            //  maxlength: ,
          }, 

        }, // 경력 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002513'), 
          dataField: 'jobHis', 
          width: '250', 
          editRenderer: {
            type: 'InputEditRenderer', 
            //  maxlength: ,
          }, 

        }, // 전업무직무경력 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001400'), 
          dataField: 'accidentHis', 
          width: '250', 
          editRenderer: {
            type: 'InputEditRenderer', 
            //  maxlength: ,
          }, 

        }, // 사고이력 

      ];
      this.gridPartnersOptions.btns = [];
      if (this.partnersShow) {
        this.gridPartnersOptions.btns = [
          { 
            title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
            color: 'blue', 
            btnClicked: 'btnPartnersAdd',
            btnClickedError: 'btnClickedError',
            visible: !this.disabled && this.editable,
          },  //  추가
          { 
            title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
            color: 'red', 
            btnClicked: 'btnPartnersDelete',
            btnClickedError: 'btnClickedError',
            visible: !this.disabled && this.editable,
          },  //  삭제
        ]; 
      }
      this.YPartnersGrid.setBtnArr(this.gridPartnersOptions.btns);
    },
    setVisible() {
      if (this.$_.findIndex(this.tempAccKindCds, { code: 'ACKD1' }) > -1) {
        // 사고구분 중 임직원이 있는 경우
        this.ourCompanyShow = true;
      } else {
        this.ourCompanyShow = false;
        this.accidentDetail.outCompanyData = [];
        this.YOurCompanyGrid.clearGridData();
      }

      if (
        this.$_.findIndex(this.tempAccKindCds, { code: 'ACKD2' }) > -1 ||
        this.$_.findIndex(this.tempAccKindCds, { code: 'ACKD3' }) > -1
      ) {
        // 사고구분 중 협력/외주사 또는 방문객/직원가족이 있는 경우
        this.partnersShow = true;
      } else {
        this.partnersShow = false;
        this.accidentDetail.partenersData = [];
        this.YPartnersGrid.clearGridData();
      }
    },
    /** 사고피해자 조회 **/
    getVictimList(victimTypeCd) {
      if (
        !this.accidentDetail.safAccidentNo ||
        this.accidentDetail.safAccidentNo === 0
      ) {
        return;
      }
      this.$http.url = this.searchVictimUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safAccidentNo: this.accidentDetail.safAccidentNo,
        victimTypeCd: victimTypeCd,
      };
      this.$http.request(
        (_result) => {
          if (victimTypeCd === 'VICT1') {
            this.YOurCompanyGrid.setGridData(_result.data);
            this.accidentDetail.outCompanyData = _result.data;
          } else if (victimTypeCd === 'VICT2') {
            this.gridPartnersOptions.data = this.$_.clone(_result.data);
            this.changePartnersData(_result.data);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    changePartnersData(gridData) {
      this.$_.forEach(gridData, (item) => {
        if (item.victimBirthday) {
          item.years = this.$comm
            .moment()
            .diff(
              this.$comm
                .moment(item.victimBirthday, 'YYYY-MM-DD')
                .format('YYYY-MM-DD'),
              'years'
            );
        }
      });
      this.YPartnersGrid.setGridData(gridData);
      this.accidentDetail.partenersData = gridData;
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
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        if (this.openUserFlag === 'OURCOMPANY') {
          const gridData = this.YOurCompanyGrid.getGridData();
          this.$_.forEach(data.users, (user) => {
            if (this.$_.indexOf(this.$_.map(gridData, 'victimUserId'), user.userId) > -1) {
              return;
            } else {
              const addNewData = {
                id: (this.tmpIdx++),
                damageLvlCd: '',
                victimUserId: user.userId,
                victimNm: user.userNm,
                victimDeptCd: user.deptCd,
                victimDeptNm: user.deptNm,
                comSexTypeCd: user.comSexTypeCd,
                comSexTypeNm: user.comSexTypeNm,
                entDt: user.entryYmd,
                victimBirthday: user.birthYmd,
                years: this.$comm.moment().diff(this.$comm.moment(user.birthYmd, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'years'),
                position: user.positionNm,
                victimDutyNm: user.dutyNm,
                humanInjuryPartCds: [],
                humanInjuryClsCds: [],
                victimTypeCd: 'VICT1',
              };
              this.YOurCompanyGrid.addRow(addNewData);
            }
          });

          this.accidentDetail.outCompanyData = this.YOurCompanyGrid.getGridData();
        }

        this.openUserFlag = '';
      }
    },
    openUserPopup() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.accidentDetail.plantCd,
        deptCd: this.accidentDetail.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },

    cellEditEndHandler() {
      this.accidentDetail.outCompanyData = this.YOurCompanyGrid.getGridData();
    },
    cellEditEndHandler2() {
      this.accidentDetail.partenersData = this.YPartnersGrid.getGridData();
    },
    /** button 관련 이벤트 **/
    /**
     * 상해자(당사) 행 추가
     */
    btnOurCompanyAdd() {
      this.openUserFlag = 'OURCOMPANY';
      this.openUserPopup();
    },
    /**
     * 상해자(협렵업체) 행 추가
     */
    btnPartnersAdd() {
      // this.popupOptions.target = () => import(`${'@/pages/manage/user/userSearch.vue'}`); // 이유는 모르겠으나 이거를 하지 않으면 추가가 이루어지지않음..

      const addData = {
        id: (this.tmpIdx++),
        damageLvlCd: null,
        victimUserId: '',
        victimNm: '',
        victimDeptCd: '',
        victimDeptNm: '',
        comSexTypeCd: '',
        comSexTypeNm: '',
        victimBirthday: '',
        years: '',
        position: '',
        victimDutyNm: '',
        humanInjuryPartCds: [],
        humanInjuryClsCds: [],
        victimTypeCd: 'VICT2',
      };

      this.YPartnersGrid.addRow(addData);
      this.accidentDetail.partenersData.push(addData);
    },
    /**
     * 상해자(당사) 행 삭제
     */
    btnOurCompanyDelete() {
      let gridData = this.YOurCompanyGrid.getGridData();
      const selectedRowItems = this.YOurCompanyGrid.getCheckedRowItemsAll();
      if (gridData.length > 0 && selectedRowItems.length > 0) {
        this.$_.forEach(selectedRowItems, item => {
          gridData = this.$_.reject(gridData, item);
        });

        this.YOurCompanyGrid.setGridData(gridData);
      }
    },
    /**
     * 상해자(협렵업체) 행 삭제
     */
    btnPartnersDelete() {
      let gridData = this.YPartnersGrid.getGridData();
      const selectedRowItems = this.YPartnersGrid.getCheckedRowItemsAll();

      if (gridData.length > 0 && selectedRowItems.length > 0) {
        this.$_.forEach(selectedRowItems, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
      }
      this.changePartnersData(gridData);
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
#cauTypeCd {
  height: auto;
}
.fontSize .custom-control-label {
  font-size: 11px;
}
.custom-control-label span {
  vertical-align: middle !important;
}
</style>
