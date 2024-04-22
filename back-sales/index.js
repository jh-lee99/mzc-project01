const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const PORT = 8080;

// MongoDB 연결
mongoose.connect('mongodb://mongo-sales:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Body parser middleware
app.use(bodyParser.json());

// Product 모델 정의
const ProductSchema = new mongoose.Schema({
  name: String,
  amount: Number // price를 amount로 수정
});
const Product = mongoose.model('Product', ProductSchema);

// 결제 완료 엔드포인트
app.post("/payment/verify-payment", async (req, res) => {
  try {
    // req의 body에서 imp_uid, merchant_uid 추출
    const { imp_uid, merchant_uid } = req.body;

    // 액세스 토큰 발급 받기
    const getToken = async () => {
      try {
        const response = await axios({
          url: "https://api.iamport.kr/users/getToken",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: {
            imp_key: "1705614726848383", // REST API 키
            imp_secret: "f306sOil7xgoGWRaXkkH3DWAX0y7SwoRNSc0C6D7cBIVMqVnJzXIlr1HATpDhCD213GtL58Xvi5u5nph" // REST API Secret
          }
        });

        console.log('Token response:', response.data);
        return response.data.response.access_token;
      } catch (error) {
        console.error('Error getting token:', error.message);
        return null;
      }
    };

    const access_token = await getToken();
    console.log('Access Token:', access_token);


    // 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      method: "get",
      headers: { "Authorization": access_token } // 인증 토큰 추가
    }).catch(error => {
      // 오류가 발생하면 클라이언트에게 오류 메시지를 전송
      throw new Error(`Failed to fetch payment data: ${error.message}`);
    });

    const paymentData = getPaymentData.data.response; // 조회한 결제 정보

    // 결제 정보에서 상품 이름과 결제 금액 추출
    const { amount, name } = paymentData;
    console.log(amount, name);

    // 데이터베이스에서 상품 조회
    const product = await Product.findOne(name);
    console.log(product);
    if (!product) {
      throw new Error('Product not found');
    }

    // 상품의 가격과 결제 금액 비교
    if (product.amount === amount) { // price를 amount로 수정
      res.sendStatus(200);
    } else {
      console.log(res);
      res.sendStatus(400);
    }

  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
