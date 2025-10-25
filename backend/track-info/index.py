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
            # Try multiple endpoints
            endpoints = [
                'https://myradio24.org/54137/stats',
                'https://myradio24.org/54137/7.html',
                'https://myradio24.org/api/54137'
            ]
            
            for endpoint in endpoints:
                try:
                    req = urllib.request.Request(
                        endpoint,
                        headers={'User-Agent': 'Mozilla/5.0'}
                    )
                    
                    with urllib.request.urlopen(req, timeout=3) as response:
                        content = response.read().decode('utf-8', errors='ignore')
                        print(f"Response from {endpoint}: {content[:200]}")
                        
                        # Try to parse as JSON
                        try:
                            data = json.loads(content)
                            # Look for track info in various possible fields
                            title_full = (
                                data.get('title') or 
                                data.get('song') or 
                                data.get('current_track') or
                                data.get('icestats', {}).get('source', {}).get('title')
                            )
                            
                            if title_full and ' - ' in str(title_full):
                                parts = str(title_full).split(' - ', 1)
                                return {
                                    'statusCode': 200,
                                    'headers': {
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': '*'
                                    },
                                    'isBase64Encoded': False,
                                    'body': json.dumps({
                                        'artist': parts[0].strip(),
                                        'title': parts[1].strip()
                                    })
                                }
                        except json.JSONDecodeError:
                            # Try HTML parsing for 7.html
                            if '7.html' in endpoint and ',' in content:
                                parts = content.split(',')
                                if len(parts) >= 7:
                                    title_full = parts[6].strip()
                                    if ' - ' in title_full:
                                        track_parts = title_full.split(' - ', 1)
                                        return {
                                            'statusCode': 200,
                                            'headers': {
                                                'Content-Type': 'application/json',
                                                'Access-Control-Allow-Origin': '*'
                                            },
                                            'isBase64Encoded': False,
                                            'body': json.dumps({
                                                'artist': track_parts[0].strip(),
                                                'title': track_parts[1].strip()
                                            })
                                        }
                except Exception as e:
                    print(f"Error with {endpoint}: {e}")
                    continue
            
            # Fallback
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
