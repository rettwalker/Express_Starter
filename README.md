
POST : `/api/order/process`

```
{
    "orderNumber": "W225656570",
    "shipmentNumber": "101663234",
    "orderType": "300",
    "storeNumber": "9735",
    "preferredLocation":"SD-001",
    "orderLines": [{
        "skuNumber": "1000473973",
        "qty": 1
    }]
}
```


POST : `/api/order/directedLocation`

```
{
    "orderNumber": "W225656570",
    "shipmentNumber": "101663234",
    "storeNumber": "9735",
    "partiallyPicked":false
    "preferredLocation":"SD-001",
    "orderLines": [{
        "skuNumber": "1000473973",
    }]
}
```