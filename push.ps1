$git = "C:\Program Files\Git\cmd\git.exe"
& $git init
& $git config user.name "SENOID Bot"
& $git config user.email "bot@senoid.local"
& $git add .
& $git commit -m "Initial commit for SENOID Homepage"
& $git branch -M main
& $git remote add origin https://gyumeeroh-byte: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@github.com/gyumeeroh-byte/senoid.git
& $git push -u origin main
