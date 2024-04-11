<!--
  목적 : 안전 > 기준정보 > 지도관리
  Detail : 지도 등록/수정/삭제 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box v-if="!popupParam.popupMode" @enter="getList" class="mb-3">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 지도명 -->
          <y-text
            ui="bootstrap"
            label="L0000002755"
            name="mapName"
            :width="8"
            v-model="searchParam.mapName"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>  
      </b-row>
    </y-search-box>
    
    <b-row>
      <b-col sm="12">
        <!-- 지도 목록 -->
        <y-label label="L0000002752" icon="user-edit" color-class="cutstom-title-color" />
        <div v-if="!popupParam.popupMode" slot="buttonGroup" class="float-right mb-1">
          <!-- 검색 -->
          <y-btn title="L0000000327" color="green" @btnClicked="getList" />
        </div>
      </b-col>
      <b-col sm="12">
        <b-card>
          <el-carousel type="card" :autoplay="false" trigger="click" arrow="always" @change="change">
            <el-carousel-item v-for="item in maps" :key="item.mapId" >
              <img @click="clicked(item)" :src="item.imgBase64" style="width:100%;height:100%;display: block;" />
            </el-carousel-item>
          </el-carousel>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 지도 상세 -->
        <y-label label="L0000002753" icon="user-edit" color-class="cutstom-title-color" />
        <div v-if="popupParam.popupMode" slot="buttonGroup" class="float-right mb-1">
          <!-- 선택 -->
          <y-btn
            title="L0000001561"
            color="orange"
            @btnClicked="selectMap"
          />
          <!-- 닫기 -->
          <y-btn
            title="L0000000881"
            @btnClicked="closePopup"
          />
        </div>
      </b-col>
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                name="plantCd"
                v-validate="'required'"
                v-model="map.plantCd"
                :required="true"
                :editable="editable"
                :disabled="popupParam.activation"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!-- 지도ID -->
                  <y-label label="L0000002754"/>
                </b-col>
                <b-col sm="8">
                  <y-label v-if="map.mapId" :label="map.mapId.toString()" :fieldable="true" />
                  <!-- 지도ID는 자동으로 부여됩니다. -->
                  <y-label v-else label="L0000003795" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 지도명 -->
              <y-text
                ui="bootstrap"
                label="L0000002755"
                name="mapName"
                v-validate="'required'"
                v-model="map.mapName"
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="popupParam.activation"
                :maxlength="50"
                :state="validateState('mapName')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 메인노출여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="popupParam.activation"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000004869"
                name="mainViewYn"
                selectText="L0000004870"
                unselectText="L0000004871"
                v-model="map.mainViewYn"
                @input="input"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="popupParam.activation"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="map.useYn"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 설명 -->
              <y-textarea
                ui="bootstrap"
                label="L0000001578"
                name="description"
                v-model="map.description"
                :width="10"
                :editable="editable"
                :disabled="popupParam.activation"
                :maxlength="50"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 미리보기 -->
              <y-label label="L0000001061" icon="user-edit" color-class="cutstom-title-color" />
              <br/>
              <img v-if="map.imgBase64" :src="map.imgBase64" style="display: block;" />
              <!-- * 선택된 지도가 없습니다. -->
              <y-label v-else label="L0000000007" :warning="true" />
            </b-col>
            <b-col sm="12" class="px-0">
              <div v-if="!popupParam.popupMode" slot="buttonGroup" class="float-right mb-1">
                <!-- 지도업로드 -->
                <y-btn
                  v-if="editable&&!popupParam.activation"
                  title="L0000003796"
                  color="green"
                  @btnClicked="openPopup(null)"
                />
                <!-- 초기화 -->
                <y-btn
                  v-if="editable&&!popupParam.activation"
                  title="L0000002859"
                  @btnClicked="clearMap"
                />
                <!-- 수정 -->
                <y-btn
                  v-if="map.mapId && editable&&!popupParam.activation"
                  title="L0000001696"
                  color="orange"
                  @btnClicked="editMap"
                />
                <!-- 신규등록 -->
                <y-btn
                  v-if="editable&&!popupParam.activation"
                  title="L0000001789"
                  color="orange"
                  @btnClicked="insertMap"
                />
                <!-- 선택 -->
                <y-btn
                  v-if="editable&&popupParam.activation"
                  title="L0000001561"
                  color="orange"
                  @btnClicked="selectMap"
                />
                <!-- 닫기 -->
                <y-btn
                  v-if="popupParam.activation"
                  title="L0000000881"
                  @btnClicked="closePopup"
                />
              </div>
            </b-col>
          </b-row>
        </b-card>
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
  name: 'map-select',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          activation: false,
          plantCd: '',
          popupMode: false,
        }
      },
    },
  },
  data() {
    return {
      map: {
        mapId: '',
        mapName: '',
        plantCd: '',
        imgBase64: '',
        description: '',
        useYn: 'Y',
        mainViewYn: 'N',
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
      editable: false,
      maps: [],
      searchParam: {
        plantCd: '',
        mapName: '',
        useYn: 'Y',
      },
      useItems: [],
    }
  },
  watch: {
    'map.imgBase64'() {
      this.drawCanvasImage(this.map.imgBase64);
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'), }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'), }, // 미사용
      ]

      // if (this.map.imgBase64) this.drawCanvasImage(this.map.imgBase64);
      if (this.popupParam.popupMode) {
        if (this.popupParam.plantCd) {
          this.searchParam.plantCd = this.popupParam.plantCd;
        }
        this.searchParam.useYn = 'Y';
      }
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }


      this.getList();
    },
    openPopup(data) {
      this.popupOptions.title = "L0000002756"; // 지도선택
      this.popupOptions.param = null;
      this.popupOptions.width = '70%';
      this.popupOptions.target = () => import(`${'./selectMap.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.mapClosePopup;
    },
    mapClosePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) this.map.imgBase64 = data;
    },
    drawCanvasImage(img) {
      if (img) {
        let canvas = this.$refs.imageCanvas;
        window.onload = function() {
          if (canvas.getContext) {
            const ctx = canvas.getContext('2d');

            let imgBase64 = new Image();
            imgBase64.onload = function() {
              ctx.drawImage(imgBase64, 0, 0);
            };
            imgBase64.src = img;
          }
        }
      }
    },
    getList(index) {
      this.$http.url = selectConfig.saf.map.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.maps = [];
          _result.data.forEach(item => {
            this.maps.push({
              mapId: item.mapId,
              mapName: item.mapName,
              plantCd: item.plantCd,
              imgBase64: item.imgBase64,
              description: item.description,
              useYn: item.useYn,
              mainViewYn: item.mainViewYn,
            });
          });
          if (this.maps && this.maps.length > 0) {
            this.clicked(this.maps[index || 0])
          } else {
            Object.assign(this.$data.map, this.$options.data().map);
          }
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    clearMap() {
      Object.assign(this.$data.map, this.$options.data().map);
    },
    insertMap() {
      this.$validator.validateAll().then(_result => {
        if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000105', // 등록하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.$http.url = transactionConfig.saf.map.insert.url;
              this.$http.type = 'POST';
              if (this.map.mapId) this.map.mapId = '';
              this.$http.param = this.map;
              this.$http.request(
                _result => {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000006', // 저장되었습니다.
                    type: 'success',
                  });

                  this.getList();
                },
                _error => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            },
            cancelCallback: () => {
              return;
            }
          });
        } else {
          if (!this.map.plantCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000863', // 사업장을 선택해주세요.
              type: 'warning', // success / info / warning / error
            });
            return false;
          }
          if (!this.map.mapName) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000001140', // 지도명을 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
            return false;
          }
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000005', // 필수입력값을 입력해주세요.
            type: 'warning', // success / info / warning / error
          });
        }
      }).catch(() => {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
        );
      });
    },
    editMap() {
      this.$validator.validateAll().then(_result => {
        if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000060', // 수정하시겠습니까?',
            type: 'info',
            confirmCallback: () => {
              this.$http.url = transactionConfig.saf.map.edit.url;
              this.$http.type = 'PUT';
              this.$http.param = this.map;
              this.$http.request(
                _result => {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000006', // 저장되었습니다.
                    type: 'success',
                  });
                  const currentIndex = this.$_.findIndex(this.maps, { mapId: this.map.mapId });
                  this.getList(currentIndex);
                },
                _error => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            },
            cancelCallback: () => {
              return;
            }
          });
        } else {
          if (!this.map.plantCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000863',  // 사업장을 선택해주세요.
              type: 'warning', // success / info / warning / error
            });
            return false;
          }
          if (!this.map.mapName) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000001140', // 지도명을 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
            return false;
          }
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000005', // 필수입력값을 입력해주세요.
            type: 'warning', // success / info / warning / error
          });
        }
      }).catch(() => {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
        );
      });
    },
    clicked(_item) {
      this.map = this.$_.clone(_item);
    },
    selectMap() {
      if (this.map.mapId) {
        this.$emit('closePopup', this.map);
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000700', // 지도를 선택하세요.
          type: 'warning',
        });
      }
    },
    closePopup() {
      this.$emit('closePopup');
    },
    change(v, p) {
      this.clicked(this.maps[v])
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    // 메인노출여부 변경시 안내 멘트 출력
    input(mainViewYn) {
      if (mainViewYn === 'Y') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001594', // 해당 지도를 메인노출할 경우 기존 해당사업장의 메인노출되는 지도는 비노출로 변경됩니다.
          type: 'warning',
        });
      }
    }
  },
}
</script>