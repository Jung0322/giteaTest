<!--
  목적 : 포틀릿-무재해 현황
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <div class="main-wkod-status type-01">
    <el-table
      :data="tableData"
      :style="{width:'100%', height:'200px', maxHeight:'200px', fontSize:'0.8125rem'}"
      height="200px"
      :header-row-style="{fontWeight:'bold', color:'#212529', fontSize:'0.8125rem'}"
      @row-click="clicked"
    >
      <!-- :span-method="arraySpanMethod" -->
      <el-table-column label="구분" min-width="150px" align="center">
        <template slot-scope="scope">{{ scope.row.gubun }}</template>
      </el-table-column>
      <template v-for="item in plants">
        <el-table-column :label="item.codeNm" min-width="120px" align="center" :key="item.code">
          <template slot-scope="scope">
            <div v-if="scope.row.id===1">
              <el-tag v-if="!scope.row['plant' + scope.row.id].stndDays" size="medium" type="info">
                <i class="el-icon-info"></i> 미등록
              </el-tag>
              <div v-else>
                <div class="progress-information">
                  <font color="black">
                    <strong>{{scope.row['plant' + scope.row.id].dDay}}</strong>
                  </font>
                  <font color="black">
                    <strong>{{ scope.row['plant' + scope.row.id].days }} / {{ scope.row['plant' + scope.row.id].totalDay }}</strong>
                  </font>
                </div>
                <b-progress :max="scope.row['plant' + scope.row.id].totalDay" height="34px">
                  <b-progress-bar :value="scope.row['plant' + scope.row.id].days" :style="{ 'background-color': '#5eff33' }">
                  </b-progress-bar>
                </b-progress>
              </div>
              </div>
              <span v-else >{{ scope.row['plant' + scope.row.id] }}</span>
          </template>
        </el-table-column>
      </template>
<!-- 
      <el-table-column label="구분" min-width="150px" align="center">
        <template slot-scope="scope">{{ scope.row.gubun }}</template>
      </el-table-column>
      <el-table-column label="사업장1" min-width="120px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id!=='2'">{{ scope.row.plant1 }}</span>
            <span v-else-if="!scope.row.plant1.stndDays">
              <el-tag size="medium" type="info">
                <i class="el-icon-info"></i> 미등록
              </el-tag>
            </span>
            <div v-else>
              <div class="progress-information">
                <font color="black">
                  <strong>{{scope.row.plant1.dDay}}</strong>
                </font>
                <font color="black">
                  <strong>{{ scope.row.plant1.days }} / {{ scope.row.plant1.totalDay }}</strong>
                </font>
              </div>
              <b-progress :max="scope.row.plant1.totalDay" height="34px">
                <b-progress-bar :value="scope.row.plant1.days" :style="{ 'background-color': '#5eff33' }">
                </b-progress-bar>
              </b-progress>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="사업장2" min-width="120px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id!=='2'">{{ scope.row.plant2 }}</span>
          <span v-else-if="!scope.row.plant2.stndDays">
            <el-tag size="medium" type="info">
              <i class="el-icon-info"></i> 미등록
            </el-tag>
          </span>
          <div v-else>
            <div class="progress-information">
              <font color="black">
                <strong>{{scope.row.plant2.dDay}}</strong>
              </font>
              <font color="black">
                <strong>{{ scope.row.plant2.days }} / {{ scope.row.plant2.totalDay }}</strong>
              </font>
            </div>
            <b-progress :max="scope.row.plant2.totalDay" height="34px">
              <b-progress-bar :value="scope.row.plant2.days" :style="{ 'background-color': '#5eff33' }">
              </b-progress-bar>
            </b-progress>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="사업장3" min-width="120px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id!=='2'">{{ scope.row.plant3 }}</span>
            <span v-else-if="!scope.row.plant3.stndDays">
              <el-tag size="medium" type="info">
                <i class="el-icon-info"></i> 미등록
              </el-tag>
            </span>
            <div v-else>
              <div class="progress-information">
                <font color="black">
                  <strong>{{scope.row.plant3.dDay}}</strong>
                </font>
                <font color="black">
                  <strong>{{ scope.row.plant3.days }} / {{ scope.row.plant3.totalDay }}</strong>
                </font>
              </div>
              <b-progress :max="scope.row.plant3.totalDay" height="34px">
                <b-progress-bar :value="scope.row.plant3.days" :style="{ 'background-color': '#5eff33' }">
                </b-progress-bar>
              </b-progress>
            </div>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="사업장4" min-width="120px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id!=='2'">{{ scope.row.plant4 }}</span>
            <span v-else-if="!scope.row.plant4.stndDays">
              <el-tag size="medium" type="info">
                <i class="el-icon-info"></i> 미등록
              </el-tag>
            </span>
            <div v-else>
              <div class="progress-information">
                <font color="black">
                  <strong>{{scope.row.plant4.dDay}}</strong>
                </font>
                <font color="black">
                  <strong>{{ scope.row.plant4.days }} / {{ scope.row.plant4.totalDay }}</strong>
                </font>
              </div>
              <b-progress :max="scope.row.plant4.totalDay" height="34px">
                <b-progress-bar :value="scope.row.plant4.days" :style="{ 'background-color': '#5eff33' }">
                </b-progress-bar>
              </b-progress>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="사업장5" min-width="120px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id!=='2'">{{ scope.row.plant4 }}</span>
            <span v-else-if="!scope.row.plant5.stndDays">
              <el-tag size="medium" type="info">
                <i class="el-icon-info"></i> 미등록
              </el-tag>
            </span>
            <div v-else>
              <div class="progress-information">
                <font color="black">
                  <strong>{{scope.row.plant5.dDay}}</strong>
                </font>
                <font color="black">
                  <strong>{{ scope.row.plant5.days }} / {{ scope.row.plant5.totalDay }}</strong>
                </font>
              </div>
              <b-progress :max="scope.row.plant5.totalDay" height="34px">
                <b-progress-bar :value="scope.row.plant5.days" :style="{ 'background-color': '#5eff33' }">
                </b-progress-bar>
              </b-progress>
            </div>
        </template>
      </el-table-column> -->
    </el-table>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import echarts from 'echarts';
require('echarts/theme/macarons');
import { debounce } from '@/utils';

export default {
  name: 'portlet-no-accident',
  props: {
    portletParam: {
      type: String,
      default: '',
    },
    portletHeight: {
      type: [String, Number],
      default: 350,
    },
  },
  data() {
    return {
      chart: null,
      tableData: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      plants: []
    };
  },
  watch: {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.getTableData();
    },
    getTableData() {
      // this.tableData = [
      //   {
      //     id: '1',
      //     gubun: '사업장 무재해 달성배수',
      //     ul: '1',
      //     an: '1',
      //     bu: '1',
      //   },
      //   {
      //     id: '2',
      //     gubun: '무재해 달성일수 & D-day',
      //     ul: {
      //       totalDay: 400,
      //       days: 207,
      //       dDay: -193,
      //     },
      //     an: {
      //       totalDay: 400,
      //       days: 207,
      //       dDay: -193,
      //     },
      //     bu: {
      //       totalDay: 1300,
      //       days: 1020,
      //       dDay: -280,
      //     },
      //   },
      //   {
      //     id: '3',
      //     gubun: '사고 건수',
      //     ul: '1',
      //     an: '1',
      //     bu: '1',
      //   },
      // ];
      // this.createChart();
      this.getComboItems('COM_PLANT_CD').then(_resolve => {
        if (_resolve) {
          this.$http.url = selectConfig.main.portlet.noAccident.status.url;
          this.$http.type = 'get';
          this.$http.request(
            _result => {
              // this.tableData = _result.data;
              if (!_result.data || !_result.data.length) return;
              let firstItem = {
                id: 0,
                gubun: '무재해 달생배수'
              };
              let secondItem = {
                id: 1,
                gubun: '무재해 달성일수'
              };
              let thirdItem = {
                id: 2,
                gubun: '사고 건수'
              };

              this.$_.remove(this.plants, _item => {
                return _item.code === '0000';
              });
              
              this.$_.forEach(this.plants, (plant, _index) => {
                let plantId = 'plant' + _index;
                firstItem[plantId] = _result.data[_index].multiple;

                secondItem[plantId] = {
                  stndDays: _result.data[_index].stndDays,
                  totalDay: _result.data[_index].targetDays,
                  days: _result.data[_index].currentTotalDays,
                  dDay: _result.data[_index].dday > 0 ? 'D-' + _result.data[_index].dday : 'D+' + _result.data[_index].dday * -1,
                };

                thirdItem[plantId] = _result.data[_index].accidentCnt;
              });

              this.tableData.push(firstItem, secondItem, thirdItem);
              // this.tableData = [
              //   {
              //     id: '1',
              //     gubun: '무재해 달성배수',
              //     plant1: _result.data[0].multiple,
              //     plant2: _result.data[1].multiple,
              //     plant3: _result.data[2].multiple,
              //     plant4: _result.data[3].multiple,
              //     plant5: _result.data[4].multiple,
              //   },
              //   {
              //     id: '2',
              //     gubun: '무재해 달성일수',
              //     plant1: {
              //       stndDays: _result.data[0].stndDays,
              //       totalDay: _result.data[0].targetDays,
              //       days: _result.data[0].currentTotalDays,
              //       dDay: _result.data[0].dday > 0 ? 'D-' + _result.data[0].dday : 'D+' + _result.data[0].dday * -1,
              //     },
              //     plant2: {
              //       stndDays: _result.data[1].stndDays,
              //       totalDay: _result.data[1].targetDays,
              //       days: _result.data[1].currentTotalDays,
              //       dDay: _result.data[1].dday > 0 ? 'D-' + _result.data[1].dday : 'D+' + _result.data[1].dday * -1,
              //     },
              //     plant3: {
              //       stndDays: _result.data[2].stndDays,
              //       totalDay: _result.data[2].targetDays,
              //       days: _result.data[2].currentTotalDays,
              //       dDay: _result.data[2].dday > 0 ? 'D-' + _result.data[2].dday : 'D+' + _result.data[2].dday * -1,
              //     },
              //     plant4: {
              //       stndDays: _result.data[3].stndDays,
              //       totalDay: _result.data[3].targetDays,
              //       days: _result.data[3].currentTotalDays,
              //       dDay: _result.data[3].dday > 0 ? 'D-' + _result.data[3].dday : 'D+' + _result.data[3].dday * -1,
              //     },
              //     plant5: {
              //       stndDays: _result.data[4].stndDays,
              //       totalDay: _result.data[4].targetDays,
              //       days: _result.data[4].currentTotalDays,
              //       dDay: _result.data[4].dday > 0 ? 'D-' + _result.data[4].dday : 'D+' + _result.data[4].dday * -1,
              //     },
              //   },
              //   {
              //     id: '3',
              //     gubun: '사고 건수',
              //     plant1: _result.data[0].accidentCnt,
              //     plant2: _result.data[1].accidentCnt,
              //     plant3: _result.data[2].accidentCnt,
              //     plant4: _result.data[3].accidentCnt,
              //     plant5: _result.data[4].accidentCnt,
              //   },
              // ];
            },
            _error => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
              );
            }
          );
        }
      }).catch(_error => {

      });      
    },
    // 공통 코드 조회
    getComboItems(codeGroupCd) {
      return new Promise((_resolve, _reject) => {
        this.$http.url = this.$format(
          selectConfig.codeMaster.getSelect.url,
          codeGroupCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            this.plants = _result.data;
            _resolve(_result.data);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      })
    },
    arraySpanMethod(data) {
      // { row, column, rowIndex, columnIndex }
      if (data.rowIndex === 1) {
        if (data.columnIndex === 1) {
          return [1, 3];
        } else if (data.columnIndex === 2) {
          return [0, 0];
        } else if (data.columnIndex === 3) {
          return [0, 0];
        }
      }
    },
    clicked(row) {
      this.tableData.indexOf(row) === 2 ? this.$router.push('/saf/accident/accidentTotal') : this.$router.push('/mgt/noAccidentResult');
    },
  },
};
</script>

<style scopedSlots>
/* https://firerope.tistory.com/4 참고 */
.progress-information {
  display: flex;
  -ms-flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -ms-flex-pack: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  /* background-color: #007bff; */
  -webkit-transition: width 0.6s ease;
  height: 34px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.progress-information > font {
  font-size: 0.6875rem;
  line-height: 0.6875rem;
  margin: 0.0625rem 0.125rem;
}
</style>
