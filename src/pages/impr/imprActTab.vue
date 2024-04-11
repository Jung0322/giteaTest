<!--
  목적 : 개선사항 탭
  Detail : 개선사항 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <el-tag
            size="medium"
            type="warning"
            v-if="tabParam.editable && editable && !this.popupMode"
          >
            <i class="el-icon-info"></i>
            {{ $comm.getLangSpecInfoLabel('L0000000006')
            }}<!-- 목록의 행들을 일괄저장하며 값이 비어있으면 저장 시 삭제처리 됩니다. -->
          </el-tag>
        </div>
      </b-col>
      <b-col sm="12">
        <!-- 즉시조치사항 목록 -->
        <y-auigrid
          ref="yAuiGrid2"
          :editable="tabParam.editable && editable"
          :headers="gridOptions2.header"
          :btns="gridOptions2.btns"
          :height="gridOptions2.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002742')"
          :useExcelExport="false"
          :showRightLabel="!tabParam.editable"
          :rightLabel="tabParam.message"
          :showRowCheckColumn="true"
          @cellClick="cellClickHandler"
          @btnOpenPage="openDialogPage('NOW')"
          @btnAdd="addRow"
          @btnSave="saveRow"
          @btnDelete="deleteRow"
        />
      </b-col>
      <b-col v-if="tabParam.target !== 'IMM'" sm="12" class="mt-2">
        <!-- 개선요청사항 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000270')"
          :useExcelExport="false"
          :showRightLabel="!tabParam.editable"
          :rightLabel="tabParam.message"
          @cellClick="cellClickHandler"
          @btnOpenPop="openDialogPage('BATCH')"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import searchIcon from '@/assets/images/info.png';

export default {
  /* attributes: name, components, props, data */
  name: 'impr-act-tab',
  props: {
    popupMode: false,
    tabParam: {
      type: Object,
      default: {
        imprClassCd: '',
        refTableId: 0,
        refTableIdList: [],
        editable: true,
        detailCheck: false,
        status: '',
        message: '',
      },
    },
    tabIndex: '',
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
      YAuiGrid2: null,
      gridOptions2: {
        header: [],
        data: [],
        height: '250',
      },
      searchUrl: '',
      saveUrl: '',
      deleteUrl: '',
      editable: false,
      gridUploadData: null,
      attachFileGrp: {
        taskClassNm: 'IMPR_ACT_EXCEL',
        taskKey: '0',
        createUserId: '',
        showUploadBtn: true,
        showFileSearch: true,
        editable: true,
        disabled: false,
        onlyDownload: false,
        limit: 1,
        uploadTempFiles: null,
        drag: false,
        label: 'L0000003030' /* 파일업로드 */,
      },
      gridIndex: 0,
    };
  },
  watch: {
    tabIndex() {
      this.getList();
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

    this.getList();
  },
  beforeDestroy() {},
  activated() {
    this.resizeGrid();
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.saf.imprAct.list.url;
      this.saveUrl = transactionConfig.saf.imprAct.immSave.url;
      this.deleteUrl = transactionConfig.saf.imprAct.immDelete.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002668'),
          dataField: 'actClassNm',
          width: '17%',
        } /* 조치구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000267'),
          dataField: 'imprRqstContents',
          width: '17%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        } /* 개선요청내용 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002666'),
          dataField: 'actResultContents',
          width: '17%',
        } /* 조치결과내용 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'),
          dataField: 'actDeptNm',
          width: '17%',
        } /* 조치부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'),
          dataField: 'actLimitYmd',
          width: '16%',
        } /* 조치기한 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002685'),
          dataField: 'actConfirmYmd',
          width: '16%',
        } /* 조치완료일 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000268'),
          color: 'blue',
          btnClicked: 'btnOpenPop',
          visible:
            this.tabParam.editable &&
            this.editable &&
            this.tabParam.refTableId &&
            !this.popupMode,
        }, //  개선요청등록
      ];

      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001526'),
          dataField: 'safImprActNo',
          width: '16%',
          editable: false,
          labelFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField,
            cItem
          ) => {
            let label = '';
            if (value === 1) {
              // 직원중복 오류
              label = this.$comm.getLangSpecInfoLabel('L0000003566');
            } else if (value === 2) {
              // 직원입력 오류
              label = this.$comm.getLangSpecInfoLabel('L0000003567');
            } else if (value === 3) {
              // 조치일자 오류
              label = this.$comm.getLangSpecInfoLabel('L0000003568');
            } else if (value === 0) {
              // 정상
              label = this.$comm.getLangSpecInfoLabel('L0000003569');
            } else if (value !== 0) {
              //  상세 click event : linkClicked(scope.row, scope.$index)
              label = this.$comm.getLangSpecInfoLabel('L0000001526');
            }
            return label;
          },
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            let linkStyle = '';
            if (value !== 0) {
              linkStyle = 'grid-link-cell';
            }
            return linkStyle;
          },
        } /* 상세 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001641'),
          dataField: 'dtlLocat',
          width: '16%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
          maxlength: 50,
        } /* 세부위치 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001073'),
          dataField: 'discoverMatter',
          style: 'left-align',
          width: '17%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 600,
          },
        } /* 발견사항 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002666'),
          dataField: 'actResultContents',
          width: '17%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
          maxlength: 1300,
        } /* 조치결과내용 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002692'),
          dataField: 'actUser',
          width: '17%',
          editable: false,
          labelFunction: function (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField,
            cItem
          ) {
            return value.userNm;
          },
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 22,
            iconHeight: 22,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (this.tabParam.editable && this.editable) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              if (this.tabParam.editable && this.editable) {
                this.popupOptions.target = () =>
                  import(`${'@/pages/manage/user/userSearch.vue'}`);
                this.popupOptions.rowIndex = event.rowIndex;
                this.popupOptions.param = {
                  plantCd: this.$store.getters.plantCd,
                  deptCd: this.$store.getters.deptCd,
                };
                this.popupOptions.title = 'L0000001466'; // 사용자검색
                this.popupOptions.visible = true;
                this.popupOptions.width = '60%';
                this.popupOptions.top = '100px';
                this.popupOptions.closeCallback = this.closePopupSearchUser;
              }
            },
          },
        } /* 조치자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'),
          dataField: 'actConfirmYmd',
          width: '17%',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        } /* 조치기한 */,
      ];
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001529'),
          color: 'orange',
          btnClicked: 'btnOpenPage',
          visible:
            this.tabParam.editable &&
            this.editable &&
            this.tabParam.refTableId &&
            !this.popupMode,
        }, //  상세등록팝업
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003224'),
          color: 'blue',
          btnClicked: 'btnAdd',
          visible:
            this.tabParam.editable &&
            this.editable &&
            this.tabParam.refTableId &&
            !this.popupMode,
        }, // 행 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002474'),
          color: 'orange',
          btnClicked: 'btnSave',
          visible:
            this.tabParam.editable &&
            this.editable &&
            this.tabParam.refTableId &&
            !this.popupMode,
        }, // 저장
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'),
          color: 'red',
          btnClicked: 'btnDelete',
          visible:
            this.tabParam.editable &&
            this.editable &&
            this.tabParam.refTableId &&
            !this.popupMode,
        }, //  행 삭제
      ];
    },
    cellClickHandler(event) {
      if (event.dataField === 'imprRqstContents') {
        this.openDialogPage('DETAIL', event.item);
      }
      if (event.dataField === 'safImprActNo') {
        const safImprActNo = event.item.safImprActNo || 0;
        if (safImprActNo !== 0) {
          this.linkClicked(event.item);
        }
      }
    },
    closePopupSearchUser(data) {
      const rowIndex = this.popupOptions.rowIndex || 0;
      if (data.user) {
        const actUserId = data.user.userId;
        const actUserNm = data.user.userNm;

        this.YAuiGrid2.setCellValue(rowIndex, 'actUserId', actUserId);
        this.YAuiGrid2.setCellValue(rowIndex, 'actUserNm', actUserNm);
        this.YAuiGrid2.setCellValue(rowIndex, 'actUser', {
          userId: actUserId,
          userNm: actUserNm,
        });
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    getList() {
      if (
        this.tabParam.refTableId === 0 &&
        (!this.tabParam.refTableIdList || !this.tabParam.refTableIdList.length)
      ) {
        return;
      }

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.tabParam;
      this.$http.request(
        (_result) => {
          if (_result.data.length > 0) {
            this.$_(_result.data)
              .groupBy('actClassCd')
              .forEach((groupArr) => {
                const [firstObj] = groupArr;
                if (firstObj.actClassCd === 'ACL01') {
                  const newGridData = this.$_.cloneDeep(groupArr);
                  if (newGridData.length > 0) {
                    newGridData.forEach((item) => {
                      item.actUser = {
                        userId: item.actUserId,
                        userNm: item.actUserNm,
                      };
                    });
                  }
                  this.YAuiGrid2.setGridData(newGridData);
                } else if (firstObj.actClassCd === 'ACL02') {
                  // 개선요청사항 목록
                  this.YAuiGrid.setGridData(groupArr);
                }
              });
          } else {
            // this.YAuiGrid.setGridData([]);
            // this.YAuiGrid2.setGridData([]);
            // this.YAuiGrid2.clearGridData();
            // this.YAuiGrid.clearGridData();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    linkClicked(data) {
      let flag = 'NOW';
      if (!this.editable) flag = 'DETAIL';
      if (this.tabParam.detailCheck) {
        flag = 'DETAIL';
      }

      this.popupOptions.param = {
        safImprActNo: data.safImprActNo,
        imprClassCd: this.tabParam.imprClassCd,
        refTableId: this.tabParam.refTableId,
        flag: flag,
      };

      this.popupOptions.title =
        'L0000002738'; /* 즉시조치상세 -> 즉시조치 상세 정보 */
      this.popupOptions.target = () =>
        import(`${'./immediateActionNewDetail.vue'}`);
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openDialogPage(flag, data) {
      if (data !== undefined) {
        if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL01') {
          flag = 'NOW';
        } else if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL02') {
          flag = 'REQUEST';
        }

        if (!this.editable) flag = 'DETAIL';

        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
        };
      } else {
        if (!this.editable) flag = 'DETAIL';
        this.popupOptions.param = {
          safImprActNo: 0,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
        };
      }
      if (this.tabParam.detailCheck) {
        flag = 'DETAIL';
        this.popupOptions.param.flag = 'DETAIL';
      }

      if (flag === 'NOW' && this.gridOptions2.data.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message:
            'M0000000096' /* 즉시조치사항 목록에 있는 데이터가 저장된 후 즉시조치등록팝업이 뜹니다. 진행하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            let saveData = this.$_.reject(this.gridOptions2.data, {
              safImprActNo: 0,
              dtlLocat: '',
              discoverMatter: '',
              actResultContents: '',
            });
            this.$_.forEach(saveData, (item) => {
              item.refTableId = this.tabParam.refTableId;
              item.actUserId = item.actUser.userId;
              item.actUserNm = item.actUser.userNm;
            });
            this.$http.url = this.saveUrl;
            this.$http.type = 'POST';
            this.$http.param = saveData;
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395 ' /* 안내 */,
                  message: 'M0000000006' /* 저장되었습니다. */,
                  type: 'success', // success / info / warning / error
                });
                this.getList();
                this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
                this.popupOptions.target = () =>
                  import(`${'./immediateActionNewDetail.vue'}`);
                this.popupOptions.top = '10px';
                this.popupOptions.visible = true;
                this.popupOptions.closeCallback = this.closePopup;
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      } else if (flag === 'NOW') {
        this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
        this.popupOptions.target = () =>
          import(`${'./immediateActionNewDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (flag === 'DETAIL') {
        this.popupOptions.title = 'L0000003458'; /* 개선요청상세 */
        this.popupOptions.target = () => import(`${'./improveDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (flag === 'BATCH') {
        this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        this.popupOptions.target = () =>
          import(`${'./actionRequestBatch.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () => import(`${'./actionRequest.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup() {
      this.getList();
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** 즉시조치 행 추가 */
    addRow() {
      this.gridIndex = this.gridIndex + 1;
      const addData = {
        detail: 'L0000001526' /* 상세 */,
        safImprActNo: 0,
        imprStepCd: 'IMST1', // 즉시조치 진행상태
        actClassCd: 'ACL01', // 즉시조치 구분
        imprClassCd: this.tabParam.imprClassCd, // 사업장
        plantCd: this.$store.getters.plantCd, // 사업장
        dtlLocat: '', // 세부위치
        discoverMatter: '', // 발견사항
        actResultContents: '', // 조치결과내용
        actConfirmYmd: this.$comm.getToday(), // 조치일
        actUserId: this.$store.getters.token, // 조치자ID
        actUserNm: this.$store.getters.name, // 조치자명
        actUser: {
          userId: this.$store.getters.token, // 조치자ID
          userNm: this.$store.getters.name, // 조치자명
        },
        actDeptCd: this.$store.getters.deptCd, // 조치부서
        createUserId: this.$store.getters.token, // 등록자
        updateUserId: this.$store.getters.token, // 등록자
        gridIndex: this.gridIndex,
      };
      this.gridOptions2.data.splice(0, 0, addData);

      this.YAuiGrid2.addRow(addData);
    },
    // 즉시조치 저장
    saveRow() {
      var isPossible = true;

      for (let i = 0; i < this.gridOptions2.data.length; i++) {
        if (this.gridOptions2.data[i].actUser.userId === undefined) {
          isPossible = false;
        }
        if (
          this.gridOptions2.data[i].actConfirmYmd === undefined ||
          this.gridOptions2.data[i].actConfirmYmd === ''
        ) {
          isPossible = false;
        }
      }
      if (isPossible === true) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message:
            'M0000000483' /* 값이 전부 비어있는 행은 삭제처리됩니다. 일괄저장하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            let saveData = this.$_.reject(this.gridOptions2.data, {
              safImprActNo: 0,
              dtlLocat: '',
              discoverMatter: '',
              actResultContents: '',
            });
            this.$_.forEach(saveData, (item) => {
              item.refTableId = this.tabParam.refTableId;
              item.actUserId = item.actUser.userId;
              item.actUserNm = item.actUser.userNm;
            });
            this.$http.url = this.saveUrl;
            this.$http.type = 'POST';
            this.$http.param = saveData;
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395 ' /* 안내 */,
                  message: 'M0000000006' /* 저장되었습니다. */,
                  type: 'success', // success / info / warning / error
                });
                this.getList();
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395 ' /* 안내 */,
          message: 'M0000001147', // 잘못 추가된 데이터가 있습니다. 확인바랍니다.
          type: 'error', // success / info / warning / error
        });
      }
    },
    deleteRow() {
      if (this.YAuiGrid2.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395 ' /* 안내 */,
          message: 'M0000001148', // 삭제 할 행을 선택하세요.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message:
            'M0000000484' /* 선택한 즉시조치사항들을 삭제하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGrid2.getGridData();
            const selectedRows = this.YAuiGrid2.getCheckedRowItems().map(
              (rows) => rows.item
            );
            let deleteData = this.$_.reject(selectedRows, { safImprActNo: 0 });

            this.$_.forEach(selectedRows, (item) => {
              gridData = this.$_.reject(gridData, item);
            });
            this.YAuiGrid2.setGridData(gridData);

            if (deleteData.length > 0) {
              this.$http.url = this.deleteUrl;
              this.$http.type = 'DELETE';
              this.$http.param = {
                data: Object.values(this.$_.clone(deleteData)),
              };
              this.$http.request(
                (_result) => {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395 ' /* 안내 */,
                    message: 'M0000000007' /* 삭제되었습니다 */,
                    type: 'success', // success / info / warning / error
                  });
                  this.$_.forEach(deleteData, (item) => {
                    gridData = this.$_.reject(gridData, item);
                  });

                  this.YAuiGrid2.setGridData(gridData);
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395 ' /* 안내 */,
                message: 'M0000000007' /* 삭제되었습니다 */,
                type: 'success', // success / info / warning / error
              });
            }
          },
          cancelCallback: () => {},
        });
      }
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
      this.YAuiGrid2.resize(null, this.gridOptions2.height);
    },
  },
};
</script>
