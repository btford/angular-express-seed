@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\nodemon\nodemon.js" %*
) ELSE (
  node  "%~dp0\..\nodemon\nodemon.js" %*
)