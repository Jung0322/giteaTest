<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3 mb-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 부서 정보 -->
            <y-label
              label="L0000001297"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 사업장 -->
                  <y-label label="L0000001415" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="dept.plantNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 부서코드 -->
                  <y-label label="L0000001332" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="dept.deptCd" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 부서 -->
                  <y-label label="L0000001287" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="dept.deptNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 상위부서 -->
                  <y-label label="L0000001536" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="dept.pdeptNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 부서레벨 -->
                  <y-label label="L0000001307" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="dept.deptLvl" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 사용여부 -->
                  <y-label label="L0000001439" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="dept.useYnNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div v-if="dept.deptCd&&editable" class="float-right mb-1"> -->
    <!-- 추가 -->
    <!-- <y-btn title="L0000002892" color="orange" @btnClicked="openPopup" /> -->
    <!-- 삭제 -->
    <!-- <y-btn title="L0000001495" color="red" @btnClicked="deleteProcess" />
          </div> -->
    <!-- 부서별 공정 목록 -->
    <!-- <y-data-table
            ref="dataTable"
            label="L0000001313"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :height="gridOptions.height"
            v-model="selectProcess"
            :popMode="true"
          >
            <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <!-- 부서별 공정 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001313')"
          :useExcelExport="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          :showRowCheckColumn="true"
          @openPopup="openPopup"
          @deleteProcess="deleteProcess"
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
  name: 'dept-manage', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: {
        deptCd: '',
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        deptNm: '',
        pdeptCd: '',
      },
      dept: {
        plantCd: '',
        deptCd: '',
        deptNm: '',
        pdeptCd: '',
        pdeptNm: '',
        deptLvl: null,
        useYn: 'Y',
        keyValue: '',
        processList: '',
        processCdList: '',
        selectProcess: [],
        createUserId: '',
        updateUserId: '',
      },
      selectProcess: [],
      deptLvlItems: [],
      editable: false,
      updateMode: false,
      component: null,
      searchUrl: '',
      detailUrl: '',
      insertProcessUrl: '',
      deleteProcessUrl: '',
      isInsert: false,
      isEdit: false,
      YAuiGrid: null,
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.manage.dept.treelist.url;
      this.detailUrl = selectConfig.manage.dept.get.url;
      this.insertProcessUrl = transactionConfig.deptProcess.insert.url;
      this.deleteProcessUrl = transactionConfig.deptProcess.delete.url;

      this.$comm.getComboItems('COM_DEPT_LVL', false).then((_result) => {
        this.deptLvlItems = _result;
      });
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '200px',
          style: 'center',
        }, // 공정
      ];
      this.getDetail();
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'openPopup',
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'deleteProcess',
        }, // 삭제
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.deptCd);
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.dept = _result.data;
          // this.gridOptions.data = this.dept.selectProcess;
          this.YAuiGrid.setGridData(this.dept.selectProcess);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClosePopup(data) {
      this.$emit('closePopup', {});
    },
    openPopup() {
      this.popupOptions.param = {
        selectProcess: [],
        plantCd: this.dept.plantCd,
      };
      this.popupOptions.target = () => import(`${'./processDialog.vue'}`);
      // 공정선택
      this.popupOptions.title = 'L0000000537';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    deleteProcess() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000107',
          // 부서별 공정을 선택해주세요.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000012',
          // 삭제하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            let gridData = this.YAuiGrid.getGridData();
            const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
              (rows) => rows.item
            );
            this.$_.forEach(selectedRows, (item) => {
              gridData = this.$_.reject(gridData, {
                processCd: item.processCd,
              });
            });
            this.YAuiGrid.setGridData(gridData);
            this.gridOptions.data = gridData;

            this.$http.url = this.deleteProcessUrl;
            this.$http.param = {
              data: Object.values(selectedRows),
            };
            this.$http.type = 'DELETE';
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000007',
                  // 삭제하였습니다.
                  type: 'success',
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'CLOSE') return;

      let saveProcessCd = [];
      this.$_.forEach(data.process, (item) => {
        if (
          this.$_.findIndex(this.gridOptions.data, {
            processCd: item.processCd,
          }) === -1
        ) {
          saveProcessCd.push({
            processCd: item.processCd,
            processNm: item.processNm,
            deptCd: this.dept.deptCd,
            createUserId: this.$store.getters.token,
          });
        }
      });
      if (saveProcessCd.length > 0) {
        this.$http.url = this.insertProcessUrl;
        this.$http.param = saveProcessCd;
        this.$http.type = 'POST';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000106',
              // 등록되었습니다.
              type: 'success',
            });

            this.$_.forEach(saveProcessCd, (item) => {
              this.gridOptions.data.splice(0, 0, {
                processCd: item.processCd,
                processNm: item.processNm,
              });
            });
            this.getDetail();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
  },
};
</script>
