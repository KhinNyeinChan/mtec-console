export interface UserRoleListItem extends Record<string, string> {
  roleId: string;
  roleName: string;
  status: string;
  createdAt: string;
  createdBy: string;
}

export const DUMMY_USER_ROLES: UserRoleListItem[] = [
  {
    roleId: 'ROLE-001',
    roleName: 'Super Admin',
    status: 'active',
    createdAt: '2026-01-10',
    createdBy: 'System',
  },
  {
    roleId: 'ROLE-002',
    roleName: 'Store Admin',
    status: 'active',
    createdAt: '2026-01-15',
    createdBy: 'Khin Nyein',
  },
  {
    roleId: 'ROLE-003',
    roleName: 'Inventory Manager',
    status: 'active',
    createdAt: '2026-02-03',
    createdBy: 'Aye Chan',
  },
  {
    roleId: 'ROLE-004',
    roleName: 'Cashier',
    status: 'active',
    createdAt: '2026-02-20',
    createdBy: 'Su Su',
  },
  {
    roleId: 'ROLE-005',
    roleName: 'Sales Viewer',
    status: 'inactive',
    createdAt: '2025-11-18',
    createdBy: 'Min Ko',
  },
  {
    roleId: 'ROLE-006',
    roleName: 'Report Analyst',
    status: 'active',
    createdAt: '2026-03-05',
    createdBy: 'Hla Hla',
  },
  {
    roleId: 'ROLE-007',
    roleName: 'Customer Support',
    status: 'active',
    createdAt: '2026-03-22',
    createdBy: 'Ko Ko',
  },
  {
    roleId: 'ROLE-008',
    roleName: 'Marketing Editor',
    status: 'inactive',
    createdAt: '2025-12-01',
    createdBy: 'May Thu',
  },
  {
    roleId: 'ROLE-009',
    roleName: 'Auditor',
    status: 'active',
    createdAt: '2026-04-14',
    createdBy: 'Tun Tun',
  },
  {
    roleId: 'ROLE-010',
    roleName: 'Guest',
    status: 'inactive',
    createdAt: '2025-09-30',
    createdBy: 'Ei Ei',
  },
  {
    roleId: 'ROLE-011',
    roleName: 'Warehouse Staff',
    status: 'active',
    createdAt: '2026-05-08',
    createdBy: 'Nandar',
  },
  {
    roleId: 'ROLE-012',
    roleName: 'Order Processor',
    status: 'active',
    createdAt: '2026-06-19',
    createdBy: 'Zaw Zaw',
  },
];
