<!--
  목적 : 예시-메인 포틀릿 화면
  작성자 : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row
      v-if="$store.getters.token !== 'lawmanager'"
      class="mt-3 maintopLayer"
    >
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 무재해 현황 -->
            <div id="no-accident" class="no-accident-content">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <span class="font-weight-bold place">{{
                      noAcciData.plantNm
                    }}</span>
                    <span class="font-weight-bold place2">{{
                      changeLang('mainView', 'noaccident')
                    }}</span
                    ><br />
                    <span class="date">{{ noAcciData.totalDays }}</span
                    ><span class="date2">
                      {{ changeLang('mainView', 'noaccidentTargetDate') }} :
                      {{ noAcciData.targetDays }}</span
                    >
                    <div class="wrapper progress-xs mb-0 bar">
                      <div class="progress" size="" style="height: 3px">
                        <div
                          role="progressbar"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow="90"
                          class="no-accident-bar progress-bar bg-success2"
                        >
                          {{ noAcciData.progressDays }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- /무재해 현황 -->

            <div class="main-biz-target">
              <!-- <el-carousel :interval="5000" type="card" height="250px"> -->
              <el-carousel :interval="5000" height="250px">
                <el-carousel-item v-for="item in bizTargetData" :key="item.src">
                  <el-card
                    :body-style="{
                      padding: '0px',
                      height: '100%',
                    }"
                    class="imgContainer"
                  >
                    <img
                      :src="item.src"
                      style="width: 100%; height: 100%; display: block"
                    />
                  </el-card>
                </el-carousel-item>
              </el-carousel>
            </div>
          </b-col>
          <!-- 바로가기 메뉴 -->
          <b-col class="hidden-sm-and-down">
            <b-row>
              <b-col
                style="z-index: 100; position: absolute; margin-top: -90px"
              >
                <b-row
                  class="justify-content-center text-center"
                  :cols="shortCutsMenuOptions.length"
                >
                  <template v-for="item in shortCutsMenuOptions">
                    <b-col
                      sm="1"
                      style="margin-right: 30px; margin-bottom: -10px"
                      :key="item.label"
                    >
                      <el-card
                        shadow="hover"
                        :body-style="{ padding: '0px' }"
                        class="favorite-card"
                      >
                        <div @click="shortCutsMenuClicked(item.url)">
                          <f-icon :icon="item.icon" class="fa-3x"></f-icon>
                          <div style="margin-top: 3px">
                            <span>{{ changeLang('mainView', item.id) }}</span>
                          </div>
                        </div>
                      </el-card>
                    </b-col>
                  </template>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
          <!-- /바로가기 메뉴 -->
        </b-row>

        <!-- /포틀릿 사업장 변경 -->
        <div class="float-right">
          <y-plant type="portlet" label="" :width="12" v-model="plantCd" />
        </div>
        <div class="float-right">
          <y-label label="L0000001415" style="margin-right: 10px" />
          <!-- 사업장 -->
        </div>

        <b-row style="margin-top: 40px">
          <b-col sm="12">
            <!-- <b-row class="cardrow">
              <b-col v-if="isExecutive" sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
              <b-col v-if="isExecutive" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <y-plant type="edit" name="plantCd" v-model="plantCd" />
              </b-col>

              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left portletitem"
              >
                <y-portlet label="SHE 지수" id="sheIndicesStatus" icon="window-restore">
                  <div slot="portlet-body" style="padding-right: 4px;">
                    <component
                      v-if="portletSHE.target"
                      :is="portletSHE.target"
                      :portletParam="portletSHE.param"
                      :portletHeight="portletSHE.height"
                      slot="portlet-body"
                    />
                  </div>
                </y-portlet>
              </b-col>
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left portletitem"
              >
                <y-portlet label="SHE 지수" id="sheIndicesStatus" icon="chart-line">
                  <div slot="portlet-body" style="padding-right: 4px;">
                    <template v-for="item in sheIndicesStatus">
                      <div :key="item.chartOptions.title.text">
                        <apexchart
                          type="line"
                          :height="item.chartOptions.chart.height"
                          :options="item.chartOptions"
                          :series="item.series"></apexchart>
                      </div>
                    </template>
                  </div>
                </y-portlet>
              </b-col>
            </b-row> -->

            <!-- 일반 메인화면 -->
            <!-- 차트 예시 -->
            <b-row class="cardrow">
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left portletitem"
              >
                <y-portlet
                  label="개선 요청 및 조치 현황"
                  id="improveRequest"
                  icon="chart-bar"
                  url="/impr/imprPerformance"
                >
                  <div slot="portlet-body" style="padding-right: 4px">
                    <apexchart
                      ref="improveRequest"
                      type="bar"
                      height="350"
                      :options="improveRequest.chartOptions"
                      :series="improveRequest.series"
                    ></apexchart>
                  </div>
                </y-portlet>
              </b-col>
              <!-- <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left portletitem"
              >
                <y-portlet
                  label="안전업무 현황"
                  id="safetyTaskStatus"
                  icon="chart-bar"
                >
                  <div slot="portlet-body" style="padding-right: 4px">
                    <apexchart
                      type="bar"
                      height="350"
                      :options="safetyTaskStatus.chartOptions"
                      :series="safetyTaskStatus.series"
                    ></apexchart>
                  </div>
                </y-portlet>
              </b-col> -->
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left portletitem"
              >
                <b-row>
                  <b-col sm="12">
                    <y-portlet
                      label="공사 및 작업허가서 현황"
                      id="woStatus"
                      icon="chart-bar"
                      url="/work/wkod/wkodStatus"
                    >
                      <div slot="portlet-body" style="padding-right: 4px">
                        <apexchart
                          ref="woStatus"
                          type="bar"
                          height="350"
                          :options="woStatus.chartOptions"
                          :series="woStatus.series"
                        ></apexchart>
                      </div>
                    </y-portlet>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="cardrow">
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left portletitem"
              >
                <b-row>
                  <b-col sm="12">
                    <y-portlet
                      label="작업허가서 현황"
                      id="wkodRequestStatus"
                      icon="chart-bar"
                      url="/work/wkod/wkodRequest"
                    >
                      <component
                        v-if="wkodRequestPortlet && wkodRequestPortlet.target"
                        :is="wkodRequestPortlet.target"
                        :portletParam="wkodRequestPortlet.param"
                        :portletHeight="wkodRequestPortlet.height"
                        slot="portlet-body"
                      />
                    </y-portlet>
                  </b-col>
                </b-row>
              </b-col>

              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left portletitem"
              >
                <y-portlet
                  label="일일작업현황"
                  id="dailyWoStatus"
                  icon="wrench"
                  url="/work/wkod/wkodRequest"
                >
                  <component
                    v-if="centerPortlets[0].target"
                    :is="centerPortlets[0].target"
                    :portletParam="centerPortlets[0].param"
                    :portletHeight="centerPortlets[0].height"
                    slot="portlet-body"
                  />
                </y-portlet>
              </b-col>
            </b-row>
            <b-row class="cardrow">
              <b-col
                v-if="leftPortlets[2] && leftPortlets[2].target"
                sm="12"
                md="12"
                lg="12"
                xl="4"
                class="col-xxl-4 main-col-left portletitem"
              >
                <y-portlet
                  label="공지사항"
                  id="notice"
                  icon="comment-dots"
                  url="/manage/notice"
                >
                  <component
                    :is="leftPortlets[2].target"
                    :portletParam="leftPortlets[2].param"
                    :portletHeight="leftPortlets[2].height"
                    slot="portlet-body"
                  />
                </y-portlet>
              </b-col>
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="4"
                class="col-xxl-4 main-col-left portletitem"
              >
                <y-portlet
                  v-if="lawMakingListPortlet && lawMakingListPortlet.target"
                  :label="lawMakingListPortlet.portletNm"
                  :id="lawMakingListPortlet.portletCd"
                  icon="chart-bar"
                  url="/mgt/mgtLaw/lawmaking/lawmakingCheck"
                >
                  <component
                    :is="lawMakingListPortlet.target"
                    :portletParam="lawMakingListPortlet.param"
                    :portletHeight="lawMakingListPortlet.height"
                    slot="portlet-body"
                  />
                </y-portlet>
              </b-col>
              <b-col
                v-if="rightPortlets[0].target"
                sm="12"
                md="12"
                lg="12"
                xl="4"
                class="col-xxl-4 main-col-left portletitem"
              >
                <y-portlet
                  :label="rightPortlets[0].portletNm"
                  :id="rightPortlets[0].id"
                  icon="calendar-check"
                  url="/mgt/scheduleManagement"
                >
                  <component
                    :is="rightPortlets[0].target"
                    :portletParam="rightPortlets[0].param"
                    :portletHeight="rightPortlets[0].height"
                    slot="portlet-body"
                  />
                </y-portlet>
              </b-col>
            </b-row>

            <!-- /차트 예시 -->

            <!-- <b-row v-if="!isExecutive">
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="4"
                class="col-xxl-4 main-col-right"
                style="padding:0px !important"
              >
                <div
                  v-for="portlet in leftPortlets"
                  :key="portlet.portletCd"
                  :class="portlet.colClass"
                >
                  <div v-if="portlet.target" class="portlet-board">
                    <div class="portlet-header">
                      <div>{{ portlet.portletNm }}</div>
                      <span
                        v-if="
                          portlet.redirect != null && portlet.redirect !== ''
                        "
                      >
                        <el-button
                          icon="el-icon-plus"
                          size="mini"
                          title="더보기"
                          circle
                          @click="goLink(portlet.redirect)"
                        ></el-button>
                      </span>
                    </div>
                    <div class="portlet-body">
                      <component
                        :is="portlet.target"
                        :portletParam="portlet.param"
                        :portletHeight="Number(portlet.height)"
                      />
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="4"
                class="col-xxl-4 main-col-center"
                style="padding:0px !important"
              >
                <div
                  v-for="portlet in centerPortlets"
                  :key="portlet.portletCd"
                  :class="portlet.colClass"
                >
                  <div v-if="portlet.target" class="portlet-board">
                    <div class="portlet-header">
                      <div>{{ portlet.portletNm }}</div>
                      <span
                        v-if="
                          portlet.redirect != null && portlet.redirect !== ''
                        "
                      >
                        <el-button
                          icon="el-icon-plus"
                          size="mini"
                          title="더보기"
                          circle
                          @click="goLink(portlet.redirect)"
                        ></el-button>
                      </span>
                    </div>
                    <div class="portlet-body">
                      <component
                        :is="portlet.target"
                        :portletParam="portlet.param"
                        :portletHeight="Number(portlet.height)"
                      />
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="4"
                class="col-xxl-4 main-col-left"
                style="padding:0px !important"
              >
                <div
                  v-for="portlet in rightPortlets"
                  :key="portlet.portletCd"
                  :class="portlet.colClass"
                >
                  <div v-if="portlet.target" class="portlet-board">
                    <div class="portlet-header">
                      <div>{{ portlet.portletNm }}</div>
                      <span
                        v-if="
                          portlet.redirect != null && portlet.redirect !== ''
                        "
                      >
                        <el-button
                          icon="el-icon-plus"
                          size="mini"
                          title="더보기"
                          circle
                          @click="goLink(portlet.redirect)"
                        ></el-button>
                      </span>
                    </div>
                    <div class="portlet-body">
                      <component
                        :is="portlet.target"
                        :portletParam="portlet.param"
                        :portletHeight="Number(portlet.height)"
                      />
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row> -->

            <!-- 일반 메인화면 e -->

            <!-- 공장장(임원) 일때 메인화면 s -->
            <!-- <b-row v-if="isExecutive">
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-right"
                style="padding:0px !important"
              >
                <div
                  v-for="portlet in leftPortlets"
                  :key="portlet.portletCd"
                  :class="portlet.colClass"
                >
                  <div v-if="portlet.target" class="portlet-board">
                    <div class="portlet-header">
                      <div>{{ portlet.portletNm }}</div>
                      <span
                        v-if="
                          portlet.redirect != null && portlet.redirect !== ''
                        "
                      >
                        <el-button
                          icon="el-icon-plus"
                          size="mini"
                          title="더보기"
                          circle
                          @click="goLink(portlet.redirect)"
                        ></el-button>
                      </span>
                    </div>
                    <div class="portlet-body">
                      <component
                        :is="portlet.target"
                        :portletParam="portlet.param"
                        :portletHeight="Number(portlet.height)"
                      />
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left"
                style="padding:0px !important"
              >
                <div
                  v-for="portlet in rightPortlets"
                  :key="portlet.portletCd"
                  :class="portlet.colClass"
                >
                  <div v-if="portlet.target" class="portlet-board">
                    <div class="portlet-header">
                      <div>{{ portlet.portletNm }}</div>
                      <span
                        v-if="
                          portlet.redirect != null && portlet.redirect !== ''
                        "
                      >
                        <el-button
                          icon="el-icon-plus"
                          size="mini"
                          title="더보기"
                          circle
                          @click="goLink(portlet.redirect)"
                        ></el-button>
                      </span>
                    </div>
                    <div class="portlet-body">
                      <component
                        :is="portlet.target"
                        :portletParam="portlet.param"
                        :portletHeight="Number(portlet.height)"
                      />
                    </div>
                  </div>
                </div>
              </b-col>
              <b-col
                sm="12"
                md="12"
                lg="12"
                xl="6"
                class="col-xxl-6 main-col-left"
                style="padding:0px !important"
              >
                <apexchart type="bar" height="350" :options="improveRequest.chartOptions" :series="improveRequest.series"></apexchart>
              </b-col>
            </b-row> -->
            <!-- 공장장(임원) 일때 메인화면 e -->
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <dashboard v-else :isIndexPage="true"></dashboard>
    <y-dialog :param="popupOptions" @closePopup="closePopup"></y-dialog>
  </b-container>
</template>

<script>
import { changeLang } from '@/utils/i18n';
import selectConfig from '@/js/selectConfig';
import Cookies from 'js-cookie';
// [test]
import VueApexCharts from 'vue-apexcharts';
import YPortlet from '@/components/YPortlet';
import _ from 'lodash';
import dashboard from '@/pages/mgt/sapaDashboard.vue';

const addAnnotations = (chartContext, config) => {
  const seriesTotals = config.globals.stackedSeriesTotals;
  const isHorizontal = config.config.plotOptions.bar.horizontal;
  chartContext.clearAnnotations();

  try {
    config.config.xaxis.categories.forEach((category, index) => {
      let percentage = seriesTotals[index].toString();
      chartContext.addPointAnnotation(
        {
          y: isHorizontal
            ? calcHorizontalY(config, index)
            : seriesTotals[index],
          x: isHorizontal ? 0 : category,
          marker: {
            size: 0,
          },
          label: {
            style: {
              background: '#fff',
              color: '#8c8c8c',
              fontWeight: 'bold',
              fontSize: '13px',
              padding: {
                left: 3,
              },
            },
            borderWidth: 0,
            offsetY: 18,
            text: percentage,
          },
        },
        false
      );

      if (isHorizontal) {
        adjustPointAnnotationXCoord(config, index);
      }
    });
  } catch (error) {
    // console.log(`Add point annotation error: ${error.message}`);
  }
};

const calcHorizontalY = (config, index) => {
  const catLength = config.config.xaxis.categories.length;
  const yRange = config.globals.yRange[0];
  const minY = config.globals.minY;
  const halfBarHeight = yRange / catLength / 2;

  return minY + halfBarHeight + 2 * halfBarHeight * (catLength - 1 - index);
};

const adjustPointAnnotationXCoord = (config, index) => {
  const gridWidth = parseInt(config.globals.gridWidth, 10);
  const seriesTotal = config.globals.stackedSeriesTotals[index];
  const minY = config.globals.minY;
  const yRange = config.globals.yRange[0];
  const xOffset = parseInt(
    (gridWidth * (seriesTotal + Math.abs(minY))) / yRange,
    10
  );
  const circle = document.querySelector(
    `.apexcharts-point-annotations circle:nth-of-type(${index + 1})`
  );
  const labelField = document.querySelector(
    `.apexcharts-point-annotations rect:nth-of-type(${index + 1}`
  );
  // const labelFieldXCoord = parseFloat(labelField.getAttribute("x"));
  const labelFieldXCoord = parseInt(labelField.getAttribute('x'), 10);
  const text = document.querySelector(
    `.apexcharts-point-annotations text:nth-of-type(${index + 1}`
  );

  labelField.setAttribute('x', labelFieldXCoord + xOffset);
  text.setAttribute('x', xOffset);
  circle.setAttribute('cx', xOffset);
};

export default {
  name: 'main-index',
  components: {
    apexchart: VueApexCharts,
    YPortlet,
    dashboard,
  },
  props: {},
  data() {
    return {
      noAcciData: {
        idx: 2,
        plantNm: '',
        targetDays: 0,
        totalDays: 0,
        progressDays: 0,
      },
      improvehParam: {
        period: '',
        plantCd: '',
        imprClassCd: '',
        actDeptCd: '',
        subconnNm: '',
        vendorCd: '',
      },
      codeMasterParam: {
        settableYn: '',
        codeDomainCd: '',
        codeGroupCd: 'SAF_IMPR_CLASS',
        codeNm: '',
        useYn: 'Y',
      },
      constwkodParam: {
        dates: '',
        searchDates: '',
        plantCd: '',
      },
      depts: [],
      portletSHE: { portletCd: '', portletNm: '', target: null, param: '' },
      leftPortlets: [{ portletCd: '', portletNm: '', target: null, param: '' }],
      centerPortlets: [
        { portletCd: '', portletNm: '', target: null, param: '' },
      ],
      rightPortlets: [
        { portletCd: '', portletNm: '', target: null, param: '' },
      ],
      searchParam: {
        bizTgtYear: [],
        useYn: '',
      },
      bizTargetData: [],
      isExecutive: false, // 임원여부(공장장 메인화면 처리용)
      plantCd: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      dashboardSettedItems: [],
      // 업무 메뉴용 옵션
      shortCutsMenuOptions: [],
      // 작업허가서 목록 포틀릿 컴포넌트
      wkodRequestPortlet: null,
      // 입법 예고 법규 포틀릿 컴포넌트
      lawMakingListPortlet: null,
      // 개선 요청 및 조치 현황
      improveRequest: {
        series: [{ data: [] }, { data: [] }],
        chartOptions: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            background: '#fff',
            width: '90%',
            events: {
              /**/
              mounted: (chartContext, config) => {
                setTimeout(() => {
                  addAnnotations(chartContext, config);
                });
              },
              updated: (chartContext, config) => {
                setTimeout(() => {
                  addAnnotations(chartContext, config);
                });
              },
              /**/
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff'],
          },
          title: {},
          // dataLabels: {
          //   enabled: true,
          //   style: {
          //     fontSize: '12px',
          //     colors: ["#304758"]
          //   },
          //   formatter: function(value, { seriesIndex, dataPointIndex, w }) {
          //     let indices = w.config.series.map((item, i) => i);
          //     indices = indices.filter(i => !w.globals.collapsedSeriesIndices.includes(i) && _.get(w.config.series, `${i}.data.${dataPointIndex}`) > 0);
          //     if (seriesIndex === _.max(indices)) {

          //       if (w.config.series.length === 2) {
          //         w.config.series.push({
          //           name: '총계',
          //           data: [w.globals.stackedSeriesTotals[dataPointIndex]]
          //         });
          //       } else {
          //         w.config.series[2].data.push(w.globals.stackedSeriesTotals[dataPointIndex]);
          //       }
          //       // w.config.series[dataPointIndex].push({
          //       //   name: '총계',
          //       //   data: [w.globals.stackedSeriesTotals[dataPointIndex]]
          //       // });
          //       return value;
          //     }
          //     return value;
          //   }
          // },
          xaxis: {
            categories: [],
            labels: {
              formatter: function (val) {
                return (
                  (!Number.isInteger(val) ? val.toFixed(1) : val) +
                  (Cookies.get('language') === 'kr' ? '개' : '')
                );
              },
            },
          },
          yaxis: {
            title: {
              text: undefined,
            },
          },
          tooltip: {
            y: {
              formatter: function (val, opt) {
                return (
                  val +
                  (opt.seriesIndex === 0 && opt.w.globals.seriesTotals[1] > 0
                    ? (Cookies.get('language') === 'kr'
                        ? ' (이행율:'
                        : ' (Fulfillment rate:') +
                      Math.round(
                        (opt.w.globals.series[0][opt.dataPointIndex] /
                          (opt.w.globals.series[0][opt.dataPointIndex] +
                            opt.w.globals.series[1][opt.dataPointIndex])) *
                          100
                      ) +
                      '%)'
                    : '')
                );
              },
            },
            x: {
              formatter: function (val, opt) {
                return (
                  val +
                  (opt.w.globals.seriesTotals[1] > 0
                    ? ' (Total:' +
                      (opt.w.globals.series[0][opt.dataPointIndex] +
                        opt.w.globals.series[1][opt.dataPointIndex]) +
                      ')'
                    : '')
                );
              },
            },
          },
          fill: {
            opacity: 1,
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
              // return val + ((opt.seriesIndex === 0 && opt.w.globals.seriesTotals[1] > 0) ? ' (' + Math.round((opt.w.globals.series[0][opt.dataPointIndex] / (opt.w.globals.series[0][opt.dataPointIndex] + opt.w.globals.series[1][opt.dataPointIndex])) * 100) + '%)' : '')
              return val;
            },
          },
        },
      }, // 개선 요청 및 조치 현황 끝
      // 안전 업무 현황
      safetyTaskStatus: {
        series: [
          {
            name:
              Cookies.get('language') === 'kr' ? '안전점검' : 'Safety check',
            data: [44, 55, 57, 56, 10],
          },
          {
            name:
              Cookies.get('language') === 'kr'
                ? '안전관찰'
                : 'Safety observation',
            data: [76, 85, 101, 98, 10],
          },
          {
            name: Cookies.get('language') === 'kr' ? '순회' : 'Patrol',
            data: [35, 41, 36, 26, 45],
          },
          {
            name: Cookies.get('language') === 'kr' ? '아차사고' : 'nearmiss',
            data: [1, 3, 0, 2, 1],
          },
        ],
        chartOptions: {
          chart: {
            type: 'bar',
            height: 350,
            background: '#fff',
            width: '90%',
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          title: {},
          xaxis: {
            categories: ['08-03', '08-04', '08-05', '08-06', '08-07'],
          },
          yaxis: {
            title: {
              text: Cookies.get('language') === 'kr' ? '건수' : '',
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + (Cookies.get('language') === 'kr' ? '건' : '');
              },
            },
          },
        },
      },
      // 안전 업무 현황 끝
      // 공사 및 작업 현황
      woStatus: {
        series: [{ data: [] }, { data: [] }, { data: [] }],
        chartOptions: {
          chart: {
            type: 'bar',
            height: 350,
            background: '#fff',
            width: '90%',
            toolbar: {
              tools: {
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                selection: false,
                download: true,
                reset: false,
              },
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          title: {},
          xaxis: {
            categories: [],
          },
          yaxis: {
            title: {
              text: Cookies.get('language') === 'kr' ? '건수' : '',
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + (Cookies.get('language') === 'kr' ? '건' : '');
              },
            },
          },
        },
      },
      // 안전 업무 현황 끝
      // SHE 지수 현황(line chart)
      sheIndicesStatus: [
        {
          series: [
            {
              name: Cookies.get('language') === 'kr' ? '누적' : 'Accumulate',
              data: [12, 16, 21, 28, 34, 39, 42, 45, 34, 39, 42, 45],
            },
            {
              name: Cookies.get('language') === 'kr' ? '현황' : 'Status',
              data: [12, 4, 5, 7, 6, 5, 3, 3, 6, 5, 3, 3],
            },
          ],
          chartOptions: {
            chart: {
              height: 230,
              type: 'line',
              dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2,
              },
              toolbar: {
                show: true,
              },
              width: '90%',
            },
            colors: ['#77B6EA', '#008FFB'],
            dataLabels: {
              enabled: true,
              offsetY: -5,
              background: {
                enabled: false,
              },
            },
            stroke: {
              // curve: 'smooth'
            },
            title: {
              text:
                Cookies.get('language') === 'kr'
                  ? '안전환경팀(55)'
                  : 'Safety team(55)',
              align: 'left',
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            markers: {
              size: [5, 5],
              fillOpacity: 1,
              // shape: 'circle',
              // radius: 2,
            },
            xaxis: {
              categories: [
                '2020-01',
                '2020-02',
                '2020-03',
                '2020-04',
                '2020-05',
                '2020-06',
                '2020-07',
                '2020-08',
                '2020-09',
                '2020-10',
                '2020-11',
                '2020-12',
              ],
              title: {
                text: Cookies.get('language') === 'kr' ? '월' : 'Month',
              },
            },
            yaxis: {
              title: {
                text:
                  Cookies.get('language') === 'kr'
                    ? '목표/지수'
                    : 'target/indices',
              },
              min: 0,
              max: 50,
            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'right',
              floating: true,
              // offsetY: -25,
              // offsetX: -5
            },
          },
        },
      ],
      // SHE 지수 현황 끝
      improveSearchUrl: '', // 개선관리 차트 정보 url
      codeMasterUrl: '', // 개선관리 항목명 url
    };
  },
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    plantCd() {
      if (this.plantCd) {
        this.setPotlet();
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());

    let userAuthGrps = this.$store.getters.userAuthGrps;
    this.$_.forEach(userAuthGrps, (item) => {
      if (item.authGrpNo === '1029' && item.settingYn === 'Y') {
        this.isExecutive = true;
      }
    });
  },
  mounted() {
    if (this.$store.getters.token !== 'lawmanager') {
      this.init();
    }
  },
  beforeDestory() {},
  methods: {
    changeLang,
    init() {
      this.initshortCutsMenuOptions();
      this.searchParam.bizTgtYear.push(
        this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD')
      );
      this.searchParam.bizTgtYear.push(
        this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD')
      );
      this.searchParam.useYn = 'Y';
      this.plantCd = this.$store.getters.plantCd;

      this.getData();
      if (!this.isExecutive) {
        this.getDepts();
      }
      this.noticeNotify();
      this.setNoAccident();

      this.improveSearchUrl = selectConfig.saf.imprAct.status.url;
      this.codeMasterUrl = selectConfig.manage.codeMaster.list.url;

      this.constwkodList();
      this.improveGetList('ACL02');
      // window.addEventListener('SIDEBAR-CHANGED', this.setNoAccidentPosition);
    },
    initshortCutsMenuOptions() {
      const shortCutsMenuOptions = [
        {
          id: 'workPermit',
          label: '작업허가서',
          url: '/work/wkod/wkodRequest',
          icon: 'wrench',
        },
        {
          id: 'safetyObservation',
          label: '안전관찰',
          url: '/saf/cto',
          icon: 'search-plus',
        },
        {
          id: 'lawsRegulations',
          label: '법규/규정',
          url: '/mgt/mgtLaw',
          icon: 'book',
        },
        {
          id: 'nearmiss',
          label: '아차사고',
          url: '/saf/accident/nearmiss',
          icon: 'exclamation-triangle',
        },
        {
          id: 'accident',
          label: '사고관리',
          url: '/saf/accident/accidentOccur',
          icon: 'pen-square',
        },
        {
          id: 'improvementManagement',
          label: '개선관리',
          url: '/impr/imprAct1_ACT',
          icon: 'check-square',
        },
        {
          id: 'chemicalSubstance',
          label: '화학물질',
          url: '/chm/chemprod',
          icon: 'flask',
        },
      ];

      this.shortCutsMenuOptions = shortCutsMenuOptions;
    },
    getDepts() {
      this.$http.url = selectConfig.manage.dept.treelist.url;
      this.$http.param = {
        pdeptCd: this.$store.getters.deptCd,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.depts = this.$_.map(_result.data, 'deptCd');
          this.setPotlet();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setNoAccidentIdx() {},
    // 개선요청 정보 저장
    improveGetList(actClassCd) {
      this.$http.url = this.codeMasterUrl;
      this.$http.type = 'GET';
      this.$http.param = this.codeMasterParam;
      this.$http.request(
        (_result) => {
          let codeNm = [];
          let codeNmEn = [];
          this.$_.forEach(_result.data, (item) => {
            codeNm.push(item.codeNm);
            codeNmEn.push(item.codeNmEn);
          });

          // this.improveRequest.chartOptions = {
          //   ...this.improveRequest.chartOptions,
          //   ...{
          //     xaxis: {
          //       categories:
          //         Cookies.get('language') === 'kr' ? codeNm : codeNmEn,
          //       labels: {
          //         formatter: function (val) {
          //           return val + (Cookies.get('language') === 'kr' ? '개' : '');
          //         },
          //       },
          //     },
          //   },
          // };

          this.improveRequest.chartOptions.xaxis = {
            categories: Cookies.get('language') === 'kr' ? codeNm : codeNmEn,
            labels: {
              formatter: function (val) {
                return val + (Cookies.get('language') === 'kr' ? '개' : '');
              },
            },
          };

          this.$refs.improveRequest.updateOptions(
            this.improveRequest.chartOptions
          );
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );

      let from =
        this.$comm
          .getCalculatedDate(
            this.$comm.getToday(),
            '-1m',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          )
          .substr(0, 8) + '01';
      let to = this.$comm.getToday();

      this.improvehParam.period = [from, to];
      this.improvehParam.actClassCd = actClassCd;
      this.improvehParam.plantCd = this.plantCd;
      this.$http.url = this.improveSearchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.improvehParam;

      this.$http.request(
        (_result) => {
          let completeCnt = [];
          let imprSum = [];

          this.$_.forEach(_result.data, (item) => {
            completeCnt.push(item.completeCnt);
            imprSum.push(item.notPlanCnt + item.planCnt + item.actCnt);
          });

          this.improveRequest.series = [
            {
              name:
                Cookies.get('language') === 'kr'
                  ? '이행완료'
                  : 'Completion of performance',
              data: completeCnt,
            },
            {
              name:
                Cookies.get('language') === 'kr'
                  ? '개선요청'
                  : 'Request for improvement',
              data: imprSum,
            },
          ];

          // this.$refs.improveRequest.updateSeries(this.improveRequest.series);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 공사및작업허가서 현황 정보 저장
    constwkodList() {
      let from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-2d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let from1 = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let to1 = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '1d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '2d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.constwkodParam.dates = [from, to];
      this.constwkodParam.searchDates = [
        from,
        from1,
        this.$comm.getToday(),
        to1,
        to,
      ];
      this.constwkodParam.plantCd = this.plantCd;

      this.$http.url = selectConfig.main.portlet.constWkod.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.constwkodParam;
      this.$http.request(
        (_result) => {
          let gubun = [];
          let day1 = [];
          let day2 = [];
          let day3 = [];
          let day4 = [];
          let day5 = [];
          this.$_.forEach(_result.data, (item) => {
            gubun.push(item.gubun);
            day1.push(item[from]);
            day2.push(item[from1]);
            day3.push(item[this.$comm.getToday()]);
            day4.push(item[to1]);
            day5.push(item[to]);
          });

          let xaisDays = [];

          for (let i = 0; i < 5; i++) {
            xaisDays.push(this.constwkodParam.searchDates[i].substr(5, 9));
          }

          // this.woStatus.chartOptions = {
          //   ...this.woStatus.chartOptions,
          //   ...{
          //     xaxis: {
          //       categories: xaisDays,
          //     },
          //   },
          // };

          this.woStatus.chartOptions.xaxis = {
            categories: xaisDays,
          };

          this.$refs.woStatus.updateOptions(this.woStatus.series);

          this.woStatus.series = [
            {
              name: Cookies.get('language') === 'kr' ? '공사' : 'Construction',
              data: [day1[0], day2[0], day3[0], day4[0], day5[0]],
            },
            {
              name:
                Cookies.get('language') === 'kr' ? '작업허가' : 'Work permit',
              data: [day1[1], day2[1], day3[1], day4[1], day5[1]],
            },
            {
              name:
                Cookies.get('language') === 'kr'
                  ? '출입인원'
                  : 'Entrance personnel',
              data: [day1[2], day2[2], day3[2], day4[2], day5[2]],
            },
          ];

          // this.$refs.woStatus.updateSeries(this.woStatus.series);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setNoAccident() {
      // 무재해현황
      this.$http.url = selectConfig.saf.noAccidentResult.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        duration: [null, null],
        plantCd: this.plantCd,
        searchFlag: 'LIST',
        deptCd: this.$store.getters.deptCd,
      };

      this.$http.request(
        (_result) => {
          if (_result.data.length > 0) {
            this.noAcciData.idx = 0;
            this.noAcciData.plantNm = _result.data[this.noAcciData.idx].plantNm;
            this.noAcciData.targetDays =
              _result.data[this.noAcciData.idx].targetDays;
            this.noAcciData.totalDays =
              _result.data[this.noAcciData.idx].totalDays;
            this.noAcciData.progressDays =
              _result.data[this.noAcciData.idx].progressDays;
            $('.no-accident-bar').css(
              'width',
              this.noAcciData.progressDays + '%'
            );
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
      // 무재해현황 끝
    },
    setPotlet() {
      this.portletSHE = {
        portletCd: 'PRT02',
        portletNm: 'SHE지수 현황',
        target: () => import(`${'./portlet/SHE.vue'}`),
        param: {
          plantCd: this.plantCd,
        },
        colClass: this.getColClass('1'),
        height: '300',
      };
      // 추후 포틀릿을 개인별로 관리할 수 있으므로, 목록 바인딩 형태로 구현함.
      this.leftPortlets = [];

      if (!this.isExecutive) {
        // this.leftPortlets.push({
        //   portletCd: 'PRT05',
        //   portletNm: '나의 할 일',
        //   target: () => import(`${'./portlet/myInfo.vue'}`),
        //   param: 'Json String...',
        //   colClass: this.getColClass('1'),
        //   height: '140',
        // });
        this.leftPortlets.push({
          portletCd: 'PRT03',
          portletNm: '무재해 현황',
          target: () => import(`${'./portlet/noAccident.vue'}`),
          param: 'Json String...',
          colClass: this.getColClass('1'),
          height: '255',
          // redirect: '/manage/notice',
        });
      }
      this.leftPortlets.push({
        portletCd: 'PRT06',
        portletNm: '공사 및 작업허가서 현황',
        target: () => import(`${'./portlet/wkodStatus.vue'}`),
        param: {
          plantCd: this.plantCd,
        },
        colClass: this.getColClass('1'),
        height: '228',
        // redirect: '/saf/wkod/wkodSearch',
      });

      this.wkodRequestPortlet = {
        portletCd: 'PRT07',
        portletNm: '작업허가서 현황',
        target: () => import(`${'./portlet/wkodRequest.vue'}`),
        param: {
          plantCd: this.plantCd,
        },
        colClass: this.getColClass('1'),
        height: '631',
      };

      this.lawMakingListPortlet = {
        portletCd: 'PRT08',
        portletNm: '입법예고법규',
        target: () => import(`${'./portlet/lawmakingList.vue'}`),
        param: {
          plantCd: this.plantCd,
        },
        colClass: this.getColClass('1'),
        height: '365',
      };

      this.leftPortlets.push({
        portletCd: 'PRT09',
        portletNm: '공지사항',
        target: () => import(`${'./portlet/notice.vue'}`),
        param: {
          plantCd: this.plantCd,
        },
        colClass: this.getColClass('1'),
        height: '420',
        // redirect: '/manage/notice',
      });

      // this.leftPortlets.push({
      //   portletCd: 'PRT07',
      //   portletNm: '현황',
      //   target: () => import(`${'./portlet/status.vue'}`),
      //   param: {
      //     depts: this.depts,
      //     plantCd: this.plantCd,
      //   },
      //   colClass: this.getColClass('1'),
      //   height: '395',
      //   // redirect: '/saf/wkod/wkodSearch',
      // });

      this.centerPortlets = [];
      this.centerPortlets.push({
        portletCd: 'PCT01',
        portletNm: '일일작업현황',
        target: () => import(`${'./portlet/dailyWorkStatus.vue'}`),
        param: {
          plantCd: this.plantCd,
        },
        colClass: this.getColClass('1'),
        height: '800',
        // redirect: '/manage/notice',
      });
      if (!this.isExecutive) {
        // this.centerPortlets.push({
        //   portletCd: 'PRT09',
        //   portletNm: '공지사항',
        //   target: () => import(`${'./portlet/notice.vue'}`),
        //   param: 'Json String...',
        //   colClass: this.getColClass('1'),
        //   height: '250',
        //   // redirect: '/manage/notice',
        // });
      }

      this.rightPortlets = [];
      if (!this.isExecutive) {
        this.rightPortlets.push({
          id: 'schedulePlan',
          portletCd: 'PRT04',
          portletNm: '나의일정관리',
          target: () => import(`${'./portlet/mgtSheCalendar.vue'}`),
          param: 'Json String...',
          colClass: this.getColClass('1'),
          height: 430,
          // redirect: '/manage/notice',
        });
      } else {
        this.rightPortlets.push({
          id: 'noaccident',
          portletCd: 'PRT03',
          portletNm: '무재해 현황',
          target: () => import(`${'./portlet/noAccident.vue'}`),
          param: 'Json String...',
          colClass: this.getColClass('1'),
          height: 255,
          // redirect: '/manage/notice',
        });
      }
      // [test]
      // this.rightPortlets.push({
      //   portletCd: 'PRT08',
      //   portletNm: '개선 요청 및 조치 현황',
      //   target: () => import(`${'./portlet/imprActStatus.vue'}`),
      //   param: {
      //     depts: this.depts,
      //     plantCd: this.plantCd,
      //   },
      //   colClass: this.getColClass('1'),
      //   height: 400,
      //   // redirect: '/impr/imprAct',
      // });
    },
    noticeNotify() {
      // 팝업공지사항이 있는 경우(공지기간에 포함된 것만) 공지사항을 보여줍니다.
      // 공지가 여러개인경우 여러개를 보여줍니다.
      this.$http.url = selectConfig.main.portlet.notice.popup.url;
      this.$http.type = 'get';
      this.$http.request((_result) => {
        this.$_.forEach(_result.data, (item) => {
          this.$notify({
            title: '',
            message: item.notice_contents,
            dangerouslyUseHTMLString: true,
            customClass: 'y-el-notice_notification',
            duration: 20000,
          });
        });
      });
    },
    getData() {
      this.bizTargetData = [
        {
          src: this.publicPath + '/src/assets/images/main-01.png',
        },
        {
          src: this.publicPath + '/src/assets/images/main-02.png',
        },
        {
          src: this.publicPath + '/src/assets/images/main-03.png',
        },
      ];
    },
    getColClass(_width, _height) {
      var colClass = '';
      if (_width === '1') {
        colClass =
          'portlet-item portlet-col-2 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12';
      } else if (_width === '2') {
        colClass =
          'portlet-item portlet-col-3 col-sm-12 col-md-6 col-lg-6 col-xl-12 col-xxl-6';
      } else {
        colClass =
          'portlet-item portlet-col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4';
      }

      return colClass;
    },
    goLink(_url) {
      this.$router.push(_url);
    },
    /**
     * [event] 대쉬보드 설정 팝업 닫기
     */
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDashboardItems();
    },
    getDashboardItems() {
      this.getDashboardSettedItems().then((_result) => {
        if (_result) this.loadPortletComponents();

        // if (!this.dashboardSettedItems.length) {
        //   window.getApp.$emit('ALERT', {
        //     title: '안내',
        //     message: '설정된 대쉬보드가 없어, 권한에 설정된 대쉬보드를 조회합니다.',
        //     type: 'info',
        //   });

        //   this.getAuthGrpDashboardSettedItems().then(_result => {
        //     if (_result) this.loadPortletComponents();
        //   });
        // }
      });
    },
    /**
     * 사용자가 설정한 dashboard 조회
     */
    getDashboardSettedItems() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = this.$format(
          'api/main/portlet/userportlet/{0}',
          this.$store.getters.token
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (!_result.data) {
              this.dashboardSettedItems = [];
              return _resolve(true);
            }
            this.dashboardSettedItems = JSON.parse(
              _result.data.portletAttribute
            );
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    /**
     * 권한 그룹에 설정된 Dashboard Item 조회
     */
    getAuthGrpDashboardSettedItems() {
      return new Promise((_resolve, _reject) => {
        // 현재 설정된 권한 그룹만 filtering
        let currentAuthGrps = this.$_.filter(
          this.$store.getters.userAuthGrps,
          (_item) => {
            return _item.settingYn === 'Y';
          }
        );

        if (!currentAuthGrps.length) return _resolve(true);
        let dashboardSettedItems = null;
        // TODO: 사용자는 여러개의 권한 그룹을 가질 수 있고, 그중에 첫번째 권한 그룹에 설정된 포틀릿 정보를 조회 한다.
        this.$http.url = this.$format(
          'api/main/portlet/authgrpportlet/{0}',
          currentAuthGrps[0].authGrpNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            let hasPortletAttribute = true;
            if (!_result.data) {
              hasPortletAttribute = false;
              this.dashboardSettedItems = [];
            } else {
              dashboardSettedItems = JSON.parse(_result.data.portletAttribute);
              hasPortletAttribute = dashboardSettedItems.length > 0;
              this.dashboardSettedItems = dashboardSettedItems;
            }
            if (!hasPortletAttribute) {
              window.getApp.$emit('ALERT', {
                title: '경고',
                message:
                  '권한 그룹에 설정된 포틀릿이 없습니다. 권한 그룹에 포틀릿을 먼저 설정하시기 바랍니다.',
                type: 'info',
              });
              return _resolve(true);
            }
            _resolve(true);
          },
          (_error) => {
            _reject(_error);
          }
        );
      });
    },
    /**
     * 포틀릿 컴포넌트 로드
     */
    loadPortletComponents() {
      this.$_.forEach(this.dashboardSettedItems, (_item) => {
        this.loadComponent(_item);
      });
    },
    /**
     * id 값을 기준으로 관련 vue 컴포넌트 로딩
     */
    loadComponent(_item) {
      if (_item.id === 'she') {
        _item.component = () => import(`@/pages/portlet/SHE`);
      } else if (_item.id === 'myTask') {
        _item.component = () => import(`@/pages/portlet/myInfo`);
      } else if (_item.id === 'noAccident') {
        _item.component = () => import(`@/pages/portlet/noAccident`);
      } else if (_item.id === 'wkodStatus') {
        _item.component = () => import(`@/pages/portlet/wkodStatus`);
      } else if (_item.id === 'dailyWorkStatus') {
        _item.component = () => import(`@/pages/portlet/dailyWorkStatus`);
      } else if (_item.id === 'notice') {
        _item.component = () => import(`@/pages/portlet/notice`);
      } else if (_item.id === 'noAccident') {
        _item.component = () => import(`@/pages/portlet/noAccident`);
      } else if (_item.id === 'imprActStatus') {
        _item.component = () => import(`@/pages/portlet/imprActStatus`);
      } else if (_item.id === 'mgtSheCalendar') {
        _item.component = () => import(`@/pages/portlet/mgtSheCalendar`);
      }
    },
    /**
     * [이벤트] 포틀릿 설정 변경
     */
    settingChanged(_item) {
      let item = this.$_.find(this.dashboardSettedItems, (__item) => {
        return _item.id === __item.id;
      });

      if (!item) return;
      item[_item.propertyName] = _item.propertyValue;
      this.save();
    },
    /**
     * [이벤트] 설정된 포틀릿 항목 제거
     */
    deleteItem(_item) {
      this.dashboardSettedItems = this.$_.remove(
        this.dashboardSettedItems,
        (__item) => {
          return _item.id !== __item.id;
        }
      );
    },
    /**
     * [이벤트] 포틀릿이 변경되면 저장
     */
    save: function () {
      // this.$http.url = transactionConfig.portlet.user.insert;
      // this.$http.type = 'POST';
      // this.$http.param = {
      //   userId: this.$store.getters.token,
      //   portletAttribute: JSON.stringify(this.dashboardSettedItems)
      // };
      // this.$http.request(
      //   _result => {
      //   },
      //   _error => {
      //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );
    },
    /**
     * [event]
     */
    shortCutsMenuClicked(_url) {
      this.$comm.movePage(this.$router, _url);
    },
    getComponent() {
      return () => import(`${'./portlet/mgtSheCalendar.vue'}`);
    },
  },
};
</script>
<style>
.main-biz-target {
  padding: 0px 15px 15px 15px;
  text-align: center;
}

.portlet-col-1 {
  min-width: 700px;
}

.portlet-col-2 {
  min-width: 350px;
}

.portlet-col-3 {
  min-width: 220px;
}

.carousel-caption {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  /* text-align: left; */
  background-color: transparent;
}

.imgContainer {
  position: relative;
  /* text-align: left; */
  color: white;
  height: 100%;
}

.top-left {
  position: absolute;
  top: 8px;
  left: 16px;
}

.titleImg {
  font-size: 19px;
  font-weight: bold;
}

#main-carousel .el-carousel__item {
  width: 40%;
  /* min-width: 300px; */
  left: 5%;
}

.favorite-card {
  background-color: #409eff;
  padding: 15px 0px;
  color: #fafbff;
  min-width: 109px;
  cursor: pointer;
}

.favorite-card:hover {
  background-color: #ffffff;
  color: #545c64;
}
</style>
