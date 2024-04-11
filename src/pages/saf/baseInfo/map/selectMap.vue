<!--
  목적 : 안전 > 기준정보 > 지도관리 > 지도선택
  Detail : 지도선택 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <!-- 미리보기 -->
        <y-label label="L0000001061" icon="user-edit" color-class="cutstom-title-color" />
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 선택 -->
          <y-btn
            v-if="map.imgBase64"
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
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <canvas id="imageCanvas" ref="imageCanvas" width="0" height="0"></canvas>
      </b-col>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
          <y-btn
            title="L0000003028"
            color="blue"
            @btnClicked="selectFile"
          />
        <input v-show="false" type="file" ref="imageLoader" accept="image/*" @change="updateCanvasImage"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'select-map',
  props: {},
  data() {
    return {
      map: {
        mapId: '',
        mapName: '',
        plantCd: '',
        imgBase64: '',
        description: '',
        useYn: 'Y',
      },
    }
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {},
  //* methods */
  methods: {
    updateCanvasImage(event) {
      let self = this;
      let files = event.target.files;
      let reader = new FileReader();

      reader.onload = (event) => {
        let img = new Image();
        img.onload = function() {
          self.drawCanvasImage(img)
        }
        img.src = event.target.result;
      };
      reader.readAsDataURL(files[0]);
    },
    drawCanvasImage(img) {
      let canvas = this.$refs.imageCanvas;
      canvas.width = img.width;
      canvas.height = img.height;
      // canvas.onload = function () {
      if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        this.map.imgBase64 = canvas.toDataURL();
      }
      // }
    },
    selectMap() {
      if (this.map.imgBase64) {
        this.$emit('closePopup', this.map.imgBase64);
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
    selectFile() {
      this.$refs.imageLoader.click()
    }
  },
}
</script>