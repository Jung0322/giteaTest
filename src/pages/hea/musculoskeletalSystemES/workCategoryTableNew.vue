<!--
  목적 : 근골격계 작업분류표 탭
  Detail : 작업분류표
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 작업분류표 테이블 -->
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <!-- 작업분류표 -->
              <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :useRownum="false"
                :editable="!disabled && editable"
                :span-options="gridOptions.merge"
                :customExcelDown="true"
                label="L0000002394"
                @gridExcelCustom="gridExcelCustom"
              >
                <!-- 조사대상부서 -->
                <el-table-column
                  slot="tag"
                  :label="$comm.getLangSpecInfoLabel('L0000004264')"
                  class-name="default-td-cosutom"
                  header-align="center"
                  align="center"
                  prop="dept_nm"
                  width="120"
                >
                  <template slot="header" slot-scope="scope">
                    {{ $comm.getLangSpecInfoLabel('L0000004264') }}
                    <b-form-select
                      v-model="deptCd"
                      :options="deptItems"
                      item-text="deptNm"
                      item-value="deptCd"
                      size="sm"
                    />
                  </template>
                  <template slot-scope="scope">{{
                    scope.row.dept_nm
                  }}</template>
                </el-table-column>
                <!-- 단위작업명 -->
                <el-table-column
                  slot="tag"
                  :label="$comm.getLangSpecInfoLabel('L0000000875')"
                  class-name="default-td-cosutom"
                  header-align="center"
                  align="center"
                  prop="unit_work_nm"
                  min-width="120px"
                ></el-table-column>
                <!-- 구분 -->
                <el-table-column
                  :label="$comm.getLangSpecInfoLabel('L0000000686')"
                  slot="tag"
                  name="gubun"
                  class-name="default-td-cosutom"
                  header-align="center"
                >
                  <!-- 노출시간 -->
                  <el-table-column
                    :label="$comm.getLangSpecInfoLabel('L0000000850')"
                    width="120"
                    name="exposureTime"
                    class-name="default-td-cosutom"
                    header-align="center"
                  >
                    <!-- 노출빈도 -->
                    <el-table-column
                      :label="$comm.getLangSpecInfoLabel('L0000000848')"
                      width="120"
                      name="exopsureCnt"
                      class-name="default-td-cosutom"
                      header-align="center"
                    >
                      <!-- 신체부위 -->
                      <el-table-column
                        :label="$comm.getLangSpecInfoLabel('L0000004393')"
                        width="120"
                        name="bodyDesc"
                        class-name="default-td-cosutom"
                        header-align="center"
                      >
                        <!-- 작업자세 및 내용 -->
                        <el-table-column
                          :label="$comm.getLangSpecInfoLabel('L0000002415')"
                          width="120"
                          name="work_nm"
                          align="center"
                          class-name="default-td-cosutom"
                          header-align="center"
                        >
                          <!-- <el-table-column
                            :label="$comm.getLangSpecInfoLabel('L0000001033')" 
                            width="120"
                            name="weightDesc"
                            class-name="default-td-cosutom"
                            header-align="center"
                            align="center"
                            prop="work_nm"
                          > -->
                          <!--  prop="col1" -->
                          <template slot-scope="scope">
                            {{ scope.row.work_nm }}
                          </template>
                          <!-- </el-table-column> -->
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  v-for="(img, index) in imageArr"
                  :key="img.src"
                  slot="tag"
                  header-align="center"
                >
                  <!-- v-for="(img, index) in imageArr" -->
                  <template slot="header" slot-scope="scope">
                    {{ index + 1
                    }}{{ $comm.getLangSpecInfoLabel('L0000003198') }}
                    <!-- 항 -->
                    <el-image :src="img.src"></el-image>
                  </template>
                  <el-table-column
                    label
                    width="180"
                    class-name="default-td-cosutom"
                    header-align="center"
                  >
                    <template slot="header" slot-scope="scope">
                      <span v-html="img.exposureTime"></span>
                    </template>
                    <el-table-column
                      width="180"
                      class-name="default-td-cosutom"
                      header-align="center"
                    >
                      <template slot="header" slot-scope="scope">
                        <span v-html="img.exopsureCnt"></span>
                      </template>
                      <el-table-column
                        width="180"
                        class-name="default-td-cosutom"
                        header-align="center"
                      >
                        <template slot="header" slot-scope="scope">
                          <span v-html="img.bodyDesc"></span>
                        </template>
                        <el-table-column
                          width="180"
                          class-name="default-td-cosutom"
                          align="center"
                          header-align="center"
                        >
                          <template slot="header" slot-scope="scope">
                            <span v-html="img.positionDesc"></span>
                          </template>
                          <!-- <el-table-column
                            width="120"
                            class-name="default-td-cosutom weight-desc"
                            header-align="center"
                            align="center"
                            :prop="String(index+1)"
                          > -->

                          <!-- <template slot="header" slot-scope="scope">
                              {{
                              img.weightDesc
                              }}
                            </template> -->
                          <template slot-scope="scope">
                            {{ scope.row[index + 1] }}
                          </template>
                          <!-- </el-table-column> -->
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </y-data-table>
            </b-col>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'work-category-table-new',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    muscResearch: {
      type: Object,
      default: function () {
        return {
          plantCd: '',
          muscResearchNo: 0,
        };
      },
    },
    paneName: {
      type: String,
      default: function () {
        return '';
      },
    },
  },
  data() {
    return {
      chklist: {
        muscResearchRsltNo: 0,
        muscResearchChklistNo: 0,
        unitWorkNm: '',
        workNm: '',
        muscResearchUnitNo: 0,
        exposureTime: 0,
        exopsureCnt: 0,
        bodyDesc: 0,
        positionDesc: 0,
        weightDesc: 0,
      },
      gridOptions: {
        // 조사결과
        header: [],
        data: [],
        alldata: [],
        height: '1400px',
        merge: [],
      },
      imageArrs: [],
      imageArr: [],
      editable: false,
      searchUrl: '',
      searchChklistUrl: '',
      excelDownUrl: '',
      deptItems: [],
      deptCd: '',
    };
  },
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    paneName() {
      this.getList();
    },
    deptCd() {
      let filterData = this.$_.clone(this.gridOptions.alldata);
      if (!this.deptCd) {
        this.gridOptions.data = this.$_.clone(this.gridOptions.alldata);
      } else {
        if (this.deptCd) {
          filterData = this.$_.filter(filterData, {
            dept_cd: this.deptCd,
          });
        }
        this.gridOptions.data = filterData;
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.hea.surveyResultChklist.list.url;
      this.searchChklistUrl = selectConfig.hea.unitWorkChklist.list.url;
      this.excelDownUrl = selectConfig.hea.surveyResultChklist.excel.url;

      this.getGubunList();
      this.getList();
      this.gridOptions.merge = [];
      this.gridOptions.merge.push({ index: 0, field: 'dept_nm' });
      this.gridOptions.merge.push({ index: 1, field: 'dept_unit_work' });
    },

    getGubunList() {
      this.$http.url = this.searchChklistUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.imageArrs = this.$_.clone(_result.data);
          this.setgubunTable();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setgubunTable(item) {
      let i = 0;
      this.$_.forEach(this.imageArrs, (item) => {
        item.src =
          this.publicPath +
          '/src/assets/images/musculoskeletal_' +
          (i + 1) +
          '.jpg';
        this.imageArr.push(item);
        i += 1;
      });
    },

    getList() {
      let cnt = 0;
      if (!this.muscResearch.muscResearchNo) {
        return;
      }

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.gridOptions.alldata = this.$_.clone(_result.data);
          this.gridOptions.height = '700px';
          this.deptItems = [];
          let deptItemsTemp = [];
          this.$_.forEach(this.gridOptions.data, (item) => {
            deptItemsTemp.push({
              value: item.dept_cd,
              text: item.dept_nm,
              align: 'center',
            });
          });
          this.deptItems = this.$_.uniqWith(deptItemsTemp, this.$_.isEqual);
          this.deptItems.splice(0, 0, { value: '', text: '전체' });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    gridExcelCustom() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.excelDownUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm = '작업분류표.xls';
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
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.weight-desc {
  font-size: 0.7825rem !important;
}
</style>
