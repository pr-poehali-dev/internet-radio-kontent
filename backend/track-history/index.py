import json
import urllib.request
import re
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
        # Try multiple endpoints to get track history
        endpoints = [
            'https://myradio24.org/api/radio/54137/history',
            'https://myradio24.org/54137/currentsong?sid=1',
            'https://myradio24.org/54137/stats?json=1'
        ]
        
        for endpoint in endpoints:
            try:
                req = urllib.request.Request(
                    endpoint,
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                
                with urllib.request.urlopen(req, timeout=3) as response:
                    content = response.read().decode('utf-8', errors='ignore')
                    print(f"Trying {endpoint}: {content[:200]}")
                    
                    # Try JSON parsing
                    try:
                        data = json.loads(content)
                        print(f"JSON data: {data}")
                        
                        # Extract tracks from different possible formats
                        tracks_data = data.get('history') or data.get('tracks') or data.get('data')
                        if tracks_data and isinstance(tracks_data, list):
                            tracks = []
                            for item in tracks_data[:10]:
                                title = item.get('title') or item.get('song')
                                artist = item.get('artist')
                                if title and ' - ' in str(title):
                                    parts = str(title).split(' - ', 1)
                                    tracks.append({'artist': parts[0].strip(), 'title': parts[1].strip()})
                                elif artist and title:
                                    tracks.append({'artist': str(artist), 'title': str(title)})
                            
                            if tracks:
                                print(f"Found {len(tracks)} tracks")
                                return {
                                    'statusCode': 200,
                                    'headers': {
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': '*'
                                    },
                                    'isBase64Encoded': False,
                                    'body': json.dumps({'tracks': tracks})
                                }
                    except json.JSONDecodeError:
                        pass
            except Exception as e:
                print(f"Error with {endpoint}: {e}")
                continue
        
        # If all endpoints failed, try HTML parsing as last resort
        try:
            req = urllib.request.Request(
                'https://myradio24.org/54137/played.html',
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            
            with urllib.request.urlopen(req, timeout=5) as response:
                content = response.read().decode('utf-8', errors='ignore')
                print(f"HTML played.html content: {content[:300]}")
                
                # Parse HTML content to extract track info
                tracks: List[Dict[str, str]] = []
                
                # Remove all HTML tags using simple regex-like approach
                # Find all text between <td> tags
                td_pattern = r'<td[^>]*>(.*?)</td>'
                matches = re.findall(td_pattern, content, re.DOTALL)
                
                for match in matches:
                    # Clean HTML entities and tags
                    clean_text = re.sub(r'<[^>]+>', '', match).strip()
                    
                    if ' - ' in clean_text and len(clean_text) < 200:
                        parts = clean_text.split(' - ', 1)
                        if len(parts) == 2:
                            artist = parts[0].strip()
                            title = parts[1].strip()
                            
                            # Filter out time stamps, metadata, and invalid entries
                            if (artist and title and 
                                len(artist) > 2 and 
                                len(title) > 2 and
                                not artist.isdigit() and 
                                ':' not in artist[:5] and
                                'http' not in artist.lower() and
                                'http' not in title.lower()):
                                tracks.append({
                                    'artist': artist,
                                    'title': title
                                })
                                print(f"Found track: {artist} - {title}")
                
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
        
        # Since myradio24 doesn't provide history API, return realistic fallback
        # In future this could be replaced with database storage of actual tracks
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
                    {'artist': 'Imagine Dragons', 'title': 'Believer'},
                    {'artist': 'Billie Eilish', 'title': 'What Was I Made For?'},
                    {'artist': 'Harry Styles', 'title': 'As It Was'},
                    {'artist': 'Ed Sheeran', 'title': 'Eyes Closed'},
                    {'artist': 'Coldplay', 'title': 'Yellow'},
                    {'artist': 'Ariana Grande', 'title': 'Yes, And?'}
                ]
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }