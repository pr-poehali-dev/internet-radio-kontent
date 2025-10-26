"""
Business: Получает текущий трек из ICY метаданных потока myradio24
Args: event с httpMethod
Returns: JSON с artist и title
"""
import json
import urllib.request
import struct
from typing import Dict, Any, Optional

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
            'isBase64Encoded': False,
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        m3u_url = 'https://myradio24.org/54137.m3u'
        req = urllib.request.Request(m3u_url)
        with urllib.request.urlopen(req, timeout=5) as response:
            m3u_content = response.read().decode('utf-8')
        
        stream_url = None
        for line in m3u_content.split('\n'):
            line = line.strip()
            if line and not line.startswith('#'):
                stream_url = line
                break
        
        if not stream_url:
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'artist': 'КонтентМедиаPRO', 'title': 'Радио вещает'})
            }
        
        req = urllib.request.Request(stream_url)
        req.add_header('Icy-MetaData', '1')
        req.add_header('User-Agent', 'Mozilla/5.0')
        
        with urllib.request.urlopen(req, timeout=5) as response:
            icy_metaint = response.headers.get('icy-metaint')
            
            if icy_metaint:
                metaint = int(icy_metaint)
                audio_data = response.read(metaint)
                meta_length_byte = response.read(1)
                
                if meta_length_byte:
                    meta_length = struct.unpack('B', meta_length_byte)[0] * 16
                    
                    if meta_length > 0:
                        metadata = response.read(meta_length).decode('utf-8', errors='ignore').rstrip('\x00')
                        
                        if 'StreamTitle=' in metadata:
                            title_start = metadata.find("StreamTitle='") + 13
                            title_end = metadata.find("';", title_start)
                            if title_end == -1:
                                title_end = len(metadata)
                            
                            stream_title = metadata[title_start:title_end]
                            
                            if ' - ' in stream_title:
                                parts = stream_title.split(' - ', 1)
                                artist = parts[0].strip()
                                title = parts[1].strip()
                            else:
                                artist = 'КонтентМедиаPRO'
                                title = stream_title
                            
                            return {
                                'statusCode': 200,
                                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                                'isBase64Encoded': False,
                                'body': json.dumps({'artist': artist, 'title': title}, ensure_ascii=False)
                            }
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'artist': 'КонтентМедиаPRO', 'title': 'В эфире'})
        }
        
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'artist': 'КонтентМедиаPRO', 'title': 'Радио вещает'})
        }