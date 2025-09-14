# ScamGuard Test Credentials

## Test Accounts

### Admin Account
- **Email**: `admin@scamguard.com`
- **Password**: `Admin123!`
- **Role**: Admin
- **Access**: Full admin dashboard with analytics, user management, and system overview

### Regular User Account  
- **Email**: `user@scamguard.com`
- **Password**: `User123!`
- **Role**: User
- **Access**: User dashboard with personal analytics and fraud analyzer

## Setup Instructions

1. **Sign up** using the credentials above through the application
2. **Run the database scripts** in order:
   - `001_create_profiles.sql`
   - `002_create_analyses.sql` 
   - `003_profile_trigger.sql`
   - `004_create_admin_user.sql`
   - `005_create_test_users.sql`

3. **Test the system**:
   - Login as admin to access `/admin` dashboard
   - Login as user to access `/dashboard` and `/analyzer`

## Sample Data

The test script includes sample analysis data to populate the dashboards with realistic fraud detection examples including SMS scams, email phishing attempts, and legitimate messages.

## User IDs

After running the scripts, you can find the actual user IDs by querying:
\`\`\`sql
SELECT id, email, role FROM public.profiles;
