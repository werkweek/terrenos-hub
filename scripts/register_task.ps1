$taskName = "TerrenosHub_AutoSync"
$scriptPath = "C:\Users\webut\.gemini\antigravity-ide\scratch\terrenos-app\scripts\run_silent.vbs"

# Also add a shortcut directly to Windows Startup folder so it triggers whenever the PC turns on!
$startupFolder = [System.Environment]::GetFolderPath('Startup')
$shortcutPath = Join-Path $startupFolder "TerrenosHub_AutoSync.lnk"

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = "`"$scriptPath`""
$Shortcut.WorkingDirectory = "C:\Users\webut\.gemini\antigravity-ide\scratch\terrenos-app"
$Shortcut.Description = "Sincronizacion automatica de Terrenos Hub al iniciar PC"
$Shortcut.Save()

Write-Host "✅ Acceso directo agregado a Windows Startup: $shortcutPath"

# Register daily 9:00 AM task via schtasks
$command = "schtasks.exe /create /tn $taskName /tr `"wscript.exe `\`"$scriptPath`\`"`" /sc DAILY /st 09:00 /f"
Invoke-Expression $command

Write-Host "✅ Tarea programada registrada."
