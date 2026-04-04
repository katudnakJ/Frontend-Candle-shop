

export enum ORDER_STATUS {
    PENDING = "PD",
    TO_SHIP = "TS",
    TO_RECEIVE = "TR",
    COMPLETED = "CP",
}

export const SELLER_ORDER_TAB = [
    { key: "PD", label: "รอตรวจสอบ" },
    { key: "TS", label: "ที่ต้องจัดส่ง" },
    { key: "TR", label: "ที่ต้องได้รับ" },
    { key: "CP", label: "สำเร็จแล้ว" },
]

export const CUSTOMER_ORDER_TAB = [
    { key: "PD", label: "รอตรวจสอบ" },
    { key: "TS", label: "ที่ต้องจัดส่ง" },
    { key: "TR", label: "ที่ต้องได้รับ" },
    { key: "CP", label: "สำเร็จแล้ว" },
]

export enum PAYMENT_STATUS {
    PENDING = "PD",
    REJECTED = "RJ",
    APPROVED = "AP",
}