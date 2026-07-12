## 🗄️ Database Setup and Schema

AssetHub uses a **MySQL relational database** to store users, departments, assets, asset categories, allocations, maintenance requests, resource bookings, notifications, and activity logs.

Before starting the backend server, you must:

1. Create the `assetflow_db` database.
2. Select the newly created database.
3. Create all required tables.
4. Insert the initial department and asset category data.

> The tables must be created in the order shown below because several tables contain foreign-key relationships with previously created tables.

---

### Database Schema Overview

AssetHub uses the following database tables:

| Table                  | Purpose                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `departments`          | Stores organizational departments such as Information Technology, Human Resources, Finance, and Operations |
| `users`                | Stores user accounts, authentication information, roles, departments, and account status                   |
| `asset_categories`     | Stores categories used to organize assets                                                                  |
| `assets`               | Stores complete asset information, including category, condition, availability, cost, and location         |
| `asset_allocations`    | Tracks assets allocated to employees and their return information                                          |
| `maintenance_requests` | Stores maintenance issues, priorities, technicians, and resolution information                             |
| `resource_bookings`    | Manages bookings for shared and bookable organizational assets                                             |
| `notifications`        | Stores user-specific application notifications                                                             |
| `activity_logs`        | Maintains an audit trail of important actions performed in the application                                 |

---

### Database Relationships

```text
departments
     │
     │ One department can contain multiple users
     ▼
users
     │
     ├──────────────► asset_allocations
     │                  │
     │                  └────► assets
     │
     ├──────────────► maintenance_requests
     │                  │
     │                  └────► assets
     │
     ├──────────────► resource_bookings
     │                  │
     │                  └────► assets
     │
     ├──────────────► notifications
     │
     └──────────────► activity_logs


asset_categories
     │
     │ One category can contain multiple assets
     ▼
assets
```

### Main Relationships

* A **department** can contain multiple users.
* A **user** can belong to one department.
* An **asset category** can contain multiple assets.
* Every asset belongs to one asset category.
* An asset can be allocated to an employee.
* An asset allocation records both the employee receiving the asset and the user allocating it.
* Users can submit maintenance requests for assets.
* Users can book assets marked as bookable.
* Each user can receive multiple notifications.
* User actions can be recorded in the activity log.

---

## Create the Database

Open MySQL:

```bash
mysql -u root -p
```

Enter your MySQL password when prompted.

Create and select the AssetHub database:

```sql
CREATE DATABASE assetflow_db;

USE assetflow_db;
```

---

## Create the Required Tables

Run the following SQL statements in the given order.

### 1. Departments Table

Stores the departments available within the organization.

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

#### Important Columns

| Column        | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| `id`          | Unique identifier generated automatically for each department |
| `name`        | Unique department name                                        |
| `description` | Brief description of the department                           |
| `status`      | Indicates whether the department is active or inactive        |
| `created_at`  | Date and time when the department was created                 |
| `updated_at`  | Automatically updated whenever the department record changes  |

---

### 2. Users Table

Stores user accounts, authentication details, organizational roles, departments, and account status.

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM(
        'ADMIN',
        'ASSET_MANAGER',
        'DEPARTMENT_HEAD',
        'EMPLOYEE'
    ) DEFAULT 'EMPLOYEE',

    department_id INT NULL,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);
```

#### Supported User Roles

| Role              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `ADMIN`           | Provides administrative access to the application                           |
| `ASSET_MANAGER`   | Manages organizational assets, allocations, and related operations          |
| `DEPARTMENT_HEAD` | Represents and manages department-level responsibilities                    |
| `EMPLOYEE`        | Standard application user and the default role assigned during registration |

#### Important Columns

| Column          | Description                                           |
| --------------- | ----------------------------------------------------- |
| `id`            | Unique user identifier                                |
| `name`          | User's full name                                      |
| `email`         | Unique email address used for authentication          |
| `password`      | Securely hashed user password                         |
| `role`          | Defines the user's permissions within the application |
| `department_id` | References the department to which the user belongs   |
| `status`        | Indicates whether the user account is active          |
| `created_at`    | Date and time when the account was created            |
| `updated_at`    | Date and time when the account was last updated       |

> If a department is deleted, the associated users are retained and their `department_id` value is automatically changed to `NULL`.

---

### 3. Asset Categories Table

Stores categories used to classify and organize assets.

```sql
CREATE TABLE asset_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    warranty_period_months INT,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Important Columns

| Column                   | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `id`                     | Unique category identifier                          |
| `name`                   | Unique asset category name                          |
| `description`            | Description of the assets belonging to the category |
| `warranty_period_months` | Default warranty duration in months                 |
| `status`                 | Indicates whether the category is active            |
| `created_at`             | Date and time when the category was created         |

---

### 4. Assets Table

Stores complete information about organizational assets.

```sql
CREATE TABLE assets (
    id INT PRIMARY KEY AUTO_INCREMENT,

    asset_tag VARCHAR(30) NOT NULL UNIQUE,

    name VARCHAR(150) NOT NULL,

    category_id INT NOT NULL,

    serial_number VARCHAR(100) UNIQUE,

    acquisition_date DATE,

    acquisition_cost DECIMAL(12, 2),

    asset_condition ENUM(
        'EXCELLENT',
        'GOOD',
        'FAIR',
        'DAMAGED'
    ) DEFAULT 'GOOD',

    status ENUM(
        'AVAILABLE',
        'ALLOCATED',
        'RESERVED',
        'UNDER_MAINTENANCE',
        'LOST',
        'RETIRED',
        'DISPOSED'
    ) DEFAULT 'AVAILABLE',

    location VARCHAR(150),

    is_bookable BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES asset_categories(id)
);
```

#### Supported Asset Conditions

| Condition   | Description                                       |
| ----------- | ------------------------------------------------- |
| `EXCELLENT` | Asset is in excellent or near-new condition       |
| `GOOD`      | Asset is functioning correctly with normal usage  |
| `FAIR`      | Asset is usable but may show wear or minor issues |
| `DAMAGED`   | Asset is damaged or requires repair               |

#### Supported Asset Status Values

| Status              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `AVAILABLE`         | Asset is available for allocation or use        |
| `ALLOCATED`         | Asset is currently assigned to an employee      |
| `RESERVED`          | Asset has been reserved                         |
| `UNDER_MAINTENANCE` | Asset is undergoing maintenance or repair       |
| `LOST`              | Asset has been reported as lost                 |
| `RETIRED`           | Asset is no longer in active organizational use |
| `DISPOSED`          | Asset has been permanently disposed of          |

#### Important Columns

| Column             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `asset_tag`        | Unique organizational identifier assigned to the asset |
| `name`             | Name of the asset                                      |
| `category_id`      | References the asset's category                        |
| `serial_number`    | Unique manufacturer or device serial number            |
| `acquisition_date` | Date on which the asset was acquired                   |
| `acquisition_cost` | Original acquisition cost of the asset                 |
| `asset_condition`  | Current physical or operational condition              |
| `status`           | Current lifecycle or availability status               |
| `location`         | Current physical location                              |
| `is_bookable`      | Determines whether users can reserve the asset         |
| `created_at`       | Date and time when the asset was added                 |
| `updated_at`       | Date and time when the asset was last modified         |

---

### 5. Asset Allocations Table

Tracks assets assigned to employees and maintains allocation and return information.

```sql
CREATE TABLE asset_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,

    asset_id INT NOT NULL,

    employee_id INT NOT NULL,

    allocated_by INT NOT NULL,

    allocation_date DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    expected_return_date DATE,

    actual_return_date DATETIME,

    status ENUM(
        'ACTIVE',
        'RETURNED',
        'TRANSFERRED'
    ) DEFAULT 'ACTIVE',

    allocation_notes TEXT,

    return_condition_notes TEXT,

    FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    FOREIGN KEY (employee_id)
        REFERENCES users(id),

    FOREIGN KEY (allocated_by)
        REFERENCES users(id)
);
```

#### Allocation Status Values

| Status        | Description                                    |
| ------------- | ---------------------------------------------- |
| `ACTIVE`      | Asset is currently allocated to the employee   |
| `RETURNED`    | Asset has been returned                        |
| `TRANSFERRED` | Asset has been transferred to another employee |

#### Important Columns

| Column                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `asset_id`               | References the allocated asset                   |
| `employee_id`            | References the employee receiving the asset      |
| `allocated_by`           | References the user who performed the allocation |
| `allocation_date`        | Date and time when the asset was allocated       |
| `expected_return_date`   | Planned asset return date                        |
| `actual_return_date`     | Actual date and time when the asset was returned |
| `status`                 | Current allocation status                        |
| `allocation_notes`       | Additional information about the allocation      |
| `return_condition_notes` | Records the asset's condition when returned      |

---

### 6. Maintenance Requests Table

Stores maintenance requests submitted for organizational assets.

```sql
CREATE TABLE maintenance_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,

    asset_id INT NOT NULL,

    requested_by INT NOT NULL,

    issue_description TEXT NOT NULL,

    priority ENUM(
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
    ) DEFAULT 'MEDIUM',

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'TECHNICIAN_ASSIGNED',
        'IN_PROGRESS',
        'RESOLVED'
    ) DEFAULT 'PENDING',

    technician_name VARCHAR(100),

    resolution_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    resolved_at DATETIME,

    FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    FOREIGN KEY (requested_by)
        REFERENCES users(id)
);
```

#### Maintenance Priority Values

| Priority   | Description                                |
| ---------- | ------------------------------------------ |
| `LOW`      | Minor issue with limited impact            |
| `MEDIUM`   | Standard maintenance issue                 |
| `HIGH`     | Important issue requiring prompt attention |
| `CRITICAL` | Severe issue requiring immediate attention |

#### Maintenance Status Values

| Status                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `PENDING`             | Request has been submitted and is awaiting review |
| `APPROVED`            | Maintenance request has been approved             |
| `REJECTED`            | Maintenance request has been rejected             |
| `TECHNICIAN_ASSIGNED` | A technician has been assigned                    |
| `IN_PROGRESS`         | Maintenance work is currently underway            |
| `RESOLVED`            | Maintenance work has been completed               |

---

### 7. Resource Bookings Table

Stores bookings for shared assets and organizational resources.

```sql
CREATE TABLE resource_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,

    asset_id INT NOT NULL,

    booked_by INT NOT NULL,

    start_time DATETIME NOT NULL,

    end_time DATETIME NOT NULL,

    purpose VARCHAR(255),

    status ENUM(
        'UPCOMING',
        'ONGOING',
        'COMPLETED',
        'CANCELLED'
    ) DEFAULT 'UPCOMING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    FOREIGN KEY (booked_by)
        REFERENCES users(id)
);
```

#### Booking Status Values

| Status      | Description                             |
| ----------- | --------------------------------------- |
| `UPCOMING`  | Booking is scheduled for a future time  |
| `ONGOING`   | The booked resource is currently in use |
| `COMPLETED` | Booking has been completed              |
| `CANCELLED` | Booking was cancelled                   |

> Only assets with `is_bookable` enabled should be made available for resource booking.

---

### 8. Notifications Table

Stores user-specific application notifications.

```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    type VARCHAR(50),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

#### Important Columns

| Column       | Description                                        |
| ------------ | -------------------------------------------------- |
| `user_id`    | References the user receiving the notification     |
| `title`      | Notification heading                               |
| `message`    | Complete notification message                      |
| `type`       | Category or type of notification                   |
| `is_read`    | Indicates whether the notification has been viewed |
| `created_at` | Date and time when the notification was created    |

> Notifications are automatically deleted if their associated user account is deleted.

---

### 9. Activity Logs Table

Maintains an audit trail of important actions performed within the application.

```sql
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT,

    action VARCHAR(150) NOT NULL,

    entity_type VARCHAR(50),

    entity_id INT,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);
```

#### Important Columns

| Column        | Description                                  |
| ------------- | -------------------------------------------- |
| `user_id`     | References the user who performed the action |
| `action`      | Name of the action performed                 |
| `entity_type` | Type of application entity affected          |
| `entity_id`   | Identifier of the affected entity            |
| `description` | Detailed information about the activity      |
| `created_at`  | Date and time when the action occurred       |

> If a user account is deleted, its activity records are retained and the corresponding `user_id` is changed to `NULL`.

---

## Insert Initial Data

After creating all required tables, insert the default departments and asset categories.

### Insert Default Departments

```sql
INSERT INTO departments
(
    name,
    description
)
VALUES
(
    'Information Technology',
    'Manages software and IT infrastructure'
),
(
    'Human Resources',
    'Manages employees and recruitment'
),
(
    'Finance',
    'Manages financial operations'
),
(
    'Operations',
    'Manages organizational operations'
);
```

The following departments will be created:

| Department             | Description                            |
| ---------------------- | -------------------------------------- |
| Information Technology | Manages software and IT infrastructure |
| Human Resources        | Manages employees and recruitment      |
| Finance                | Manages financial operations           |
| Operations             | Manages organizational operations      |

---

### Insert Default Asset Categories

```sql
INSERT INTO asset_categories
(
    name,
    description,
    warranty_period_months
)
VALUES
(
    'Electronics',
    'Laptops, monitors and electronic devices',
    36
),
(
    'Furniture',
    'Office desks, chairs and furniture',
    NULL
),
(
    'Vehicles',
    'Company-owned vehicles',
    60
),
(
    'Meeting Rooms',
    'Shared meeting and conference rooms',
    NULL
);
```

The following categories will be created:

| Category      | Description                               | Default Warranty |
| ------------- | ----------------------------------------- | ---------------: |
| Electronics   | Laptops, monitors, and electronic devices |        36 months |
| Furniture     | Office desks, chairs, and furniture       |    Not specified |
| Vehicles      | Company-owned vehicles                    |        60 months |
| Meeting Rooms | Shared meeting and conference rooms       |    Not specified |

---

## Verify the Database Setup

Display all created tables:

```sql
SHOW TABLES;
```

Expected output:

```text
activity_logs
asset_allocations
asset_categories
assets
departments
maintenance_requests
notifications
resource_bookings
users
```

Verify the inserted departments:

```sql
SELECT * FROM departments;
```

Verify the inserted asset categories:

```sql
SELECT
    id,
    name,
    description,
    warranty_period_months
FROM asset_categories;
```

Check registered users:

```sql
SELECT
    id,
    name,
    email,
    role,
    department_id,
    status
FROM users;
```

---

## Assign the Asset Manager Role

New users are assigned the `EMPLOYEE` role by default.

After registering an account through the AssetHub application, you can assign the `ASSET_MANAGER` role using the following query:

```sql
UPDATE users
SET role = 'ASSET_MANAGER'
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with the email address used during registration.

For example:

```sql
UPDATE users
SET role = 'ASSET_MANAGER'
WHERE email = 'pragya@assetflow.com';
```

Verify the updated role:

```sql
SELECT
    id,
    name,
    email,
    role
FROM users
WHERE email = 'pragya@assetflow.com';
```

> The user must already exist in the `users` table before the role can be updated. Register the account through the application first, and then run the update query.

---

## Complete Database Initialization Script

For convenience, the complete database setup can be executed as a single SQL script.

Create a file named:

```text
server/database/schema.sql
```

Add all database creation, table creation, and initial data queries to this file.

The database can then be initialized using:

```bash
mysql -u root -p < server/database/schema.sql
```

Alternatively, if you are already inside the MySQL command-line interface, run:

```sql
SOURCE server/database/schema.sql;
```

> The exact path used with `SOURCE` depends on the directory from which MySQL was started.

After successful initialization, configure the backend `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=assetflow_db

JWT_SECRET=replace_with_a_secure_random_secret
```

The backend can now connect to the initialized MySQL database.

> **Important:** The backend requires these tables to exist before it can perform database operations. If the database or tables have not been initialized, API requests may fail with database errors such as `Table 'assetflow_db.users' doesn't exist`.