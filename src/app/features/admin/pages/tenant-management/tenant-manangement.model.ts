export interface TenantListItem extends Record<string, string> {
    id: string;
    businessName: string;
    storeSlug: string;
    adminName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
}

export const DUMMY_TENANTS: TenantListItem[] = [
    { id: '1', businessName: 'Khin Fashion', storeSlug: 'khin-fashion', adminName: 'Khin Nyein', email: 'khin@khin-fashion.mtec.com', phone: '0911111111', status: 'active', createdAt: '2026-01-12' },
    { id: '2', businessName: 'Mandalay Market', storeSlug: 'mandalay-market', adminName: 'Aye Chan', email: 'aye@mandalay-market.mtec.com', phone: '0922222222', status: 'active', createdAt: '2026-02-03' },
    { id: '3', businessName: 'Yangon Books', storeSlug: 'yangon-books', adminName: 'Su Su', email: 'susu@yangon-books.mtec.com', phone: '0933333333', status: 'inactive', createdAt: '2025-11-20' },
    { id: '4', businessName: 'Bagan Crafts', storeSlug: 'bagan-crafts', adminName: 'Min Ko', email: 'minko@bagan-crafts.mtec.com', phone: '0944444444', status: 'active', createdAt: '2026-03-18' },
    { id: '5', businessName: 'Inle Tea', storeSlug: 'inle-tea', adminName: 'Hla Hla', email: 'hlahla@inle-tea.mtec.com', phone: '0955555555', status: 'active', createdAt: '2025-09-01' },
    { id: '6', businessName: 'Pathein Umbrella', storeSlug: 'pathein-umbrella', adminName: 'Ko Ko', email: 'koko@pathein-umbrella.mtec.com', phone: '0966666666', status: 'inactive', createdAt: '2025-12-14' },
    { id: '7', businessName: 'Naypyidaw Home', storeSlug: 'naypyidaw-home', adminName: 'May Thu', email: 'maythu@naypyidaw-home.mtec.com', phone: '0977777777', status: 'active', createdAt: '2026-04-02' },
    { id: '8', businessName: 'Mawlamyine Spice', storeSlug: 'mawlamyine-spice', adminName: 'Tun Tun', email: 'tuntun@mawlamyine-spice.mtec.com', phone: '0988888888', status: 'active', createdAt: '2026-05-21' },
    { id: '9', businessName: 'Taunggyi Fresh', storeSlug: 'taunggyi-fresh', adminName: 'Ei Ei', email: 'eiei@taunggyi-fresh.mtec.com', phone: '0999999999', status: 'inactive', createdAt: '2025-08-09' },
    { id: '10', businessName: 'Sagaing Silk', storeSlug: 'sagaing-silk', adminName: 'Nandar', email: 'nandar@sagaing-silk.mtec.com', phone: '0910101010', status: 'active', createdAt: '2026-06-11' },
    { id: '11', businessName: 'Pyay Pottery', storeSlug: 'pyay-pottery', adminName: 'Zaw Zaw', email: 'zawzaw@pyay-pottery.mtec.com', phone: '0920202020', status: 'active', createdAt: '2026-07-07' },
    { id: '12', businessName: 'Dawei Pearl', storeSlug: 'dawei-pearl', adminName: 'Win Win', email: 'winwin@dawei-pearl.mtec.com', phone: '0930303030', status: 'inactive', createdAt: '2025-10-30' },
];