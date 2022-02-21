import { ProductInfo, VendorAccount, VendorInfo, WarehousingItem2, WarehousingSheetItem, WsStoreInfo } from "apis/warehousingAPI"
import { numberTextFormat } from "utils/general"

export function warehousingSheetItemToWarehousingItem2(item: WarehousingSheetItem){
    let vendorAccount:VendorAccount = {
        id: -1,
        account_number: "",
        account_holder: "",
        bank: ""
    }
    let wsStoreInfo: WsStoreInfo = {
        id: -1,
        name: "",
        building: "",
        floor: "",
        col: "",
        loc: "",
        ext: ""
    }
    let vendorInfo: VendorInfo= {
        id: item.vendor_id,
        ws_store: wsStoreInfo,
        vendor_code:"",
        vendor_name: item.vendor_name,
        vendor_address: "",
        vendor_account: vendorAccount
    }

    let productInfo: ProductInfo = {
        id: item.product_id,
        product_code: "",
        name: item.product_name,
        vendor_product_name: item.vendor_product_name,
        price: item.product_price,
        option: item.product_option
    }
    
    let warehousingItem2: WarehousingItem2 =  {
        id: item.item_id,
        sheet_id: item.sheet_id,
        rt_store_id: item.rt_store_id,
        count:item.product_count,
        price: item.product_price,
        is_vat_included:false,
        memo:"",
        vendor_info: vendorInfo,
        product_info:productInfo,
        is_inactive:false 
    }
    
    return warehousingItem2
}


export function warehousingItem2ToBulkUpdateItem(item: WarehousingItem2){
    let bulkUpdateItem = {
        id: item.id,
        is_inactive:item.is_inactive ,
        count:item.count 
    }

    return bulkUpdateItem
}
    

    // return{
    //     id: item.item_id,
    //     sheet_id: item.sheet_id,
    //     rt_store_id: item.rt_store_id,
    //     count:item.product_count,
    //     price: item.product_price,
    //     is_vat_included:false,
    //     memo:"",
    //     vendor_info: vendorInfo,
    //     product_info:productInfo
    // }
