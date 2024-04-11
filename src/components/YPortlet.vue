<!--
  목적 : 대쉬보드용 포틀릿 템플릿 컴포넌트
  작성자 : sch
  비고 :
  -->
<template>
  <div class="portlet-item" :style="bodyHeight">
    <div class="portlet-board">
      <div class="portlet-header">
        <div v-if="label">
          <f-icon v-if="icon" :icon="icon" />
          <font class="portlet-header-title">{{
            changeLang('mainView', id)
              ? changeLang('mainView', id)
              : $comm.getLangSpecInfoLabel(label)
          }}</font>
        </div>
        <span v-if="url">
          <el-button
            class="portlet-more"
            icon="el-icon-more"
            size="small"
            title="더보기"
            type="text"
            @click="goLink(url)"
          ></el-button>
        </span>
        <!-- <span>
          <el-dropdown trigger="click" @command="settingChanged">
            <el-button icon="el-icon-s-tools" size="mini" circle plain></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in settingOptions"
                :key="item.label"
                :command="item"
                >{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span> -->
      </div>
      <div class="portlet-body">
        <slot name="portlet-body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { changeLang } from '@/utils/i18n';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-portlet',
  props: {
    // 수정가능 여부
    id: {
      type: String,
      default: null,
      required: true,
    },
    // 포틀릿 body 높이
    height: {
      type: [Number, String],
      default: '100%',
    },
    // 링크 url
    url: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    bodyHeight() {
      let height = this.height.toString();
      if (height.indexOf('px') < 0) height += 'px';
      return 'height: ' + height;
    },
    settingOptions() {
      return [
        { label: '너비 33%', propertyName: 'width', propertyValue: 4 },
        { label: '너비 50%', propertyName: 'width', propertyValue: 6 },
        { label: '너비 66%', propertyName: 'width', propertyValue: 8 },
        { label: '너비 100%', propertyName: 'width', propertyValue: 12 },
        { label: '삭제', propertyName: 'delete' },
      ];
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  /** methods **/
  methods: {
    changeLang,
    init() {},
    /** functions **/
    /** events **/
    settingChanged(_item) {
      _item.id = this.id;
      if (_item.propertyName === 'delete')
        return this.$emit('deleteItem', _item);
      this.$emit('settingChanged', _item);
    },
    goLink(_url) {
      if (_url === 'notperMission') {
        this.$emit('menuAuthChk');
      } else {
        this.$router.push(_url);
      }
    },
  },
};
</script>

<style scoped>
.portlet-item {
  display: inline-block;
  cursor: pointer;
  /* overflow: hidden; */
  width: 100%;
  margin-bottom: 20px;
}

.portlet-board {
  height: auto;
  width: 100%;
  /*border: 1px solid #cacaca;*/
  /* padding: 8px; 
  border: 1px solid rgba(0,0,0,.03);*/
  box-shadow: 0 3px 3px rgba(82,63,105, .04);
  padding:0;
  background: #fff;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.portlet-header {
  padding:0;
  width:100%;
  border-bottom: 1px solid rgba(0,0,0,.09);
  position: absolute;
  z-index: 10;
}
.portlet-header > div {
  padding:10px;
}
.portlet-header-title {
  color: #333333;
  padding-left: 3px;
  font-size: 16px !important;
  font-weight: 500;
}

.portlet-header span {
  position: absolute;
  right: 10px;
  top: 8px;
}

.contents-dashboard .portlet-body {
  padding:44px 0 0 0;
}
.portlet-body {
  padding:59px 15px 15px 15px;
}
.portlet-body > .parent{
  padding:0;
  border-radius: 0 0 5px 5px;
}
.portlet-body > .parent > .portlet-wrap {
  padding:15px;
  height:100%;
}
.portlet-wrap .list-group {
  height:100%;
  background-color: #f7f7f7;
  border-right: 1px solid #e9e9e9;
}
.portlet-wrap .list-group div{
  padding:8px 10px;
  font-size:16px;
  font-weight: 500;
  text-align: right;
  border-bottom: 1px solid #efefef;
}
.portlet-wrap .list-group a{
  padding:8px 10px;
  font-size:13px;
  text-align: right;
  border-width: 0 0 1px 0;
  border-color:#efefef;
  border-style:solid;
  border-radius: 0;
}
.portlet-wrap .list-group-item.active {
  background-color: #94bf36;
  border-color:#94bf36;
}
.portlet-wrap .list-tab-wrap {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.portlet-wrap .list-content {
  padding:15px;
}
.portlet-wrap .list-content-wrap {
  display:flex;
  flex-wrap: nowrap;
}
.portlet-wrap .list-info-wrap {
  padding:15px;
  border-right:1px solid #efefef;
}
.portlet-wrap .list-info-wrap.horizontal .point-value{
  font-size:24px;
}
.portlet-wrap .list-info-wrap ul, .portlet-wrap .list-info-wrap li {
  margin:0;
  padding:0;
  list-style: none;
  text-align: left;
}
.portlet-wrap .list-info-wrap li {
  padding:5px 0;
}
.portlet-wrap .list-info-wrap li.list-info-title {
  padding-top:0;
  margin-bottom: 5px;
  font-size:17px;
  font-weight: 700;
  line-height: 1.2;
  border-bottom: 1px solid #efefef;
}
.portlet-wrap .list-info-wrap li.list-info-title span{
  font-size:13px;
  font-weight: 400;
  color:#777;
}
.portlet-wrap .list-info-wrap li div {
  font-size:13px;
  line-height: normal;
}
.portlet-wrap .list-info-wrap li span {
  font-size:18px;
  color:#71a400;
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

.portlet-more {
  margin-left: 5px;
}
.portlet-more > i {
  font-size: 20px !important;
}
.text-style1 {
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width:100%;
}
.text-style1 > div, .text-style2 > div {
  font-size: 14px;
  line-height: normal;
}
.text-style1 > span, .text-style2 > span {
  font-size: 28px;
  font-weight: 600;
  line-height: normal;
}
.text-style2 {
  display:flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  width:100%;
}
.legend-box-01 {
  position:absolute;
  top:0;
}
.legend-box-01 div {
  font-size:13px;
  font-weight: 400;
  line-height: 1.6;
  color:#333;
}
.legend-box-01 em {
  display: inline-flex;
  margin-right:5px;
  width:8px;
  height:8px;
  border-radius:8px ;
}
.legend-box-02 {
  display: flex;
  position:absolute;
  right:15px;
  bottom: 15px;
}
.legend-box-02 div {
  margin-left:10px;
  font-size:12px;
  font-weight: 400;
  line-height: 1.6;
  color:#333;
}
.legend-box-02 em {
  display: inline-flex;
  margin-right:5px;
  width:8px;
  height:8px;
  border-radius:2px ;
}
.portlet-green .portlet-board{
  background:#94bf36;
}
.portlet-green .portlet-header {
  background-color:#fff;
  border-color:rgb(141 169 79);
}
.portlet-green .text-style2 > div, .portlet-green .text-style2 > span {
  color:#fff;
}
.portlet-green .green-tha01 {
  background-color:#fff !important
}
.portlet-green .green-tha02 {
  background-color:#fff833 !important
}
/* Chart */
.chart-box {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
  padding:10px 0;
  width:100%;
  height:100%;
  max-height: 150px;
}
.chart-box.horizontal {
  padding:0;
  height:auto;
}
.chart-box.horizontal .chart-line {
  height:auto;
  border:0
}
.chart-box.horizontal .chart-line::before, .chart-box.horizontal .chart-line::after {
  display: none;
}
.chart-box.horizontal .chart-line-position {
  flex-direction: column;
  flex-wrap:unset;
  justify-content: unset;
  align-items:unset;
}
.chart-box.horizontal .chart-bar {
  align-items:unset;
  margin:3px 0;
  height:auto;
}
.chart-box.horizontal .chart-bar.column {
  flex-direction: column
}
.chart-box.horizontal .chart-bar .bar-style-02{
  height:12px;
}
.chart-box.horizontal .chart-bar span{
  padding:0 3px;
  margin-top:0;
  width:auto;
}
.chart-box.horizontal .chart-bar span.right {
  justify-content: flex-end
}
.chart-box.horizontal .chart-bar span.left {
  justify-content: flex-start
}

.chart-line {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width:100%;
  height:100%;
  border-bottom:1px solid #ccc;
  position: relative;
}
.chart-line-position {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
  width:100%;
  height:100%;
  position: absolute;
  z-index:2;
}
.chart-line-position em {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: -20px;
  font-size: 12px;
  font-style: normal;
}
.chart-line::before {
  content: '';
  height:20%;
  width:100%;
  border-width: 1px 0;
  border-color:rgba(0,0,0,.09);
  border-style: solid;
  position:absolute;
  bottom:calc(20% - 1px);
  z-index: 1;
}
.chart-line::after {
  content: '';
  height:20%;
  width:100%;
  border-width: 1px 0;
  border-color:rgba(0,0,0,.09);
  border-style: solid;
  position:absolute;
  bottom:calc(60% - 1px); 
  z-index: 1;
}
.portlet-green .chart-line {
  border-bottom:1px solid #729624;
}

.chart-bar {
  margin:0 1px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: column-reverse;
  height:120px;
  position: relative;
  transition: all .1s ease-out;
}
.chart-bar span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding:1px 3px;
  min-width: 16px;
  min-height: 16px;
  font-size:12px;
  margin-top:-18px;
  background-color: transparent;
  border-radius: 3px;
  transition: all .1s ease-out;
}
.chart-bar:hover span {
  color:#fff;
  background-color:rgba(0,0,0,.7);
  transform: translateY(-5px);
}
.bar-style-01 {
  margin:0 6px;
  width:15px;
  border-radius: 15px;
  box-shadow: 0 0 3px rgba(0,0,0,.1);
}
.chart-bar:hover .bar-style-01 {
  box-shadow: 0 0 8px rgba(0,0,0,.3);
}


.h14 {
  font-size:14px;
  line-height: normal;
}
.h15 {
  font-size:15px;
  line-height: normal;
}
.h17 {
  font-size:17px;
  line-height: normal;
}
.h18 {
  font-size:18px;
  line-height: normal;
}
.h24 {
  font-size:24px;
  line-height: normal;
}
.h28 {
  font-size:28px;
  line-height: normal;
}
.b700 {
  font-weight: 700;
}
.b500 {
  font-weight: 500;
}
.b400 {
  font-weight: 400;
}
.bg-color-yellow {
  background-color: #f4af03;
}
.bg-color-green {
  background-color: #94bf36;
}
.bg-color-red {
  background-color: #ff5050;
}
</style>

