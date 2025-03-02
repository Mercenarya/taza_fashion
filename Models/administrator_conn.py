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

def create_db():
    sql = '''
        CREATE TABLE Admin (
            admin_id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            role ENUM('superadmin', 'manager', 'staff') DEFAULT 'staff',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        
    '''
    try:
        if databases.is_connected():
            print(databases._host," is connected")
            cursor.execute(sql)
            return 'Admin set up'
        else:
            return f'{databases._host} is disconnected'
    except mysql.connector.Error as err:
        return f'Connection error: {err}'
    

if __name__ == '__main__':
    print(create_db())