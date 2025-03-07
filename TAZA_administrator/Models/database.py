import mysql.connector

def create_connection():
    return mysql.connector.connect(
        host="localhost",
        user="TAZA",
        password="Nhm0919605541.",
        database="taza_admin"
    )

def update_permissions(admin_id, permissions):
    conn = create_connection()
    cursor = conn.cursor()
    query = "UPDATE Admin_Permission SET can_manage_users=%s, can_manage_orders=%s, can_manage_products=%s, can_manage_promotions=%s, can_manage_inventory=%s WHERE admin_id=%s"
    cursor.execute(query, (*permissions, admin_id))
    conn.commit()
    cursor.close()
    conn.close()

def get_dashboard_stats():
    conn = create_connection()
    cursor = conn.cursor()
    # Giả sử bạn có các bảng Orders, Users
    query = "SELECT SUM(amount), COUNT(order_id), COUNT(user_id) FROM Orders, Users"
    cursor.execute(query)
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result

def manage_reviews():
    conn = create_connection()
    cursor = conn.cursor()
    # Giả sử bạn có bảng Reviews
    query = "SELECT * FROM Reviews"
    cursor.execute(query)
    reviews = cursor.fetchall()
    cursor.close()
    conn.close()
    return reviews

def chat_with_customer(admin_id, customer_id, message):
    conn = create_connection()
    cursor = conn.cursor()
    query = "INSERT INTO Chat (admin_id, customer_id, message) VALUES (%s, %s, %s)"
    cursor.execute(query, (admin_id, customer_id, message))
    conn.commit()
    cursor.close()
    conn.close()

def manage_coupons():
    conn = create_connection()
    cursor = conn.cursor()
    #bảng Coupons
    query = "SELECT * FROM Coupons"
    cursor.execute(query)
    coupons = cursor.fetchall()
    cursor.close()
    conn.close()
    return coupons

def manage_inventory():
    conn = create_connection()
    cursor = conn.cursor()
    #bảng Inventory
    query = "SELECT * FROM Inventory"
    cursor.execute(query)
    inventory = cursor.fetchall()
    cursor.close()
    conn.close()
    return inventory

def manager_trendy_product():
    conn = create_connection()
    cursor = conn.cursor()
    #bảng Trendy_product
    query = "SELECT * FROM Trendy_product"
    cursor.execute(query)
    trendy_product = cursor.fetchall()
    cursor.close()
    conn.close()
    return trendy_product

if __name__ == "__main__":
    # Các hàm gọi ở đây để kiểm tra và khởi chạy các chức năng
    print(get_dashboard_stats())
    print(manage_reviews())
    print(manage_coupons())
    print(manage_inventory())
