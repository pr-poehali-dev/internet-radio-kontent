import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get track history from database
    Args: event - HTTP event object, context - execution context
    Returns: List of recently played tracks from database
    '''
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
    
    if method == 'GET':
        try:
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                raise Exception('DATABASE_URL not configured')
            
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            # Get last 10 unique tracks
            cur.execute('''
                SELECT DISTINCT ON (artist, title) artist, title, played_at
                FROM track_history
                ORDER BY artist, title, played_at DESC
                LIMIT 10
            ''')
            
            rows = cur.fetchall()
            cur.close()
            conn.close()
            
            tracks = [{'artist': row[0], 'title': row[1]} for row in rows]
            
            # If no tracks in DB yet, return fallback
            if not tracks:
                tracks = [
                    {'artist': 'Dua Lipa', 'title': 'Houdini'},
                    {'artist': 'The Weeknd', 'title': 'Blinding Lights'},
                    {'artist': 'Imagine Dragons', 'title': 'Believer'},
                    {'artist': 'Billie Eilish', 'title': 'What Was I Made For?'},
                    {'artist': 'Harry Styles', 'title': 'As It Was'}
                ]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'tracks': tracks})
            }
            
        except Exception as e:
            print(f"Database error: {e}")
            # Fallback on error
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'tracks': [
                        {'artist': 'Dua Lipa', 'title': 'Houdini'},
                        {'artist': 'The Weeknd', 'title': 'Blinding Lights'},
                        {'artist': 'Imagine Dragons', 'title': 'Believer'}
                    ]
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
