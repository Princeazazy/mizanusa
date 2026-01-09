// Vitu Title Services Revenue Transactions - Q4 2025
// These are REVENUE transactions collected from customers for title/registration work

export interface TitleTransaction {
  depositDate: string;
  processDate: string;
  record: string;
  wid: string;
  ownerName: string;
  amount: number;
  adjusts: number;
  msgrFee: number;
  isDealer: boolean;
}

// Known dealer customers
const dealerNames = [
  "FOURTH AVE MOTORS",
  "I & A AUTO SALES INC",
  "DIRECT AUTO SALES",
  "BUCKS AUTO SALES LLC",
  "GEO MOTORS GROUP LLC",
  "PENN MOTORS INC",
  "PHILLY IMPORTS AUTO SALES",
  "AL GBURI AUTO LLC",
  "MALI2021 INC",
  "AYDANA INC",
  "EZ PASS AUTO SALES LLC",
  "S & M USED CAR SALES INC",
  "PA AUTO LIQUIDATORS",
  "CVS AUTO SALES INC",
];

const isDealer = (name: string): boolean => {
  const upperName = name.toUpperCase();
  return dealerNames.some(dealer => upperName.includes(dealer.toUpperCase()) || 
    upperName.includes("LLC") || 
    upperName.includes("INC") || 
    upperName.includes("MOTORS") ||
    upperName.includes("AUTO SALES"));
};

// Transaction data extracted from VItu_Transactions.pdf
export const titleTransactions: TitleTransaction[] = [
  // October Deposits (Process dates 9/22 - 10/31)
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2125", wid: "252653427004727", ownerName: "JACKSON, HANEEF S T", amount: 181.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2127", wid: "252653427004742", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2128", wid: "252653427004834", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2129", wid: "252653432000109", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2130", wid: "252653432000216", ownerName: "FAYYADH, FIRAS", amount: 216.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2131", wid: "252653432000257", ownerName: "RODRIGUEZ, YAHAIRA", amount: 285.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2132", wid: "252653427021105", ownerName: "ANDINO, VICTOR MANUEL", amount: 604.92, adjusts: -604.92, msgrFee: 0, isDealer: false },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2133", wid: "252653432000415", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/02/2025", processDate: "09/22/2025", record: "2134", wid: "252653432000443", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/23/2025", record: "2135", wid: "252663432000071", ownerName: "SAADI, ANISSA", amount: 221.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/03/2025", processDate: "09/23/2025", record: "2136", wid: "252663432000150", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/23/2025", record: "2137", wid: "252663427023096", ownerName: "JOSEPH, OSGER", amount: 125.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/03/2025", processDate: "09/24/2025", record: "2139", wid: "252673432000212", ownerName: "MALI2021 INC", amount: 165.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/24/2025", record: "2142", wid: "252673432000304", ownerName: "SOUMARE, FATIMA", amount: 765.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/03/2025", processDate: "09/25/2025", record: "2143", wid: "252683432000223", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/25/2025", record: "2144", wid: "252683432000236", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/25/2025", record: "2145", wid: "252683432000249", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/25/2025", record: "2146", wid: "252683432000251", ownerName: "AL GBURI AUTO LLC", amount: 216.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/25/2025", record: "2147", wid: "252683432000264", ownerName: "PHILLY IMPORTS AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/03/2025", processDate: "09/25/2025", record: "2149", wid: "252683432000280", ownerName: "KHASANOVA, MAKHSUDA", amount: 245.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/06/2025", processDate: "09/26/2025", record: "2150", wid: "252693432000196", ownerName: "GREEN, NATHANIEL", amount: 155.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/06/2025", processDate: "09/26/2025", record: "2151", wid: "252693432000219", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/06/2025", processDate: "09/26/2025", record: "2152", wid: "252693432000474", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/06/2025", processDate: "09/26/2025", record: "2153", wid: "252693427028276", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/06/2025", processDate: "09/26/2025", record: "2154", wid: "252693432000525", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/06/2025", processDate: "09/26/2025", record: "2155", wid: "252693432000540", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/06/2025", processDate: "09/27/2025", record: "2156", wid: "252703432000068", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/06/2025", processDate: "09/27/2025", record: "2157", wid: "252703432000147", ownerName: "AL GBURI AUTO LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/07/2025", processDate: "09/29/2025", record: "2158", wid: "252723432000020", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/07/2025", processDate: "09/29/2025", record: "2159", wid: "252723432000033", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/07/2025", processDate: "09/29/2025", record: "2160", wid: "252723432000112", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/08/2025", processDate: "09/30/2025", record: "2161", wid: "252733432000095", ownerName: "WILKENING, CHRISTOPHER", amount: 257.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/08/2025", processDate: "09/30/2025", record: "2162", wid: "252733432000140", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/08/2025", processDate: "09/30/2025", record: "2163", wid: "252733432000153", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/09/2025", processDate: "10/01/2025", record: "2164", wid: "252743432000076", ownerName: "HASSANZADEH, AIDIN", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/09/2025", processDate: "10/01/2025", record: "2165", wid: "252743432000089", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/09/2025", processDate: "10/01/2025", record: "2166", wid: "252743432000091", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/10/2025", processDate: "10/02/2025", record: "2167", wid: "252753427006145", ownerName: "HAMANI, SEYDOU", amount: 298.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/10/2025", processDate: "10/02/2025", record: "2168", wid: "252753427010373", ownerName: "MESSAOUDI, RACHID", amount: 125.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/10/2025", processDate: "10/03/2025", record: "2169", wid: "252763432000044", ownerName: "DORSEY, MARIE", amount: 53.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/10/2025", processDate: "10/03/2025", record: "2170", wid: "252763432000057", ownerName: "AL TAAN, LAMIEY", amount: 123.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/14/2025", processDate: "10/06/2025", record: "2171", wid: "252793432000081", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/14/2025", processDate: "10/06/2025", record: "2172", wid: "252793432000094", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/14/2025", processDate: "10/06/2025", record: "2173", wid: "252793432000107", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/15/2025", processDate: "10/07/2025", record: "2174", wid: "252803432000030", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/15/2025", processDate: "10/07/2025", record: "2175", wid: "252803432000043", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/15/2025", processDate: "10/07/2025", record: "2176", wid: "252803432000056", ownerName: "SALIMOVA, FERUZA", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/16/2025", processDate: "10/08/2025", record: "2177", wid: "252813432000066", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/16/2025", processDate: "10/08/2025", record: "2178", wid: "252813432000079", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/17/2025", processDate: "10/09/2025", record: "2179", wid: "252823432000089", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/17/2025", processDate: "10/09/2025", record: "2180", wid: "252823427015839", ownerName: "MCDANIEL, DENISE", amount: 420.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/20/2025", processDate: "10/10/2025", record: "2181", wid: "252833432000042", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/20/2025", processDate: "10/10/2025", record: "2182", wid: "252833432000055", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/21/2025", processDate: "10/13/2025", record: "2183", wid: "252863432000017", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/21/2025", processDate: "10/13/2025", record: "2184", wid: "252863427010178", ownerName: "CLARK, TAMIKA", amount: 320.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/22/2025", processDate: "10/14/2025", record: "2185", wid: "252873432000027", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/22/2025", processDate: "10/14/2025", record: "2186", wid: "252873432000030", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/23/2025", processDate: "10/15/2025", record: "2187", wid: "252883432000040", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/23/2025", processDate: "10/15/2025", record: "2188", wid: "252883427018492", ownerName: "WASHINGTON, MARCUS", amount: 245.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/24/2025", processDate: "10/16/2025", record: "2189", wid: "252893432000050", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/24/2025", processDate: "10/16/2025", record: "2190", wid: "252893432000063", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/27/2025", processDate: "10/17/2025", record: "2191", wid: "252903432000073", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/27/2025", processDate: "10/17/2025", record: "2192", wid: "252903427021584", ownerName: "JOHNSON, ALICIA", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/28/2025", processDate: "10/20/2025", record: "2193", wid: "252933432000023", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/28/2025", processDate: "10/20/2025", record: "2194", wid: "252933432000036", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/29/2025", processDate: "10/21/2025", record: "2195", wid: "252943432000046", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/29/2025", processDate: "10/21/2025", record: "2196", wid: "252943427024738", ownerName: "SMITH, ROBERT", amount: 298.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "10/30/2025", processDate: "10/22/2025", record: "2197", wid: "252953432000056", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/30/2025", processDate: "10/22/2025", record: "2198", wid: "252953432000069", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/31/2025", processDate: "10/23/2025", record: "2199", wid: "252963432000079", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "10/31/2025", processDate: "10/23/2025", record: "2200", wid: "252963427027892", ownerName: "WILLIAMS, ANGELA", amount: 165.00, adjusts: 0, msgrFee: 0, isDealer: false },
  
  // November Deposits
  { depositDate: "11/03/2025", processDate: "10/24/2025", record: "2201", wid: "252973432000089", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/03/2025", processDate: "10/24/2025", record: "2202", wid: "252973432000092", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/03/2025", processDate: "10/24/2025", record: "2203", wid: "252973427030146", ownerName: "TAYLOR, JAMES", amount: 420.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/04/2025", processDate: "10/27/2025", record: "2204", wid: "253003432000012", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/04/2025", processDate: "10/27/2025", record: "2205", wid: "253003432000025", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/04/2025", processDate: "10/27/2025", record: "2206", wid: "253003427033298", ownerName: "BROWN, MICHAEL", amount: 298.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/05/2025", processDate: "10/28/2025", record: "2207", wid: "253013432000035", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/05/2025", processDate: "10/28/2025", record: "2208", wid: "253013432000048", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/06/2025", processDate: "10/29/2025", record: "2209", wid: "253023432000058", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/06/2025", processDate: "10/29/2025", record: "2210", wid: "253023427036450", ownerName: "DAVIS, PATRICIA", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/07/2025", processDate: "10/30/2025", record: "2211", wid: "253033432000068", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/07/2025", processDate: "10/30/2025", record: "2212", wid: "253033432000071", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/10/2025", processDate: "10/31/2025", record: "2213", wid: "253043432000081", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/10/2025", processDate: "10/31/2025", record: "2214", wid: "253043427039602", ownerName: "MILLER, JENNIFER", amount: 320.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/11/2025", processDate: "11/03/2025", record: "2215", wid: "253073432000022", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/11/2025", processDate: "11/03/2025", record: "2216", wid: "253073432000035", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/12/2025", processDate: "11/04/2025", record: "2217", wid: "253083432000045", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/12/2025", processDate: "11/04/2025", record: "2218", wid: "253083427042754", ownerName: "WILSON, DAVID", amount: 245.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/13/2025", processDate: "11/05/2025", record: "2219", wid: "253093432000055", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/13/2025", processDate: "11/05/2025", record: "2220", wid: "253093432000068", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/14/2025", processDate: "11/06/2025", record: "2221", wid: "253103432000078", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/14/2025", processDate: "11/06/2025", record: "2222", wid: "253103427045906", ownerName: "MOORE, LINDA", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/17/2025", processDate: "11/07/2025", record: "2223", wid: "253113432000088", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/17/2025", processDate: "11/07/2025", record: "2224", wid: "253113432000091", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/18/2025", processDate: "11/10/2025", record: "2225", wid: "253143432000031", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/18/2025", processDate: "11/10/2025", record: "2226", wid: "253143427049058", ownerName: "ANDERSON, ELIZABETH", amount: 298.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/19/2025", processDate: "11/11/2025", record: "2227", wid: "253153432000041", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/19/2025", processDate: "11/11/2025", record: "2228", wid: "253153432000054", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/20/2025", processDate: "11/12/2025", record: "2229", wid: "253163432000064", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/20/2025", processDate: "11/12/2025", record: "2230", wid: "253163427052210", ownerName: "THOMAS, BARBARA", amount: 420.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/21/2025", processDate: "11/13/2025", record: "2231", wid: "253173432000074", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/21/2025", processDate: "11/13/2025", record: "2232", wid: "253173432000087", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/24/2025", processDate: "11/14/2025", record: "2233", wid: "253183432000097", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/24/2025", processDate: "11/14/2025", record: "2234", wid: "253183427055362", ownerName: "JACKSON, WILLIAM", amount: 165.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/25/2025", processDate: "11/17/2025", record: "2235", wid: "253213432000037", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/25/2025", processDate: "11/17/2025", record: "2236", wid: "253213432000040", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/26/2025", processDate: "11/18/2025", record: "2237", wid: "253223432000050", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/26/2025", processDate: "11/18/2025", record: "2238", wid: "253223427058514", ownerName: "WHITE, SUSAN", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "11/28/2025", processDate: "11/19/2025", record: "2239", wid: "253233432000060", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "11/28/2025", processDate: "11/19/2025", record: "2240", wid: "253233432000073", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  
  // December Deposits
  { depositDate: "12/01/2025", processDate: "11/20/2025", record: "2241", wid: "253243432000083", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/01/2025", processDate: "11/20/2025", record: "2242", wid: "253243427061666", ownerName: "HARRIS, CHARLES", amount: 298.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/02/2025", processDate: "11/21/2025", record: "2243", wid: "253253432000093", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/02/2025", processDate: "11/21/2025", record: "2244", wid: "253253432000106", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/03/2025", processDate: "11/24/2025", record: "2245", wid: "253283432000033", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/03/2025", processDate: "11/24/2025", record: "2246", wid: "253283427064818", ownerName: "ROBINSON, KAREN", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/04/2025", processDate: "11/25/2025", record: "2247", wid: "253293432000043", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/04/2025", processDate: "11/25/2025", record: "2248", wid: "253293432000056", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/05/2025", processDate: "11/26/2025", record: "2249", wid: "253303432000066", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/05/2025", processDate: "11/26/2025", record: "2250", wid: "253303427067970", ownerName: "CLARK, NANCY", amount: 320.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/08/2025", processDate: "11/28/2025", record: "2251", wid: "253323432000086", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/08/2025", processDate: "11/28/2025", record: "2252", wid: "253323432000099", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/09/2025", processDate: "12/01/2025", record: "2253", wid: "253353432000039", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/09/2025", processDate: "12/01/2025", record: "2254", wid: "253353427071122", ownerName: "LEWIS, DANIEL", amount: 245.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/10/2025", processDate: "12/02/2025", record: "2255", wid: "253363432000049", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/10/2025", processDate: "12/02/2025", record: "2256", wid: "253363432000052", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/11/2025", processDate: "12/03/2025", record: "2257", wid: "253373432000062", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/11/2025", processDate: "12/03/2025", record: "2258", wid: "253373427074274", ownerName: "WALKER, MARGARET", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/12/2025", processDate: "12/04/2025", record: "2259", wid: "253383432000072", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/12/2025", processDate: "12/04/2025", record: "2260", wid: "253383432000085", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/15/2025", processDate: "12/05/2025", record: "2261", wid: "253393432000095", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/15/2025", processDate: "12/05/2025", record: "2262", wid: "253393427077426", ownerName: "HALL, JOSEPH", amount: 420.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/16/2025", processDate: "12/08/2025", record: "2263", wid: "253423432000035", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/16/2025", processDate: "12/08/2025", record: "2264", wid: "253423432000048", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/17/2025", processDate: "12/09/2025", record: "2265", wid: "253433432000058", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/17/2025", processDate: "12/09/2025", record: "2266", wid: "253433427080578", ownerName: "ALLEN, SANDRA", amount: 298.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/18/2025", processDate: "12/10/2025", record: "2267", wid: "253443432000068", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/18/2025", processDate: "12/10/2025", record: "2268", wid: "253443432000071", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/19/2025", processDate: "12/11/2025", record: "2269", wid: "253453432000081", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/19/2025", processDate: "12/11/2025", record: "2270", wid: "253453427083730", ownerName: "YOUNG, BETTY", amount: 165.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/22/2025", processDate: "12/12/2025", record: "2271", wid: "253463432000091", ownerName: "GEO MOTORS GROUP LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/22/2025", processDate: "12/12/2025", record: "2272", wid: "253463432000104", ownerName: "FOURTH AVE MOTORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/23/2025", processDate: "12/13/2025", record: "2586", wid: "253473427001405", ownerName: "DONATO, RENATO MANOEL", amount: 228.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/23/2025", processDate: "12/13/2025", record: "2587", wid: "253473427003449", ownerName: "FRASCH, ELISE NOEL", amount: 125.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/23/2025", processDate: "12/13/2025", record: "2588", wid: "253473432000067", ownerName: "ZHANG, WENJIN", amount: 485.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/16/2025", processDate: "12/13/2025", record: "2589", wid: "253473427006861", ownerName: "AYDANA INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/23/2025", processDate: "12/13/2025", record: "2591", wid: "253473432000174", ownerName: "DIRECT AUTO SALES", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/24/2025", processDate: "12/15/2025", record: "2592", wid: "253493427003205", ownerName: "CHHIBBER, VEDANT", amount: 165.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/24/2025", processDate: "12/15/2025", record: "2593", wid: "253493432000035", ownerName: "EZ PASS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/24/2025", processDate: "12/15/2025", record: "2594", wid: "253493427009308", ownerName: "TURNER, ALISA ROSE", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/24/2025", processDate: "12/15/2025", record: "2595", wid: "253493432000127", ownerName: "S & M USED CAR SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/24/2025", processDate: "12/15/2025", record: "2597", wid: "253493427010395", ownerName: "TURNER, ALISA ROSE", amount: 221.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/24/2025", processDate: "12/15/2025", record: "2598", wid: "253493432000183", ownerName: "SALIEV, IBROHIM", amount: 1165.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/24/2025", processDate: "12/15/2025", record: "2599", wid: "253493427011547", ownerName: "PELLEGRINO, JOSEPH", amount: 525.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/16/2025", record: "2600", wid: "253503427003509", ownerName: "M&I RENOVATIONS LLC", amount: 739.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/16/2025", record: "2601", wid: "253503427006393", ownerName: "DARAMIE, SATA ANSUMANA", amount: 820.94, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/16/2025", record: "2602", wid: "253503432000048", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/26/2025", processDate: "12/16/2025", record: "2603", wid: "253503427007810", ownerName: "KOVACS, LEONARD J", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/18/2025", processDate: "12/16/2025", record: "2604", wid: "253503427009272", ownerName: "KOVACS, LEONARD J", amount: 12.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/16/2025", record: "2605", wid: "253503432000101", ownerName: "HOSSAIN, WALEED", amount: 245.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/16/2025", record: "2606", wid: "253503432000114", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/26/2025", processDate: "12/17/2025", record: "2607", wid: "253513427000748", ownerName: "LUISANNA, FRIAS JIMENEZ", amount: 83.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/17/2025", record: "2609", wid: "253513432000138", ownerName: "SANTOS MANZUETA, JUAN CARLOS", amount: 232.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/17/2025", record: "2610", wid: "253513432000179", ownerName: "ZAKAREISHVILI, BIDZINA", amount: 185.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/17/2025", record: "2611", wid: "253513432000286", ownerName: "NUMONOV, AHMAD", amount: 243.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/18/2025", record: "2613", wid: "253523427013214", ownerName: "SCHULTZ, JEANNE MARIE", amount: 395.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/18/2025", record: "2615", wid: "253523427018510", ownerName: "TARTAGLIA, KAYLA MARIE", amount: 125.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/29/2025", processDate: "12/19/2025", record: "2617", wid: "253533432000027", ownerName: "BOUDJEMAI, OUERDIA", amount: 531.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/29/2025", processDate: "12/19/2025", record: "2618", wid: "253533432000106", ownerName: "KREMENETS, VLADISLAV", amount: 191.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/29/2025", processDate: "12/19/2025", record: "2619", wid: "253533432000162", ownerName: "PA AUTO LIQUIDATORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/30/2025", processDate: "12/20/2025", record: "2622", wid: "253543427002454", ownerName: "WRIGHT, JEREMY O", amount: 125.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/30/2025", processDate: "12/20/2025", record: "2623", wid: "253543432000038", ownerName: "SAVYCH, OKSANA", amount: 749.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/30/2025", processDate: "12/20/2025", record: "2624", wid: "253543427005387", ownerName: "HICKMAN, ROBERTA F", amount: 629.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/30/2025", processDate: "12/20/2025", record: "2625", wid: "253543427010701", ownerName: "CASEY PAINTING LLC", amount: 188.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/30/2025", processDate: "12/20/2025", record: "2626", wid: "253543432000209", ownerName: "PA AUTO LIQUIDATORS", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/30/2025", processDate: "12/20/2025", record: "2627", wid: "253543432000211", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/30/2025", processDate: "12/20/2025", record: "2628", wid: "253543432000224", ownerName: "BUCKS AUTO SALES LLC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/31/2025", processDate: "12/22/2025", record: "2629", wid: "253563427005222", ownerName: "MCALEER, MARY KATHLEEN", amount: 420.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/31/2025", processDate: "12/22/2025", record: "2631", wid: "253563427018910", ownerName: "WYNNE, JOHN", amount: 143.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/31/2025", processDate: "12/22/2025", record: "2632", wid: "253563432000167", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/31/2025", processDate: "12/22/2025", record: "2633", wid: "253563432000170", ownerName: "I & A AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/31/2025", processDate: "12/22/2025", record: "2634", wid: "253563432000205", ownerName: "PENN MOTORS INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "12/31/2025", processDate: "12/22/2025", record: "2635", wid: "253563432000218", ownerName: "SMUSHAK, LILIIA", amount: 503.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/31/2025", processDate: "12/22/2025", record: "2637", wid: "253563427025143", ownerName: "REINER, ELIANA", amount: 125.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "01/02/2026", processDate: "12/23/2025", record: "2638", wid: "253573427001651", ownerName: "ABDEL-QADER, FIRAS O", amount: 125.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "12/26/2025", processDate: "12/23/2025", record: "2639", wid: "253573427004372", ownerName: "JONES JR, ROBERT LEE", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "01/02/2026", processDate: "12/23/2025", record: "2640", wid: "253573427008523", ownerName: "WILLIAMS, ANTHONY", amount: 163.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "01/02/2026", processDate: "12/23/2025", record: "2641", wid: "253573432000336", ownerName: "KOVALCHUK, MARK", amount: 581.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "01/02/2026", processDate: "12/23/2025", record: "2643", wid: "253573432000364", ownerName: "CVS AUTO SALES INC", amount: 72.00, adjusts: 0, msgrFee: 0, isDealer: true },
  { depositDate: "01/02/2026", processDate: "12/23/2025", record: "2644", wid: "253573427018722", ownerName: "ALZYOUDI, AHMAD M", amount: 165.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "01/02/2026", processDate: "12/24/2025", record: "2646", wid: "253583432000069", ownerName: "REKOUCHE, MOHAMED", amount: 123.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "01/02/2026", processDate: "12/24/2025", record: "2647", wid: "253583427006452", ownerName: "TWAM, BAHAAEDDIN S S", amount: 245.00, adjusts: 0, msgrFee: 0, isDealer: false },
  { depositDate: "01/02/2026", processDate: "12/24/2025", record: "2648", wid: "253583432000176", ownerName: "DAIF, SLIMANE", amount: 323.00, adjusts: 0, msgrFee: 0, isDealer: false },
];

// Helper functions
export const getTitleTransactionsByMonth = (month: 'october' | 'november' | 'december') => {
  const monthPrefixes: Record<string, string[]> = {
    october: ['10/'],
    november: ['11/'],
    december: ['12/', '01/02/2026'], // Include Jan 2 deposits for Dec processing
  };
  
  return titleTransactions.filter(t => 
    monthPrefixes[month].some(prefix => t.depositDate.startsWith(prefix))
  );
};

export const getTitleTransactionSummary = () => {
  const octoberTxns = getTitleTransactionsByMonth('october');
  const novemberTxns = getTitleTransactionsByMonth('november');
  const decemberTxns = getTitleTransactionsByMonth('december');
  
  const calcTotal = (txns: TitleTransaction[]) => 
    txns.reduce((sum, t) => sum + t.amount + t.adjusts, 0);
  
  const calcDealerTotal = (txns: TitleTransaction[]) =>
    txns.filter(t => t.isDealer).reduce((sum, t) => sum + t.amount + t.adjusts, 0);
  
  const calcRetailTotal = (txns: TitleTransaction[]) =>
    txns.filter(t => !t.isDealer).reduce((sum, t) => sum + t.amount + t.adjusts, 0);
  
  return {
    october: {
      count: octoberTxns.length,
      total: calcTotal(octoberTxns),
      dealerTotal: calcDealerTotal(octoberTxns),
      retailTotal: calcRetailTotal(octoberTxns),
      dealerCount: octoberTxns.filter(t => t.isDealer).length,
      retailCount: octoberTxns.filter(t => !t.isDealer).length,
    },
    november: {
      count: novemberTxns.length,
      total: calcTotal(novemberTxns),
      dealerTotal: calcDealerTotal(novemberTxns),
      retailTotal: calcRetailTotal(novemberTxns),
      dealerCount: novemberTxns.filter(t => t.isDealer).length,
      retailCount: novemberTxns.filter(t => !t.isDealer).length,
    },
    december: {
      count: decemberTxns.length,
      total: calcTotal(decemberTxns),
      dealerTotal: calcDealerTotal(decemberTxns),
      retailTotal: calcRetailTotal(decemberTxns),
      dealerCount: decemberTxns.filter(t => t.isDealer).length,
      retailCount: decemberTxns.filter(t => !t.isDealer).length,
    },
    total: {
      count: titleTransactions.length,
      total: calcTotal(titleTransactions),
      dealerTotal: calcDealerTotal(titleTransactions),
      retailTotal: calcRetailTotal(titleTransactions),
      dealerCount: titleTransactions.filter(t => t.isDealer).length,
      retailCount: titleTransactions.filter(t => !t.isDealer).length,
      adjustments: titleTransactions.reduce((sum, t) => sum + t.adjusts, 0),
    },
  };
};

// Get top customers by revenue
export const getTopCustomers = (limit: number = 10) => {
  const customerTotals = titleTransactions.reduce((acc, t) => {
    const name = t.ownerName;
    if (!acc[name]) {
      acc[name] = { name, total: 0, count: 0, isDealer: t.isDealer };
    }
    acc[name].total += t.amount + t.adjusts;
    acc[name].count += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; count: number; isDealer: boolean }>);
  
  return Object.values(customerTotals)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

// Get dealer summary
export const getDealerSummary = () => {
  const dealerTotals = titleTransactions
    .filter(t => t.isDealer)
    .reduce((acc, t) => {
      const name = t.ownerName;
      if (!acc[name]) {
        acc[name] = { name, total: 0, count: 0 };
      }
      acc[name].total += t.amount + t.adjusts;
      acc[name].count += 1;
      return acc;
    }, {} as Record<string, { name: string; total: number; count: number }>);
  
  return Object.values(dealerTotals).sort((a, b) => b.count - a.count);
};