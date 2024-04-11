<template>
  <div>
    <div id="appMain" :style="`background-color:`+ bodyColor">
      <section class="app-main">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <b-container
              v-if="this.$route.meta.navi !== '' && this.$route.meta.navi !== undefined"
              fluid
              class="px-0"
            >
              <!-- v-if="this.$route.meta.navi !== '' && this.$route.meta.navi !== undefined " -->
              <b-card header-bg-variant="transparent" class="mx-0 px-0" :style="`background-color:`+ bodyColor">
                <div slot="header" bg-variant="white">
                  <strong>{{pageTitle}}</strong>
                  <el-button-group style="float:right;">
                    <!-- 새창으로 열기 -->
                    <el-button
                      type="primary"
                      icon="el-icon-document-add"
                      @click="addNewPage"
                      :title="$comm.getLangSpecInfoLabel('L0000003403')"
                    ></el-button>
                    <!-- 검색조건 초기화 -->
                    <el-button
                      type="primary"
                      icon="el-icon-refresh-left"
                      @click="resetSearchParam"
                      :title="$comm.getLangSpecInfoLabel('L0000003402')"
                    ></el-button>
                    <el-button
                      type="primary"
                      :icon="buttonItems.searchBox.icon"
                      :title="$comm.getLangSpecInfoLabel(buttonItems.searchBox.title)"
                      @click="hideSearchBox"
                    ></el-button>
                    <el-button
                      type="primary"
                      :icon="buttonItems.favorites.icon"
                      @click="addFavorites"
                      :title="$comm.getLangSpecInfoLabel(buttonItems.favorites.title)"
                    ></el-button>
                    <el-button
                      type="primary"
                      icon="el-icon-download"
                      @click="fileSearch"
                      :title="$comm.getLangSpecInfoLabel('L0000003399')"
                    ></el-button>
                  </el-button-group>
                </div>
                <b-row>
                  <b-col sm="12">
                    <router-view :key="key" ref="mainView" />
                  </b-col>
                </b-row>
              </b-card>
            </b-container>

            <router-view v-else :key="key" ref="mainView" />
          </keep-alive>
        </transition>
      </section>
      <y-popup
        :id="popup.id"
        :label="popup.label"
        :editable="popup.editable"
        :type="popup.type"
        :is-popup-open="popup.isPopupOpen"
        :path="popup.path"
        :childProps="popup.childProps"
        :fullscreen="popup.fullscreen"
        :get-popup-data-func-name="popup.getPopupDataFuncName"
      />

      <y-dialog :param="popupOptions"></y-dialog>
    </div>
    <footer id="footer">
      <b-container fluid :style="`background:` + footerColor">
        <b-row style="padding: 5px 0px;">
          <b-col sm="6" class="footercopyright">
            <span class="font-weight-bolder">SHE</span> ©2019 WeZON Co.,Ltd. All Rights Reserved.
          </b-col>
          <!-- <b-col sm="6" style="text-align:right;">
            <span class="font-weight-bolder">
              TEL. 02-555-7401
            </span>
          </b-col> -->
        </b-row>
      </b-container>
    </footer>
  </div>
</template>

<script>
/* eslint-disable */
import YPopup from '@/components/YPopup';
/* loading */
import { Loading } from 'element-ui';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';

export default {
  name: 'AppMain',
  components: {
    YPopup,
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#314051'
    },
    bodyBackgroundColor: {
      type: String,
      default: '#F1F1F1'
    },
  },
  data() {
    return {
      popup: {
        isPopupOpen: false,
        id: '',
        label: '',
        editable: false,
        type: 'test',
        childProps: null,
        fullscreen: true,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '30%',
        top: '200px',
        param: {},
        closeCallback: null,
      },
      loading: {
        loadingInstance: null,
        passCount: 0,
      },
      visible: true,
      buttonItems: {
        searchBox: {
          icon: 'el-icon-arrow-up',
          title: 'L0000003400', // 검색조건 숨기기;
        },
        favorites: {
          icon: 'el-icon-star-off',
          title: 'L0000003398', // 즐겨찾기 추가
        },
      }
    };
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    },
    pageTitle() {
      // return this.$t('route.' + this.$route.meta.title);
      return this.$route.meta.navi + ' ' + this.$route.meta.title;
    },
    footerColor() {
      let localStorageColor = window.localStorage.getItem('footerColor');
      let color = this.backgroundColor;
      color = localStorageColor || this.backgroundColor; 
      return color;
    },
    bodyColor() {
      let localStorageColor = window.localStorage.getItem('bodyColor');
      let color = this.bodyBackgroundColor;
      color = localStorageColor || this.bodyBackgroundColor;
      window.getApp.$emit('mainColorChanged', color);
      return color;
    },
    // footerColor() {
    //   let localStorageColor = window.localStorage.getItem('footerColor');
    //   localStorageColor = localStorageColor ? localStorageColor : '#314051';
    //   return localStorageColor;
    // }
  },
  watch: {
    '$route.name': function() {
      this.getFavorites();
    },
  },
  created() {
    // TODO : AppMain을 전역 변수에 담는다.
    window.getApp = this;
    // this.$http.url = selectConfig.manage.dept.treelist.url;
    // this.$http.request(_result => {
    //   let deptTree = this.$comm.convertArrayToTree(_result.data, 'pdeptCd', 'deptCd');
    //   window.localStorage.setItem('deptTree', JSON.stringify(deptTree));
    // });
  },
  beforeMount() {
    this.$on('POPUP_OPEN', this.popupOpen); // 사용안하고 있음
    this.$on('POPUP_CLOSED', this.popupClosed); // 사용안하고 있음

    this.$on('LOADING_PASS_COUNT', this.setLoadingPassCount); // 사용안하거고 사용하는 소스는 수정되어야 함
    this.$on('LOADING_SHOW', this.loadingShow); // 사용
    this.$on('LOADING_HIDE', this.loadingHide); // 사용

    this.$on('DELETE_FAVORITE', this.deleteFavorites); // 사용 메시지랑 상관X
    this.$on('ADD_ROUTER_FAVORITE', this.addFavoritesRouter); // 사용 메시지랑 상관X
    
    this.$on('FOOTER_COLOR', (_color) => {
      this.footerColor = _color;
    }); // 사용 X 메시지랑 상관X

    /**
     * Message와 관련된 것
     */
    this.$on('ALERT', this.alert); // 사용
    this.$on('CONFIRM', this.confirm); // 사용
    this.$on('NOTIFY', this.notify); // 사용안하고 있음
    this.$on('NOTIFY_EXCEPTION', this.exceptionNotify); // 사용
    this.$on('APP_REQUEST_SUCCESS', this.requestSuccess); // 사용
    this.$on('APP_REQUEST_ERROR', this.requestError); // 사용
    this.$on('APP_VALID_ERROR', this.validError); // 사용
    this.$on('MESSAGE', this.message); // 사용안하고 있음

    this.getFavorites();
  },
  mounted() {
    this.setAppMainSize();
    window.addEventListener('resize', this.setAppMainSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setAppMainSize);
    this.$off();
  },
  methods: {
    setAppMainSize() {
      this.$nextTick(() => {
        // let navHeight = $('.navbar').height();
        // let footerHeight = $('#footer').height();
        // var tagsHeight = $('.tags-view-container').height();
        let bodyHeight = document.body.clientHeight;
        let appMainRect = document.getElementById("appMain").getBoundingClientRect();
        let footerHeight = $('#footer').height();
        let height = bodyHeight - appMainRect.top - footerHeight;

        $('#appMain').height(height);
        $('.app-main').height(height);
      });
    },
    popupOpen(_option) {
      this.popup = _option;
    },
    popupClosed(_result) {
      this.popup.isPopupOpen = false;
    },

    setLoadingPassCount(_count) {
      this.loading.passCount = _count;
    },
    loadingShow(_option) {
      if (this.loading.passCount === 0) {
        this.loading.loadingInstance = this.$loading({
          lock: true,
          text: 'Loading...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
      } else this.loading.passCount--;
    },
    loadingHide(_result) {
      this.$nextTick(() => {
        if (this.loading && this.loading.loadingInstance) this.loading.loadingInstance.close();
      });
    },
    /**
     * window.alert 대체 함수
     */
    alert(_option) {
      this.$commMessage.alert(this, _option)
    },
    dummyCallback() {
      // 이것은 callback안쓸때 기본값.
    },
    /**
     * window.confirm 대체 함수
     */
    confirm(_option) {
      this.$commMessage.confirm(this, _option)
    },
    /**
     * toast message
     */
    message(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$message({
        type: type,
        showClose: true,
        message: _option.message,
        duration: _option.hasOwnProperty('duration') ? _option.duration : 3000,
      });
    },
    /**
     * 우측 알림 팝업
     */
    notify(_option) {
      this.$commMessage.notify(this, _option)
    },
    /**
     *  개발모드인 경우 오른쪽 Exception 메시지 처리. 메시지를 html방식의 테이블로 보여주도록 한다.
     *  dangerouslyUseHTMLString 옵션은 취약점 공격이 있을 수 있으므로 반드시 개발모드에서만
     *  exceptionNotify를 사용한다.
     */
    exceptionNotify(_option) {
      this.$commMessage.exceptionNotify(this, _option);
    },
    requestSuccess(_message) {
      if (!_message) return;
      this.alert({
        title: 'L0000003395', // 안내
        message: _message,
        type: 'success',
      });
    },
    requestError(_message, _format) {
      if (!_message) return;
      this.alert({
        title: 'L0000003396', // 에러
        message: _message,
        format: _format,
        type: 'error',
      });
    },
    validError(_message) {
      this.alert({
        title: 'L0000003407', // 유효성 에러
        message: _message ? _message : 'M0000000004',
        type: 'error',
      });
    },
    addNewPage() {
      window.open(document.location.href, '_blank');
    },
    resetSearchParam() {
      this.$comm.deleteSearchParamByCookie();
      this.$router.go();
    },
    addFavorites() {
      // 20200608 박정환차장 수정
      // 즐겨찾기가 추가되어 있으면 삭제, 미등록이면 추가
      // if (this.buttonItems.favorites.icon === 'el-icon-star-on') {
      //   this.alert({
      //     title: '안내',
      //     message: '이미 즐겨찾기가 등록 되어있습니다.',
      //     type: 'warning',
      //   });
      //   return;
      // }
      this.$http.url = transactionConfig.user.favoritesInsert.url;
      this.$http.type = 'POST';
      this.$http.param = {
        userId: this.$store.getters.token,
        menuId: this.$route.name,
      };
      const elrouter = $('#' + this.$route.name + '_router');
      this.$http.request(
        _result => {
          if (_result.data === 1) {
            this.alert({
              title: 'L0000003395', // 안내
              message: 'M0000000013', // 즐겨찾기가 등록되었습니다.
              type: 'success',
            });
            this.buttonItems.favorites.icon = 'el-icon-star-on';
            this.buttonItems.favorites.title = 'L0000003397'; // 즐겨찾기 삭제
            if (elrouter !== null) {
              elrouter.removeClass('el-icon-star-off');
              elrouter.addClass('el-icon-star-on');
            }
          } else {
            this.alert({
              title: 'L0000003395', // 안내
              message: 'M0000000014', // 즐겨찾기가 삭제되었습니다.
              type: 'success',
            });
            this.buttonItems.favorites.icon = 'el-icon-star-off';
            this.buttonItems.favorites.title = 'L0000003398'; // 즐겨찾기 추가
            if (elrouter !== null) {
              elrouter.removeClass('el-icon-star-on');
              elrouter.addClass('el-icon-star-off');
            }
          }
          // 즐겨찾기 추가/삭제시 사이드바 즐겨찾기 다시 불러오기
          // 2020.08.19 dylee
          this.$root.$emit('GET_REF_FAVORITE');
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    addFavoritesRouter(_menuId) {
      // Router에서 즐겨찾기 추가/삭제
      // 2020.08.19 dylee
      this.$http.url = transactionConfig.user.favoritesInsert.url;
      this.$http.type = 'POST';
      this.$http.param = {
        userId: this.$store.getters.token,
        menuId: _menuId,
      };
      const elrouter = $('#' + _menuId + '_router');
      this.$http.request(
        _result => {
          // 즐겨찾기 추가/삭제시 사이드바 즐겨찾기 다시 불러오기
          // 2020.08.19 dylee
          this.$root.$emit('GET_REF_FAVORITE');

          if (_result.data === 1) {
            this.alert({
              title: 'L0000003395', // 안내
              message: 'M0000000013', // 즐겨찾기가 등록되었습니다.
              type: 'success',
            });
            if(elrouter !== null) {
              elrouter.removeClass('el-icon-star-off');
              elrouter.addClass('el-icon-star-on');
            }
            if (this.$route.name === _menuId) {
              this.buttonItems.favorites.icon = 'el-icon-star-on';
              this.buttonItems.favorites.title = 'L0000003397'; // 즐겨찾기 삭제
            }
          } else {
            this.alert({
              title: 'L0000003395', // 안내
              message: 'M0000000014', // 즐겨찾기가 삭제되었습니다.
              type: 'success',
            });
            if (elrouter !== null) {
              elrouter.removeClass('el-icon-star-on');
              elrouter.addClass('el-icon-star-off');
            }
            if (this.$route.name === _menuId) {
              this.buttonItems.favorites.icon = 'el-icon-star-off';
              this.buttonItems.favorites.title = 'L0000003398'; // 즐겨찾기 추가
            }
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    deleteFavorites(_menuId) {
      // 즐겨찾기 삭제 (메뉴아이디 파라미터)
      // 2020.08.19 dylee
      this.$http.url = transactionConfig.user.favoritesInsert.url;
      this.$http.type = 'POST';
      this.$http.param = {
        userId: this.$store.getters.token,
        menuId: _menuId,
      };
      const elrouter = $('#' + _menuId + '_router');
      this.$http.request(
        _result => {
          if (_result.data !== 1) {
            this.alert({
              title: 'L0000003395', // 안내
              message: 'M0000000014', // 즐겨찾기가 삭제되었습니다.
              type: 'success',
            });
            if (this.$route.name === _menuId) {
              this.buttonItems.favorites.icon = 'el-icon-star-off';
              this.buttonItems.favorites.title = 'L0000003398'; // 즐겨찾기 추가
            }
            if (elrouter !== null) {
              elrouter.addClass('el-icon-star-off');
              elrouter.removeClass('el-icon-star-on');
            }
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getFavorites() {
      this.$http.url = selectConfig.manage.user.favorites.url;
      this.$http.type = 'GET';
      this.$http.param = {
        userId: this.$store.getters.token,
        menuId: this.$route.name,
      };
      const elrouter = $('#' + this.$route.name + '_router');
      this.$http.request(
        _result => {
          if (_result.data.length < 1) {
            this.buttonItems.favorites.icon = 'el-icon-star-off';
            this.buttonItems.favorites.title = 'L0000003398'; // 즐겨찾기 추가
            if (elrouter !== null) {
              elrouter.removeClass('el-icon-star-on');
              elrouter.addClass('el-icon-star-off');
            }
          } else {
            this.buttonItems.favorites.icon = 'el-icon-star-on';
            this.buttonItems.favorites.title = 'L0000003397'; // 즐겨찾기 삭제
            if (elrouter !== null) {
              elrouter.removeClass('el-icon-star-off');
              elrouter.addClass('el-icon-star-on');
            }
          }
          if (this.$route.name === 'Dashboard') {
            if (elrouter !== null) {
              elrouter.removeClass('el-icon-star-off');
              elrouter.addClass('el-icon-s-home');
            }
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loopHideSearchBox(item, deep) {
      if (item == null || deep > 100) {
        return false;
      } else {
        if (item.btnSearchVisibleClicked) {
          item.btnSearchVisibleClicked();
        }
        let r;
        let i;
        deep++;
        for (i = 0; i < item['$children'].length; i++) {
          r = this.loopHideSearchBox(item['$children'][i], deep);
          if (r) {
            break;
          }
        }
        return r;
      }
    },

    hideSearchBox() {
      this.$store.dispatch('hideSearchBox');
      if (this.$store.state.app.appmain.opened) {
        this.buttonItems.searchBox.icon = 'el-icon-arrow-up';
        this.buttonItems.searchBox.title = 'L0000003400'; // 검색조건 숨기기
      } else {
        this.buttonItems.searchBox.icon = 'el-icon-arrow-down';
        this.buttonItems.searchBox.title = 'L0000003401'; // 검색조건 보이기
      }
    },
    searchBoxVisible() {
      this.visible = !this.visible;
    },

    // 메뉴얼다운로드기능추가
    fileSearch() {
      let param = {};
      param.taskKey = this.$route.name;
      const sucess = (res) => {
        if (res.data) {
          this.downloadMenual(res.data);
        } else {
          this.$comm.alertWarning("등록된 메뉴얼이 없습니다.")
        }
        
      }
      this.$comm.reqHttp("GET","/api/manage/user/fileSearch", param, sucess);
    },

    downloadMenual(_item) {
      let accept = this.$comm.getAccept(_item.fileExt);
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {
        fileNo: _item.fileNo,
        taskFlag: '',
      };
      this.$http.request(
        _result => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = this.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, _item.fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = _item.fileOrgNm;
            link.click();
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    }
  },
};
</script>

<style>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  /* min-height: calc(100vh - 84px); */
  /* TODO : 1024 - 84에서 적정 사이즈 조정 */
  /* height: 800px; */
  /* height: 100%; */
  width: 100%;
  position: relative;
  /* overflow: hidden; */
  overflow-y: auto;
}
.default-tab-pane span {
  /* font-weight: bold; */
}
/*tab 선택될 시에 폰트 사이즈 up*/
.el-tabs__nav .is-active {
  font-size: 17px;
}

/* card body 기본 css */
.default-body-card {
  padding-bottom: 0px !important;
}

.full-height {
  min-height: calc(100vh - 84px);
}

.cutstom-title-color {
  color: #3131ea;
}

/* TODO : 팝업창의 z-index가 2001이어서 강제로 z-index를 높게 지정, element-ui의 popover도 z-index가 2021임 */
.mx-datepicker-popup {
  z-index: 3000 !important;
}

/* clears the 'X' from Internet Explorer */
input[type='text']::-ms-clear {
  display: none;
  width: 0;
  height: 0;
}
input[type='text']::-ms-reveal {
  display: none;
  width: 0;
  height: 0;
}

/* 20200608 박정환차장 수정 
- 기존 el-button 의 style 공통적용
- outline : none 추가
*/
.el-button {
  padding: 6px;
  outline: none !important;
}

.font-weight-bolder {
  font-weight: 700!important;
  font-size: .8em !important;
}
.footercopyright {
  font-size: .8em !important;
}

footer {
  font-size: .8em;
  color: #858585;
}
footer .container-fluid {
  box-shadow: inset 0 2px 0 rgba(0,0,0,.2);
}
</style>


