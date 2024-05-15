export const ORDER_TYPE_REQUEST_ORDER = "Request Order"
export const ORDER_TYPE_DELIVERY_ORDER = "Delivery Order"
export const ORDER_TYPE_DELIVERY_ORDER_IMPLANT = "DO Implant & BHP"
export const ORDER_TYPE_DELIVERY_ORDER_INSTRUMENT = "DO Instrument & Unit"

export const DELIVERY_ORDER_NUMBER_DEFAULT_FORMAT = "%NUMBER%/ALV/DO/%MONTH%/%YEAR%"

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