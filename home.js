class QuanLyDanhMuc {
    danhSachTaiKhoan = [];

    loadInit = async () => {
        await this.getDanhSachTaiKhoan();
        this.createTableTaiKhoan();
    }

    createTableTaiKhoan = () => {
        let tableHeader =
            `<table class="table table-bordered table-hover table-responsive-lg table-responsive-md table-responsive-sm" id="idTableDanhSachTaiKhoan"> ` +
            `<thead>` +
            `<th scope="col">NO.</th>` +
            `<th scope="col">Mã Danh Mục</th>` +
            `<th scope="col">Tên Danh Mục</th>` +
            `<th scope="col"></th>` +
            `</thead>` +
            `<tbody>`;
        let tableBody = '';
        this.danhSachTaiKhoan.forEach((e, index) => {
            tableBody +=
                `<tr>` +
                `<td>${index + 1}</td>` +
                `<td>${e.maDanhMuc ? e.maDanhMuc : "Không xác định"}</td>` +
                `<td>${e.tenDanhMuc ? e.tenDanhMuc : "Không xác định"}</td>` +
                `<td class="text-center">` +
                    `<div class="showTooltip">` +
                        `<span class="tooltip">Xem chi tiết</span>` +
                        `<button type="button" class="btn btn-primary btnXemThongTin btn-rounded">` +
                            `<i class="text-center text-white mdi mdi-book-open-page-variant m-0 p-0"></i>` +
                        `</button>` +
                    `</div>` +
                    `</td>` +
                `</tr>`;
        });
        let tableFooter =
            `</tbody>` +
            `</table>`;
        let result = tableHeader + tableBody + tableFooter;
        $('.tableDanhSachTaiKhoan').html(result);
        
        // Khởi tạo DataTable
        let table = new DataTable('#idTableDanhSachTaiKhoan', {
            searching: true,
            info: false,
            paging: true,
            ordering: false,
            lengthMenu: [10]
        });

        $('.dataTables_length').hide();

        // Xử lý sự kiện click vào hàng để xem chi tiết
        table.on('dblclick', 'tbody tr', e => {
            let data = this.danhSachTaiKhoan[table.row(e.currentTarget).index()];
            this.fillDataToForm(data);
        });

        this.btnXemThongTinChiTiet_Click();
    }

    getDanhSachTaiKhoan = async () => {
        try {
            let response = await axios.get("http://localhost:5050/getAllDanhMuc");
            if (response.data.success) {
                this.danhSachTaiKhoan = response.data.data.map(e => ({
                    maDanhMuc: e.maDanhMuc,
                    tenDanhMuc: e.tenDanhMuc
                }));
            } else {
                Swal.fire({
                    title: 'Thông báo',
                    text: 'Đã xảy ra lỗi!',
                    icon: 'error'
                });
                
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi!',
                icon: 'error'
            });
            
        }
    }

    fillDataToForm = (item) => {
        // Cập nhật form với dữ liệu của danh mục
        $('#maDanhMuc').val(item.maDanhMuc);
        $('#tenDanhMuc').val(item.tenDanhMuc);
    }

    btnXemThongTinChiTiet_Click = () => {
        $('#idTableDanhSachTaiKhoan').on('click', '.btnXemThongTin', (e) => {
            let trElement = $(e.currentTarget).closest('tr');
            let maDanhMuc = trElement.find('td:eq(1)').text();
            let data = this.danhSachTaiKhoan.find(item => item.maDanhMuc === maDanhMuc);
            this.fillDataToForm(data);
        });
    }
}
