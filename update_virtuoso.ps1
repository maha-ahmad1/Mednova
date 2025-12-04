$lines = Get-Content "c:\Users\MSI GF\mednova\src\features\chat\ui\ChatInterface.tsx" -Encoding UTF8
$newLines = @()

for ($i = 0; $i -lt $lines.Count; $i++) {
    $lineNum = $i + 1
    
    if ($lineNum -eq 1664) {
        # Skip the old comment
        continue
    }
    elseif ($lineNum -eq 1665) {
        # Replace atTopThreshold={100}
        $newLines += "  // ✅ عند الوصول للأعلى (فقط تحديث state - التحميل يحدث في useEffect)"
        $newLines += "  atTopThreshold={200}"
        continue
    }
    elseif ($lineNum -eq 1666) {
        # Replace atTopStateChange
        $newLines += "  atTopStateChange={(atTop) => {"
        $newLines += "    if (atTop) {"
        $newLines += '      console.log("⬆️ المستخدم وصل للأعلى - سيتم التحميل التلقائي");'
        $newLines += "      setIsAtTop(true);"
        $newLines += "    } else {"
        $newLines += "      setIsAtTop(false);"
        $newLines += "    }"
        $newLines += "  }}"
        $newLines += "  "
        $newLines += "  // ✅ تتبع حالة الوصول للأسفل"
        $newLines += "  atBottomStateChange={(atBottom) => {"
        $newLines += '    console.log("📍 atBottomStateChange:", atBottom);'
        $newLines += "    setIsAtBottom(atBottom);"
        $newLines += "  }}"
        continue
    }
    elseif ($lineNum -ge 1667 -and $lineNum -le 1682) {
        # Skip old lines until we reach increaseViewportBy
        if ($lines[$i] -match 'increaseViewportBy') {
            $newLines += $lines[$i]
        }
        continue
    }
    elseif ($lineNum -eq 1683) {
        # This should be increaseViewportBy, already added above
        continue
    }
    elseif ($lineNum -eq 1684) {
        # Skip old comment
        continue
    }
    elseif ($lineNum -eq 1685) {
        # Replace endReached
        $newLines += "  // ✅ تجاهل endReached"
        $newLines += "  endReached={() => {"
        $newLines += '    console.log("⬇️ وصلنا للأسفل (أحدث الرسائل)");'
        $newLines += "  }}"
        continue
    }
    elseif ($lineNum -eq 1686) {
        # Skip "// لا تفعل شيئاً هنا"
        continue
    }
    elseif ($lineNum -eq 1687) {
        # Skip empty line
        continue
    }
    elseif ($lineNum -eq 1688) {
        # Replace followOutput comment
        $newLines += "  "
        $newLines += "  // ✅ المتابعة التلقائية للأسفل"
        continue
    }
    elseif ($lineNum -eq 1689) {
        # Replace followOutput="auto"
        $newLines += '  followOutput={shouldFollowOutput ? "auto" : false}'
        continue
    }
    else {
        $newLines += $lines[$i]
    }
}

Set-Content "c:\Users\MSI GF\mednova\src\features\chat\ui\ChatInterface.tsx" -Value $newLines -Encoding UTF8
Write-Host "✅ تم التحديث بنجاح!"
