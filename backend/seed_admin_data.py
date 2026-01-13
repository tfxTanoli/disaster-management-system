import firebase_admin
from firebase_admin import credentials, db
import os

# Initialize Firebase (reuse creds from project)
cred_path = "./disaster-management-syst-6ab39-firebase-adminsdk-fbsvc-691884c540.json"
if not os.path.exists(cred_path):
    print(f"Error: Credential file not found at {cred_path}")
    exit(1)

try:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://disaster-management-syst-6ab39-default-rtdb.firebaseio.com/' # Inferred from logs/project ID
    })
    # Note: If databaseURL is wrong, it will fail. Project ID is disaster-management-syst-6ab39.
    # Usually format is https://<project-id>-default-rtdb.firebaseio.com/ or https://<project-id>.firebaseio.com/
except ValueError:
    # App might be already initialized
    pass

def seed_data():
    ref = db.reference('users')
    users = ref.get()
    
    target_email = "testuser_123@example.com"
    target_uid = None

    if users:
        for uid, data in users.items():
            if data.get('email') == target_email:
                target_uid = uid
                print(f"Found user {target_email} with UID: {uid}")
                break
    
    if target_uid:
        # Promote to admin
        ref.child(target_uid).update({'role': 'admin'})
        print("Updated role to admin.")
    else:
        print("User not found.")

    # Seed a report
    reports_ref = db.reference('reports')
    new_report = reports_ref.push()
    new_report.set({
        "type": "Flash Flood",
        "location": "Gilgit Mock Data",
        "description": "Seeded report for admin verification.",
        "contact": "03001234567",
        "name": "Seed Bot",
        "status": "pending",
        "userId": target_uid or "seed_bot",
        "userEmail": target_email,
        "createdAt": "2026-01-12T10:00:00Z"
    })
    print("Seeded 'pending' report.")

    # Seed a verified report
    verified_report = reports_ref.push()
    verified_report.set({
        "type": "Landslide",
        "location": "Hunza Valley",
        "description": "Historical verified incident.",
        "contact": "03009876543",
        "name": "System",
        "status": "verified",
        "userId": "system",
        "createdAt": "2026-01-11T10:00:00Z"
    })
    print("Seeded 'verified' report.")

if __name__ == "__main__":
    seed_data()
