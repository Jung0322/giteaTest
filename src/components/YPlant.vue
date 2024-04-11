<!--
  목적 : 사업장 select box
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <y-select
    :width="width"
    :comboItems="plantItems"
    :editable="editable"
    :required="required"
    :disabled="disabled || roleAccess"
    itemText="codeNm"
    itemValue="code"
    ui="bootstrap"
    :label="label"
    name="plantCd"
    v-model="plantCd"
    :state="state"
    @datachange="
      (val) => {
        searchchange(val);
      }
    "
  ></y-select>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-plant',
  props: {
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'edit',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    // 라벨 텍스트
    label: {
      type: String,
      default: 'L0000001415', // 사업장
    },
    // 사용 여부
    disabled: {
      type: Boolean,
      default: false,
    },
    // 사용 여부
    width: {
      type: Number,
      default: 8,
    },
    // veeValidate 유효성 검사
    state: {
      type: Boolean,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    filter: {
      // 화학물질인경우 공통사업장을 포함, 나머지는 미포함으로 filter가 chm으로 들어오는 경우만 포함시킴.
      type: String,
      default: '',
    },
    reject: {
      // 제외 항목
      type: String,
      default: '',
    },
    disAuthPage: {
      // 해당 페이지에 사업장고정 권한을 풀어주는 Flag
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFrist: true,
      roleAccess: false,
      plantCd: null,
      plantNm: '',
      plantItems: [], // 사업장 리스트
    };
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value() {
      if (
        !this.value &&
        (!this.$store.getters.deptAuthGrp ||
          this.$store.getters.deptAuthGrp.plantAccessYn !== 'Y')
      ) {
        if (this.type === 'edit' || !this.type) {
          this.$emit('input', this.$store.getters.plantCd);
        } else {
          this.$emit('input', null);
        }
      } else {
        this.plantCd = this.value;
      }
    },
    editable() {
      // this.setEmpthText();
    },
    plantCd() {
      if (this.type === 'edit' && !this.plantCd) this.$emit('input', null);
      else {
        //if (!this.isFrist) {
        if (this.plantItems.length > 0) {
          this.plantNm = this.plantCd
            ? this.plantItems[
                this.$_.findIndex(this.plantItems, {
                  code: this.plantCd,
                })
              ].codeNm
            : '';
        }

        this.$nextTick(() => {
          this.$emit('getPlantNm', this.plantNm);
        });

        //}
        this.$emit('input', this.plantCd);
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      if (this.value) {
        this.plantCd = this.value;
        if (
          this.$store.getters.deptAuthGrp &&
          this.$store.getters.deptAuthGrp.plantAccessYn === 'Y'
        ) {
          this.roleAccess = false;
        } else if (
          !this.$store.getters.deptAuthGrp ||
          this.$store.getters.deptAuthGrp.plantAccessYn === 'N'
        ) {
          this.roleAccess = true;
        }
      } else {
        if (
          !this.$store.getters.deptAuthGrp ||
          this.$store.getters.deptAuthGrp.plantAccessYn === 'N'
        ) {
          this.roleAccess = true;
          this.$emit('input', this.$store.getters.plantCd);
        } else if (
          this.$store.getters.deptAuthGrp &&
          this.$store.getters.deptAuthGrp.plantAccessYn === 'Y'
        ) {
          this.roleAccess = false;
          if (this.type === 'edit' || !this.type) {
            this.$emit('input', this.$store.getters.plantCd);
          } else {
            this.$emit('input', null);
          }
        }
      }
      if (this.disAuthPage) {
        this.roleAccess = false;
      }
      this.getList();
    },
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getList() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'COM_PLANT_CD'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.plantItems = this.$_.clone(_result.data);
          if (this.filter !== 'chm') {
            // 공통사업장 제거
            let _idx = 0;
            let _delIndx = -1;
            this.$_.forEach(this.plantItems, (item) => {
              if (item.code === '0000') {
                _delIndx = _idx;
              }
              _idx += 1;
            });
            if (_delIndx > -1) this.plantItems.splice(_delIndx, 1);
          }
          if (this.reject !== undefined) {
            this.plantItems = this.$_.reject(this.plantItems, {
              code: this.reject,
            });
          }
          if (this.type === 'edit') {
            this.plantItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요';
            });
          } else if (this.type === 'search') {
            this.plantItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // '전체';
            });
          } else if (this.type === 'none') {
            this.plantItems.splice(0, 0, {
              code: null,
              codeNm: '', // '';
            });
          }
          // this.plantNm = this.plantCd
          //   ? this.plantItems[
          //       this.$_.findIndex(this.plantItems, {
          //         code: this.plantCd,
          //       })
          //     ].codeNm
          //   : '';

          let plantItem = this.$_.find(this.plantItems, (_item) => {
            return _item.code === this.plantCd;
          });

          if (plantItem) this.plantNm = plantItem.plantNm;
          else {
            // window.getApp.$emit(
            //   'APP_REQUEST_ERROR',
            //   'M0000000928', // [' + this.plantCd + '] 플랜트가 존재하지 않습니다. 관리자에게 문의바랍니다.'
            //   { s1: this.plantCd }
            // );
            // return;
          }
          if (this.plantItems.length > 0) {
            this.plantNm = this.plantCd
              ? this.plantItems[
                  this.$_.findIndex(this.plantItems, {
                    code: this.plantCd,
                  })
                ].codeNm
              : '';
          }

          this.$nextTick(() => {
            this.$emit('getPlantNm', this.plantNm);
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    searchchange(newValue) {
      // 데이터가 변경되는 경우 처리 해당 속성이 설정되어 있으면 조회처리하도록 수정
      this.$emit('datachange', newValue);
    },
  },
};
</script>
