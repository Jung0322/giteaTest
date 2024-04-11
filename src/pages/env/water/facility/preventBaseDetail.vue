<!--
  목적 : 오염방지시설관리 
  작성자 : kkc (2021-02-18 수정)
  Detail : 오염방지시설관리 상세 탭들을 묶은 화면 (수정)
  *
  examples:
  *
  -->
  <template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 오염방지시설 상세 -->
            <y-label label="L0000002023" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <!-- 탭영역 -->
        <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch>
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :paneName="paneName"
              :selectedPreventFacNo="popupParam.ewtrPreventFacNo"
              :tabDisabled="popupParam.disabled"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'prevent-base-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrPreventFacNo: 0,
        facilityCd: 0,
        disabled: false,
      },
    },
  },
  data() {
    return {
      tabItems: [
        { title: 'L0000000776', url: './prevention' }, // '기본정보'
        { title: 'L0000000482', url: './preventBreakHist' }, // '고장이력정보'
      ],
      component: null,
      tabIndex: 0,
      paneName: '',
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
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
    this.loadComponent();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.popupParam.facilityCd) this.popupParam.ewtrPreventFacNo = this.popupParam.facilityCd;
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>