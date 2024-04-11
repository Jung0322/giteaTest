<!--
  목적 : 화학물질 > 공정자재관리요령
  작성자 : kyk
  수정자 : jkl
  Detail : 공정관리 요령 상세
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 공정관리요령 상세 -->
            <y-label
              label="L0000004210"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 관리요령출력 -->
              <y-btn
                v-if="updateMode"
                title="L0000000592"
                color="black"
                @btnClicked="btnPrint"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="save"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                filter="chm"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="processManage.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <!-- 부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                type="search"
                :disabled="false"
                :required="true"
                label="L0000001287"
                v-model="processManage.deptCd"
                :plantCd="processManage.plantCd"
              />
            </b-col>
            <!-- 공정 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-process
                :editable="editable"
                :required="true"
                label="L0000000515"
                name="processCd"
                type="search"
                :plantCd="processManage.plantCd"
                :deptCd="processManage.deptCd"
                v-model="processManage.processCd"
                v-validate="'required'"
                :state="validateState('processCd')"
              ></y-tree-process>
            </b-col>
            <!-- 사용여부 , 사용/미사용 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="processManage.useYn"
              />
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3">
              <div slot="buttonGroup" class="float-right mb-1">
                추가 
                <y-btn
                  v-if="editable"
                  title="L0000002892"
                  color="orange"
                  @btnClicked="btnPopupClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                 제외 
                <y-btn
                  v-if="gridOptions.data.length > 0 && editable"
                  title="L0000002620"
                  color="red"
                  @btnClicked="btnReject"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
               화학자재 
              <y-data-table
                label="L0000003309"
                ref="dataTable"
                minHeight="150"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                v-model="selectedValue"
                :checkItemData="checkItemData"
                :editable="editable"
                checkKey="chemProdNo"
              >
                <el-table-column
                  v-if="editable"
                  slot="selection"
                  type="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col> -->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000003309')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRowCheckColumn="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                @btnPopupClickedCallback="btnPopupClickedCallback"
                @btnReject="btnReject"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <b-card>
                <b-row>
                  <b-col
                    sm="12"
                    md="12"
                    lg="12"
                    xl="12"
                    class="col-xxl-12 mb-3"
                  >
                    <b-row>
                      <!-- 그림문자 -->
                      <b-col sm="12">
                        <y-label
                          label="L0000000736"
                          color-class="cutstom-title-color"
                        />
                      </b-col>
                      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                        <el-checkbox-group
                          :disabled="!editable"
                          v-model="processManage.processManagePicGraphs"
                        >
                          <el-checkbox
                            v-for="processManagePicture in processManagePictures"
                            :label="processManagePicture.code"
                            :key="processManagePicture.code"
                            :editable="editable"
                          >
                            <el-image
                              style="width: 70px; height: 70px"
                              :src="
                                publicPath +
                                '/src/assets/images/' +
                                processManagePicture.codeNm
                              "
                              fit="contain"
                            ></el-image>
                          </el-checkbox>
                        </el-checkbox-group>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" md="12" lg="6" xl="6" class="col-xxl-6">
                    <b-row>
                      <!-- 유해성·위험성 -->
                      <b-col sm="12">
                        <y-label
                          label="L0000002167"
                          color-class="cutstom-title-color"
                        />
                      </b-col>
                      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                        <y-textarea
                          :width="12"
                          :editable="editable"
                          :maxlength="2000"
                          ui="bootstrap"
                          name="hazDangerDesc"
                          v-model="processManage.hazDangerDesc"
                        ></y-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" md="12" lg="6" xl="6" class="col-xxl-6">
                    <b-row>
                      <!-- 취급상 주의사항 -->
                      <b-col sm="12">
                        <y-label
                          label="L0000002917"
                          color-class="cutstom-title-color"
                        />
                      </b-col>
                      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                        <y-textarea
                          :width="12"
                          :editable="editable"
                          :maxlength="2000"
                          ui="bootstrap"
                          name="handleCareDesc"
                          v-model="processManage.handleCareDesc"
                        ></y-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" md="12" lg="6" xl="6" class="col-xxl-6">
                    <b-row>
                      <b-col sm="12">
                        <!-- 적절한 보호구 -->
                        <y-label
                          label="L0000002490"
                          color-class="cutstom-title-color"
                        />
                      </b-col>
                      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                        <y-textarea
                          :width="12"
                          :editable="editable"
                          :maxlength="2000"
                          ui="bootstrap"
                          name="safetyEquipDesc"
                          v-model="processManage.safetyEquipDesc"
                        ></y-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" md="12" lg="6" xl="6" class="col-xxl-6">
                    <b-row>
                      <!-- 응급조치 요령 -->
                      <b-col sm="12">
                        <y-label
                          label="L0000002205"
                          color-class="cutstom-title-color"
                        />
                      </b-col>
                      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                        <y-textarea
                          :width="12"
                          :editable="editable"
                          :maxlength="2000"
                          ui="bootstrap"
                          name="fstHandleDesc"
                          v-model="processManage.fstHandleDesc"
                        ></y-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" md="12" lg="6" xl="6" class="col-xxl-6">
                    <b-row>
                      <!-- 사고시 대처방법 -->
                      <b-col sm="12">
                        <y-label
                          label="L0000001396"
                          color-class="cutstom-title-color"
                        />
                      </b-col>
                      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                        <y-textarea
                          :width="12"
                          :editable="editable"
                          :maxlength="2000"
                          ui="bootstrap"
                          name="accHandleDesc"
                          v-model="processManage.accHandleDesc"
                        ></y-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" md="12" lg="6" xl="6" class="col-xxl-6">
                    <b-row>
                      <!-- 물질안전보건자료 검색방법 -->
                      <b-col sm="12">
                        <y-label
                          label="L0000001059"
                          color-class="cutstom-title-color"
                        />
                      </b-col>
                      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                        <y-textarea
                          :width="12"
                          :editable="editable"
                          :maxlength="2000"
                          ui="bootstrap"
                          name="etc"
                          v-model="processManage.etc"
                        ></y-textarea>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
        <!-- 버튼 -->
        <div slot="buttonGroup" class="float-right mt-1">
          <!-- 관리요령출력 -->
          <!-- <y-btn v-if="updateMode" title="L0000000592" color="black" @btnClicked="btnPrint" /> -->
          <!-- 저장 -->
          <!-- <y-btn
              v-if="editable"
              title="L0000002474"
              color="orange"
              @btnClicked="save"
            /> -->
          <!-- 닫기 -->
          <!-- <y-btn title="L0000000881" @btnClicked="closePopup"/> -->
        </div>
      </b-col>
    </b-row>

    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'chem-process-manage-detail',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        chmProcessManageNoProp: 0,
      }),
    },
  },
  data() {
    return {
      processManage: {
        chmProcessManageNo: 0,
        plantCd: '',
        plantNm: null,
        deptCd: '',
        deptNm: null,
        processCd: '',
        processNm: null,
        hazDangerDesc: '',
        handleCareDesc: '',
        safetyEquipDesc: '',
        fstHandleDesc: '',
        accHandleDesc: '',
        etc: '',
        useYn: 'Y',
        chemProcessManageChemprodVals: [],
        processManagePicGraphs: [],
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        name: 'chemProcessManageDetail',
        btns: [],
        header: [],
        data: [],
        height: 150,
      },
      YAuiGrid: null,
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
      updateMode: false,
      searchProdValsUrl: '',
      insertUrl: '',
      editUrl: '',
      printUrl: '',
      isInsert: false,
      isEdit: false,
      selectedValue: [],
      checkItemData: [],
      processManagePictures: [],
    };
  },
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  methods: {
    init() {
      if (this.popupParam.chmProcessManageNoProp) this.getList();
      // URL 셋팅
      this.searchProdValsUrl = selectConfig.chm.processManage.chemprodvals.url;
      this.insertUrl = transactionConfig.chm.processManage.insert.url;
      this.editUrl = transactionConfig.chm.processManage.edit.url;
      this.printUrl = selectConfig.chm.processManage.print.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
          dataField: 'chemProdNmKr',
          width: '25%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003319'),
          dataField: 'chemProdNmEn',
          width: '25%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000158'),
          dataField: 'sapMatCd',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000496'),
          dataField: 'vendorNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002627'),
          dataField: 'makecpNm',
          width: '15%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnReject',
        },
      ];

      this.getComboItems('CHM_GHS_PIC');
    },
    getList() {
      this.$http.url = this.$format(
        selectConfig.chm.processManage.get.url,
        this.popupParam.chmProcessManageNoProp
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.processManage = this.$_.clone(_result.data);
          this.gridOptions.data =
            this.processManage.chemProcessManageChemprodVals;
          this.YAuiGrid.setGridData(
            this.processManage.chemProcessManageChemprodVals
          );
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** validation checking **/
    beforeEdit() {
      if (this.YAuiGrid.getGridData().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001008', // 화학자재를 선택해주세요.
          type: 'warning',
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000060', // 수정하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.processManage.updateUserId = this.$store.getters.token;
                this.processManage.chemProcessManageChemprodVals =
                  this.YAuiGrid.getGridData();
                this.isEdit = true;
              },
              cancelCallback: () => {
                this.isEdit = false;
              },
            });
          } else {
            this.$popupRequired.check(
              'chemProcessManageDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.processManage.chmProcessManageNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000106', // 등록되었습니다.
        type: 'success',
      });
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000836', // 수정되었습니다.
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    // 추가 팝업
    btnPopupClickedCallback() {
      this.searchChemprod(null);
    },
    searchChemprod() {
      this.popupOptions.target = () => import(`${'../chemprod/chemprod.vue'}`);
      this.popupOptions.title = 'L0000003309'; // 화학자재
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closePopupSearchChemProd;
    },
    closePopupSearchChemProd(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      var _result = data.data;
      if (_result !== 'C' && _result !== '[]') {
        let selectRow =
          this.YAuiGrid.getGridData()[
            this.$_.findIndex(this.YAuiGrid.getGridData(), {
              chemProdNo: _result.chemProdNo,
            })
          ];
        if (selectRow === undefined) {
          const row = {
            chemProdNo: _result.chemProdNo,
            chemProdNmKr: _result.chemProdNmKr,
            chemProdNmEn: _result.chemProdNmEn,
            sapMatCd: _result.sapMatCd,
            makecpCd: _result.makerCd,
            makecpNm: _result.makerNm,
            vendorCd: _result.vendorCd,
            vendorNm: _result.vendorNm,
            chmProcessManageNo: this.processManage.chmProcessManageNo,
          };
          this.YAuiGrid.addRow(row);
        }
      }
    },
    btnReject() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000160', // 제외할 항목을 선택하세요.
          type: 'warning',
        });
      } else {
        // this.$_.forEach(checkingData, (item) => {
        //   this.gridOptions.data = this.$_.clone(
        //     this.$_.reject(this.YAuiGrid.getGridData(), {
        //       chemProdNo: item.chemProdNo,
        //     })
        //   );
        // });
        let gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(checkingData, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.YAuiGrid.setGridData(gridData);
      }
    },
    btnPrint() {
      if (this.processManage.chmProcessManageNo === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000191', // 출력할 공정관리요령을 선택하세요.
          type: 'warning',
        });
        return;
      }
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.$format(
        this.printUrl,
        this.processManage.chmProcessManageNo
      ); // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileOrgNm = '공정별관리요령.pdf';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'CHM_GHS_PIC') {
            this.processManagePictures = this.$_.clone(_result.data);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup() {
      this.$emit('closePopup');
    },
    save() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (this.YAuiGrid.getGridData().length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000001008', // 화학자재를 선택해주세요.
                type: 'warning',
              });
              return;
            }
            const message = 'M0000000011'; // 저장하시겠습니까?
            let promises = [
              {
                func: this.checkValidation,
                exceptionMessage: 'M0000000005', // 필수 입력값을 입력해 주세요.
              },
              {
                func: this.confirm,
                param: message,
              },
              {
                func: this.saveData,
                successMessage: 'M0000000006', // 저장되었습니다.
              },
            ];
            this.$comm.orderedPromise(promises);
          } else {
            this.$popupRequired.check(
              'chemProcessManageDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    checkValidation() {
      return new Promise((_resolve, _reject) => {
        this.$validator
          .validateAll()
          .then((result) => {
            _resolve(result);
          })
          .catch((_error) => {
            _reject(_error);
          });
      });
    },
    confirm(_message) {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: _message,
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        this.processManage.chemProcessManageChemprodVals =
          this.YAuiGrid.getGridData();

        let url = null;
        if (this.processManage.chmProcessManageNo) {
          this.$http.type = 'PUT';
          url = transactionConfig.chm.processManage.edit.url;
          this.processManage.updateUserId = this.$store.getters.token;
        } else {
          this.$http.type = 'POST';
          this.updateMode = true;
          url = transactionConfig.chm.processManage.insert.url;
          this.processManage.createUserId = this.$store.getters.token;
        }

        this.$http.url = url;

        this.$http.param = this.processManage;
        this.$http.request(
          (_result) => {
            _resolve(true);
            this.closePopup();
          },
          (_error) => {
            _reject(_error);
          }
        );
      });
    },
  },
};
</script>
