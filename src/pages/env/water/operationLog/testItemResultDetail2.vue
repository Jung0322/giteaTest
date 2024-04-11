<!--
  목적 : 자가측정 검사결과 팝업창
  작성자 : etg
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 저장 -->
          <y-btn
            :action-url="editUrl"
            :param="gridOptions.data"
            :is-submit="isUpdate"
            title="L0000002474"
            color="orange"
            action-type="PUT"
            beforeSubmit="beforeUpdate"
            @beforeUpdate="beforeUpdate"
            @btnClicked="btnUpdateClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
        <!-- 자가측정 검사결과 목록 -->
        <y-data-table
          label="L0000002298"
          ref="dataTable"
          grid-type="edit"
          :useRownum="false"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :span-options="gridOptions.merge"
          :popMode="true"
           :editable="editable && popupParam.popMode"
        >
        <el-table-column
        v-for="(item, i) in gridOptions.header"
        :key="item.text + '_' + i"
          slot="expand"
          header-align="center"
          align="center"
          min-width="100px"
          :label="String(item.text)"
        >
        <template slot-scope="scope">
          <div v-if="item.name !== 'ewtrMonPosNm'">
          <y-number
            :width="12"
            :maxlength="10"
            :hasSeperator="false"
            :pointNumber="2"
            ui="bootstrap"
            :editable="getEditable(scope.row, item.name)"
            :name="String(item.name)"
            :showMaxLength="false"
            rowClass
            v-model="scope.row[String(item.name)]"
          />
          </div>
          <div v-else class="cell" :title="scope.row[item.name]">
            <span
              :style="
                !item.isStyle
                  ? 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'
                  : ''
              "
              >{{ scope.row[item.name] }}</span
            >
          </div>
        </template>
        </el-table-column>
        </y-data-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'discharg-chk-result-detail',
  props: {
    popupParam: {
      paramMeasureYmd: '',
      paramEwtrCleanFacNo: 0,
      paramPlantCd: '',
      paramDeptCd: '',
      default: {
        popMode: false,
      }
    },
  },
  data() {
    return {
      totalAmt: '',
      gridOptions: {
        header: [],
        data: [],
        height: '500',
        selectedRowData: {
          meterCntY: null,
          meterCntT: null,
          consumAmt: null,
        },
      },
      isUpdate: false,
      editUrl: '',
      searchUrl: '',
      editable: false,
      runTmItems: [],
      runTmHours: [],
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      
      this.editable = this.$route.meta.editable;
      this.editUrl =
        transactionConfig.env.water.operationLog.testItemResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.testItemResult.list.url;
      this.getTestItemHeader();
      if (
        this.popupParam.paramMeasureYmd &&
        this.popupParam.paramEwtrCleanFacNo > 0 &&
        this.popupParam.paramDeptCd
      ) {
        this.getList();
      }
     
    },
    getTestItemHeader() {
      this.$http.url =
        selectConfig.env.water.operationLog.testItemResult.items.url;
      this.$http.type = 'GET';
      this.$http.param = {
        measureYmd: this.popupParam.paramMeasureYmd,
        ewtrCleanFacNo: this.popupParam.paramEwtrCleanFacNo,
        plantCd: this.popupParam.paramPlantCd,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.merge = [];
          this.gridOptions.merge.push({ index: 1, field: 'ewtrMonPosNm' });

          // 그리드 헤더 설정
          this.gridOptions.header = [
            {
              text: this.$comm.getLangSpecInfoLabel('L0000002949'), // 측정위치명
              name: 'ewtrMonPosNm',
              width: '150px',
              align: 'left',
              sortable: false,
            },
          ];
          this.$_.forEach(_result.data, (item) => {
            if (item.inputTypeCd === 'TXT01') {
              this.gridOptions.header.push({
                text: item.ewtrTestItemNm,
                name: item.inputTypeCd + item.ewtrTestItemCd,
                type: 'text',
                width: '120px',
                align: 'right',
                maxlength: 10,
              });
            } else {
              this.gridOptions.header.push({
                text: item.ewtrTestItemNm,
                name: item.inputTypeCd + item.ewtrTestItemCd,
                type: 'number',
                width: '120px',
                align: 'right',
                pointNumber: 2,
                maxlength: 7,
                hasSeperator: false,
              });
            }
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        measureYmd: this.popupParam.paramMeasureYmd,
        ewtrCleanFacNo: this.popupParam.paramEwtrCleanFacNo,
        plantCd: this.popupParam.paramPlantCd,
        deptCd: this.popupParam.paramDeptCd,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.$_.forEach(this.gridOptions.data, (row) => {
                  row.updateUserId = this.$store.getters.token;
                  row.createUserId = this.$store.getters.token;
                  row.ewtrCleanFacNo = this.popupParam.paramEwtrCleanFacNo;
                  row.plantCd = this.$store.getters.plantCd;
                  row.measureYmd = this.popupParam.paramMeasureYmd;
                });
                this.isUpdate = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    /** button 관련 이벤트 **/
    btnUpdateClickedCallback(_result) {
      this.isUpdate = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      this.isUpdate = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    getEditable(row, colName) {
      let returnVal = true;
      returnVal = colName === 'ewtrMonPosNm' ? true : row.ewtrst.includes(colName);

      return returnVal;
    }
  },
};
</script>
