<!--
  목적 : 설비별 점검유형 항목 상세 목록
  Detail : 설비별 점검유형 항목 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row>
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="hazop-info-card mb-3"
        >
          <b-row style="margin: 0px">
            <b-col sm="12">
              <b-row>
                <b-col sm="1" class="px-0">
                  <b-list-group style="height: 100%">
                    <b-list-group-item
                      class="hazop-list-item-no-border hazop-list-item-header"
                      style="height: 100%"
                    >
                      <!-- 점검유형 정보 -->
                      {{ $comm.getLangSpecInfoLabel('L0000004295') }}
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
                <b-col sm="11" class="px-0">
                  <!-- 점검유형 추가 -->
                  <y-tag-structure
                    :width="12"
                    itemText="safCheckTypeNm"
                    itemValue="safCheckTypeCd"
                    :editable="editable && !isDisabled"
                    :disabled="isDisabled || popupMode"
                    :controleClose="true"
                    :isVerticalSub="false"
                    :isClick="true"
                    :showClickTag="false"
                    :isNoBadge="true"
                    :refresh="refreshTag"
                    :customClickTag="clickTagIndex"
                    size="medium"
                    name="typeInfoList"
                    :newLabelText="$comm.getLangSpecInfoLabel('L0000004218')"
                    v-model="inspBefItemView.typeInfoList"
                    @handleClickTag="handleClickTag"
                    @customNewTag="customNewTag"
                    @closeTag="closeTag"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col sm="12">
        <insp-bef-oper-result-info-item
          :infoItemProps.sync="selectItem"
          :isComplete="isComplete"
          :popupMode.sync="popupMode"
          :research.sync="research"
          :noPlanYn="noPlanYn"
          @editItemCd="editItemCd"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import InspBefOperResultInfoItem from './inspBefOperResultInfoItem';
export default {
  /* attributes: name, components, props, data */
  name: 'insp-bef-oper-result-info',
  components: {
    InspBefOperResultInfoItem,
  },
  props: {
    popupMode: false,
    inspBefItemView: {
      type: Object,
      default: function () {
        return {
          safFacilChkNo: 0,
          plantCd: '',
          chkUserNm: '',
          chkSchYmd: '',
          chkResult: '',
          chkEndYn: '',
          pDeptNm: '',
          pDeptCd: '',
          safCheckTypeCd: '',
          safFacilityCd: '',
          typeInfoList: [],
        };
      },
    },
    isComplete: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    research: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    /**
     * 무계획 결과등록 여부
     */
    noPlanYn: {
      type: String,
      default: 'Y',
    },
  },
  data() {
    return {
      selectItem: null,
      clickTagIndex: -1,
      refreshTag: false,
      editable: true,
    };
  },
  computed: {
    /**
     * 비활성화 여부
     * 무계획 결과등록이 아닐경우 비활성화
     * 무계획 결과등록이면서 결재요청이후 단계일 경우 비활성화
     */
    isDisabled() {
      return (
        this.noPlanYn !== 'Y' || (this.noPlanYn === 'Y' && this.isComplete)
      );
    },
  },
  watch: {
    'inspBefItemView.safFacilChkNo': {
      handler: function (newValue, oldValue) {
        this.getData();
      },
      deep: true,
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.getData();
    },
    getData() {
      if (
        this.inspBefItemView.safFacilChkNo &&
        this.inspBefItemView.safFacilChkNo > 0
      ) {
        if (!this.inspBefItemView.typeInfoList) {
          this.inspBefItemView.typeInfoList = [];
        } else {
          if (this.inspBefItemView.typeInfoList.length > 0) {
            this.clickTagIndex = 0;
            this.refreshTag = !this.refreshTag;
          } else {
            this.selectItem = null;
            this.clickTagIndex = -1;
          }
        }
      } else {
        this.selectItem = null;
        this.clickTagIndex = -1;
      }
    },
    editItemCd(data) {
      this.inspBefItemView.typeInfoList = this.$_.clone(
        data.inspBefItemView.typeInfoList
      );
      if (data && data.safCheckTypeCd) {
        let index = this.$_.findIndex(this.inspBefItemView.typeInfoList, {
          safCheckTypeCd: data.safCheckTypeCd,
        });
        if (index > -1) {
          this.inspBefItemView.typeInfoList[index].safCheckTypeNm =
            data.safCheckTypeNm;
        } else {
          index = this.$_.findIndex(this.inspBefItemView.typeInfoList, {
            safCheckTypeCd: null,
          });
          this.inspBefItemView.typeInfoList[index].safCheckTypeCd =
            data.safCheckTypeCd;
          this.inspBefItemView.typeInfoList[index].safCheckTypeNm =
            data.safCheckTypeNm;
        }
        this.refreshTag = !this.refreshTag;
      }
    },
    handleClickTag(data) {
      if (!data || !data.tag) {
        return;
      } else {
        let list = this.$_.clone(
          this.$_.filter(this.inspBefItemView.typeInfoList, {
            safCheckTypeCd: data.tag.code,
          })
        );
        this.selectItem = {
          safCheckTypeCd: data.tag.code,
          safCheckTypeNm: data.tag.name,
          chkUserNm: list.length > 0 ? list[0].chkUserNm : '',
          chkSchYmd: list.length > 0 ? list[0].chkSchYmd : '',
          chkEndYn: list.length > 0 ? list[0].chkEndYn : '',
          pDeptCd: list.length > 0 ? list[0].pDeptCd : '',
          chkResult: list.length > 0 ? list[0].chkResult : '',
          forEachFacilityList:
            list.length > 0 ? list[0].forEachFacilityList : [],
          plantCd: this.inspBefItemView.plantCd,
          safFacilChkNo: this.inspBefItemView.safFacilChkNo,
          safFacilityCd: this.inspBefItemView.safFacilityCd,
          typeInfoList: this.inspBefItemView.typeInfoList,
        };
        this.clickTagIndex = data.index;
      }
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    customNewTag() {
      let pushData = {
        safCheckTypeCd: null,
        safFacilChkNo: this.inspBefItemView.safFacilChkNo,
        safFacilityCd: this.inspBefItemView.safFacilityCd,
        plantCd: this.inspBefItemView.plantCd,
        typeInfoList: this.inspBefItemView.typeInfoList,
      };
      this.inspBefItemView.typeInfoList.push(pushData);
      this.clickTagIndex = this.inspBefItemView.typeInfoList.length - 1;
    },
    closeTag(tag) {
      if (tag.code) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000012', // 삭제하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.$format(
              this.deleteItemUrl,
              tag.code,
              this.inspBefItemView.safFacilChkNo,
              this.inspBefItemView.safFacilityCd
            );
            this.$http.type = 'DELETE';
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000007', // 삭제되었습니다.
                  type: 'success',
                });
                this.inspBefItemView.typeInfoList = this.$_.reject(
                  this.inspBefItemView.typeInfoList,
                  { safCheckTypeCd: tag.code }
                );
                this.refreshTag = !this.refreshTag;
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000012', // 삭제하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000007', // 삭제되었습니다.
              type: 'success',
            });
            this.inspBefItemView.typeInfoList = this.$_.reject(
              this.inspBefItemView.typeInfoList,
              { safCheckTypeCd: tag.code }
            );
            this.refreshTag = !this.refreshTag;
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
  },
};
</script>
<style>
.hazop-info-card .card-body {
  padding: 0px !important;
}
.hazop-list-item-no-border {
  padding: 5px 0 5px 10px;
  border: 0px;
  border-radius: unset !important;
}
.hazop-list-item {
  padding: 5px 0 5px 10px;
  border-left: 0px;
  border-right: 0px;
  border-top: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: unset !important;
}
.hazop-list-item-header {
  font-weight: 800;
  background: aliceblue;
}
.hazop-list-item-node-title {
  padding: 0px 0 0px 10px;
  font-weight: 800;
}
.hazop-list-item-node {
  text-align: center;
}
.hazop-node-odd {
  background: coral;
}
</style>
