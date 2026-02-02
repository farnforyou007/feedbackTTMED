(function () {

    Swal.fire({
        title: 'กรุณารอสักครู่...',
        text: 'ระบบกำลังประมวลผลข้อมูล',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

    document.getElementById('start-date').value = new Date().getFullYear() + '-06-01';
    document.getElementById("end-date").value = new Date().getFullYear()+1 + '-05-31';

    const startdate_picker = new Pikaday({
        field: document.getElementById("start-date"),
        format: "YYYY-MM-DD",
      });

    const enddate_picker = new Pikaday({
        field: document.getElementById("end-date"),
        format: "YYYY-MM-DD"
    });

    fetchData();
})();

function show() {
    fetchData();
}

function fetchData() {
     
    const sheetParam = 'Data';
    const startParam = document.getElementById('start-date').value;
    const endParam = document.getElementById('end-date').value;
    const checkboxes = document.querySelectorAll('input[name="myCheckbox"]:checked');
    const TypeParam = Array.from(checkboxes).map(checkbox => checkbox.value);
    const list = document.getElementById('commentList');

    list.innerHTML = '';

                    let NameParam = 'นิติ โชติแก้ว';
                    axios.get(`${settings.API_URL}?sheet=${sheetParam}&startDate=${startParam}&endDate=${endParam}&filterName=${NameParam}&filterType=${TypeParam}`, {
                        headers: {
                            "Content-Type": "application/json"
                           },
                        })
                        .then(response => {
                            console.log('GET Response:', response.data);
                            
                           
                            let data = response.data;
                            let stat_type = [];
                            let stat_speed = [];
                            let stat_accuracy = [];
                            let stat_service = [];

                            data.forEach(row => {
                               stat_type.push(row.type);
                               stat_speed.push(parseFloat(row.speed));
                               stat_accuracy.push(parseFloat(row.accuracy));
                               stat_service.push(parseFloat(row.service));

                                if(row.comment){
                                   // stat_comment.push(row.comment);
                                   let newItem = document.createElement('li');
                                    newItem.textContent = row.comment;
                                    list.appendChild(newItem);
                                }
                               

                            });

                            let xbar_speed = getMean(stat_speed);
                            let xbar_accuracy = getMean(stat_accuracy);
                            let xbar_service = getMean(stat_service);
                            let xbar_total = (xbar_speed + xbar_accuracy + xbar_service) / 3;

                            let sd_speed = getSD(stat_speed);
                            let sd_accuracy = getSD(stat_accuracy);
                            let sd_service = getSD(stat_service);
                            let sd_total = (sd_speed + sd_accuracy + sd_service) / 3;



                            document.getElementById('countTotal').textContent = data.length;
                            document.getElementById('countStudentUG').textContent = stat_type.filter(c => c === 'นักศึกษาปริญญาตรี').length;
                            document.getElementById('countStudentGD').textContent = stat_type.filter(c => c === 'นักศึกษาบัณฑิตศึกษา').length;
                            document.getElementById('countLecturer').textContent = stat_type.filter(c => c === 'อาจารย์').length;
                            document.getElementById('countScientist').textContent = stat_type.filter(c => c === 'นักวิทยาศาสตร์').length;
                            document.getElementById('countStaffOffice').textContent = stat_type.filter(c => c === 'บุคลากรสํานักงานบริหารคณะ').length;
                            document.getElementById('countStaffHospital').textContent = stat_type.filter(c => c === 'บุคลากรโรงพยาบาล').length;
                            document.getElementById('countCustomer').textContent = stat_type.filter(c => c === 'ผู้ใช้บริการโรงพยาบาล').length;


                            document.getElementById('statSpeed').textContent = 'X̅ = ' + xbar_speed.toFixed(2) + '/ sd =' + sd_speed.toFixed(2);
                            document.getElementById('statAccuracy').textContent = 'X̅ = ' + xbar_accuracy.toFixed(2) + '/ sd =' + sd_accuracy.toFixed(2);
                            document.getElementById('statService').textContent = 'X̅ = ' + xbar_service.toFixed(2) + '/ sd =' + sd_service.toFixed(2);
                            document.getElementById('xbarTotal').textContent = xbar_total.toFixed(2);
                            document.getElementById('sdTotal').textContent = sd_total.toFixed(2);


                            document.getElementById('progress-speed').style.width = (xbar_speed/5)*100 + '%';
                            document.getElementById('progress-accuracy').style.width = (xbar_accuracy/5)*100 + '%';
                            document.getElementById('progress-service').style.width = (xbar_service/5)*100 + '%';

                            Swal.close();
                         // console.log(stat_type.filter(c => c === 'อาจารย์').length);
                         // console.log(getSD(stat_speed));

                        })
                        .catch(error => {
                            Swal.fire({
                                title: 'Error!',
                                text:  error,
                                icon: 'error',
                                confirmButtonText: 'OK'
                              });
                            //console.error('GET Error:', error);
                        });
}

// Arithmetic mean คำนวณหาค่าเฉลี่ยกลาง
function getMean(data) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
  }
  
  // Standard deviation คำนวณหาค่า SD
  function getSD(data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
  }
