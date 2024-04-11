<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <y-label
          label="L0000004681"
          icon="user-edit"
          color-class="cutstom-title-color"
        />
        <div slot="buttonGroup" class="float-right mb-1">
          <y-btn
            v-show="!popupParam.asPopup"
            title="L0000000881"
            @btnClicked="closePopup"
          />
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
        <div class="sticky-container">
          <el-container
            :style="{ height: height + 'px' }"
            class="sticky-sidebar"
          >
            <el-aside width="100%">
              <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                ref="menuRef"
                text-color="#545454"
                active-text-color="#545454"
                @close="openAgain"
              >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-notebook-2"></i>
                    <y-label
                      :label="popupParam.lnameKor"
                      color-class="cutstom-title-color"
                    />
                  </template>
                  <el-menu-item
                    index="i"
                    v-for="(item, i) in provList"
                    :key="i"
                    @click="
                      scrollToContent(
                        item.provContent
                          .substr(
                            0,
                            item.provContent.indexOf('(') !== -1
                              ? item.provContent.indexOf('(')
                              : item.provContent.indexOf('<') !== -1
                              ? item.provContent.indexOf('<')
                              : item.provContent.length
                          )
                          .replace(/(\s*)/g, ''),
                        item.provContent,
                        item
                      )
                    "
                    class="jomun-item"
                  >
                    {{ item.provContent }}
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-aside>
          </el-container>
        </div>
      </b-col>
      <b-col
        sm="9"
        md="9"
        lg="9"
        xl="9"
        class="col-xxl-9 ml-auto mr-auto"
        style="background-color: white; padding: 0 !important"
      >
        <div class="sticky-container">
          <el-container
            :style="{ height: height + 'px' }"
            class="sticky-sidebar"
          >
            <el-main width="100%">
              <h3 style="margin: 20px" v-if="!loadFinished">
                잠시만 기다려주십시오. 법령 상세내용을 가져오는 중입니다.
              </h3>
              <div
                v-if="loadFinished"
                style="text-align: center; margin-top: 20px"
              >
                <h1>{{ popupParam.lnameKor }}</h1>
                <p style="font-size: 18px; color: #0b50aa; margin-bottom: 20px">
                  <span
                    >[시행 {{ popupParam.enfDate }} ] [{{
                      popupParam.ltypeNm
                    }}
                    제{{ popupParam.promNum }}호 {{ popupParam.promDate }},
                    {{ popupParam.revDiv }}]</span
                  >
                </p>
              </div>
              <ul v-for="(prov, provIndex) in provList" :key="provIndex">
                <div
                  style="display: inline-block; margin: 5px 10px -10px -30px"
                >
                  <input
                    @input="resetElse"
                    v-show="
                      popupParam.asPopup &&
                      !prov.provContent.includes(' 삭제 <') &&
                      !provYn(prov.provContent.trim().substr(0, 4).trim())
                    "
                    style="
                      position: relative;
                      display: inline-block;
                      top: 3px;
                      width: 20px;
                      height: 20px;
                    "
                    type="radio"
                    :id="
                      prov.provContent
                        .substr(
                          0,
                          prov.provContent.indexOf('(') !== -1
                            ? prov.provContent.indexOf('(')
                            : prov.provContent.indexOf('<') !== -1
                            ? prov.provContent.indexOf('<')
                            : prov.provContent.length
                        )
                        .replace(/(\s*)/g, '') + 'Radio'
                    "
                    :value="
                      prov.provContent
                        .substr(
                          0,
                          prov.provContent.indexOf('(') !== -1
                            ? prov.provContent.indexOf('(')
                            : prov.provContent.indexOf('<') !== -1
                            ? prov.provContent.indexOf('<')
                            : prov.provContent.length
                        )
                        .replace(/(\s*)/g, '')
                    "
                  />
                  <span
                    v-show="
                      popupParam.asPopup &&
                      (prov.provContent.includes(' 삭제 <') ||
                        provYn(prov.provContent.trim().substr(0, 4).trim()))
                    "
                    style="padding: 10px"
                  ></span>
                </div>
                <div
                  v-if="provYn(prov.provContent.trim().substr(0, 4).trim())"
                  style="height: 30px"
                ></div>
                <h5
                  :id="
                    prov.provContent
                      .substr(
                        0,
                        prov.provContent.indexOf('(') !== -1
                          ? prov.provContent.indexOf('(')
                          : prov.provContent.indexOf('<') !== -1
                          ? prov.provContent.indexOf('<')
                          : prov.provContent.length
                      )
                      .replace(/(\s*)/g, '')
                  "
                  style="
                    display: inline;
                    color: #007bff;
                    margin-top: 40px;
                    line-height: 32px;
                  "
                  :name="prov.provKey"
                  :style="{
                    fontSize: provYn(
                      prov.provContent.trim().substr(0, 4).trim()
                    )
                      ? '30px'
                      : '',
                  }"
                  class="law-prov-content"
                >
                  {{ prov.provContent }}
                </h5>
                <div>
                  <li>
                    <ul v-for="(cla, claIndex) in claList" :key="claIndex">
                      <div v-if="prov.provKey === cla.provKey">
                        <h6 style="color: #3a71a8">{{ cla.claContent }}</h6>
                        <li>
                          <ul
                            v-for="(numb, numbIndex) in numbList"
                            :key="numbIndex"
                          >
                            <div
                              v-if="
                                cla.provKey === numb.provKey &&
                                cla.claNum === numb.claNum
                              "
                              style="padding-bottom: 10px"
                            >
                              <h7>
                                {{ numb.numbContent }}
                                <li>
                                  <ul
                                    v-for="(mok, mokIndex) in mokList"
                                    :key="mokIndex"
                                  >
                                    <div
                                      v-if="
                                        numb.provKey === mok.provKey &&
                                        numb.claNum === mok.claNum &&
                                        numb.numbNum === mok.numbNum
                                      "
                                      style="padding-bottom: 10px"
                                    >
                                      <span>{{ mok.mokContent }}</span>
                                    </div>
                                  </ul>
                                </li>
                              </h7>
                            </div>
                          </ul>
                        </li>
                      </div>
                    </ul>
                  </li>
                </div>
                <p
                  style="font-size: 18px; margin: 5px 0 0 20px; color: #1b76eb"
                >
                  {{ prov.provRef }}
                </p>
              </ul>
            </el-main>
          </el-container>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'lawRevisionDetail',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          legiKey: 0,
          lnameKor: '',
          provInfo: '',
          promNum: '',
          promDate: '',
          enfDate: '',
          revDiv: '',
          asPopup: false,
          addJomunInfo: function () {
            return {
              lnameKor: '',
              provInfo: '',
              provContents: '',
              ltypeNm: '',
              promDate: '',
              enfDate: '',
            };
          },
        };
      },
    },
    lk: '',
  },
  data() {
    return {
      gridOptions: {
        data: [],
      },
      provContents: [],
      claContents: [],
      numbContents: [],
      mokContents: [],

      provList: [],
      claList: [],
      numbList: [],
      mokList: [],
      loadFinished: false,
      provYnList: [],
      addJomunInfo: {
        lnameKor: '',
        legiKey: '',
        provKey: '',
        provInfo: '',
        provContents: '',
        ltypeNm: '',
        promDate: '',
        enfDate: '',
      },
    };
  },
  computed: {
    height() {
      return this.popupParam.asPopup ? 380 : 750;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.popupParam.addJomunInfo) {
        this.addJomunInfo = this.$_.cloneDeep(this.popupParam.addJomunInfo);
      }
      for (let i = 0; i < 20; i++) {
        this.provYnList.push(`제${i}장`);
      }
      this.$refs.menuRef.open(1);
      this.searchJomunUrl = selectConfig.lawJomun.get.url;
      this.getDetailContent();
    },
    openAgain(index) {
      this.$refs.menuRef.open(index);
    },
    getDetailContent() {
      this.$http.url = this.searchJomunUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        legiKey: this.popupParam.legiKey,
      };
      this.$http.request(
        (_result) => {
          this.provList = this.$_.filter(
            this.$_.cloneDeep(_result.data),
            (item) => {
              return item.provKey;
            }
          );
          this.claList = this.$_.filter(
            this.$_.cloneDeep(_result.data),
            (item) => {
              return item.claNum;
            }
          );
          this.numbList = this.$_.filter(
            this.$_.cloneDeep(_result.data),
            (item) => {
              return item.numbNum;
            }
          );
          this.mokList = this.$_.filter(
            this.$_.cloneDeep(_result.data),
            (item) => {
              return item.mokNum;
            }
          );

          this.provList = this.$_.uniqBy(this.provList, 'provContent');
          this.claList = this.$_.uniqBy(this.claList, 'claContent');
          this.numbList.sort((b, a) => {
            let aNumStr = a.numbNum;
            let bNumStr = b.numbNum;

            if (aNumStr.length === 3 && bNumStr.length === 2) return -1;
            if (aNumStr.length === 2 && bNumStr.length === 3) return 1;
            if (aNumStr.length === 2 && aNumStr !== bNumStr) {
              return Number(aNumStr.substr(0, 1)) -
                Number(bNumStr.substr(0, 1)) >
                0
                ? -1
                : 1;
            }
            if (aNumStr.length === 3 && aNumStr !== bNumStr) {
              if (isNaN(aNumStr.substr(1, 1)) || isNaN(aNumStr.substr(1, 1))) {
                return 0;
              }

              return Number(aNumStr.substr(0, 2)) -
                Number(bNumStr.substr(0, 2)) >
                0
                ? -1
                : 1;
            }

            return 0;
          });
          this.numbList = this.$_.uniqBy(this.numbList, 'numbContent');
          this.mokList = this.$_.uniqBy(this.mokList, 'mokContent');
          this.$nextTick(function () {
            this.loadFinished = true;
            let arrowDownIcon = document.querySelectorAll(
              '.el-aside .el-submenu__title i'
            )[1];
            arrowDownIcon.style.cssText = 'visibility: hidden !important;';
            if (this.popupParam.provInfo) {
              this.$el
                .querySelector(`#${this.popupParam.provInfo}`)
                .scrollIntoView({
                  block: 'start',
                  behavior: 'smooth',
                });
              setTimeout(() => {
                let provs = this.$el.querySelectorAll(`.law-prov-content`);
                for (let i = 0; i < provs.length; i++) {
                  provs[i].style.fontWeight = 500;
                }
                let prov = this.$el.querySelector(
                  `#${this.popupParam.provInfo}`
                );
                prov.style.fontWeight = 900;
                prov.style.textDecoration = 'underline';
              }, 300);
            }
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    scrollToContent(provContent, second, third) {
      if (
        !second.includes(' 삭제 <') &&
        !this.provYn(second.trim().substr(0, 4).trim())
      ) {
        this.addJomunInfo.provInfo = provContent;
        this.addJomunInfo.provKey = third.provKey;
        this.addJomunInfo.provContents = this.$el.querySelector(
          `#${provContent}`
        ).textContent;
        window.getApp.$emit('addJomunInfo', this.addJomunInfo);
      }
      this.$el.querySelector(`#${provContent}`).scrollIntoView({
        block: 'start',
        behavior: 'auto',
      });
      let radios = this.$el.querySelectorAll(`input`);
      for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
      }
      setTimeout(() => {
        this.$el.querySelector(`#${provContent}Radio`).checked = true;
        let provs = this.$el.querySelectorAll(`.law-prov-content`);
        for (let i = 0; i < provs.length; i++) {
          provs[i].style.fontWeight = 500;
        }
        let prov = this.$el.querySelector(`#${provContent}`);
        prov.style.fontWeight = 900;
      }, 300);
    },
    resetElse(e) {
      let radios = this.$el.querySelectorAll(`input`);
      for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
      }
      let provs = this.$el.querySelectorAll(`.law-prov-content`);
      for (let i = 0; i < provs.length; i++) {
        provs[i].style.fontWeight = 500;
      }
      this.addJomunInfo.provInfo = e.target.value;
      this.addJomunInfo.provContents = this.$el.querySelector(
        `#${e.target.value}`
      ).textContent;
      this.addJomunInfo.provKey = this.$el
        .querySelector(`#${e.target.value}`)
        .getAttribute('name');
      window.getApp.$emit('addJomunInfo', this.addJomunInfo);

      this.$el.querySelector(`#${e.target.value}Radio`).checked = true;
      let prov = this.$el.querySelector(`#${e.target.value}`);
      prov.style.fontWeight = 900;
    },
    provYn(provContent) {
      let provYn = this.provYnList.includes(provContent);
      return provYn;
    },

    closePopup() {
      this.$emit('closePopup', this.addJomunInfo, { success: true });
    },
  },
};
</script>

<style scoped>
.jomun-item {
  font-weight: 800;
  width: 90%;
  padding: 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
ul {
  list-style-type: none;
}
.sticky-container {
  display: flex;
  height: 100%;
}
.sticky-sidebar {
  position: sticky;
  top: 15px;
}
</style>
