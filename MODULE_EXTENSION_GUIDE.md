# Smart Campus Module Extension Guide

## Backend Changes Completed ✅

### 1. Database Schema Updates
- ✅ Added `AccountStatus` enum (ACTIVE, PENDING_APPROVAL, SUSPENDED)
- ✅ Added `accountStatus` field to User entity with default ACTIVE
- ✅ Updated User table to `app_user` (reserved keyword fix)

### 2. Authentication & User Management Enhancements
- ✅ Email-based classification: @my.sliit.lk emails automatically set as STUDENT
- ✅ CurrentUserDto now includes: accountStatus, createdAt, updatedAt
- ✅ AuthService populates all user fields correctly

### 3. Admin User Management Endpoints Implemented

#### Endpoints:
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/{id}/role` - Change role (ADMIN, STAFF, USER)
- `PATCH /api/admin/users/{id}/classification` - Change userType and staffType
- `PATCH /api/admin/users/{id}/status` - Change accountStatus (ACTIVE, PENDING_APPROVAL, SUSPENDED)
- `DELETE /api/admin/users/{id}` - Delete/remove user

#### Request Bodies:

**Update Role:**
```json
{
  "role": "STAFF"
}
```

**Update Classification:**
```json
{
  "userType": "LECTURER",
  "staffType": "MANAGER"
}
```

**Update Status:**
```json
{
  "accountStatus": "SUSPENDED"
}
```

### 4. Backend Validation Rules
- ✅ staffType can only be set when role is STAFF
- ✅ If userType is not UNIVERSITY_STAFF, staffType is set to null
- ✅ First user to login is ADMIN
- ✅ Subsequent users default to USER role (admin can promote/manage)

---

## Frontend Changes Required

### Critical Files to Create/Update

#### 1. **Dashboards (Show based on user role)**

**Path:** `frontend/src/pages/`

- `UserDashboard.jsx` - For USER role
  - Welcome card with user name
  - Profile summary card
  - Notifications summary
  - Placeholder cards for: Resource Booking, Maintenance Tickets

- `StaffDashboard.jsx` - For STAFF role
  - Welcome card
  - Role/classification info
  - Notifications summary
  - Placeholder cards for: Resource Operations, Ticket Management

- `AdminDashboard.jsx` - For ADMIN role
  - User management summary (total users, pending approvals, suspended)
  - Recent users table (first 10)
  - Notifications summary
  - Placeholder cards for: Resources, Bookings, Tickets

#### 2. **Admin User Management Page**

**Path:** `frontend/src/pages/AdminUsersPage.jsx`

Features:
- Table with columns: Email, Full Name, Role, User Type, Staff Type, Status, Actions
- Filter/Search by email or name
- Inline edit buttons for each row:
  - Change Role dropdown
  - Change User Type dropdown
  - Change Staff Type dropdown (only if role is STAFF)
  - Change Status dropdown
  - Delete button
- Modal/form to apply changes
- Refresh button
- Loading/error states

#### 3. **User Profile Management**

**Path:** `frontend/src/pages/ProfilePage.jsx` (Update existing)

- Display current user info (including accountStatus)
- Edit allowed fields:
  - fullName
  - profileImageUrl (or skip for now)
- Show read-only: role, userType, staffType, accountStatus, email
- Save button with loading state
- Success/error messages

#### 4. **Notification Features**

**Path:** `frontend/src/components/NotificationBell.jsx`

- Bell icon with unread count badge
- Dropdown/popover showing last 5 notifications
- "View All" link to notifications page

**Path:** `frontend/src/pages/NotificationsPage.jsx`

- List of all user notifications
- Mark as read toggle for individual notifications
- "Mark All as Read" button
- Delete button for each notification
- Empty state when no notifications
- Filter by read/unread (optional)

#### 5. **Placeholder Pages** (Professional but intentionally empty)

**Path:** `frontend/src/pages/`

- `ResourcesPage.jsx` - "Coming soon: Resource Management (Assigned to Team Member)"
- `BookingsPage.jsx` - "Coming soon: Booking Management (Assigned to Team Member)"
- `TicketsPage.jsx` - "Coming soon: Ticket Management (Assigned to Team Member)"
- `CommentsPage.jsx` - (Optional, if needed)

Each should have:
- Clear heading
- "This feature will be implemented by [Module Owner]"
- Link back to dashboard
- Professional styling

#### 6. **Layout & Routing Updates**

**Path:** `frontend/src/routes/AppRoutes.jsx` (Update)

Add routes:
```javascript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/notifications" element={<NotificationsPage />} />
  
  {/* Admin only */}
  <Route element={<RoleGuard requiredRole="ADMIN" />}>
    <Route path="/admin/users" element={<AdminUsersPage />} />
  </Route>
  
  {/* Placeholder routes */}
  <Route path="/resources" element={<ResourcesPage />} />
  <Route path="/bookings" element={<BookingsPage />} />
  <Route path="/tickets" element={<TicketsPage />} />
</Route>
```

**Path:** `frontend/src/layouts/Navbar.jsx` (Update)

Add links:
```javascript
{user && (
  <>
    <Link href="/dashboard">Dashboard</Link>
    <Link href="/profile">Profile</Link>
    <Link href="/notifications"><NotificationBell /></Link>
    
    {user.role === 'ADMIN' && (
      <Link href="/admin/users">Manage Users</Link>
    )}
    
    <button onClick={logout}>Logout</button>
  </>
)}
```

---

## API Integration Notes

### User Profile API
- **GET** `/api/profile/me` - Fetch current user profile
- **PUT** `/api/profile/me` - Update profile (only fullName, etc.)

### Notification API
- **GET** `/api/notifications/me` - Get all user notifications
- **GET** `/api/notifications/me/unread-count` - Get unread count  
- **PATCH** `/api/notifications/{id}/read` - Mark single as read
- **PATCH** `/api/notifications/me/read-all` - Mark all as read
- **DELETE** `/api/notifications/{id}` - Delete notification

### Admin API
- **GET** `/api/admin/users` - List all users
- **PATCH** `/api/admin/users/{id}/role` - Update role
- **PATCH** `/api/admin/users/{id}/classification` - Update classification
- **PATCH** `/api/admin/users/{id}/status` - Update status
- **DELETE** `/api/admin/users/{id}` - Delete user

### Auth API
- **GET** `/api/auth/me` - Get current user (includes accountStatus now)
- **POST** `/api/auth/logout` - Logout

---

## UI/UX Guidelines

✅ **Professional Design:**
- Clean, modern, minimal
- Consistent color scheme
- Professional tables and forms
- Proper spacing and typography

✅ **States:**
- Loading spinners
- Error messages with retry
- Empty states with helpful messages
- Success confirmations

✅ **Placeholder Pages:**
- Show intentional placeholder design (not broken)
- Include team member attribution if known
- Professional styling matching main app
- Link back to dashboard

---

## Testing Checklist

Before deployment:
- [ ] Backend compiles and runs
- [ ] All admin endpoints work (test with Postman)
- [ ] Dashboards render correctly based on user role
- [ ] Admin user management works (edit roles, classifications, status)
- [ ] Notifications appear and can be marked read
- [ ] Profile editing works
- [ ] Logout works
- [ ] Placeholder pages look professional
- [ ] No console errors
- [ ] Responsive design works on mobile

---

## Next Steps for Team

Once this module is complete:
1. Module A (Resources) - Implement ResourcesPage and API
2. Module B (Bookings) - Implement BookingsPage and API  
3. Module C (Tickets) - Implement TicketsPage and API
4. Module F (Comments) - Implement comment feature integration

Each module should follow the same patterns established here.

