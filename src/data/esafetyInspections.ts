export interface Inspection {
  date: string;
  stickerNumber: string;
  workOrder: string;
  customerName: string;
  vin: string;
  plate?: string;
  fee: number;
}

// October 2025 Inspections (Sample - 140 inspections)
export const octoberInspections: Inspection[] = [
  { date: "10/01/2025", stickerNumber: "AI509617958", workOrder: "7958", customerName: "KONSTANTINE ZARDIASHVILI", vin: "JN8AS5MV0CW717957", fee: 90.00 },
  { date: "10/01/2025", stickerNumber: "AI509617974", workOrder: "7974", customerName: "GEO MOTORS GROUP LLC", vin: "1FTBW3X83SKA58762", fee: 90.00 },
  { date: "10/01/2025", stickerNumber: "AI509617985", workOrder: "7985", customerName: "PENN MOTORS INC", vin: "2HGFC2F59MH512345", fee: 90.00 },
  { date: "10/02/2025", stickerNumber: "AI509617996", workOrder: "7996", customerName: "ROCKLEDGE AUTO SALES", vin: "1C4RJFAG5LC123456", fee: 90.00 },
  { date: "10/02/2025", stickerNumber: "AI509618007", workOrder: "8007", customerName: "GEO MOTORS GROUP LLC", vin: "WVWZZZ3CZWE654321", fee: 90.00 },
  { date: "10/03/2025", stickerNumber: "AI509618018", workOrder: "8018", customerName: "KONSTANTINE ZARDIASHVILI", vin: "5XYKT3A69GG789012", fee: 90.00 },
  { date: "10/03/2025", stickerNumber: "AI509618029", workOrder: "8029", customerName: "PENN MOTORS INC", vin: "JM1BK32F781234567", fee: 90.00 },
  { date: "10/04/2025", stickerNumber: "AI509618040", workOrder: "8040", customerName: "ROCKLEDGE AUTO SALES", vin: "1HGBH41JXMN109876", fee: 90.00 },
  { date: "10/04/2025", stickerNumber: "AI509618051", workOrder: "8051", customerName: "GEO MOTORS GROUP LLC", vin: "2T1BURHE5JC543210", fee: 90.00 },
  { date: "10/07/2025", stickerNumber: "AI509618062", workOrder: "8062", customerName: "KONSTANTINE ZARDIASHVILI", vin: "3FA6P0H76HR234567", fee: 90.00 },
  { date: "10/07/2025", stickerNumber: "AI509618073", workOrder: "8073", customerName: "PENN MOTORS INC", vin: "1G1YY22G965890123", fee: 90.00 },
  { date: "10/08/2025", stickerNumber: "AI509618084", workOrder: "8084", customerName: "GEO MOTORS GROUP LLC", vin: "WDBRF61J21F456789", fee: 90.00 },
  { date: "10/08/2025", stickerNumber: "AI509618095", workOrder: "8095", customerName: "ROCKLEDGE AUTO SALES", vin: "5FNRL5H67KB012345", fee: 90.00 },
  { date: "10/09/2025", stickerNumber: "AI509618106", workOrder: "8106", customerName: "KONSTANTINE ZARDIASHVILI", vin: "1N4AL3AP7JC678901", fee: 90.00 },
  { date: "10/09/2025", stickerNumber: "AI509618117", workOrder: "8117", customerName: "PENN MOTORS INC", vin: "2C4RDGCG5LR234567", fee: 90.00 },
  { date: "10/10/2025", stickerNumber: "AI509618128", workOrder: "8128", customerName: "GEO MOTORS GROUP LLC", vin: "3GNAXJEV5KS890123", fee: 90.00 },
  { date: "10/10/2025", stickerNumber: "AI509618139", workOrder: "8139", customerName: "ROCKLEDGE AUTO SALES", vin: "1FTEW1EP5JFC45678", fee: 90.00 },
  { date: "10/11/2025", stickerNumber: "AI509618150", workOrder: "8150", customerName: "KONSTANTINE ZARDIASHVILI", vin: "JN8AZ2NE3K9101234", fee: 90.00 },
  { date: "10/11/2025", stickerNumber: "AI509618161", workOrder: "8161", customerName: "PENN MOTORS INC", vin: "WAUENAF42LN567890", fee: 90.00 },
  { date: "10/14/2025", stickerNumber: "AI509618172", workOrder: "8172", customerName: "GEO MOTORS GROUP LLC", vin: "5UXWX9C50L0123456", fee: 90.00 },
  // Additional inspections to reach ~140
  ...Array.from({ length: 120 }, (_, i) => ({
    date: `10/${String(Math.floor(i / 8) + 14).padStart(2, '0')}/2025`,
    stickerNumber: `AI5096${18183 + i}`,
    workOrder: `${8183 + i}`,
    customerName: ["GEO MOTORS GROUP LLC", "PENN MOTORS INC", "KONSTANTINE ZARDIASHVILI", "ROCKLEDGE AUTO SALES"][i % 4],
    vin: `VIN${String(i + 100).padStart(14, '0')}`,
    fee: 90.00,
  })),
];

// November 2025 Inspections (Sample - 143 inspections)
export const novemberInspections: Inspection[] = [
  { date: "11/01/2025", stickerNumber: "AI509620001", workOrder: "9001", customerName: "GEO MOTORS GROUP LLC", vin: "1FTFW1ET9EKD12345", fee: 90.00 },
  { date: "11/01/2025", stickerNumber: "AI509620012", workOrder: "9012", customerName: "PENN MOTORS INC", vin: "2C3CDXCT5LH234567", fee: 90.00 },
  { date: "11/03/2025", stickerNumber: "AI509620023", workOrder: "9023", customerName: "KONSTANTINE ZARDIASHVILI", vin: "3GNKBKRS4LS345678", fee: 90.00 },
  { date: "11/03/2025", stickerNumber: "AI509620034", workOrder: "9034", customerName: "ROCKLEDGE AUTO SALES", vin: "1G1ZD5ST5LF456789", fee: 90.00 },
  { date: "11/04/2025", stickerNumber: "AI509620045", workOrder: "9045", customerName: "GEO MOTORS GROUP LLC", vin: "5YFBURHE3LP567890", fee: 90.00 },
  { date: "11/04/2025", stickerNumber: "AI509620056", workOrder: "9056", customerName: "PENN MOTORS INC", vin: "1HGCV1F35LA678901", fee: 90.00 },
  { date: "11/05/2025", stickerNumber: "AI509620067", workOrder: "9067", customerName: "KONSTANTINE ZARDIASHVILI", vin: "2T3P1RFV5LC789012", fee: 90.00 },
  { date: "11/05/2025", stickerNumber: "AI509620078", workOrder: "9078", customerName: "ROCKLEDGE AUTO SALES", vin: "WDDGF4HB2EA890123", fee: 90.00 },
  { date: "11/06/2025", stickerNumber: "AI509620089", workOrder: "9089", customerName: "GEO MOTORS GROUP LLC", vin: "JN1TBNT30U0901234", fee: 90.00 },
  { date: "11/06/2025", stickerNumber: "AI509620100", workOrder: "9100", customerName: "PENN MOTORS INC", vin: "1N4AA6AP8LC012345", fee: 90.00 },
  // Additional inspections to reach ~143
  ...Array.from({ length: 133 }, (_, i) => ({
    date: `11/${String(Math.floor(i / 10) + 7).padStart(2, '0')}/2025`,
    stickerNumber: `AI5096${20111 + i}`,
    workOrder: `${9111 + i}`,
    customerName: ["GEO MOTORS GROUP LLC", "PENN MOTORS INC", "KONSTANTINE ZARDIASHVILI", "ROCKLEDGE AUTO SALES"][i % 4],
    vin: `VIN${String(i + 200).padStart(14, '0')}`,
    fee: 90.00,
  })),
];

// December 2025 Inspections (Sample - 140 inspections)
export const decemberInspections: Inspection[] = [
  { date: "12/01/2025", stickerNumber: "AI509622001", workOrder: "10001", customerName: "PENN MOTORS INC", vin: "1FA6P8CF5L5123456", fee: 90.00 },
  { date: "12/01/2025", stickerNumber: "AI509622012", workOrder: "10012", customerName: "GEO MOTORS GROUP LLC", vin: "2GNAXUEV8L6234567", fee: 90.00 },
  { date: "12/02/2025", stickerNumber: "AI509622023", workOrder: "10023", customerName: "KONSTANTINE ZARDIASHVILI", vin: "3VW5T7AU5LM345678", fee: 90.00 },
  { date: "12/02/2025", stickerNumber: "AI509622034", workOrder: "10034", customerName: "ROCKLEDGE AUTO SALES", vin: "1G1FY6S00L4456789", fee: 90.00 },
  { date: "12/03/2025", stickerNumber: "AI509622045", workOrder: "10045", customerName: "PENN MOTORS INC", vin: "5YJ3E1EA7LF567890", fee: 90.00 },
  { date: "12/03/2025", stickerNumber: "AI509622056", workOrder: "10056", customerName: "GEO MOTORS GROUP LLC", vin: "1N4BL4BV5LC678901", fee: 90.00 },
  { date: "12/04/2025", stickerNumber: "AI509622067", workOrder: "10067", customerName: "KONSTANTINE ZARDIASHVILI", vin: "2C4RC1BG1LR789012", fee: 90.00 },
  { date: "12/04/2025", stickerNumber: "AI509622078", workOrder: "10078", customerName: "ROCKLEDGE AUTO SALES", vin: "3FA6P0LU9LR890123", fee: 90.00 },
  { date: "12/05/2025", stickerNumber: "AI509622089", workOrder: "10089", customerName: "PENN MOTORS INC", vin: "1FMCU9J94LUA01234", fee: 90.00 },
  { date: "12/05/2025", stickerNumber: "AI509622100", workOrder: "10100", customerName: "GEO MOTORS GROUP LLC", vin: "WVWZZZ3CZLE112345", fee: 90.00 },
  // Additional inspections to reach ~140
  ...Array.from({ length: 130 }, (_, i) => ({
    date: `12/${String(Math.floor(i / 10) + 8).padStart(2, '0')}/2025`,
    stickerNumber: `AI5096${22111 + i}`,
    workOrder: `${10111 + i}`,
    customerName: ["GEO MOTORS GROUP LLC", "PENN MOTORS INC", "KONSTANTINE ZARDIASHVILI", "ROCKLEDGE AUTO SALES"][i % 4],
    vin: `VIN${String(i + 300).padStart(14, '0')}`,
    fee: 90.00,
  })),
];

export const inspectionsSummary = {
  october: { count: 140, revenue: 12600.00 },
  november: { count: 143, revenue: 12870.00 },
  december: { count: 140, revenue: 12600.00 },
  total: { count: 423, revenue: 38070.00 },
};
