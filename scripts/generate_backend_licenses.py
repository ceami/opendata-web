#!/usr/bin/env python3
"""
백엔드 라이선스 정보를 생성(자동+수동 병합)하는 스크립트
"""
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any

def get_python_packages() -> List[Dict[str, Any]]:
    """pip freeze를 사용하여 설치된 패키지 정보를 가져옵니다."""
    try:
        result = subprocess.run([sys.executable, '-m', 'pip', 'freeze'],
                                capture_output=True, text=True, check=True)
        packages = []
        for line in result.stdout.strip().split('\n'):
            if line and '==' in line:
                name, version = line.split('==', 1)
                packages.append({
                    'name': name,
                    'version': version,
                    'type': 'python'
                })
        return packages
    except subprocess.CalledProcessError as e:
        print(f"Error getting Python packages: {e}")
        return []

def get_uv_packages() -> List[Dict[str, Any]]:
    """uv를 사용하여 설치된 패키지 정보를 가져옵니다."""
    try:
        result = subprocess.run(['uv', 'pip', 'list', '--format', 'json'],
                                capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)
        packages = []
        for package in data:
            packages.append({
                'name': package['name'],
                'version': package['version'],
                'type': 'python'
            })
        return packages
    except (subprocess.CalledProcessError, FileNotFoundError, json.JSONDecodeError):
        return get_python_packages()

def get_package_license_info(package_name: str) -> Dict[str, str]:
    """패키지의 라이선스 정보를 가져옵니다."""
    try:
        result = subprocess.run([sys.executable, '-m', 'pip', 'show', package_name],
                                capture_output=True, text=True, check=True)
        info = {}
        for line in result.stdout.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                if key in ['home-page', 'author', 'license']:
                    info[key] = value
        return info
    except subprocess.CalledProcessError:
        return {}

def load_manual_licenses(manual_path="scripts/backend_licenses_extra.json") -> List[Dict[str, Any]]:
    """수동 라이선스 항목을 로드합니다."""
    manual_file = Path(manual_path)
    if manual_file.exists():
        with open(manual_file, "r", encoding="utf-8") as f:
            manual = json.load(f)
            return manual.get("packages", [])
    return []

def generate_backend_licenses():
    """백엔드 라이선스 정보를 생성합니다."""
    print("백엔드 라이선스 정보를 생성 중...")

    # uv 또는 pip를 사용하여 패키지 목록 가져오기
    packages = get_uv_packages()
    if not packages:
        print("설치된 Python 패키지를 찾을 수 없습니다.")
        return

    import datetime
    licenses_data = {
        'generated_at': datetime.datetime.now().isoformat(),
        'packages': []
    }

    # 자동 패키지 정보 추가
    for package in packages:
        print(f"처리 중: {package['name']}")
        license_info = get_package_license_info(package['name'])
        package_data = {
            'name': package['name'],
            'version': package['version'],
            'type': 'python',
            'homepage': license_info.get('home-page', ''),
            'author': license_info.get('author', ''),
            'license': license_info.get('license', 'Unknown')
        }
        licenses_data['packages'].append(package_data)

    # 수동(extra) 패키지 정보 추가
    manual_licenses = load_manual_licenses()
    licenses_data['packages'].extend(manual_licenses)

    # public 디렉토리에 저장
    output_path = Path('public/backend_licenses.json')
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(licenses_data, f, indent=2, ensure_ascii=False)

    print(f"백엔드 라이선스 정보가 {output_path}에 저장되었습니다.")
    print(f"총 {len(licenses_data['packages'])}개의 패키지가 처리되었습니다.")

if __name__ == '__main__':
    generate_backend_licenses()
