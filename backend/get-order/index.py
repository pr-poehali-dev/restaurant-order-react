'''
Business: Get order status and details by order ID
Args: event - dict with httpMethod, queryStringParameters containing orderId
      context - object with request_id, function_name attributes
Returns: HTTP response with order details
'''
import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    order_id = params.get('orderId')
    
    if not order_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing orderId parameter'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, customer_name, customer_phone, customer_email, total_amount, status, created_at FROM t_p30410520_restaurant_order_rea.orders WHERE id = %s",
        (int(order_id),)
    )
    row = cur.fetchone()
    
    if not row:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Order not found'}),
            'isBase64Encoded': False
        }
    
    order = {
        'id': row[0],
        'customerName': row[1],
        'customerPhone': row[2],
        'customerEmail': row[3],
        'totalAmount': float(row[4]),
        'status': row[5],
        'createdAt': row[6].isoformat()
    }
    
    cur.execute(
        "SELECT dish_id, dish_name, quantity, price FROM t_p30410520_restaurant_order_rea.order_items WHERE order_id = %s",
        (int(order_id),)
    )
    items_rows = cur.fetchall()
    
    items = []
    for item_row in items_rows:
        items.append({
            'dishId': str(item_row[0]),
            'dishName': item_row[1],
            'quantity': item_row[2],
            'price': float(item_row[3])
        })
    
    order['items'] = items
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'order': order}),
        'isBase64Encoded': False
    }
