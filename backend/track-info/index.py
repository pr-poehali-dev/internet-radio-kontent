import json
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get current track information from myradio24
    Args: event - HTTP event object
          context - execution context
    Returns: Track artist and title
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
            'body': ''
        }
    
    if method == 'GET':
        try:
            req = urllib.request.Request(
                'https://myradio24.org/54137/status-json.xsl',
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            
            with urllib.request.urlopen(req, timeout=5) as response:
                result = json.loads(response.read().decode('utf-8'))
                print(f"Status JSON Response: {result}")
                
                icestats = result.get('icestats', {})
                source = icestats.get('source', {})
                
                title_full = source.get('title', 'КонтентМедиаPRO - В эфире')
                
                if ' - ' in title_full:
                    parts = title_full.split(' - ', 1)
                    artist = parts[0].strip()
                    title = parts[1].strip()
                else:
                    artist = 'КонтентМедиаPRO'
                    title = title_full
                
                track_data = {
                    'artist': artist,
                    'title': title
                }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(track_data)
                }
        except Exception as e:
            print(f"Error: {e}")
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'artist': 'КонтентМедиаPRO',
                    'title': 'В эфире'
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }