프론트앤드에서 결제 발생 시 호출되는 코드
mongoDB에서 상품 정보를 가져와서 결제된 금액과 상품명이 DB의 결제금액과 상품명과 일치하는지 확인하는 용도로 동작합니다.

----------------

mongoDB 데이터 예시:

// init_data.js
// MongoDB 데이터베이스와 컬렉션 생성
db.createCollection('Product');

// 상품 데이터 추가
db.Product.insertMany([
  { name: '축구공', amount: 1000 }, // price를 amount로 수정
  
  { name: '축구유니폼', amount: 5000 }, // price를 amount로 수정
  
  { name: '축구장갑', amount: 3000 } // price를 amount로 수정
]);
