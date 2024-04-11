<!--
  목적 : 안전 > 작업허가서 > 작업자 탭
  Detail : 작업자 Tab 풍산사람들만 와서 보기때문에 진행단계가 출력단계가 아니라면 추가 수정 할 수 있다.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :editable="this.editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002413')"
          :useExcelExport="false"
          :showRowAllCheckBox="(!disabled || isConstWrite) && editable"
          @btnAdd="openPopup"
          @btnDelete="btnDeleteClickedCallback"
          @btnClose="closeCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'wkod-person',
  props: {
    saveVendorCd: {
      type: String,
      default: '',
    },
    isConstWrite: {
      type: Boolean,
      default() {
        return false;
      },
    },
    constKindSubconnNos: {
      type: Array,
      default: function () {
        return [];
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
          constNo: '',
          wkodNo: '',
          wkodStepCd: '',
          subconnNm: '',
          vendorCd: '',
          wkodSubconnWorkers: [],
        };
      },
    },
    popupParam: {
      type: Object,
      default() {
        return {
          popupMode: false,
          wkodNo: '',
        };
      },
    },
    isPrev: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      searchUrl: '',
      search2Url: '',
      editable: true,
    };
  },
  watch: {
    constKindSubconnNos: {
      handler: function (val, oldVal) {
        if (this.saveVendorCd === this.wkodMaster.vendorCd) {
          this.getList();
        }
      },
      deep: true,
    },
    'wkodMaster.subconnNm': {
      handler: function (val, oldVal) {
        // 업체 정보가 바뀜으로 인해 작업자의 정보를 리셋 한다.
        this.YAuiGrid.clearGridData();
        this.setHeader();
      },
      deep: true,
    },

    isPrev: {
      handler: function (newVal, oldVal) {
        this.getList();
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    if (this.popupParam.popupMode) {
      this.wkodMaster.wkodNo = this.popupParam.wkodNo;
      this.disabled = true;
    }
    this.init();
  },
  updated() {},
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.constSafe.const.getKindSubconnsWorkers.url;
      this.search2Url = selectConfig.saf.wkodMaster.getSubconnWorkers.url;

      this.setGridInit();

      this.editable = this.$route.meta.editable;

      if (this.saveVendorCd === this.wkodMaster.vendorCd) {
        this.getList();
      }
    },
    setGridInit() {
      // 설비 grid 헤더
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002414'),
          dataField: 'workerNm',
          width: '150',
          editable: false,
        }, // 작업자명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002773'),
          dataField: 'workerJob',
          width: '150',
          editable: false,
        }, // 직책/직무
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '150',
          editable: false,
        }, // 부서
      ];
      if (this.wkodMaster.subconnNm === '자체') {
        const obj = {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003022'),
          dataField: 'speCommts',
          width: '35%',
          editable: false,
        };
        if (!this.disabled || this.isConstWrite) {
          obj.editable = true;
          obj.editRenderer = {
            type: 'InputEditRenderer',
          };
        }
        this.gridOptions.header.splice(4, 0, obj); // 특이사항
      } else {
        this.gridOptions.header.splice(3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'),
          dataField: 'birthYmd',
          width: '180',
          editable: false,
        }); // 생년월일
        this.gridOptions.header.splice(4, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'),
          dataField: 'genderNm',
          width: '90',
          editable: false,
        }); // 성별

        const carObj = {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002797'),
          dataField: 'carNum',
          width: '200',
          editable: false,
        };
        if (!this.disabled || this.isConstWrite) {
          carObj.editable = true;
          carObj.editRenderer = {
            type: 'InputEditRenderer',
          };
        }

        const inEquipObj = {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001071'),
          dataField: 'inEquip',
          width: '200',
          editable: false,
        };
        if (!this.disabled || this.isConstWrite) {
          inEquipObj.editable = true;
          inEquipObj.editRenderer = {
            type: 'InputEditRenderer',
          };
        }

        const speObj = {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003022'),
          dataField: 'speCommts',
          width: '250',
          style: 'left-align',
          editable: false,
        };
        if (!this.disabled || this.isConstWrite) {
          speObj.editable = true;
          speObj.editRenderer = {
            type: 'InputEditRenderer',
          };
        }

        this.gridOptions.header.splice(5, 0, carObj); // 차량번호
        this.gridOptions.header.splice(6, 0, speObj); // 특이사항
        this.gridOptions.header.splice(7, 0, inEquipObj); // 반입장비
      }

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAdd',
          visible: (!this.disabled || this.isConstWrite) && this.editable,
        }, //  추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDelete',
          visible: (!this.disabled || this.isConstWrite) && this.editable,
        }, //  제외
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
          visible: this.popupParam.popupMode,
        }, //  닫기
      ];
    },
    getList() {
      // 공사 정보가 아닌 작업허가서에 저장된 작업자 목록을 들고 오는 경우
      if (!this.constKindSubconnNos || this.constKindSubconnNos.length === 0) {
        if (!this.wkodMaster.wkodNo || this.wkodMaster.wkodNo === 0) {
          const gridData = this.isPrev
            ? this.wkodMaster.wkodSubconnWorkers
            : [];
          this.YAuiGrid.setGridData(gridData);
          this.wkodMaster.wkodSubconnWorkers = gridData;
          return;
        }
        this.$http.url = this.search2Url;
        this.$http.type = 'get';
        this.$http.param = {
          wkodNo: this.wkodMaster.wkodNo,
        };
        this.$http.request(
          (_result) => {
            this.YAuiGrid.setGridData(_result.data);
            this.wkodMaster.wkodSubconnWorkers = _result.data;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
      // 공사 정보를 통해 작업자를 들고 오는 경우
      else {
        this.$http.url = this.searchUrl;
        this.$http.type = 'get';
        this.$http.param = {
          constKindSubconnNos: this.constKindSubconnNos,
        };
        this.$http.request(
          (_result) => {
            this.YAuiGrid.setGridData(_result.data);
            this.wkodMaster.wkodSubconnWorkers = _result.data;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    openPopup() {
      if (!this.wkodMaster.subconnNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          // 작업업체를 지정하세요.
          message: 'M0000000252',
          type: 'warning',
        });
        return;
      }
      if (this.wkodMaster.subconnNm === 'L0000002333') {
        // 자체
        this.popupOptions.target = () =>
          import(`${'../../manage/user/userSearch.vue'}`);
        this.popupOptions.param = {
          multiple: true,
          user: [],
        };
        this.popupOptions.title = 'L0000001466';
        this.popupOptions.visible = true;
        this.popupOptions.width = '60%';
        this.popupOptions.top = '100px';
        this.popupOptions.closeCallback = this.closePersonPopup;
      } else {
        this.popupOptions.param = {
          popupMode: true,
          vendorPerson: [],
          multiple: true,
          vendorCd: this.wkodMaster.vendorCd,
        };
        this.popupOptions.target = () =>
          import(`${'../../vendor/baseInfo/vendorMasterPerson.vue'}`);
        this.popupOptions.title = 'L0000003575'; // 작업자검색
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePersonPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (!data.users) return;

      var receiveData = data.users;
      var i = 0;
      // this.gridOptions.data.splice(0, this.gridOptions.data.length);
      const gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(receiveData, (item) => {
        if (this.$_.findIndex(gridData, { userId: item.userId }) === -1) {
          gridData.splice(0, 0, {
            selfYn: 'Y', // 자체작업
            deptNm: item.deptNm,
            deptCd: item.deptCd,
            userId: item.userId, // 공사작업자번호
            workerNm: item.userNm, // 성명
            workerJob: item.dutyNm, // 직책/직무
            speCommts: '',
          });
        }
      });
      this.YAuiGrid.setGridData(gridData);
      this.wkodMaster.wkodSubconnWorkers = gridData;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data === 'C') return;

      var receiveData = data.data;
      var i = 0;

      const gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(receiveData, (item) => {
        if (
          this.$_.findIndex(gridData, {
            userId: String(item.vendorWorkerNo),
          }) === -1
        ) {
          gridData.splice(0, 0, {
            selfYn: 'N', // 자체작업X
            deptNm: item.vendorNm,
            userId: String(item.vendorWorkerNo),
            workerNm: item.workerNm,
            genderCd: item.genderCd,
            genderNm: item.genderNm,
            workerJob: item.workerJob,
            birthYmd: item.birthYmd,
            speCommts: item.speCommts,
          });
        }
      });
      this.YAuiGrid.setGridData(gridData);
      this.wkodMaster.wkodSubconnWorkers = gridData;
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      if (this.YAuiGrid.getCheckedRowItems().length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          // 작업자목록에서 작업자를 한 명 이상 선택하세요.
          message: 'M0000000253',
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          // 제외하시겠습니까?
          message: 'M0000000093',
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGrid.getGridData();
            const selectValue = this.YAuiGrid.getCheckedRowItems().map(
              (rows) => rows.item
            );
            this.$_.forEach(selectValue, (item) => {
              // if (this.wkodMaster.subconnNm === '자체') {
              //   this.gridOptions.data = this.$_.reject(this.gridOptions.data, {
              //     userId: item.userId,
              //   });
              // } else {

              // 실제로 저장된 데이터가 아닌 팝업에서 추가한 경우
              gridData = this.$_.reject(gridData, {
                userId: item.userId,
              });

              // // 실제로 저장된 데이터이며 해당 테이블의 키 값으로 제거
              // this.gridOptions.data = this.$_.reject(this.gridOptions.data, {
              //   subconnWorkerNo: item.subconnWorkerNo,
              // });
              // }
            });
            this.YAuiGrid.setGridData(gridData);
            this.wkodMaster.wkodSubconnWorkers = gridData;
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    closeCallback() {
      this.$emit('closePopup', {});
    },
  },
};
</script>
