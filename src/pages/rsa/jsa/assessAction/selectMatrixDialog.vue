<!--
  목적 : 작업허가서 점검 확인사항
  Detail : 작업허가서 점검 확인사항 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 위험도 산정 결과 -->
            <y-label
              label="L0000002122"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 적용 -->
              <y-btn
                title="L0000002482"
                color="orange"
                @btnClicked="closePopup('S')"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup('C')" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 위험성 -->
              <y-text
                :width="7"
                :disabled="true"
                ui="bootstrap"
                label="L0000002145"
                name="riskSize"
                v-model="popupParam.riskSize"
              >
              </y-text>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 빈도(노출수준) -->
              <y-text
                :width="7"
                :disabled="true"
                ui="bootstrap"
                label="L0000001379"
                name="frequencySize"
                v-model="popupParam.frequencySize"
              >
              </y-text>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 강도(유해성) -->
              <y-text
                :width="7"
                :disabled="true"
                ui="bootstrap"
                label="L0000000249"
                name="strongSize"
                v-model="popupParam.strongSize"
              >
              </y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             노출수준 tip
             유소견자가 확인되면 '노출수준 = 4등급'
            <el-popover
              placement="top-start"
              width="300"
              :title="$comm.getLangSpecInfoLabel('L0000003431')"
              trigger="hover"
              :content="$comm.getLangSpecInfoLabel('L0000003432')"
            >
              <f-icon
                slot="reference"
                size="lg"
                prefix="far"
                style="color: black"
                icon="question-circle"
              />
            </el-popover>
          </div>
           가능성 
          <y-data-table
            ref="dataTable"
            label="L0000000189"
            :height="frequencyGridOptions.height"
            :headers="frequencyGridOptions.header"
            :items="frequencyGridOptions.data"
            @selectedRow="selectedFrequencyRow"
          >
          </y-data-table>
        </b-col> -->
        <!-- 가능성 -->
        <y-auigrid
          ref="yFrequencyGrid"
          :headers="frequencyGridOptions.header"
          :btns="frequencyGridOptions.btns"
          :height="frequencyGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000189')"
          :useExcelExport="false"
          :rowHeight="30"
          @cellClick="selectedFrequencyRow"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
      <b-col sm="12" class="mt-3">
        <!-- <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            유해성 tip
            "CMR물질 (1A, 1B, 2) 해당시 '유해성 = 4등급(최대)'
            (CMR : 발암성(Carcinogenicity), 생식세포 변이원성(Mutagenicity),생식독성(Reproductive toxicity)
            <el-popover
              placement="top-start"
              width="360"
              :title="$comm.getLangSpecInfoLabel('L0000003429')"
              trigger="hover"
              :content="$comm.getLangSpecInfoLabel('L0000003430')"
            >
              <f-icon
                slot="reference"
                size="lg"
                prefix="far"
                style="color: black"
                icon="question-circle"
              />
            </el-popover>
          </div>
          중대성
          <y-data-table
            ref="dataTable"
            label="L0000002727"
            :height="strongGridOptions.height"
            :headers="strongGridOptions.header"
            :items="strongGridOptions.data"
            @selectedRow="selectedStrongRow"
          >
          </y-data-table>
        </b-col> -->
        <!-- 중대성 -->
        <y-auigrid
          ref="yStrongGrid"
          :headers="strongGridOptions.header"
          :btns="strongGridOptions.btns"
          :height="strongGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002727')"
          :useExcelExport="false"
          :rowHeight="30"
          @cellClick="selectedStrongRow"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'select-martrix-dialog-jsa',
  props: {
    popupParam: {
      flag: '',
      assessTypeNo: '',
      riskSize: 0,
      frequencySize: 0,
      strongSize: 0,
    },
  },
  data() {
    return {
      searchParam: {
        flag: '',
        assessTypeNo: '',
      },
      YFrequencyGrid: null,
      frequencyGridOptions: {
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      YStrongGrid: null,
      strongGridOptions: {
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      riskData: [],
      deptAndPrecess: '',
      jobCdAndJobRevno: '',
      pRHNmAndRHNm: '',
      ADeptNmAndAUserNm: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated() {},
  mounted() {
    this.YFrequencyGrid = this.$refs.yFrequencyGrid;
    this.YStrongGrid = this.$refs.yStrongGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchUrl = selectConfig.rsa.assessAction.matrixeList.url;

      setTimeout(() => {
        if (this.popupParam.riskSize === '평가') {
          this.popupParam.riskSize = 0;
        }
        if (this.popupParam.frequencySize === null) {
          this.popupParam.frequencySize = 0;
        }

        if (this.popupParam.strongSize === null) {
          this.popupParam.strongSize = 0;
        }
      }, 100);

      // GridHeader
      this.frequencyGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001379'),
          dataField: 'frequencySize',
          width: '20%',
          align: 'center',
        }, // 빈도(노출수준)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001578'),
          dataField: 'frequencyDesc',
          width: '80%',
        }, // 설명
      ];

      this.strongGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000249'),
          dataField: 'strongSize',
          width: '20%',
          align: 'center',
        }, // 강도(유해성)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001578'),
          dataField: 'strongDesc',
          width: '80%',
        }, // 설명
      ];

      this.getList();
    },
    getList(flag) {
      this.searchParam.flag = flag;
      this.searchParam.assessTypeNo = this.popupParam.assessTypeNo;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          console.log('222', _result.data);
          this.YFrequencyGrid.setGridData(_result.data.frequencyList);
          this.YStrongGrid.setGridData(_result.data.strongList);
          this.riskData = _result.data.riskList;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedFrequencyRow(data) {
      this.popupParam.frequencySize = data.item.frequencySize;
      let find = this.$_.find(this.riskData, {
        frequencySize: this.popupParam.frequencySize,
        strongSize: this.popupParam.strongSize,
      });
      if (find) {
        this.popupParam.riskSize = find.riskSize;
        this.popupParam.riskNo = find.riskNo;
      }
    },
    selectedStrongRow(data) {
      this.popupParam.strongSize = data.item.strongSize;

      let find = this.$_.find(this.riskData, {
        frequencySize: this.popupParam.frequencySize,
        strongSize: this.popupParam.strongSize,
      });
      if (find) {
        this.popupParam.riskSize = find.riskSize;
        this.popupParam.riskNo = find.riskNo;
      }
    },
    closePopup(flag) {
      if (flag === 'S') {
        if (!this.popupParam.riskNo) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000001153', // 위험도는 빈도, 강도를 선택해야 합니다.
            type: 'warning',
          });
        } else {
          this.$emit('closePopup', this.popupParam);
        }
      } else this.$emit('closePopup', {});
    },
    cellEditEndHandler() {},
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>

<style></style>
