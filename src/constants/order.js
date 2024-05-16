export const ORDER_TYPE_REQUEST_ORDER = "Request Order"
export const ORDER_TYPE_DELIVERY_ORDER = "Delivery Order"
export const ORDER_TYPE_DELIVERY_ORDER_IMPLANT = "DO Implant & BHP"
export const ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT = "DO Instrument & Unit"

export const DELIVERY_ORDER_NUMBER_DEFAULT_FORMAT = "%NUMBER%/ALV/DO/%MONTH%/%YEAR%"
export const DELIVERY_ORDER_READ_PARENT = "Lihat Delivery Order Induk"

export const DELIVERY_ORDER_STATUS_CREATED = "DELIVERY_ORDER_STATUS_CREATED"
export const DELIVERY_ORDER_STATUS_ALL_APPROVED = "DELIVERY_ORDER_STATUS_ALL_APPROVED"
export const DELIVERY_ORDER_STATUS_RECEIVED_AT_HOSPITAL = "DELIVERY_ORDER_STATUS_RECEIVED_AT_HOSPITAL"
export const DELIVERY_ORDER_STATUS_SURGERY_ONGOING = "DELIVERY_ORDER_STATUS_SURGERY_ONGOING"
export const DELIVERY_ORDER_STATUS_SURGERY_FINISHED = "DELIVERY_ORDER_STATUS_SURGERY_FINISHED"

export const DeliveryOrderStatusOrder = [
    {
        name: DELIVERY_ORDER_STATUS_CREATED,
        caption: "Baru Dibuat",
    },
    {
        name: DELIVERY_ORDER_STATUS_ALL_APPROVED,
        caption: ""
    }
]

export const RequestOrderFilters = [
    {
        name: "",
        caption: "Semua Request Order"
    },
    {
        name: "pending",
        caption: "Belum Ditinjau"
    },
    {
        name: "approved",
        caption: "Sudah Disetujui"
    },
]

export const DeliveryOrderType = [
    {
        name: "",
        caption: "---Pilih Jenis Delivery Order---"
    },
    {
        name: "all",
        caption: "Semua Jenis Delivery Order"
    },
    {
        name: "implant",
        caption: "Delivery Order Implant & BHP"
    },
    {
        name: "instrument",
        caption: "Delivery Order Instrument & Unit"
    },
]

export const DeliveryOrderFilters = [
    {
        name: "",
        caption: "---Pilih Status Delivery Order---"
    },
    {
        name: "pending",
        caption: "Belum Ditinjau"
    },
    {
        name: "approved",
        caption: "Sudah Disetujui"
    },
]