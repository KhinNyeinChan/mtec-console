export interface TenantRoleListItem extends Record<string, string> {
  roleId: string;
  roleName: string;
  status: string;
  createdAt: string;
  createdBy: string;
}

export const DUMMY_TENANT_ROLES: TenantRoleListItem[] = [
  {
    roleId: 'TROLE-001',
    roleName: 'Tenant Owner',
    status: 'active',
    createdAt: '2026-01-08',
    createdBy: 'System',
  },
  {
    roleId: 'TROLE-002',
    roleName: 'Store Manager',
    status: 'active',
    createdAt: '2026-01-20',
    createdBy: 'Khin Nyein',
  },
  {
    roleId: 'TROLE-003',
    roleName: 'Sales Staff',
    status: 'active',
    createdAt: '2026-02-05',
    createdBy: 'Aye Chan',
  },
  {
    roleId: 'TROLE-004',
    roleName: 'Inventory Clerk',
    status: 'active',
    createdAt: '2026-02-18',
    createdBy: 'Su Su',
  },
  {
    roleId: 'TROLE-005',
    roleName: 'Finance Viewer',
    status: 'inactive',
    createdAt: '2025-11-12',
    createdBy: 'Min Ko',
  },
  {
    roleId: 'TROLE-006',
    roleName: 'Order Handler',
    status: 'active',
    createdAt: '2026-03-01',
    createdBy: 'Hla Hla',
  },
  {
    roleId: 'TROLE-007',
    roleName: 'Customer Care',
    status: 'active',
    createdAt: '2026-03-15',
    createdBy: 'Ko Ko',
  },
  {
    roleId: 'TROLE-008',
    roleName: 'Promo Editor',
    status: 'inactive',
    createdAt: '2025-12-08',
    createdBy: 'May Thu',
  },
  {
    roleId: 'TROLE-009',
    roleName: 'Branch Auditor',
    status: 'active',
    createdAt: '2026-04-10',
    createdBy: 'Tun Tun',
  },
  {
    roleId: 'TROLE-010',
    roleName: 'Read Only',
    status: 'inactive',
    createdAt: '2025-09-22',
    createdBy: 'Ei Ei',
  },
  {
    roleId: 'TROLE-011',
    roleName: 'Warehouse Lead',
    status: 'active',
    createdAt: '2026-05-02',
    createdBy: 'Nandar',
  },
  {
    roleId: 'TROLE-012',
    roleName: 'Delivery Coordinator',
    status: 'active',
    createdAt: '2026-06-11',
    createdBy: 'Zaw Zaw',
  },
];
