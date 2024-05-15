export const ACCOUNT_PRIVILEGE_UPDATE_ADMIN = "ACCOUNT_PRIVILEGE_UPDATE_ADMIN"
export const ACCOUNT_PRIVILEGE_CUSTOMIZE_PRIVILEGE = "ACCOUNT_PRIVILEGE_CUSTOMIZE_PRIVILEGE"

export const ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD = "ACCOUNT_PRIVILEGE_WAREHOUSE_CRUD"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD = "ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD"

export const ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT = "ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT = "ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT = "ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT = "ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT"

export const ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT_RETURN = "ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT_RETURN"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT_RETURN = "ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT_RETURN"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT_RETURN = "ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT_RETURN"
export const ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT_RETURN = "ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT_RETURN"

export const ACCOUNT_PRIVILEGE_CREATE_ORDER = "ACCOUNT_PRIVILEGE_CREATE_ORDER"
export const ACCOUNT_PRIVILEGE_ORDER_APPROVAL = "ACCOUNT_PRIVILEGE_ORDER_APPROVAL"
export const ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC = "ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC"
export const ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT = "ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT"

export const ACCOUNT_PRIVILEGE_HOSPITALS_CRUD = "ACCOUNT_PRIVILEGE_HOSPITALS_CRUD"
export const ACCOUNT_PRIVILEGE_DOCTORS_CRUD = "ACCOUNT_PRIVILEGE_DOCTORS_CRUD"
export const ACCOUNT_PRIVILEGE_PRICING_CRUD = "ACCOUNT_PRIVILEGE_PRICING_CRUD"

export const ACCOUNT_PRIVILEGE_ASSIGN_DRIVER = "ACCOUNT_PRIVILEGE_ASSIGN_DRIVER"
export const ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS = "ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS"

export const ACCOUNT_PRIVILEGE_SALES_DASHBOARD_ACCESS = "ACCOUNT_PRIVILEGE_SALES_DASHBOARD_ACCESS"
export const ACCOUNT_PRIVILEGE_PUR_CRUD = "ACCOUNT_PRIVILEGE_PUR_CRUD"
export const ACCOUNT_PRIVILEGE_SALES_APPROVAL = "ACCOUNT_PRIVILEGE_SALES_APPROVAL"
export const ACCOUNT_PRIVILEGE_INVOICE_CREATION = "ACCOUNT_PRIVILEGE_INVOICE_CREATION"
export const ACCOUNT_PRIVILEGE_INVOICE_TRACKING = "ACCOUNT_PRIVILEGE_INVOICE_TRACKING"

export const ACCOUNT_PRIVILEGE_COMMISSION_DASHBOARD_ACCESS = "ACCOUNT_PRIVILEGE_COMMISSION_DASHBOARD_ACCESS"
export const ACCOUNT_PRIVILEGE_COMMISSION_VIEW_SELF = "ACCOUNT_PRIVILEGE_COMMISSION_VIEW_SELF"
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
                caption: "Edit Item Gudang dan Data Produk"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_MUTATION_CRUD,
                caption: "Edit Mutasi Item Gudang"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT,
                caption: "Input DO Implant & BHP dan Dokumentasi (Barang Keluar)"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT,
                caption: "Input DO Instrument & Unit dan Dokumentasi (Barang Keluar)"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT,
                caption: "Setujui DO Implant & BHP (Barang Keluar)" 
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT,
                caption: "Setujui DO Instrument & Unit (Barang Keluar)"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_IMPLANT_RETURN,
                caption: "Input DO Implant & BHP dan Dokumentasi (Barang Kembali)"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_CREATE_DELIVERY_ORDER_INSTRUMENT_RETURN,
                caption: "Input DO Instrument & Unit dan Dokumentasi (Barang Kembali)"
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_IMPLANT_RETURN,
                caption: "Setujui DO Implant & BHP (Barang Kembali)" 
            },
            {
                name: ACCOUNT_PRIVILEGE_WAREHOUSE_APPROVE_DELIVERY_ORDER_INSTRUMENT_RETURN,
                caption: "Setujui DO Instrument & Unit (Barang Kembali)"
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
                caption: "Setujui / Feedback Request Order dan Produk"
            },
            {
                name: ACCOUNT_PRIVILEGE_ASSIGN_TS_PIC,
                caption: "Menunjuk Technical Support PIC"
            },
            {
                name: ACCOUNT_PRIVILEGE_DELIVERY_ORDER_EDIT,
                caption: "Mengedit Delivery Order yang Berlangsung"
            },
        ]
    },
    {
        section: "Edit Master Data",
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
        section: "Delivery dan Pickup",
        privileges: [
            {
                name: ACCOUNT_PRIVILEGE_ASSIGN_DRIVER,
                caption: "Menunjuk Driver Delivery"
            },
            {
                name: ACCOUNT_PRIVILEGE_INPUT_DELIVERY_TRACKING_STATUS,
                caption: "Unggah Data/Foto Tracking dan Update Status Delivery dan Pickup"
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
                caption: "Input dan Edit Sales"
            },
            {
                name: ACCOUNT_PRIVILEGE_SALES_APPROVAL,
                caption: "Setujui Input Sales"
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
                name: ACCOUNT_PRIVILEGE_COMMISSION_VIEW_SELF,
                caption: "Lihat Data Komisi Potensial Sendiri"
            },
            {
                name: ACCOUNT_PRIVILEGE_COMMISSION_APPROVAL,
                caption: "Review Data Komisi dan Bonus"
            },
        ]
    },
]