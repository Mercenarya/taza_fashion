import mysql.connector
from email.mime.text import MIMEText
import smtplib
from flask import (
    Flask, request, redirect, url_for,
    session, flash, jsonify
)

app = Flask(__name__)

# Hàm kết nối đến cơ sở dữ liệu qua mysql-connector-python
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Minh_17102004",
        database="taza"
    )

###############################
# Dummy Login để thiết lập session, demo:
###############################
@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Để mô phỏng, route này cho phép người dùng đăng nhập và chọn vai trò.
    Nếu role là superadmin thì có thể truy cập vào biểu mẫu chỉnh sửa quyền.
    """
    if request.method == "POST":
        username = request.form.get("username")
        role = request.form.get("role")  # role nên là 'admin' hoặc 'superadmin'
        session['username'] = username
        session['role'] = role
        flash(f"Đăng nhập với vai trò: {role}", "info")
        return redirect(url_for("dashboard"))
    return '''
    <h2>Đăng nhập</h2>
    <form method="post">
        Tên đăng nhập: <input type="text" name="username"><br>
        Vai trò:
        <select name="role">
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
        </select><br>
        <input type="submit" value="Đăng nhập">
    </form>
    '''

@app.route('/logout')
def logout():
    session.clear()
    flash("Đăng xuất thành công", "info")
    return redirect(url_for("login"))

###############################
# Route Dashboard thống kê
###############################
@app.route('/dashboard', methods=['GET'])
def dashboard():
    """
    Truy xuất thống kê:
      - Tổng doanh số bán hàng (giả sử trường total_amount trong Orders)
      - Số lượng đơn hàng
      - Số lượng người dùng
    Kết quả trả về theo dạng JSON.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM Orders")
        total_sales = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(order_id) FROM Orders")
        order_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(user_id) FROM Users")
        user_count = cursor.fetchone()[0]
    except Exception as e:
        conn.rollback()
        total_sales, order_count, user_count = 0, 0, 0
        flash("Lỗi khi truy xuất dữ liệu: " + str(e), "error")

    cursor.close()
    conn.close()

    stats = {
        "total_sales": total_sales,
        "order_count": order_count,
        "user_count": user_count
    }
    return jsonify(stats)

###############################
# Route chỉnh sửa quyền (chỉ dành cho superadmin)
###############################
@app.route('/update-permissions', methods=['GET', 'POST'])
def update_permissions():
    """
    Cho phép người dùng có role 'superadmin' cập nhật quyền của Admin.
    Nếu method GET: hiển thị form đơn giản.
    Nếu method POST: cập nhật dữ liệu vào bảng Admin_Permission.
    """
    if session.get('role') != 'superadmin':
        return "Bạn không có quyền truy cập chức năng này", 403

    if request.method == "POST":
        admin_id = request.form.get('admin_id')
        # Xử lý checkbox: "on" nếu được chọn, None nếu không chọn.
        can_manage_users = True if request.form.get('can_manage_users') == 'on' else False
        can_manage_orders = True if request.form.get('can_manage_orders') == 'on' else False
        can_manage_products = True if request.form.get('can_manage_products') == 'on' else False
        can_manage_promotions = True if request.form.get('can_manage_promotions') == 'on' else False
        can_manage_inventory = True if request.form.get('can_manage_inventory') == 'on' else False

        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            UPDATE Admin_Permission
            SET can_manage_users = %s,
                can_manage_orders = %s,
                can_manage_products = %s,
                can_manage_promotions = %s,
                can_manage_inventory = %s
            WHERE admin_id = %s
        """
        try:
            cursor.execute(query, (
                can_manage_users, can_manage_orders, can_manage_products,
                can_manage_promotions, can_manage_inventory, admin_id
            ))
            conn.commit()
            flash("Cập nhật quyền thành công", "success")
        except Exception as e:
            conn.rollback()
            flash("Lỗi khi cập nhật quyền: " + str(e), "error")
        cursor.close()
        conn.close()
        return redirect(url_for('update_permissions'))

    # Nếu method GET: hiển thị form chỉnh sửa quyền
    return '''
    <h2>Chỉnh sửa quyền của Admin (Dành cho Superadmin)</h2>
    <form method="post">
        Admin ID: <input type="text" name="admin_id"><br>
        Quản lý người dùng: <input type="checkbox" name="can_manage_users"><br>
        Quản lý đơn hàng: <input type="checkbox" name="can_manage_orders"><br>
        Quản lý sản phẩm: <input type="checkbox" name="can_manage_products"><br>
        Quản lý khuyến mãi: <input type="checkbox" name="can_manage_promotions"><br>
        Quản lý kho hàng: <input type="checkbox" name="can_manage_inventory"><br>
        <input type="submit" value="Cập nhật">
    </form>
    '''

###############################
# Route quản lí review và comment của khách hàng
###############################
@app.route('/reviews', methods=['GET'])
def reviews():
    """
    Truy xuất dữ liệu từ bảng Reviews (giả sử bảng này chứa review và comment theo từng sản phẩm)
    Trả về dữ liệu dưới dạng JSON.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM Reviews"
    try:
        cursor.execute(query)
        reviews_data = cursor.fetchall()
    except Exception as e:
        conn.rollback()
        reviews_data = []
        flash("Lỗi khi truy xuất reviews: " + str(e), "error")
    cursor.close()
    conn.close()
    return jsonify(reviews_data)

###############################
# Route chức năng chat với khách hàng
###############################
@app.route('/chat', methods=['POST'])
def chat():
    """
    Xử lý gửi tin nhắn chat từ admin tới khách hàng.
    Yêu cầu truyền vào: admin_id, customer_id, message qua phương thức POST.
    Kết quả trả về dưới dạng JSON.
    """
    admin_id = request.form.get('admin_id')
    customer_id = request.form.get('customer_id')
    message = request.form.get('message')

    conn = get_db_connection()
    cursor = conn.cursor()
    query = "INSERT INTO Chat (admin_id, customer_id, message) VALUES (%s, %s, %s)"
    try:
        cursor.execute(query, (admin_id, customer_id, message))
        conn.commit()
        response = {"status": "success", "message": "Gửi tin nhắn thành công"}
    except Exception as e:
        conn.rollback()
        response = {"status": "error", "message": str(e)}
    cursor.close()
    conn.close()
    return jsonify(response)

###############################
# Route quản lí coupon, offer cho từng sản phẩm
###############################
@app.route('/coupons', methods=['GET'])
def coupons():
    """
    Truy xuất dữ liệu bảng Coupons.
    Trả về danh sách coupon dưới dạng JSON.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM Coupons"
    try:
        cursor.execute(query)
        coupons_data = cursor.fetchall()
    except Exception as e:
        conn.rollback()
        coupons_data = []
        flash("Lỗi khi truy xuất coupon: " + str(e), "error")
    cursor.close()
    conn.close()
    return jsonify(coupons_data)

###############################
# Route quản lí kho hàng sản phẩm
###############################
@app.route('/inventory', methods=['GET'])
def inventory():
    """
    Truy xuất dữ liệu bảng Inventory để quản lý kho hàng.
    Trả về danh sách kho hàng dưới dạng JSON.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM Inventory"
    try:
        cursor.execute(query)
        inventory_data = cursor.fetchall()
    except Exception as e:
        conn.rollback()
        inventory_data = []
        flash("Lỗi khi truy xuất kho hàng: " + str(e), "error")
    cursor.close()
    conn.close()
    return jsonify(inventory_data)

###############################
# Route quản lí sản phẩm được nhiều người dùng chọn
###############################
@app.route('/manager_trendy_product', methods=['GET' , 'POST'])
def manager_trendy_product():
    """
    Truy xuất dữ liệu bảng manager_trendy_product để quản lý Trendy Product.
    Trả về danh sách Trendy Product dưới dạng JSON.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM manager_trendy_product"
    try:
        cursor.execute(query)
        trendy_products_data = cursor.fetchall()
    except Exception as e:
        conn.rollback()
        trendy_products_data = []
        flash("Lỗi khi truy xuất danh sách: " + str(e), "error")
    cursor.close()
    conn.close()
    return jsonify(trendy_products_data)

###############################
# Route quản lí email đăng nhập lần đầu
###############################

# Hàm kiểm tra email đã đăng nhập trước đó chưa
def check_first_login(email):
    conn = get_db_connection()
    cursor = conn.cursor()

# Kiểm tra email trong bảng User
    cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    conn.close()
    
    return user is not None  # True nếu đã tồn tại, False nếu chưa

# Hàm gửi email cảm ơn kèm mã coupon
def send_coupon_email(email):
    sender_email = "minh1470258369@gmail.com"
    sender_password = "nhm28032004"
    
    message = MIMEText("Cảm ơn bạn đã đăng nhập lần đầu! Đây là mã giảm giá của bạn: COUPON123")
    message['Subject'] = "Mã Coupon - Cảm ơn bạn đã đăng ký!"
    message['From'] = sender_email
    message['To'] = email
    
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message.as_string())
        server.quit()
    except Exception as e:
        print("Lỗi gửi email:", e)
        
# Route đăng nhập
@app.route('/login', methods=['POST'])
def login():
    email = request.form.get("email")
    
    if not check_first_login(email):
        send_coupon_email(email)
    
    session['email'] = email
    flash("Đăng nhập thành công!", "info")
    return "Đăng nhập thành công!"

###############################
# Route quản lí tài khoản User
###############################

# Route lấy số lượng user
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM User")
    users = cursor.fetchall()
    conn.close()
    return jsonify(users)

# Route thêm user
@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO User (name, email, role) VALUES (%s, %s, %s)", (data['name'], data['email'], data['role']))
    conn.commit()
    conn.close()
    return jsonify({"message": "User added successfully"}), 201

# Route cập nhật user 
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE User SET name=%s, email=%s, role=%s WHERE id=%s", (data['name'], data['email'], data['role'], user_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "User updated successfully"})

# Route xóa user
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM User WHERE id=%s", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "User deleted successfully"})


###############################
# Chạy ứng dụng
###############################
if __name__ == "__main__":
    app.run(debug=True)
