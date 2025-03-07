import mysql.connector
import os
from cryptography.fernet import Fernet
import datetime

databases = mysql.connector.connect(
    host = '127.0.0.1',
    user = 'root',
    password = 'Minh_17102004',
    database = 'taza'
)


cursor = databases.cursor()


modifield_time = datetime.datetime.now()

 # generate key cript
key = Fernet.generate_key()
fernet = Fernet(key=key)

def _save_db_form(host,usr,pwd):
    with open("tazakey.txt","w") as file:
        file.writelines(f"{host}\n")
        file.writelines(f"{usr}\n")
        file.writelines(f"{pwd}")
    file.close()

def _encrypt_form(host,user,password):
    if os.path.exists("tazakey.txt"):
        # create hash method
        _hash_host_ = fernet.encrypt(host.encode())
        _hash_usr_ = fernet.encrypt(user.encode())
        _hash_passwd_  = fernet.encrypt(password.encode())
        # save in form by textfile
        _save_db_form(
            host=_hash_host_,
            usr=_hash_usr_,
            pwd=_hash_passwd_
        )

        return f"{_hash_host_} - {_hash_usr_} - {_hash_passwd_}"
    else: return "key text file doesn't exists on path"

def _check_key_script():
    if os.path.exists("tazakey.txt"):
        with open('tazakey.txt','r+') as file:
            print("Key Script decoded content")
            
            lines = file.readlines()
            print(lines)
            print("Decoding Script")
            for script in range(len(lines)):
                script = lines[script].strip()
                # decscript = fernet.decrypt(script).decode('utf-8')
                # print(decscript)
                print(script)
            
    else:
        return 'key script text does not exists '


#  ----- CREATE TABLE AND DATABASES TESTING PROLOUGE -------

# Connection Demonstration
def check_server_connection():
    try:
        if databases.is_connected():
            return f'{databases._host} - {databases._database} is connected to server'
        else:
            return f'{databases._host} is interrupt'
    except Exception as error:
        return error

# initializing
def create_taza_db():
    # if taza doesn't exists
    taza = "CREATE DATABASE taza"
    try:
        cursor.execute(taza)
        return 'database taza set up'
    except mysql.connector.Error as error:
        return error

def _create_user():
    user_db = '''
        
        CREATE TABLE user (
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(15),
            address TEXT,
            create_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )

    '''
    try:
        cursor.execute(user_db)
        return 'user table created'
    except mysql.connector.Error as error:
        return error

def _create_order():
    order_db = '''
        CREATE TABLE orders (
            order_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            total_price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            payment_id INT,
            FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
        )    
    '''
    try:
        cursor.execute(order_db)
        return 'order table created'
    except mysql.connector.Error as error:
        return error

def _create_categories():
    categories_sql = '''
        CREATE TABLE Category (
            category_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            parent_id INT,
            FOREIGN KEY (parent_id) REFERENCES Category(category_id) ON DELETE SET NULL
        )
    '''
    try:
        cursor.execute(categories_sql)
        return f'{databases._database} has created category'
    except mysql.connector.Error as error: return error

def _create_products():
    products_db = '''
        CREATE TABLE product (
            product_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            stock INT NOT NULL,
            category_id INT,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
        )
    '''
    try:
        cursor.execute(products_db)
        return f'{databases._database} has created product'
    except mysql.connector.Error as error: return error

def _create_order_details():
    sql = '''
       CREATE TABLE orders_detail (
            order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
        )
 
    '''
    try:
        cursor.execute(sql)
        return f"{databases._host} is set up order_details"
    except mysql.connector.errors.Error as err:
        return err
def _create_rv_comment_db():
    sql = '''
        CREATE TABLE Review (
            review_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            rating INT CHECK (rating BETWEEN 1 AND 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
        )
    '''
    try:
        cursor.execute(sql)
        return f"{databases._host} is setup review_comment"
    except mysql.connector.errors.Error as err:
        return err
    

def _create_payment():
    sql = '''
        CREATE TABLE Payment (
            payment_id INT PRIMARY KEY AUTO_INCREMENT,
            order_id INT NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            payment_status VARCHAR(20) DEFAULT 'pending',
            paid_at TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
        )

    '''
    try:
        cursor.execute(sql)
        return f"{databases._host} is set up payment"
    except mysql.connector.errors.Error as err:
        return err
    
def _create_promotion():
    sql = '''
        CREATE TABLE Promotion (
            promo_id INT PRIMARY KEY AUTO_INCREMENT,
            code VARCHAR(20) UNIQUE NOT NULL,
            discount DECIMAL(5,2) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            usage_limit INT DEFAULT 1
        )
    '''
    try:
        cursor.execute(sql)
        return f"{databases._host} is set up promotion"
    except mysql.connector.errors.Error as err:
        return err


def _new_user():
    sql = '''
        INSERT INTO product (product_id,name,description,price,stock,category_id,image_url,created_at) 
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    '''

    try:
        cursor.execute(sql,[3,'Single Breasted Wool Blazer', 'Elegant formal Vest Style',20456000,17,1,'https://www.versace.com/dw/image/v2/BGWN_PRD/on/demandware.static/-/Sites-ver-master-catalog/default/dw4c6c59de/original/90_1019620-1A14399_1VF00_10_Single~BreastedWoolBlazer-Blazers~~Suits-Versace-online-store_1_2.jpg?sw=550&q=85&strip=true',modifield_time])
        databases.commit()
        return 'new user accepted'
    except mysql.connector.errors.Error as err: return err
    # finally:
    #     sql = '''
    #         SELECT * FROM user
    #     '''
    #     cursor.execute(sql)
    #     data = cursor.fetchall()
    #     for obj in data:
    #         print(obj)

# Handling workflows
if __name__ == "__main__":
    # print(check_server_connection())
    # print(_save_db_form(databases._host, databases._user, databases._password))
    # print(_encrypt_form(databases._host, databases._user, databases._password))
    # print(_check_key_script())
    print(_new_user())
    
