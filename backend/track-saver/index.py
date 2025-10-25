import json
import os
from typing import Dict, Any
import psycopg2
import urllib.request

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Fetch current track and save to database history
    Args: event - HTTP event, context - execution context
    Returns: Success status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                raise Exception('DATABASE_URL not configured')
            
            # Fetch current track from track-info function
            req = urllib.request.Request(
                'https://functions.poehali.dev/a74bc916-c4b8-4156-8eaa-650265cf0145',
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                artist = data.get('artist')
                title = data.get('title')
                
                if not artist or not title:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'status': 'skipped', 'reason': 'no track info'})
                    }
                
                # Save to database
                conn = psycopg2.connect(database_url)
                cur = conn.cursor()
                
                # Insert track (ignore if already exists with same timestamp)
                cur.execute(
                    "INSERT INTO track_history (artist, title) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (artist, title)
                )
                
                conn.commit()
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'status': 'saved',
                        'artist': artist,
                        'title': title
                    })
                }
                
        except Exception as e:
            print(f"Error: {e}")
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
