import requests
import random


cities = ["Madurai", "Chennai", "Bangalore", "Coimbatore"]

for i in range(1, 51):
    usertype = "admin" if i < 10 else "normal"
    
    email = f"{usertype}_user_{i}@gmail.com"
    fullname = f"{usertype} user {i}"
    password = f"{usertype}userpass{i}"

    userage = random.randint(18, 30)
    usercity = random.choice(cities)
    username = f"{usertype}user{i}"
    
    create_user = requests.post(
        "http://localhost:3000/create_user",
        json={
            "email": email,
            "fullname": fullname,
            "password": password
        }
    )
    print("\n", "Create User:", create_user, create_user.__dict__, "\n")

    update_user = requests.post(
        "http://localhost:3000/add_user_data",
        json={
            "userage": userage,
            "usercity": usercity,
            "username": username,
            "usertype": usertype,
            "useremail": email
        }
    )
    print("\n", "Update User:", update_user, update_user.__dict__, "\n")
