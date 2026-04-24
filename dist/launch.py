#!/usr/bin/env python3
"""
EXW3 XKernel Launcher
Launches the .xkernel file in a web browser
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import re
from pathlib import Path

PORT = 3000
XKERNEL_FILE = "exw3.xkernel"

class XKernelHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for serving .xkernel files"""
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/' or self.path == '/index.html':
            # Serve the .xkernel file directly
            self.path = '/' + XKERNEL_FILE
            
            # Check if .xkernel file exists
            if not os.path.exists(XKERNEL_FILE):
                self.send_error(404, f"{XKERNEL_FILE} not found")
                return
            
            # Read and parse .xkernel file
            try:
                with open(XKERNEL_FILE, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Extract HTML block from .xkernel format
                html_match = re.search(r'html\s*\{([\s\S]*)\}\s*$', content)
                
                if not html_match:
                    self.send_error(500, "Invalid .xkernel format: No html block found")
                    return
                
                html_content = html_match.group(1).strip()
                
                # Send HTML response
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.send_header('Content-Length', len(html_content.encode('utf-8')))
                self.end_headers()
                self.wfile.write(html_content.encode('utf-8'))
                
            except Exception as e:
                self.send_error(500, f"Error loading .xkernel: {str(e)}")
                return
        
        elif self.path == '/__mods_list__':
            # Auto-discovery endpoint: list all .ex3 files in mods folders
            try:
                import json
                mods_list = []
                
                # Read config to get folder structure
                config_path = 'mod-config.json'
                if os.path.exists(config_path):
                    with open(config_path, 'r', encoding='utf-8') as f:
                        config = json.load(f)
                        structure = config.get('structure', {})
                        mods_folder = structure.get('modsFolder', 'mods')
                        admin_folder = structure.get('adminFolder', 'mods/admin')
                else:
                    mods_folder = 'mods'
                    admin_folder = 'mods/admin'
                
                # Scan mods folder
                if os.path.exists(mods_folder):
                    for filename in os.listdir(mods_folder):
                        if filename.endswith('.ex3'):
                            mod_name = filename[:-4]  # Remove .ex3
                            mods_list.append({
                                'name': mod_name,
                                'path': f"{mods_folder}/{filename}"
                            })
                
                # Scan admin folder
                if os.path.exists(admin_folder):
                    for filename in os.listdir(admin_folder):
                        if filename.endswith('.ex3'):
                            mod_name = filename[:-4]  # Remove .ex3
                            mods_list.append({
                                'name': mod_name,
                                'path': f"{admin_folder}/{filename}"
                            })
                
                # Send JSON response
                json_data = json.dumps(mods_list)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Content-Length', len(json_data.encode('utf-8')))
                self.end_headers()
                self.wfile.write(json_data.encode('utf-8'))
                
            except Exception as e:
                self.send_error(500, f"Error listing mods: {str(e)}")
                return
        
        else:
            # Serve other files normally (mods, config, etc.)
            super().do_GET()
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    """Main launcher function"""
    # Check if .xkernel file exists
    if not os.path.exists(XKERNEL_FILE):
        print(f"❌ Error: {XKERNEL_FILE} not found!")
        print(f"   Make sure you're in the correct directory.")
        sys.exit(1)
    
    # Find available port
    port = PORT
    while port < PORT + 100:
        try:
            with socketserver.TCPServer(("", port), XKernelHandler) as httpd:
                print(f"\n🚀 EXW3 XKernel Launcher")
                print(f"📦 Serving: {XKERNEL_FILE}")
                print(f"🌐 Server: http://localhost:{port}")
                print(f"\n✓ Opening browser...")
                print(f"\nPress Ctrl+C to stop the server\n")
                
                # Open browser
                webbrowser.open(f"http://localhost:{port}")
                
                # Start server
                httpd.serve_forever()
        except OSError as e:
            # Address already in use (errno 48 on Mac, 98 on Linux, 10048 on Windows)
            if e.errno in (48, 98, 10048):
                port += 1
                continue
            else:
                print(f"❌ Error starting server: {e}")
                sys.exit(1)
        except KeyboardInterrupt:
            print(f"\n\n✓ Server stopped")
            sys.exit(0)

if __name__ == "__main__":
    main()
