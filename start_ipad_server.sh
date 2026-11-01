#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
PORT=8085

echo ""
echo "================================================================"
echo "🦖 신비한 동물·공룡·곤충 탐험대 (나는 누구일까요? & 진짜 vs 가짜!)"
echo "================================================================"
echo ""
echo "📱 [아이패드 / 태블릿 접속 방법]"
echo "   아이패드가 Mac과 같은 Wi-Fi에 연결되어 있는지 확인한 후,"
echo "   아이패드 Safari 주소창에 아래 주소를 입력하세요:"
echo ""
echo "   👉 http://${LOCAL_IP}:${PORT}"
echo ""
echo "💻 [Mac 브라우저 접속 주소]"
echo "   👉 http://localhost:${PORT}"
echo ""
echo "서버를 종료하려면 터미널에서 Ctrl + C 를 누르세요."
echo "================================================================"
echo ""

python3 -m http.server ${PORT}
