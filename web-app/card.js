
// const SUPABASE_URL = 'https://yzegultmfbdwunocrraf.supabase.co';
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZWd1bHRtZmJkd3Vub2NycmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjYwODksImV4cCI6MjA4NTMwMjA4OX0.UAri00e0ZwsGRVx_-ONmG93c_51c7oHaZOcT49N0D5E';

// localsuopabase server
const SUPABASE_URL = 'http://localhost:8000';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY5OTY1MjAwLCJleHAiOjE5Mjc3MzE2MDB9.0YgkWXeimYBK8m5NPT22pwx5g5yw1OuAnD8tTNeVzMo';
const searchParams = new URLSearchParams(window.location.search);

(function () {
    'use strict';
    const form = document.getElementById('dataForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        // ตรวจสอบการกรอกข้อมูลเบื้องต้น
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.reportValidity();
            return;
        }

        const postIdInput = document.getElementById('post-username');
        if (!postIdInput || !postIdInput.value) {
            Swal.fire({ title: 'Error!', text: 'ไม่พบไอดีผู้ถูกประเมิน กรุณารีโหลดหน้าเว็บ', icon: 'error' });
            return;
        }

        const dataToSupabase = {
            datetime: new Date().toISOString(),
            name: postIdInput.value,
            type: document.getElementById('type').value,
            speed: parseInt(document.querySelector('input[name="speed"]:checked')?.value || 0),
            accuracy: parseInt(document.querySelector('input[name="accuracy"]:checked')?.value || 0),
            service: parseInt(document.querySelector('input[name="service"]:checked')?.value || 0),
            comment: document.getElementById('comment').value
        };

        Swal.fire({
            title: 'ส่งข้อมูล...',
            text: 'กรุณารอสักครู่กำลังส่งข้อมูลของคุณ.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        axios.post(`${SUPABASE_URL}/rest/v1/data`, dataToSupabase, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
        })
        .then(response => {
            Swal.fire({ title: 'บันทึกสำเร็จ!', text: 'ขอบคุณสำหรับการประเมินครับ', icon: 'success' });
            form.reset();
        })
        .catch(error => {
            Swal.fire({ title: 'Error!', text: error.message, icon: 'error' });
        });
    }, false);

    fetchData();
})();

function fetchData() {
    if (searchParams.has('id')) {
        let idParam = searchParams.get('id');
        axios.get(`${SUPABASE_URL}/rest/v1/users?id=eq.${idParam}&select=*`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
        })
        .then(response => {
            if (response.data.length > 0) {
                displayData(response.data);
            } else {
                Swal.fire({ title: 'Error!', text: 'ไม่พบข้อมูลผู้ถูกประเมิน', icon: 'error' });
            }
        })
        .catch(error => {
            Swal.fire({ title: 'Error!', text: error.message, icon: 'error' });
        });
    } else {
        document.getElementById("dataForm").style.display = "none";
        Swal.fire({ title: 'Error!', text: 'กรุณาระบุ ID ผู้ถูกประเมิน', icon: 'error' });
    }
}

function displayData(posts) {
    const container = document.getElementById('data-container');
    const postImage = document.getElementById('post-image');
    const postIdInput = document.getElementById('post-username');
    const post = posts[0];

    if (postImage) {
        postImage.src = post.image || 'https://www.ttmed.psu.ac.th/th/staff/images/staff/new.jpg';
    }

    if (postIdInput) {
        postIdInput.value = post.fullname;
    }

    container.innerHTML = `
        <h2 class="text-xl font-bold text-gray-800 leading-tight">${post.fullname}</h2>
        <p class="text-sm text-gray-500 mt-1">${post.position || ''}</p>
    `;
}