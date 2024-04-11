<!--
  목적 : 위험성평가 > 기준정보 > 위험Matrix 관리
  작성자 : kga
  Detail :
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
                        <!-- 위험도 생성 -->
                        <y-label label="L0000002123" icon="user-edit" color-class="cutstom-title-color" />
                    </b-col>
                    </b-row>
                    <b-card>
                        <b-row>
                            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                                <!-- 빈도 -->
                                <y-number
                                    :width="7"
                                    :maxlength="1"
                                    :editable="editMode"
                                    :disabled="!editMode"
                                    ui="bootstrap"
                                    label="L0000001378"
                                    name="frequencySize"
                                    v-model="frequencySize"
                                ></y-number>
                            </b-col>
                            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                                <!-- 강도 -->
                                <y-number
                                    :width="7"
                                    :maxlength="1"
                                    :editable="editMode"
                                    :disabled="!editMode"
                                    ui="bootstrap"
                                    label="L0000000248"
                                    name="strongSize"
                                    v-model="strongSize"
                                ></y-number>
                            </b-col>
                            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                                <!-- 생성 -->
                                <y-btn v-if="!assessType.isHistory && editMode" title="L0000001546" color="blue" @btnClicked="createList" />
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <!-- <b-col sm="6">
                    <b-col sm="12" class="px-0">
                         빈도 
                        <y-data-table
                            ref="frequencyDataTable"
                            label="L0000001378"
                            :editable="editMode"
                            :disabled="!editMode"
                            :height="frequencyGridOptions.height"
                            :headers="frequencyGridOptions.header"
                            :items="frequencyGridOptions.data"
                            :popMode="true"
                        ></y-data-table>
                    </b-col>
                </b-col> -->
                <b-col sm="6" class="h100p">
                  <y-auigrid
                    ref="yAuiGrid"
                    :editable="true"
                    :name="frequencyGridOptions.name"
                    :headers="frequencyGridOptions.header"
                    :btns="frequencyGridOptions.btns"
                    :height="frequencyGridOptions.height"
                    :label="this.$comm.getLangSpecInfoLabel('L0000001378')"
                    :useExcelExport="false"
                    :enableCellMerge="true"
                    :enableSorting="true"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"  
                    @cellEditEnd="cellEditEndHandler"
                  />
                </b-col>
                <!-- <b-col sm="6">
                    <b-col sm="12" class="px-0">
                         강도 
                        <y-data-table
                            ref="strongDataTable"
                            label="L0000000248"
                            :editable="editMode"
                            :disabled="!editMode"
                            :height="strongGridOptions.height"
                            :headers="strongGridOptions.header"
                            :items="strongGridOptions.data"
                            :popMode="true"
                        ></y-data-table>
                    </b-col>
                </b-col> -->
                <b-col sm="6" class="h100p">
                  <y-auigrid
                    ref="auiGrid"
                    :editable="true"
                    :name="strongGridOptions.name"
                    :headers="strongGridOptions.header"
                    :btns="strongGridOptions.btns"
                    :height="strongGridOptions.height"
                    :label="this.$comm.getLangSpecInfoLabel('L0000000248')"
                    :useExcelExport="false"
                    :enableCellMerge="true"
                    :enableSorting="true"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"  
                    @cellEditEnd="cellEditEndHandler"
                  />
                </b-col>
                <!-- <b-col sm="12">
                    <b-col sm="12" class="px-0">
                         위험도 
                        <y-data-table
                            ref="riskDataTable"
                            label="L0000002121"
                            :editable="editMode"
                            :disabled="!editMode"
                            :height="riskGridOptions.height"
                            :headers="riskGridOptions.header"
                            :items="riskGridOptions.data"
                            :popMode="true"
                        ></y-data-table>
                    </b-col>
                </b-col> -->
                <b-col sm="12" class="h100p">
                  <y-auigrid
                    ref="finauiGrid"
                    :editable="true"
                    :name="riskGridOptions.name"
                    :headers="riskGridOptions.header"
                    :btns="riskGridOptions.btns"
                    :height="riskGridOptions.height"
                    :label="this.$comm.getLangSpecInfoLabel('L0000002121')"
                    :useExcelExport="false"
                    :enableCellMerge="true"
                    :enableSorting="true"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"  
                    @cellEditEnd="cellEditEndHandler"
                  />
                </b-col>
            </b-row>
    </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'risk-matrix-addtional',
  props: {
    assessTypeNo: 0,
    editMode: false,
    // assessType: {
    //   type: Object,
    //   default: {
    //     plantCd: '',
    //     flag: '',
    //     assessTypeNo: 0,
    //     isHistory: false,      
    //   },
    // },
  },
  data() {
    return {      
      searchParam: {
        plantCd: '',
        flag: '',
        assessTypeNo: '',
      },
      frequencyGridOptions: {
        name: 'riskMatrixAdditional1',
        header: [],
        data: [],
        height: 200,
      },
      strongGridOptions: {
        name: 'riskMatrixAdditional2',
        header: [],
        data: [],
        height: 200,
      },
      riskGridOptions: {
        name: 'riskMatrixAdditional3',
        header: [],
        data: [],
        height: 500,
      },
      YAuiGrid: null,
      AuiGrid: null,
      FinGrid: null,
      assessType: {
        plantCd: '',
        assessTypeNo: 0,
        assessNm: '',
        assessDesc: '',
        assessTypeCd: '',
        assessGroupCd: '',
        assessGroupNo: 0,
        revNo: 1,
        revContents: '',
        createUserId: '',
        updateUserId: '',
        frequencyList: [],
        strongList: [],
        riskList: [],
      },
      tempRevNo: 1,
      tempRevContents: '',
      insertUrl: '',
      editUrl: '',
      renewUrl: '',
      isInsert: false,
      isEdit: false,
      isRenew: false,
      editable: true,
      revMode: false,
      updateMod: true,
      frequencySize: 1,
      strongSize: 1,
      deptAndPrecess: '',
      jobCdAndJobRevno: '',
      pRHNmAndRHNm: '',
      ADeptNmAndAUserNm: '',
      comboAssessTypeItems: [],
      comboAssessGroupItems: [],
    };    
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();   
  },
  updated() {},
  mounted() {    
    this.YAuiGrid = this.$refs.yAuiGrid; 
    this.AuiGrid = this.$refs.auiGrid;
    this.FinGrid = this.$refs.finauiGrid;
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.rsa.assessAction.matrixeList.url;
      // GridHeader
      if (this.editable && !this.assessType.isHistory) {
        this.frequencyGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001378'), 
            dataField: 'frequencySize', 
            width: '20%', 
            editable: false,
          }, // 빈도
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001578'), 
            dataField: 'frequencyDesc', 
            width: '80%', 
            editable: true,
          }, // 빈도
        ]; // 설명

        this.strongGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000248'), 
            dataField: 'strongSize', 
            width: '20%', 
            editable: false,
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001578'), 
            dataField: 'strongDesc', 
            width: '80%', 
            editable: true,
          }, 
        ];

        this.riskGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001378'), 
            dataField: 'frequencySize', 
            width: '10%', 
            editable: false,
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000248'), 
            dataField: 'strongSize', 
            width: '10%', 
            editable: false,
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002121'), 
            dataField: 'riskSize', 
            width: '10%', 
            editable: true,
            editRenderer: {
              type: "InputEditRenderer",
              onlyNumeric: true, // 0~9만 입력가능
              maxlength: 2, 
            }
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001578'), 
            dataField: 'riskDesc', 
            width: '70%', 
            editable: true,
          }, 
        ];
      } else {
        this.frequencyGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001378'), 
            dataField: 'frequencySize', 
            width: '20%', 
            editable: false,
          }, // 빈도
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001578'), 
            dataField: 'frequencyDesc', 
            width: '80%', 
            editable: false,
          }, 
        ];

        this.strongGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000248'), 
            dataField: 'strongSize', 
            width: '20%', 
            editable: false,
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001578'), 
            dataField: 'strongDesc', 
            width: '80%', 
            editable: false,
          }, 
        ];

        this.riskGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001378'), 
            dataField: 'frequencySize', 
            width: '10%', 
            editable: false,
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000248'), 
            dataField: 'strongSize', 
            width: '10%', 
            editable: false,
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002121'), 
            dataField: 'riskSize', 
            width: '10%', 
            editable: true,
            editRenderer: {
              type: "InputEditRenderer",
              onlyNumeric: true, // 0~9만 입력가능
              maxlength: 2, 
            }
          }, 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001578'), 
            dataField: 'riskDesc', 
            width: '70%', 
            editable: true,
          }, 
        ];
      }
      this.getList();
    },
    createList() {
      if (this.frequencySize <= 0 || this.strongSize <= 0) {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000877' // 가능성 또는 중요성 값은 0보다 커야 합니다.
        );
        return
      }
      this.frequencyGridOptions.data = []
      this.strongGridOptions.data = []
      this.riskGridOptions.data = []
      this.YAuiGrid.setGridData([]);
      this.AuiGrid.setGridData([]);
      this.FinGrid.setGridData([]);
      let riskSize = 0
      let i = 1
      let j = 1
      let rowIndex = 0;

      for (i = 1; i <= this.frequencySize; i++) {
        // this.frequencyGridOptions.data.splice(i, 0, {
        //   frequencySize: i,
        //   frequencyDesc: '',
        // });
        let row = {
          frequencySize: i,
          frequencyDesc: '',
        };
        this.YAuiGrid.addRow(row, 'last');
      }

      for (i = 1; i <= this.strongSize; i++) {
        // this.strongGridOptions.data.splice(i, 0, {
        //   strongSize: i,
        //   strongDesc: '',
        // });
        let row = {
          strongSize: i,
          strongDesc: '',
        };
        this.AuiGrid.addRow(row, 'last');
      }

      for (i = 1; i <= this.frequencySize; i++) {
        for (j = 1; j <= this.strongSize; j++) {
          riskSize = i * j;
          // this.riskGridOptions.data.splice(rowIndex, 0, {
          //   frequencySize: i,
          //   strongSize: j,
          //   riskSize: riskSize,
          //   riskDesc: '',
          // });
          let row = {
            frequencySize: i,
            strongSize: j,
            riskSize: riskSize,
            riskDesc: '',
          };
          this.FinGrid.addRow(row, 'last');
        }
      }
      // this.$refs.riskDataTable.$refs.datatable.sort('riskSize', 'scending');
      this.$emit('riskMatrixAdd', { riskGridOptions: this.FinGrid.getGridData(), frequencyGridOptions: this.YAuiGrid.getGridData(), strongGridOptions: this.AuiGrid.getGridData() });
    },
    cellEditEndHandler() {
      this.$emit('riskMatrixAdd', { riskGridOptions: this.FinGrid.getGridData(), frequencyGridOptions: this.YAuiGrid.getGridData(), strongGridOptions: this.AuiGrid.getGridData() });
    },
    getList() {      
      this.searchParam.assessTypeNo = this.assessTypeNo;      
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.frequencyGridOptions.data = this.$_.clone(
            _result.data.frequencyList
          );
          this.YAuiGrid.setGridData(this.$_.clone(_result.data.frequencyList))
          this.strongGridOptions.data = this.$_.clone(_result.data.strongList);
          this.AuiGrid.setGridData(this.$_.clone(_result.data.strongList))
          this.riskGridOptions.data = this.$_.clone(_result.data.riskList);
          this.FinGrid.setGridData(this.$_.clone(_result.data.riskList))
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  }
}
</script>