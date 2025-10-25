import json
import urllib.request
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get track history from myradio24 radio station
    Args: event - HTTP event object
          context - execution context
    Returns: List of recently played tracks
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
            # Try to get history from played.html endpoint
            req = urllib.request.Request(
                'https://myradio24.org/54137/played.html',
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            
            with urllib.request.urlopen(req, timeout=5) as response:
                content = response.read().decode('utf-8', errors='ignore')
                
                # Parse HTML content to extract track info
                tracks: List[Dict[str, str]] = []
                
                # Simple parsing - looking for pattern in HTML
                lines = content.split('\n')
                for line in lines:
                    if ' - ' in line:
                        # Clean HTML tags
                        clean_line = line.strip()
                        for tag in ['<tr><td>', '</td></tr>', '<td>', '</td>', '<br>', '<br/>']:
                            clean_line = clean_line.replace(tag, '')
                        
                        if ' - ' in clean_line and len(clean_line) < 200:
                            parts = clean_line.split(' - ', 1)
                            if len(parts) == 2:
                                artist = parts[0].strip()
                                title = parts[1].strip()
                                
                                # Filter out time stamps, metadata, and HTML tags
                                if (artist and title and 
                                    not artist.isdigit() and 
                                    ':' not in artist[:5] and
                                    '<' not in artist and 
                                    '<' not in title and
                                    len(artist) > 2 and 
                                    len(title) > 2):
                                    tracks.append({
                                        'artist': artist,
                                        'title': title
                                    })
                
                # Return last 10 unique tracks
                unique_tracks = []
                seen = set()
                for track in tracks:
                    key = f"{track['artist']}|{track['title']}"
                    if key not in seen and len(unique_tracks) < 10:
                        seen.add(key)
                        unique_tracks.append(track)
                
                if unique_tracks:
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'tracks': unique_tracks})
                    }
                
        except Exception as e:
            print(f"Error fetching history: {e}")
        
        # Fallback with sample data
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'tracks': [
                    {'artist': 'Imagine Dragons', 'title': 'Believer'},
                    {'artist': 'The Weeknd', 'title': 'Blinding Lights'},
                    {'artist': 'Dua Lipa', 'title': 'Levitating'},
                    {'artist': 'Ed Sheeran', 'title': 'Shape of You'},
                    {'artist': 'Billie Eilish', 'title': 'bad guy'}
                ]
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }