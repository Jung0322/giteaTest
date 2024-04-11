<!--
  목적 : 포틀릿-일일작업현황
  작성자 : 
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-row>
    <b-col>
      <div class="float-right">
        <y-btn
          title="지도선택"
          name="mapSelect"
          color="black"
          @btnClicked="openPopup"
        />
        <el-popover placement="right" width="500" trigger="click">
          <el-button slot="reference" icon="el-icon-info" size="mini">{{
            changeLang(null, 'legend')
          }}</el-button>
          <b-row>
            <b-col
              sm="4"
              md="4"
              lg="4"
              xl="4"
              class="col-xxl-4"
              v-for="(item, i) in wkodSpwkItems"
              :key="i"
            >
              <b-row>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                  <div style="padding: 5px 5px 0 5px">
                    <el-image
                      class="mt-3"
                      style="width: 100%; height: 25px; vertical-align: top"
                      :src="
                        publicPath + '/src/assets/images/' + item.code + '.png'
                      "
                      fit="contain"
                    ></el-image>
                    <label
                      class="m-0 pt-2"
                      style="
                        font-size: 0.75rem;
                        padding-top: 0.8rem;
                        width: 100%;
                        text-align: center;
                      "
                      >{{ item.codeNm }}</label
                    >
                    <!-- <label
                      v-if="!item.isDouble"
                      class="mt-0 pt-0 mb-1"
                      style="font-size:0.7rem; width:100%; text-align:center; font-weight:normal; vertical-align:top"
                    >{{ item.count }}</label>
                    <label
                      v-else
                      class="mt-0 pt-0 mb-1"
                      style="width:100%; font-size:0.7rem; font-weight:normal; vertical-align:top; text-align:center"
                    >
                      일반 : {{ item.countNomal
                      }}
                      <span
                        style="display:inline-block; line-height:1; margin:0 .3rem; color:#cdcdcd"
                      >/</span>
                      특별 : {{ item.countSpecial }}
                    </label> -->
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </el-popover>
      </div>
    </b-col>
    <b-col
      sm="12"
      md="12"
      lg="12"
      xl="12"
      class="col-xxl-12"
      style="min-height: 602px"
      id="divDailyMap"
    >
      <!-- style="max-height:400px;" -->
      <img-mark
        ref="imgMark"
        :path="'/src/assets/images/'"
        :fileName="'noImage.png'"
        :imgBase64="imgBase64"
        :marks="locationData"
        :showDetailPopUp="true"
        :editable="false"
        :research="research"
        @clickedIcon="clickedIcon"
      ></img-mark>
    </b-col>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-row>
</template>

<script>
import { changeLang } from '@/utils/i18n';
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-wokd-info-tab',
  props: {
    portletParam: {
      type: Object,
      default: function () {
        return {
          plantCd: null,
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      plantCd: '',
      workYmd: '',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    research: false,
    wkodSpwkItems: [],
    locationData: [],
    imgBase64: '',
    mapNo: 0,
  }),
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    mapNo() {
      if (this.mapNo !== 0) {
        this.getData();
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.setMapSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setMapSize);
  },
  //* methods */
  methods: {
    changeLang,
    init() {
      if (this.portletParam.plantCd) {
        this.searchParam.plantCd = this.portletParam.plantCd;
      } else {
        this.searchParam.plantCd = this.$store.getters.plantCd;
      }

      this.searchParam.workYmd = this.$comm
        .moment(this.$comm.getToday())
        .format('YYYY-MM-DD');

      let codeGroupCd = 'SAF_WKOD_KIND';
      let promises = [
        { func: this.getComboItems, param: codeGroupCd }, // 작업종류
        { func: this.getMapIdByPlantCd }, // 사업장 메인노출 지도ID 조회
        // { func: this.getData }, // 데이터 조회
      ];
      this.$comm.orderedPromise(promises);
    },
    getComboItems(codeGroupCd) {
      return new Promise((resolve) => {
        this.$http.url = this.$format(
          selectConfig.codeMaster.getSelect.url,
          codeGroupCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (codeGroupCd === 'SAF_WKOD_KIND') {
              this.$_.forEach(_result.data, (item) => {
                this.wkodSpwkItems.push({
                  codeNm: item.codeNm,
                  code: item.code,
                });
              });
              resolve(true);
              // let unrefinedNames = this.$_.map(_result.data, 'codeNm');
              // let names = [];
              // let wkodSpwkItems = [];
              // let wkodSpwkItemNamesTemp = [];
              // this.$_.forEach(unrefinedNames, name => {
              //   let splitArray = this.$_.split(name, '(');
              //   if (splitArray && splitArray.length > 0) {
              //     names.push(splitArray[0]);
              //   }
              // });

              // wkodSpwkItemNamesTemp = this.$_.uniq(names);
              // let i = 1;
              // this.$_.forEach(wkodSpwkItemNamesTemp, item => {
              //   this.wkodSpwkItems.push({
              //     codeNm: item,
              //     isDouble:
              //       this.$_.countBy(names, x => x === item).true > 1
              //         ? true
              //         : false,
              //   });
              //   i++;
              // });
              // this.getData();
            }
          },
          (_error) => {
            resolve(false);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    // 사업장코드로 메인페이지 노출 지도 ID 가져오기.
    getMapIdByPlantCd() {
      return new Promise((resolve) => {
        this.$http.url = selectConfig.saf.map.getMapIdByPlantCd.url;
        this.$http.type = 'GET';
        this.$http.param = {
          plantCd: this.searchParam.plantCd,
          // plantCd: '2000',
        };
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.mapNo = _result.data.mapId;
              this.imgBase64 = _result.data.imgBase64;
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (_error) => {
            resolve(false);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    getData() {
      return new Promise((resolve) => {
        if (this.mapNo !== undefined) {
          this.$http.url = selectConfig.main.portlet.dailyWorkStatus.list.url;
          this.$http.type = 'GET';
          this.$http.param = {
            mapNo: this.mapNo,
          };
          this.$http.request(
            (_result) => {
              // this.$_.forEach(this.wkodSpwkItems, item => {
              //   let index = this.$_.findIndex(_result.data.list, {
              //     code_nm: item.codeNm,
              //   });
              //   item.code = _result.data.list[index].attr2;
              //   item.countNomal = _result.data.list[index].countNomal;
              //   item.countSpecial = _result.data.list[index].countSpecial;
              // });
              this.locationData = [];
              let selectDatas = [];
              let index = 0;
              this.$_.forEach(_result.data.locations, (item) => {
                selectDatas.push({
                  markNo: index,
                  markType: item.code,
                  locationX: item.locate_pnt_x,
                  locationY: item.locate_pnt_y,
                  wkodTitle: item.work_title,
                  wkodDt: this.$comm.getToday(),
                  subconnNm: item.subconn_nm,
                  wkodNo: item.wkod_no,
                  wkodStepCd: item.wkod_step_cd,
                });
                index++;
              });
              this.locationData = selectDatas;
              resolve(true);
            },
            (_error) => {
              resolve(false);
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
      });
    },
    setMapSize() {
      this.research = !this.research;
      // 브라우저가 resize될때 초기화하여 다시 그리기
      // Object.assign(this.$data, this.$options.data());
      // this.init();
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
    clickedIcon(mark) {
      this.popupOptions.title = '작업허가서 상세';
      this.popupOptions.param = {
        wkodNo: mark.wkodNo,
        wkodStepCd: mark.wkodStepCd,
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/constSafe/wkod/wkodNewlDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup() {
      this.popupOptions.title = '일일작업현황 지도';
      this.popupOptions.param = {
        activation: true,
        popupMode: true,
      };
      this.popupOptions.target = () =>
        import(`${'../saf/baseInfo/map/map.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        if (data.mapId !== undefined) {
          this.mapNo = data.mapId;
          this.imgBase64 = data.imgBase64;
        }
      }
    },
  },
};
</script>
<style>
#cauTypeCd {
  height: auto;
}
</style>
