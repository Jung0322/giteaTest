<!--
  목적 : 색상 컴포넌트
  작성자 : sch
  비고 :
  -->
<template>
  <div>
    <el-row>
      <el-col>
        <template v-for="item in palettes">
          <label :key="item.class" 
            :class="item.class" 
            @click="changeColor(item.color)"></label>
        </template>
        <y-color-picker @colorChanged="colorChanged"></y-color-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="text-align: right;">
        <el-button
          type="info"
          icon="el-icon-refresh"
          @click="restoreColor"
          title="테마 초기화"
        ></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  /** attributes: name, components, props, data **/
  name: 'y-palette',
  props: {
    // 색상을 적용할 영역(type) : top, menu, footer
    type: {
      type: String,
      default: null,
      validator: (_value) => {
        return ['top', 'menu', 'footer', 'body'].indexOf(_value) !== -1
      }
    }
  },
  data() {
    return {
    };
  },
  computed: {
    palettes() {
      return [
        { class: 'theme-settings-bg-item bg-navbar-theme', color: '#ffffff' },
        { class: 'theme-settings-bg-item bg-primary', color: '#F4F4F4' },
        { class: 'theme-settings-bg-item bg-light', color: 'rgba(24,28,33,.06)' },
        { class: 'theme-settings-bg-item bg-lighter', color: '#F1F1F1' },
        { class: 'theme-settings-bg-item bg-primary-dark', color: '#dddddd' },
        { class: 'theme-settings-bg-item bg-primary-darker', color: '#ecedee' },
        { class: 'theme-settings-bg-item bg-secondary', color: '#1f1f1f' },
        { class: 'theme-settings-bg-item bg-secondary-dark', color: '#ec1639' },
        { class: 'theme-settings-bg-item bg-secondary-darker', color: '#ffb400' },
        { class: 'theme-settings-bg-item bg-success', color: '#f07d33' },
        { class: 'theme-settings-bg-item bg-success-dark', color: '#f36314' },
        { class: 'theme-settings-bg-item bg-success-darker', color: '#1b76eb' },
        { class: 'theme-settings-bg-item bg-info', color: '#0b50aa' },
        { class: 'theme-settings-bg-item bg-info-dark', color: '#28354b' },
        { class: 'theme-settings-bg-item bg-info-darker', color: '#ab00a9' },
        { class: 'theme-settings-bg-item bg-warning', color: '#8f0cd3' },
        { class: 'theme-settings-bg-item bg-warning-darsk', color: '#ab00a9' },
        { class: 'theme-settings-bg-item bg-warning-darker', color: '#585f54' },
        { class: 'theme-settings-bg-item bg-danger', color: '#8e6400' },
        { class: 'theme-settings-bg-item bg-danger-dark', color: '#563923' },
        { class: 'theme-settings-bg-item bg-danger-darker', color: '#615e5f' },
        { class: 'theme-settings-bg-item bg-dark', color: 'rgba(24,28,33,.9)' },
        { class: 'theme-settings-bg-item bg-default', color: '#314051' }
      ];
    },
    getType() {
      let type = '';
      if (this.type === 'top') type = 'topColor';
      else if (this.type === 'menu') type = 'menuColor';
      else if (this.type === 'footer') type = 'footerColor';
      else if (this.type === 'body') type = 'bodyColor';
      return type;
    }
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
  },
  beforeDestory() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
    },
    /** functions **/
    /** events **/
    // [event]
    changeColor(_color) {
      if (!this.type) return;

      const mainColor = {
        type: this.type,
        color: _color
      };

      window.localStorage.setItem(this.getType, _color);
      this.$emit('mainColorChanged', mainColor);
    },
    restoreColor() {
      let color = '';
      if (this.type === 'top') color = '#ffffff';
      else if (this.type === 'menu') color = '#242939';
      else if (this.type === 'footer') color = '#ffffff';
      else if (this.type === 'body') color = '#f1f1f1';
      const mainColor = {
        type: this.type,
        color: color
      };
      window.localStorage.setItem(this.getType, color);
      this.$emit('mainColorChanged', mainColor);
    },
    colorChanged(_color) {
      window.localStorage.setItem(this.getType, _color);
      const mainColor = {
        type: this.type,
        color: _color
      };
      this.$emit('mainColorChanged', mainColor);
    }
  }
};
</script>

<style>
.theme-settings-bg-item {
    display: block;
    float: left;
    margin: 3px;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    -webkit-box-shadow: 0 0 0 1px rgba(0,0,0,.1) inset;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.1);
    cursor: pointer;
}

.theme-settings-bg-item.active {
    -webkit-box-shadow: 0 0 0 2px #000;
    box-shadow: 0 0 0 2px #000;
}

.bg-navbar-theme {
    background-color: #fff!important;
    color: #a3a4a6;
}

.bg-primary {
    background-color: #F4F4F4!important;
}

.bg-primary-dark {
  background-color: #dddddd;
}

.bg-primary-darker {
  background-color: #ecedee;
}

.bg-secondary {
    background-color: #1f1f1f!important;
}

.bg-secondary-dark {
    background-color: #ec1639!important;
}

.bg-secondary-darker {
    background-color: #ffb400!important;
}

.bg-success {
    background-color: #f07d33!important;
}

.bg-success-dark {
    background-color: #f36314!important;
}

.bg-success-darker {
    background-color: #1b76eb!important;
}

.bg-info {
    background-color: #0b50aa!important;
}

.bg-info-dark {
    background-color: #28354b!important;
}

.bg-info-darker {
    background-color: #ab00a9!important;
}

.bg-warning {
    background-color: #8f0cd3!important;
}

.bg-warning-dark {
    background-color: #ab00a9!important;
}

.bg-warning-darker {
    background-color: #585f54!important;
}

.bg-danger {
    background-color: #8e6400!important;
}

.bg-danger-dark {
    background-color: #563923!important;
}

.bg-danger-darker {
    background-color: #615e5f!important;
}

.bg-dark {
    background-color: rgba(24,28,33,.9)!important;
}

.bg-white {
    background-color: #fff!important;
}

.bg-light {
    background-color: rgba(24,28,33,.06)!important;
}

.bg-lighter {
    background-color: #F1F1F1!important;
}

.bg-default {
    background-color:#314051!important;
}
</style>
