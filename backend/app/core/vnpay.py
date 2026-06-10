import hashlib
import hmac
import urllib.parse
from app.core.config import settings

class VNPay:
    def __init__(self):
        self.tmn_code = settings.VNPAY_TMN_CODE
        self.hash_secret = settings.VNPAY_HASH_SECRET
        self.payment_url = settings.VNPAY_PAYMENT_URL
        self.return_url = settings.VNPAY_RETURN_URL

    def get_payment_url(self, vnp_params: dict) -> str:
        """
        Builds the VNPay payment URL from the provided parameters.
        """
        vnp_params['vnp_TmnCode'] = self.tmn_code
        vnp_params['vnp_ReturnUrl'] = self.return_url
        vnp_params['vnp_Version'] = '2.1.0'
        vnp_params['vnp_Command'] = 'pay'
        
        # Sort parameters by key
        sorted_params = sorted(vnp_params.items())
        
        # Build query string
        query_string_list = []
        for key, val in sorted_params:
            if val is not None and str(val).strip() != "":
                # Using quote_plus to safely encode values
                query_string_list.append(f"{key}={urllib.parse.quote_plus(str(val))}")
        
        query_string = "&".join(query_string_list)
        
        # Compute HMAC SHA512 hash
        hash_value = hmac.new(
            self.hash_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()
        
        return f"{self.payment_url}?{query_string}&vnp_SecureHash={hash_value}"

    def validate_response(self, query_params: dict) -> bool:
        """
        Validates the signature of the response from VNPay.
        """
        if 'vnp_SecureHash' not in query_params:
            return False
            
        vnp_secure_hash = query_params.pop('vnp_SecureHash')
        if 'vnp_SecureHashType' in query_params:
            query_params.pop('vnp_SecureHashType')
            
        # Remove any empty values or None
        filtered_params = {k: v for k, v in query_params.items() if v is not None and str(v).strip() != ""}
        
        # Sort parameters by key
        sorted_params = sorted(filtered_params.items())
        
        # Build query string
        query_string_list = []
        for key, val in sorted_params:
            # When receiving, we need to carefully construct the query string similar to sending
            query_string_list.append(f"{key}={urllib.parse.quote_plus(str(val))}")
            
        query_string = "&".join(query_string_list)
        
        # Compute HMAC SHA512 hash
        hash_value = hmac.new(
            self.hash_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()
        
        return hash_value == vnp_secure_hash

vnpay_helper = VNPay()
