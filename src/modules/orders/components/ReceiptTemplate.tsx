import { forwardRef } from "react";
import { Order } from "../type";

interface ReceiptTemplateProps {
  order: Order;
}


export const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptTemplateProps>(
  ({ order }, ref) => {
    return (
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div
          ref={ref}
          id="receipt-content"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            width: "700px",
            padding: "60px",
            fontFamily: "var(--font-prompt), sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", textDecoration: "underline", marginBottom: "8px" }}>
              ใบแจ้งหนี้ / ใบเสร็จรับเงิน บ้านเทียน
            </h2>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{"Moji's candle shop"}</p>
            <p style={{ fontSize: "14px" }}>โทร. 063-975-7396</p>
          </div>

          {/* Date */}
          <div style={{ textAlign: "right", marginBottom: "20px", fontSize: "16px", fontWeight: "bold" }}>
            {new Date(order.order_created_date).toLocaleDateString("th-TH")}
          </div>

          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 140px", borderBottom: "2px solid #000", paddingBottom: "10px", fontWeight: "bold", fontSize: "16px" }}>
            <span>รายการ</span>
            <span style={{ textAlign: "center" }}>จำนวน</span>
            <span style={{ textAlign: "right" }}>ราคา / หน่วย</span>
            <span style={{ textAlign: "right" }}>จำนวนเงิน(บาท)</span>
          </div>

          {/* Items */}
          <div style={{ marginTop: "15px", minHeight: "150px" }}>
            {order.items?.map((item, index) => (
              <div key={item.order_item_id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 140px", marginBottom: "10px", fontSize: "16px" }}>
                <span>{index + 1}. {item.product_name_at_purchase}</span>
                <span style={{ textAlign: "center" }}>{item.quantity} กระปุก</span>
                <span style={{ textAlign: "right" }}>{item.price_at_purchase.toLocaleString()}.-</span>
                <span style={{ textAlign: "right" }}>{order.total_amount.toLocaleString()}.-</span>
              </div>
            ))}

            {/* Shipping */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 140px", marginBottom: "10px", fontSize: "16px" }}>
              <span>{(order.items?.length || 0) + 1}. ค่าจัดส่ง</span>
              <span></span>
              <span></span>
              <span style={{ textAlign: "right" }}>{(order.shipping_fee || 0).toLocaleString()}.-</span>
            </div>
          </div>

          {/* Total */}
          <div style={{ marginTop: "30px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", fontSize: "18px", fontWeight: "bold" }}>
              <span>ยอดรวมทั้งสิ้น</span>
              <span style={{ width: "140px", textAlign: "right" }}>
                {order.net_amount.toLocaleString()}.- บาท
              </span>
            </div>
          </div>

          <div style={{ marginTop: "80px", fontSize: "12px" }}>
            <p>หมายเหตุ: ราคาสินค้าดังกล่าวยังไม่รวมภาษี หัก ณ ที่จ่าย และ Vat</p>
          </div>
        </div>
      </div>
    );
  }
);

ReceiptTemplate.displayName = "ReceiptTemplate";