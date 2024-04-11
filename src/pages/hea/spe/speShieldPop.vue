<!--
  목적 : 안전보호구 > 보호구 신청 > 신규등록/수정 팝업 > 보호구 이미지 팝업
  작성자 : ksw
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 보호구 상세 이미지 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 보호구 상세 이미지 -->
            <y-label label="L0000004405" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnCloseShieldPop" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- <el-image :src="popupParam.filePath"></el-image> -->
              <div>
                <template>
                  <img id="Img1" :src="showImagePath" />
                </template>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <div class="float-right mt-3">
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="btnCloseShieldPop" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios';
import selectConfig from '@/js/selectConfig';
import backendConfig from '@/js/backendConfig';
export default {
  name: 'spe-shield-pop',
  props: {
    popupParam: {
      type: Object,
      default: {
        filePath: '',
        fileNo: '',
      },
    },
  },
  data () {
    return {
      showImagePath: '',
    };
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
  },
  mounted () {
    this.init();
  },
  methods: {
    init: async function () {
      if (!this.popupParam.fileNo) {
        return;
      }
      await this.$nextTick(async function () {
        await this.onGetOriginImageBatch();
      });
    },
    onGetOriginImageBatch: async function (_data) {
      let thisVue = this;
      let inpromises = [];
      inpromises.push(
        axios.get(backendConfig.getUrl(selectConfig.attachFile.image64.url), {
          responseType: 'arraybuffer',
          params: { fileNo: this.popupParam.fileNo, taskFlag: '' },
        })
      );
      await Promise.all(inpromises).then(results => {
        var encstr = results[0].data;
        var url = window.URL || window.webkitURL;
        var blob = this.$comm.base64ToBlob(encstr, 'image/jpeg');
        let imgUrl = url.createObjectURL(blob);
        thisVue.showImagePath = imgUrl;
      });
      await thisVue.$forceUpdate();
      return true;
    },
    // 팝업 닫기
    btnCloseShieldPop () {
      this.$emit('closePopup', {});
    },
  },
};
</script>