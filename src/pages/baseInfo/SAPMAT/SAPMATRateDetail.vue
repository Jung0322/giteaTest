<!--
  목적 : 기초정보 > 자재
  작성자 : kdh
  Detail : 자재 /등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 자재 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자재 상세 -->
            <y-label
              label="L0000002317"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002329"
                name="matCode"
                v-model="SAPMAT.matCode"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재명(KOR) -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002328"
                name="matName"
                v-model="SAPMAT.matName"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재명(ENG) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002327"
                name="matNameEng"
                v-model="SAPMAT.matNameEng"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 포장단위 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000003141"
                name="packUnit"
                v-model="SAPMAT.packUnit"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재그룹 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002325"
                name="matGroupNm"
                v-model="SAPMAT.matGroupNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자재유형 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002331"
                name="matType"
                v-model="SAPMAT.matType"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :disabled="true"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="SAPMAT.useYn"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <div slot="buttonGroup" class="float-right mb-1">
                <el-tag v-if="dangerMessage" size="medium" type="danger">
                  <i class="el-icon-warning"></i>
                  {{ $comm.getLangSpecInfoLabel('L0000004509') }}
                  <!-- 비율의 합이 100%가 아닙니다. -->
                  {{ $comm.getLangSpecInfoLabel('L0000003753') }}
                  <!-- 비율을 100%로 맞추세요 -->
                </el-tag>
              </div>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 자재별 제조업체 비율 목록 -->
              <y-auigrid
                ref="yAuiGrid"
                :editable="editable"
                :name="gridOptions2.name"
                :headers="gridOptions2.header"
                :btns="gridOptions2.btns"
                :height="gridOptions2.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000002330')"
                :useExcelExport="false"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                :enableSorting="true"
                :showRowCheckColumn="true"
                @beforeSave="beforeSave"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'SAP-MAT-rate-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        matCode: '',
      },
    },
  },
  data() {
    return {
      SAPMAT: {
        matCode: '',
        matName: '',
        matNameEng: '',
        packUnit: '',
        matGroupNm: '',
        matType: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        matVendors: [],
      },
      searchParam: {
        matCode: '', // 자재번호
        matName: '', // 자재명
        matGroupCd: '',
        useYn: 'Y',
        pageNumber: 1,
        pageSize: 100,
        pageTotal: 0,
        pageSizes: [50, 100],
        orderByExpression: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        totalData: [],
        height: 500,
      },
      gridOptions2: {
        header: [],
        data: [],
        height: 300,
        selectValue: [],
      },
      dangerMessage: '',
      sapMatGroupItems: [],
      useItems: [],
      selectedValue: null,
      editable: false,
      updateMode: false,
      searchUrl: '',
      searchSapMatGroupUrl: '',
      detailUrl: '',
      saveUrl: '',
      isSave: false,
      YAuiGrid: null,
    };
  },
  watch: {
    'gridOptions2.data': {
      handler: function (val, oldVal) {
        let sumRate = 0;
        let isAlert = false;
        if (
          !this.YAuiGrid.getGridData() ||
          this.YAuiGrid.getGridData().length === 0
        ) {
          return;
        }
        this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
          if (item.rate && !isNaN(item.rate)) {
            if (this.$_.parseInt(item.rate) > 100) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000129',
                // 비율이 100%를 넘을 수 없습니다.
                type: 'warning',
              });
              this.dangerMessage = 'M0000000129';
              // 비율이 100%를 넘을 수 없습니다.
              isAlert = true;
              return false;
            } else if (this.$_.parseInt(item.rate) < 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000130',
                // 비율이 0%보다 작을 수 없습니다.
                type: 'warning',
              });
              this.dangerMessage = 'M0000000130';
              // 비율이 0%보다 작을 수 없습니다.
              isAlert = true;
              return false;
            } else {
              sumRate += this.$_.parseInt(item.rate);
            }
          }
        });

        if (!isAlert) {
          if (sumRate > 100) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000131',
              // 비율의 합이 100%를 넘을 수 없습니다.
              type: 'warning',
            });
            this.dangerMessage = 'M0000000131';
            // 비율의 합이 100%를 넘을 수 없습니다.
          } else if (sumRate !== 100) {
            this.dangerMessage = 'M0000000134';
            // 비율의 합이 100%가 아닙니다.
          } else {
            this.dangerMessage = '';
          }
        }
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
    this.mountedInit();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.baseInfo.SAPMAT.list.url;
      this.searchSapMatGroupUrl = selectConfig.baseInfo.SAPMAT.groups.url;
      this.detailUrl = selectConfig.baseInfo.SAPMAT.get.url;
      this.saveUrl = transactionConfig.baseInfo.SAPMAT.save.url;
      this.editable = this.$route.meta.editable;

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002632'),
          dataField: 'vendorNm',
          width: '150px',
        }, // 제조업체명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
          dataField: 'chemProdNmKr',
          width: '150px',
          style: 'left',
        }, // 화학자재명(국문)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003319'),
          dataField: 'chemProdNmEn',
          width: '150px',
          style: 'left',
        }, // 화학자재명(영문)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001372'),
          dataField: 'rate',
          width: '130px',
          editable: this.editable,
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // {
        //   headerText: this.$comm.getLangSpecInfoLabel('L0000001372'),
        //   dataField: 'rate',
        //   width: '130px',
        //   style: 'center',
        //   renderer: {
        //     type: 'number',
        //     editable: this.editable,
        //   },

        //   maxlength: 3,
        // }, // 비율
      ];

      this.getSapMatGroup();
      if (this.popupParam.mat_code !== '') {
        this.getDetail();
      }
    },
    // yAuiGrid와 gridOptions2.data 동기화
    cellEditEndHandler() {
      this.gridOptions2.data = this.YAuiGrid.getGridData();
      this.SAPMAT.matVendors = this.gridOptions2.data;
    },
    mountedInit() {
      this.gridOptions2.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002482'),
          color: 'orange',
          btnClicked: 'beforeSave',
        }, // 적용
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions2.btn);
    },
    // 자재 grid
    getSapMatGroup() {
      this.$http.url = this.searchSapMatGroupUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            matGroupCd: '',
            matGroupNmUp: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.sapMatGroupItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.mat_code);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.SAPMAT = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.SAPMAT.matVendors);
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeSave() {
      this.$http.url = this.saveUrl;
      this.$http.type = 'POST';
      this.$http.param = this.SAPMAT;

      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            if (this.dangerMessage) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: this.dangerMessage,
                type: 'warning',
              });
            } else if (this.YAuiGrid.getCheckedRowItems().length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000133',
                // 적용할 자재별 제조업체가 없습니다.
                type: 'warning',
              });
            } else {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000132',
                // 적용하시겠습니까?
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.$http.request(
                    (_result) => {
                      this.SAPMAT.matVendors = this.YAuiGrid.getGridData();
                      this.isSave = true;
                      this.btnSaveClickedCallback();
                    },
                    (_error) => {
                      window.getApp.$emit('APP_REQUEST_ERROR', _error);
                    }
                  );
                  // this.SAPMAT.matVendors = this.YAuiGrid.getGridData();
                  // this.isSave = true;
                },
                // 취소 callback 함수
                cancelCallback: () => {
                  this.isSave = false;
                },
              });
            }
          } else if (!result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M00000000005',
              // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isSave = false;
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000135',
        // 적용되었습니다.
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
