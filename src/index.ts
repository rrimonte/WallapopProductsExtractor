import axios from "axios";
import fs from 'fs';
import { ItemsResponse } from "./types/product";

async function main()
{
    const userUrl = process.argv[2];
    if (userUrl == null || userUrl.length == 0)
    {
        console.log("Wallapop user URL not provided");
        return;
    }

    const baseUrl = "wallapop.com/app/user/";
    const parts = userUrl.split(baseUrl);
    if (parts.length < 2)
    {
        console.log("Wrong URL");
        return;
    }

    const username = parts[1].split("/")[0];
    const userId = username.split("-").pop();

    let nextUrlToken;
    
    fs.mkdirSync(`output`, { recursive: true });
    let productCount = 0;
    while (true)
    {
        const url = `https://api.wallapop.com/api/v3/users/${userId}/items${nextUrlToken == null ? '' : `?since=${nextUrlToken}`}`;
        const response  = await axios.get(url);
        const itemsResponse = response.data as ItemsResponse;

        for(const product of itemsResponse.data)
        {
            productCount++;
            console.log(`Product ${productCount}: ${product.title}`);

            // productFolder is output/ followed by the productCount (with three digits) - product id - product title url encoded
            const productFolder = `output/${productCount.toString().padStart(3, '0')}-${product.slug}`;
            fs.mkdirSync(productFolder, { recursive: true });
            fs.writeFileSync(`${productFolder}/info.json`, JSON.stringify(product, null, 4));
            fs.mkdirSync(`${productFolder}/images`, { recursive: true });
            for(const image of product.images)
            {
                const imageUrl = image.urls.big;
                const imageResponse = await axios.get(imageUrl, {responseType: 'arraybuffer'});
                fs.writeFileSync(`${productFolder}/images/${image.id}.jpg`, imageResponse.data);
            }

            const dataTXT = 
            [
                "Title: " + (product.title),
                "Description: " + (product.description),
                "Price: " + (product.price.amount + " " + product.price.currency),
                "Condition: " + (product.type_attributes?.condition?.value ?? "?"),
                "Weight: " + (product.type_attributes.up_to_kg == null ? "?" : (product.type_attributes.up_to_kg.value + " " + product.type_attributes.up_to_kg.title)),
                "Shipping: " + (product.shipping?.item_is_shippable ?? "false"),
                "Reserved: " + (product.reserved?.flag ?? "false")
            ]

            fs.writeFileSync(`${productFolder}/data.txt`, dataTXT.join("\n"));
        }

        nextUrlToken = itemsResponse.meta?.next;
        if (nextUrlToken == null)
        {
            break;
        }
    }
}

main();