<!--
  목적 : 자체감사 > 분석
  Detail : 분석 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="searchBox">
      <b-col sm="12">
        <y-search-box :gridOptions="gridOptions" @enter="getList">
          <b-row slot="search">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="search"
                name="plantCd"
                v-model="searchParam.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-datepicker
                :width="8"
                type="year"
                label="L0000000829"
                name="year"
                v-model="searchParam.year"
              ></y-datepicker>
            </b-col>
          </b-row>
        </y-search-box>

        <b-row class="mt-3">
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 검색 -->
                <y-btn
                  title="L0000000327"
                  color="green"
                  @btnClicked="getList"
                />
              </div>
            </b-col>
          </b-col>
        </b-row>
        <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="resultItems"
            itemText="auditNm"
            itemValue="auditRsltNo"
            ui="bootstrap"
            label="자체감사"
            name="auditRsltNo"
            v-model="searchParam.auditRsltNo"
          ></y-select>
        </b-col>-->
      </b-col>
    </b-row>

    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :searchParam.sync="searchParam"
          :searchFlag="searchFlag"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'audit-analysis',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        year: '',
        auditRsltNo: '',
      },
      resultItems: [],
      tabItems: [
        {
          title: 'L0000001345',
          url: '/saf/psm/auditAnalysisStatus',
        } /* 분석현황 */,
      ],
      gridOptions: {
        header: [],
        height: 'auto',
      },
      component: null,
      tabIndex: 0,
      searchFlag: false, // 검색 버튼을 누를 경우 탭에서 조회를 할 수 있도록 flag를 넘겨주는 용도
      editable: false,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditPlan.list.url;
      this.editable = this.$route.meta.editable;

      let today = this.$comm.moment().format('YYYY');
      this.searchParam.year = today;

      this.getComboItems('AUDIT_RESULT'); // 자체감사
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      this.component = () => import(`@/pages${path}`);
    },
    getList() {
      if (!this.searchParam.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000765' /* (필수) 년도를 입력한 후 조회하세요 */,
          type: 'warning',
        });
      } else {
        this.searchFlag = !this.searchFlag;
      }
    },
    getComboItems(codeGroupCd) {
      this.$http.url = selectConfig.saf.auditAnalysis.getSelect.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'AUDIT_RESULT') {
            this.resultItems = this.$_.clone(_result.data);
            this.resultItems.splice(0, 0, {
              auditRsltNo: null,
              auditNm:
                this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
