$ErrorActionPreference = 'Stop'

Write-Host "=== 1. Health Check ===" -ForegroundColor Cyan
$h = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/health'
$h | ConvertTo-Json -Depth 3

Write-Host "`n=== 2. Get All Tutors ===" -ForegroundColor Cyan
$allTutors = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/tutors'
Write-Host "Total tutores encontrados: $($allTutors.count)"
foreach ($t in $allTutors.data) {
    Write-Host " - $($t.fullName) [$($t.subjectName)] -> `$$($t.pricePerHour) USD/h (Rating: $($t.rating))"
}

Write-Host "`n=== 3. Get Tutor By ID (1) ===" -ForegroundColor Cyan
$t1 = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/tutors/1'
Write-Host "Tutor individual: $($t1.data.fullName) - Especialidad: $($t1.data.subjectName)"

Write-Host "`n=== 4. Login User (Student Demo) ===" -ForegroundColor Cyan
$loginPayload = @{
    email = 'alumno@educonnect.com'
    password = 'password123'
} | ConvertTo-Json
$auth = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/auth/login' -Method Post -Body $loginPayload -ContentType 'application/json'
Write-Host "Usuario autenticado: $($auth.data.user.fullName) (Rol: $($auth.data.user.role))"
$token = $auth.data.token

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "`n=== 5. Create Booking ===" -ForegroundColor Cyan
$bookingPayload = @{
    tutorId = '1'
    subject = 'Cálculo Multivariable & Integrales'
    scheduledAt = (Get-Date).AddDays(2).ToString('o')
    durationHours = 1
    modality = 'online'
    notes = 'Preparación para el examen parcial'
} | ConvertTo-Json
$bookingRes = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/bookings' -Method Post -Body $bookingPayload -Headers $headers -ContentType 'application/json'
Write-Host "Reserva creada con éxito: ID $($bookingRes.data.id)"
Write-Host " - Materia: $($bookingRes.data.subject)"
Write-Host " - Total: `$$($bookingRes.data.totalPrice) USD"
Write-Host " - Estado: $($bookingRes.data.status)"

Write-Host "`n=== 6. Get My Bookings ===" -ForegroundColor Cyan
$myBookings = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/bookings/my-bookings' -Headers $headers
Write-Host "Reservas del estudiante: $($myBookings.count) encontradas"

Write-Host "`n=== 7. Wallet Balance & Transactions ===" -ForegroundColor Cyan
$wallet = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/wallet/balance' -Headers $headers
Write-Host "Saldo actual: `$$($wallet.data.balance) USD"
Write-Host "Historial de transacciones: $($wallet.data.transactions.Count)"

Write-Host "`n=== 8. Recharge Wallet ===" -ForegroundColor Cyan
$rechargePayload = @{
    amount = 50
    method = 'Tarjeta Visa 4022'
} | ConvertTo-Json
$rechargeRes = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/wallet/recharge' -Method Post -Body $rechargePayload -Headers $headers -ContentType 'application/json'
Write-Host "Nuevo saldo tras recarga: `$$($rechargeRes.data.newBalance) USD"
Write-Host "Comprobante: $($rechargeRes.data.transaction.id) - $($rechargeRes.data.transaction.concept)"

Write-Host "`n🎉 ¡TODAS LAS PRUEBAS DE LA ARQUITECTURA LIMPIA COMPLETADAS CON ÉXITO!" -ForegroundColor Green
