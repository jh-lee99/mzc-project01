import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { Sales } from "../../dto/Sales";
import './SalesList.scss';
import { StringUtils } from "../../utils/StringUtils"; // 한글화

declare global {
  interface Window {
    IMP: any
  }
}
const IMP = window.IMP;

IMP.init("imp63852103");

const SalesList: React.FC = () => {
  // 로컬 상품 목록을 저장할 상태
  const [salesList, setSalesList] = useState<Sales[]>([]);

  useEffect(() => {
    // 로컬 상품 목록을 가져오는 함수 호출
    getLocalSalesList();
  }, []);

  // 로컬 상품 목록을 가져오는 함수
  const getLocalSalesList = () => {
    // 로컬 상품 목록을 배열에 직접 작성
    const salesData: Sales[] = [
      { production: '축구공', image: 'images/ball.png', price: 1000 },
      { production: '축구유니폼', image: 'images/shirt.png', price: 5000 },
      { production: '축구장갑', image: 'images/gloves.jpg', price: 3000 },
      // 추가적으로 필요한 상품들을 직접 추가할 수 있습니다.
    ];
    // 상품 목록을 상태에 저장
    setSalesList(salesData);
  };

  const handleImageClick = async (sales: Sales) => {
    try {
      const merchant_uid = generateMerchantUid();

      const response: any = await new Promise((resolve, reject) => {
        IMP.request_pay({
          pg: "kakaopay",
          pay_method: "card",
          amount: String(sales.price),
          name: sales.production,
          merchant_uid: merchant_uid
        }, (response: any) => {
          resolve(response);
        });
      });

      const { status, err_msg, imp_uid } = response;
      if (err_msg) {
        alert(err_msg);
      }
      if (status === "paid") {
        await verifyPayment(imp_uid);
      }
    } catch (error) {
      console.error('Error handling payment:', error);
    }
  };

  const verifyPayment = async (imp_uid: string) => {
    try {
      const response = await fetch('/payment/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imp_uid })
      });
      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const data = await response.json();
      console.log('Payment verification successful:', data);
    } catch (error: any) {
      console.error('Error verifying payment:', error.message);
    }
  };

  const generateMerchantUid = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `ORD${year}${month}${day}-${hours}${minutes}${seconds}-${milliseconds}`;
  };

  return (
    <>
      <Row>
        {salesList.map((sales: any, index: any) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Card style={{ width: '18rem' }}>
              <Card.Img src={sales.image} alt={sales.production} onClick={() => handleImageClick(sales)} />
              <Card.Body>
                <Card.Title>{sales.production}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

};

export default SalesList;
