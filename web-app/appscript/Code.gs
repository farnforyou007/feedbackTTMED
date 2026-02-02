// กำหนดตัวแปรแบบ global สำหรับ Spreadsheet ID
var SPREADSHEET_ID = "1p2G06TxJ4YQ8qAYFiM3VFPQ-Q0n0itXBJMQ9jmDtBhY";

function doPost(e) {
  // Parse the request parameters
  var params = JSON.parse(e.postData.contents);
  var name = params.name;
  var type = params.type;
  var speed = params.speed;
  var accuracy = params.accuracy;
  var service = params.service;
  var comment = params.comment;

  // กำหนดวันที่และเวลาปัจจุบันในเขตเวลาของประเทศไทย
  var timezone = "Asia/Bangkok";
  var currentDatetime = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd HH:mm:ss");

  // Open the Google Sheets using the SpreadsheetApp
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

  // Append the new data to the sheet
  sheet.appendRow([currentDatetime, name, type, speed, accuracy, service, comment]);

  // Set CORS headers
  var response = {
    "status": "success"
  };
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);

}


function doGet(e) {

  var sheetName = e.parameter.sheet; // รับค่า sheet จากพารามิเตอร์
  var username = e.parameter.id ? e.parameter.id : null; // รับค่า id จากพารามิเตอร์ถ้ามี
  var result;
  
  // เปิด Google Sheets และกำหนด sheet ที่จะใช้งาน
  if(sheetName === "Users"){
     result = handleUsers(username);
    
    // Set CORS headers
    return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  }
  else if (sheetName === "Data") {
    var startDate = e.parameter.startDate;
    var endDate = e.parameter.endDate;
    var filterName = e.parameter.filterName;
    var filterType = e.parameter.filterType;
    result = handleData(startDate, endDate, filterName, filterType);

    // Set CORS headers
    return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);

  } else {
    result = HtmlService.createTemplateFromFile('report').evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('Feedback App By TTMED-PSU')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

     return result;
  }

  //console.log(JSON.stringify(result));

}


function handleUsers(username) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Users");
  var data = sheet.getDataRange().getValues();
  var filteredData = [];
  // Sheet2 กรองข้อมูลตาม id
  for (var i = 1; i < data.length; i++) { // Start from 1 to skip the header row
    if (data[i][0] == username) { // Check if id (first column) matches the specified id
      var row = {
        "id": data[i][0],
        "fullname": data[i][1],
        "position": data[i][2],
        "email": data[i][3],
        "image": data[i][4]
      };
      filteredData.push(row);
    }
  }
  return filteredData;

}

function handleLogin(email) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Users");
  var data = sheet.getDataRange().getValues();
  var filteredData = [];
  // Sheet2 กรองข้อมูลตาม id
  for (var i = 1; i < data.length; i++) { // Start from 1 to skip the header row
    if (data[i][3] == email) { // Check if id (first column) matches the specified id
      var row = {
        "id": data[i][0],
        "fullname": data[i][1],
        "position": data[i][2],
        "email": data[i][3],
        "image": data[i][4]
      };
      filteredData.push(row);
    }
  }
  return filteredData;

}

function handleData(startDate, endDate, filterName, filterType) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Data");
  var lastRow = sheet.getLastRow(); // จำนวนแถวทั้งหมดใน Sheet
  var chunkSize = 1000; // ขนาด chunk ที่ต้องการดึงในแต่ละครั้ง
  var filteredData = [];

  // แปลง startDate และ endDate เป็นวัตถุ Date
  var start = new Date(startDate);
  var end = new Date(endDate);

  for (var startRow = 2; startRow <= lastRow; startRow += chunkSize) {
    var endRow = Math.min(startRow + chunkSize - 1, lastRow);
    var data = sheet.getRange(startRow, 1, endRow - startRow + 1, sheet.getLastColumn()).getValues();

    // วนลูปข้อมูลใน chunk นี้
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var datetime = new Date(row[0]); // สมมติว่า datetime อยู่ในคอลัมน์แรก
      var name = row[1];
      var type = row[2]; // สมมติว่า name อยู่ในคอลัมน์ที่สอง

      // ตรวจสอบเงื่อนไขการกรอง
      if (datetime >= start && datetime <= end && name == filterName && filterType.includes(type)) {
        filteredData.push({
          datetime: row[0],
          name: row[1],
          type: row[2],
          speed: row[3],
          accuracy: row[4],
          service: row[5],
          comment: row[6]
        });
      }
    }
  }
  //console.log(JSON.stringify(filteredData));

  return filteredData;

}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
} 

function doLogin() {
 var email = Session.getActiveUser().getEmail();
     email = email ? email: null;
  if(email){
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Users");
    var data = sheet.getDataRange().getValues();
    var filteredData = [];

    for (var i = 1; i < data.length; i++) { // Start from 1 to skip the header row
      if (data[i][3] == email) { // Check if id (first column) matches the specified id
        var row = {
          "id": data[i][0],
          "fullname": data[i][1],
          "position": data[i][2],
          "email": data[i][3],
          "image": data[i][4]
        };
        filteredData.push(row);
      }
    }
  }
    // Logger.log(filteredData);
    return filteredData;
}

function testGetUser() {
  var id = 'ttmed.psu@gmail.com';
  var result = handleLogin(id);
  Logger.log(result);
}


function testGetFilteredData() {
  var startDate = '2024-08-01';
  var endDate = '2024-08-30';
  var filterName = 'นิติ โชติแก้ว';
  var filterType = ['นักศึกษา', 'อาจารย์'];

  var result = handleData(startDate, endDate, filterName, filterType);
  Logger.log(result);
}

