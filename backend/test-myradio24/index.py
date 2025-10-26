import requests
import json
import struct
from typing import Optional, Dict, Any

def handler(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Test function to analyze myradio24.org stream metadata capabilities.
    
    This function:
    1. Fetches the m3u playlist
    2. Parses it to find the actual stream URL
    3. Tests for ICY metadata support
    4. Extracts current track info if available
    """
    
    station_id = event.get('queryStringParameters', {}).get('station', '54137')
    m3u_url = f"https://myradio24.org/{station_id}.m3u"
    
    results = {
        "station_id": station_id,
        "m3u_url": m3u_url,
        "stream_url": None,
        "icy_metadata_supported": False,
        "current_track": None,
        "error": None,
        "details": {}
    }
    
    try:
        # Step 1: Fetch the m3u playlist
        print(f"Fetching m3u playlist from: {m3u_url}")
        m3u_response = requests.get(m3u_url, timeout=10)
        m3u_response.raise_for_status()
        m3u_content = m3u_response.text
        
        results["details"]["m3u_content"] = m3u_content
        
        # Step 2: Parse m3u to find stream URL
        stream_url = None
        for line in m3u_content.split('\n'):
            line = line.strip()
            if line and not line.startswith('#'):
                stream_url = line
                break
        
        if not stream_url:
            results["error"] = "No stream URL found in m3u file"
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(results, indent=2)
            }
        
        results["stream_url"] = stream_url
        
        # Step 3: Test for ICY metadata support
        print(f"Testing ICY metadata on stream: {stream_url}")
        headers = {
            'Icy-MetaData': '1',
            'User-Agent': 'Mozilla/5.0'
        }
        
        stream_response = requests.get(stream_url, headers=headers, stream=True, timeout=10)
        
        # Check response headers
        response_headers = dict(stream_response.headers)
        results["details"]["stream_response_headers"] = response_headers
        
        # Check for ICY metadata interval
        icy_metaint = stream_response.headers.get('icy-metaint')
        icy_name = stream_response.headers.get('icy-name')
        icy_genre = stream_response.headers.get('icy-genre')
        icy_url = stream_response.headers.get('icy-url')
        
        if icy_metaint:
            results["icy_metadata_supported"] = True
            results["details"]["icy_metaint"] = icy_metaint
            results["details"]["icy_name"] = icy_name
            results["details"]["icy_genre"] = icy_genre
            results["details"]["icy_url"] = icy_url
            
            # Step 4: Try to extract current track metadata
            try:
                metaint = int(icy_metaint)
                
                # Read audio data chunk
                audio_data = stream_response.raw.read(metaint)
                
                # Read metadata length byte
                meta_length_byte = stream_response.raw.read(1)
                if meta_length_byte:
                    meta_length = struct.unpack('B', meta_length_byte)[0] * 16
                    
                    if meta_length > 0:
                        # Read metadata
                        metadata = stream_response.raw.read(meta_length)
                        metadata_str = metadata.decode('utf-8', errors='ignore').rstrip('\x00')
                        
                        results["details"]["raw_metadata"] = metadata_str
                        
                        # Parse StreamTitle
                        if 'StreamTitle=' in metadata_str:
                            title_start = metadata_str.find("StreamTitle='") + 13
                            title_end = metadata_str.find("';", title_start)
                            if title_end == -1:
                                title_end = len(metadata_str)
                            
                            stream_title = metadata_str[title_start:title_end]
                            results["current_track"] = stream_title
                            
                            # Try to parse artist - title
                            if ' - ' in stream_title:
                                parts = stream_title.split(' - ', 1)
                                results["details"]["artist"] = parts[0].strip()
                                results["details"]["title"] = parts[1].strip()
                    else:
                        results["details"]["metadata_note"] = "Metadata length is 0"
            
            except Exception as e:
                results["details"]["metadata_extraction_error"] = str(e)
        else:
            results["icy_metadata_supported"] = False
            results["details"]["note"] = "Stream does not support ICY metadata"
        
        # Close the stream
        stream_response.close()
        
        # Try alternative: Check if myradio24 has a JSON API
        try:
            api_url = f"https://myradio24.org/api/nowplaying/{station_id}"
            api_response = requests.get(api_url, timeout=5)
            if api_response.status_code == 200:
                results["details"]["api_endpoint"] = api_url
                results["details"]["api_response"] = api_response.json()
        except:
            pass
        
        # Try another common pattern
        try:
            stats_url = f"https://myradio24.org/api/station/{station_id}/stats"
            stats_response = requests.get(stats_url, timeout=5)
            if stats_response.status_code == 200:
                results["details"]["stats_endpoint"] = stats_url
                results["details"]["stats_response"] = stats_response.json()
        except:
            pass
            
    except Exception as e:
        results["error"] = str(e)
        import traceback
        results["details"]["traceback"] = traceback.format_exc()
    
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(results, indent=2)
    }
