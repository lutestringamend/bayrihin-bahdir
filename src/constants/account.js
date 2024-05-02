export const ACCOUNT_PRIVILEGE_UPDATE_ADMIN = "ACCOUNT_PRIVILEGE_UPDATE_ADMIN"
export const ACCOUNT_PRIVILEGE_CUSTOMIZE_PRIVILEGE = "ACCOUNT_PRIVILEGE_CUSTOMIZE_PRIVILEGE"

export const ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD = "ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD = "ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_ASSIGNMENT = "ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_ASSIGNMENT"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_ASSIGNMENT_APPROVAL = "ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_ASSIGNMENT_APPROVAL"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_OUTBOUND = "ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_OUTBOUND"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_INBOUND = "ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_INBOUND"

export const ACCOUNT_PRIVILEGE_CREATE_ORDER = "ACCOUNT_PRIVILEGE_CREATE_ORDER"
export const ACCOUNT_PRIVILEGE_ORDER_APPROVAL = "ACCOUNT_PRIVILEGE_ORDER_APPROVAL"
export const ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC = "ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC"
export const ACCOUNT_PRIVILEGE_APPROVE_TS_PIC = "ACCOUNT_PRIVILEGE_APPROVE_TS_PIC"
export const ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT = "ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT"

export const ACCOUNT_PRIVILEGE_HOSPITALS_CRUD = "ACCOUNT_PRIVILEGE_HOSPITALS_CRUD"
export const ACCOUNT_PRIVILEGE_DOCTORS_CRUD = "ACCOUNT_PRIVILEGE_DOCTORS_CRUD"
export const ACCOUNT_PRIVILEGE_PRICING_CRUD = "ACCOUNT_PRIVILEGE_PRICING_CRUD"

export const ACCOUNT_PRIVILEGE_ASSIGN_DRIVER = "ACCOUNT_PRIVILEGE_ASSIGN_DRIVER"
export const ACCOUNT_PRIVILEGE_DELIVERY_OUTBOUND_APPROVAL = "ACCOUNT_PRIVILEGE_DELIVERY_OUTBOUND_APPROVAL"
export const ACCOUNT_PRIVILEGE_DELIVERY_INBOUND_APPROVAL = "ACCOUNT_PRIVILEGE_DELIVERY_INBOUND_APPROVAL"
export const ACCOUNT_PRIVILEGE_INPUT_SURGERY_STATUS = "ACCOUNT_PRIVILEGE_INPUT_SURGERY_STATUS"
export const ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS = "ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS"

export const ACCOUNT_PRIVILEGE_SALES_DASHBOARD_ACCESS = "ACCOUNT_PRIVILEGE_SALES_DASHBOARD_ACCESS"
export const ACCOUNT_PRIVILEGE_PUR_CRUD = "ACCOUNT_PRIVILEGE_PUR_CRUD"
export const ACCOUNT_PRIVILEGE_INVOICE_CREATION = "ACCOUNT_PRIVILEGE_INVOICE_CREATION"
export const ACCOUNT_PRIVILEGE_INVOICE_TRACKING = "ACCOUNT_PRIVILEGE_INVOICE_TRACKING"

export const ACCOUNT_PRIVILEGE_COMMISSION_DASHBOARD_ACCESS = "ACCOUNT_PRIVILEGE_COMMISSION_DASHBOARD_ACCESS"
export const ACCOUNT_PRIVILEGE_COMMISSION_CRUD = "ACCOUNT_PRIVILEGE_COMMISSION_CRUD"
export const ACCOUNT_PRIVILEGE_COMMISSION_APPROVAL = "ACCOUNT_PRIVILEGE_COMMISSION_APPROVAL"

export const ACCOUNT_PRIVILEGES = [
    {
        section: "Account Management",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_UPDATE_ADMIN,
                caption: "Edit Data Admin"
            },
            {
                name: ACCOUNT_PRIVILEGE_CUSTOMIZE_PRIVILEGE,
                caption: "Edit Privilege Akun"
            },
        ]
    },
    {
        section: "Warehouse",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD,
                caption: "Edit Item Gudang"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD,
                caption: "Edit Mutasi Item Gudang"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_ASSIGNMENT,
                caption: "Input Pembagian Item Gudang untuk Order"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_ASSIGNMENT_APPROVAL,
                caption: "Setujui Pembagian Item Gudang untuk Order"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_OUTBOUND,
                caption: "Setujui Pengeluaran Barang dari Gudang"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_ORDER_INBOUND,
                caption: "Setujui Penerimaan Barang Masuk Gudang"
            },
        ]
    },
    {
        section: "Order Management",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_CREATE_ORDER,
                caption: "Membuat Order Baru"
            },
            {
                name: ACCOUNT_PRIVILEGE_ORDER_APPROVAL,
                caption: "Setujui Delivery Order"
            },
            {
                name: ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC,
                caption: "Menunjuk Technical Support PIC"
            },
            {
                name: ACCOUNT_PRIVILEGE_APPROVE_TS_PIC,
                caption: "Setujui Technical Support PIC"
            },
            {
                name: ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT,
                caption: "Mengedit Delivery Order yang Berlangsung"
            },
        ]
    },
    {
        section: "Edit Data Stakeholder",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_HOSPITALS_CRUD,
                caption: "Edit Data Hospital"
            },
            {
                name: ACCOUNT_PRIVILEGE_DOCTORS_CRUD,
                caption: "Edit Data Dokter"
            },
            {
                name: ACCOUNT_PRIVILEGE_PRICING_CRUD,
                caption: "Edit Data Harga"
            },
        ]
    },
    {
        section: "Delivery, Tracking, Pickup",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_ASSIGN_DRIVER,
                caption: "Menunjuk Driver Delivery"
            },
            {
                name: ACCOUNT_PRIVILEGE_DELIVERY_OUTBOUND_APPROVAL,
                caption: "Setujui Pengeluaran Barang untuk Delivery"
            },
            {
                name: ACCOUNT_PRIVILEGE_DELIVERY_INBOUND_APPROVAL,
                caption: "Setujui Penerimaan Barang dari Pickup"
            },
            {
                name: ACCOUNT_PRIVILEGE_INPUT_SURGERY_STATUS,
                caption: "Update Status Operasi di Hospital"
            },
            {
                name: ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS,
                caption: "Unggah Data/Foto Tracking dan Update Status Delivery"
            },
        ]
    },
    {
        section: "Sales",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_SALES_DASHBOARD_ACCESS,
                caption: "Akses ke Sales Dashboard"
            },
            {
                name: ACCOUNT_PRIVILEGE_PUR_CRUD,
                caption: "Membuat dan Edit PUR"
            },
            {
                name: ACCOUNT_PRIVILEGE_INVOICE_CREATION,
                caption: "Mengeluarkan Invoice Baru"
            },
            {
                name: ACCOUNT_PRIVILEGE_INVOICE_TRACKING,
                caption: "Tracking Status Invoice"
            },
        ]
    },
    {
        section: "Komisi",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_COMMISSION_DASHBOARD_ACCESS,
                caption: "Akses ke Commission Dashboard"
            },
            {
                name: ACCOUNT_PRIVILEGE_COMMISSION_CRUD,
                caption: "Edit Data Komisi"
            },
            {
                name: ACCOUNT_PRIVILEGE_COMMISSION_APPROVAL,
                caption: "Setujui Pembagian Komisi"
            },
        ]
    },
]