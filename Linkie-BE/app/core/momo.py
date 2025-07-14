import hashlib
import hmac
import json
import requests
from datetime import datetime

def create_momo_url(request, amount: int, txn_ref: str):
    endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
    partner_code = "MomoTest"
    access_key = "F8BBA842ECF85"
    secret_key = "K951B6PE1waDMi640xX08PD3vg6EkVlz"

    redirect_url = "http://localhost:8000/payment/momo-callback"
    ipn_url = "http://localhost:8000/payment/momo-callback"
    order_info = f"Thanh toan don hang {txn_ref}"
    request_id = txn_ref
    order_id = txn_ref
    request_type = "captureWallet"
    extra_data = ""

    # Chuỗi để ký
    raw_signature = f"accessKey={access_key}&amount={amount}&extraData={extra_data}&ipnUrl={ipn_url}&orderId={order_id}&orderInfo={order_info}&partnerCode={partner_code}&redirectUrl={redirect_url}&requestId={request_id}&requestType={request_type}"
    
    # Ký HMAC SHA256
    signature = hmac.new(
        bytes(secret_key, 'utf-8'),
        bytes(raw_signature, 'utf-8'),
        hashlib.sha256
    ).hexdigest()

    body = {
        "partnerCode": partner_code,
        "accessKey": access_key,
        "requestId": request_id,
        "amount": str(amount),
        "orderId": order_id,
        "orderInfo": order_info,
        "redirectUrl": redirect_url,
        "ipnUrl": ipn_url,
        "extraData": extra_data,
        "requestType": request_type,
        "signature": signature,
        "lang": "vi"
    }

    response = requests.post(endpoint, json=body)
    return response.json().get("payUrl", "")
