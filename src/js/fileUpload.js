/**
 * 파일업로드 관련 속성 정의
 */
let fileUpload = {
  document: '.txt,.xls,.xlsx,.ppt,.pptx,.doc,.docx,.pdf',
  image: '.png,.gif,.jpg,.jpeg',
  movie: '.mkv,.avi,.mp4,.mpg,.flv,.wmv,.asf,.asx,.ogm,.ogv,.mov',
  zip: '.zip',
  // 기본 파일업로드 관련 속성 지정
  // 예: 문서 파일을 기본속성으로 하고 싶다면, default: 'document'
  default: 'zip'
};

export default fileUpload;