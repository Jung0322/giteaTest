<!--
  목적 : dashboard 설정 컴포넌트
  작성자 : sch
  비고 :
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 기간(요청일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000771"
            name="rqstPeriod"
            v-model="searchParam.rqstPeriod"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 요청부서 -->
          <y-tree-dept
            type="search"
            label="L0000002053"
            :showAllDept="true"
            name="rqstDeptCd"
            v-model="searchParam.rqstDeptCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 등급 -->
          <y-select
            :width="8"
            :comboItems="chngLvlItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="lvlCd"
            label="등급"
            v-model="searchParam.lvlCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 진행단계 -->
          <y-select
            :width="8"
            :comboItems="chngStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="chngStepCd"
            label="L0000002777"
            v-model="searchParam.chngStepCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <b-col sm="12" class="mt-2 px-0">
      <b-row>
        <b-col sm="12">
          <div class="float-right mb-1">
            <!-- 검색 -->
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
          </div>
        </b-col>
        <b-col sm="12">
          <b-card class="moc-card px-0 py-0">
            <el-table
              ref="mocTable"
              :data="tableData"
              :height="gridOptions.sheight"
              header-cell-class-name="moc-th"
              class="moc-dashboard px-0 py-0"
              style="width: 100%">
              <el-table-column
                v-for="(header, index) in headers"
                :key="header.name + '_' + index"
                :prop="header.name"
                :label="$comm.getLangSpecInfoLabel(header.text)"
                header-align="center"
                :min-width="header.width">
                <template slot="header" slot-scope="scope">
                  {{$comm.getLangSpecInfoLabel(header.text)}}
                  <small v-if="header.name==='cgsp2'" class="commi_list_item_small traffic-light-moc">
                    <!-- 색상별설명 -->
                    <el-popover
                      placement="top-start"
                      :title="$comm.getLangSpecInfoLabel('L0000003937')"
                      width="430"
                      trigger="hover">
                      <span>
                        <el-button type="danger" style="cursor:default" circle></el-button> : {{$comm.getLangSpecInfoLabel('L0000003938')}}<br> <!-- 완료되지 않았으며 오늘날이 완료예정일을 넘지 않은 경우 -->
                        <el-button type="warning" style="cursor:default" circle></el-button> : {{$comm.getLangSpecInfoLabel('L0000003939')}}<br> <!-- 완료되지 않았으며 오늘날이 완료예정일을 넘은 경우 -->
                        <el-button type="success" style="cursor:default" circle></el-button> : {{$comm.getLangSpecInfoLabel('L0000003940')}} <!-- 완료된 경우 -->
                      </span>
                      <el-button slot="reference" icon="el-icon-warning-outline" type="info" size="mini" circle style="padding: 3px;"></el-button>
                    </el-popover>
                  </small>
                  <small v-else-if="header.name==='cgsp3'" class="commi_list_item_small traffic-light-moc">
                    <el-popover
                      placement="top-start"
                      :title="$comm.getLangSpecInfoLabel('L0000003937')"
                      width="430"
                      trigger="hover">
                      <span>
                        <el-button type="danger" style="cursor:default" circle></el-button> : {{$comm.getLangSpecInfoLabel('L0000003941')}}<br> <!-- 조치되지 않았으며 오늘날이 조치기한을 넘지 않은 경우 -->
                        <el-button type="warning" style="cursor:default" circle></el-button> : {{$comm.getLangSpecInfoLabel('L0000003942')}}<br> <!-- 조치되지 않았으며 오늘날이 조치기한을 넘은 경우 -->
                        <el-button type="success" style="cursor:default" circle></el-button> : {{$comm.getLangSpecInfoLabel('L0000003943')}} <!-- 조치된 경우 -->
                      </span>
                      <el-button slot="reference" icon="el-icon-warning-outline" type="info" size="mini" circle style="padding: 3px;"></el-button>
                    </el-popover>
                  </small>
                </template>
                <template slot-scope="scope" >
                  <b-row v-if="header.name==='cgsp1'" 
                    :class="scope.row.chngStepCd===header.name.toUpperCase() ? 'current-td' : ''">
                    <b-col sm="12" class="px-1 py-0 mb-1">
                      <b-card no-body style="border-radius: 0px;">
                        <b-row no-gutters>
                          <b-col sm="12" class="commi_list">
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 문서번호 -->
                                  {{$comm.getLangSpecInfoLabel('L0000001042')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  <a style="color:#007bff;" @click="openPopup(scope.row[header.name])">{{scope.row[header.name].chngNum}}</a>
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 제목 -->
                                  {{$comm.getLangSpecInfoLabel('L0000002616')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  {{scope.row[header.name].bizNm}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 진행단계 -->
                                  {{$comm.getLangSpecInfoLabel('L0000002777')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  <font color="red">{{scope.row[header.name].chngStepNm}}</font>
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 요청부서 -->
                                  {{$comm.getLangSpecInfoLabel('L0000002053')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  {{scope.row[header.name].rqstDeptNm}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 등급(작성) -->
                                  {{$comm.getLangSpecInfoLabel('L0000000970')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  {{scope.row[header.name].prevMocLvlNm}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 등급(검토) -->
                                  {{$comm.getLangSpecInfoLabel('L0000000968')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  {{scope.row[header.name].mocLvlNm}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-col>
                  </b-row>
                  <b-row v-if="header.name==='cgspa'" :class="scope.row.chngStepCd===header.name.toUpperCase() ? 'current-td' : ''" style="overflow-y:auto; max-height:295px !important;">
                    <b-col sm="12" class="px-1 py-0 mb-1">
                      <b-card no-body style="border-radius: 0px;">
                        <b-row no-gutters>
                          <b-col sm="12" class="commi_list">
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 위원회 개최일 -->
                                  {{$comm.getLangSpecInfoLabel('L0000003624')}} <el-tag v-if="scope.row[header.name].commiYn!=='Y'" size="mini" type="danger">미개최</el-tag>
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  {{scope.row[header.name].commiDt}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 위원회 협의내용 -->
                                  {{$comm.getLangSpecInfoLabel('L0000003623')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  {{scope.row[header.name].commiContents}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 변경관리위원회 -->
                                  {{$comm.getLangSpecInfoLabel('L0000003599')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                            <b-list-group 
                              v-for="(data, index) in scope.row[header.name].changeCommiPsns"
                              :key="data.userId + '_' + index">
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  {{data.userNm}}
                                  <small class="commi_list_item_small">{{data.deptNm}}</small>
                                </p>
                                
                              </b-list-group-item>
                            </b-list-group>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-col>
                  </b-row>
                  <b-row v-else-if="header.name==='cgsp2'" :class="scope.row.chngStepCd===header.name.toUpperCase() ? 'current-td' : ''">
                    <b-col sm="12" class="px-1 py-0 mb-1">
                      <b-card no-body style="border-radius: 0px;">
                        <b-row no-gutters>
                          <b-col sm="12" >
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 관련업무 목록 -->
                                  {{$comm.getLangSpecInfoLabel('L0000000574')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                          </b-col>
                          <b-col sm="12" class="commi_list_type2">
                            <b-list-group 
                              v-for="(data, index) in scope.row[header.name].changeCheckItemResults"
                              :key="String(data.safChngChkItmRsltNo) + '_' + index">
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  <a style="color:#007bff;" @click="openWorkPopup(data)">{{data.chngRefWorkNm}}</a>
                                  <b-form-checkbox
                                    :disabled="true"
                                    style="margin: 0px; padding-left: 30px;display:inline"
                                    value="Y"
                                    unchecked-value="N"
                                    v-model="data.chngRsltYn"
                                  />
                                  <small class="commi_list_item_small traffic-light-moc">
                                    <el-button type="danger" style="cursor:default" circle :disabled="data.checkStatus!=='plan'" :plain="data.checkStatus!=='plan'"></el-button>
                                    <el-button type="warning" style="cursor:default" circle :disabled="data.checkStatus!=='delay'" :plain="data.checkStatus!=='delay'"></el-button>
                                    <el-button type="success" style="cursor:default" circle :disabled="data.checkStatus!=='comp'" :plain="data.checkStatus!=='comp'"></el-button>
                                  </small>
                                </p>
                                <small class="commi_list_item_small"><!-- 담당자 -->{{$comm.getLangSpecInfoLabel('L0000000892')}} : {{data.mgrNm}} / <!-- 완료예정일 -->{{$comm.getLangSpecInfoLabel('L0000002041')}} : {{data.endSchDt}} / <!-- 완료일 -->{{$comm.getLangSpecInfoLabel('L0000002043')}} : {{data.endDt}}</small>
                              </b-list-group-item>
                            </b-list-group>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-col>
                  </b-row>
                  <b-row v-else-if="header.name==='cgsp3'" :class="scope.row.chngStepCd===header.name.toUpperCase() ? 'current-td' : ''">
                    <b-col sm="12" class="px-1 py-0 mb-1">
                      <b-card no-body style="border-radius: 0px;">
                        <b-row no-gutters>
                          <b-col sm="12" >
                            <b-list-group >
                              <b-list-group-item class="commi_list_item commi_list_header">
                                <p class="mb-0">
                                  <!-- 개선요청사항 목록 -->
                                  {{$comm.getLangSpecInfoLabel('L0000000270')}}
                                </p>
                              </b-list-group-item>
                            </b-list-group>
                          </b-col>
                          <b-col sm="12" class="commi_list_type2">
                            <b-list-group 
                              v-for="(data, index) in scope.row[header.name].imprs"
                              :key="String(data.safImprActNo) + '_' + index">
                              <b-list-group-item class="commi_list_item">
                                <p class="mb-0">
                                  <a style="color:#007bff;" @click="openImprPopup(data)">{{data.imprTitle}}</a>
                                  <small class="commi_list_item_small"><el-tag size="mini" type="success">{{data.imprStepNm}}</el-tag></small>
                                  <small class="commi_list_item_small traffic-light-moc">
                                    <el-button type="danger" style="cursor:default" circle :disabled="data.checkStatus!=='plan'" :plain="data.checkStatus!=='plan'"></el-button>
                                    <el-button type="warning" style="cursor:default" circle :disabled="data.checkStatus!=='delay'" :plain="data.checkStatus!=='delay'"></el-button>
                                    <el-button type="success" style="cursor:default" circle :disabled="data.checkStatus!=='comp'" :plain="data.checkStatus!=='comp'"></el-button>
                                  </small>
                                </p>
                                <small class="commi_list_item_small"><!-- 조치부서 -->{{$comm.getLangSpecInfoLabel('L0000002673')}} : {{data.actDeptNm}} / <!-- 조치기한 -->{{$comm.getLangSpecInfoLabel('L0000002670')}} : {{data.actLimitYmd}}</small>
                                
                              </b-list-group-item>
                            </b-list-group>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-col>
                  </b-row>
                  <!-- <b-row v-else-if="header.name==='cgsp4'" :class="scope.row.chngStepCd===header.name.toUpperCase() ? 'current-td' : ''">
                  </b-row> -->
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                ref="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNumber"
                :page-size="pageSize"
                :page-sizes="[5, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper, ->, slot"
                :total="pageTotal"
              ></el-pagination>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
var docV = document.documentElement;
export default {
  /** attributes: name, components, props, data **/
  name: 'dashboard-setting',
  components: {
  },
  props: {
  },
  data() {
    return {
      // 대쉬보드 항목
      searchParam: {
        plantCd: '',
        rqstPeriod: [],
        rqstDeptCd: null,
        lvlCd: null,
        chngStepCd: null,
        bizNm: '',
      },
      allData: [],
      tableData: [],
      headers: [],
      gridOptions: {
        height: 'auto',
        sheight: 0,
      },
      searchUrl: '',
      pageNumber: 1,
      pageSize: 5,
      pageTotal: 0, 
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      chngStepItems: [],
      chngLvlItems: [],
    }
  },
  computed: {
  },
  watch: {
    'gridOptions.height'() {
      this.gridOptions.sheight = this.gridOptions.height - 85;
    }
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // Url Setting
      this.searchUrl = selectConfig.saf.change.dashboad.url;

      // 기간 Setting
      let today = this.$comm.getToday();
      let from = this.$comm.getCalculatedDate(
        today,
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.rqstPeriod = [from, today];
      // 변경구분
      this.$comm.getComboItems('SAF_MOC_LVL', true).then(_result => {
        this.chngLvlItems = _result;
      });
      this.$comm.getComboItems('SAF_CHNG_STEP', true).then(_result => {
        this.chngStepItems = _result;
      });

      this.getList();
      this.headers = [
        { text: 'L0000003933', name: 'cgsp1', width: '180px', align: 'center' }, // 변경발의
        { text: 'L0000003934', name: 'cgspa', width: '300px', align: 'center' }, // 검토
        { text: 'L0000003935', name: 'cgsp2', width: '350px', align: 'center' }, // 변경실시
        { text: 'L0000003936', name: 'cgsp3', width: '350px', align: 'center' }, // 사후처리
        // { text: '변경완료', name: 'cgsp4', width: '60px', align: 'center' },
      ];
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.allData = _result.data;
          this.pageTotal = this.allData ? this.allData.length : 0;
          this.handleCurrentChange(1);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openPopup(data) {
      this.popupOptions.param = {
        safChngNo: data ? data.safChngNo : 0, // key
        chngStepCd: data ? data.chngStepCd : '', // 진행상태
        isSearch: true,
      };
      this.popupOptions.target = () => import(`${'@/pages/saf/change/changeDetail.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    openImprPopup(data) {
      this.popupOptions.param = {
        safImprActNo: data.safImprActNo,
        imprClassCd: data.imprClassCd,
        flag: 'DETAIL',
      };
      this.popupOptions.title = 'L0000003546'; /* 개선조치요청 확인 */
      this.popupOptions.target = () => import(`${'@/pages/impr/improveDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openWorkPopup(data) {
      this.popupOptions.param = {
        safChngNo: data.safChngNo,
        chngRefWorkCd: data.chngRefWorkCd,
        plantCd: data.plantCd,
      };
      this.popupOptions.title = 'L0000002776'; /* 진행관리 */
      this.popupOptions.target = () => import(`${'./mocWorkPopup2.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    handleSizeChange(_newPageSize) {
      this.pageSize = _newPageSize;
      this.handleCurrentChange(this.pageNumber);
    },
    handleCurrentChange(_newPage) {
      this.pageNumber = _newPage;
      var page = _newPage || 1;
      var perPage = this.pageSize;
      var offset = (page - 1) * perPage;
      this.tableData = this.$_.drop(this.allData, offset).slice(
        0,
        perPage
      );
      setTimeout(() => {
        let tds = this.$refs.mocTable.$el.getElementsByTagName('td');
        this.$_.forEach(tds, td => {
          td.style.backgroundColor = '';
        })
        let currentClasses = document.getElementsByClassName("current-td");
        this.$_.forEach(currentClasses, currentClass => {
          currentClass.parentElement.parentElement.style.backgroundColor = 'red';
        });
      }, 500);
    },
  }
};
</script>

<style>
  /* .moc-steps * {
    color: black !important;
    border-color: black !important;
  } */
  .moc-card .card-body {
    padding: 0px !important;
  }
  .moc-th {
    line-height: 32px;
    height: 32px !important;
    padding: 0 !important;
    background-color: lightsteelblue !important;
    color: black;
  }
  .top-card-moc {
    min-width: 1500px;
    overflow-x: scroll;
    padding-bottom: 10px;
  }
  .moc-steps > .el-step > .is-wait {
    color: black !important;
    border-color: black !important;
  }
  .moc-steps > .el-step > .el-step__main > .is-wait {
    color: black !important;
    border-color: black !important;
  }
  .cgsp1-left {
    border-right:1px solid rgb(230, 230, 230); 
    background:lightblue;
  }
  .moc-dashboard th {
    /* #E6E6E6 */
    border-right:1px solid black !important;
  }
  .moc-dashboard th.is-center {
    /* #E6E6E6 */
    border-bottom:1px solid black !important;
  }
  /* .moc-dashboard th:nth-last-child(2) {
    border-right:0 !important
  } */
  .moc-dashboard th:last-child {
    border-right:0 !important;
    border-bottom:0 !important;
  }
  .moc-dashboard td {
    /* #E6E6E6 */
    border-right:1px solid black !important;
    border-bottom:1px solid black !important;
  }
  .moc-dashboard td:last-child {
    border-right:0 !important
  }
  .pagination-container {
    background: #fff;
    padding: 0px 16px;
    text-align: center;
  }
  .pagination-container.hidden {
    display: none;
  }
  td:has(div.current-td) {
    background-color: antiquewhite;
  }
  .commi_list_header {
    font-weight: 800;
    background: aliceblue;
  }
  .commi_list {
    min-height: 285px;
    max-height: 285px;
    overflow-y: auto;
  }
  .commi_list_type2 {
    min-height: 260px;
    max-height: 260px;
    overflow-y: auto;
  }
  .commi_list_item {
    padding: 0 0 0 5px;
    border-left: 0px;
    border-right: 0px;
    border-top: 0px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: unset !important;
  }
  .commi_list_item_small {
    margin-left: 10px;
    font-size: 11px !important;
  }
  .header-col-moc {
    background: aliceblue;
    font-weight: 800;
    text-align: center;
    vertical-align: middle !important;
  }
  .traffic-light-moc {
    float: right;
    margin-right: 10px;
  }
  /* .current-td {
    background-color: antiquewhite;
  } */
</style>
