import json
import urllib.request
from typing import Dict, Any
import struct

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get current track from Icecast stream metadata
    Args: event - HTTP event, context - execution context
    Returns: Current track artist and title from stream
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
            stream_url = 'https://myradio24.org/54137'
            
            req = urllib.request.Request(
                stream_url,
                headers={
                    'Icy-MetaData': '1',
                    'User-Agent': 'Mozilla/5.0'
                }
            )
            
            with urllib.request.urlopen(req, timeout=5) as response:
                headers = response.headers
                metaint_header = headers.get('icy-metaint')
                
                if metaint_header:
                    metaint = int(metaint_header)
                    
                    # Skip audio data
                    response.read(metaint)
                    
                    # Read metadata length
                    meta_length_byte = response.read(1)
                    if meta_length_byte:
                        meta_length = struct.unpack('B', meta_length_byte)[0] * 16
                        
                        if meta_length > 0:
                            # Read metadata
                            metadata = response.read(meta_length).decode('utf-8', errors='ignore').strip('\x00')
                            
                            # Parse StreamTitle
                            if "StreamTitle='" in metadata:
                                start = metadata.index("StreamTitle='") + 13
                                end = metadata.index("';", start)
                                stream_title = metadata[start:end]
                                
                                # Split artist - title
                                if ' - ' in stream_title:
                                    parts = stream_title.split(' - ', 1)
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
        except Exception as e:
            print(f"Error fetching metadata: {e}")
        
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
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
