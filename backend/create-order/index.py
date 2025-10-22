'''
Business: Create new restaurant order
Args: event - dict with httpMethod, body containing order data
      context - object with request_id, function_name attributes
Returns: HTTP response with order id and status
'''
import json
import os
import psycopg2
from typing import Dict, Any
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    customer_name = body_data.get('customerName')
    customer_phone = body_data.get('customerPhone')
    customer_email = body_data.get('customerEmail', '')
    items = body_data.get('items', [])
    
    if not customer_name or not customer_phone or not items:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    total_amount = sum(Decimal(str(item['price'])) * item['quantity'] for item in items)
    
    cur.execute(
        "INSERT INTO t_p30410520_restaurant_order_rea.orders (customer_name, customer_phone, customer_email, total_amount, status) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (customer_name, customer_phone, customer_email, total_amount, 'pending')
    )
    order_id = cur.fetchone()[0]
    
    for item in items:
        cur.execute(
            "INSERT INTO t_p30410520_restaurant_order_rea.order_items (order_id, dish_id, dish_name, quantity, price) VALUES (%s, %s, %s, %s, %s)",
            (order_id, int(item['id']), item['name'], item['quantity'], Decimal(str(item['price'])))
        )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'orderId': order_id,
            'status': 'pending',
            'message': 'Order created successfully'
        }),
        'isBase64Encoded': False
    }
