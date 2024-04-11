<!--
  목적 : Theme 설정 컴포넌트
  작성자 : sch
  비고 :
  -->
<template>
  <div id="theme">
    <template v-for="item in themes">
      <div
        :key="item.name"
        @click="themeClicked(item.properties)">
        <el-row>
          <el-col :sm="12">
            {{ item.name }}
          </el-col>
          <el-col :sm="12">
            <template v-for="property in item.properties">
              <span
                :key="property.name"
                :style="`background: ` + property.color">
              </span>
            </template>
          </el-col>
        </el-row>
      </div>
    </template>
    <div style="text-align: right;">
      <el-button
        type="info"
        icon="el-icon-refresh"
        @click="restoreTheme"
        title="테마 초기화"
      ></el-button>
    </div>
  </div>
</template>

<script>
import baseTheme from '@/js/themeColor.js'
import themeStyle from '@/js/themeStyle.js'
const elementUiVersion = require('element-ui/package.json').version // element-ui version from node_modules
let originalStyle = '';

export default {
  /** attributes: name, components, props, data **/
  name: 'y-theme',
  props: {
  },
  data() {
    return {
      isAppendStyles: false
    };
  },
  computed: {
    themes() {
      return [
        {
          name: 'Air',
          properties: [
            { name: 'primary', color: '#6799FF' },
            { name: 'success', color: '#86E57F' },
            { name: 'warning', color: '#E5D85C' },
            { name: 'danger', color: '#F15F5F' },
            { name: 'info', color: '#8C8C8C' },
          ]
        },
        {
          name: 'Corporate',
          properties: [
            { name: 'primary', color: '#B5B2FF' },
            { name: 'success', color: '#B7F0B1' },
            { name: 'warning', color: '#FFB2F5' },
            { name: 'danger', color: '#FFA7A7' },
            { name: 'info', color: '#BDBDBD' }
          ]
        },
        // {
        //   name: 'Сotton',
        //   properties: [
        //     { name: 'primary', color: '#e84c64' },
        //     { name: 'success', color: '#1890ff' },
        //     { name: 'warning', color: '#ffba00' },
        //     { name: 'danger', color: '#F56C6C' },
        //     { name: 'info', color: '#909399' }
        //   ]
        // },
        // {
        //   name: 'Gradient',
        //   properties: [
        //     { name: 'primary', color: '#775cdc' },
        //     { name: 'success', color: '#e84c64' },
        //     { name: 'warning', color: '#ffba00' },
        //     { name: 'danger', color: '#F56C6C' },
        //     { name: 'info', color: '#909399' }
        //   ]
        // }
      ];
    }
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.$nextTick(() => {
        let currentTheme = window.localStorage.getItem('theme');
        if (!currentTheme) return;
        // currentTheme = currentTheme ? JSON.parse(currentTheme) : baseTheme;
        let colorItem = this.convertColorItem(JSON.parse(currentTheme));
        this.changeTheme(colorItem, baseTheme);
      });
    },
    /** functions **/
    /** events **/
    /**
     * [event] 테마 선택시 발생하는 이벤트
     **/ 
    themeClicked(_colorItem) {
      let currentTheme = this.getCurrentTheme();
      this.changeTheme(_colorItem, currentTheme);
    },
    getCurrentTheme() {
      let currentTheme = window.localStorage.getItem('theme');
      currentTheme = currentTheme ? JSON.parse(currentTheme) : baseTheme;
      return currentTheme;
    },
    changeTheme(_colorItem, _currentTheme) {
      const styles = [].slice.call(document.querySelectorAll('style'))
      .filter(style => {
        const text = style.innerText
        return new RegExp('el-table th', 'i').test(text) && !/Chalk Variables/.test(text)
      });

      let storeTheme = {};

      // this.$_.forEach(styles, (_style, _index) => {
      //   if (typeof _style.innerText != 'string') return;
      //   _style.innerText = null;
      // });

      this.$_.forEach(_colorItem, (_item, _i) => {
        let className = _item.name;
        let classColor = _item.color;  // 원본 css 색상
        let originalClassColor = _currentTheme[className];

        if (_currentTheme.hasOwnProperty(className)) {
          if (typeof classColor !== 'string') return
          const oldVal = originalStyle ? _item.color : classColor;
          const themeCluster = this.getThemeCluster(classColor.replace('#', ''));
          const originalCluster = this.getThemeCluster(originalClassColor.replace('#', ''));

          // this.$_.forEach(themeStyle.styles, (_style, _index) => {
          //   _style = this.updateStyle(_style, originalCluster, themeCluster);

          //   let styleId = 'chalk-style' + _index;
          //   let styleTag = document.getElementById(styleId);
          //   if (!styleTag) {
          //     styleTag = document.createElement('style');
          //     styleTag.setAttribute('id', styleId);
          //     document.head.appendChild(styleTag);
          //   }
          //   if (typeof styleTag.innerText === 'string') styleTag.innerText = _style;
          // });

          // this.$_.forEach(styles, (_style, _index) => {
          //   if (typeof _style.innerText != 'string') return;
          //   _style.innerText = this.updateStyle(_style.innerText, originalCluster, themeCluster);
          //   themeStyle.style = _style.innerText;
          //   // themeStyle.styles[_index] = _style.innerText;
          // });
          themeStyle.style = this.updateStyle(themeStyle.style, originalCluster, themeCluster);
          storeTheme[className]  = classColor;
        }
      });

      let lastElement = null;
      let links = null;
      if (styles.length) {
        lastElement = this.$_.first(styles);
      } else {
        links = document.head.getElementsByTagName('link');
        this.$_.forEach(links, link => {
          if (link.href && link.href.indexOf('elementUI') >= 0 && !lastElement) lastElement = link;
        });
      }

      let styleId = 'chalk-style';
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute('id', styleId);
        if (lastElement.nextSibling) document.head.insertBefore(styleTag, lastElement.nextSibling);
        else document.head.insertBefore(styleTag, lastElement);
      }
      if (typeof styleTag.innerText === 'string') styleTag.innerText = themeStyle.style;
      // });     
      
      window.localStorage.setItem('theme', JSON.stringify(storeTheme));
    },
    /** global style changing methods **/
    getHandler(_newStyleId, _originalColor, themeCluster) {
      const originalCluster = this.getThemeCluster(_originalColor.replace('#', ''))
      const newStyle = this.updateStyle(originalStyle, originalCluster, themeCluster)

      let styleTag = document.getElementById(_newStyleId)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', _newStyleId)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = newStyle
    },
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },

    getCSSString(url, variable) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            originalStyle = xhr.responseText.replace(/@font-face{[^}]+}/, '')
            resolve()
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
    },

    getThemeCluster(_theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [_theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(_theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(_theme, 0.1))
      return clusters
    },
    convertColorItem(_theme) {
      let colorItem = [];
      for (var key in _theme) {
        colorItem.push({
          name: key,
          color: _theme[key]
        })
      }
      return colorItem;
    },
    restoreTheme() {
      let currentTheme = this.getCurrentTheme();
      let colorItem = this.convertColorItem(baseTheme);
      this.changeTheme(colorItem, currentTheme);
      window.localStorage.removeItem('theme');
    }
    /** end global style changing methods **/
  }
};
</script>

<style>
#theme {
  cursor: pointer;
}
#theme span {
  display: inline-block;
  margin: 0 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  -webkit-box-shadow: 0 0 0 1px rgba(0,0,0,.1) inset;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.1);
}
</style>
