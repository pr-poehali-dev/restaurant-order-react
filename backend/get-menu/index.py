'''
Business: Get restaurant menu with all dishes
Args: event - dict with httpMethod, queryStringParameters
      context - object with request_id, function_name attributes
Returns: HTTP response with dishes list
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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    params = event.get('queryStringParameters', {}) or {}
    category = params.get('category')
    
    if category:
        cur.execute(
            "SELECT id, name, description, price, old_price, image, category FROM t_p30410520_restaurant_order_rea.dishes WHERE category = %s ORDER BY id",
            (category,)
        )
    else:
        cur.execute(
            "SELECT id, name, description, price, old_price, image, category FROM t_p30410520_restaurant_order_rea.dishes ORDER BY id"
        )
    
    rows = cur.fetchall()
    dishes = []
    for row in rows:
        dish = {
            'id': str(row[0]),
            'name': row[1],
            'description': row[2],
            'price': float(row[3]),
            'image': row[5],
            'category': row[6]
        }
        if row[4]:
            dish['oldPrice'] = float(row[4])
        dishes.append(dish)
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'dishes': dishes}),
        'isBase64Encoded': False
    }
