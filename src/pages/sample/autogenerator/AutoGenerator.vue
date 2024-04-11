<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id="">
    <b-container fluid>
      <b-row>
        <!-- TODO : 아래에 본문을 넣으세요 -->
        <b-col sm="6">
          <b-card>
            <div slot="header">
              <strong>자동 변환</strong> <small></small>
            </div>
             <b-row>
                <b-col sm="10">
                  <y-text
                    v-model="searchParam.tableName"
                    :width="baseWidth"
                    :editable="true"
                    ui="bootstrap"
                    label="테이블이름*"
                  >
                  </y-text>
              </b-col>
              <b-col sm="2">
                <el-button
                  type="primary" 
                  plain
                  @click.prevent="btnConvertClicked"
                >
                  변환
                </el-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col sm="12">
                <y-text
                  :value="pascal"
                  :width="baseWidth"
                  :editable="false"
                  ui="bootstrap"
                  label="Pascal Case"
                >
                </y-text>
              </b-col>
              <b-col sm="12">
                <y-text
                  :value="camel"
                  :width="baseWidth"
                  :editable="false"
                  ui="bootstrap"
                  label="Camel Case"
                >
                </y-text>
              </b-col>
              <b-col sm="12">
                <y-text
                  :value="kebab"
                  :width="baseWidth"
                  :editable="false"
                  ui="bootstrap"
                  label="Kebab Case"
                >
                </y-text>
              </b-col>
              <b-col sm="12">
                <y-label label="Vue.js Model"></y-label>
                <json-editor
                  :value="{}"
                >
                </json-editor>
              </b-col>
              <b-col sm="12">
              </b-col>
              <b-col sm="12">
              </b-col>
            </b-row>
          </b-card>
        </b-col>

        <b-col sm="6">
          <b-card>
            <div slot="header">
              <strong>Spring-Boot</strong> <small></small>
            </div>
             <b-row>
               <b-col sm="12">
                 <y-text
                  v-model="model.namespace"
                  :width="baseWidth"
                  :editable="true"
                  ui="bootstrap"
                  label="namespace"
                >
                </y-text>
               </b-col>
               <b-col sm="12">
                 <y-text
                    v-model="model.apiPath"
                    :width="baseWidth"
                    :editable="true"
                    ui="bootstrap"
                    label="기본 api경로"
                    placeholder="/api/hea/"
                  >
                  </y-text>
               </b-col>
                <b-col sm="12">
                  <y-textarea
                    v-model="model.controller"
                    :width="baseWidth"
                    :editable="true"
                    :rows="10"
                    ui="bootstrap"
                    label="Controller"
                  >
                  </y-textarea>
              </b-col>
            </b-row>
          </b-card>
      </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import caseConverter from 'case';
import jsonEditor from '@/components/JsonEditor'

export default {
  /** attributes: name, components, props, data **/
  name: 'auto-generator',  // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    'json-editor': jsonEditor
  },
  props: {
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data () {
    return {
      searchParam: {
        tableName: 'test'
      },
      model: {
        namespace: '',
        editor: '{}',
        apiPath: '',
        parent: '',
        controller: ''
      },
      baseWidth: 10,
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      isSubmit: false,  // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
    };
  },
  computed: {
    pascal () {
      return caseConverter.pascal(this.searchParam.tableName);
    },
    camel () {
      return caseConverter.camel(this.searchParam.tableName);
    },
    kebab () {
      return caseConverter.kebab(this.searchParam.tableName);
    },
    lower () {
      return caseConverter.lower(this.pascal);
    },
  },
  watch: {
    'model.apiPath' () {
      this.convertToController();
    }
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted () {
  },
  beforeDestory () {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      this.model.namespace = 'com.she';
    },
    /** /초기화 관련 함수 **/
    
    /** Call API service
    * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
    * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
    * ex) getExamData () {}
    * ex) getExamDatas () {}
    */
    
    /** /Call API service **/
    
    
    /** Component Events, Callbacks (버튼 제외) **/
    
    /** /Component Events, Callbacks (버튼 제외) **/
    
    /** Button Event **/
    /**
    * 저장 버튼 처리용 샘플함수
    */
    btnConvertClicked () {
      this.convertToController();
    },
    /** /Button Event **/
    
    /** 기타 function **/
    convertToController () {
      var namespace = this.model.namespace + '.' + this.lower;
      var controller = 'package ' + namespace + '.controller;';
      var end =  ';\n';
      controller += '\n\n';
      controller += 'import ' + namespace + '.model.' + this.pascal + end;
      controller += 'import ' + namespace + '.service.' + this.pascal + end;
      controller += 'import org.springframework.beans.factory.annotation.Autowired' + end;
      controller += 'import org.springframework.http.ResponseEntity' + end;
      // controller += 'import org.springframework.stereotype.Controller' + end;
      controller += 'import org.springframework.web.bind.annotation.GetMapping' + end;
      controller += 'import org.springframework.web.bind.annotation.PostMapping' + end;
      controller += 'import org.springframework.web.bind.annotation.PutMapping' + end;
      controller += '\n';
      controller += '@RestController' + end;
      controller += 'public class ' + this.pascal + 'Controller' + end;
      controller += '{\n';
      controller += '  @Autowired' + end;
      controller += '  private ' + this.pascal + 'Service ' + this.camel + 'Service' + end;
      controller += '\n';
      controller += '  @GetMapping(\"' + this.model.apiPath + caseConverter.lower(this.parent) + this.lower + '\")\n';
      controller += '  public ResponseEntity<List<' + this.pascal + '>> get' + this.pascal + '() throws Exception\n';
      controller += '  {\n';
      controller += '    List<' + this.pascal + '> ' + this.camel + 's = ' + this.camel + 'Service.get' + this.pascal + 's()' + end;
      controller += '    return ResponseEntity.ok().body(' + this.pascal + 's)' + end;
      controller += '  }\n\n';
      controller += '  @GetMapping(\"' + this.model.apiPath + caseConverter.lower(this.parent) + this.lower + '/{}\")\n';
      controller += '  public ResponseEntity<' + this.pascal + '> get' + this.pascal + '() throws Exception\n';
      controller += '  {\n';
      controller += '    ' + this.pascal + ' ' + this.camel + ' = ' + this.camel + 'Service.get' + this.pascal + '()' + end;
      controller += '    return ResponseEntity.ok().body(' + this.pascal + ')' + end;
      controller += '  }\n\n';
      controller += '  @PutMapping(\"' + this.model.apiPath + caseConverter.lower(this.parent) + this.lower + '\")\n';
      controller += '  public ResponseEntity<' + this.pascal + '> put' + this.pascal + '(@RequestBody ' + this.pascal + ' ' + this.camel + ') throws Exception\n';
      controller += '  {\n';
      controller += '    ' + this.camel + 'Service.put' + this.pascal + '(' + this.camel + ')' + end;
      controller += '    // TODO : 아래는 상황에 맞게 넣어주세요.' + end;
      controller += '    return ResponseEntity.ok().body()' + end;
      controller += '  }\n\n';
      controller += '  @PostMapping(\"' + this.model.apiPath + caseConverter.lower(this.parent) + this.lower + '\")\n';
      controller += '  public ResponseEntity<' + this.pascal + '> post' + this.pascal + '(@RequestBody ' + this.pascal + ' ' + this.camel + ') throws Exception\n';
      controller += '  {\n';
      controller += '    ' + this.camel + 'Service.post' + this.pascal + '(' + this.camel + ')' + end;
      controller += '    // TODO : 아래는 상황에 맞게 넣어주세요.' + end;
      controller += '    return ResponseEntity.ok().body()' + end;
      controller += '  }\n';
      controller += '}\n';
      this.model.controller = controller;
    }
    /** /기타 function **/
  }
};
</script>