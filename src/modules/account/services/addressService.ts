import addressdata from "@/modules/account/addressdata.json";


export type ZipCode = number[];
export type Tambon = [string, ZipCode];
export type Amphoe = [string, Tambon[]];
export type Province = [string, Amphoe[]];

export const MockAddress = addressdata as unknown as Province[];

export const addressService = {
    
  // ดึงรายชื่อจังหวัด
  getProvinces: () => MockAddress.map((p) => p[0]),
  
  // ดึงอำเภอในจังหวัดนั้น
  getDistricts: (provinceName: string) => {
    const province = MockAddress.find((p) => p[0] === provinceName);
    return province ? province[1] : [];
  },

  // ดึงตำบลในอำเภอนั้น
  getSubDistricts: (districts: Amphoe[], districtName: string) => {
    const district = districts.find((a) => a[0] === districtName);
    return district ? district[1] : [];
  }
};