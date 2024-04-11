<!--
  목적 : 환경 > 온실가스 > 명세서 출력
  작성자 : PSB
  Detail : 
  *
  examples:
  *
  -->

<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
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
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 checkResult">
          <div class="float-right mb-1">
            <el-tag
              size="mini"
              style="
                background-color: #d9b3e4;
                border-color: #d9b3e4;
                vertical-align: middle;
              "
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag
            >
            <span style="font-size: 12.8px"> : 시뮬레이션 된 데이터</span>
            <!-- 시뮬레이션 적용 -->
            <y-btn
              title="L0000001737"
              color="blue"
              @btnClicked="setSimulation"
            />
            <!--검색  -->
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
          <!-- 배출량 시뮬레이션 목록 -->
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :useRownum="false"
            :items="gridOptions.data"
            :rowClassName="rowClassName"
            :editable="editable"
            label="L0000001154"
            v-model="gridOptions.selectValue"
            @tableLinkClicked="tableLinkClicked"
          >
            <el-table-column
              :selectable="selectCheck"
              align="center"
              type="selection"
              slot="selection"
              width="55"
            />
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'emissions-param',
  props: {},
  data: () => ({
    searchParam: {
      year: '', // 기간(점검일)
      plantCd: '',
    },
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
      selectValue: [],
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
    editable: false,
    searchUrl: '',
    acceptUrl: '',
  }),
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.env.gas.emissions.etlist.url;
      this.acceptUrl = transactionConfig.env.gas.emissions.accept.url;
      this.searchParam.year = this.$comm.getToday().substring(0, 4);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '130px',
          align: 'center',
        }, // 사업장
        {
          text: 'L0000001287',
          name: 'deptNm',
          width: '130px',
          align: 'center',
        }, // 부서
        {
          text: 'L0000000515',
          name: 'processNm',
          width: '130px',
          align: 'center',
        }, // 공정
        {
          text: 'L0000001185',
          name: 'ghgFcltNm',
          width: '150px',
          align: 'center',
        }, // 배출유형
        {
          text: 'L0000001167', // 배출시설
          child: [
            {
              text: 'L0000001179',
              name: 'ghgFcltCd',
              width: '100px',
              align: 'center',
            }, // 배출시설코드
            {
              text: 'L0000001174',
              name: 'fcltNm',
              width: '180px',
              align: 'left',
            }, // 배출시설명
            {
              text: 'L0000000135',
              name: 'ngmsFceqNum',
              width: '100px',
              align: 'left',
            }, // NGMS번호
          ],
        },
        {
          text: 'L0000003340', // 활동데이터
          child: [
            {
              text: 'L0000002729',
              name: 'pActDataNm',
              width: '100px',
              align: 'left',
            }, // 중분류
            {
              text: 'L0000003350',
              name: 'actDataNm',
              width: '180px',
              align: 'left',
              url: true,
            }, // 활동자료명
            {
              text: 'L0000000870',
              name: 'unitNm',
              width: '80px',
              align: 'center',
            }, // 단위
          ],
        },
        {
          text: 'L0000001001', // 매개변수
          child: [
            {
              text: 'L0000002483',
              name: 'paTierNm',
              width: '80px',
              align: 'center',
            }, // 적용Tier
            {
              text: 'L0000001976',
              name: 'useByYear',
              width: '100px',
              align: 'center',
            }, // 연간사용량
            {
              text: 'L0000005637',
              name: 'tj',
              width: '100px',
              align: 'right',
            }, // TJ
            {
              text: 'L0000005638',
              name: 'toe',
              width: '100px',
              align: 'right',
            }, // TOE
            {
              text: '배출계수', // 배출계수
              child: [
                {
                  text: 'L0000001141',
                  name: 'paEmiCoeCo2',
                  width: '120px',
                  align: 'right',
                }, // TCO2/TJ,MWH
                {
                  text: 'L0000001139',
                  name: 'paEmiCoeCh4',
                  width: '130px',
                  align: 'right',
                }, // kgCH4/TJ,MWH
                {
                  text: 'L0000001140',
                  name: 'paEmiCoeN20',
                  width: '120px',
                  align: 'right',
                }, // kgN20/TJ,MWH
                {
                  text: 'L0000005639',
                  name: 'tCo2Eq',
                  width: '130px',
                  align: 'right',
                }, // tCO2eq/TK,MWH
              ],
            },
            {
              text: 'L0000001706',
              name: 'paCalCoeP',
              width: '100px',
              align: 'right',
            }, // 순발열량(GJ/단위)
            {
              text: 'L0000001513',
              name: 'paOxiCoe',
              width: '100px',
              align: 'right',
            }, // 산화율
            {
              text: 'L0000000114', // GWP
              child: [
                {
                  text: 'L0000005640',
                  name: 'paGwpCo2',
                  width: '100px',
                  align: 'right',
                }, // CO2
                {
                  text: 'L0000005641',
                  name: 'paGwpCh4',
                  width: '100px',
                  align: 'right',
                }, // CH4
                {
                  text: 'L0000005642',
                  name: 'paGwpN2o',
                  width: '100px',
                  align: 'right',
                }, // N20
              ],
            },
          ],
        },
        {
          text: 'L0000004462', // 배출량
          child: [
            // {
            //   text: '누계',
            //   child: [
            //     {
            //       text: 'tCO2',
            //       name: 'allCo2',
            //       width: '100px',
            //       align: 'right',
            //     },
            //     {
            //       text: 'CH4',
            //       name: 'allCh4',
            //       width: '100px',
            //       align: 'right',
            //     },
            //     {
            //       text: 'N20',
            //       name: 'allN20',
            //       width: '100px',
            //       align: 'right',
            //     },
            //     {
            //       text: 'tCO2_eq',
            //       name: 'allTCo2Eq',
            //       width: '100px',
            //       align: 'right',
            //     },
            //   ],
            // },
            {
              text: 'L0000005643', // 1Q
              child: [
                {
                  text: 'L0000000042',
                  name: 'one',
                  width: '100px',
                  align: 'right',
                }, // 1월
                {
                  text: 'L0000000043',
                  name: 'two',
                  width: '100px',
                  align: 'right',
                }, // 2월
                {
                  text: 'L0000000044',
                  name: 'three',
                  width: '100px',
                  align: 'right',
                }, // 3월
                {
                  text: 'L0000001659',
                  name: 'qone',
                  width: '100px',
                  align: 'right',
                }, // 소계
              ],
            },
            {
              text: 'L0000005644', // 2Q
              child: [
                {
                  text: '4월',
                  name: 'four',
                  width: '100px',
                  align: 'right',
                }, // L0000000045
                {
                  text: 'L0000000046',
                  name: 'five',
                  width: '100px',
                  align: 'right',
                }, // 5월
                {
                  text: 'L0000000047',
                  name: 'six',
                  width: '100px',
                  align: 'right',
                }, // 6월
                {
                  text: 'L0000001659',
                  name: 'qtwo',
                  width: '100px',
                  align: 'right',
                }, // 소계
              ],
            },
            {
              text: 'L0000005645', // 3Q
              child: [
                {
                  text: 'L0000000048',
                  name: 'seven',
                  width: '100px',
                  align: 'right',
                }, // 7월
                {
                  text: 'L0000000049',
                  name: 'eight',
                  width: '100px',
                  align: 'right',
                }, // 8월
                {
                  text: 'L0000000050',
                  name: 'nine',
                  width: '100px',
                  align: 'right',
                }, // 9월
                {
                  text: 'L0000001659',
                  name: 'qthree',
                  width: '100px',
                  align: 'right',
                }, // 소계
              ],
            },
            {
              text: 'L0000005646', // 4Q
              child: [
                {
                  text: 'L0000000051',
                  name: 'ten',
                  width: '100px',
                  align: 'right',
                }, // 10월
                {
                  text: 'L0000000052',
                  name: 'eleven',
                  width: '100px',
                  align: 'right',
                }, // 11월
                {
                  text: 'L0000000053',
                  name: 'twelve',
                  width: '100px',
                  align: 'right',
                }, // 12월
                {
                  text: 'L0000001659',
                  name: 'qfour',
                  width: '100px',
                  align: 'right',
                }, // 소계
              ],
            },
          ],
        },
        {
          text: 'L0000003180', // 합계
          child: [
            {
              text: 'L0000005647',
              name: 'alltCo2Eq',
              width: '100px',
              align: 'right',
            }, // tC02_eq
          ],
        },
      ];
      this.getList();
    },
    /** 배출량 시물레이션 목록 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(header, data) {
      if (data === null) {
        return;
      }
      this.popupOptions.target = () =>
        import(`${'./emissionsParamDetail.vue'}`);
      this.popupOptions.title = 'L0000001736'; // '시뮬레이션 산정매개변수 등록';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        ghgFcltNo: data.ghgFcltNo,
        year: data.year,
        ghgOutActCd: data.ghgOutActCd,
        ghgActDaCd: data.ghgActDaCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === null || data === undefined) return;
      this.getList();
    },
    selectCheck(row, index) {
      console.log(row);
      if (!this.editable || row.simYn === 'N') return false;
      else return true;
    },
    rowClassName({ row, rowIndex }) {
      if (row.simYn === 'Y') {
        return 'simulation-row';
      }
      return '';
    },
    setSimulation() {
      if (
        !this.gridOptions.selectValue ||
        this.gridOptions.selectValue.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000349', // '하나 이상 시뮬레이션 적용된 데이터를 선택하세요.',
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.gridOptions.selectValue, (item) => {
          item.createUserId = this.$store.getters.token;
          item.updateUserId = this.$store.getters.token;
        });
        this.$http.url = this.acceptUrl;
        this.$http.type = 'PUT';
        this.$http.param = this.gridOptions.selectValue;
        this.$http.request(
          (_result) => {
            this.getList();
            if (_result.data > 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000135', // '적용되었습니다.',
                type: 'success',
              });
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000350', // '죄송합니다. 관리자에게 문의바랍니다.',
                type: 'warning',
              });
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
.simulation-row {
  background-color: #d9b3e4 !important;
}
</style>
