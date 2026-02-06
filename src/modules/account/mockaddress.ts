import { Addresses } from "@/modules/account/addresses"; 

export const mockAddresses =<Addresses[]>([
    {
      address_id: "1",
      user_id: "user_01",
      address_label: "บ้าน",
      recipient_first_name: "สมชายยอดดีศรเมือง",
      recipient_last_name: "สายลมพัดมาพัดไป",
      recipient_phone: "0812345678",
      delivery_address: "123/45 หมู่บ้านสวยงาม",
      sub_district: "ลาดพร้าว",
      district: "ลาดพร้าว",
      province: "กรุงเทพมหานคร",
      postcode: "10230",
      is_default: true,
    },
    {
      address_id: "2",
      user_id: "user_01",
      address_label: "ที่ทำงาน",
      recipient_first_name: "สมชาย",
      recipient_last_name: "สายลม",
      recipient_phone: "0212345678",
      delivery_address: "อาคารออฟฟิศชั้น 20",
      sub_district: "ห้วยขวาง",
      district: "ห้วยขวาง",
      province: "กรุงเทพมหานคร",
      postcode: "10310",
      is_default: false,
    }
  ]);