interface Product {
    id: string;
    title: string;
    description: string;
    category_id: string;
    slug: string;
    images: Image[];
    price: Price;
    type_attributes: TypeAttributes;
    reserved: Reserved;
    shipping: Shipping;
}

interface Image {
    id: string;
    average_color: string;
    urls: Urls;
}

interface Urls {
    small: string;
    medium: string;
    big: string;
}

interface Price {
    amount: number;
    currency: string;
}

interface TypeAttributes {
    condition: AttributeDetail;
    up_to_kg: AttributeDetail;
}

interface AttributeDetail {
    value: string;
    title: string;
    text: string;
    icon_text: string;
}

interface Reserved {
    flag: boolean;
}

interface Shipping {
    item_is_shippable: boolean;
    user_allows_shipping: boolean;
    cost_configuration_id: string;
}

export interface ItemsResponse 
{
    data: Product[];
    meta: {
        next: string;
    }
}
