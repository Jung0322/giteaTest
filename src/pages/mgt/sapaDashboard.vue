<!--
  목적 : 경영>중처법 대시보드
  작성자 : pkj
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box @enter="getChartData">
      <b-row slot="search">
        <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-3">
          <b-row>
            <b-col sm="3">
              <y-label label="L0000000789" />
            </b-col>
            <b-col sm="3">
              <!-- 기준년도 -->
              <y-datepicker
                :width="12"
                type="year"
                name="year"
                :default="searchParam.year"
                v-model="searchParam.year"
              />
            </b-col>
            <b-col sm="6">
              <!-- 기준일 -->
              <y-datepicker
                :width="12"
                type="day"
                :range="true"
                name="year"
                :start="minDt"
                :end="maxDt"
                :default="searchParam.period"
                v-model="searchParam.period"
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-tree-dept
            type="search"
            label="L0000005315"
            name="deptCd"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
              하위부서 포함 조회 위해 아래 코드 추가
              :deptSubYn="searchParam.deptSubYn"
              @setDeptSubYn="setDeptSubYn"
             -->
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3 h-100">
      <b-col sm="12">
        <div class="float-right">
          <!-- 검색 -->
          <y-btn title="L0000000327" color="green" @btnClicked="getChartData" />
        </div>
      </b-col>
    </b-row>
    <b-row class="contents-dashboard mt-1">
      <!--// 목표관리 포틀릿(TRIR/중대재해사고/화재폭발사고/환경사고) start //-->
      <b-col sm="12" md="6" lg="3">
        <!-- 목표관리 -->
        <y-portlet
          :id="'content_01'"
          :label="$comm.getLangSpecInfoLabel('L0000005316')"
        >
          <div
            class="parent"
            slot="portlet-body"
            style="overflow-y: auto; overflow-x: hidden"
            :style="{
              height: 189 + 'px',
            }"
          >
            <div class="portlet-wrap">
              <b-row>
                <b-col class="col-3">
                  <div class="h28 b700 text-left">TRIR</div>
                  <div class="h24 b500 text-left">
                    {{ mgtTargetTrirItem.rsltVal }}
                  </div>
                </b-col>
                <b-col class="col-9">
                  <div style="height: 160px" :ref="mgtTargetTrirItem.ref"></div>
                </b-col>
              </b-row>
            </div>
          </div>
        </y-portlet>
      </b-col>
      <b-col
        v-for="(item, idx) in mgtTargetItems"
        :key="item.bizFieldItemNm + '_' + item.biz_field_item_no"
        sm="12"
        md="6"
        lg="3"
      >
        <y-portlet
          :id="'content_' + item.biz_field_item_no"
          :label="
            item.bizFieldItemNm.includes('TRIR')
              ? $comm.getLangSpecInfoLabel('L0000005316') // 목표관리
              : item.bizFieldItemNm.replace('건수', '')
          "
        >
          <div
            class="parent"
            slot="portlet-body"
            style="overflow-y: auto; overflow-x: hidden"
            :style="{
              height: 189 + 'px',
            }"
          >
            <div
              v-if="item.bizFieldItemNm.includes('TRIR')"
              class="portlet-wrap"
            >
              <b-row>
                <b-col class="col-3">
                  <div class="h28 b700 text-left">TRIR</div>
                  <div class="h24 b500 text-left">0.25</div>
                </b-col>
                <b-col class="col-9">
                  <div style="height: 160px" :ref="item.ref"></div>
                </b-col>
              </b-row>
            </div>
            <div v-else class="portlet-wrap p-0">
              <b-row class="m-0 h-100">
                <b-col
                  :class="getMgtTargetItemInfo(item).classNm"
                  style="
                    min-width: 80px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <img :src="getMgtTargetItemInfo(item).imgUrl" alt="" />
                </b-col>
                <b-col class="col-4 p-0">
                  <div
                    class="text-style1"
                    style="height: 50%; border-bottom: 1px solid #e9e9e9"
                  >
                    <!-- 목표(건) -->
                    <div>{{ $comm.getLangSpecInfoLabel('L0000005760') }}</div>
                    <span>{{ item.targetVal }}</span>
                  </div>
                  <div class="text-style1" style="height: 50%">
                    <!-- 실적(건) -->
                    <div>{{ $comm.getLangSpecInfoLabel('L0000005761') }}</div>
                    <span>{{ item.rsltVal }}</span>
                  </div>
                </b-col>
                <b-col class="col-4 p-0">
                  <div
                    class="text-style1"
                    style="height: 100%; border-left: 1px solid #e9e9e9"
                  >
                    <!-- 달성율 -->
                    <div>{{ $comm.getLangSpecInfoLabel('L0000005762') }}</div>
                    <span> {{ item.achievementRate }}</span>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </y-portlet>
      </b-col>
      <!--// 목표관리 포틀릿(중대재해사고/화재폭발사고/환경사고) end //-->

      <!--// SHE 교육관리 ~ 비상대응훈련 포틀릿 start //-->
      <b-col
        sm="12"
        md="4"
        lg="2"
        v-for="(item, idx) in chartList1"
        :key="item.id"
      >
        <y-portlet
          :id="'content_' + item.id"
          :label="item.label"
          :url="item.url"
          :class="idx > 2 ? 'portlet-green' : ''"
        >
          <div
            class="parent"
            slot="portlet-body"
            style="overflow-y: auto; overflow-x: hidden"
            :style="{
              height: 189 + 'px',
            }"
          >
            <div class="portlet-wrap">
              <b-row class="m-0 h-100">
                <b-col
                  class="col-6"
                  style="
                    min-width: 80px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <div class="chart-box">
                    <div class="chart-line">
                      <div class="chart-line-position">
                        <div class="chart-bar">
                          <img
                            v-if="item.id === 'resultedu'"
                            :src="
                              publicPath +
                              '/src/assets/images/trend_icon_01.svg'
                            "
                            :style="`height: ` + (item.total ? '100%' : '0%')"
                            alt="전체"
                          />
                          <div
                            v-else
                            class="bar-style-01"
                            :style="
                              `height: ` +
                              (item.total ? '100%' : '0%') +
                              `; background-color: ` +
                              item.leftBarColor
                            "
                            alt="전체"
                          ></div>
                          <span>{{ item.total }}</span>
                        </div>
                        <div class="chart-bar">
                          <img
                            v-if="item.id === 'resultedu'"
                            :src="
                              publicPath +
                              '/src/assets/images/trend_icon_02.svg'
                            "
                            :style="`height: ` + item.average"
                            alt="완료"
                          />
                          <div
                            v-else
                            class="bar-style-01"
                            :style="
                              `height: ` +
                              item.average +
                              `; background-color: ` +
                              item.rightBarColor
                            "
                            alt="완료"
                          ></div>
                          <span>{{ item.completeCnt }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
                <b-col class="col-6">
                  <div class="text-style2" style="height: 100%">
                    <!-- L0000005305 - 교육 이수율, L0000005244 - 개선 조치율 -->
                    <div>{{ $comm.getLangSpecInfoLabel(item.rateLabel) }}</div>
                    <span>{{ item.average }}</span>
                    <!-- 범례 -->
                    <span class="legend-box-01">
                      <div>
                        <!-- 전체(건) -->
                        <em
                          class="green-tha01"
                          style="background-color: #a6ca58"
                        ></em
                        >{{ $comm.getLangSpecInfoLabel('L0000005765') }}
                      </div>
                      <div>
                        <!-- 완료(건) -->
                        <em
                          class="green-tha02"
                          style="background-color: #ff9036"
                        ></em
                        >{{ $comm.getLangSpecInfoLabel('L0000005766') }}
                      </div>
                    </span>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </y-portlet>
      </b-col>
      <!--// SHE 교육관리 ~ 비상대응훈련 포틀릿 end //-->

      <!--// 사고관리 start //-->
      <b-col sm="12" md="6" lg="3">
        <!-- 사고관리 -->
        <y-portlet
          id="content_08"
          label="L0000005767"
          :url="accidentChartInfo.url"
        >
          <div
            class="parent"
            slot="portlet-body"
            ref=""
            style="overflow-y: auto; overflow-x: hidden"
            :style="{
              height: 189 + 'px',
            }"
          >
            <div class="portlet-wrap">
              <b-row class="m-0 h-100">
                <b-col
                  class="col-4"
                  style="
                    min-width: 80px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <div class="chart-box">
                    <div class="chart-line">
                      <div class="chart-line-position">
                        <div class="chart-bar">
                          <em>{{ Number(accidentChartInfo.year) - 1 }}</em>
                          <div
                            class="bar-style-01"
                            :style="
                              `height: ` +
                              accidentChartInfo.leftHeight +
                              `;
                              margin: 0 10px;
                              background-color: #ff6666;`
                            "
                            alt="전체"
                          ></div>
                          <span>{{ accidentChartInfo.lastVal }}</span>
                        </div>
                        <div class="chart-bar">
                          <em>{{ accidentChartInfo.year }}</em>
                          <div
                            class="bar-style-01"
                            :style="
                              `height: ` +
                              accidentChartInfo.rightHeight +
                              `;
                              margin: 0 10px;
                              background-color: #ff6666;`
                            "
                            alt="완료"
                          ></div>
                          <span>{{ accidentChartInfo.curVal }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
                <b-col class="col-8">
                  <div style="height: 100%" :ref="accidentChartInfo.ref"></div>
                </b-col>
              </b-row>
            </div>
          </div>
        </y-portlet>
      </b-col>
      <!--// 사고관리 end //-->

      <!--// 종사자 의견 관리 start //-->
      <b-col sm="12" md="6" lg="3">
        <!-- 종사자 의견 관리 -->
        <y-portlet
          id="content_09"
          label="L0000005770"
          :url="mgtlistenChartList[0].url"
        >
          <div
            class="parent"
            slot="portlet-body"
            ref=""
            style="overflow-y: auto; overflow-x: hidden"
            :style="{
              height: 189 + 'px',
            }"
          >
            <div class="portlet-wrap p-0">
              <b-row class="m-0 h-100">
                <b-col class="col-12 p-0">
                  <div class="list-tab-wrap h-100">
                    <div class="list-menu">
                      <div
                        class="list-group"
                        id="list-tab"
                        role="tablist"
                        style="width: 100px"
                      >
                        <!-- 채널 -->
                        <div>
                          {{ $comm.getLangSpecInfoLabel('L0000005063') }}
                        </div>
                        <!-- 산업안전위원 -->
                        <a
                          class="list-group-item list-group-item-action active"
                          id="list-home-list"
                          data-toggle="list"
                          href="#list-home"
                          role="tab"
                          aria-controls="home"
                          @click.prevent="setMgtListenChart(0)"
                          >{{ $comm.getLangSpecInfoLabel('L0000005768') }}</a
                        >
                        <!-- 협력업체협의체 -->
                        <a
                          class="list-group-item list-group-item-action"
                          id="list-profile-list"
                          data-toggle="list"
                          href="#list-profile"
                          role="tab"
                          aria-controls="profile"
                          @click.prevent="setMgtListenChart(1)"
                          >{{ $comm.getLangSpecInfoLabel('L0000005769') }}</a
                        >
                        <!-- 기타 -->
                        <a
                          class="list-group-item list-group-item-action"
                          id="list-messages-list"
                          data-toggle="list"
                          href="#list-messages"
                          role="tab"
                          aria-controls="messages"
                          @click.prevent="setMgtListenChart(2)"
                          >{{ $comm.getLangSpecInfoLabel('L0000000794') }}</a
                        >
                      </div>
                    </div>
                    <div class="list-content w-100">
                      <div class="tab-content" id="nav-tabContent">
                        <div
                          class="tab-pane fade show active"
                          id="list-home"
                          role="tabpanel"
                          aria-labelledby="list-home-list"
                        >
                          <div
                            style="height: 155px"
                            :ref="mgtlistenChartList[0].ref"
                          ></div>
                        </div>
                        <div
                          class="tab-pane fade"
                          id="list-profile"
                          role="tabpanel"
                          aria-labelledby="list-profile-list"
                        >
                          <div
                            style="height: 155px"
                            :ref="mgtlistenChartList[1].ref"
                          ></div>
                        </div>
                        <div
                          class="tab-pane fade"
                          id="list-messages"
                          role="tabpanel"
                          aria-labelledby="list-messages-list"
                        >
                          <div
                            style="height: 155px"
                            :ref="mgtlistenChartList[2].ref"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </y-portlet>
      </b-col>
      <!--// 종사자 의견 관리 end //-->

      <!--// 예산 관리 start //-->
      <b-col sm="12" md="12" lg="6">
        <!-- 예산관리 -->
        <y-portlet
          id="content_09"
          label="L0000005771"
          :url="budgetChartList[0].url"
        >
          <div
            class="parent"
            slot="portlet-body"
            ref=""
            style="overflow-y: auto; overflow-x: hidden"
            :style="{
              height: 189 + 'px',
            }"
          >
            <div class="portlet-wrap p-0">
              <b-row class="m-0 h-100">
                <b-col class="col-12 p-0">
                  <div class="list-content-wrap h-100">
                    <!--// -->
                    <div class="list-info-wrap" style="width: 16%">
                      <ul>
                        <li class="list-info-title">
                          안전<br /><span>예산 집행율</span>
                        </li>
                        <li>
                          <div>비용</div>
                          <span>{{ budgetChartList[0].safAverage }}</span>
                        </li>
                        <li>
                          <div>투자</div>
                          <span>{{ budgetChartList[1].safAverage }}</span>
                        </li>
                      </ul>
                    </div>
                    <!--// -->
                    <div class="list-info-wrap" style="width: 16%">
                      <ul>
                        <li class="list-info-title">
                          보건<br /><span>예산 집행율</span>
                        </li>
                        <li>
                          <div>비용</div>
                          <span>{{ budgetChartList[0].heaAverage }}</span>
                        </li>
                        <li>
                          <div>투자</div>
                          <span>{{ budgetChartList[1].heaAverage }}</span>
                        </li>
                      </ul>
                    </div>
                    <!--// -->
                    <div class="list-info-wrap horizontal" style="width: 16%">
                      <ul>
                        <li class="list-info-title">
                          환경<br /><span>예산 집행율</span>
                        </li>
                        <li>
                          <div>비용</div>
                          <span>{{ budgetChartList[0].envAverage }}</span>
                        </li>
                        <li>
                          <div>투자</div>
                          <span>{{ budgetChartList[1].envAverage }}</span>
                        </li>
                      </ul>
                    </div>
                    <!--// -->
                    <div
                      class="list-info-wrap horizontal"
                      style="border: 0; width: 26%"
                    >
                      <ul>
                        <li>
                          <div>총 비용예산 집행율</div>
                          <span span class="point-value">{{
                            budgetChartList[0].average
                          }}</span>
                        </li>
                      </ul>

                      <div class="chart-box horizontal">
                        <div class="chart-line">
                          <div class="chart-line-position">
                            <div class="chart-bar">
                              <div
                                class="bar-style-02"
                                :style="
                                  `width: ` +
                                  (budgetChartList[0].width100Yn === 'Y'
                                    ? '100%'
                                    : '0%') +
                                  `; background-color: #395176`
                                "
                                alt="전체"
                              ></div>
                              <span class="right">{{
                                budgetChartList[0].orgAmt
                              }}</span>
                            </div>
                            <div class="chart-bar column">
                              <div
                                class="bar-style-02"
                                :style="
                                  `width: ` +
                                  budgetChartList[0].average +
                                  `; background-color: #94bf36`
                                "
                                alt="완료"
                              ></div>
                              <span class="left">{{
                                budgetChartList[0].execAmt
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--// -->
                    <div
                      class="list-info-wrap horizontal"
                      style="border: 0; width: 26%"
                    >
                      <ul>
                        <li>
                          <div>총 투자예산 집행율</div>
                          <span class="point-value">{{
                            budgetChartList[1].average
                          }}</span>
                        </li>
                      </ul>
                      <div class="chart-box horizontal">
                        <div class="chart-line">
                          <div class="chart-line-position">
                            <div class="chart-bar">
                              <div
                                class="bar-style-02"
                                :style="
                                  `width: ` +
                                  (budgetChartList[1].width100Yn === 'Y'
                                    ? '100%'
                                    : '0%') +
                                  `; background-color: #395176`
                                "
                                alt="전체"
                              ></div>
                              <span class="right">{{
                                budgetChartList[1].orgAmt
                              }}</span>
                            </div>
                            <div class="chart-bar column">
                              <div
                                class="bar-style-02"
                                :style="
                                  `width: ` +
                                  budgetChartList[1].average +
                                  `; background-color: #94bf36`
                                "
                                alt="완료"
                              ></div>
                              <span class="left">{{
                                budgetChartList[1].execAmt
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 범례 -->
                    <span class="legend-box-02">
                      <div>
                        <em style="background-color: #395176"></em>전체(원)
                      </div>
                      <div>
                        <em style="background-color: #94bf36"></em>완료(원)
                      </div>
                    </span>

                    <!--// -->
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </y-portlet>
      </b-col>
      <!--// 예산 관리 end //-->

      <!--// end //-->
      <!-- <b-col sm="6" md="3" lg="3">
        <y-portlet
          id="mgtTarget"
          label="L0000005316"
          :url="targetUrl"
          style="font-weight: bold; font-size: 14px"
          icon="user-edit"
        >
          <div
            class="parent"
            slot="portlet-body"
            ref="mgtTargetChart"
            style="overflow-y: auto; overflow-x: hidden"
            :style="{
              height: portletHeight - 55 + 'px',
            }"
          >
            <b-row>
              <b-col
                class="child"
                v-for="(item, idx) in mgtTargetItems"
                :key="idx"
                sm="6"
                @click="onTargetClick(item)"
              >
                <span style="font-weight: bold; font-size: 14px">{{
                  item.bizFieldItemNm
                }}</span
                ><br />
                <span style="font-weight: normal"
                  >목표 : {{ item.targetVal }}</span
                ><br />
                <span style="font-weight: normal"
                  >실적 : {{ item.rsltVal }}</span
                >
              </b-col>
            </b-row>
          </div>
        </y-portlet>
      </b-col> -->
      <!-- <div
          v-for="(item, i) in imprList"
          :key="i"
          :ref="'chart' + i"
          :style="{ width: '33%', height: portletHeight - 55 + 'px' }"
        ></div> -->
      <b-col v-for="(item, idx) in chartList3" :key="idx" sm="3">
        <y-portlet
          :id="item.id"
          :label="item.label"
          :url="item.url"
          style="font-weight: bold; font-size: 14px"
          icon="chart-bar"
          @menuAuthChk="menuAuthChk()"
        >
          <div
            slot="portlet-body"
            :ref="item.ref"
            :style="{
              height: portletHeight - 55 + 'px',
            }"
          ></div>
        </y-portlet>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

import echarts from 'echarts';
require('echarts/theme/macarons');
import { debounce } from '@/utils';

import YPortlet from '@/components/YPortlet';

export default {
  name: 'sapa-dashboard',
  components: {
    YPortlet,
  },
  props: {
    portletParam: {
      type: String,
      default: '',
    },
    portletHeight: {
      type: Number,
      default: 350,
    },
    isIndexPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      mgtTargetTrirItem: {
        biz_field_item_no: 0,
        bizFieldItemNm: 'TRIR',
        targetVal: 0,
        rsltVal: 0,
        achievementRate: '0%',
        ref: 'chartTrirRef',
        chart: null,
        chartOption: null,
      },
      mgtTargetItems: [
        {
          biz_field_item_no: 1,
          bizFieldItemNm: '중대재해사고',
          targetVal: 0,
          rsltVal: 0,
          achievementRate: '0%',
        }, // 중대재해사고
        {
          biz_field_item_no: 2,
          bizFieldItemNm: '화재폭발사고',
          targetVal: 0,
          rsltVal: 0,
          achievementRate: '0%',
        }, // 화재폭발사고
        {
          biz_field_item_no: 3,
          bizFieldItemNm: '환경사고',
          targetVal: 0,
          rsltVal: 0,
          achievementRate: '0%',
        }, // 환경사고
      ],
      areaType: null,
      chartList1: [
        {
          id: 'resultedu',
          label: 'L0000005306',
          url: 'notperMission',
          ref: 'chartResultEdu',
          total: 0, // 전체
          completeCnt: 0, // 완료
          average: '0%', // 비율
          rateLabel: 'L0000005305', // 교육 이수율
          leftBarColor: '#94bf36', // 전체 Bar 컬러
          rightBarColor: '#ff9036', // 완료 Bar 컬러
        }, // SHE 교육관리
        {
          id: 'safetyhealth',
          label: 'L0000005274',
          url: 'notperMission',
          ref: 'chartSafetyhealth',
          total: 0, // 전체
          completeCnt: 0, // 완료
          average: '0%', // 비율
          rateLabel: 'L0000005244', // 개선 조치율
          leftBarColor: '#94bf36', // 전체 Bar 컬러
          rightBarColor: '#ff9036', // 완료 Bar 컬러
        }, // 안전보건법령 이행
        {
          id: 'safGovImpl',
          label: 'L0000005296',
          url: 'notperMission',
          ref: 'chartSafGovImpl',
          total: 0, // 전체
          completeCnt: 0, // 완료
          average: '0%', // 비율
          rateLabel: 'L0000005244', // 개선 조치율
          leftBarColor: '#94bf36', // 전체 Bar 컬러
          rightBarColor: '#ff9036', // 완료 Bar 컬러
        }, // 정부지자체 시정조치 이행
        {
          id: 'safDisaInsp',
          label: 'L0000005348',
          url: 'notperMission',
          ref: 'chartSafDisaInsp',
          total: 0, // 전체
          completeCnt: 0, // 완료
          average: '0%', // 비율
          rateLabel: 'L0000005244', // 개선 조치율
          leftBarColor: '#fff', // 전체 Bar 컬러
          rightBarColor: '#fff833', // 완료 Bar 컬러
        }, // 중대시민재해점검
        {
          id: 'rsa_w',
          label: 'L0000005262',
          url: 'notperMission',
          ref: 'chartRsaWork',
          total: 0, // 전체
          completeCnt: 0, // 완료
          average: '0%', // 비율
          rateLabel: 'L0000005244', // 개선 조치율
          leftBarColor: '#fff', // 전체 Bar 컬러
          rightBarColor: '#fff833', // 완료 Bar 컬러
        }, // 작업위험성평가
        {
          id: 'training',
          label: 'L0000005270',
          url: 'notperMission',
          ref: 'chartSafTraining',
          total: 0, // 전체
          completeCnt: 0, // 완료
          average: '0%', // 비율
          rateLabel: 'L0000005244', // 개선 조치율
          leftBarColor: '#fff', // 전체 Bar 컬러
          rightBarColor: '#fff833', // 완료 Bar 컬러
        }, // 비상대응훈련
      ],
      accidentChartInfo: {
        id: 'accident',
        label: 'L0000004616',
        url: 'notperMission',
        ref: 'chartSafAccident',
        data: [],
        lastVal: 0,
        curVal: 0,
        year: '',
        leftHeight: '100%',
        rightHeight: '100%',
      }, // 사고 관리,
      mgtlistenChartList: [
        {
          id: 'listen_CMCL1',
          url: 'notperMission',
          ref: 'chartMgtListen_CMCL1',
          data: [],
        }, // 종사자의견 관리 - 산업안전위원 채널
        {
          id: 'listen_CMCL2',
          url: 'notperMission',
          ref: 'chartMgtListen_CMCL2',
          data: [],
        }, // 종사자의견 관리 - 협력업체협의체 채널
        {
          id: 'listen_CMCL3',
          url: 'notperMission',
          ref: 'chartMgtListen_CMCL3',
          data: [],
        }, // 종사자의견 관리 - 기타 채널
      ],
      budgetChartList: [
        {
          id: 'budgetManagement',
          label: 'L0000005314',
          url: 'notperMission',
          ref: 'chartBudgetCost',
          safAverage: '0%', // 안전 비용예산 집행율
          heaAverage: '0%', // 보건 비용예산 집행율
          envAverage: '0%', // 환경 비용예산 집행율
          orgAmt: 0, // 비용예산 편성금액
          execAmt: 0, // 비용예산 집행금액
          average: '0%', // 비용예산 집행률
          width100Yn: 'Y', // 편성금액 길이
        }, // SHE비용예산 관리
        {
          id: 'budgetManagement',
          label: 'L0000005313',
          url: 'notperMission',
          ref: 'chartBudgetInvestMent',
          safAverage: '0%', // 안전 투자예산 집행율
          heaAverage: '0%', // 보건 투자예산 집행율
          envAverage: '0%', // 환경 투자예산 집행율
          orgAmt: 0, // 투자예산 편성금액
          execAmt: 0, // 투자예산 집행금액
          average: '0%', // 투자예산 집행률
          width100Yn: 'Y', // 편성금액 길이
        }, // SHE투자예산 관리
      ],
      chartList3: [
        {
          id: 'rsa_p',
          label: 'L0000005263',
          url: 'notperMission',
          ref: 'chartRsaProc',
        }, // 공정위험성평가 관리
        {
          id: 'budgetManagement',
          label: 'L0000005300',
          url: 'notperMission',
          ref: 'chartElectEval',
        }, // 법정선임자평가 관리
        {
          id: 'elect',
          label: 'L0000005303',
          url: 'notperMission',
          ref: 'chartElectHis',
        }, // 법정선임자 선해임 관리
        {
          id: 'resultmgmt',
          label: 'L0000005304',
          url: 'notperMission',
          ref: 'chartResultmgmt',
        }, // 평가및안전보건비용 관리
      ],
      chartOptions: null, // 차트 옵션
      searchParam: {
        plantCd: null,
        year: '',
        deptSubYn: 'Y',
        deptCd: '',
        period: [],
        startDt: '',
        endDt: '',
      },
      minDt: '',
      maxDt: '',
    };
  },
  computed: {
    targetUrl: {
      get: function () {
        let targetCompany = this.$_.filter(this.$store.getters.allAuthMenu, {
          menuId: 'MGT40005',
        });
        let targetPlant = this.$_.filter(this.$store.getters.allAuthMenu, {
          menuId: 'MGT40006',
        });
        let targetDept = this.$_.filter(this.$store.getters.allAuthMenu, {
          menuId: 'MGT40007',
        });
        if (
          this.searchParam.plantCd &&
          this.searchParam.deptCd &&
          targetDept.length > 0
        ) {
          this.areaType = 'dept';
          return '/mgt/mgtTarget/mgtTarget/mgtTargetStatus_dept';
        } else if (
          this.searchParam.plantCd &&
          !this.searchParam.deptCd &&
          targetPlant.length > 0
        ) {
          this.areaType = 'plant';
          return '/mgt/mgtTarget/mgtTarget/mgtTargetStatus_plant';
        } else if (targetCompany.length > 0) {
          this.areaType = 'company';
          return '/mgt/mgtTarget/mgtTarget/mgtTargetStatus_company';
        } else {
          return 'notperMission';
        }
      },
      set: function (newValue) {},
    },
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    'searchParam.year': function (newVal, oldVal) {
      if (this.searchParam.year) {
        this.minDt = this.searchParam.year + '-01-01';
        this.maxDt = this.searchParam.year + '-12-31';
        this.searchParam.period = [this.minDt, this.maxDt];
      }
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.mgtTargetTrirItem.chart.dispose();
    this.mgtTargetTrirItem.chart = null;
    this.accidentChartInfo.chart.dispose();
    this.accidentChartInfo.chart = null;
    this.mgtlistenChartList[0].chart.dispose();
    this.mgtlistenChartList[0].chart = null;
    this.mgtlistenChartList[1].chart.dispose();
    this.mgtlistenChartList[1].chart = null;
    this.mgtlistenChartList[2].chart.dispose();
    this.mgtlistenChartList[2].chart = null;
    this.chartList3[0].chart.dispose();
    this.chartList3[0].chart = null;
    this.chartList3[1].chart.dispose();
    this.chartList3[1].chart = null;
    this.chartList3[2].chart.dispose();
    this.chartList3[2].chart = null;
    this.chartList3[3].chart.dispose();
    this.chartList3[3].chart = null;
  },
  methods: {
    init() {
      this.searchParam.year = this.$comm.moment().format('YYYY');
      let from = this.$comm.moment().format('YYYY-01-01');
      let to = this.$comm.moment().format('YYYY-12-31');
      this.searchParam.period = [from, to];
      this.authChk();
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined' && !this.isIndexPage) {
        this.searchParam = searchParamByCookie;
        this.searchParam.period = [
          this.searchParam.startDt,
          this.searchParam.endDt,
        ];
      }

      this.accidentChartInfo.year = this.searchParam.year;

      this.getChartData();
    },
    onTargetClick(data) {
      data.areaType = this.areaType;
      data.popupMode = true;
      data.plantCd = this.searchParam.plantCd;
      data.deptCd = this.searchParam.deptCd;
      data.bizFieldCd = 'MBFD6'; // 안전

      this.popupOptions.title = 'L0000005316'; // '목표 관리';
      this.popupOptions.target = () =>
        import(`${'@/pages/mgt/mgtTarget/mgtTargetStatus.vue'}`);

      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopup;
    },
    getMgtTargetItems(mgtTargetItems) {
      let trirItem = this.$_.cloneDeep(mgtTargetItems[0]);
      this.mgtTargetTrirItem.biz_field_item_no = trirItem.biz_field_item_no;
      this.mgtTargetTrirItem.bizFieldItemNm = trirItem.bizFieldItemNm;
      this.mgtTargetTrirItem.targetVal = trirItem.targetVal;
      this.mgtTargetTrirItem.rsltVal = trirItem.rsltVal;
      this.mgtTargetTrirItem.achievementRate = trirItem.achievementRate;

      mgtTargetItems.splice(0, 1);
      let size = mgtTargetItems.length;

      for (let i = 0; i < size; i++) {
        this.mgtTargetItems[i].biz_field_item_no =
          mgtTargetItems[i].biz_field_item_no;
        this.mgtTargetItems[i].bizFieldItemNm =
          mgtTargetItems[i].bizFieldItemNm;
        this.mgtTargetItems[i].targetVal = mgtTargetItems[i].targetVal;
        this.mgtTargetItems[i].rsltVal = mgtTargetItems[i].rsltVal;
        this.mgtTargetItems[i].achievementRate =
          mgtTargetItems[i].achievementRate;
      }

      // this.mgtTargetTrirItem.chartOption = this.$_.cloneDeep(this.chartOptions);

      this.mgtTargetTrirItem.chartOption = {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '90%'],
            radius: '140%',
            min: 0,
            max: 1,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.33, '#a4db8d'],
                  [0.67, '#ffbe5f'],
                  [1, '#ff6666'],
                ],
              },
            },
            // pointer: {
            //   icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            //   length: '80%',
            //   width: 5,
            //   offsetCenter: [0, 80],
            //   itemStyle: {
            //     color: '#333333',
            //   },
            // },
            axisTick: {
              show: false,
              length: 0,
              distance: 0,
            },
            splitLine: {
              show: false,
              length: 0,
              distance: 0,
            },
            axisLabel: {
              color: '#464646',
              distance: -20,
            },
            title: {
              show: false,
            },
            detail: {
              fontSize: 10,
              offsetCenter: [0, '-35%'],
              valueAnimation: true,
              formatter: function (value) {
                return String(Math.round(value * 100));
              },
              color: 'inherit',
            },
            data: [this.mgtTargetTrirItem.rsltVal],
          },
        ],
      };
      // this.mgtTargetTrirItem.chartOption.series[0] = {
      //   type: 'gauge',
      //   startAngle: 180,
      //   endAngle: 0,
      //   center: ['50%', '90%'],
      //   radius: '140%',
      //   min: 0,
      //   max: 1,
      //   splitNumber: 10,
      //   axisLine: {
      //     lineStyle: {
      //       width: 10,
      //       color: [
      //         [0.33, '#7CFFB2'],
      //         [0.67, '#FDDD60'],
      //         [1, '#FF6E76'],
      //       ],
      //     },
      //   },
      //   pointer: {
      //     icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
      //     length: '-80%',
      //     width: 5,
      //     offsetCenter: [0, 80],
      //     itemStyle: {
      //       color: '#333333',
      //     },
      //   },
      //   axisTick: {
      //     show: false,
      //     length: 0,
      //     distance: 0,
      //   },
      //   splitLine: {
      //     show: false,
      //     length: 0,
      //     distance: 0,
      //   },
      //   axisLabel: {
      //     color: '#464646',
      //     distance: -20,
      //   },
      //   title: {
      //     show: false,
      //   },
      //   data: [this.mgtTargetTrirItem.rsltVal],
      // };

      this.mgtTargetTrirItem.chart = echarts.init(
        this.$refs[this.mgtTargetTrirItem.ref],
        'macarons'
      );
      this.mgtTargetTrirItem.chart.setOption(
        this.mgtTargetTrirItem.chartOption
      );
    },
    getMgtListenImprs(mgtListenImprs) {
      let size = this.mgtlistenChartList.length;
      for (let i = 0; i < size; i++) {
        // CMCL1 - 산업안전위원회_채널
        // CMCL2 - 협력업체협의체_채널
        // CMCL3 - 기타_채널
        this.mgtlistenChartList[i].data = this.$_.cloneDeep(
          mgtListenImprs
        ).filter((item) => item.cmiClsCd === 'CMCL' + String(i + 1));

        this.mgtlistenChartList[i].chartOption = this.$_.cloneDeep(
          this.chartOptions
        );

        let xAxis = this.mgtlistenChartList[i].data.map((item) => item.plantNm);
        this.mgtlistenChartList[i].chartOption.xAxis = [
          {
            type: 'category',
            data: xAxis,
            axisLine: {
              lineStyle: {
                color: '#cccccc',
              },
            },
            axisLabel: {
              padding: 0,
              fontSize: 10,
              color: '#333333',
            },
          },
        ];

        let maxInterval = 0;
        this.mgtlistenChartList[i].data
          .map((item) => item.total)
          .forEach((val) => {
            maxInterval = maxInterval > val ? maxInterval : val;
          });

        this.mgtlistenChartList[i].chartOption.yAxis = [
          {
            type: 'value',
            show: false,
            maxInterval: maxInterval,
          },
        ];

        this.mgtlistenChartList[i].chartOption.grid = {
          left: '1%',
          right: '1%',
          bottom: '3%',
          top: '20%',
          containLabel: true,
        };

        this.mgtlistenChartList[i].chartOption.legend = {
          show: true,
          top: 'top',
          right: '5%',
          orient: 'horizontal',
          textStyle: {
            fontSize: 10,
          },
          padding: 0,
        };

        let series = [
          {
            name: '완료(건)',
            id: 'completeCnt',
            type: 'bar',
            barWidth: '35%',
            itemStyle: { color: '#4f7300' },
            data: this.mgtlistenChartList[i].data.map(
              (item) => item.completeCnt
            ),
            stack: 'CMCL' + String(i + 1),
            label: {
              normal: {
                show: true,
                position: ['120%', '-50%'],
                formatter: (params) => {
                  let retVal = params.data ? params.data : '';

                  if (!series[1].data[params.dataIndex]) {
                    retVal = '';
                  }

                  return retVal;
                },
                color: '#333333',
              },
            },
          },
          {
            name: '개선요청(건)',
            id: 'total',
            type: 'bar',
            itemStyle: { color: '#94bf36' },
            data: this.mgtlistenChartList[i].data.map(
              (item) => item.total - item.completeCnt
            ),
            stack: 'CMCL' + String(i + 1),
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  let total = 0;
                  series.forEach((axis) => {
                    total += axis.data[params.dataIndex];
                  });

                  return total ? total : '';
                },
                color: '#333333',
              },
            },
          },
        ];

        this.mgtlistenChartList[i].chartOption.series = series;
        this.mgtlistenChartList[i].chart = echarts.init(
          this.$refs[this.mgtlistenChartList[i].ref],
          'macarons'
        );
        this.mgtlistenChartList[i].chart.setOption(
          this.mgtlistenChartList[i].chartOption
        );
      }
    },
    getSafAccidentChart(safAccidentType, safAccidentYear) {
      // 사고관리
      let total = 0;

      this.accidentChartInfo.lastVal = safAccidentYear[0].lastVal;
      this.accidentChartInfo.curVal = safAccidentYear[0].curVal;
      this.accidentChartInfo.leftHeight =
        safAccidentYear[0].lastVal < safAccidentYear[0].curVal
          ? safAccidentYear[0].lastRate
          : '100%';
      this.accidentChartInfo.rightHeight =
        safAccidentYear[0].lastVal > safAccidentYear[0].curVal
          ? safAccidentYear[0].curRate
          : '100%';
      this.accidentChartInfo.year = this.$comm
        .moment(this.searchParam.endDt)
        .format('YYYY');

      this.accidentChartInfo.data = safAccidentType;

      safAccidentType.forEach((item) => {
        total += Number(item.value);
      });

      this.accidentChartInfo.chartOption = this.$_.cloneDeep(this.chartOptions);
      this.accidentChartInfo.chartOption.title = [
        {
          text: this.$comm.getLangSpecInfoLabel('L0000003405', {
            s1: total,
          }), // 총 {s1}건
          left: '24%',
          top: 'middle',
          textStyle: {
            fontSize: 12,
            color: '#333333',
          },
        },
      ];

      this.accidentChartInfo.chartOption.legend = {
        top: 'center',
        orient: 'vertical',
        right: '1%',
      };

      this.accidentChartInfo.chartOption.series[0].center = ['35%', '50%'];
      this.accidentChartInfo.chartOption.series[0].radius = ['50%', '85%'];
      this.accidentChartInfo.chartOption.series[0].data =
        this.accidentChartInfo.data;
      this.accidentChartInfo.chartOption.series[0].color = [
        '#ff9036',
        '#425dc3',
        '#99d182',
        '#333333',
      ];

      this.accidentChartInfo.chart = null;
      this.accidentChartInfo.chart = echarts.init(
        this.$refs[this.accidentChartInfo.ref],
        'macarons'
      );
      this.accidentChartInfo.chart.setOption(
        this.accidentChartInfo.chartOption
      );
    },
    getMgtBudgetChart(budGetCoseList, budgetInvestMentList) {
      budGetCoseList.forEach((item) => {
        switch (item.budgetTypeNm) {
          case 'total':
            // 총 비용예산 정보
            this.budgetChartList[0].orgAmt = item.orgAmt; // 편성금액
            this.budgetChartList[0].width100Yn =
              Number(item.orgAmt.replaceAll(',', '')) > 0 ? 'Y' : 'N'; // 편성금액 길이
            this.budgetChartList[0].execAmt = item.execAmt; // 집행금액
            this.budgetChartList[0].average = item.average; // 집행률
            break;
          case '안전':
            this.budgetChartList[0].safAverage = item.average; // 집행률
            break;
          case '보건':
            this.budgetChartList[0].heaAverage = item.average; // 집행률
            break;
          case '환경':
            this.budgetChartList[0].envAverage = item.average; // 집행률
            break;
        }
      }); // 비용예산

      budgetInvestMentList.forEach((item) => {
        switch (item.budgetTypeNm) {
          case 'total':
            // 총 비용예산 정보
            this.budgetChartList[1].orgAmt = item.orgAmt; // 편성금액
            this.budgetChartList[1].width100Yn =
              Number(item.orgAmt.replaceAll(',', '')) > 0 ? 'Y' : 'N'; // 편성금액 길이
            this.budgetChartList[1].execAmt = item.execAmt; // 집행금액
            this.budgetChartList[1].average = item.average; // 집행률
            break;
          case '안전':
            this.budgetChartList[1].safAverage = item.average; // 집행률
            break;
          case '보건':
            this.budgetChartList[1].heaAverage = item.average; // 집행률
            break;
          case '환경':
            this.budgetChartList[1].envAverage = item.average; // 집행률
            break;
        }
      }); // 투자예산
    },
    getChartData() {
      this.searchParam.startDt = this.searchParam.period[0];
      this.searchParam.endDt = this.searchParam.period[1];
      this.dummyChart();
      this.$http.url = selectConfig.mgt.sapaDashboard.list.url;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.getMgtTargetItems(_result.data.mgtTargetItems);
          this.getMgtListenImprs(_result.data.mgtListenImprs);
          this.getSafAccidentChart(
            _result.data.safAccidentType, // 사고관리 유형별 (pie chart)
            _result.data.safAccidentYear // 사고관리 년도별
          );
          this.getMgtBudgetChart(
            _result.data.budGetCoseList,
            _result.data.budgetInvestMentList
          );
          this.createChart(_result.data.dashBoardList);

          if (!this.isIndexPage) {
            this.$comm.pushCookie(this.searchParam);
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    dummyChart() {
      this.chartOptions = {
        legend: {
          show: false,
        },
        title: {},
        tooltip: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'pie',
            radius: ['61%', '90%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            data: [],
            color: ['#F84919', '#4CCC27'],
          },
        ],
      };
    },
    createChart(_result) {
      let rowIndex = 0;
      let title = '';
      let data = [];
      if (_result.length > 0) {
        this.$_.forEach(_result, (item) => {
          rowIndex = Number(item.rowIndex);

          title = item.imprNm;

          data = [];
          data.push(
            {
              value: item.total - item.completeCnt,
              name: '미완료',
            },
            { value: item.completeCnt, name: '완료' }
          );

          if (rowIndex <= 6) {
            this.chartList1[rowIndex - 1].total = item.total;
            this.chartList1[rowIndex - 1].completeCnt = item.completeCnt;
            this.chartList1[rowIndex - 1].average = item.average;
          } else if (rowIndex === 14) {
            // 공정 위험성평가
            this.chartList3[0].chartOption = this.$_.cloneDeep(
              this.chartOptions
            );

            this.chartList3[0].chartOption.title = [
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005244'), // 개선조치율
                left: 'center',
                top: '35%',
                textStyle: {
                  color: 'black',
                },
                link: null,
              },
              {
                text: item.average,
                left: 'center',
                top: '45%',
                textStyle: {
                  color: 'blue',
                },
                triggerEvent: true,
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005247', {
                  s1: String(item.total),
                }), // 전체 : {s1} 건
                left: 'center',
                top: '54%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005248', {
                  s1: String(item.completeCnt),
                }), // 완료 : {s1} 건
                left: 'center',
                top: '61%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
            ];
            this.chartList3[0].chartOption.series[0].data = data;
            this.chartList3[0].chart = echarts.init(
              this.$refs[this.chartList3[0].ref][0],
              'macarons'
            );
            this.chartList3[0].chart.setOption(this.chartList3[0].chartOption);
            this.chartList3[0].chart.on('click', (params) => {
              if (
                params.componentType === 'title' &&
                params.componentIndex === 1
              ) {
                this.imprPopup('rsaProc');
              }
            });
          } else if (rowIndex === 11) {
            // 법정선임자 평가 관리
            this.chartList3[1].chartOption = this.$_.cloneDeep(
              this.chartOptions
            );
            this.chartList3[1].chartOption.title = [
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005299'), // 평가 실시율
                left: 'center',
                top: '35%',
                textStyle: {
                  color: 'black',
                },
                link: null,
              },
              {
                text: item.average,
                left: 'center',
                top: '45%',
                textStyle: {
                  color: 'blue',
                },
                triggerEvent: true,
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005247', {
                  s1: String(item.total),
                }), // 전체 : {s1} 건
                left: 'center',
                top: '54%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005248', {
                  s1: String(item.completeCnt),
                }), // 완료 : {s1} 건
                left: 'center',
                top: '61%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
            ];
            this.chartList3[1].chartOption.series[0].data = data;
            this.chartList3[1].chart = echarts.init(
              this.$refs[this.chartList3[1].ref][0],
              'macarons'
            );
            this.chartList3[1].chart.setOption(this.chartList3[1].chartOption);
            this.chartList3[1].chart.on('click', (params) => {
              if (
                params.componentType === 'title' &&
                params.componentIndex === 1
              ) {
                this.imprPopup('electEval');
              }
            });
          } else if (rowIndex === 12) {
            // 법정선임자 선해임 관리
            this.chartList3[2].chartOption = this.$_.cloneDeep(
              this.chartOptions
            );
            this.chartList3[2].chartOption.title = [
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005302'), // 선임율
                left: 'center',
                top: '35%',
                textStyle: {
                  color: 'black',
                },
                link: null,
              },
              {
                text: item.average,
                left: 'center',
                top: '45%',
                textStyle: {
                  color: 'blue',
                },
                triggerEvent: true,
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005247', {
                  s1: String(item.total),
                }), // 전체 : {s1} 건
                left: 'center',
                top: '54%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005248', {
                  s1: String(item.completeCnt),
                }), // 완료 : {s1} 건
                left: 'center',
                top: '61%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
            ];
            this.chartList3[2].chartOption.series[0].data = data;
            this.chartList3[2].chart = echarts.init(
              this.$refs[this.chartList3[2].ref][0],
              'macarons'
            );
            this.chartList3[2].chart.setOption(this.chartList3[2].chartOption);
            this.chartList3[2].chart.on('click', (params) => {
              if (
                params.componentType === 'title' &&
                params.componentIndex === 1
              ) {
                this.imprPopup('electHis');
              }
            });
          } else if (rowIndex === 13) {
            // 평가및안전보건비용 관리
            this.chartList3[3].chartOption = this.$_.cloneDeep(
              this.chartOptions
            );
            this.chartList3[3].chartOption.title = [
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005299'), // 평가 실시율
                left: 'center',
                top: '35%',
                textStyle: {
                  color: 'black',
                },
                link: null,
              },
              {
                text: item.average,
                left: 'center',
                top: '45%',
                textStyle: {
                  color: 'blue',
                },
                triggerEvent: true,
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005247', {
                  s1: String(item.total),
                }), // 전체 : {s1} 건
                left: 'center',
                top: '54%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
              {
                text: this.$comm.getLangSpecInfoLabel('L0000005248', {
                  s1: String(item.completeCnt),
                }), // 완료 : {s1} 건
                left: 'center',
                top: '61%',
                textStyle: {
                  color: 'black',
                  fontSize: 13,
                },
              },
            ];
            this.chartList3[3].chartOption.series[0].data = data;
            this.chartList3[3].chart = echarts.init(
              this.$refs[this.chartList3[3].ref][0],
              'macarons'
            );
            this.chartList3[3].chart.setOption(this.chartList3[3].chartOption);
            this.chartList3[3].chart.on('click', (params) => {
              if (
                params.componentType === 'title' &&
                params.componentIndex === 1
              ) {
                this.imprPopup('resultmgmt');
              }
            });
          }
        });
      }
    },
    imprPopup(flag) {
      let data = {};
      let strParam = '';
      data.plantCd = !this.searchParam.plantCd
        ? null
        : this.searchParam.plantCd;
      data.startDt = this.searchParam.startDt;
      data.endDt = this.searchParam.endDt;
      data.dashMode = true;
      data.monFlag = '100';
      data.actDeptCd = !this.searchParam.deptCd ? '' : this.searchParam.deptCd;
      if (flag === 'rsaProc') {
        // 공정위험성평가
        strParam = (data.plantCd !== null ? data.plantCd : '') + '||proc';
        data.strParam = strParam;
        data.imprClassCd = 'ICL42';
      } else if (flag === 'electEval') {
        // 법정선임자 평가
        data.rowIndex = '11';
      } else if (flag === 'electHis') {
        // 법정선임자 선해임
        data.rowIndex = '12';
      } else if (flag === 'resultmgmt') {
        // 평가및안전보건비용 관리
        data.rowIndex = '13';
      }
      this.openImprPopup(data);
    },
    openImprPopup(data) {
      if (data.rowIndex === '11') {
        data.startDt = this.searchParam.year;
        data.endDt = this.searchParam.year;
        data.popupMode = true;
        this.popupOptions.title = 'L0000005300'; // '법정선임자 평가 관리';
        this.popupOptions.target = () =>
          import(`${'@/pages/mgt/elect/evalMgmt/electEvalRsltStatus.vue'}`);
      } else if (data.rowIndex === '12') {
        data.popupMode = true;
        this.popupOptions.title = 'L0000005303'; // '법정선임자 선해임 관리';
        this.popupOptions.target = () =>
          import(`${'@/pages/mgt/elect/electHis.vue'}`);
      } else if (data.rowIndex === '13') {
        data.popupMode = true;
        data.year = this.searchParam.year;
        this.popupOptions.title = 'L0000005304'; // '평가및안전보건비용 관리';
        this.popupOptions.target = () =>
          import(`${'@/pages/vendor/assmnSfhlc/status.vue'}`);
      } else {
        this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
        this.popupOptions.target = () =>
          import(`${'@/pages/rsa/rsamgmt/resultmgmtImprPopup.vue'}`);
      }

      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;

      this.popupOptions.param = data;

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getChartData();
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    menuAuthChk() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'L0000005387', // 메뉴 접근 권한이 없습니다.
        type: 'warning',
      });
      return;
    },
    authChk() {
      // SHE교육 관리
      let chartResultEduChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'EDU20020',
      });
      if (chartResultEduChk.length === 0) {
        this.chartList1[0].url = 'notperMission';
      } else {
        this.chartList1[0].url = '/education/eduResultStatus';
      }

      // 안전보건법령 이행점검 관리
      let chartSafetyhealthChk = this.$_.filter(
        this.$store.getters.allAuthMenu,
        {
          menuId: 'SAF40085',
        }
      );
      if (chartSafetyhealthChk.length === 0) {
        this.chartList1[1].url = 'notperMission';
      } else {
        this.chartList1[1].url =
          '/inspection/safetyhealth/inspectionResultStatus';
      }

      // 정부지자체 시정조치 이행점검 관리
      let chartSafGovImplChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'SAF40092',
      });
      if (chartSafGovImplChk.length === 0) {
        this.chartList1[2].url = 'notperMission';
      } else {
        this.chartList1[2].url =
          '/inspection/govImplChk/govImplChkResultStatus';
      }

      // 중대시민재해점검 관리
      let chartSafDisaInspChk = this.$_.filter(
        this.$store.getters.allAuthMenu,
        {
          menuId: 'SAF40088',
        }
      );
      if (chartSafDisaInspChk.length === 0) {
        this.chartList1[3].url = 'notperMission';
      } else {
        this.chartList1[3].url = '/inspection/majDisa/inspectionStatus';
      }

      // 작업위험성평가 관리
      let chartRsaWorkChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'RSA30037',
      });
      if (chartRsaWorkChk.length === 0) {
        this.chartList1[4].url = 'notperMission';
      } else {
        this.chartList1[4].url = '/rsa/rsamgmt/resultstatus_W';
      }

      // 비상대응훈련 관리
      let chartSafTrainingChk = this.$_.filter(
        this.$store.getters.allAuthMenu,
        {
          menuId: 'SAF40079',
        }
      );
      if (chartSafTrainingChk.length === 0) {
        this.chartList1[5].url = 'notperMission';
      } else {
        this.chartList1[5].url = '/saf/emergency/trainingStatus';
      }

      // 사고관리
      let chartSafAccidentChk = this.$_.filter(
        this.$store.getters.allAuthMenu,
        {
          menuId: 'SAF40074',
        }
      );
      if (chartSafAccidentChk.length === 0) {
        this.accidentChartInfo.url = 'notperMission';
      } else {
        this.accidentChartInfo.url = '/saf/accident/accidentResultStatus';
      }
      // 종사자의견 관리
      let chartMgtListenChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'MGT40017',
      });
      if (chartMgtListenChk.length === 0) {
        this.mgtlistenChartList[0].url = 'notperMission';
      } else {
        this.mgtlistenChartList[0].url =
          '/mgt/practicianOpinionMgmt/listenStatus';
      }
      // SHE비용예산 관리
      let chartBudgetCostChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'MGT40024',
      });
      if (chartBudgetCostChk.length === 0) {
        this.budgetChartList[0].url = 'notperMission';
      } else {
        this.budgetChartList[0].url = '/mgt/budgetManagement/budgetStatus';
      }
      // SHE투자예산 관리
      let chartBudgetInvestMentChk = this.$_.filter(
        this.$store.getters.allAuthMenu,
        {
          menuId: 'MGT40024',
        }
      );
      if (chartBudgetInvestMentChk.length === 0) {
        this.budgetChartList[1].url = 'notperMission';
      } else {
        this.budgetChartList[1].url = '/mgt/budgetManagement/budgetStatus';
      }

      // 공정위험성평가 관리
      let chartRsaProcChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'RSA30041',
      });
      if (chartRsaProcChk.length === 0) {
        this.chartList3[0].url = 'notperMission';
      } else {
        this.chartList3[0].url = '/rsa/psmmgmt/resultstatus_P';
      }

      // 법정선임자평가 관리
      let chartElectEvalChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'MGT40030',
      });
      if (chartElectEvalChk.length === 0) {
        this.chartList3[1].url = 'notperMission';
      } else {
        this.chartList3[1].url = '/mgt/elect/evalMgmt/electEvalRsltStatus';
      }

      // 법정선임자 선해임 관리
      let chartElectHisChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'MGT40018',
      });
      if (chartElectHisChk.length === 0) {
        this.chartList3[2].url = 'notperMission';
      } else {
        this.chartList3[2].url = '/mgt/elect/electStatus';
      }

      // 평가및안전보건비용 관리
      let chartResultmgmtChk = this.$_.filter(this.$store.getters.allAuthMenu, {
        menuId: 'VEN30007',
      });
      if (chartResultmgmtChk.length === 0) {
        this.chartList3[3].url = 'notperMission';
      } else {
        this.chartList3[3].url = '/vendor/assmnSfhlc/status';
      }
    },
    getMgtTargetItemInfo(data) {
      let info = {};

      let imgUrl = this.publicPath + '/src/assets/images/';
      let classNm = 'col-4 p-0';

      if (data.bizFieldItemNm.includes('중대')) {
        imgUrl += 'sp-02.png';
        classNm += ' bg-color-yellow';
      } else if (data.bizFieldItemNm.includes('화재')) {
        imgUrl += 'sp-03.png';
        classNm += ' bg-color-red';
      } else if (data.bizFieldItemNm.includes('환경')) {
        imgUrl += 'sp-04.png';
        classNm += ' bg-color-green';
      }

      info.imgUrl = imgUrl;
      info.classNm = classNm;

      return info;
    },
    setMgtListenChart(idx) {
      setTimeout(() => {
        this.mgtlistenChartList[idx].chart.resize();
      }, 300);
    },
  },
};
</script>
<style scoped>
.parent {
  text-align: center;
}
.child {
  margin-top: 50px;
}
</style>
